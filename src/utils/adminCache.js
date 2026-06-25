import { getAuthToken } from './api';

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

/** Auth fetch for multipart/form-data */
export const authFormFetch = async (endpoint, method, formData) => {
  const token = getAuthToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(endpoint, { method, headers, body: formData });
  if (res.status === 401) {
    sessionStorage.clear();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return res.json();
};
