import React, { useState } from 'react';
import { MapPin, Navigation, Route, Clock, Battery, Zap, Star, DollarSign, AlertTriangle, CheckCircle, ArrowRight, RefreshCw, Settings } from 'lucide-react';
import { useEV } from '../contexts/EVContext';

// This is the functional component for the Trip Planner page.
const TripPlannerPage = () => {
// Get the default EV from the context.
const { getDefaultEV } = useEV();

// State for trip planning inputs.
const [fromLocation, setFromLocation] = useState('');
const [toLocation, setToLocation] = useState('');
const [currentBattery, setCurrentBattery] = useState(80);

// State for trip planning results and UI.
const [routes, setRoutes] = useState([]);
const [selectedRoute, setSelectedRoute] = useState(null);
const [isPlanning, setIsPlanning] = useState(false);
const [showAdvanced, setShowAdvanced] = useState(false);

// State for advanced trip planning preferences.
const [preferences, setPreferences] = useState({
chargingSpeed: 'any',
maxDetour: 10,
preferredNetworks: [],
avoidTolls: false
});

const defaultEV = getDefaultEV();

// Mock route data. In a real application, this would come from an API.
const mockRoutes = [
{
    id: '1',
    name: 'Fastest Route',
    distance: 285,
    duration: 240, // minutes
    energyRequired: 68,
    totalCost: 850,
    recommended: true,
    chargingStops: [
    {
        id: 'cs1',
        name: 'Highway Express Charging Hub',
        address: 'NH-1, Sector 45, Gurgaon',
        distance: 120,
        chargingTime: 25,
        price: 8.5,
        type: 'Fast Charge',
        available: 4,
        total: 6,
        rating: 4.6,
        plugTypes: ['CCS', 'CHAdeMO'],
        amenities: ['Restaurant', 'WiFi', 'Restroom', 'Shopping']
    },
    {
        id: 'cs2',
        name: 'Green Energy Station',
        address: 'Delhi-Jaipur Highway, Rewari',
        distance: 200,
        chargingTime: 30,
        price: 7.8,
        type: 'Fast Charge',
        available: 2,
        total: 4,
        rating: 4.3,
        plugTypes: ['CCS', 'Type 2'],
        amenities: ['Cafe', 'Parking', 'ATM']
    }
    ]
},
{
    id: '2',
    name: 'Most Economical',
    distance: 295,
    duration: 270,
    energyRequired: 70,
    totalCost: 680,
    recommended: false,
    chargingStops: [
    {
        id: 'cs3',
        name: 'Budget Charge Point',
        address: 'State Highway 2, Alwar',
        distance: 140,
        chargingTime: 45,
        price: 6.2,
        type: 'Standard',
        available: 3,
        total: 5,
        rating: 4.1,
        plugTypes: ['Type 2', 'Type 1'],
        amenities: ['Parking', 'Restroom']
    },
    {
        id: 'cs4',
        name: 'City Center Charging',
        address: 'Main Market, Jaipur Outskirts',
        distance: 220,
        chargingTime: 35,
        price: 6.8,
        type: 'Standard',
        available: 1,
        total: 3,
        rating: 3.9,
        plugTypes: ['Type 2'],
        amenities: ['Shopping', 'Food Court']
    }
    ]
},
{
    id: '3',
    name: 'Scenic Route',
    distance: 320,
    duration: 300,
    energyRequired: 75,
    totalCost: 920,
    recommended: false,
    chargingStops: [
    {
        id: 'cs5',
        name: 'Mountain View Charging',
        address: 'Hill Station Road, Neemrana',
        distance: 110,
        chargingTime: 30,
        price: 9.2,
        type: 'Fast Charge',
        available: 2,
        total: 3,
        rating: 4.8,
        plugTypes: ['CCS', 'CHAdeMO', 'Type 2'],
        amenities: ['Restaurant', 'View Point', 'WiFi']
    },
    {
        id: 'cs6',
        name: 'Heritage Charging Hub',
        address: 'Palace Road, Alwar Fort',
        distance: 180,
        chargingTime: 25,
        price: 8.8,
        type: 'Fast Charge',
        available: 3,
        total: 4,
        rating: 4.5,
        plugTypes: ['CCS', 'Type 2'],
        amenities: ['Heritage Site', 'Cafe', 'Parking']
    },
    {
        id: 'cs7',
        name: 'Lake Side Station',
        address: 'Siliserh Lake, Alwar',
        distance: 250,
        chargingTime: 20,
        price: 8.0,
        type: 'Fast Charge',
        available: 1,
        total: 2,
        rating: 4.4,
        plugTypes: ['CCS'],
        amenities: ['Lake View', 'Boating', 'Restaurant']
    }
    ]
}
];

// Function to simulate planning a trip.
const handlePlanTrip = async () => {
if (!fromLocation || !toLocation) return;

setIsPlanning(true);

// Simulate API call with a delay.
setTimeout(() => {
    setRoutes(mockRoutes);
    setSelectedRoute(mockRoutes[0]);
    setIsPlanning(false);
}, 2000);
};

// Function to calculate the estimated battery level at the end of the trip.
const calculateBatteryAtDestination = (route) => {
if (!defaultEV) return 0;
const batteryUsed = (route.energyRequired / defaultEV.batteryCapacity) * 100;
return Math.max(0, currentBattery - batteryUsed);
};

// Function to format duration from minutes to hours and minutes.
const formatDuration = (minutes) => {
const hours = Math.floor(minutes / 60);
const mins = minutes % 60;
return `${hours}h ${mins}m`;
};

// Helper functions for dynamic battery color styling.
const getBatteryColor = (percentage) => {
if (percentage > 50) return 'text-green-600';
if (percentage > 20) return 'text-yellow-600';
return 'text-red-600';
};

const getBatteryBg = (percentage) => {
if (percentage > 50) return 'bg-green-100 dark:bg-green-900/20';
if (percentage > 20) return 'bg-yellow-100 dark:bg-yellow-900/20';
return 'bg-red-100 dark:bg-red-900/20';
};

return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header Section */}
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
        Smart Trip Planner
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
        Plan your EV journey with optimal charging stops
        </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Planning Form Sidebar */}
        <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Plan Your Trip
            </h2>

            <div className="space-y-6">
            {/* From Location Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From
                </label>
                <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Enter starting location"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                </div>
            </div>

            {/* To Location Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To
                </label>
                <div className="relative">
                <Navigation className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                </div>
            </div>

            {/* Current Battery Level Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Battery Level
                </label>
                <div className="space-y-3">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentBattery}
                    onChange={(e) => setCurrentBattery(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">0%</span>
                    <div className="flex items-center space-x-2">
                    <Battery className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentBattery}%
                    </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">100%</span>
                </div>
                </div>
            </div>

            {/* Advanced Options Toggle */}
            <div>
                <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                <Settings className="h-4 w-4" />
                <span>Advanced Options</span>
                </button>

                {showAdvanced && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Charging Speed Preference
                    </label>
                    <select
                        value={preferences.chargingSpeed}
                        onChange={(e) => setPreferences({...preferences, chargingSpeed: e.target.value})}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="any">Any Speed</option>
                        <option value="fast">Fast Charging Only</option>
                        <option value="standard">Standard Charging</option>
                    </select>
                    </div>

                    <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="avoidTolls"
                        checked={preferences.avoidTolls}
                        onChange={(e) => setPreferences({...preferences, avoidTolls: e.target.checked})}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="avoidTolls" className="text-sm text-gray-700 dark:text-gray-300">
                        Avoid toll roads
                    </label>
                    </div>
                </div>
                )}
            </div>

            {/* Plan Trip Button */}
            <button
                onClick={handlePlanTrip}
                disabled={!fromLocation || !toLocation || isPlanning}
                className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
                {isPlanning ? (
                <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Planning Route...</span>
                </>
                ) : (
                <>
                    <Route className="h-5 w-5" />
                    <span>Plan Trip</span>
                </>
                )}
            </button>
            </div>
        </div>
        </div>

        {/* Route Results Display */}
        <div className="lg:col-span-2">
        {routes.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Route className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Plan Your Trip?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
                Enter your starting point and destination to see optimal routes with charging stations
            </p>
            </div>
        ) : (
            <div className="space-y-6">
            {/* Route Options List */}
            <div className="space-y-4">
                {routes.map((route) => (
                <div
                    key={route.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border cursor-pointer transition-all duration-200 ${
                    selectedRoute?.id === route.id
                        ? 'border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedRoute(route)}
                >
                    <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                            route.recommended 
                            ? 'bg-emerald-100 dark:bg-emerald-900/20' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                            <Route className={`h-5 w-5 ${
                            route.recommended ? 'text-emerald-600' : 'text-gray-600'
                            }`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {route.name}
                            </h3>
                            {route.recommended && (
                            <span className="inline-block px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                                Recommended
                            </span>
                            )}
                        </div>
                        </div>
                        <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{route.totalCost}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Navigation className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{route.distance} km</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Distance</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Clock className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDuration(route.duration)}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Zap className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{route.chargingStops.length}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Charging Stops</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Battery className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                        <p className={`text-sm font-medium ${getBatteryColor(calculateBatteryAtDestination(route))}`}>
                            {calculateBatteryAtDestination(route).toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Battery at End</p>
                        </div>
                    </div>

                    {/* Charging Stops Preview */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>Stops:</span>
                        {route.chargingStops.slice(0, 2).map((stop, index) => (
                        <span key={stop.id} className="flex items-center">
                            {index > 0 && <ArrowRight className="h-3 w-3 mx-1" />}
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                            {stop.name.split(' ')[0]}
                            </span>
                        </span>
                        ))}
                        {route.chargingStops.length > 2 && (
                        <span className="text-xs">+{route.chargingStops.length - 2} more</span>
                        )}
                    </div>
                    </div>
                </div>
                ))}
            </div>

            {/* Detailed Route View */}
            {selectedRoute && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Route Details: {selectedRoute.name}
                    </h3>
                </div>

                <div className="p-6">
                    {/* Route Timeline */}
                    <div className="space-y-6">
                    {/* Starting Point */}
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-white" />
                        </div>
                        </div>
                        <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">Starting Point</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{fromLocation}</p>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getBatteryBg(currentBattery)}`}>
                            <Battery className={`h-4 w-4 inline mr-1 ${getBatteryColor(currentBattery)}`} />
                            <span className={getBatteryColor(currentBattery)}>{currentBattery}% Battery</span>
                        </div>
                        </div>
                    </div>

                    {/* Charging Stops */}
                    {selectedRoute.chargingStops.map((stop, index) => (
                        <div key={stop.id} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-1 h-8 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Zap className="h-4 w-4 text-white" />
                            </div>
                            {index < selectedRoute.chargingStops.length - 1 && (
                            <div className="w-1 h-8 bg-gray-300 dark:bg-gray-600"></div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{stop.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stop.address}</p>
                                </div>
                                <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stop.rating}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{stop.distance} km</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">From Start</p>
                                </div>
                                <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{stop.chargingTime} min</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Charging Time</p>
                                </div>
                                <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">₹{stop.price}/kWh</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Price</p>
                                </div>
                                <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{stop.available}/{stop.total}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {stop.plugTypes.map((plug) => (
                                <span key={plug} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded">
                                    {plug}
                                </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {stop.amenities.map((amenity) => (
                                <span key={amenity} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded">
                                    {amenity}
                                </span>
                                ))}
                            </div>
                            </div>
                        </div>
                        </div>
                    ))}

                    {/* Destination */}
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-1 h-8 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        </div>
                        <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">Destination</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{toLocation}</p>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getBatteryBg(calculateBatteryAtDestination(selectedRoute))}`}>
                            <Battery className={`h-4 w-4 inline mr-1 ${getBatteryColor(calculateBatteryAtDestination(selectedRoute))}`} />
                            <span className={getBatteryColor(calculateBatteryAtDestination(selectedRoute))}>
                            {calculateBatteryAtDestination(selectedRoute).toFixed(0)}% Battery Remaining
                            </span>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                        Start Navigation
                    </button>
                    <button className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                        Save Route
                    </button>
                    </div>
                </div>
                </div>
            )}
            </div>
        )}
        </div>
    </div>
    </div>
</div>
);
};

export default TripPlannerPage;
