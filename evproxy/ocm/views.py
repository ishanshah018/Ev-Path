import requests, hashlib, json
from django.conf import settings
from django.http import JsonResponse
from django.core.cache import cache

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