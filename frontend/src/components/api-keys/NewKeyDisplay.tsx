'use client';

import { Card } from '@/components/ui/card';

interface NewKeyDisplayProps {
  apiKey: string;
  installCode: string;
  onCopyKey: () => void;
  onCopyCode: () => void;
  onClose: () => void;
}

export default function NewKeyDisplay({
  apiKey,
  installCode,
  onCopyKey,
  onCopyCode,
  onClose,
}: NewKeyDisplayProps) {
  return (
    <Card className="p-6 bg-success/5 border-2 border-success/30">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold mb-1">✅ API Key Created!</h3>
          <p className="text-sm text-muted-foreground">
            Copy this key now - you won&apos;t be able to see it again for security reasons.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      </div>
      <Card className="p-4 mb-4 bg-card">
        <code className="text-sm font-mono break-all">{apiKey}</code>
      </Card>
      <div className="flex space-x-3">
        <button onClick={onCopyKey} className="btn btn-primary">
          📋 Copy Key
        </button>
        <button onClick={onCopyCode} className="btn btn-secondary">
          📋 Copy Installation Code
        </button>
      </div>
    </Card>
  );
}
