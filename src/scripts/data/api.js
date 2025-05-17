import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';
import { openDB, storeData, getData } from '../utils/db';

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  MY_USER_INFO: `${BASE_URL}/users/me`,

  // stories
  STORY_LIST: `${BASE_URL}/stories`,
  STORE_NEW_STORY: `${BASE_URL}/stories`,
};

// Tambahkan di bagian atas file, setelah imports
const FETCH_TIMEOUT = 15000; // 15 seconds timeout

async function fetchWithTimeout(resource, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - Koneksi terlalu lama');
    }
    throw error;
  }
}

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  try {
    const fetchResponse = await fetchWithTimeout(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });

    if (!fetchResponse.ok) {
      throw new Error(`Login gagal! status: ${fetchResponse.status}`);
    }

    const json = await fetchResponse.json();
    return {
      ...json,
      ok: true
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      error: error.message || 'Gagal login. Silakan coba lagi.',
      ok: false
    };
  }
}

export async function getMyUserInfo() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.MY_USER_INFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// Versi getAllStories dengan IndexedDB dan timeout
// Tambahkan konstanta untuk cache
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 detik

// Fungsi helper untuk delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk mengecek apakah cache masih valid
function isCacheValid(timestamp) {
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
}

// Versi getAllStories yang lebih robust
export async function getAllStories(forceRefresh = false) {
  const accessToken = getAccessToken();
  let retryCount = 0;

  // Function untuk fetch data dari server
  async function fetchFromServer() {
    try {
      const fetchResponse = await fetchWithTimeout(ENDPOINTS.STORY_LIST, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
      }

      const json = await fetchResponse.json();
      
      // Simpan ke cache dengan timestamp
      await storeData('stories', {
        id: 'all_stories',
        ...json,
        timestamp: Date.now()
      });

      return {
        ...json,
        ok: true
      };
    } catch (error) {
      throw error;
    }
  }

  // Main logic
  try {
    // Jika force refresh, langsung ke server
    if (!forceRefresh) {
      // Coba ambil dari cache dulu
      const cachedStories = await getData('stories', 'all_stories');
      if (cachedStories && isCacheValid(cachedStories.timestamp)) {
        return {
          ...cachedStories,
          ok: true,
          fromCache: true
        };
      }
    }

    // Retry logic untuk fetch dari server
    while (retryCount < MAX_RETRIES) {
      try {
        return await fetchFromServer();
      } catch (error) {
        retryCount++;
        if (retryCount === MAX_RETRIES) {
          throw error;
        }
        // Tunggu sebelum retry
        await delay(RETRY_DELAY * retryCount);
        console.log(`Mencoba mengambil data lagi... (Percobaan ${retryCount + 1}/${MAX_RETRIES})`);
      }
    }
  } catch (error) {
    console.error('Error fetching stories:', error);
    
    // Jika gagal dan ada cache (walau expired), gunakan cache sebagai fallback
    const cachedStories = await getData('stories', 'all_stories');
    if (cachedStories) {
      return {
        ...cachedStories,
        ok: true,
        fromCache: true,
        isStale: true
      };
    }

    return {
      error: 'Terjadi kesalahan saat pengambilan data. Gunakan jaringan lain atau coba lagi nanti.',
      ok: false
    };
  }
}

export async function storeNewStory({
  description,
  photo,
  lat,
  lon,
}) {
  const accessToken = getAccessToken();

  const formData = new FormData();
  formData.set('description', description);

  if (lat) formData.set('lat', lat);
  if (lon) formData.set('lon', lon);

  if (Array.isArray(photo)) {
    photo.forEach((image) => {
      formData.append('photo', image);
    });
  } else {
    formData.append('photo', photo);
  }

  const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_STORY, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}