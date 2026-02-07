'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import type { Domain } from '@/types';

interface DomainInfoCardProps {
  domain: Domain;
}

export default function DomainInfoCard({ domain }: DomainInfoCardProps) {
  const router = useRouter();

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold mb-2">
            📊 Tracking: {domain.domain}
          </h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Status: {domain.verified ? '✅ Verified' : '⏳ Pending Verification'}</p>
            <p>• Rate Limit: {domain.settings.rate_limit} requests/min</p>
            <p>• IP Anonymization: {domain.settings.anonymize_ip ? '✅ Enabled' : '❌ Disabled'}</p>
            <p>• Timezone: {domain.settings.timezone}</p>
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
  );
}
