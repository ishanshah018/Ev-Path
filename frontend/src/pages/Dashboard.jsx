import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Battery, Car, MapPin, Route, Clock, Star, Plus, ChevronRight, Zap, AlertTriangle, Activity, MessageCircle, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEV } from '../contexts/EVContext';

// This is the functional component for the Dashboard page.
const Dashboard = () => {
// Destructure user from the AuthContext.
const { user } = useAuth();
// Destructure evs and getDefaultEV from the EVContext.
const { evs, getDefaultEV } = useEV();
// State to hold the current time.
const [currentTime, setCurrentTime] = useState(new Date());

// Use useEffect to set up a timer to update the current time every second.
useEffect(() => {
const timer = setInterval(() => {
    setCurrentTime(new Date());
}, 1000);
// Cleanup function to clear the interval when the component unmounts.
return () => clearInterval(timer);
}, []);

// Get the default EV from the context.
const defaultEV = getDefaultEV();

// Empty arrays for now - will be populated with real data later
const recentTrips = [];
const nearbyStations = [];

// Function to determine the color of the battery condition text based on its value.
const batteryHealthColor = (percentage) => {
if (percentage >= 80) return 'text-green-600';
if (percentage >= 50) return 'text-yellow-600';
if (percentage >= 20) return 'text-orange-600';
return 'text-red-600';
};

// Function to determine the background color of the battery condition card.
const batteryHealthBg = (percentage) => {
if (percentage >= 80) return 'bg-green-100 dark:bg-green-900/20';
if (percentage >= 50) return 'bg-yellow-100 dark:bg-yellow-900/20';
if (percentage >= 20) return 'bg-orange-100 dark:bg-orange-900/20';
return 'bg-red-100 dark:bg-red-900/20';
};

// Function to determine the battery bar color.
const batteryBarColor = (percentage) => {
if (percentage >= 80) return 'bg-gradient-to-r from-green-500 to-green-600';
if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
if (percentage >= 20) return 'bg-gradient-to-r from-orange-500 to-orange-600';
return 'bg-gradient-to-r from-red-500 to-red-600';
};

// If the user has not completed onboarding, show a setup screen.
if (!user?.hasCompletedOnboarding) {
return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
    <div className="mb-8">
    <Car className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Setup
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
            Add your first EV to get started with EvPath
        </p>
        </div>
        <Link
        to="/onboarding"
        className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
        <Plus className="h-5 w-5 mr-2" />
        Add Your EV
        </Link>
    </div>
    </div>
);
}

// Main dashboard layout.
return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header Section */}
    <div className="mb-8">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
        <div className="flex items-center space-x-4">
            <Link
            to="/my-evs"
            className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
            >
            <Plus className="h-4 w-4 mr-2" />
            Add EV
            </Link>
        </div>
        </div>
    </div>

    {/* Quick Stats Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
            <Car className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total EVs</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{evs.length}</p>
            </div>
        </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
            <Route className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trips</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">0</p>
            </div>
        </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Savings</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">₹0</p>
            </div>
        </div>
        </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
        {/* Current EV Status */}
        {defaultEV && (
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    {defaultEV.brand} {defaultEV.model}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Primary Vehicle</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Default</span>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Battery Status */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Battery Level</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{defaultEV.batteryPercentage}%</span>
                    </div>
                    <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div
                        className={`h-4 rounded-full transition-all duration-1000 ${batteryBarColor(defaultEV.batteryPercentage)}`}
                        style={{ width: `${defaultEV.batteryPercentage}%` }}
                        />
                    </div>
                    <Battery className="absolute -right-8 top-0 h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>0%</span>
                    <span className="font-medium">Range: {defaultEV.currentRange} km</span>
                    <span>100%</span>
                    </div>
                </div>

                {/* Battery Condition */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Battery Condition</span>
                    <span className={`text-sm font-bold ${batteryHealthColor(defaultEV.batteryPercentage)}`}>
                        {defaultEV.batteryCondition}
                    </span>
                    </div>
                    <div className={`p-4 rounded-lg ${batteryHealthBg(defaultEV.batteryPercentage)}`}>
                    <div className="flex items-center space-x-2">
                        <Activity className={`h-5 w-5 ${batteryHealthColor(defaultEV.batteryPercentage)}`} />
                        <div>
                        <p className={`text-sm font-medium ${batteryHealthColor(defaultEV.batteryPercentage)}`}>
                            {defaultEV.batteryCondition}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {defaultEV.batteryCondition === 'Excellent' ? 'Your battery is in excellent condition' :
                            defaultEV.batteryCondition === 'Good' ? 'Battery performance is good' :
                            defaultEV.batteryCondition === 'Low' ? 'Battery level is low, consider charging' :
                            'Battery level is critical, charge immediately'}
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}

        {/* Recent Trips Section */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Trips</h2>
                <Link
                to="/trips"
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center"
                >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </div>
            </div>
            <div className="p-6">
            <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No trips yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Start planning your first trip to see it here</p>
            </div>
            </div>
        </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
                <Link
                to="/map"
                className="flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                >
                <MapPin className="h-5 w-5 text-emerald-600 mr-3" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Find Charging Stations</span>
                </Link>
                <Link
                to="/trip-planner"
                className="flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                >
                <Route className="h-5 w-5 text-emerald-600 mr-3" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Plan Route</span>
                </Link>
                <Link
                to="/chatbot"
                className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                <MessageCircle className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-purple-700 dark:text-purple-400 font-medium">AI Assistant</span>
                </Link>
                <Link
                to="/blogs"
                className="flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                >
                <BookOpen className="h-5 w-5 text-emerald-600 mr-3" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Read Blogs</span>
                </Link>
                <Link
                to="/community"
                className="flex items-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                >
                <Users className="h-5 w-5 text-pink-600 mr-3" />
                <span className="text-pink-700 dark:text-pink-400 font-medium">Join Community</span>
                </Link>
                <Link
                to="/my-evs"
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                <Car className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Manage EVs</span>
                </Link>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
</div>
);
};

export default Dashboard;
