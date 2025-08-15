import React, { useState } from 'react';
import { MapPin, Filter, Search, Navigation, Zap, Clock, Star, DollarSign, Battery, Route } from 'lucide-react';

const MapPage: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const chargingStations = [
    {
      id: 1,
      name: 'Green Energy Hub',
      address: '123 Main St, Downtown',
      distance: 2.1,
      type: 'Fast Charge',
      available: 3,
      total: 4,
      price: 8.5,
      rating: 4.5,
      amenities: ['Restaurant', 'WiFi', 'Restroom'],
      plugTypes: ['CCS', 'CHAdeMO', 'Type 2'],
      coords: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      name: 'City Center Station',
      address: '456 Oak Ave, Midtown',
      distance: 3.5,
      type: 'Standard',
      available: 2,
      total: 6,
      price: 6.2,
      rating: 4.2,
      amenities: ['Shopping', 'Parking'],
      plugTypes: ['Type 2', 'Type 1'],
      coords: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 3,
      name: 'Highway Plaza',
      address: '789 Highway 101, Outskirts',
      distance: 5.2,
      type: 'Fast Charge',
      available: 1,
      total: 2,
      price: 9.0,
      rating: 4.0,
      amenities: ['Gas Station', 'Convenience Store'],
      plugTypes: ['CCS', 'CHAdeMO'],
      coords: { lat: 40.6892, lng: -74.0445 }
    },
    {
      id: 4,
      name: 'Mall Parking Station',
      address: '321 Shopping Blvd, Mall District',
      distance: 4.8,
      type: 'Standard',
      available: 4,
      total: 8,
      price: 5.8,
      rating: 4.3,
      amenities: ['Mall', 'Food Court', 'WiFi'],
      plugTypes: ['Type 2', 'Type 1'],
      coords: { lat: 40.7505, lng: -73.9934 }
    },
    {
      id: 5,
      name: 'Airport Express',
      address: '555 Terminal Rd, Airport',
      distance: 12.5,
      type: 'Fast Charge',
      available: 6,
      total: 10,
      price: 10.2,
      rating: 4.7,
      amenities: ['Airport', 'Lounge', 'WiFi'],
      plugTypes: ['CCS', 'CHAdeMO', 'Type 2'],
      coords: { lat: 40.6413, lng: -73.7781 }
    }
  ];

  const filteredStations = chargingStations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'fast' && station.type === 'Fast Charge') ||
                         (filterType === 'standard' && station.type === 'Standard') ||
                         (filterType === 'available' && station.available > 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-full md:w-96 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Charging Stations
            </h1>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('fast')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'fast'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Fast Charge
              </button>
              <button
                onClick={() => setFilterType('standard')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'standard'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setFilterType('available')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterType === 'available'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Available
              </button>
            </div>
          </div>

          {/* Station List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {filteredStations.map((station) => (
                <div
                  key={station.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedStation?.id === station.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                  }`}
                  onClick={() => setSelectedStation(station)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{station.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{station.address}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{station.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Navigation className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{station.distance} km</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">₹{station.price}/kWh</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      station.type === 'Fast Charge'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {station.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        station.available > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {station.available}/{station.total} available
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {station.plugTypes.map((plugType) => (
                        <span
                          key={plugType}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {plugType}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-gray-200 dark:bg-gray-700">
          {/* Map Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Interactive Map
              </h2>
              <p className="text-gray-500 dark:text-gray-500">
                Map integration with Google Maps or Mapbox would go here
              </p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Navigation className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Station Details Popup */}
          {selectedStation && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStation.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStation.address}</p>
                  </div>
                  <button
                    onClick={() => setSelectedStation(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Navigation className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedStation.distance} km</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Distance</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <DollarSign className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">₹{selectedStation.price}/kWh</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Price</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Availability</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedStation.available}/{selectedStation.total} available
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(selectedStation.available / selectedStation.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedStation.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                    <Route className="h-4 w-4 inline mr-1" />
                    Navigate
                  </button>
                  <button className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                    <Battery className="h-4 w-4 inline mr-1" />
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;