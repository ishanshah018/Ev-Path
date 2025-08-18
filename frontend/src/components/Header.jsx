import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Zap, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
const { darkMode, toggleDarkMode } = useTheme();
const { user, logout } = useAuth();
const location = useLocation();
const navigate = useNavigate();
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Handle logout with redirect to home page
const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false); // Close mobile menu on logout
};

const isActive = (path) => location.pathname === path;

// Toggle mobile menu
const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
};

// Close mobile menu when route changes
useEffect(() => {
    setIsMobileMenuOpen(false);
}, [location.pathname]);

return (
<header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            EvPath
            </span>
        </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
        {!user && (
            <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            >
            Home
            </Link>
        )}
        {!user && (
            <Link
            to="/features"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/features')
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            >
            Features
            </Link>
        )}
        {user && (
            <>
            <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
            >
                Dashboard
            </Link>
            <Link
                to="/my-evs"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/my-evs')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
            >
                My EVs
            </Link>
            <Link
                to="/map"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/map')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
            >
                Map
            </Link>
            <Link
                to="/trip-planner"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/trip-planner')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
            >
                Trip Planner
            </Link>
            <Link
                to="/settings"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/settings')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
            >
                Settings
            </Link>
            </>
        )}
        </nav>

        <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle mobile menu"
        >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
        >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {user ? (
            <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">
                Hi, {user.name}
            </span>
            <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors tracking-wide"
            >
                Logout
            </button>
            </div>
        ) : (
            <div className="hidden md:flex items-center space-x-4">
            <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
                Login
            </Link>
            <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors tracking-wide"
            >
                Sign Up
            </Link>
            </div>
        )}
        </div>
    </div>
    </div>

    {/* Mobile Navigation Menu */}
    {isMobileMenuOpen && (
    <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 space-y-1">
        {!user && (
            <>
            <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
                Home
            </Link>
            <Link
                to="/features"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/features')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
                Features
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
            <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
                Login
            </Link>
            <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors text-center"
            >
                Sign Up
            </Link>
            </>
        )}
        
        {user && (
            <>
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-3">
                Hi, {user.name}
            </div>
            <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/dashboard')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
                Dashboard
            </Link>
            <Link
                to="/my-evs"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/my-evs')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
                My EVs
            </Link>
            <Link
                to="/map"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/map')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
                Map
            </Link>
            <Link
                to="/trip-planner"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/trip-planner')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
                Trip Planner
            </Link>
            <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/settings')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
                Settings
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
            <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
                Logout
            </button>
            </>
        )}
        </div>
    </div>
    )}
</header>
);
};

export default Header;