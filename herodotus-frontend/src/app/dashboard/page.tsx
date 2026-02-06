'use client';

import { useState, useEffect } from 'react';
import { getDomains, getRealtimeStats, getOverviewStats } from '@/lib/api';
import type { Domain, RealtimeStats, OverviewStats } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDomains();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      loadStats();
      const interval = setInterval(loadStats, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedDomain]);

  const loadDomains = async () => {
    try {
      const { data } = await getDomains();
      setDomains(data || []);
      if (data && data.length > 0) {
        setSelectedDomain(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load domains:', error);
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
      setRealtimeStats(realtime.data);
      setOverviewStats(overview.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  if (domains.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No domains yet</h2>
          <p className="text-gray-600 mb-6">Add a domain to start tracking analytics</p>
          <a href="/domains" className="btn btn-primary">
            Add Domain
          </a>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="input w-64"
          >
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.domain}
              </option>
            ))}
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="text-sm font-medium text-gray-600">Active Visitors</div>
            <div className="text-3xl font-bold text-primary-600 mt-2">
              {realtimeStats?.active_visitors || 0}
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-gray-600">Total Hits</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {overviewStats?.total_hits?.toLocaleString() || 0}
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-gray-600">Unique Visitors</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {overviewStats?.unique_visitors?.toLocaleString() || 0}
            </div>
          </div>
          <div className="card">
            <div className="text-sm font-medium text-gray-600">Bounce Rate</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {overviewStats?.bounce_rate?.toFixed(1) || 0}%
            </div>
          </div>
        </div>

        {/* Hits Per Minute Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hits Per Minute</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={realtimeStats?.hits_per_minute || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="minute" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hits" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Pages and Referrers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Pages</h2>
            <div className="space-y-2">
              {realtimeStats?.top_pages?.slice(0, 5).map((page, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 truncate">{page.path}</span>
                  <span className="text-sm font-medium text-gray-900">{page.hits}</span>
                </div>
              )) || <p className="text-sm text-gray-500">No data yet</p>}
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Referrers</h2>
            <div className="space-y-2">
              {realtimeStats?.top_referrers?.slice(0, 5).map((ref, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 truncate">{ref.referrer || 'Direct'}</span>
                  <span className="text-sm font-medium text-gray-900">{ref.hits}</span>
                </div>
              )) || <p className="text-sm text-gray-500">No data yet</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
