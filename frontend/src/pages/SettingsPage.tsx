import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const tabs = ['Profile', 'Security', 'Notifications'] as const;

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Profile');

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="text-2xl font-semibold text-text tracking-tight mb-6">
        Settings
      </h1>

      <div className="flex border-b border-border mb-6 max-w-2xl">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-accent border-accent'
                : 'text-text-muted border-transparent hover:text-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm max-w-2xl">
          <label className="block text-xs text-text-muted mb-1.5">Name</label>
          <input
            type="text"
            value={user?.name || ''}
            disabled
            className="w-full bg-bg border border-border rounded-md p-2.5 mb-4 text-sm text-text-muted"
          />
          <label className="block text-xs text-text-muted mb-1.5">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full bg-bg border border-border rounded-md p-2.5 mb-2 text-sm text-text-muted"
          />
          <p className="text-xs text-text-dim">
            Editing profile details isn't available yet.
          </p>
        </div>
      )}

      {activeTab !== 'Profile' && (
        <div className="bg-white border border-dashed border-border rounded-xl p-10 text-center max-w-2xl">
          <p className="text-text-muted text-sm">
            {activeTab} settings are coming soon.
          </p>
        </div>
      )}
    </div>
  );
}