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

// Hardcoded data for recent trips. In a real app, this would come from an API or state.
const recentTrips = [
{ id: 1, destination: 'Downtown Mall', distance: 25, date: '2024-01-15', efficiency: 4.2, cost: 180 },
{ id: 2, destination: 'Airport', distance: 45, date: '2024-01-14', efficiency: 4.5, cost: 320 },
{ id: 3, destination: 'Beach Resort', distance: 78, date: '2024-01-13', efficiency: 4.1, cost: 560 },
];

// Hardcoded data for nearby charging stations.
const nearbyStations = [
{ id: 1, name: 'Green Energy Hub', distance: 2.1, type: 'Fast Charge', available: 3, total: 4, price: 8.5 },
{ id: 2, name: 'City Center Station', distance: 3.5, type: 'Standard', available: 2, total: 6, price: 6.2 },
{ id: 3, name: 'Highway Plaza', distance: 5.2, type: 'Fast Charge', available: 1, total: 2, price: 9.0 },
];

// Function to determine the color of the battery health text based on its value.
const batteryHealthColor = (health) => {
if (health >= 90) return 'text-green-600';
if (health >= 70) return 'text-yellow-600';
return 'text-red-600';
};

// Function to determine the background color of the battery health card.
const batteryHealthBg = (health) => {
if (health >= 90) return 'bg-green-100 dark:bg-green-900/20';
if (health >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
return 'bg-red-100 dark:bg-red-900/20';
};

// If the user has not completed onboarding, show a setup screen.
if (!user?.hasCompletedOnboarding) {
return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
        <div className="mb-8">
        <Car className="h-16 w-16 text-orange-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Setup
        </h1>
        <p className="text-amber-700 dark:text-gray-400">
            Add your first EV to get started with EvPath
        </p>
        </div>
        <Link
        to="/onboarding"
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors"
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
<div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header Section */}
    <div className="mb-8">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name}!
            </h1>
            <p className="text-amber-700 dark:text-gray-400 mt-1 font-medium">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
        <div className="flex items-center space-x-4">
            <Link
            to="/my-evs"
            className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors border border-orange-100 dark:border-gray-600"
            >
            <Plus className="h-4 w-4 mr-2" />
            Add EV
            </Link>
        </div>
        </div>
    </div>

    {/* Quick Stats Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-gray-700 p-6">
        <div className="flex items-center">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
            <Car className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
            <p className="text-sm font-medium text-amber-700 dark:text-gray-400">Total EVs</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{evs.length}</p>
            </div>
        </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-gray-700 p-6">
        <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Route className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
            <p className="text-sm font-medium text-amber-700 dark:text-gray-400">Total Trips</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{recentTrips.length}</p>
            </div>
        </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-gray-700 p-6">
        <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
            <p className="text-sm font-medium text-amber-700 dark:text-gray-400">Monthly Savings</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">₹2,450</p>
            </div>
        </div>
        </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
        {/* Current EV Status */}
        {defaultEV && (
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    {defaultEV.brand} {defaultEV.model}
                    </h2>
                    <p className="text-amber-700 dark:text-gray-400 font-medium">Primary Vehicle</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-sm text-amber-700 dark:text-gray-400">Default</span>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Battery Status */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Battery Level</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{defaultEV.currentCharge}%</span>
                    </div>
                    <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div
                        className={`h-4 rounded-full transition-all duration-1000 ${
                            defaultEV.currentCharge > 50 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                            defaultEV.currentCharge > 20 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                            'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${defaultEV.currentCharge}%` }}
                        />
                    </div>
                    <Battery className="absolute -right-8 top-0 h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex justify-between text-sm text-amber-700 dark:text-gray-400">
                    <span>0%</span>
                    <span className="font-medium">Range: {Math.round(defaultEV.range * (defaultEV.currentCharge / 100))} km</span>
                    <span>100%</span>
                    </div>
                </div>

                {/* Battery Health */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Battery Health</span>
                    <span className={`text-sm font-bold ${batteryHealthColor(defaultEV.batteryHealth)}`}>
                        {defaultEV.batteryHealth.toFixed(1)}%
                    </span>
                    </div>
                    <div className={`p-4 rounded-lg ${batteryHealthBg(defaultEV.batteryHealth)}`}>
                    <div className="flex items-center space-x-2">
                        <Activity className={`h-5 w-5 ${batteryHealthColor(defaultEV.batteryHealth)}`} />
                        <div>
                        <p className={`text-sm font-medium ${batteryHealthColor(defaultEV.batteryHealth)}`}>
                            {defaultEV.batteryHealth >= 90 ? 'Excellent' : defaultEV.batteryHealth >= 70 ? 'Good' : 'Fair'}
                        </p>
                        <p className="text-xs text-amber-700 dark:text-gray-400">
                            {defaultEV.batteryHealth >= 90 ? 'Your battery is in excellent condition' :
                            defaultEV.batteryHealth >= 70 ? 'Battery performance is good' :
                            'Consider battery maintenance'}
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
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-gray-700">
            <div className="p-6 border-b border-orange-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Trips</h2>
                <Link
                to="/trips"
                className="text-orange-600 hover:text-emerald-700 font-medium text-sm flex items-center"
                >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </div>
            </div>
            <div className="p-6">
            <div className="space-y-4">
                {recentTrips.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                        <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{trip.destination}</h3>
                        <p className="text-sm text-amber-700 dark:text-gray-400">
                        {trip.distance} km • {trip.efficiency} km/kWh
                        </p>
                    </div>
                    </div>
                    <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">₹{trip.cost}</p>
                    <p className="text-sm text-amber-700 dark:text-gray-400">{trip.date}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
        {/* Nearby Charging Stations */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-gray-700">
            <div className="p-6 border-b border-orange-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Nearby Stations</h2>
                <Link
                to="/map"
                className="text-orange-600 hover:text-emerald-700 font-medium text-sm flex items-center"
                >
                View Map
                <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </div>
            </div>
            <div className="p-6">
            <div className="space-y-4">
                {nearbyStations.map((station) => (
                <div key={station.id} className="p-4 border border-orange-100 dark:border-gray-600 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{station.name}</h3>
                    <span className="text-sm text-orange-600 font-medium">₹{station.price}/kWh</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-amber-700 dark:text-gray-400">
                    <span>{station.distance} km away</span>
                    <span className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                        station.available > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {station.available}/{station.total} available
                    </span>
                    </div>
                    <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        station.type === 'Fast Charge'  
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                        {station.type}
                    </span>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-gray-700">
            <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
                <Link
                to="/map"
                className="flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                >
                <MapPin className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Find Charging Stations</span>
                </Link>
                <Link
                to="/trip-planner"
                className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                <Route className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-blue-700 dark:text-blue-400 font-medium">Plan Route</span>
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
                className="flex items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                <BookOpen className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-orange-700 dark:text-orange-400 font-medium">Read Blogs</span>
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
