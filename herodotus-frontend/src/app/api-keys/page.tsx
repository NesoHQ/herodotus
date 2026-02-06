'use client';

import { useState, useEffect } from 'react';
import { getAPIKeys, createAPIKey, revokeAPIKey, getDomains } from '@/lib/api';
import type { APIKey, Domain } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedDomains.length === 0) {
      setError('Please select at least one domain');
      return;
    }

    try {
      await createAPIKey(selectedDomains);
      setSelectedDomains([]);
      setShowModal(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create API key');
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key?')) return;

    try {
      await revokeAPIKey(id);
      loadData();
    } catch (error) {
      console.error('Failed to revoke API key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Generate API Key
          </button>
        </div>

        <div className="space-y-4">
          {apiKeys.map((key) => (
            <div key={key.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                      {key.key}
                    </code>
                    <button
                      onClick={() => copyToClipboard(key.key)}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Created: {new Date(key.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Domains: {key.domain_ids.length}
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(key.id)}
                  className="text-red-600 hover:text-red-800"
                  disabled={key.revoked}
                >
                  {key.revoked ? 'Revoked' : 'Revoke'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Generate API Key Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate API Key</h2>
              <form onSubmit={handleCreate}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Domains
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {domains.map((domain) => (
                      <label key={domain.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDomains.includes(domain.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDomains([...selectedDomains, domain.id]);
                            } else {
                              setSelectedDomains(selectedDomains.filter((id) => id !== domain.id));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{domain.domain}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
