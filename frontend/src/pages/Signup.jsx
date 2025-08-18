import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// This is the functional component for the Signup page.
const Signup = () => {
// State for form inputs and UI state.
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

// Hooks for authentication and navigation.
const { signup } = useAuth();
const navigate = useNavigate();

// Handle form submission.
const handleSubmit = async (e) => {
e.preventDefault();
setError(''); // Clear any previous errors
setSuccess(''); // Clear any previous success messages

if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
}

if (password.length < 4) {
    setError('Password must be at least 4 characters long');
    return;
}

setIsLoading(true);

try {
    // Attempt to sign up the user with the provided data.
    await signup(email, password, name, '', '');
    setSuccess('Account created successfully! Redirecting to onboarding...');
    // Navigate to the onboarding page on a successful signup.
    setTimeout(() => navigate('/onboarding'), 1500);
} catch (error) {
    // Display the error message from the backend
    console.error('Signup failed:', error);
    setError(error.message || 'Signup failed. Please try again.');
} finally {
    // Always stop the loading state.
    setIsLoading(false);
}
};

return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
    <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Or{' '}
        <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
            sign in to your existing account
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

        <div className="space-y-4">
        <div>
            <label htmlFor="name" className="sr-only">
            Full Name
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            </div>
        </div>

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
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
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
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <div>
            <label htmlFor="confirm-password" className="sr-only">
            Confirm Password
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
                {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                <Eye className="h-5 w-5 text-gray-400" />
                )}
            </button>
            </div>
        </div>
        </div>

        <div>
        <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
            {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
        </div>

        <div className="mt-6">
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400">Or continue with</span>
            </div>
        </div>

        <div className="mt-6">
            <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="ml-2">Sign up with Google</span>
            </button>
        </div>
        </div>
    </form>
    </div>
</div>
);
};

export default Signup