import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for EV management.
const EVContext = createContext(undefined);

// A custom hook to use the EVContext, with an error check.
export const useEV = () => {
  const context = useContext(EVContext);
  if (!context) {
    throw new Error('useEV must be used within an EVProvider');
  }
  return context;
};

// The provider component that manages the state and provides it to the app.
export const EVProvider = ({ children }) => {
// State to hold the array of electric vehicles.
const [evs, setEvs] = useState([]);

// Load saved EV data from local storage on initial render.
useEffect(() => {
const savedEvs = localStorage.getItem('evs');
if (savedEvs) {
    setEvs(JSON.parse(savedEvs));
}
}, []);

// Save EV data to local storage whenever the `evs` state changes.
useEffect(() => {
localStorage.setItem('evs', JSON.stringify(evs));
}, [evs]);

// Function to add a new EV.
const addEV = (ev) => {
const newEV = {
    ...ev,
    id: Date.now().toString(),
    // Mock data for battery health and current charge.
    batteryHealth: 95 + Math.random() * 5,
    currentCharge: 60 + Math.random() * 40
};
setEvs(prev => [...prev, newEV]);
};

// Function to update an existing EV.
const updateEV = (id, updates) => {
setEvs(prev => prev.map(ev => ev.id === id ? { ...ev, ...updates } : ev));
};

// Function to delete an EV.
const deleteEV = (id) => {
setEvs(prev => prev.filter(ev => ev.id !== id));
};

// Function to set a specific EV as the default.
const setDefaultEV = (id) => {
setEvs(prev => prev.map(ev => ({ ...ev, isDefault: ev.id === id })));
};

// Function to get the default EV, or the first one if no default is set.
const getDefaultEV = () => {
return evs.find(ev => ev.isDefault) || evs[0] || null;
};

return (
// Provide all state and functions to child components.
<EVContext.Provider value={{ evs, addEV, updateEV, deleteEV, setDefaultEV, getDefaultEV }}>
    {children}
</EVContext.Provider>
);
};
