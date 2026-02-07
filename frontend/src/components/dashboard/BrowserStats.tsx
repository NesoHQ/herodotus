'use client';

import { Card } from '@/components/ui/card';
import type { RealtimeStats } from '@/types';

interface BrowserStatsProps {
  realtimeStats: RealtimeStats | null;
}

export default function BrowserStats({ realtimeStats }: BrowserStatsProps) {
  const hasData = Object.keys(realtimeStats?.browsers || {}).length > 0;
  const total = Object.values(realtimeStats?.browsers || {}).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Browsers</h2>
      {hasData ? (
        <div className="space-y-3">
          {Object.entries(realtimeStats?.browsers || {})
            .sort(([, a], [, b]) => b - a)
            .map(([browser, count]) => {
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={browser}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{browser}</span>
                    <span className="text-sm text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="text-3xl mb-2">🌐</div>
            <p className="text-sm">No browser data</p>
          </div>
        </div>
      )}
    </Card>
  );
}
