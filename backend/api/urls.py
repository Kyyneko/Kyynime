# backend/api/urls.py

from django.urls import path
from . import views

app_name = "api"

urlpatterns = [
    # ========== SEARCH & TOP ==========
    path("anime/search/", views.search_anime, name="search_anime"),
    path("anime/top/", views.get_top_anime, name="top_anime"),
    path("anime/seasonal/", views.get_seasonal_anime, name="seasonal_anime"),

    # ========== ANIME BASIC INFO ==========
    path("anime/<int:anime_id>/", views.get_anime_detail, name="anime_detail"),
    path("anime/<int:anime_id>/full/", views.get_anime_full, name="anime_full"),

    # ========== ANIME DETAILS ==========
    path(
        "anime/<int:anime_id>/characters/",
        views.get_anime_characters,
        name="anime_characters",
    ),
    path(
        "anime/<int:anime_id>/staff/",
        views.get_anime_staff,
        name="anime_staff",
    ),
    path(
        "anime/<int:anime_id>/episodes/",
        views.get_anime_episodes,
        name="anime_episodes",
    ),
    path(
        "anime/<int:anime_id>/episodes/<int:episode>/",
        views.get_anime_episode_detail,
        name="anime_episode_detail",
    ),
    path(
        "anime/<int:anime_id>/news/",
        views.get_anime_news,
        name="anime_news",
    ),
    path(
        "anime/<int:anime_id>/videos/",
        views.get_anime_videos,
        name="anime_videos",
    ),
    path(
        "anime/<int:anime_id>/pictures/",
        views.get_anime_pictures,
        name="anime_pictures",
    ),
    path(
        "anime/<int:anime_id>/statistics/",
        views.get_anime_statistics,
        name="anime_statistics",
    ),
    path(
        "anime/<int:anime_id>/recommendations/",
        views.get_anime_recommendations,
        name="anime_recommendations",
    ),
    path(
        "anime/<int:anime_id>/reviews/",
        views.get_anime_reviews,
        name="anime_reviews",
    ),
    path(
        "anime/<int:anime_id>/themes/",
        views.get_anime_themes,
        name="anime_themes",
    ),
    path(
        "anime/<int:anime_id>/streaming/",
        views.get_anime_streaming,
        name="anime_streaming",
    ),
]
