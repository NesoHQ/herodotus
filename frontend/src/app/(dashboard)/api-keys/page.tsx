'use client';

import { useState, useEffect } from 'react';
import { getAPIKeys, createAPIKey, revokeAPIKey, getDomains } from '@/lib/api';
import type { APIKey, Domain } from '@/types';
import EmptyState from '@/components/ui/EmptyState';
import Alert from '@/components/ui/Alert';

// API Keys Components
import APIKeyCard from '@/components/api-keys/APIKeyCard';
import NewKeyDisplay from '@/components/api-keys/NewKeyDisplay';
import GenerateKeyModal from '@/components/api-keys/GenerateKeyModal';
import InstallationGuideModal from '@/components/api-keys/InstallationGuideModal';
import InfoCard from '@/components/api-keys/InfoCard';

// Custom hook for API keys management
function useAPIKeys() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const [keysRes, domainsRes] = await Promise.all([getAPIKeys(), getDomains()]);
      setApiKeys(keysRes.data || []);
      setDomains(domainsRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      setApiKeys([]);
      setDomains([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (domainIds: string[]) => {
    const { data } = await createAPIKey(domainIds);
    setSuccess('API key generated successfully! Make sure to copy it now - you won\'t be able to see it again.');
    await loadData();
    return data.key;
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Websites using this key will stop tracking.')) {
      return;
    }

    try {
      await revokeAPIKey(id);
      setSuccess('API key revoked successfully');
      await loadData();
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      setError('Failed to revoke API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    apiKeys,
    domains,
    loading,
    error,
    success,
    setError,
    setSuccess,
    handleCreateKey,
    handleRevokeKey,
    copyToClipboard,
  };
}

export default function APIKeysPage() {
  const {
    apiKeys,
    domains,
    loading,
    error,
    success,
    setError,
    setSuccess,
    handleCreateKey,
    handleRevokeKey,
    copyToClipboard,
  } = useAPIKeys();

  const [showModal, setShowModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState('');

  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '');

  const getInstallCode = (apiKey: string) => {
    return `<!-- Krakens Analytics -->
<script src="${frontendUrl}/krakens.js"></script>
<script>
  Krakens.init('${apiKey}');
</script>`;
  };

  const handleGenerate = async (domainIds: string[]) => {
    const key = await handleCreateKey(domainIds);
    setNewlyCreatedKey(key);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">API Keys</h1>
          <p className="text-muted-foreground">Manage authentication keys for tracking</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowInstallModal(true)} className="btn btn-secondary">
            📖 Installation Guide
          </button>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn btn-primary"
            disabled={domains.length === 0}
          >
            + Generate API Key
          </button>
        </div>
      </div>

      {/* Alerts */}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* No Domains Warning */}
      {domains.length === 0 && (
        <Alert
          type="warning"
          title="No domains found"
          message="You need to add a domain before you can generate API keys. Go to the Domains page to add one."
        />
      )}

      <InfoCard />

      {/* Newly Created Key Display */}
      {newlyCreatedKey && (
        <NewKeyDisplay
          apiKey={newlyCreatedKey}
          installCode={getInstallCode(newlyCreatedKey)}
          onCopyKey={() => copyToClipboard(newlyCreatedKey)}
          onCopyCode={() => copyToClipboard(getInstallCode(newlyCreatedKey))}
          onClose={() => setNewlyCreatedKey('')}
        />
      )}

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <EmptyState
          icon="🔑"
          title="No API keys yet"
          description="Generate your first API key to start tracking analytics on your website. You'll need to add a domain first."
          action={domains.length > 0 ? {
            label: '+ Generate Your First API Key',
            onClick: () => setShowModal(true),
          } : undefined}
        />
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <APIKeyCard
              key={key.id}
              apiKey={key}
              onCopy={copyToClipboard}
              onViewCode={setNewlyCreatedKey}
              onRevoke={handleRevokeKey}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <GenerateKeyModal
          domains={domains}
          onGenerate={handleGenerate}
          onClose={() => setShowModal(false)}
        />
      )}

      {showInstallModal && (
        <InstallationGuideModal
          frontendUrl={frontendUrl}
          onClose={() => setShowInstallModal(false)}
        />
      )}
    </div>
  );
}
