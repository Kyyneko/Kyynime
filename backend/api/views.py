from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.cache import cache
import requests
import time
from functools import wraps

JIKAN_BASE_URL = 'https://api.jikan.moe/v4'
RATE_LIMIT_DELAY = 0.35  # 350ms delay = ~3 requests per second

# Global variable to track last request time
last_request_time = 0

def rate_limited_request(url):
    """
    Make rate-limited request to Jikan API
    Ensures we don't exceed 3 requests per second
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

def cache_response(timeout=3600):
    """
    Cache decorator for API responses
    Default cache timeout: 1 hour
    """
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            # Create cache key from function name and parameters
            anime_id = kwargs.get('anime_id', '')
            episode = kwargs.get('episode', '')
            query_string = request.GET.urlencode()
            
            cache_key = f"jikan_{func.__name__}_{anime_id}_{episode}_{query_string}"
            
            # Try to get from cache
            cached_data = cache.get(cache_key)
            if cached_data:
                print(f"✅ CACHE HIT: {cache_key[:60]}")
                return Response(cached_data)
            
            # Cache miss - call the actual function
            print(f"❌ CACHE MISS: {cache_key[:60]}")
            response = func(request, *args, **kwargs)
            
            # Cache successful responses
            if response.status_code == 200 and hasattr(response, 'data'):
                cache.set(cache_key, response.data, timeout)
                print(f"💾 Cached for {timeout}s: {cache_key[:60]}")
            
            return response
        return wrapper
    return decorator


# ========== SEARCH & TOP ANIME ==========

@api_view(['GET'])
@cache_response(timeout=1800)  # Cache 30 minutes
def search_anime(request):
    query = request.GET.get('q', '')
    page = request.GET.get('page', '1')
    url = f'{JIKAN_BASE_URL}/anime?q={query}&page={page}'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in search_anime: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=3600)  # Cache 1 hour
def get_top_anime(request):
    page = request.GET.get('page', '1')
    url = f'{JIKAN_BASE_URL}/top/anime?page={page}'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_top_anime: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=3600)  # Cache 1 hour
def get_seasonal_anime(request):
    url = f'{JIKAN_BASE_URL}/seasons/now'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_seasonal_anime: {str(e)}")
        return Response({"error": str(e)}, status=500)


# ========== ANIME BASIC INFO ==========

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_detail(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_detail: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_full(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/full'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_full: {str(e)}")
        return Response({"error": str(e)}, status=500)


# ========== ANIME DETAILS ==========

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_characters(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/characters'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_characters: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_staff(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/staff'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_staff: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_episodes(request, anime_id):
    page = request.GET.get('page', '1')
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/episodes?page={page}'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_episodes: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_episode_detail(request, anime_id, episode):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/episodes/{episode}'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_episode_detail: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_news(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/news'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_news: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)
def get_anime_videos(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/videos'
    
    try:
        response = rate_limited_request(url)
        data = response.json()
        
        # Log untuk debugging
        promo_count = len(data.get('data', {}).get('promo', []))
        episodes_count = len(data.get('data', {}).get('episodes', []))
        music_count = len(data.get('data', {}).get('music_videos', []))
        
        print(f"📹 Anime {anime_id} videos: {promo_count} promos, {episodes_count} episodes, {music_count} music")
        
        return Response(data)
    except Exception as e:
        print(f"❌ Error in get_anime_videos: {str(e)}")
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_pictures(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/pictures'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_pictures: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_statistics(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/statistics'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_statistics: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_recommendations(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/recommendations'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_recommendations: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_reviews(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/reviews'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_reviews: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_themes(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/themes'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_themes: {str(e)}")
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@cache_response(timeout=7200)  # Cache 2 hours
def get_anime_streaming(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/streaming'
    
    try:
        response = rate_limited_request(url)
        return Response(response.json())
    except Exception as e:
        print(f"❌ Error in get_anime_streaming: {str(e)}")
        return Response({"error": str(e)}, status=500)
