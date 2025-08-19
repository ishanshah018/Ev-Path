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
const [isLoading, setIsLoading] = useState(true);

// Use useEffect to check for a saved user in local storage on component mount.
useEffect(() => {
const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');
if (savedUser && savedToken) {
    try {
        const userData = JSON.parse(savedUser);
        console.log('Restoring user from localStorage:', userData);
        setUser(userData);
    } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
} else {
    console.log('No saved user data found in localStorage');
}
setIsLoading(false);
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
        // Get user profile data from backend to get actual phone and location
        try {
            const profileResponse = await fetch(`${API_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.jwtToken}`
                }
            });
            
            let userData = {
                id: data._id || '1',
                email: data.email,
                name: data.name,
                phone: '+91 98765 43210', // Default phone
                location: 'India', // Default location
                hasCompletedOnboarding: true
            };
            
            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                if (profileData.success && profileData.data) {
                    userData = {
                        ...userData,
                        phone: profileData.data.phone || '+91 98765 43210',
                        location: profileData.data.location || 'India'
                    };
                }
            }
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.jwtToken);
            return userData;
        } catch (profileError) {
            // If profile fetch fails, use default values
            const userData = {
                id: data._id || '1',
                email: data.email,
                name: data.name,
                phone: '+91 98765 43210',
                location: 'India',
                hasCompletedOnboarding: true
            };
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.jwtToken);
            return userData;
        }
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

// Function to update user profile
const updateProfile = async (profileData) => {
try {
    const response = await makeAuthenticatedRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
    });

    if (response.success) {
        // Update local user state
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return response;
} catch (error) {
    console.error('Error updating profile:', error);
    throw error;
}
};

// Function to change password
const changePassword = async (passwordData) => {
try {
    const response = await makeAuthenticatedRequest('/user/password', {
        method: 'PUT',
        body: JSON.stringify(passwordData)
    });

    return response;
} catch (error) {
    console.error('Error changing password:', error);
    // Provide more specific error messages
    if (error.message.includes('Current password is incorrect')) {
        throw new Error('Current password is incorrect. Please try again.');
    } else if (error.message.includes('New password must be different')) {
        throw new Error('New password must be different from current password.');
    } else if (error.message.includes('Bad request')) {
        throw new Error('Please check your input. Password must be at least 4 characters long.');
    } else if (error.message.includes('Session expired')) {
        throw new Error('Session expired. Please login again.');
    } else if (error.message.includes('No authentication token')) {
        throw new Error('Please login again to continue.');
    } else {
        throw new Error(error.message || 'Password change failed. Please try again.');
    }
}
};

// Function to delete account
const deleteAccount = async (password) => {
try {
    const response = await makeAuthenticatedRequest('/user/account', {
        method: 'DELETE',
        body: JSON.stringify({ password })
    });

    if (response.success) {
        logout();
    }

    return response;
} catch (error) {
    console.error('Error deleting account:', error);
    throw error;
}
};

return (
// Provide the user state and authentication functions to children components.
<AuthContext.Provider value={{ 
    user, 
    isLoading,
    login, 
    signup, 
    logout, 
    completeOnboarding, 
    makeAuthenticatedRequest,
    updateProfile,
    changePassword,
    deleteAccount
}}>
    {children}
</AuthContext.Provider>
);
};
