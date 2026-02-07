'use client';

import { Card } from '@/components/ui/card';
import EmptyState from '@/components/ui/EmptyState';
import type { RealtimeStats } from '@/types';

interface TopReferrersProps {
  realtimeStats: RealtimeStats | null;
}

export default function TopReferrers({ realtimeStats }: TopReferrersProps) {
  const hasData = (realtimeStats?.top_referrers?.length || 0) > 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Top Referrers</h2>
        <span className="text-sm text-muted-foreground">Traffic sources</span>
      </div>
      {hasData ? (
        <div className="space-y-3">
          {realtimeStats?.top_referrers?.slice(0, 5).map((ref, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm">
                  {i + 1}
                </div>
                <span className="text-sm truncate font-medium">
                  {ref.referrer || '🔗 Direct Traffic'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">{ref.hits}</span>
                <span className="text-xs text-muted-foreground">visits</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔗"
          title="No referrer data"
          description="Traffic sources will appear here once visitors arrive"
        />
      )}
    </Card>
  );
}
