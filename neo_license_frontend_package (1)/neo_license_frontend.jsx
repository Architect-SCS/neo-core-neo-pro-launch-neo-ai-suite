// neo_license_frontend.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns-tz';
import { useNeo } from './NeoContext';

export default function LicenseUnlock({ onTierUnlocked }) {
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { tier, setTier, timestamp, setTimestamp, clearNeoContext } = useNeo();

  useEffect(() => { if (tier && onTierUnlocked) onTierUnlocked(tier); }, [tier, onTierUnlocked]);

  const clearLicenseCache = () => {
    clearNeoContext();
    setStatus('Cache cleared. Please enter a new license.');
  };

  const validateLicense = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/validate-license?license=${licenseKey}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.status === 'valid') {
        const now = new Date();
        setTier(data.tier);
        setTimestamp(now);
        localStorage.setItem('neo-tier', data.tier);
        localStorage.setItem('neo-timestamp', now.toISOString());
        if (window.neoGlobalState) {
          window.neoGlobalState.tier = data.tier;
          window.neoGlobalState.timestamp = now.toISOString();
        }
        setStatus('✅ License valid!');
        if (onTierUnlocked) onTierUnlocked(data.tier);
      } else setStatus('❌ Invalid license. Please check your key.');
    } catch (err) {
      console.error('Validation error:', err);
      setStatus('❌ Error validating license. Try again later.');
    } finally { setIsLoading(false); }
  }, [licenseKey, onTierUnlocked, setTier, setTimestamp]);

  return (
    <div className="p-4 max-w-md mx-auto bg-gradient-to-br from-black to-gray-900 text-white rounded-2xl shadow-lg space-y-4 border border-blue-500">
      <h2 className="text-2xl font-bold text-center">🔐 Unlock Neo</h2>
      {tier && <p className="text-green-300 font-semibold text-center">🎉 Current Tier: {tier}</p>}
      {tier && <p className="text-sm text-indigo-300 text-center">{tier === 'Pro' ? 'Full access to advanced Neo modules.' : tier === 'Lite' ? 'Limited access with core features only.' : 'Minimal interface and mobile compatibility.'}</p>}
      {timestamp && <p className="text-sm text-gray-400 text-center">Last validated: {format(new Date(timestamp), 'PPpp', { timeZone: 'UTC' })} (UTC)</p>}

      <input
        type="text"
        value={licenseKey}
        onChange={(e) => setLicenseKey(e.target.value)}
        placeholder="Paste your license key here..."
        className="w-full px-4 py-2 text-black rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        aria-label="License Key Input"
      />

      <div className="flex justify-between space-x-2">
        <button
          onClick={validateLicense}
          className={`flex-grow bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Validating...' : '🔓 Validate & Unlock'}
        </button>
        <button
          onClick={clearLicenseCache}
          className="flex-grow bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          🗑️ Clear Cache
        </button>
      </div>

      {process.env.NODE_ENV !== 'production' && (
        <button
          onClick={() => {
            const now = new Date();
            setTier('Pro');
            setTimestamp(now);
            localStorage.setItem('neo-tier', 'Pro');
            localStorage.setItem('neo-timestamp', now.toISOString());
            if (window.neoGlobalState) {
              window.neoGlobalState.tier = 'Pro';
              window.neoGlobalState.timestamp = now.toISOString();
            }
            setStatus('✅ Test license: Pro mode activated.');
            if (onTierUnlocked) onTierUnlocked('Pro');
          }}
          className="text-sm text-blue-300 underline mt-2 text-center block"
        >
          (Simulate Pro Mode)
        </button>
      )}

      {status && <p className="text-center font-medium">{status}</p>}
    </div>
  );
}
