'use client';

import { useState, useEffect } from 'react';
import { getDomains, createDomain, deleteDomain } from '@/lib/api';
import type { Domain } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      const { data } = await getDomains();
      setDomains(data || []);
    } catch (error) {
      console.error('Failed to load domains:', error);
      setDomains([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createDomain(newDomain);
      setNewDomain('');
      setShowModal(false);
      loadDomains();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create domain');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;

    try {
      await deleteDomain(id);
      loadDomains();
    } catch (error) {
      console.error('Failed to delete domain:', error);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Domains</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Add Domain
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <div key={domain.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{domain.domain}</h3>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      domain.verified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {domain.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(domain.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Rate Limit: {domain.settings.rate_limit}/min</div>
                <div>Timezone: {domain.settings.timezone}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Domain Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Domain</h2>
              <form onSubmit={handleCreate}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="example.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    Add Domain
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
