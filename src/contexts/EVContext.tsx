import React, { createContext, useContext, useState, useEffect } from 'react';

interface EV {
  id: string;
  type: '2W' | '4W';
  brand: string;
  model: string;
  batteryCapacity: number;
  range: number;
  isDefault: boolean;
  batteryHealth: number;
  currentCharge: number;
}

interface EVContextType {
  evs: EV[];
  addEV: (ev: Omit<EV, 'id'>) => void;
  updateEV: (id: string, updates: Partial<EV>) => void;
  deleteEV: (id: string) => void;
  setDefaultEV: (id: string) => void;
  getDefaultEV: () => EV | null;
}

const EVContext = createContext<EVContextType | undefined>(undefined);

export const useEV = () => {
  const context = useContext(EVContext);
  if (!context) {
    throw new Error('useEV must be used within an EVProvider');
  }
  return context;
};

export const EVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [evs, setEvs] = useState<EV[]>([]);

  useEffect(() => {
    const savedEvs = localStorage.getItem('evs');
    if (savedEvs) {
      setEvs(JSON.parse(savedEvs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('evs', JSON.stringify(evs));
  }, [evs]);

  const addEV = (ev: Omit<EV, 'id'>) => {
    const newEV: EV = {
      ...ev,
      id: Date.now().toString(),
      batteryHealth: 95 + Math.random() * 5,
      currentCharge: 60 + Math.random() * 40
    };
    setEvs(prev => [...prev, newEV]);
  };

  const updateEV = (id: string, updates: Partial<EV>) => {
    setEvs(prev => prev.map(ev => ev.id === id ? { ...ev, ...updates } : ev));
  };

  const deleteEV = (id: string) => {
    setEvs(prev => prev.filter(ev => ev.id !== id));
  };

  const setDefaultEV = (id: string) => {
    setEvs(prev => prev.map(ev => ({ ...ev, isDefault: ev.id === id })));
  };

  const getDefaultEV = () => {
    return evs.find(ev => ev.isDefault) || evs[0] || null;
  };

  return (
    <EVContext.Provider value={{ evs, addEV, updateEV, deleteEV, setDefaultEV, getDefaultEV }}>
      {children}
    </EVContext.Provider>
  );
};