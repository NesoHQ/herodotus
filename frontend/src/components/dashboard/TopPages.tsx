'use client';

import { Card } from '@/components/ui/card';
import EmptyState from '@/components/ui/EmptyState';
import type { RealtimeStats } from '@/types';

interface TopPagesProps {
  realtimeStats: RealtimeStats | null;
}

export default function TopPages({ realtimeStats }: TopPagesProps) {
  const hasData = (realtimeStats?.top_pages?.length || 0) > 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Top Pages</h2>
        <span className="text-sm text-muted-foreground">Most visited</span>
      </div>
      {hasData ? (
        <div className="space-y-3">
          {realtimeStats?.top_pages?.slice(0, 5).map((page, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm">
                  {i + 1}
                </div>
                <span className="text-sm truncate font-medium">{page.path}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold">{page.hits}</span>
                <span className="text-xs text-muted-foreground">views</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📄"
          title="No page data"
          description="Page views will appear here once you start tracking"
        />
      )}
    </Card>
  );
}
