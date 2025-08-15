import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">EvPath</span>
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
                  onClick={logout}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors tracking-wide"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
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
    </header>
  );
};

export default Header;