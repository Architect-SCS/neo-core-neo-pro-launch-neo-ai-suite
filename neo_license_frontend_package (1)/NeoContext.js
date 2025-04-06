// NeoContext.js
import { createContext, useContext, useState, useEffect } from 'react';

export const NeoContext = createContext({
  tier: null,
  setTier: () => {},
  timestamp: null,
  setTimestamp: () => {},
  clearNeoContext: () => {},
});

export const useNeo = () => useContext(NeoContext);

export const NeoProvider = ({ children }) => {
  const [tier, setTier] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    const savedTier = localStorage.getItem('neo-tier');
    const savedTimestamp = localStorage.getItem('neo-timestamp');
    if (savedTier) setTier(savedTier);
    if (savedTimestamp) setTimestamp(new Date(savedTimestamp));
  }, []);

  const clearNeoContext = () => {
    localStorage.removeItem('neo-tier');
    localStorage.removeItem('neo-timestamp');
    setTier(null);
    setTimestamp(null);
  };

  return (
    <NeoContext.Provider value={{ tier, setTier, timestamp, setTimestamp, clearNeoContext }}>
      {children}
    </NeoContext.Provider>
  );
};
