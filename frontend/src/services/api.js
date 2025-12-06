import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

// Rate limiting helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Axios instance with rate limiting
const api = axios.create({
  baseURL: BASE_URL,
});

// Rate limiter: Max 3 requests per second, 60 per minute
let requestQueue = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  const { resolve, reject, config } = requestQueue.shift();
  
  try {
    await delay(350); // 3 requests per second = ~350ms delay
    const response = await axios(config);
    resolve(response.data);
  } catch (error) {
    reject(error);
  } finally {
    isProcessing = false;
    if (requestQueue.length > 0) {
      processQueue();
    }
  }
};

const queueRequest = (config) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, config });
    processQueue();
  });
};

// ===== ANIME ENDPOINTS =====
export const getTopAnime = (page = 1, filter = '') => {
  const filterParam = filter ? `&filter=${filter}` : '';
  return queueRequest({ url: `${BASE_URL}/top/anime?page=${page}${filterParam}` });
};

export const getSeasonalAnime = () => {
  return queueRequest({ url: `${BASE_URL}/seasons/now` });
};

export const searchAnime = (query, page = 1) => {
  return queueRequest({ url: `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&sfw=true` });
};

export const getAnimeFull = (id) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/full` });
};

export const getAnimeCharacters = (id) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/characters` });
};

export const getAnimeStaff = (id) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/staff` });
};

export const getAnimeEpisodes = (id, page = 1) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/episodes?page=${page}` });
};

export const getAnimeNews = (id, page = 1) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/news?page=${page}` });
};

export const getAnimeVideos = (id) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/videos` });
};

export const getAnimePictures = (id) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/pictures` });
};

export const getAnimeStatistics = (id) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/statistics` });
};

export const getAnimeRecommendations = (id) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/recommendations` });
};

export const getAnimeStreaming = (id) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/streaming` });
};

export const getAnimeThemes = (id) => {
  return queueRequest({ url: `${BASE_URL}/anime/${id}/themes` });
};

// ===== MANGA ENDPOINTS =====
export const getTopManga = (page = 1) => {
  return queueRequest({ url: `${BASE_URL}/top/manga?page=${page}` });
};

export const searchManga = (query, page = 1) => {
  return queueRequest({ url: `${BASE_URL}/manga?q=${encodeURIComponent(query)}&page=${page}&sfw=true` });
};

export const getMangaFull = (id) => {
  return queueRequest({ url: `${BASE_URL}/manga/${id}/full` });
};

export const getMangaCharacters = (id) => {
  return queueRequest({ url: `${BASE_URL}/manga/${id}/characters` });
};

export const getMangaNews = (id) => {
  return queueRequest({ url: `${BASE_URL}/manga/${id}/news` });
};

export const getMangaPictures = (id) => {
  return queueRequest({ url: `${BASE_URL}/manga/${id}/pictures` });
};

export const getMangaStatistics = (id) => {
  return queueRequest({ url: `${BASE_URL}/manga/${id}/statistics` });
};

// ===== CHARACTERS ENDPOINTS =====
export const getTopCharacters = (page = 1) => {
  return queueRequest({ url: `${BASE_URL}/top/characters?page=${page}` });
};

export const searchCharacters = (query, page = 1) => {
  return queueRequest({ url: `${BASE_URL}/characters?q=${encodeURIComponent(query)}&page=${page}` });
};

export const getCharacterFull = (id) => {
  return queueRequest({ url: `${BASE_URL}/characters/${id}/full` });
};

export const getCharacterAnime = (id) => {
  return queueRequest({ url: `${BASE_URL}/characters/${id}/anime` });
};

export const getCharacterManga = (id) => {
  return queueRequest({ url: `${BASE_URL}/characters/${id}/manga` });
};

export const getCharacterVoices = (id) => {
  return queueRequest({ url: `${BASE_URL}/characters/${id}/voices` });
};

export const getCharacterPictures = (id) => {
  return queueRequest({ url: `${BASE_URL}/characters/${id}/pictures` });
};

// ===== PEOPLE ENDPOINTS =====
export const getTopPeople = (page = 1) => {
  return queueRequest({ url: `${BASE_URL}/top/people?page=${page}` });
};

export const searchPeople = (query, page = 1) => {
  return queueRequest({ url: `${BASE_URL}/people?q=${encodeURIComponent(query)}&page=${page}` });
};

export const getPersonFull = (id) => {
  return queueRequest({ url: `${BASE_URL}/people/${id}/full` });
};

export const getPersonAnime = (id) => {
  return queueRequest({ url: `${BASE_URL}/people/${id}/anime` });
};

export const getPersonManga = (id) => {
  return queueRequest({ url: `${BASE_URL}/people/${id}/manga` });
};

export const getPersonVoices = (id) => {
  return queueRequest({ url: `${BASE_URL}/people/${id}/voices` });
};

export const getPersonPictures = (id) => {
  return queueRequest({ url: `${BASE_URL}/people/${id}/pictures` });
};

// ===== PRODUCERS/STUDIOS ENDPOINTS =====
export const getProducers = (page = 1) => {
  return queueRequest({ url: `${BASE_URL}/producers?page=${page}` });
};

export const getProducerFull = (id) => {
  return queueRequest({ url: `${BASE_URL}/producers/${id}/full` });
};

// ===== GENRES ENDPOINTS =====
export const getAnimeGenres = () => {
  return queueRequest({ url: `${BASE_URL}/genres/anime` });
};

export const getMangaGenres = () => {
  return queueRequest({ url: `${BASE_URL}/genres/manga` });
};

// ===== RANDOM ENDPOINTS =====
export const getRandomAnime = () => {
  return queueRequest({ url: `${BASE_URL}/random/anime` });
};

export const getRandomManga = () => {
  return queueRequest({ url: `${BASE_URL}/random/manga` });
};

export const getRandomCharacter = () => {
  return queueRequest({ url: `${BASE_URL}/random/characters` });
};

export const getRandomPerson = () => {
  return queueRequest({ url: `${BASE_URL}/random/people` });
};

export default api;
