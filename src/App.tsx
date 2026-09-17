import React, { useState, useEffect, useCallback } from 'react';
import { 
  XtreamCredentials, 
  Category, 
  LiveStream, 
  MovieStream, 
  SeriesStream, 
  PlaybackItem, 
  EPGItem,
  UserInfo,
  ServerInfo 
} from './types';
import { xtreamClient } from './services/xtreamClient';
import { 
  DEMO_LIVE_CATEGORIES, 
  DEMO_LIVE_STREAMS, 
  DEMO_STREAM_URLS, 
  DEMO_VOD_CATEGORIES, 
  DEMO_MOVIES, 
  DEMO_MOVIE_URLS,
  DEMO_SERIES_CATEGORIES, 
  DEMO_SERIES, 
  DEMO_SERIES_EPISODES,
  getDemoEPG 
} from './data/demoData';
import { LoginForm } from './components/LoginForm';
import { HeaderNav } from './components/HeaderNav';
import { VideoPlayer } from './components/VideoPlayer';
import { LiveTvView } from './components/LiveTvView';
import { VodMoviesView } from './components/VodMoviesView';
import { SeriesView } from './components/SeriesView';
import { EpgGuideView } from './components/EpgGuideView';
import { ChannelEpgModal } from './components/ChannelEpgModal';
import { AdminContactModal, ADMIN_LINE_URL } from './components/AdminContactModal';
import { MessageCircle, ExternalLink } from 'lucide-react';

const STORAGE_KEY_CREDS = 'streamly_credentials';
const STORAGE_KEY_FAVS = 'streamly_favorites';
const STORAGE_KEY_TV_MODE = 'streamly_tv_mode';

export default function App() {
  const [credentials, setCredentials] = useState<XtreamCredentials | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const [serverInfo, setServerInfo] = useState<ServerInfo | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<'live' | 'movies' | 'series' | 'epg'>('live');
  const [isTvMode, setIsTvMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_TV_MODE) === 'true';
  });

  // Data collections
  const [liveCategories, setLiveCategories] = useState<Category[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [vodCategories, setVodCategories] = useState<Category[]>([]);
  const [movies, setMovies] = useState<MovieStream[]>([]);
  const [seriesCategories, setSeriesCategories] = useState<Category[]>([]);
  const [seriesList, setSeriesList] = useState<SeriesStream[]>([]);

  // Favorites
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVS);
      return saved ? JSON.parse(saved) : [101, 103];
    } catch {
      return [101, 103];
    }
  });

  // Currently playing stream
  const [currentPlayback, setCurrentPlayback] = useState<PlaybackItem | null>(null);

  // EPG modal state
  const [epgModalStream, setEpgModalStream] = useState<LiveStream | null>(null);
  const [epgModalList, setEpgModalList] = useState<EPGItem[]>([]);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [selectedSeriesForView, setSelectedSeriesForView] = useState<SeriesStream | null>(null);

  // Load saved session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CREDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.server && parsed.username && parsed.password) {
          handleLogin(
            parsed, 
            parsed.server.includes('demo.streamly.tv') || 
            parsed.server.includes('vip.streamly.tv') ||
            parsed.server.includes('vip.playid.tv')
          );
        }
      }
    } catch (e) {
      console.error('Failed to parse saved credentials', e);
    }
  }, []);

  // Sync TV mode state to body class and localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TV_MODE, String(isTvMode));
    if (isTvMode) {
      document.body.classList.add('tv-mode');
    } else {
      document.body.classList.remove('tv-mode');
    }
  }, [isTvMode]);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (streamId: number) => {
    setFavorites((prev) => 
      prev.includes(streamId) ? prev.filter((id) => id !== streamId) : [...prev, streamId]
    );
  };

  // Keyboard navigation for TV remote (Fire TV / Smart TV / Desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing inside an input
      if (['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === ' ' && currentPlayback) {
        e.preventDefault();
        const playBtn = document.getElementById('player-play-pause-btn');
        playBtn?.click();
      } else if (e.key === 'f' || e.key === 'F') {
        const fsBtn = document.getElementById('player-fullscreen-btn');
        fsBtn?.click();
      } else if (e.key === 'ArrowRight' && currentPlayback?.type === 'live') {
        handleNextChannel();
      } else if (e.key === 'ArrowLeft' && currentPlayback?.type === 'live') {
        handlePrevChannel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPlayback, liveStreams]);

  // Handle Login & Data Initialization
  const handleLogin = async (creds: XtreamCredentials, demoMode = false) => {
    setIsLoggingIn(true);
    setLoginError(null);

    if (demoMode) {
      setIsDemo(true);
      setCredentials(creds);
      localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(creds));

      setLiveCategories(DEMO_LIVE_CATEGORIES);
      setLiveStreams(DEMO_LIVE_STREAMS);
      setVodCategories(DEMO_VOD_CATEGORIES);
      setMovies(DEMO_MOVIES);
      setSeriesCategories(DEMO_SERIES_CATEGORIES);
      setSeriesList(DEMO_SERIES);

      // Autoplay first live stream
      const firstStream = DEMO_LIVE_STREAMS[0];
      const initialEpg = getDemoEPG(firstStream.stream_id);
      setCurrentPlayback({
        type: 'live',
        id: firstStream.stream_id,
        title: firstStream.name,
        streamUrl: DEMO_STREAM_URLS[firstStream.stream_id] || DEMO_STREAM_URLS[101],
        icon: firstStream.stream_icon,
        currentProgram: initialEpg[0]?.title,
        epgList: initialEpg,
      });

      setIsLoggingIn(false);
      return;
    }

    try {
      const auth = await xtreamClient.authenticate(creds.server, creds.username, creds.password);
      setUserInfo(auth.user_info);
      setServerInfo(auth.server_info);
      setCredentials(creds);
      setIsDemo(false);
      localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(creds));

      // Fetch categories and streams in parallel
      const [liveCats, liveStrms, vodCats, vodStrms, seriesCats, seriesStrms] = await Promise.all([
        xtreamClient.getLiveCategories(creds.server, creds.username, creds.password).catch(() => []),
        xtreamClient.getLiveStreams(creds.server, creds.username, creds.password).catch(() => []),
        xtreamClient.getVodCategories(creds.server, creds.username, creds.password).catch(() => []),
        xtreamClient.getVodStreams(creds.server, creds.username, creds.password).catch(() => []),
        xtreamClient.getSeriesCategories(creds.server, creds.username, creds.password).catch(() => []),
        xtreamClient.getSeries(creds.server, creds.username, creds.password).catch(() => []),
      ]);

      setLiveCategories(liveCats);
      setLiveStreams(liveStrms);
      setVodCategories(vodCats);
      setMovies(vodStrms);
      setSeriesCategories(seriesCats);
      setSeriesList(seriesStrms);

      // Play first stream if available
      if (liveStrms.length > 0) {
        const first = liveStrms[0];
        const streamUrl = xtreamClient.getLiveStreamUrl(creds.server, creds.username, creds.password, first.stream_id, true);
        setCurrentPlayback({
          type: 'live',
          id: first.stream_id,
          title: first.name,
          streamUrl: streamUrl,
          icon: first.stream_icon,
        });
      }
    } catch (err: any) {
      console.error('Xtream login failed:', err);
      setLoginError(err?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ Xtream ได้ โปรดตรวจสอบ URL หรือรหัสผ่าน');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_CREDS);
    setCredentials(null);
    setIsDemo(false);
    setCurrentPlayback(null);
    setUserInfo(undefined);
    setServerInfo(undefined);
  };

  // Channel Selection
  const handleSelectLiveChannel = useCallback(async (stream: LiveStream) => {
    if (isDemo) {
      const epg = getDemoEPG(Number(stream.stream_id));
      const url = DEMO_STREAM_URLS[Number(stream.stream_id)] || DEMO_STREAM_URLS[101];
      setCurrentPlayback({
        type: 'live',
        id: stream.stream_id,
        title: stream.name,
        streamUrl: url,
        icon: stream.stream_icon,
        currentProgram: epg[0]?.title,
        epgList: epg,
      });
      return;
    }

    if (!credentials) return;
    const streamUrl = xtreamClient.getLiveStreamUrl(
      credentials.server,
      credentials.username,
      credentials.password,
      stream.stream_id,
      true
    );

    let epg: EPGItem[] = [];
    try {
      epg = await xtreamClient.getShortEPG(credentials.server, credentials.username, credentials.password, stream.stream_id);
    } catch {}

    setCurrentPlayback({
      type: 'live',
      id: stream.stream_id,
      title: stream.name,
      streamUrl: streamUrl,
      icon: stream.stream_icon,
      currentProgram: epg[0]?.title,
      epgList: epg,
    });
  }, [credentials, isDemo]);

  // Next / Previous Channel Switching
  const handleNextChannel = () => {
    if (!currentPlayback || currentPlayback.type !== 'live' || liveStreams.length === 0) return;
    const currentIndex = liveStreams.findIndex((s) => String(s.stream_id) === String(currentPlayback.id));
    const nextIndex = (currentIndex + 1) % liveStreams.length;
    handleSelectLiveChannel(liveStreams[nextIndex]);
  };

  const handlePrevChannel = () => {
    if (!currentPlayback || currentPlayback.type !== 'live' || liveStreams.length === 0) return;
    const currentIndex = liveStreams.findIndex((s) => String(s.stream_id) === String(currentPlayback.id));
    const prevIndex = (currentIndex - 1 + liveStreams.length) % liveStreams.length;
    handleSelectLiveChannel(liveStreams[prevIndex]);
  };

  // Movie Selection
  const handleSelectMovie = (movie: MovieStream) => {
    if (isDemo) {
      const url = DEMO_MOVIE_URLS[Number(movie.stream_id)] || DEMO_MOVIE_URLS[201];
      setCurrentPlayback({
        type: 'movie',
        id: movie.stream_id,
        title: movie.name,
        streamUrl: url,
        icon: movie.stream_icon,
        overview: movie.plot,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!credentials) return;
    const streamUrl = xtreamClient.getVodStreamUrl(
      credentials.server,
      credentials.username,
      credentials.password,
      movie.stream_id,
      movie.container_extension || 'mp4',
      true
    );

    setCurrentPlayback({
      type: 'movie',
      id: movie.stream_id,
      title: movie.name,
      streamUrl: streamUrl,
      icon: movie.stream_icon,
      overview: movie.plot,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Series Episode Selection
  const handleSelectEpisode = (series: SeriesStream, episode: any, seasonNum: number) => {
    if (isDemo) {
      const url = episode.streamUrl || DEMO_MOVIE_URLS[201];
      setCurrentPlayback({
        type: 'series',
        id: episode.id,
        title: `${series.name} - ${episode.title || `EP ${episode.episode_num}`}`,
        streamUrl: url,
        icon: episode.info?.movie_image || series.cover,
        overview: episode.info?.plot,
        seriesDetails: {
          seriesName: series.name,
          season: seasonNum,
          episode: episode.episode_num,
        },
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!credentials) return;
    const streamUrl = xtreamClient.getSeriesStreamUrl(
      credentials.server,
      credentials.username,
      credentials.password,
      episode.id,
      episode.container_extension || 'mp4',
      true
    );

    setCurrentPlayback({
      type: 'series',
      id: episode.id,
      title: `${series.name} - ${episode.title || `EP ${episode.episode_num}`}`,
      streamUrl: streamUrl,
      icon: episode.info?.movie_image || series.cover,
      overview: episode.info?.plot,
      seriesDetails: {
        seriesName: series.name,
        season: seasonNum,
        episode: episode.episode_num,
      },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch series info for modal
  const fetchSeriesDetails = async (seriesId: number | string) => {
    if (isDemo) {
      return DEMO_SERIES_EPISODES[Number(seriesId)] || DEMO_SERIES_EPISODES[301];
    }
    if (!credentials) return null;
    return await xtreamClient.getSeriesInfo(credentials.server, credentials.username, credentials.password, seriesId);
  };

  // View channel EPG in modal
  const handleViewChannelEpg = async (stream: LiveStream) => {
    setEpgModalStream(stream);
    if (isDemo) {
      setEpgModalList(getDemoEPG(Number(stream.stream_id)));
      return;
    }
    if (!credentials) return;
    try {
      const list = await xtreamClient.getShortEPG(credentials.server, credentials.username, credentials.password, stream.stream_id);
      setEpgModalList(list);
    } catch {
      setEpgModalList([]);
    }
  };

  const handleSelectSeriesFromSearch = (series: SeriesStream) => {
    setSelectedSeriesForView(series);
    setActiveTab('series');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getChannelEpgHelper = (streamId: number) => {
    if (isDemo) {
      return getDemoEPG(streamId);
    }
    return [];
  };

  // If not authenticated, display the login screen
  if (!credentials) {
    return (
      <LoginForm
        onLogin={handleLogin}
        isLoading={isLoggingIn}
        errorMessage={loginError}
        initialServer="http://103.114.203.129:8080"
      />
    );
  }

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col ${isTvMode ? 'tv-mode' : ''}`}>
      {/* Header Navigation */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isTvMode={isTvMode}
        onToggleTvMode={() => setIsTvMode(!isTvMode)}
        onLogout={handleLogout}
        isDemo={isDemo}
        userInfo={userInfo}
        serverInfo={serverInfo}
        serverUrl={credentials?.server}
        liveStreams={liveStreams}
        movies={movies}
        seriesList={seriesList}
        onSelectLive={handleSelectLiveChannel}
        onSelectMovie={handleSelectMovie}
        onSelectSeries={handleSelectSeriesFromSearch}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Video Player Showcase */}
        <section id="player-showcase-section" className="max-w-4xl mx-auto">
          <VideoPlayer
            item={currentPlayback}
            onNextChannel={handleNextChannel}
            onPrevChannel={handlePrevChannel}
            isTvMode={isTvMode}
          />
        </section>

        {/* Dynamic Tab Views */}
        <section id="content-views-section" className="pt-2">
          {activeTab === 'live' && (
            <LiveTvView
              categories={liveCategories}
              streams={liveStreams}
              currentPlayback={currentPlayback}
              onSelectChannel={handleSelectLiveChannel}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onViewEPG={handleViewChannelEpg}
              isTvMode={isTvMode}
            />
          )}

          {activeTab === 'movies' && (
            <VodMoviesView
              categories={vodCategories}
              movies={movies}
              onSelectMovie={handleSelectMovie}
              isTvMode={isTvMode}
            />
          )}

          {activeTab === 'series' && (
            <SeriesView
              categories={seriesCategories}
              seriesList={seriesList}
              onSelectEpisode={handleSelectEpisode}
              fetchSeriesDetails={fetchSeriesDetails}
              isTvMode={isTvMode}
              selectedSeries={selectedSeriesForView}
            />
          )}

          {activeTab === 'epg' && (
            <EpgGuideView
              streams={liveStreams}
              getChannelEpg={getChannelEpgHelper}
              onSelectChannel={handleSelectLiveChannel}
              isTvMode={isTvMode}
            />
          )}
        </section>
      </main>

      {/* Channel EPG Modal */}
      {epgModalStream && (
        <ChannelEpgModal
          stream={epgModalStream}
          epgList={epgModalList}
          onClose={() => setEpgModalStream(null)}
          onPlay={handleSelectLiveChannel}
        />
      )}

      {/* Admin Contact Modal */}
      <AdminContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      {/* Floating Admin Contact Button */}
      <button
        id="floating-line-contact-btn"
        onClick={() => setShowContactModal(true)}
        title="ติดต่อแอดมิน LINE"
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 px-3.5 py-2.5 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs rounded-full shadow-lg shadow-[#06C755]/30 hover:scale-105 active:scale-95 transition cursor-pointer"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span className="hidden sm:inline">ติดต่อแอดมิน LINE</span>
      </button>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-zinc-900 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            PLAYID IPTV Web Player • URL เดียว ทุกหน้าจอ (มือถือ, iPad, PC และ Fire TV Browser)
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setShowContactModal(true)}
              className="text-[#06C755] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <MessageCircle className="w-3 h-3 fill-current" />
              <span>ติดต่อแอดมิน LINE</span>
            </button>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">
              HLS Browser Streaming • Built-in CORS Proxy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
