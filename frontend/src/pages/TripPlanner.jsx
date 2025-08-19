// TripPlannerPage.jsx (replace handlePlanTrip + map drawing parts)
import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Route, Clock, Battery, Zap, Star, RefreshCw } from "lucide-react";
import { useEV } from "../contexts/EVContext";

const NOMINATIM = "https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&countrycodes=in&q=";

export default function TripPlannerPage() {
const { getDefaultEV } = useEV();
const defaultEV = getDefaultEV();

const [fromLocation, setFromLocation] = useState("");
const [toLocation, setToLocation] = useState("");
const [currentBattery, setCurrentBattery] = useState(80);

const [isPlanning, setIsPlanning] = useState(false);
const [routes, setRoutes] = useState([]); // we will store returned route + stations (1 route)
const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);

// map state
const [routeCoords, setRouteCoords] = useState([]); // array of [lat, lon] for Polyline
const [stations, setStations] = useState([]); // array of cleaned stations
const mapRef = useRef();

async function geocodePlace(text) {
const q = encodeURIComponent(text);
const res = await fetch(NOMINATIM + q, {
    headers: { "User-Agent": "ev-path-demo/1.0 (you@example.com)" }
});
const data = await res.json();
if (!data || data.length === 0) return null;
return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

const handlePlanTrip = async () => {
if (!fromLocation || !toLocation) return;
setIsPlanning(true);

try {
    // 1) geocode both
    const src = await geocodePlace(fromLocation);
    const dst = await geocodePlace(toLocation);
    if (!src || !dst) {
    alert("Could not geocode source or destination. Try a different name.");
    setIsPlanning(false);
    return;
    }

    // 2) call backend to get route + chargers
    // tune sample_km (how often to search along route) and radius_km (search radius)
    const sample_km = 25; // sample every 25 km (adjust)
    const radius_km = 5;  // search 5 km around route
    const url = `http://127.0.0.1:8000/api/route-chargers/?src_lat=${src.lat}&src_lon=${src.lon}&dst_lat=${dst.lat}&dst_lon=${dst.lon}&sample_km=${sample_km}&radius_km=${radius_km}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Route API error " + res.status);
    const data = await res.json();

    // 3) set route polyline (convert coordinates to [lat,lng] pairs)
    const coordsLonLat = data.route?.coordinates || [];
    const coordsLatLng = coordsLonLat.map(([lon, lat]) => [lat, lon]);
    setRouteCoords(coordsLatLng);

    // 4) set stations (they are cleaned in backend)
    setStations(data.stations || []);

    // zoom map to route (approx)
    if (mapRef.current && coordsLatLng.length) {
    const map = mapRef.current;
    try {
        map.fitBounds(coordsLatLng);
    } catch (e) {
        // some wrappers require map.leafletElement etc.
    }
    }

    // we can create a single "route result" for the UI (your routes array)
    setRoutes([{
    name: `Route ${fromLocation} → ${toLocation}`,
    distance: Math.round(coordsLatLng.length ? coordsLatLng.length : 0),
    chargingStops: data.stations.slice(0, 6) // top 6 suggestions
    }]);
    setSelectedRouteIdx(0);
} catch (err) {
    console.error(err);
    alert("Planning failed: " + (err.message || err));
} finally {
    setIsPlanning(false);
}
};

return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
        <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Plan Your Trip</h2>
            <div className="space-y-4">
            <div>
                <label className="text-sm">From</label>
                <input value={fromLocation} onChange={(e)=>setFromLocation(e.target.value)} className="w-full border p-2 rounded" placeholder="City / Place"/>
            </div>
            <div>
                <label className="text-sm">To</label>
                <input value={toLocation} onChange={(e)=>setToLocation(e.target.value)} className="w-full border p-2 rounded" placeholder="City / Place"/>
            </div>
            <div>
                <label className="text-sm">Current Battery</label>
                <input type="range" min="0" max="100" value={currentBattery} onChange={e=>setCurrentBattery(Number(e.target.value))} className="w-full"/>
                <div className="text-sm">{currentBattery}%</div>
            </div>
            <button disabled={isPlanning} onClick={handlePlanTrip} className="w-full py-2 bg-emerald-600 text-white rounded">
                {isPlanning ? <><RefreshCw className="inline-block mr-2 animate-spin"/> Planning...</> : <>Plan Trip</>}
            </button>
            </div>
        </div>
        </div>

        <div className="lg:col-span-2">
        <div className="bg-white rounded-xl p-4 shadow">
            <div style={{ height: "70vh", width: "100%" }}>
            <MapContainer whenCreated={(m)=> (mapRef.current = m)} center={[23.0225,72.5714]} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                { routeCoords && routeCoords.length > 1 && (
                <>
                    <Polyline positions={routeCoords} color="#16a34a" weight={5} opacity={0.9}/>
                </>
                )}
                <MarkerClusterGroup>
                {stations.map((s) => (
                    <Marker key={s.id} position={[s.lat, s.lon]}>
                    <Popup>
                        <div>
                        <strong>{s.name}</strong><br/>
                        {s.address}{s.town ? `, ${s.town}` : ""}<br/>
                        {s.usage_cost ? (`Cost: ${s.usage_cost}`) : null}<br/>
                        {s.connections && s.connections.map((c,i)=> <div key={i}>{c.type} · {c.power_kw ? `${c.power_kw} kW` : '—'}</div>)}
                        </div>
                    </Popup>
                    </Marker>
                ))}
                </MarkerClusterGroup>
            </MapContainer>
            </div>

            {/* small suggestions list */}
            <div className="mt-4">
            <h3 className="font-semibold">Suggested Charging Stops</h3>
            {stations.length === 0 ? (
                <p className="text-sm text-gray-500 mt-2">No chargers found yet — plan a route.</p>
            ) : (
                <div className="grid grid-cols-1 gap-3 mt-2">
                {stations.slice(0,8).map((s)=>(
                    <div key={s.id} className="p-3 border rounded bg-white">
                    <div className="flex justify-between">
                        <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-gray-600">{s.address}{s.town ? `, ${s.town}` : ""}</div>
                        <div className="text-xs text-gray-500">Distance to route: {s._dist_to_route_km ? `${s._dist_to_route_km.toFixed(1)} km` : '—'}</div>
                        </div>
                        <div className="text-right">
                        <div className="text-sm font-semibold">{s.connections && s.connections.length ? `${Math.max(...s.connections.map(c=> c.power_kw || 0))} kW` : '—'}</div>
                        <div className="text-xs text-gray-500">{s.status || 'Unknown'}</div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>

        </div>
        </div>
    </div>
    </div>
</div>
);
}