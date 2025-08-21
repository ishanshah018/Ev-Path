import React, { useState, useRef, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import { 
  MapPin, Navigation, Route, Clock, Battery, Zap, Star, RefreshCw, 
  ChevronDown, ChevronUp, Car, Fuel, Leaf, TreePine, IndianRupee,
  Timer, Gauge, AlertCircle, CheckCircle, Info
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { applyLeafletIconFix } from "../leaflet-fix";
import L from "leaflet";

// Apply leaflet icon fix
applyLeafletIconFix();

// Custom icons for map markers
const createCustomIcon = (type, color = '#10b981') => {
  const iconMap = {
    start: '🚗',
    end: '🏁', 
    charging: '⚡',
    stop: '🔋'
  };
  
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        ${iconMap[type] || '📍'}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

export default function TripPlannerPage() {
  const { darkMode: isDarkMode } = useTheme();
  
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [vehicleRange, setVehicleRange] = useState(300);
  const [currentBattery, setCurrentBattery] = useState(80);
  
  const [isPlanning, setIsPlanning] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    costs: false,
    charging: false,
    environmental: false,
    stations: false
  });
  
  const mapRef = useRef();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handlePlanTrip = async () => {
    if (!fromLocation.trim() || !toLocation.trim()) {
      setError("Please enter both source and destination cities");
      return;
    }

    if (fromLocation.toLowerCase().trim() === toLocation.toLowerCase().trim()) {
      setError("Source and destination cannot be the same");
      return;
    }

    setIsPlanning(true);
    setError(null);
    setTripData(null);

    try {
      const params = new URLSearchParams({
        from: fromLocation,
        to: toLocation,
        vehicle_range: vehicleRange,
        current_battery: currentBattery
      });

      const response = await fetch(`http://localhost:8000/api/plan-trip?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Failed to plan trip');
      }

      if (data.success) {
        setTripData(data);
        setError(null);
        
        // Auto-zoom to route bounds
        setTimeout(() => {
          if (mapRef.current && data.routes?.[0]?.coordinates) {
            const bounds = L.latLngBounds(
              data.routes[0].coordinates.map(coord => [coord[1], coord[0]])
            );
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
          }
        }, 100);
      } else {
        throw new Error(data.error || 'Trip planning failed');
      }
    } catch (err) {
      console.error('Trip planning error:', err);
      setError(err.message || 'Failed to plan your trip. Please try again.');
    } finally {
      setIsPlanning(false);
    }
  };

  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900',
    button: 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700',
    success: isDarkMode ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: isDarkMode ? 'bg-yellow-900/30 border-yellow-700 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: isDarkMode ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300 ${theme.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme.text}`}>
              Professional EV Trip Planner
          </h1>
          <p className={`text-lg ${theme.textSecondary} max-w-3xl mx-auto`}>
            Plan your perfect EV journey with accurate routing, real charging stations, detailed cost analysis, and environmental impact assessment
          </p>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel - Trip Planning Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`rounded-2xl p-6 shadow-lg border ${theme.card}`}>
              <div className="flex items-center mb-6">
                <Navigation className="h-6 w-6 text-emerald-600 mr-3" />
                <h2 className={`text-xl font-semibold ${theme.text}`}>Plan Your Journey</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    <MapPin className="h-4 w-4 inline mr-2" />
                    From (Source City)
                  </label>
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${theme.input}`}
                    disabled={isPlanning}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    <MapPin className="h-4 w-4 inline mr-2" />
                    To (Destination City)
                  </label>
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="e.g., Pune, Chennai, Hyderabad"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${theme.input}`}
                    disabled={isPlanning}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      <Battery className="h-4 w-4 inline mr-2" />
                      Vehicle Range (km)
                    </label>
                    <input
                      type="number"
                      value={vehicleRange}
                      onChange={(e) => setVehicleRange(Number(e.target.value))}
                      min="100"
                      max="600"
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${theme.input}`}
                      disabled={isPlanning}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      <Gauge className="h-4 w-4 inline mr-2" />
                      Current Battery (%)
                    </label>
                    <input
                      type="number"
                      value={currentBattery}
                      onChange={(e) => setCurrentBattery(Number(e.target.value))}
                      min="0"
                      max="100"
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${theme.input}`}
                      disabled={isPlanning}
                    />
                  </div>
                </div>

                <button
                  onClick={handlePlanTrip}
                  disabled={isPlanning || !fromLocation.trim() || !toLocation.trim()}
                  className={`w-full py-4 px-6 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${theme.button}`}
                >
                  {isPlanning ? (
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Planning Your Trip...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Route className="h-5 w-5" />
                      <span>Plan My EV Trip</span>
                    </div>
                  )}
                </button>

                {error && (
                  <div className={`p-4 rounded-xl border ${theme.error}`}>
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trip Summary */}
            {tripData && (
              <div className={`rounded-2xl p-6 shadow-lg border ${theme.card}`}>
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <h3 className={`text-xl font-semibold ${theme.text}`}>Trip Summary</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>Distance:</span>
                    <span className={`font-semibold ${theme.text}`}>
                      {tripData.trip_summary.distance_km} km
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>Duration:</span>
                    <span className={`font-semibold ${theme.text}`}>
                      {formatTime(tripData.trip_summary.duration_minutes)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>Charging Stops:</span>
                    <span className={`font-semibold ${theme.text}`}>
                      {tripData.routes[selectedRoute].charging_stops_count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme.textSecondary}>EV Trip Cost:</span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(tripData.routes[selectedRoute].costs.ev_cost)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Map and Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Map */}
            <div className={`rounded-2xl p-4 shadow-lg border ${theme.card}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${theme.text}`}>
                  🗺️ Route & Charging Network
                </h3>
                {tripData && (
                  <div className={`text-sm ${theme.textMuted}`}>
                    {tripData.charging_stations_summary?.total_found || tripData.charging_stations.length} real charging stations found
                    
                  </div>
                )}
              </div>
              
              <div className="h-96 rounded-xl overflow-hidden">
                <MapContainer
                  ref={mapRef}
                  center={[20.5937, 78.9629]}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-xl"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                  />
                  
                  {/* Route Polyline */}
                  {tripData?.routes[selectedRoute]?.coordinates && (
                    <Polyline
                      positions={tripData.routes[selectedRoute].coordinates.map(coord => [coord[1], coord[0]])}
                      color="#10b981"
                      weight={5}
                      opacity={0.8}
                    />
                  )}
                  
                  {/* Start and End Markers */}
                  {tripData && (
                    <>
                      <Marker
                        position={[tripData.trip_summary.source.lat, tripData.trip_summary.source.lon]}
                        icon={createCustomIcon('start', '#22c55e')}
                      >
                        <Popup>
                          <div className="text-center">
                            <strong>🚗 Start: {tripData.trip_summary.source.name}</strong>
                            <div className="text-sm text-gray-600 mt-1">
                              Battery: {currentBattery}% • Range: {Math.round((currentBattery/100) * vehicleRange)} km
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                      
                      <Marker
                        position={[tripData.trip_summary.destination.lat, tripData.trip_summary.destination.lon]}
                        icon={createCustomIcon('end', '#ef4444')}
                      >
                        <Popup>
                          <strong>🏁 End: {tripData.trip_summary.destination.name}</strong>
                        </Popup>
                      </Marker>
                    </>
                  )}
                  
                  {/* Charging Stations */}
                  {tripData?.charging_stations && (
                    <MarkerClusterGroup>
                      {tripData.charging_stations.map((station, index) => (
                        <Marker
                          key={station.id || index}
                          position={[station.lat, station.lon]}
                          icon={createCustomIcon('charging', '#f59e0b')}
                        >
                          <Popup>
                            <div className="max-w-xs">
                              <div className="font-bold text-lg mb-2">
                                ⚡ {station.name}
                                {station.real_data && (
                                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                    Real Data
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div><strong>📍 Address:</strong> {station.address}</div>
                                {station.town && <div><strong>🏘️ City:</strong> {station.town}</div>}
                                <div><strong>🏢 Operator:</strong> {station.operator || 'Unknown'}</div>
                                <div><strong>📊 Status:</strong> 
                                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                    station.status === 'Operational' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {station.status || 'Unknown'}
                                  </span>
                                </div>
                                {station.distance_from_route !== undefined && (
                                  <div><strong>📏 Distance from route:</strong> {station.distance_from_route} km</div>
                                )}
                                {station.score && (
                                  <div><strong>⭐ Score:</strong> {station.score}/100</div>
                                )}
                                {station.connections && station.connections.length > 0 && (
                                  <div className="mt-2">
                                    <strong>🔌 Connectors:</strong>
                                    {station.connections.slice(0, 3).map((conn, idx) => (
                                      <div key={idx} className="text-xs text-gray-600 ml-2">
                                        • {conn.type} {conn.power_kw && `(${conn.power_kw} kW)`}
                                        {conn.charging_speed && ` - ${conn.charging_speed}`}
                                        {conn.quantity > 1 && ` × ${conn.quantity}`}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {station.last_verified && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Last verified: {new Date(station.last_verified).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MarkerClusterGroup>
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Detailed Analysis Cards */}
            {tripData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Cost Analysis */}
                <div className={`rounded-2xl p-6 shadow-lg border ${theme.card}`}>
                  <button
                    onClick={() => toggleSection('costs')}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <IndianRupee className="h-6 w-6 text-emerald-600 mr-3" />
                      <h3 className={`text-xl font-semibold ${theme.text}`}>Cost Analysis</h3>
                    </div>
                    {expandedSections.costs ? 
                      <ChevronUp className={`h-5 w-5 ${theme.textSecondary}`} /> : 
                      <ChevronDown className={`h-5 w-5 ${theme.textSecondary}`} />
                    }
                  </button>
                  
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-emerald-700 dark:text-emerald-300">⚡ EV Cost</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">
                          {formatCurrency(tripData.cost_comparison.ev_cost)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-orange-700 dark:text-orange-300">⛽ Petrol Cost</span>
                        <span className="font-bold text-orange-700 dark:text-orange-300">
                          {formatCurrency(tripData.cost_comparison.petrol_cost)}
                        </span>
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                        💰 Save {formatCurrency(tripData.cost_comparison.savings_vs_petrol)}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-blue-700 dark:text-blue-300">🛢️ Diesel Cost</span>
                        <span className="font-bold text-blue-700 dark:text-blue-300">
                          {formatCurrency(tripData.cost_comparison.diesel_cost)}
                        </span>
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        💰 Save {formatCurrency(tripData.cost_comparison.savings_vs_diesel)}
                      </div>
                    </div>

                    {expandedSections.costs && (
                      <div className={`mt-4 p-4 rounded-lg border ${theme.card}`}>
                        <h4 className={`font-semibold mb-2 ${theme.text}`}>Detailed Breakdown</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className={theme.textSecondary}>Petrol needed:</span>
                            <span className={theme.text}>{tripData.routes[selectedRoute].fuel_efficiency.petrol_liters_needed}L @ ₹{tripData.cost_comparison.fuel_prices.petrol_per_liter}/L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={theme.textSecondary}>Diesel needed:</span>
                            <span className={theme.text}>{tripData.routes[selectedRoute].fuel_efficiency.diesel_liters_needed}L @ ₹{tripData.cost_comparison.fuel_prices.diesel_per_liter}/L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={theme.textSecondary}>EV energy needed:</span>
                            <span className={theme.text}>{tripData.routes[selectedRoute].fuel_efficiency.ev_kwh_needed} kWh @ ₹{tripData.cost_comparison.fuel_prices.ev_per_km}/km</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Charging Analysis */}
                <div className={`rounded-2xl p-6 shadow-lg border ${theme.card}`}>
                  <button
                    onClick={() => toggleSection('charging')}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Battery className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className={`text-xl font-semibold ${theme.text}`}>Charging Plan</h3>
                    </div>
                    {expandedSections.charging ? 
                      <ChevronUp className={`h-5 w-5 ${theme.textSecondary}`} /> : 
                      <ChevronDown className={`h-5 w-5 ${theme.textSecondary}`} />
                    }
                  </button>
                  
                  <div className="mt-4">
                    {tripData.charging_analysis.charging_required ? (
                      <div className="space-y-4">
                        <div className={`p-4 rounded-lg border ${theme.warning}`}>
                          <div className="flex items-center mb-2">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <span className="font-semibold">Charging Required</span>
                          </div>
                          <div className="text-sm space-y-1">
                            <div>Current range: {tripData.charging_analysis.current_range} km</div>
                            <div>Total distance: {tripData.trip_summary.distance_km} km</div>
                            <div>Stops needed: {tripData.charging_analysis.total_stops_needed}</div>
                            <div>Total charging time: ~{tripData.charging_analysis.total_charging_time_minutes} minutes</div>
                          </div>
                        </div>

                        {expandedSections.charging && tripData.routes[selectedRoute].charging_stops.length > 0 && (
                          <div className="space-y-3">
                            <h4 className={`font-semibold ${theme.text}`}>Recommended Charging Stops</h4>
                            {tripData.routes[selectedRoute].charging_stops.map((stop, index) => (
                              <div key={index} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-semibold">🔋 Stop #{stop.stop_number}</span>
                                  <span className="text-sm text-gray-500">{stop.distance_from_start} km from start</span>
                                </div>
                                <div className="text-sm space-y-1">
                                  <div>Remaining distance: {stop.remaining_distance} km</div>
                                  <div>Charge time: {stop.estimated_charge_time}</div>
                                  <div>Estimated cost: {stop.charge_cost_estimate}</div>
                                  <div>Battery: {stop.battery_before} → {stop.battery_after}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`p-4 rounded-lg border ${theme.success}`}>
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-semibold">No Charging Required!</span>
                        </div>
                        <div className="text-sm mt-1">
                          Your current battery ({currentBattery}%) provides {tripData.charging_analysis.current_range} km range, sufficient for this {tripData.trip_summary.distance_km} km trip.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className={`rounded-2xl p-6 shadow-lg border ${theme.card}`}>
                  <button
                    onClick={() => toggleSection('environmental')}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <TreePine className="h-6 w-6 text-green-600 mr-3" />
                      <h3 className={`text-xl font-semibold ${theme.text}`}>Environmental Impact</h3>
                    </div>
                    {expandedSections.environmental ? 
                      <ChevronUp className={`h-5 w-5 ${theme.textSecondary}`} /> : 
                      <ChevronDown className={`h-5 w-5 ${theme.textSecondary}`} />
                    }
                  </button>
                  
                  <div className="mt-4 space-y-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {tripData.environmental_impact.co2_saved_kg} kg
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">CO₂ Emissions Saved</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        🌳 {tripData.environmental_impact.equivalent_trees}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Trees Worth of CO₂ Absorption</div>
                    </div>

                    {expandedSections.environmental && (
                      <div className={`p-4 rounded-lg border ${theme.card}`}>
                        <h4 className={`font-semibold mb-2 ${theme.text}`}>Impact Details</h4>
                        <div className="text-sm space-y-1">
                          <div>🚗 Petrol car emissions: ~2.3 kg CO₂/km</div>
                          <div>⚡ EV emissions: ~0.5 kg CO₂/km (grid mix)</div>
                          <div>🌱 Net reduction: {((2.3 - 0.5) * tripData.trip_summary.distance_km).toFixed(1)} kg CO₂</div>
                          <div>🌳 Equivalent to planting {tripData.environmental_impact.equivalent_trees} trees</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Charging Stations List */}
                <div className={`rounded-2xl p-6 shadow-lg border ${theme.card}`}>
                  <button
                    onClick={() => toggleSection('stations')}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Zap className="h-6 w-6 text-yellow-600 mr-3" />
                      <h3 className={`text-xl font-semibold ${theme.text}`}>
                        Real Charging Stations ({tripData.charging_stations.length})
                      </h3>
                    </div>
                    {expandedSections.stations ? 
                      <ChevronUp className={`h-5 w-5 ${theme.textSecondary}`} /> : 
                      <ChevronDown className={`h-5 w-5 ${theme.textSecondary}`} />
                    }
                  </button>
                  
                  {expandedSections.stations && (
                    <div className="mt-4 max-h-96 overflow-y-auto space-y-3">
                      {tripData.charging_stations.slice(0, 15).map((station, index) => (
                        <div key={station.id || index} className={`p-4 rounded-lg border ${theme.card} hover:shadow-md transition-shadow`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className={`font-semibold ${theme.text}`}>{station.name}</div>
                                {station.real_data && (
                                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                    Real Data
                                  </span>
                                )}
                                {station.score && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    ⭐ {station.score}
                                  </span>
                                )}
                              </div>
                              <div className={`text-sm ${theme.textSecondary}`}>
                                {station.address}
                                {station.town && `, ${station.town}`}
                              </div>
                              <div className={`text-xs ${theme.textMuted} mt-1`}>
                                {station.operator && `Operator: ${station.operator}`}
                                {station.last_verified && (
                                  <span className="ml-2">• Verified: {new Date(station.last_verified).toLocaleDateString()}</span>
                                )}
                              </div>
                              {station.connections && station.connections.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {station.connections.slice(0, 2).map((conn, idx) => (
                                    <span key={idx} className="mr-2">
                                      {conn.type} {conn.power_kw && `(${conn.power_kw} kW)`}
                                      {conn.charging_speed && ` - ${conn.charging_speed}`}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <div className={`text-sm font-semibold ${theme.text}`}>
                                {station.connections && station.connections.length ? 
                                  `${Math.max(...station.connections.map(c => c.power_kw || 0))} kW` : 
                                  '—'
                                }
                              </div>
                              <div className={`text-xs ${
                                station.status === 'Operational' ? 'text-green-600' : 'text-yellow-600'
                              }`}>
                                {station.status || 'Unknown'}
                              </div>
                              {station.distance_from_route !== undefined && (
                                <div className={`text-xs ${theme.textMuted}`}>
                                  {station.distance_from_route} km from route
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}