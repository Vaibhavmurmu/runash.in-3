'use client';

import { Card } from '@/components/ui/card';
import { Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AgentMessageProps {
  message: Message;
}

export function AgentMessage({ message }: AgentMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn('flex gap-3', {
        'flex-row-reverse': isUser,
      })}
    >
      <div
        className={cn(
          'flex-shrink-0 mt-1',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        )}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </div>
      </div>

      <div className={cn('flex-1 max-w-xs lg:max-w-md', { 'lg:max-w-lg': !isUser })}>
        <Card
          className={cn(
            'p-3 rounded-lg',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <span className="text-xs opacity-70 mt-2 block">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </Card>
      </div>
    </div>
  );
}
