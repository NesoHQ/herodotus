'use client';

import type { Domain } from '@/types';

interface DashboardHeaderProps {
  lastUpdate: Date;
  domains: Domain[];
  selectedDomain: string;
  onDomainChange: (domainId: string) => void;
}

export default function DashboardHeader({
  lastUpdate,
  domains,
  selectedDomain,
  onDomainChange,
}: DashboardHeaderProps) {
  return (
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
          onChange={(e) => onDomainChange(e.target.value)}
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
  );
}
