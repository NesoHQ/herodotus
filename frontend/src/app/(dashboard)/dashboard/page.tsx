'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRealtimeStats, getOverviewStats, getDomains, getAPIKeys } from '@/lib/api';
import type { RealtimeStats, OverviewStats, Domain } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import GettingStarted from '@/components/onboarding/GettingStarted';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import Alert from '@/components/ui/Alert';

export default function DashboardPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAPIKeys, setHasAPIKeys] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      loadStats();
      const interval = setInterval(() => {
        loadStats();
        setLastUpdate(new Date());
      }, 5000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDomain]);

  const loadInitialData = async () => {
    try {
      const [domainsRes, keysRes] = await Promise.all([
        getDomains(),
        getAPIKeys(),
      ]);
      
      setDomains(domainsRes.data || []);
      setHasAPIKeys((keysRes.data || []).length > 0);
      
      if (domainsRes.data && domainsRes.data.length > 0) {
        setSelectedDomain(domainsRes.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setDomains([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!selectedDomain) return;

    try {
      const [realtime, overview] = await Promise.all([
        getRealtimeStats(selectedDomain),
        getOverviewStats(selectedDomain),
      ]);
      
      // Convert UTC times to local timezone
      if (realtime.data?.hits_per_minute) {
        realtime.data.hits_per_minute = realtime.data.hits_per_minute.map(item => {
          // Parse the UTC time and convert to local
          const [hours, minutes] = item.minute.split(':');
          const utcDate = new Date();
          utcDate.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          // Format in local time
          const localTime = utcDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
          
          return {
            ...item,
            minute: localTime
          };
        });
      }
      
      setRealtimeStats(realtime.data);
      setOverviewStats(overview.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const hasTrackedEvents = (overviewStats?.total_hits || 0) > 0;

  const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon="🌐"
          title="Welcome to Krakens Analytics!"
          description="Get started by adding your first domain. Once you add a domain and install the tracking code, you'll see real-time analytics here."
          action={{
            label: '+ Add Your First Domain',
            onClick: () => router.push('/domains'),
          }}
        />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 bg-primary/5">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Real-Time Analytics</h3>
            <p className="text-sm text-muted-foreground">Track visitors, page views, and user behavior in real-time</p>
          </Card>
          <Card className="text-center p-6 bg-accent/5">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">Privacy-First</h3>
            <p className="text-sm text-muted-foreground">IP anonymization and GDPR-compliant tracking</p>
          </Card>
          <Card className="text-center p-6 bg-success/5">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Lightweight SDK</h3>
            <p className="text-sm text-muted-foreground">Less than 5KB tracking script, no impact on performance</p>
          </Card>
        </div>
      </div>
    );
  }

  const selectedDomainData = domains.find(d => d.id === selectedDomain);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights for your website traffic</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="input w-64"
          >
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.domain} {domain.verified ? '✓' : '(Unverified)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Getting Started Guide */}
      <GettingStarted
        hasDomains={domains.length > 0}
        hasAPIKeys={hasAPIKeys}
        hasTrackedEvents={hasTrackedEvents}
      />

      {/* No Data Alert */}
      {!hasTrackedEvents && (
        <Alert
          type="info"
          title="No data yet"
          message="Install the tracking code on your website to start collecting analytics. Go to API Keys to generate your tracking key."
        />
      )}

      {/* Key Metrics */}
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

      {/* Traffic Chart */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Traffic Overview
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Page views per minute (last 60 minutes)</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-primary">Live</span>
            </div>
          </div>
        </div>
        {(realtimeStats?.hits_per_minute?.length || 0) > 0 ? (
          <div className="relative">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart 
                data={realtimeStats?.hits_per_minute || []}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-border/50" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="minute" 
                  className="text-muted-foreground"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  interval="preserveStartEnd"
                  minTickGap={50}
                />
                <YAxis 
                  className="text-muted-foreground"
                  style={{ fontSize: '11px' }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
                    color: 'hsl(var(--popover-foreground))',
                    padding: '12px 16px'
                  }}
                  labelStyle={{ 
                    fontWeight: 600,
                    marginBottom: '4px',
                    color: 'hsl(var(--foreground))'
                  }}
                  itemStyle={{
                    color: 'hsl(var(--primary))',
                    fontWeight: 500
                  }}
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hits" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: 'hsl(var(--primary))',
                    stroke: 'hsl(var(--background))',
                    strokeWidth: 3
                  }}
                  fill="url(#colorHits)"
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Stats Summary Below Chart */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {realtimeStats?.hits_per_minute?.reduce((sum, item) => sum + item.hits, 0) || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Total Hits (60min)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.max(...(realtimeStats?.hits_per_minute?.map(item => item.hits) || [0]))}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Peak Traffic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {((realtimeStats?.hits_per_minute?.reduce((sum, item) => sum + item.hits, 0) || 0) / 60).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Avg per Minute</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-50">📊</div>
              <p className="text-lg font-medium text-muted-foreground mb-2">No traffic data yet</p>
              <p className="text-sm text-muted-foreground/70">Data will appear here once visitors start browsing your site</p>
            </div>
          </div>
        )}
      </Card>

      {/* Top Pages and Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Top Pages</h2>
            <span className="text-sm text-muted-foreground">Most visited</span>
          </div>
          {(realtimeStats?.top_pages?.length || 0) > 0 ? (
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

        {/* Top Referrers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Top Referrers</h2>
            <span className="text-sm text-muted-foreground">Traffic sources</span>
          </div>
          {(realtimeStats?.top_referrers?.length || 0) > 0 ? (
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
      </div>

      {/* Device, Browser, and Country Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Devices</h2>
          {Object.keys(realtimeStats?.devices || {}).length > 0 ? (
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

        {/* Browsers */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Browsers</h2>
          {Object.keys(realtimeStats?.browsers || {}).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(realtimeStats?.browsers || {})
                .sort(([, a], [, b]) => b - a)
                .map(([browser, count]) => {
                  const total = Object.values(realtimeStats?.browsers || {}).reduce((a, b) => a + b, 0);
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

        {/* Countries */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Countries</h2>
          {Object.keys(realtimeStats?.countries || {}).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(realtimeStats?.countries || {})
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([country, count]) => {
                  const total = Object.values(realtimeStats?.countries || {}).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={country}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{country}</span>
                        <span className="text-sm text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
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
                <div className="text-3xl mb-2">🌍</div>
                <p className="text-sm">No location data</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Domain Info Card */}
      {selectedDomainData && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">
                📊 Tracking: {selectedDomainData.domain}
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Status: {selectedDomainData.verified ? '✅ Verified' : '⏳ Pending Verification'}</p>
                <p>• Rate Limit: {selectedDomainData.settings.rate_limit} requests/min</p>
                <p>• IP Anonymization: {selectedDomainData.settings.anonymize_ip ? '✅ Enabled' : '❌ Disabled'}</p>
                <p>• Timezone: {selectedDomainData.settings.timezone}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/domains')}
              className="btn btn-secondary text-sm"
            >
              Manage Domain
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
