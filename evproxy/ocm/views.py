import requests, hashlib, json,math
from django.conf import settings
from django.http import JsonResponse
from django.core.cache import cache

from django.views.decorators.http import require_GET
from django.views.decorators.cache import cache_page


OSRM_URL = "https://router.project-osrm.org/route/v1/driving"


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