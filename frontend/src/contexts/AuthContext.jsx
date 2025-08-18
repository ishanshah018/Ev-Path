import React, { createContext, useContext, useState, useEffect } from 'react';

// Backend API URL - adjust this based on your backend server
const API_URL = 'http://localhost:8080';

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
const savedToken = localStorage.getItem('token');
if (savedUser && savedToken) {
    setUser(JSON.parse(savedUser));
}
}, []); // The empty dependency array ensures this runs only once.

// Real login function that calls the backend API.
const login = async (email, password) => {
try {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        // Handle different types of errors with field-specific information
        const error = new Error(data.message || 'Login failed');
        error.field = data.field; // Add field information to the error
        
        if (response.status === 404) {
            // Email not found
            error.message = data.message || 'No account found with this email address';
            error.field = 'email';
        } else if (response.status === 401) {
            // Wrong password
            error.message = data.message || 'Incorrect password. Please try again';
            error.field = 'password';
        } else if (response.status === 400) {
            error.message = data.message || 'Please check your input and try again';
        } else if (response.status >= 500) {
            error.message = 'Server error. Please try again later.';
        }
        
        throw error;
    }

    if (data.success) {
        const userData = {
            id: data._id || '1',
            email: data.email,
            name: data.name,
            phone: '+91 98765 43210', // Default phone for now
            location: 'India', // Default location for now
            hasCompletedOnboarding: true // Default to true for existing users
        };

        setUser(userData);
        // Save the user data and token to local storage.
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.jwtToken);
        return userData;
    } else {
        throw new Error(data.message || 'Login failed');
    }
} catch (error) {
    console.error('Login error:', error);
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your connection and try again.');
    }
    throw error;
}
};

// Real signup function that calls the backend API.
const signup = async (email, password, name, phone = '', location = '') => {
try {
    const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        // Handle different types of errors
        if (response.status === 409) {
            throw new Error(data.message || 'User already exists. Please try logging in instead.');
        } else if (response.status === 400) {
            throw new Error(data.message || 'Please check your input and try again');
        } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
        } else {
            throw new Error(data.message || 'Signup failed');
        }
    }

    if (data.success) {
        // After successful signup, automatically log the user in
        return await login(email, password);
    } else {
        throw new Error(data.message || 'Signup failed');
    }
} catch (error) {
    console.error('Signup error:', error);
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your connection and try again.');
    }
    throw error;
}
};

// Log out the user by clearing the state and local storage.
const logout = () => {
setUser(null);
localStorage.removeItem('user');
localStorage.removeItem('token');
};

// Update the user's state to reflect that onboarding is complete.
const completeOnboarding = () => {
if (user) {
    const updatedUser = { ...user, hasCompletedOnboarding: true };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
}
};

// Helper function to make authenticated API requests
const makeAuthenticatedRequest = async (url, options = {}) => {
const token = localStorage.getItem('token');
if (!token) {
    throw new Error('No authentication token found');
}

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
};

const requestOptions = {
    ...options,
    headers: {
        ...defaultHeaders,
        ...options.headers,
    },
};

const response = await fetch(`${API_URL}${url}`, requestOptions);
const data = await response.json();

if (!response.ok) {
    if (response.status === 403 || response.status === 401) {
        // Token expired or invalid, logout user
        logout();
        throw new Error('Session expired. Please login again.');
    }
    throw new Error(data.message || 'Request failed');
}

return data;
};

return (
// Provide the user state and authentication functions to children components.
<AuthContext.Provider value={{ 
    user, 
    login, 
    signup, 
    logout, 
    completeOnboarding, 
    makeAuthenticatedRequest 
}}>
    {children}
</AuthContext.Provider>
);
};
