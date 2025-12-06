import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Search & Top
export const searchAnime = async (query, page = 1) => {
    const response = await axios.get(`${API_URL}/anime/search/?q=${query}&page=${page}`);
    return response.data;
};

export const getTopAnime = async (page = 1) => {
    const response = await axios.get(`${API_URL}/anime/top/?page=${page}`);
    return response.data;
};

export const getSeasonalAnime = async () => {
    const response = await axios.get(`${API_URL}/anime/seasonal/`);
    return response.data;
};

// Anime Details
export const getAnimeDetail = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/`);
    return response.data;
};

export const getAnimeFull = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/full/`);
    return response.data;
};

export const getAnimeCharacters = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/characters/`);
    return response.data;
};

export const getAnimeStaff = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/staff/`);
    return response.data;
};

export const getAnimeEpisodes = async (id, page = 1) => {
    const response = await axios.get(`${API_URL}/anime/${id}/episodes/?page=${page}`);
    return response.data;
};

export const getAnimeNews = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/news/`);
    return response.data;
};

export const getAnimeVideos = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/videos/`);
    return response.data;
};

export const getAnimePictures = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/pictures/`);
    return response.data;
};

export const getAnimeStatistics = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/statistics/`);
    return response.data;
};

export const getAnimeRecommendations = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/recommendations/`);
    return response.data;
};

export const getAnimeReviews = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/reviews/`);
    return response.data;
};

export const getAnimeThemes = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/themes/`);
    return response.data;
};

export const getAnimeStreaming = async (id) => {
    const response = await axios.get(`${API_URL}/anime/${id}/streaming/`);
    return response.data;
};
