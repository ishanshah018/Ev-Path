import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
const [loading, setLoading] = useState(false);
const { user, makeAuthenticatedRequest } = useAuth();

// Load EVs from MongoDB when user is authenticated
useEffect(() => {
if (user) {
    loadEVs();
}
}, [user]);

// Function to load EVs from the backend
const loadEVs = async () => {
if (!user) return;
    
setLoading(true);
try {
    const response = await makeAuthenticatedRequest('/evs');
    setEvs(response.data || []);
} catch (error) {
    console.error('Error loading EVs:', error);
    setEvs([]);
} finally {
    setLoading(false);
}
};

// Function to add a new EV.
const addEV = async (ev) => {
if (!user) return;
    
try {
    const response = await makeAuthenticatedRequest('/evs', {
        method: 'POST',
        body: JSON.stringify(ev)
    });
    
    // Reload EVs to get the updated list
    await loadEVs();
    return response.data;
} catch (error) {
    console.error('Error adding EV:', error);
    throw error;
}
};

// Function to update an existing EV.
const updateEV = async (id, updates) => {
if (!user) return;
    
try {
    const response = await makeAuthenticatedRequest(`/evs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
    
    // Reload EVs to get the updated list
    await loadEVs();
    return response.data;
} catch (error) {
    console.error('Error updating EV:', error);
    throw error;
}
};

// Function to delete an EV.
const deleteEV = async (id) => {
if (!user) return;
    
try {
    await makeAuthenticatedRequest(`/evs/${id}`, {
        method: 'DELETE'
    });
    
    // Reload EVs to get the updated list
    await loadEVs();
} catch (error) {
    console.error('Error deleting EV:', error);
    throw error;
}
};

// Function to set a specific EV as the default.
const setDefaultEV = async (id) => {
if (!user) return;
    
try {
    await makeAuthenticatedRequest(`/evs/${id}/default`, {
        method: 'PATCH'
    });
    
    // Reload EVs to get the updated list
    await loadEVs();
} catch (error) {
    console.error('Error setting default EV:', error);
    throw error;
}
};

// Function to get the default EV, or the first one if no default is set.
const getDefaultEV = () => {
return evs.find(ev => ev.isDefault) || evs[0] || null;
};

return (
// Provide all state and functions to child components.
<EVContext.Provider value={{ evs, loading, addEV, updateEV, deleteEV, setDefaultEV, getDefaultEV }}>
    {children}
</EVContext.Provider>
);
};
