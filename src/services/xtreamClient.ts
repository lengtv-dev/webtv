import { AuthResponse, Category, LiveStream, MovieStream, SeriesStream, EPGItem } from '../types';

// Helper to clean server URL (remove trailing slash, ensure http/https)
export function sanitizeServerUrl(url: string): string {
  let cleaned = url.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'http://' + cleaned;
  }
  return cleaned.replace(/\/+$/, '');
}

// Proxies API calls to bypass CORS and Mixed-Content
async function fetchViaProxy<T>(url: string): Promise<T> {
  const proxyEndpoint = `/api/proxy/api?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyEndpoint);
  if (!res.ok) {
    let errorText = '';
    try {
      const errJson = await res.json();
      errorText = errJson.details || errJson.error || res.statusText;
    } catch {
      errorText = await res.text();
    }
    throw new Error(errorText || `HTTP ${res.status}`);
  }
  return res.json();
}

export const xtreamClient = {
  async authenticate(server: string, user: string, pass: string): Promise<AuthResponse> {
    const baseUrl = sanitizeServerUrl(server);
    const endpoint = `${baseUrl}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`;
    const data = await fetchViaProxy<any>(endpoint);
    
    if (!data || !data.user_info || data.user_info.auth === 0) {
      throw new Error(data?.user_info?.status || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (Invalid credentials)');
    }
    return data as AuthResponse;
  },

  async getLiveCategories(server: string, user: string, pass: string): Promise<Category[]> {
    const baseUrl = sanitizeServerUrl(server);
    const endpoint = `${baseUrl}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_live_categories`;
    const res = await fetchViaProxy<Category[]>(endpoint);
    return Array.isArray(res) ? res : [];
  },

  async getLiveStreams(server: string, user: string, pass: string, categoryId?: string): Promise<LiveStream[]> {
    const baseUrl = sanitizeServerUrl(server);
    let endpoint = `${baseUrl}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_live_streams`;
    if (categoryId && categoryId !== 'all') {
      endpoint += `&category_id=${encodeURIComponent(categoryId)}`;
    }
    const res = await fetchViaProxy<LiveStream[]>(endpoint);
    return Array.isArray(res) ? res : [];
  },

  async getShortEPG(server: string, user: string, pass: string, streamId: number | string): Promise<EPGItem[]> {
    try {
      const baseUrl = sanitizeServerUrl(server);
      const endpoint = `${baseUrl}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_short_epg&stream_id=${streamId}&limit=10`;
      const res = await fetchViaProxy<any>(endpoint);
      if (res && Array.isArray(res.epg_listings)) {
        return res.epg_listings;
      }
      return [];
    } catch {
      return [];
    }
  },

  async getVodCategories(server: string, user: string, pass: string): Promise<Category[]> {
    const baseUrl = sanitizeServerUrl(server);
    const endpoint = `${baseUrl}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_vod_categories`;
    const res = await fetchViaProxy<Category[]>(endpoint);
    return Array.isArray(res) ? res : [];
  },

  async getVodStreams(server: string, user: string, pass: string, categoryId?: string): Promise<MovieStream[]> {
    const baseUrl = sanitizeServerUrl(server);
    let endpoint = `${baseUrl}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_vod_streams`;
    if (categoryId && categoryId !== 'all') {
      endpoint += `&category_id=${encodeURIComponent(categoryId)}`;
    }
    const res = await fetchViaProxy<MovieStream[]>(endpoint);
    return Array.isArray(res) ? res : [];
  },

  async getSeriesCategories(server: string, user: string, pass: string): Promise<Category[]> {
    const baseUrl = sanitizeServerUrl(server);
    const endpoint = `${baseUrl}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_series_categories`;
    const res = await fetchViaProxy<Category[]>(endpoint);
    return Array.isArray(res) ? res : [];
  },

  async getSeries(server: string, user: string, pass: string, categoryId?: string): Promise<SeriesStream[]> {
    const baseUrl = sanitizeServerUrl(server);
    let endpoint = `${baseUrl}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_series`;
    if (categoryId && categoryId !== 'all') {
      endpoint += `&category_id=${encodeURIComponent(categoryId)}`;
    }
    const res = await fetchViaProxy<SeriesStream[]>(endpoint);
    return Array.isArray(res) ? res : [];
  },

  async getSeriesInfo(server: string, user: string, pass: string, seriesId: number | string): Promise<any> {
    const baseUrl = sanitizeServerUrl(server);
    const endpoint = `${baseUrl}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=get_series_info&series_id=${seriesId}`;
    return await fetchViaProxy<any>(endpoint);
  },

  // Generates stream playback URL with proxy wrapper
  getLiveStreamUrl(server: string, user: string, pass: string, streamId: number | string, useProxy = true): string {
    const baseUrl = sanitizeServerUrl(server);
    const directUrl = `${baseUrl}/live/${encodeURIComponent(user)}/${encodeURIComponent(pass)}/${streamId}.m3u8`;
    return useProxy ? `/api/proxy/stream?url=${encodeURIComponent(directUrl)}` : directUrl;
  },

  getVodStreamUrl(server: string, user: string, pass: string, streamId: number | string, extension = 'mp4', useProxy = true): string {
    const baseUrl = sanitizeServerUrl(server);
    const directUrl = `${baseUrl}/movie/${encodeURIComponent(user)}/${encodeURIComponent(pass)}/${streamId}.${extension || 'mp4'}`;
    return useProxy ? `/api/proxy/stream?url=${encodeURIComponent(directUrl)}` : directUrl;
  },

  getSeriesStreamUrl(server: string, user: string, pass: string, episodeId: number | string, extension = 'mp4', useProxy = true): string {
    const baseUrl = sanitizeServerUrl(server);
    const directUrl = `${baseUrl}/series/${encodeURIComponent(user)}/${encodeURIComponent(pass)}/${episodeId}.${extension || 'mp4'}`;
    return useProxy ? `/api/proxy/stream?url=${encodeURIComponent(directUrl)}` : directUrl;
  }
};
