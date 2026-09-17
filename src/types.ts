export interface XtreamCredentials {
  server: string;
  username: string;
  password: string;
  label?: string;
}

export interface UserInfo {
  auth: number;
  status: string;
  exp_date: string;
  is_trial: string;
  active_cons: string;
  max_connections: string;
  allowed_output_formats: string[];
}

export interface ServerInfo {
  url: string;
  port: string;
  https_port: string;
  server_protocol: string;
  timezone: string;
  time_now: string;
}

export interface AuthResponse {
  user_info: UserInfo;
  server_info: ServerInfo;
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id?: number;
}

export interface LiveStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  category_id: string;
  tv_archive?: number;
}

export interface EPGItem {
  id: string;
  ep_id?: string;
  title: string;
  lang?: string;
  start: string;
  end: string;
  description?: string;
  start_timestamp?: string;
  stop_timestamp?: string;
}

export interface MovieStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  rating?: string;
  rating_5based?: number;
  container_extension: string;
  category_id: string;
  year?: string;
  genre?: string;
  plot?: string;
  duration?: string;
}

export interface SeriesStream {
  num: number;
  name: string;
  series_id: number;
  cover: string;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  releaseDate?: string;
  rating?: string;
  category_id: string;
}

export interface SeriesEpisode {
  id: string | number;
  season: number;
  episode_num: number;
  title: string;
  container_extension: string;
  info?: {
    plot?: string;
    duration?: string;
    movie_image?: string;
  };
}

export interface PlaybackItem {
  type: 'live' | 'movie' | 'series';
  id: string | number;
  title: string;
  streamUrl: string;
  backupStreamUrl?: string;
  icon?: string;
  categoryName?: string;
  currentProgram?: string;
  epgList?: EPGItem[];
  overview?: string;
  seriesDetails?: {
    seriesName: string;
    season: number;
    episode: number;
  };
}
