import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

/* =========================
 * Rate limiting + queue
 * ========================= */

const api = axios.create({
  baseURL: BASE_URL,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let requestQueue = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;

  isProcessing = true;
  const { resolve, reject, config } = requestQueue.shift();

  try {
    // ~3 request per second
    await delay(350);
    const response = await api(config); // pakai axios instance dengan baseURL
    resolve(response.data);
  } catch (error) {
    console.error("Jikan API error:", error);
    reject(error);
  } finally {
    isProcessing = false;
    if (requestQueue.length > 0) {
      processQueue();
    }
  }
};

const queueRequest = (config) =>
  new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, config });
    processQueue();
  });

/* =====================
 * ANIME
 * ===================== */

// Top Anime: /top/anime
export const getTopAnime = (page = 1, filter = "") => {
  const filterParam = filter ? `&filter=${filter}` : "";
  return queueRequest({
    url: `/top/anime?page=${page}${filterParam}`,
  });
};

// Seasonal Anime: /seasons/now
export const getSeasonalAnime = (page = 1) => {
  return queueRequest({
    url: `/seasons/now?page=${page}`,
  });
};

// Search Anime: /anime?q=...
export const searchAnime = (query, page = 1) => {
  return queueRequest({
    url: `/anime?q=${encodeURIComponent(query)}&page=${page}&sfw=true`,
  });
};

// Anime detail: /anime/{id}/full
export const getAnimeFull = (id) => {
  return queueRequest({
    url: `/anime/${id}/full`,
  });
};

// Anime characters: /anime/{id}/characters
export const getAnimeCharacters = (id) => {
  return queueRequest({
    url: `/anime/${id}/characters`,
  });
};

// Anime staff: /anime/{id}/staff
export const getAnimeStaff = (id) => {
  return queueRequest({
    url: `/anime/${id}/staff`,
  });
};

// Anime episodes: /anime/{id}/episodes
export const getAnimeEpisodes = (id, page = 1) => {
  return queueRequest({
    url: `/anime/${id}/episodes?page=${page}`,
  });
};

// Anime news: /anime/{id}/news
export const getAnimeNews = (id, page = 1) => {
  return queueRequest({
    url: `/anime/${id}/news?page=${page}`,
  });
};

// Anime videos: /anime/{id}/videos
export const getAnimeVideos = (id) => {
  return queueRequest({
    url: `/anime/${id}/videos`,
  });
};

// Anime pictures: /anime/{id}/pictures
export const getAnimePictures = (id) => {
  return queueRequest({
    url: `/anime/${id}/pictures`,
  });
};

// Anime statistics: /anime/{id}/statistics
export const getAnimeStatistics = (id) => {
  return queueRequest({
    url: `/anime/${id}/statistics`,
  });
};

// Anime recommendations: /anime/{id}/recommendations
export const getAnimeRecommendations = (id) => {
  return queueRequest({
    url: `/anime/${id}/recommendations`,
  });
};

// Anime streaming: /anime/{id}/streaming
export const getAnimeStreaming = (id) => {
  return queueRequest({
    url: `/anime/${id}/streaming`,
  });
};

// Anime themes (OP/ED): /anime/{id}/themes
export const getAnimeThemes = (id) => {
  return queueRequest({
    url: `/anime/${id}/themes`,
  });
};

/* =====================
 * MANGA
 * ===================== */

// Top Manga: /top/manga
export const getTopManga = (page = 1, limit = 24) => {
  return queueRequest({
    url: `/top/manga?page=${page}&limit=${limit}&sfw=true`,
  });
};

// Search Manga: /manga?q=...
export const searchManga = (query, page = 1, limit = 24) => {
  const q = encodeURIComponent(query);
  return queueRequest({
    url: `/manga?q=${q}&page=${page}&limit=${limit}&sfw=true&order_by=score&sort=desc`,
  });
};

// Manga full detail: /manga/{id}/full
export const getMangaFull = (id) => {
  return queueRequest({
    url: `/manga/${id}/full`,
  });
};

// Manga characters: /manga/{id}/characters
export const getMangaCharacters = (id) => {
  return queueRequest({
    url: `/manga/${id}/characters`,
  });
};

// Manga news: /manga/{id}/news
export const getMangaNews = (id, page = 1) => {
  return queueRequest({
    url: `/manga/${id}/news?page=${page}`,
  });
};

// Manga pictures: /manga/{id}/pictures
export const getMangaPictures = (id) => {
  return queueRequest({
    url: `/manga/${id}/pictures`,
  });
};

// Manga statistics: /manga/{id}/statistics
export const getMangaStatistics = (id) => {
  return queueRequest({
    url: `/manga/${id}/statistics`,
  });
};

// Manga recommendations: /manga/{id}/recommendations
export const getMangaRecommendations = (id) => {
  return queueRequest({
    url: `/manga/${id}/recommendations`,
  });
};

// Manga genres: /genres/manga
export const getMangaGenres = () => {
  return queueRequest({
    url: `/genres/manga`,
  });
};

/* =====================
 * CHARACTERS
 * ===================== */

// Top Characters: /top/characters
export const getTopCharacters = (page = 1, limit = 24) => {
  return queueRequest({
    url: `/top/characters?page=${page}&limit=${limit}`,
  });
};

// Search Characters: /characters?q=...
export const searchCharacters = (query, page = 1, limit = 24) => {
  const q = encodeURIComponent(query);
  return queueRequest({
    url: `/characters?q=${q}&page=${page}&limit=${limit}&order_by=favorites&sort=desc`,
  });
};

// Character full detail: /characters/{id}/full
export const getCharacterFull = (id) => {
  return queueRequest({
    url: `/characters/${id}/full`,
  });
};

export const getCharacterAnime = (id) => {
  return queueRequest({
    url: `/characters/${id}/anime`,
  });
};

export const getCharacterManga = (id) => {
  return queueRequest({
    url: `/characters/${id}/manga`,
  });
};

export const getCharacterVoices = (id) => {
  return queueRequest({
    url: `/characters/${id}/voices`,
  });
};

export const getCharacterPictures = (id) => {
  return queueRequest({
    url: `/characters/${id}/pictures`,
  });
};

/* =====================
 * PEOPLE
 * ===================== */

export const getTopPeople = (page = 1) => {
  return queueRequest({
    url: `/top/people?page=${page}`,
  });
};

export const searchPeople = (query, page = 1) => {
  const q = encodeURIComponent(query);
  return queueRequest({
    url: `/people?q=${q}&page=${page}`,
  });
};

export const getPersonFull = (id) => {
  return queueRequest({
    url: `/people/${id}/full`,
  });
};

export const getPersonAnime = (id) => {
  return queueRequest({
    url: `/people/${id}/anime`,
  });
};

export const getPersonManga = (id) => {
  return queueRequest({
    url: `/people/${id}/manga`,
  });
};

export const getPersonVoices = (id) => {
  return queueRequest({
    url: `/people/${id}/voices`,
  });
};

export const getPersonPictures = (id) => {
  return queueRequest({
    url: `/people/${id}/pictures`,
  });
};

/* =====================
 * PRODUCERS / STUDIOS
 * ===================== */

export const getProducers = (page = 1) => {
  return queueRequest({
    url: `/producers?page=${page}`,
  });
};

export const getProducerFull = (id) => {
  return queueRequest({
    url: `/producers/${id}/full`,
  });
};

/* =====================
 * GENRES
 * ===================== */

export const getAnimeGenres = () => {
  return queueRequest({
    url: `/genres/anime`,
  });
};

/* =====================
 * RANDOM
 * ===================== */

export const getRandomAnime = () => {
  return queueRequest({
    url: `/random/anime`,
  });
};

export const getRandomManga = () => {
  return queueRequest({
    url: `/random/manga`,
  });
};

export const getRandomCharacter = () => {
  return queueRequest({
    url: `/random/characters`,
  });
};

export const getRandomPerson = () => {
  return queueRequest({
    url: `/random/people`,
  });
};

export default api;
