import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Car, Map, Route, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MobileNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            isActive('/dashboard')
              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          to="/my-evs"
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            isActive('/my-evs')
              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Car className="h-5 w-5" />
          <span className="text-xs">My EVs</span>
        </Link>

        <Link
          to="/map"
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            isActive('/map')
              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Map className="h-5 w-5" />
          <span className="text-xs">Map</span>
        </Link>

        <Link
          to="/trip-planner"
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            isActive('/trip-planner')
              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Route className="h-5 w-5" />
          <span className="text-xs">Trip Plan</span>
        </Link>

        <Link
          to="/settings"
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            isActive('/settings')
              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;