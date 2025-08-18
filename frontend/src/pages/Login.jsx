import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// This is the functional component for the Login page.
const Login = () => {
// State for form inputs and UI state.
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const [emailError, setEmailError] = useState('');
const [passwordError, setPasswordError] = useState('');
const [success, setSuccess] = useState('');

// Hooks for authentication and navigation.
const { login } = useAuth();
const navigate = useNavigate();

// Client-side email validation
const validateEmail = (email) => {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
};

// Handle form submission.
const handleSubmit = async (e) => {
e.preventDefault();
setIsLoading(true);
setError(''); // Clear any previous errors
setEmailError(''); // Clear email-specific errors
setPasswordError(''); // Clear password-specific errors
setSuccess(''); // Clear any previous success messages

// Client-side validation
if (!email.trim()) {
    setEmailError('Email is required');
    setIsLoading(false);
    return;
}

if (!validateEmail(email)) {
    setEmailError('Please enter a valid email address');
    setIsLoading(false);
    return;
}

if (!password.trim()) {
    setPasswordError('Password is required');
    setIsLoading(false);
    return;
}

try {
    // Attempt to log in the user.
    await login(email, password);
    setSuccess('Login successful! Redirecting...');
    // Navigate to the dashboard on a successful login.
    setTimeout(() => navigate('/dashboard'), 1500);
} catch (error) {
    // Display the error message from the backend
    console.error('Login failed:', error);
    
    // Handle field-specific errors
    if (error.field === 'email') {
        setEmailError(error.message);
    } else if (error.field === 'password') {
        setPasswordError(error.message);
    } else {
        setError(error.message || 'Login failed. Please try again.');
    }
} finally {
    // Always stop the loading state.
    setIsLoading(false);
}
};

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl shadow-lg p-8">
    <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-amber-700 dark:text-gray-400">
        Or{' '}
        <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500">
            create a new account
        </Link>
        </p>
    </div>

    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
        <div className="rounded-md bg-red-50/80 border border-red-200 dark:bg-red-900/50 p-4">
            <div className="text-sm text-red-700 dark:text-red-200">
            {error}
            </div>
        </div>
        )}
        
        {/* Success Message */}
        {success && (
        <div className="rounded-md bg-green-50/80 border border-green-200 dark:bg-green-900/50 p-4">
            <div className="text-sm text-green-700 dark:text-green-200">
            {success}
            </div>
        </div>
        )}

        <div className="rounded-md shadow-sm -space-y-px">
        <div>
            <label htmlFor="email-address" className="sr-only">
            Email address
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-t-md relative block w-full px-3 py-2 pl-10 border ${emailError ? 'border-red-400 dark:border-red-400' : 'border-orange-200 dark:border-gray-600'} placeholder-amber-400 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-cream-100 dark:bg-gray-800 focus:outline-none focus:ring-orange-300 focus:border-orange-300 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(''); // Clear error when user starts typing
                }}
            />
            </div>
            {emailError && (
            <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                {emailError}
            </div>
            )}
        </div>
        <div>
            <label htmlFor="password" className="sr-only">
            Password
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className={`appearance-none rounded-b-md relative block w-full px-3 py-2 pl-10 pr-10 border ${passwordError ? 'border-red-400 dark:border-red-400' : 'border-orange-200 dark:border-gray-600'} placeholder-amber-400 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-cream-100 dark:bg-gray-800 focus:outline-none focus:ring-orange-300 focus:border-orange-300 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(''); // Clear error when user starts typing
                }}
            />
            <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                <Eye className="h-5 w-5 text-gray-400" />
                )}
            </button>
            </div>
            {passwordError && (
            <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                {passwordError}
            </div>
            )}
        </div>
        </div>

        <div className="flex items-center justify-between">
        <div className="flex items-center">
            <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-amber-800 dark:text-gray-300">
            Remember me
            </label>
        </div>

        <div className="text-sm">
            <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
            Forgot your password?
            </a>
        </div>
        </div>

        <div>
        <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
        >
            {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
        </div>

        <div className="mt-6">
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-orange-200 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-gray-900 text-amber-600">Or continue with</span>
            </div>
        </div>

        <div className="mt-6">
            <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-orange-200 dark:border-gray-600 rounded-md shadow-sm bg-white/70 dark:bg-gray-800 text-sm font-medium text-amber-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
            >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="ml-2">Sign in with Google</span>
            </button>
        </div>
        </div>
    </form>
    </div>
</div>
);
};

export default Login;
