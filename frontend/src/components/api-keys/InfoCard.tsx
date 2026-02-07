'use client';

import { Card } from '@/components/ui/card';

export default function InfoCard() {
  return (
    <Card className="p-4 bg-primary/5 border-primary/20">
      <div className="flex items-start space-x-3">
        <span className="text-2xl">🔑</span>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">What are API keys?</h3>
          <p className="text-sm text-muted-foreground">
            API keys authenticate tracking requests from your website. Generate a key, add it to your website&apos;s code, and start collecting analytics data. Keep your keys secure!
          </p>
        </div>
      </div>
    </Card>
  );
}
