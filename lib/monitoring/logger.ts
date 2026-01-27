import { redis } from '@/lib/queue/message-queue';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export type LogEntry = {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
  conversationId?: string;
  duration?: number;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
};

export type Metric = {
  id: string;
  timestamp: string;
  name: string;
  value: number;
  unit: string;
  tags?: Record<string, string>;
};

/**
 * Comprehensive logging and monitoring service
 * Handles logs, metrics, performance tracking, and error reporting
 */

class Logger {
  private service: string;
  private logBuffer: LogEntry[] = [];
  private bufferSize = 100;
  private flushInterval = 30000; // 30 seconds

  constructor(service: string) {
    this.service = service;
    this.startFlushTimer();
  }

  private startFlushTimer() {
    setInterval(() => {
      this.flush().catch(console.error);
    }, this.flushInterval);
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): LogEntry {
    return {
      id: `${this.service}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      context,
    };
  }

  debug(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('debug', message, context);
    this.logBuffer.push(entry);
    this.checkBuffer();
    console.debug(`[${this.service}]`, message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('info', message, context);
    this.logBuffer.push(entry);
    this.checkBuffer();
    console.log(`[${this.service}]`, message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    const entry = this.createLogEntry('warn', message, context);
    this.logBuffer.push(entry);
    this.checkBuffer();
    console.warn(`[${this.service}]`, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      ...this.createLogEntry('error', message, context),
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            code: (error as NodeJS.ErrnoException).code,
          }
        : undefined,
    };
    this.logBuffer.push(entry);
    this.checkBuffer();
    console.error(`[${this.service}]`, message, error, context);
  }

  critical(message: string, error?: Error, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      ...this.createLogEntry('critical', message, context),
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            code: (error as NodeJS.ErrnoException).code,
          }
        : undefined,
    };
    this.logBuffer.push(entry);
    // Critical logs are flushed immediately
    this.flush().catch(console.error);
    console.error(`[CRITICAL] [${this.service}]`, message, error, context);
  }

  private checkBuffer() {
    if (this.logBuffer.length >= this.bufferSize) {
      this.flush().catch(console.error);
    }
  }

  private async flush() {
    if (this.logBuffer.length === 0) return;

    const batch = this.logBuffer.splice(0, this.logBuffer.length);
    try {
      for (const entry of batch) {
        await redis.zadd('logs', {
          score: Date.now(),
          member: JSON.stringify(entry),
        });
      }
    } catch (error) {
      console.error('Failed to flush logs:', error);
      // Re-add to buffer on failure
      this.logBuffer.unshift(...batch);
    }
  }

  async getLogs(
    filter?: {
      level?: LogLevel;
      service?: string;
      startTime?: Date;
      endTime?: Date;
      limit?: number;
    }
  ): Promise<LogEntry[]> {
    const limit = filter?.limit || 100;
    try {
      const logs = await redis.zrange('logs', 0, limit - 1, { rev: true });
      return logs
        .map((log) => JSON.parse(log as string) as LogEntry)
        .filter((log) => {
          if (filter?.level && log.level !== filter.level) return false;
          if (filter?.service && log.service !== filter.service) return false;
          return true;
        });
    } catch (error) {
      console.error('Failed to retrieve logs:', error);
      return [];
    }
  }
}

class Metrics {
  private metrics: Map<string, Metric[]> = new Map();
  private metricsBuffer: Metric[] = [];
  private bufferSize = 100;

  recordMetric(name: string, value: number, unit = 'ms', tags?: Record<string, string>) {
    const metric: Metric = {
      id: `${name}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      name,
      value,
      unit,
      tags,
    };

    this.metricsBuffer.push(metric);

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metric);

    if (this.metricsBuffer.length >= this.bufferSize) {
      this.flush().catch(console.error);
    }
  }

  private async flush() {
    if (this.metricsBuffer.length === 0) return;

    const batch = this.metricsBuffer.splice(0, this.metricsBuffer.length);
    try {
      for (const metric of batch) {
        await redis.zadd('metrics', {
          score: Date.now(),
          member: JSON.stringify(metric),
        });
      }
    } catch (error) {
      console.error('Failed to flush metrics:', error);
    }
  }

  getMetric(name: string): Metric[] {
    return this.metrics.get(name) || [];
  }

  async getMetricStats(name: string): Promise<{ avg: number; min: number; max: number; count: number } | null> {
    const metrics = this.getMetric(name);
    if (metrics.length === 0) return null;

    const values = metrics.map((m) => m.value);
    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    };
  }
}

// Error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, context?: Record<string, unknown>): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'INTERNAL_ERROR', 500, {
      ...context,
      originalError: error.message,
    });
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', 500, context);
}

// Export singleton instances
export const logger = {
  agent: new Logger('agent'),
  api: new Logger('api'),
  database: new Logger('database'),
  stream: new Logger('stream'),
  security: new Logger('security'),
};

export const metrics = new Metrics();

// Performance tracking utility
export function createPerformanceTracker(name: string) {
  const startTime = Date.now();
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  if (typeof performance !== 'undefined') {
    performance.mark(startMark);
  }

  return {
    end: () => {
      const duration = Date.now() - startTime;
      if (typeof performance !== 'undefined') {
        performance.mark(endMark);
        try {
          performance.measure(name, startMark, endMark);
        } catch {
          // Ignore measure errors
        }
      }
      metrics.recordMetric(name, duration, 'ms');
      return duration;
    },
  };
}
