
// neo_license_frontend.jsx
import React, { useState, useEffect } from 'react';

export default function LicenseUnlock({ onTierUnlocked }) {
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState(null);
  const [tier, setTier] = useState(null);

  useEffect(() => {
    const savedTier = localStorage.getItem('neo-tier');
    if (savedTier) {
      setTier(savedTier);
      if (onTierUnlocked) onTierUnlocked(savedTier);
    }
  }, [onTierUnlocked]);

  const validateLicense = async () => {
    try {
      const response = await fetch(`/api/validate-license?license=${licenseKey}`);
      const data = await response.json();
      if (data.status === 'valid') {
        setStatus('✅ License valid!');
        setTier(data.tier);
        localStorage.setItem('neo-tier', data.tier);
        if (onTierUnlocked) onTierUnlocked(data.tier);
      } else {
        setStatus('❌ Invalid license. Please check your key.');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setStatus('❌ Error validating license. Try again later.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gradient-to-br from-black to-gray-900 text-white rounded-2xl shadow-lg space-y-4 border border-blue-500">
      <h2 className="text-2xl font-bold text-center">🔐 Unlock Neo</h2>
      {tier && <p className="text-green-300 font-semibold text-center">🎉 Current Tier: {tier}</p>}
      <input
        type="text"
        value={licenseKey}
        onChange={(e) => setLicenseKey(e.target.value)}
        placeholder="Paste your license key here..."
        className="w-full px-4 py-2 text-black rounded-md focus:outline-none focus:ring focus:ring-blue-400"
      />
      <button
        onClick={validateLicense}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        🔓 Validate & Unlock
      </button>
      {status && <p className="text-center font-medium">{status}</p>}
    </div>
  );
}
