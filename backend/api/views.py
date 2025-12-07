from functools import wraps
import time

import requests
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response

JIKAN_BASE_URL = "https://api.jikan.moe/v4"
RATE_LIMIT_DELAY = 0.35  # 350ms = ~3 requests per second

# Global variable to track last request time
last_request_time = 0


# ========= HELPER =========

def rate_limited_request(url: str):
    """
    Make rate-limited request to Jikan API.
    Ensures we don't exceed ~3 requests per second.
    """
    global last_request_time

    current_time = time.time()
    time_since_last = current_time - last_request_time

    # If we need to wait, do it
    if time_since_last < RATE_LIMIT_DELAY:
        sleep_time = RATE_LIMIT_DELAY - time_since_last
        print(f"⏳ Rate limiting: sleeping {sleep_time:.3f}s")
        time.sleep(sleep_time)

    # Make the request
    last_request_time = time.time()
    print(f"📡 Requesting: {url}")
    response = requests.get(url, timeout=10)
    return response


def jikan_get(path: str, params: dict | None = None):
    """
    Helper untuk build URL Jikan + rate_limited_request.
    path misalnya: '/anime', '/anime/{id}/full', dll.
    params otomatis dijadikan query string.
    """
    params = params or {}
    if params:
        from urllib.parse import urlencode

        query = urlencode(params, doseq=True)
        url = f"{JIKAN_BASE_URL}{path}?{query}"
    else:
        url = f"{JIKAN_BASE_URL}{path}"

    return rate_limited_request(url)


def cache_response(timeout: int = 3600):
    """
    Cache decorator untuk API responses.
    Default: 1 jam.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            anime_id = kwargs.get("anime_id", "")
            episode = kwargs.get("episode", "")
            query_string = request.GET.urlencode()

            cache_key = f"jikan_{func.__name__}_{anime_id}_{episode}_{query_string}"

            # Try cache
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                print(f"✅ CACHE HIT: {cache_key[:60]}")
                return Response(cached_data)

            # Cache miss
            print(f"❌ CACHE MISS: {cache_key[:60]}")
            response = func(request, *args, **kwargs)

            # Cache hanya jika sukses
            if getattr(response, "status_code", None) == 200 and hasattr(response, "data"):
                cache.set(cache_key, response.data, timeout)
                print(f"💾 Cached for {timeout}s: {cache_key[:60]}")

            return response

        return wrapper

    return decorator


# ========== SEARCH & TOP ANIME ==========

@api_view(["GET"])
@cache_response(timeout=1800)  # 30 menit
def search_anime(request):
    query = request.GET.get("q", "")
    page = request.GET.get("page", "1")

    try:
        resp = jikan_get("/anime", {"q": query, "page": page})
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in search_anime: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=3600)  # 1 jam
def get_top_anime(request):
    page = request.GET.get("page", "1")

    try:
        resp = jikan_get("/top/anime", {"page": page})
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_top_anime: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=3600)  # 1 jam
def get_seasonal_anime(request):
    try:
        resp = jikan_get("/seasons/now")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_seasonal_anime: {e}")
        return Response({"error": str(e)}, status=500)


# ========== ANIME BASIC INFO ==========

@api_view(["GET"])
@cache_response(timeout=7200)  # 2 jam
def get_anime_detail(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_detail: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)  # 2 jam
def get_anime_full(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/full")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_full: {e}")
        return Response({"error": str(e)}, status=500)


# ========== ANIME DETAILS ==========

@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_characters(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/characters")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_characters: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_staff(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/staff")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_staff: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_episodes(request, anime_id):
    page = request.GET.get("page", "1")
    try:
        resp = jikan_get(f"/anime/{anime_id}/episodes", {"page": page})
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_episodes: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_episode_detail(request, anime_id, episode):
    try:
        resp = jikan_get(f"/anime/{anime_id}/episodes/{episode}")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_episode_detail: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_news(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/news")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_news: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_videos(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/videos")
        data = resp.json()

        # Log untuk debugging
        promo_count = len(data.get("data", {}).get("promo", []))
        episodes_count = len(data.get("data", {}).get("episodes", []))
        music_count = len(data.get("data", {}).get("music_videos", []))

        print(
            f"📹 Anime {anime_id} videos: "
            f"{promo_count} promos, {episodes_count} episodes, {music_count} music"
        )

        return Response(data)
    except Exception as e:
        print(f"❌ Error in get_anime_videos: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_pictures(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/pictures")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_pictures: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_statistics(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/statistics")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_statistics: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_recommendations(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/recommendations")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_recommendations: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_reviews(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/reviews")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_reviews: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_themes(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/themes")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_themes: {e}")
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@cache_response(timeout=7200)
def get_anime_streaming(request, anime_id):
    try:
        resp = jikan_get(f"/anime/{anime_id}/streaming")
        return Response(resp.json())
    except Exception as e:
        print(f"❌ Error in get_anime_streaming: {e}")
        return Response({"error": str(e)}, status=500)
