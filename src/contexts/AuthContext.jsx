import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication.
const AuthContext = createContext(undefined);

// A custom hook to use the AuthContext, with an error check.
export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
// This error will be thrown if useAuth is not used within an AuthProvider.
throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};

// The AuthProvider component that will wrap the application.
export const AuthProvider = ({ children }) => {
// State to hold the user object.
const [user, setUser] = useState(null);

// Use useEffect to check for a saved user in local storage on component mount.
useEffect(() => {
const savedUser = localStorage.getItem('user');
if (savedUser) {
    setUser(JSON.parse(savedUser));
}
}, []); // The empty dependency array ensures this runs only once.

// Simulate a login function.
const login = async (email, password) => {
// Mock API call to simulate a successful login.
const mockUser = {
    id: '1',
    email,
    name: email.split('@')[0],
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    // Randomly set onboarding status for demonstration.
    hasCompletedOnboarding: Math.random() > 0.5
};
setUser(mockUser);
// Save the user data to local storage.
localStorage.setItem('user', JSON.stringify(mockUser));
};

// Simulate a signup function.
const signup = async (email, password, name, phone, location) => {
// Mock API call to simulate a new user signing up.
const mockUser = {
    id: '1',
    email,
    name,
    phone,
    location,
    hasCompletedOnboarding: false
};
setUser(mockUser);
// Save the new user data to local storage.
localStorage.setItem('user', JSON.stringify(mockUser));
};

// Log out the user by clearing the state and local storage.
const logout = () => {
setUser(null);
localStorage.removeItem('user');
};

// Update the user's state to reflect that onboarding is complete.
const completeOnboarding = () => {
if (user) {
    const updatedUser = { ...user, hasCompletedOnboarding: true };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
}
};

return (
// Provide the user state and authentication functions to children components.
<AuthContext.Provider value={{ user, login, signup, logout, completeOnboarding }}>
    {children}
</AuthContext.Provider>
);
};
