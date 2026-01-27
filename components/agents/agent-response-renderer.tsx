'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentResponse, AgentAction } from '@/lib/agents/types';

interface AgentResponseRendererProps {
  response: AgentResponse;
  isLoading?: boolean;
}

export function AgentResponseRenderer({
  response,
  isLoading,
}: AgentResponseRendererProps) {
  return (
    <div className="space-y-4">
      {/* Agent Status */}
      <div className="flex items-center gap-2">
        <Badge variant={response.status === 'success' ? 'default' : 'secondary'}>
          {response.status}
        </Badge>
        {response.agent && (
          <Badge variant="outline">{response.agent}</Badge>
        )}
      </div>

      {/* Actions Taken */}
      {response.actions && response.actions.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 text-sm">Actions Taken</h4>
          <div className="space-y-2">
            {response.actions.map((action, idx) => (
              <ActionItem key={idx} action={action} />
            ))}
          </div>
        </Card>
      )}

      {/* Main Response */}
      {response.response && (
        <Card className="p-4 bg-muted/50">
          <p className="text-sm whitespace-pre-wrap">{response.response}</p>
        </Card>
      )}

      {/* Reasoning */}
      {response.reasoning && (
        <Card className="p-4 border-dashed">
          <details className="cursor-pointer">
            <summary className="font-semibold text-sm">Reasoning Process</summary>
            <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
              {response.reasoning}
            </p>
          </details>
        </Card>
      )}

      {/* Metadata */}
      {response.metadata && (
        <div className="text-xs text-muted-foreground space-y-1">
          {response.metadata.processingTime && (
            <p>Processing time: {response.metadata.processingTime}ms</p>
          )}
          {response.metadata.tokensUsed && (
            <p>Tokens used: {response.metadata.tokensUsed}</p>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 bg-current rounded-full animate-pulse" />
          Processing...
        </div>
      )}
    </div>
  );
}

function ActionItem({ action }: { action: AgentAction }) {
  return (
    <div className="border-l-2 border-primary pl-3 py-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {action.type}
        </Badge>
        <span className="font-mono text-xs">{action.tool}</span>
      </div>
      {action.input && (
        <pre className="mt-1 text-xs bg-background p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(action.input, null, 2)}
        </pre>
      )}
      {action.output && (
        <pre className="mt-1 text-xs bg-background p-2 rounded overflow-auto max-h-32">
          {typeof action.output === 'string'
            ? action.output
            : JSON.stringify(action.output, null, 2)}
        </pre>
      )}
    </div>
  );
}
