'use client';

import type { RealtimeStats, OverviewStats } from '@/types';
import StatCard from '@/components/ui/StatCard';

interface MetricsCardsProps {
  realtimeStats: RealtimeStats | null;
  overviewStats: OverviewStats | null;
}

export default function MetricsCards({ realtimeStats, overviewStats }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Active Visitors"
        value={realtimeStats?.active_visitors || 0}
        icon="👥"
        description="Currently browsing your site"
      />
      <StatCard
        title="Total Page Views"
        value={(overviewStats?.total_hits || 0).toLocaleString()}
        icon="📄"
        description="All time page views"
      />
      <StatCard
        title="Unique Visitors"
        value={(overviewStats?.unique_visitors || 0).toLocaleString()}
        icon="🎯"
        description="Last 24 hours"
      />
      <StatCard
        title="Bounce Rate"
        value={`${(overviewStats?.bounce_rate || 0).toFixed(1)}%`}
        icon="📉"
        description="Visitors who left immediately"
      />
    </div>
  );
}
