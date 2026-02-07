'use client';

import { Card } from '@/components/ui/card';
import type { APIKey } from '@/types';

interface APIKeyCardProps {
  apiKey: APIKey;
  onCopy: (text: string) => void;
  onViewCode: (key: string) => void;
  onRevoke: (id: string) => void;
}

export default function APIKeyCard({ apiKey, onCopy, onViewCode, onRevoke }: APIKeyCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <code className="bg-muted px-4 py-2 rounded-lg text-sm font-mono flex-1 break-all">
              {apiKey.key}
            </code>
            <button
              onClick={() => onCopy(apiKey.key)}
              className="text-primary hover:text-primary/80 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span> {new Date(apiKey.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Domains:</span> {apiKey.domain_ids.length}
            </div>
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span className={apiKey.revoked ? 'text-error' : 'text-success'}>
                {apiKey.revoked ? '❌ Revoked' : '✅ Active'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onViewCode(apiKey.key)}
            className="btn btn-secondary text-sm"
          >
            📖 View Code
          </button>
          <button
            onClick={() => onRevoke(apiKey.id)}
            className="text-error hover:text-error/80 px-3 py-2 rounded-lg hover:bg-error/10 transition-colors"
            disabled={apiKey.revoked}
          >
            {apiKey.revoked ? 'Revoked' : '🗑️ Revoke'}
          </button>
        </div>
      </div>
    </Card>
  );
}
