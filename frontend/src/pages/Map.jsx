import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { applyLeafletIconFix } from "../leaflet-fix";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";

applyLeafletIconFix();

const DEFAULT_CENTER = { lat: 23.0225, lon: 72.5714 }; // Ahmedabad

function FlyTo({ center }) {
const map = useMap();
useEffect(() => {
map.setView([center.lat, center.lon], 13, { animate: true });
}, [center, map]);
return null;
}

export default function MapPage() {
const [center, setCenter] = useState(DEFAULT_CENTER);
const [stations, setStations] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

// filters
const [distance, setDistance] = useState(10);
const [q, setQ] = useState(""); // text filter (name/address/operator)
const [connectors, setConnectors] = useState([]); // ["ccs","type 2","chademo","gb/t"]
const [minKw, setMinKw] = useState("");
const [maxKw, setMaxKw] = useState("");
const [status, setStatus] = useState("");

// NEW: place/city search input
const [place, setPlace] = useState("");

// debounce for filters
const debounceRef = useRef(null);
const scheduleFetch = (fn) => {
if (debounceRef.current) clearTimeout(debounceRef.current);
debounceRef.current = setTimeout(fn, 500);
};

// try to use browser location on load
useEffect(() => {
if (!navigator.geolocation) return;
navigator.geolocation.getCurrentPosition(
    (pos) => setCenter({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
    () => {},
    { enableHighAccuracy: true, timeout: 8000 }
);
}, []);

// Build backend URL (your Django API)
const buildUrl = () => {
const params = new URLSearchParams();
params.set("lat", center.lat);
params.set("lon", center.lon);
params.set("distance", distance);
params.set("maxresults", 200);
if (q.trim()) params.set("q", q.trim());
if (connectors.length) params.set("connectors", connectors.join(","));
if (minKw !== "") params.set("min_kw", minKw);
if (maxKw !== "") params.set("max_kw", maxKw);
if (status) params.set("status", status);
return `http://127.0.0.1:8000/api/ev-stations/?${params.toString()}`;
};

const fetchStations = async () => {
setLoading(true);
setError("");
try {
    const res = await fetch(buildUrl());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setStations(data);
} catch (e) {
    console.error(e);
    setError("Failed to load stations.");
} finally {
    setLoading(false);
}
};

// fetch when center changes (e.g., after geocoding)
useEffect(() => {
fetchStations();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [center]);

// fetch when filters change (debounced)
useEffect(() => {
scheduleFetch(fetchStations);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [q, connectors, minKw, maxKw, status, distance]);

const markers = useMemo(() => stations.filter((s) => s.lat && s.lon), [stations]);

const toggleConnector = (name) => {
const n = name.toLowerCase();
setConnectors((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
};

// NEW: geocode a place/city -> setCenter()
const geocodeAndCenter = async () => {
const query = place.trim();
if (!query) return;
setLoading(true);
setError("");
try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&countrycodes=in&q=${encodeURIComponent(
    query
    )}`;
    const resp = await fetch(url, {
    headers: {
        // Good practice: identify your app (Nominatim usage policy)
        "User-Agent": "ev-path-demo/1.0 (contact: you@example.com)",
    },
    });
    const results = await resp.json();
    if (!Array.isArray(results) || results.length === 0) {
    setError("Place not found. Try a different name.");
    return;
    }
    const lat = parseFloat(results[0].lat);
    const lon = parseFloat(results[0].lon);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
    setCenter({ lat, lon }); // triggers fetch via useEffect
    } else {
    setError("Geocoding failed for this place.");
    }
} catch (e) {
    console.error(e);
    setError("Geocoding failed. Check your internet connection.");
} finally {
    setLoading(false);
}
};

return (
<div className="grid grid-cols-12 gap-4 p-4">
    {/* Left controls + list */}
    <div className="col-span-4 overflow-y-auto h-[90vh] space-y-3">
    <div className="rounded-xl border p-3 space-y-3">
        <div className="font-semibold text-lg">Find stations</div>

        {/* NEW: Search place/city to recenter map */}
        <label className="block text-sm">Search place/city</label>
        <div className="flex gap-2">
        <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && geocodeAndCenter()}
            className="border rounded px-3 py-2 w-full"
            placeholder="e.g., Delhi, Mumbai, Navrangpura"
        />
        <button onClick={geocodeAndCenter} className="px-3 py-2 rounded border">
            Go
        </button>
        </div>

        {/* Text filter (applies within current radius) */}
        <label className="block text-sm mt-3">Filter results (name/address/operator)</label>
        <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="border rounded px-3 py-2 w-full"
        placeholder="e.g., Tata Power or Taj"
        />

        {/* Distance + geolocation */}
        <div className="flex items-center gap-2">
        <label className="text-sm">Radius (km)</label>
        <input
            type="number"
            min={1}
            max={50}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="border rounded px-3 py-2 w-28"
        />
        <button
            onClick={() =>
            navigator.geolocation?.getCurrentPosition((pos) =>
                setCenter({ lat: pos.coords.latitude, lon: pos.coords.longitude })
            )
            }
            className="px-3 py-2 rounded border"
        >
            Use my location
        </button>
        </div>

        {/* Connectors */}
        <div>
        <div className="text-sm mb-1">Connectors</div>
        <div className="flex flex-wrap gap-2">
            {["CCS", "Type 2", "CHAdeMO", "GB/T"].map((lbl) => (
            <button
                key={lbl}
                onClick={() => toggleConnector(lbl)}
                className={`px-2 py-1 rounded border text-sm ${
                connectors.includes(lbl.toLowerCase()) ? "bg-gray-200" : ""
                }`}
            >
                {lbl}
            </button>
            ))}
        </div>
        </div>

        {/* Power filters */}
        <div className="grid grid-cols-2 gap-2">
        <div>
            <label className="text-sm">Min kW</label>
            <input
            type="number"
            min={0}
            value={minKw}
            onChange={(e) => setMinKw(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            />
        </div>
        <div>
            <label className="text-sm">Max kW</label>
            <input
            type="number"
            min={0}
            value={maxKw}
            onChange={(e) => setMaxKw(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            />
        </div>
        </div>

        {/* Status */}
        <div>
        <label className="text-sm">Status</label>
        <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2 w-full"
        >
            <option value="">Any</option>
            <option value="Operational">Operational</option>
            <option value="Planned">Planned</option>
            <option value="Temporarily Unavailable">Temporarily Unavailable</option>
        </select>
        </div>
    </div>

    <div className="text-sm opacity-70">
        {loading ? "Loading…" : `${stations.length} stations`}
        {error && <span className="text-red-500 ml-2">{error}</span>}
    </div>

    {stations.map((s) => (
        <div key={s.id} className="rounded-xl p-3 border shadow-sm">
        <div className="font-semibold">{s.name || "Unnamed Station"}</div>
        <div className="text-sm opacity-80">
            {s.address}
            {s.town ? `, ${s.town}` : ""}
        </div>
        <div className="text-sm mt-1">
            Status: {s.status || "Unknown"}
            {s.distance
            ? ` · ~${s.distance.toFixed ? s.distance.toFixed(1) : s.distance} km`
            : ""}
        </div>
        <div className="text-sm">Cost: {s.usage_cost || "—"}</div>
        <div className="flex flex-wrap gap-2 text-xs mt-2">
            {(s.connections || []).map((c, i) => (
            <span key={i} className="px-2 py-1 rounded border">
                {(c.type || "Connector")} · {c.power_kw ? `${c.power_kw} kW` : "—"}
            </span>
            ))}
        </div>
        <button
            className="mt-2 text-sm underline"
            onClick={() => setCenter({ lat: s.lat, lon: s.lon })}
        >
            Center on map
        </button>
        </div>
    ))}
    </div>

    {/* Map + clustering */}
    <div className="col-span-8">
    <MapContainer
        center={[center.lat, center.lon]}
        zoom={12}
        style={{ height: "90vh", width: "100%", borderRadius: 16 }}
    >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FlyTo center={center} />

        <MarkerClusterGroup chunkedLoading>
        {markers.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lon]}>
            <Popup>
                <b>{s.name || "Station"}</b>
                <br />
                {s.address}
                {s.town ? `, ${s.town}` : ""}
                <br />
                {s.status ? `Status: ${s.status}` : ""}
                <div style={{ marginTop: 6 }}>
                {(s.connections || []).map((c, i) => (
                    <div key={i}>
                    {c.type || "Conn"} · {c.power_kw ? `${c.power_kw} kW` : "—"}
                    </div>
                ))}
                </div>
            </Popup>
            </Marker>
        ))}
        </MarkerClusterGroup>
    </MapContainer>
    </div>
</div>
);
}