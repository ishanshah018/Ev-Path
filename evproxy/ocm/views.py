import requests, hashlib, json,math
from django.conf import settings
from django.http import JsonResponse
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from django.views.decorators.cache import cache_page
import datetime


OSRM_URL = "https://router.project-osrm.org/route/v1/driving"

# Realistic fuel costs (INR per liter)
PETROL_PRICE_PER_LITER = 100.0
DIESEL_PRICE_PER_LITER = 90.0
EV_COST_PER_KM = 2.0  # INR per km for EV

# Average fuel efficiency
PETROL_KMPL = 15.0  # km per liter
DIESEL_KMPL = 20.0  # km per liter

# EV specifications
EV_RANGE_KM = 300  # km on full charge
EV_BATTERY_CAPACITY = 50  # kWh
CHARGING_COST_PER_KWH = 8.0  # INR per kWh
FAST_CHARGING_TIME_MINUTES = 45  # minutes for 20-80% charge


def get_ev_fallback_response(user_message):
    """
    Provide intelligent fallback responses for common EV questions
    when the Gemini API is rate-limited
    """
    message_lower = user_message.lower()
    
    # EV Benefits
    if any(word in message_lower for word in ['benefit', 'advantage', 'why ev', 'why electric']):
        return """🚗 **Benefits of Electric Vehicles:**

✅ **Cost Savings**: EVs cost ₹2-3 per km vs ₹6-8 for petrol cars
✅ **Environmental**: Zero tailpipe emissions, 60-70% less CO2 overall
✅ **Performance**: Instant torque, smooth acceleration, quiet operation
✅ **Maintenance**: Fewer moving parts, lower maintenance costs
✅ **Incentives**: Government subsidies, tax benefits, free parking in many cities
✅ **Energy Independence**: Reduced dependence on imported fossil fuels

**Real-world example**: A ₹15 lakh EV saves ₹50,000-80,000 annually in fuel costs!"""

    # EV Range
    elif any(word in message_lower for word in ['range', 'how far', 'distance', 'battery']):
        return """🔋 **EV Range Information:**

**Modern EV Ranges (India):**
• Tata Nexon EV: 312-437 km
• MG ZS EV: 419-461 km  
• Hyundai Kona: 452 km
• Mercedes EQC: 471 km
• Tesla Model 3: 491-675 km

**Factors affecting range:**
• Driving style (aggressive vs eco)
• Weather conditions (AC/heating)
• Terrain (hills vs flat roads)
• Speed (highway vs city)
• Battery age and health

**Tip**: Most EVs show 20-30% better range in city driving vs highway!"""

    # Charging
    elif any(word in message_lower for word in ['charge', 'charging', 'plug', 'socket']):
        return """⚡ **EV Charging Guide:**

**Charging Types:**
• **Slow Charging (3-6 kW)**: 6-8 hours for full charge, best for overnight
• **Fast Charging (22-50 kW)**: 1-2 hours for 80% charge
• **Ultra-fast (100+ kW)**: 20-30 minutes for 80% charge

**Charging Costs (India):**
• Home charging: ₹6-8 per kWh
• Public slow chargers: ₹8-12 per kWh
• Fast chargers: ₹15-25 per kWh

**Charging Tips:**
• Charge to 80% for daily use (better for battery life)
• Use fast chargers only when needed
• Plan charging stops during long trips
• Install home charger for convenience"""

    # Cost Comparison
    elif any(word in message_lower for word in ['cost', 'price', 'expensive', 'cheap', 'save', 'money']):
        return """💰 **EV vs Petrol Cost Comparison:**

**Fuel Costs (per km):**
• Petrol car: ₹6-8 per km
• Diesel car: ₹5-7 per km  
• Electric car: ₹2-3 per km

**Annual Savings Example:**
• Petrol car (15,000 km/year): ₹90,000-120,000
• EV (15,000 km/year): ₹30,000-45,000
• **Annual savings**: ₹45,000-75,000!

**Additional Savings:**
• Lower maintenance: ₹10,000-20,000/year
• Tax benefits: ₹50,000-1,00,000
• Free parking in many cities
• Lower insurance in some cases

**Break-even**: 3-5 years depending on usage!"""

    # Trip Planning
    elif any(word in message_lower for word in ['trip', 'journey', 'road trip', 'travel', 'route']):
        return """🗺️ **EV Trip Planning Tips:**

**Before You Go:**
• Check your EV's range and plan charging stops
• Use apps like EV-PATH to find charging stations
• Book charging slots if required
• Check station availability and connector types

**During the Trip:**
• Drive in eco mode for better range
• Use regenerative braking
• Avoid aggressive acceleration
• Plan stops every 200-300 km

**Charging Strategy:**
• Charge to 80% at fast chargers (faster than 100%)
• Use slow chargers for overnight stops
• Have backup charging options
• Keep emergency contact numbers

**Popular EV Routes in India:**
• Mumbai-Pune: Well-connected with chargers
• Delhi-Agra: Multiple charging options
• Bangalore-Mysore: Good infrastructure
• Chennai-Bangalore: Improving rapidly"""

    # Environmental Impact
    elif any(word in message_lower for word in ['environment', 'pollution', 'green', 'eco', 'carbon']):
        return """🌱 **Environmental Impact of EVs:**

**Direct Benefits:**
• Zero tailpipe emissions
• No local air pollution
• Reduced noise pollution
• Better air quality in cities

**Overall Carbon Footprint:**
• EVs: 60-70% less CO2 than petrol cars
• Even with coal-based electricity
• Much better with renewable energy
• Improving as grid gets greener

**Resource Impact:**
• Battery materials are recyclable
• Lower water usage in operation
• Reduced oil dependency
• Support for renewable energy

**India's EV Mission:**
• Target: 30% EVs by 2030
• Reduce oil imports by ₹1.5 lakh crore
• Cut CO2 emissions by 37 million tonnes
• Create 10 million jobs"""

    # Maintenance
    elif any(word in message_lower for word in ['maintenance', 'service', 'repair', 'care']):
        return """🔧 **EV Maintenance Guide:**

**What EVs Don't Need:**
• Oil changes
• Spark plug replacement
• Exhaust system repairs
• Transmission maintenance
• Fuel filter changes

**What EVs Do Need:**
• Battery health checks
• Brake fluid replacement
• Tire rotation and replacement
• Air filter changes
• Software updates

**Maintenance Costs:**
• EVs: ₹5,000-15,000/year
• Petrol cars: ₹15,000-30,000/year
• **Savings**: ₹10,000-15,000/year

**Battery Care:**
• Avoid extreme temperatures
• Don't charge to 100% regularly
• Use slow charging when possible
• Keep battery between 20-80% for daily use
• Modern batteries last 8-15 years"""

    # Default response for other questions
    else:
        return """I'm currently experiencing high demand and can't process your request right now. 

However, I can help you with EV-related questions! Here are some common topics I can assist with:

🚗 **EV Technology**: Battery types, range, performance
⚡ **Charging**: Types of chargers, charging times, infrastructure  
💰 **Cost Analysis**: EV vs petrol/diesel costs, savings
🗺️ **Trip Planning**: Route optimization, charging stops
🌱 **Environmental Impact**: CO2 savings, sustainability
🔧 **Maintenance**: EV care, battery health

Please try asking about any of these specific topics, or try again in a few minutes!"""


def _cache_key(name: str, params: dict) -> str:
    blob = json.dumps(params, sort_keys=True, separators=(",", ":"))
    return f"{name}:{hashlib.sha1(blob.encode()).hexdigest()}"

def ev_stations(request):
    # ---- read & validate params ----
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")
    if not lat or not lon:
        return JsonResponse({"error": "lat & lon are required"}, status=400)

    try:
        float(lat); float(lon)
    except ValueError:
        return JsonResponse({"error": "lat/lon must be numbers"}, status=400)

    distance = request.GET.get("distance", "10")
    maxresults = request.GET.get("maxresults", "150")  # allow more for clustering
    q = (request.GET.get("q") or "").strip()
    connectors_raw = (request.GET.get("connectors") or "").strip()  # comma separated text
    min_kw = request.GET.get("min_kw")  # number
    max_kw = request.GET.get("max_kw")  # number
    status = (request.GET.get("status") or "").strip()  # e.g., "Operational"

    # normalize filters
    connectors = [c.strip().lower() for c in connectors_raw.split(",") if c.strip()]
    try:
        distance_km = max(1, min(50, int(float(distance))))
        maxresults_int = max(1, min(300, int(maxresults)))
        min_kw_val = float(min_kw) if min_kw not in (None, "",) else None
        max_kw_val = float(max_kw) if max_kw not in (None, "",) else None
    except ValueError:
        return JsonResponse({"error": "Invalid number in filters"}, status=400)

    # ---- check cache first ----
    upstream_params = {
        "lat": lat, "lon": lon,
        "distance": distance_km,
        "maxresults": maxresults_int,
    }
    ck = _cache_key("ocm_upstream", upstream_params)
    raw = cache.get(ck)

    if not raw:
        # ---- call OpenChargeMap (minimal but targeted) ----
        url = (
            "https://api.openchargemap.io/v3/poi/"
            f"?output=json&latitude={lat}&longitude={lon}"
            f"&distance={distance_km}&distanceunit=KM&maxresults={maxresults_int}"
            f"&compact=true&verbose=false&key={settings.OCM_API_KEY}"
        )
        try:
            raw = requests.get(url, timeout=15).json()
        except Exception as e:
            return JsonResponse({"error": "OCM request failed", "detail": str(e)}, status=502)
        # cache upstream payload for 5 minutes
        cache.set(ck, raw, timeout=300)

    # ---- clean & shape ----
    cleaned = []
    for s in raw or []:
        a = (s.get("AddressInfo") or {})
        conns = (s.get("Connections") or [])
        connections_clean = [{
            "type": (c.get("ConnectionType") or {}).get("Title"),
            "power_kw": c.get("PowerKW"),
            "level": (c.get("Level") or {}).get("Title"),
            "quantity": c.get("Quantity"),
        } for c in conns]

        cleaned.append({
            "id": s.get("ID"),
            "name": a.get("Title"),
            "address": a.get("AddressLine1"),
            "town": a.get("Town"),
            "lat": a.get("Latitude"),
            "lon": a.get("Longitude"),
            "distance": a.get("Distance"),  # may exist when OCM returns it
            "status": (s.get("StatusType") or {}).get("Title"),  # "Operational" etc.
            "usage_cost": s.get("UsageCost"),
            "connections": connections_clean,
            "num_points": s.get("NumberOfPoints"),
            "operator": (s.get("OperatorInfo") or {}).get("Title"),
        })

    # ---- apply server-side filters (safe, no need to know OCM IDs) ----
    def match_text(st):
        if not q:
            return True
        hay = " ".join(filter(None, [
            st.get("name"), st.get("address"), st.get("town"), st.get("operator")
        ])).lower()
        return q.lower() in hay

    def match_connectors(st):
        if not connectors:
            return True
        # accept synonyms: ccs -> 'ccs', 'type 2' -> 'type 2'
        titles = [ (c.get("type") or "").lower() for c in (st.get("connections") or []) ]
        # pass if ANY asked connector appears in ANY connection title
        return any(any(conn in title for title in titles) for conn in connectors)

    def match_power(st):
        if min_kw_val is None and max_kw_val is None:
            return True
        powers = [c.get("power_kw") for c in (st.get("connections") or []) if c.get("power_kw") is not None]
        if not powers:
            return False
        if min_kw_val is not None and max_kw_val is not None:
            return any(min_kw_val <= p <= max_kw_val for p in powers)
        if min_kw_val is not None:
            return any(p >= min_kw_val for p in powers)
        if max_kw_val is not None:
            return any(p <= max_kw_val for p in powers)
        return True

    def match_status(st):
        if not status:
            return True
        s = (st.get("status") or "").lower()
        return status.lower() in s

    filtered = [st for st in cleaned if match_text(st) and match_connectors(st) and match_power(st) and match_status(st)]

    # sort by distance if present, otherwise keep as-is
    filtered.sort(key=lambda st: (999999 if st.get("distance") in (None, "") else float(st["distance"])))
    return JsonResponse(filtered, safe=False)

def get_stations(request):
    city = request.GET.get("city")
    params = {
        "output": "json",
        "maxresults": 20,
        "key": settings.OCM_API_KEY,
    }
    if city:
        params["address"] = city   # OCM supports city name

    url = "https://api.openchargemap.io/v3/poi/"
    response = requests.get(url, params=params)
    return JsonResponse(response.json(), safe=False)


def _haversine_km(a, b):
    # a, b: (lat, lon)
    R = 6371.0
    lat1, lon1 = math.radians(a[0]), math.radians(a[1])
    lat2, lon2 = math.radians(b[0]), math.radians(b[1])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    h = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(h))

def _polyline_length_km(coords):
    # coords: list of [lon, lat] (OSRM returns lon,lat)
    total = 0.0
    if not coords:
        return 0.0
    prev = (coords[0][1], coords[0][0])
    for lon, lat in coords[1:]:
        cur = (lat, lon)
        total += _haversine_km(prev, cur)
        prev = cur
    return total

def _sample_along_route(coords_lonlat, sample_km=20):
    # coords_lonlat: list of [lon, lat]
    # returns list of (lat, lon) sample points roughly every sample_km kilometers
    if not coords_lonlat:
        return []
    # Build cumulative distances
    pts = [(c[1], c[0]) for c in coords_lonlat]  # to (lat, lon)
    cum = [0.0]
    for i in range(1, len(pts)):
        d = _haversine_km(pts[i-1], pts[i])
        cum.append(cum[-1] + d)
    total = cum[-1]
    if total == 0:
        return [pts[0]]
    samples = []
    k = sample_km
    pos = 0.0
    while pos <= total:
        # find segment containing pos
        for i in range(1, len(cum)):
            if cum[i] >= pos:
                # fraction along segment
                seg_len = cum[i] - cum[i-1]
                if seg_len == 0:
                    frac = 0
                else:
                    frac = (pos - cum[i-1]) / seg_len
                lat1, lon1 = pts[i-1]
                lat2, lon2 = pts[i]
                lat = lat1 + (lat2 - lat1) * frac
                lon = lon1 + (lon2 - lon1) * frac
                samples.append((lat, lon))
                break
        pos += k
    # always include final point
    samples.append(pts[-1])
    # dedupe near duplicates
    out = []
    for p in samples:
        if not out or _haversine_km(out[-1], p) > 0.5:  # 0.5 km tolerance
            out.append(p)
    return out

def _clean_ocm_item(s):
    a = s.get("AddressInfo") or {}
    conns = s.get("Connections") or []
    connections = [{
        "type": (c.get("ConnectionType") or {}).get("Title"),
        "power_kw": c.get("PowerKW"),
        "quantity": c.get("Quantity"),
        "level": (c.get("Level") or {}).get("Title"),
    } for c in conns]
    return {
        "id": s.get("ID"),
        "name": a.get("Title"),
        "address": a.get("AddressLine1"),
        "town": a.get("Town"),
        "lat": a.get("Latitude"),
        "lon": a.get("Longitude"),
        "status": (s.get("StatusType") or {}).get("Title"),
        "usage_cost": s.get("UsageCost"),
        "connections": connections,
        "num_points": s.get("NumberOfPoints"),
        "operator": (s.get("OperatorInfo") or {}).get("Title"),
    }

@require_GET
def route_chargers(request):
    """
    GET params:
      src_lat, src_lon, dst_lat, dst_lon
      sample_km (default 25) -- distance between sampling points along route
      radius_km (default 5) -- search radius around each sample point
      max_per_sample (default 20)
    Returns:
      { route: { coords: [[lon,lat],...] }, stations: [ ... cleaned ... ] }
    """
    src_lat = request.GET.get("src_lat")
    src_lon = request.GET.get("src_lon")
    dst_lat = request.GET.get("dst_lat")
    dst_lon = request.GET.get("dst_lon")

    if not (src_lat and src_lon and dst_lat and dst_lon):
        return JsonResponse({"error": "src_lat,src_lon,dst_lat,dst_lon required"}, status=400)

    try:
        src_lat = float(src_lat); src_lon = float(src_lon)
        dst_lat = float(dst_lat); dst_lon = float(dst_lon)
    except ValueError:
        return JsonResponse({"error": "invalid coordinates"}, status=400)

    sample_km = float(request.GET.get("sample_km", 25))
    radius_km = float(request.GET.get("radius_km", 5))
    max_per_sample = int(request.GET.get("max_per_sample", 20))

    # cache key (route+params)
    key_blob = json.dumps({
        "src": [src_lat, src_lon],
        "dst": [dst_lat, dst_lon],
        "sample_km": sample_km,
        "radius_km": radius_km,
        "max_per_sample": max_per_sample
    }, sort_keys=True)
    cache_key = "routechargers:" + hashlib.sha1(key_blob.encode()).hexdigest()
    cached = cache.get(cache_key)
    if cached:
        return JsonResponse(cached, safe=False)

    # 1) Get route from OSRM
    coords_param = f"{src_lon},{src_lat};{dst_lon},{dst_lat}"
    osrm_url = f"{OSRM_URL}/{coords_param}?overview=full&geometries=geojson"
    try:
        r = requests.get(osrm_url, timeout=15)
        r.raise_for_status()
        osrm_data = r.json()
    except Exception as e:
        return JsonResponse({"error": "OSRM error", "detail": str(e)}, status=502)

    routes = osrm_data.get("routes")
    if not routes:
        return JsonResponse({"error": "no route found"}, status=404)

    route_geo = routes[0].get("geometry")  # geojson LineString with coords [lon,lat]
    coords = route_geo.get("coordinates") if route_geo else []

    # 2) sample along route
    samples = _sample_along_route(coords, sample_km=sample_km)

    # 3) Query OCM around each sample point
    found = {}
    for lat, lon in samples:
        params = {
            "output": "json",
            "latitude": lat,
            "longitude": lon,
            "distance": radius_km,
            "distanceunit": "KM",
            "maxresults": max_per_sample,
            "compact": True,
            "verbose": False,
            "key": settings.OCM_API_KEY
        }
        try:
            resp = requests.get("https://api.openchargemap.io/v3/poi/", params=params, timeout=10)
            resp.raise_for_status()
            items = resp.json() or []
        except Exception:
            items = []
        for it in items:
            sid = it.get("ID")
            if not sid:
                continue
            if sid in found:
                continue
            found[sid] = _clean_ocm_item(it)

    # 4) compute distance from route for ranking
    # We'll compute min distance from each station to any sample point (fast)
    for sid, st in found.items():
        best = 1e9
        spt = (st.get("lat"), st.get("lon"))
        if spt[0] is None or spt[1] is None:
            best = None
        else:
            for sp in samples:
                d = _haversine_km(spt, sp)
                if d < best:
                    best = d
        st["_dist_to_route_km"] = best

    # 5) sort stations: nearest to route, higher power first
    stations_list = list(found.values())
    def _max_power(st):
        p = [c.get("power_kw") or 0 for c in st.get("connections", [])]
        return max(p) if p else 0
    stations_list.sort(key=lambda s: ((s["_dist_to_route_km"] if s["_dist_to_route_km"] is not None else 9999), -_max_power(s)))

    result = {
        "route": {"coordinates": coords},  # lon,lat pairs
        "stations": stations_list
    }

    cache.set(cache_key, result, timeout=60*10)  # cache 10 min
    return JsonResponse(result, safe=False)


@require_GET
def plan_trip(request):
    """
    Complete trip planning with route, charging stations, costs, and detailed analysis
    GET params:
      from_city, to_city
      vehicle_range (default 300) -- EV range in km
      current_battery (default 80) -- current battery percentage
    Returns detailed trip plan with costs, charging stops, and environmental impact
    """
    try:
        from_city = request.GET.get("from", "").strip()
        to_city = request.GET.get("to", "").strip()
        
        if not from_city or not to_city:
            return JsonResponse({"error": "from and to parameters required"}, status=400)
        
        vehicle_range = float(request.GET.get("vehicle_range", EV_RANGE_KM))
        current_battery = float(request.GET.get("current_battery", 80))
        
        # Cache key for this specific trip
        cache_key = f"trip_plan:{hashlib.sha1(f'{from_city}:{to_city}:{vehicle_range}:{current_battery}'.encode()).hexdigest()}"
        cached = cache.get(cache_key)
        if cached:
            return JsonResponse(cached, safe=False)
        
        # 1. Geocode cities using Nominatim with fallback coordinates
        MAJOR_CITIES = {
            'mumbai': {'name': 'Mumbai, Maharashtra, India', 'lat': 19.0760, 'lon': 72.8777},
            'delhi': {'name': 'Delhi, India', 'lat': 28.7041, 'lon': 77.1025},
            'bangalore': {'name': 'Bangalore, Karnataka, India', 'lat': 12.9716, 'lon': 77.5946},
            'bengaluru': {'name': 'Bengaluru, Karnataka, India', 'lat': 12.9716, 'lon': 77.5946},
            'chennai': {'name': 'Chennai, Tamil Nadu, India', 'lat': 13.0827, 'lon': 80.2707},
            'kolkata': {'name': 'Kolkata, West Bengal, India', 'lat': 22.5726, 'lon': 88.3639},
            'hyderabad': {'name': 'Hyderabad, Telangana, India', 'lat': 17.3850, 'lon': 78.4867},
            'pune': {'name': 'Pune, Maharashtra, India', 'lat': 18.5204, 'lon': 73.8567},
            'ahmedabad': {'name': 'Ahmedabad, Gujarat, India', 'lat': 23.0225, 'lon': 72.5714},
            'jaipur': {'name': 'Jaipur, Rajasthan, India', 'lat': 26.9124, 'lon': 75.7873},
            'surat': {'name': 'Surat, Gujarat, India', 'lat': 21.1702, 'lon': 72.8311},
            'lucknow': {'name': 'Lucknow, Uttar Pradesh, India', 'lat': 26.8467, 'lon': 80.9462},
            'kanpur': {'name': 'Kanpur, Uttar Pradesh, India', 'lat': 26.4499, 'lon': 80.3319},
            'nagpur': {'name': 'Nagpur, Maharashtra, India', 'lat': 21.1458, 'lon': 79.0882},
            'indore': {'name': 'Indore, Madhya Pradesh, India', 'lat': 22.7196, 'lon': 75.8577},
            'thane': {'name': 'Thane, Maharashtra, India', 'lat': 19.2183, 'lon': 72.9781},
            'bhopal': {'name': 'Bhopal, Madhya Pradesh, India', 'lat': 23.2599, 'lon': 77.4126},
            'visakhapatnam': {'name': 'Visakhapatnam, Andhra Pradesh, India', 'lat': 17.6868, 'lon': 83.2185},
            'patna': {'name': 'Patna, Bihar, India', 'lat': 25.5941, 'lon': 85.1376},
            'vadodara': {'name': 'Vadodara, Gujarat, India', 'lat': 22.3072, 'lon': 73.1812}
        }
        
        def geocode_city(city):
            city_key = city.lower().strip()
            
            # First try our hardcoded major cities
            if city_key in MAJOR_CITIES:
                return MAJOR_CITIES[city_key]
            
            # Try to find partial matches
            for key, data in MAJOR_CITIES.items():
                if city_key in key or key in city_key:
                    return data
            
            # If not found, try Nominatim API
            timeouts = [10, 15]
            for timeout in timeouts:
                try:
                    url = f"https://nominatim.openstreetmap.org/search?format=json&limit=1&q={requests.utils.quote(city + ' India')}"
                    resp = requests.get(url, timeout=timeout, headers={"User-Agent": "EV-PATH/1.0"})
                    resp.raise_for_status()
                    data = resp.json()
                    
                    if data and len(data) > 0:
                        result = {
                            "name": data[0].get("display_name", city),
                            "lat": float(data[0]["lat"]),
                            "lon": float(data[0]["lon"])
                        }
                        return result
                except Exception:
                    continue
            
            return None
        
        source = geocode_city(from_city)
        destination = geocode_city(to_city)
        
        if not source or not destination:
            return JsonResponse({"error": "Could not geocode one or both cities"}, status=400)
        
        # 2. Get route from OSRM
        coords_param = f"{source['lon']},{source['lat']};{destination['lon']},{destination['lat']}"
        osrm_url = f"{OSRM_URL}/{coords_param}?overview=full&geometries=geojson&steps=true"
        
        osrm_resp = requests.get(osrm_url, timeout=15)
        osrm_resp.raise_for_status()
        osrm_data = osrm_resp.json()
        
        if not osrm_data.get("routes"):
            return JsonResponse({"error": "No route found"}, status=404)
        
        route = osrm_data["routes"][0]
        distance_km = route["distance"] / 1000  # Convert meters to km
        duration_seconds = route["duration"]
        duration_minutes = duration_seconds / 60
        duration_hours = duration_minutes / 60
        
        # 3. Calculate costs
        petrol_liters = distance_km / PETROL_KMPL
        diesel_liters = distance_km / DIESEL_KMPL
        
        petrol_cost = petrol_liters * PETROL_PRICE_PER_LITER
        diesel_cost = diesel_liters * DIESEL_PRICE_PER_LITER
        ev_cost = distance_km * EV_COST_PER_KM
        
        # 4. Calculate charging requirements
        current_range = (current_battery / 100) * vehicle_range
        charging_stops = []
        charging_stops_count = 0
        total_charging_time = 0
        
        if distance_km > current_range:
            # Need charging stops
            remaining_distance = distance_km - current_range
            stops_needed = math.ceil(remaining_distance / (vehicle_range * 0.6))  # Charge to 80% each time
            charging_stops_count = stops_needed
            
            for i in range(stops_needed):
                stop_distance = current_range + (i * vehicle_range * 0.6)
                if stop_distance < distance_km:
                    charging_stops.append({
                        "stop_number": i + 1,
                        "distance_from_start": round(stop_distance, 1),
                        "remaining_distance": round(distance_km - stop_distance, 1),
                        "estimated_charge_time": f"{FAST_CHARGING_TIME_MINUTES} minutes",
                        "charge_cost_estimate": f"₹{round(EV_BATTERY_CAPACITY * 0.6 * CHARGING_COST_PER_KWH)}-{round(EV_BATTERY_CAPACITY * 0.8 * CHARGING_COST_PER_KWH)}",
                        "battery_before": "20%",
                        "battery_after": "80%"
                    })
            
            total_charging_time = charging_stops_count * FAST_CHARGING_TIME_MINUTES
        
        # 5. Get comprehensive charging stations along route
        coords = route["geometry"]["coordinates"]
        samples = _sample_along_route(coords, sample_km=30)  # Sample every 30km for better coverage
        
        # Get charging stations near route with enhanced data
        found_stations = {}
        for lat, lon in samples[:15]:  # Increased sample points for better coverage
            params = {
                "output": "json",
                "latitude": lat,
                "longitude": lon,
                "distance": 15,  # 15km radius for better coverage
                "distanceunit": "KM",
                "maxresults": 20,  # More stations per sample point
                "compact": True,
                "verbose": False,
                "key": settings.OCM_API_KEY
            }
            try:
                resp = requests.get("https://api.openchargemap.io/v3/poi/", params=params, timeout=15)
                resp.raise_for_status()
                items = resp.json() or []
                for item in items:
                    station_id = item.get("ID")
                    if station_id and station_id not in found_stations:
                        # Enhanced station cleaning with more details
                        station = _clean_ocm_item(item)
                        
                        # Add additional real data
                        station["real_data"] = True
                        station["last_verified"] = item.get("DateLastVerified")
                        station["date_created"] = item.get("DateCreated")
                        station["date_last_status_update"] = item.get("DateLastStatusUpdate")
                        
                        # Enhanced connection details
                        if station.get("connections"):
                            for conn in station["connections"]:
                                if conn.get("power_kw"):
                                    conn["charging_speed"] = "Fast" if conn["power_kw"] >= 50 else "Standard"
                                else:
                                    conn["charging_speed"] = "Standard"
                        
                        found_stations[station_id] = station
            except Exception as e:
                print(f"Error fetching stations for {lat},{lon}: {e}")
                continue
        
        # Add distance to route for each station
        for station in found_stations.values():
            if station.get("lat") and station.get("lon"):
                try:
                    min_dist = min([
                        _haversine_km((station["lat"], station["lon"]), sample) 
                        for sample in samples
                    ])
                    station["distance_from_route"] = round(min_dist, 1)
                except (ValueError, TypeError):
                    station["distance_from_route"] = 999  # Default high distance if calculation fails
        
        # Enhanced station filtering and sorting
        def station_score(station):
            """Calculate a score for station ranking based on multiple factors"""
            score = 0
            
            # Distance from route (closer is better)
            distance = station.get("distance_from_route", 999)
            if distance is None:
                distance = 999
            if distance <= 2:
                score += 100
            elif distance <= 5:
                score += 80
            elif distance <= 10:
                score += 60
            else:
                score += 40
            
            # Operational status (operational is better)
            status = (station.get("status") or "").lower()
            if "operational" in status:
                score += 50
            elif "planned" in status or "construction" in status:
                score += 20
            else:
                score += 10
            
            # Power capacity (higher is better)
            powers = [c.get("power_kw", 0) or 0 for c in station.get("connections", [])]
            max_power = max(powers) if powers else 0
            if max_power >= 100:
                score += 40
            elif max_power >= 50:
                score += 30
            elif max_power >= 22:
                score += 20
            else:
                score += 10
            
            # Number of connections (more is better)
            conn_count = len(station.get("connections", []))
            score += min(conn_count * 5, 25)
            
            # Recent verification (more recent is better)
            if station.get("last_verified"):
                score += 15
            
            return score
        
        # Filter and sort stations
        filtered_stations = []
        for station in found_stations.values():
            # Only include stations with valid coordinates
            if station.get("lat") and station.get("lon"):
                station["score"] = station_score(station)
                filtered_stations.append(station)
        
        # Sort by score (highest first) and then by distance
        def sort_key(station):
            score = station.get("score", 0)
            distance = station.get("distance_from_route", 999)
            if distance is None:
                distance = 999
            return (-score, distance)
        
        stations_list = sorted(filtered_stations, key=sort_key)
        
        # 6. Environmental impact calculation
        co2_per_km_petrol = 2.3  # kg CO2 per km for petrol car
        co2_per_km_ev = 0.5  # kg CO2 per km for EV (considering electricity grid mix)
        co2_saved = (co2_per_km_petrol - co2_per_km_ev) * distance_km
        trees_equivalent = co2_saved / 22  # 1 tree absorbs ~22kg CO2 per year
        
                # 7. Build comprehensive response
        # Debug: Check stations data
        print(f"Debug: Processing {len(stations_list)} stations")
        for i, station in enumerate(stations_list[:3]):
            print(f"Station {i}: {station.get('name', 'Unknown')} - distance: {station.get('distance_from_route')} - score: {station.get('score')}")
        
        result = {
            "success": True,
            "trip_summary": {
                "source": source,
                "destination": destination,
                "distance_km": round(distance_km, 1),
                "duration_minutes": round(duration_minutes),
                "duration_hours": round(duration_hours, 1)
            },
            "routes": [{
                "route_id": 1,
                "name": "Optimal Route",
                "coordinates": coords,  # [lon, lat] pairs for map
                "distance_km": round(distance_km, 1),
                "duration_minutes": round(duration_minutes),
                "duration_hours": round(duration_hours, 1),
                "costs": {
                    "ev_cost": round(ev_cost, 2),
                    "petrol_cost": round(petrol_cost, 2),
                    "diesel_cost": round(diesel_cost, 2),
                    "petrol_savings": round(petrol_cost - ev_cost, 2),
                    "diesel_savings": round(diesel_cost - ev_cost, 2)
                },
                "charging_stops": charging_stops,
                "charging_stops_count": charging_stops_count,
                "total_charging_time": f"{total_charging_time} minutes",
                "fuel_efficiency": {
                    "petrol_liters_needed": round(petrol_liters, 2),
                    "diesel_liters_needed": round(diesel_liters, 2),
                    "ev_kwh_needed": round((distance_km / vehicle_range) * EV_BATTERY_CAPACITY, 2)
                }
            }],
            "charging_stations": stations_list[:30],  # Top 30 stations with real data
            "charging_stations_summary": {
                "total_found": len(stations_list),
                "operational_count": len([s for s in stations_list if "operational" in (s.get("status") or "").lower()]),
                "fast_charging_count": len([s for s in stations_list if any((c.get("power_kw", 0) or 0) >= 50 for c in s.get("connections", []))]),
                "average_distance_from_route": round(sum(s.get("distance_from_route", 0) for s in stations_list[:10] if s.get("distance_from_route") is not None) / max(len([s for s in stations_list[:10] if s.get("distance_from_route") is not None]), 1), 1),
                "data_source": "OpenChargeMap API (Real-time)",
                "last_updated": "Live data"
            },
            "cost_comparison": {
                "distance_km": round(distance_km, 1),
                "ev_cost": round(ev_cost, 2),
                "petrol_cost": round(petrol_cost, 2),
                "diesel_cost": round(diesel_cost, 2),
                "savings_vs_petrol": round(petrol_cost - ev_cost, 2),
                "savings_vs_diesel": round(diesel_cost - ev_cost, 2),
                "fuel_prices": {
                    "petrol_per_liter": PETROL_PRICE_PER_LITER,
                    "diesel_per_liter": DIESEL_PRICE_PER_LITER,
                    "ev_per_km": EV_COST_PER_KM
                }
            },
            "environmental_impact": {
                "co2_saved_kg": round(co2_saved, 1),
                "equivalent_trees": round(trees_equivalent, 1)
            },
            "charging_analysis": {
                "vehicle_range": vehicle_range,
                "current_battery": current_battery,
                "current_range": round(current_range, 1),
                "charging_required": distance_km > current_range,
                "total_stops_needed": charging_stops_count,
                "total_charging_time_minutes": total_charging_time,
                "charging_cost_estimate": round(charging_stops_count * EV_BATTERY_CAPACITY * 0.6 * CHARGING_COST_PER_KWH) if charging_stops_count > 0 else 0
            }
        }
        
        # Cache for 30 minutes
        cache.set(cache_key, result, timeout=1800)
        return JsonResponse(result, safe=False)
        
    except Exception as e:
        return JsonResponse({"error": "Trip planning failed", "detail": str(e)}, status=500)


@csrf_exempt
def chatbot(request):
    """
    EV-focused chatbot using Gemini AI API
    POST params:
      message: user's question
      conversation_history: list of previous messages (optional)
    Returns:
      { response: str, conversation_id: str }
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '').strip()
            conversation_history = data.get('conversation_history', [])
            
            if not user_message:
                return JsonResponse({"error": "Message is required"}, status=400)
            
            # Get Gemini API key from settings
            gemini_api_key = getattr(settings, 'GEMINI_API_KEY', None)
            if not gemini_api_key:
                return JsonResponse({"error": "Gemini API key not configured"}, status=500)
            
            # Build conversation context for EV-focused responses
            system_prompt = """You are an expert EV (Electric Vehicle) assistant for EV-PATH, a comprehensive EV navigation and planning platform. 

Your expertise includes:
- Electric vehicle technology, specifications, and performance
- EV charging infrastructure, connectors, and charging speeds
- EV range optimization and battery management
- EV cost analysis and savings compared to ICE vehicles
- EV trip planning and route optimization
- Environmental impact of EVs vs traditional vehicles
- EV maintenance and best practices
- EV incentives, policies, and market trends in India

Guidelines:
1. Always provide accurate, helpful information about EVs
2. If asked about non-EV topics, politely redirect to EV-related discussions
3. Use Indian context when relevant (prices in INR, Indian cities, etc.)
4. Be conversational but professional
5. Keep responses concise but informative
6. If you don't know something specific, acknowledge it and suggest reliable sources

Current platform features: EV station finder, trip planning, cost comparison, route optimization with charging stops."""

            # Build the conversation for Gemini
            messages = [{"role": "user", "parts": [{"text": system_prompt}]}]
            
            # Add conversation history if provided
            for msg in conversation_history[-5:]:  # Keep last 5 messages for context
                if msg.get('role') and msg.get('content'):
                    messages.append({
                        "role": msg['role'],
                        "parts": [{"text": msg['content']}]
                    })
            
            # Add current user message
            messages.append({"role": "user", "parts": [{"text": user_message}]})
            
            # Call Gemini API
            gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
            headers = {
                "Content-Type": "application/json",
            }
            
            payload = {
                "contents": messages,
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                },
                "safetySettings": [
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            }
            
            response = requests.post(
                f"{gemini_url}?key={gemini_api_key}",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code != 200:
                # Check if it's a rate limit error
                if response.status_code == 429:
                    # Provide intelligent fallback responses for common EV questions
                    fallback_response = get_ev_fallback_response(user_message)
                    
                    return JsonResponse({
                        "response": fallback_response,
                        "conversation_id": hashlib.md5(f"{user_message}:{len(conversation_history)}".encode()).hexdigest()[:12],
                        "timestamp": json.dumps(datetime.datetime.now().isoformat()),
                        "rate_limited": True
                    })
                else:
                    return JsonResponse({
                        "error": "Failed to get response from Gemini API",
                        "detail": response.text
                    }, status=500)
            
            gemini_data = response.json()
            
            # Extract the response text
            if 'candidates' in gemini_data and len(gemini_data['candidates']) > 0:
                candidate = gemini_data['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    parts = candidate['content']['parts']
                    if len(parts) > 0 and 'text' in parts[0]:
                        ai_response = parts[0]['text'].strip()
                    else:
                        ai_response = "I'm sorry, I couldn't generate a proper response. Please try again."
                else:
                    ai_response = "I'm sorry, I couldn't generate a proper response. Please try again."
            else:
                ai_response = "I'm sorry, I couldn't generate a proper response. Please try again."
            
            # Generate conversation ID for tracking
            conversation_id = hashlib.md5(f"{user_message}:{len(conversation_history)}".encode()).hexdigest()[:12]
            
            return JsonResponse({
                "response": ai_response,
                "conversation_id": conversation_id,
                "timestamp": json.dumps(datetime.datetime.now().isoformat())
            })
            
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON in request body"}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Chatbot error", "detail": str(e)}, status=500)
    
    return JsonResponse({"error": "Only POST method allowed"}, status=405)