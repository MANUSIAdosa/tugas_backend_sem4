import api from './api';

export const CACHE_KEYS = {
  GAMES: 'admin_cache_games',
  USERS: 'admin_cache_users',
  CATEGORIES: 'admin_cache_categories',
  SLIDES: 'admin_cache_slides',
  PROMOS: 'admin_cache_promos',
  BANNERS: 'admin_cache_banners',
  CONTACT: 'admin_cache_contact',
  VOUCHERS: 'admin_cache_vouchers',
  ITEMS: (gameId) => `admin_cache_items_${gameId}`
};

export const getCache = (key) => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error reading cache', e);
    return null;
  }
};

export const setCache = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error writing cache', e);
  }
};

/** Auth fetch for multipart/form-data — delegates to api.formFetch */
export const authFormFetch = api.formFetch;
