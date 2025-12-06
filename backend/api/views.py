from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

JIKAN_BASE_URL = 'https://api.jikan.moe/v4'

# Anime Basic
@api_view(['GET'])
def search_anime(request):
    query = request.GET.get('q', '')
    page = request.GET.get('page', '1')
    url = f'{JIKAN_BASE_URL}/anime?q={query}&page={page}'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_detail(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_full(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/full'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_top_anime(request):
    page = request.GET.get('page', '1')
    url = f'{JIKAN_BASE_URL}/top/anime?page={page}'
    response = requests.get(url)
    return Response(response.json())

# Anime Details
@api_view(['GET'])
def get_anime_characters(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/characters'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_staff(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/staff'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_episodes(request, anime_id):
    page = request.GET.get('page', '1')
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/episodes?page={page}'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_episode_detail(request, anime_id, episode):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/episodes/{episode}'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_news(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/news'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_videos(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/videos'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_pictures(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/pictures'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_statistics(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/statistics'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_recommendations(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/recommendations'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_reviews(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/reviews'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_themes(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/themes'
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def get_anime_streaming(request, anime_id):
    url = f'{JIKAN_BASE_URL}/anime/{anime_id}/streaming'
    response = requests.get(url)
    return Response(response.json())

# Seasonal Anime
@api_view(['GET'])
def get_seasonal_anime(request):
    url = f'{JIKAN_BASE_URL}/seasons/now'
    response = requests.get(url)
    return Response(response.json())
