'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import type { RealtimeStats } from '@/types';

interface DeviceStatsProps {
  realtimeStats: RealtimeStats | null;
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function DeviceStats({ realtimeStats }: DeviceStatsProps) {
  const hasData = Object.keys(realtimeStats?.devices || {}).length > 0;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Devices</h2>
      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={Object.entries(realtimeStats?.devices || {}).map(([name, value]) => ({
                  name,
                  value,
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {Object.entries(realtimeStats?.devices || {}).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {Object.entries(realtimeStats?.devices || {}).map(([device, count], i) => (
              <div key={device} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span>{device}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="text-3xl mb-2">📱</div>
            <p className="text-sm">No device data</p>
          </div>
        </div>
      )}
    </Card>
  );
}
