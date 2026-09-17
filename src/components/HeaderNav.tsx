import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Film, 
  Clapperboard, 
  Calendar, 
  Monitor, 
  LogOut, 
  Radio, 
  Search, 
  Sparkles,
  Layers,
  MessageCircle
} from 'lucide-react';
import { UserInfo, ServerInfo, LiveStream, MovieStream, SeriesStream } from '../types';
import { AdminContactModal } from './AdminContactModal';
import { GlobalSearchModal } from './GlobalSearchModal';

interface HeaderNavProps {
  activeTab: 'live' | 'movies' | 'series' | 'epg';
  onTabChange: (tab: 'live' | 'movies' | 'series' | 'epg') => void;
  isTvMode: boolean;
  onToggleTvMode: () => void;
  onLogout: () => void;
  isDemo: boolean;
  userInfo?: UserInfo;
  serverInfo?: ServerInfo;
  serverUrl?: string;
  liveStreams?: LiveStream[];
  movies?: MovieStream[];
  seriesList?: SeriesStream[];
  onSelectLive?: (stream: LiveStream) => void;
  onSelectMovie?: (movie: MovieStream) => void;
  onSelectSeries?: (series: SeriesStream) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  isTvMode,
  onToggleTvMode,
  onLogout,
  isDemo,
  userInfo,
  serverUrl,
  liveStreams = [],
  movies = [],
  seriesList = [],
  onSelectLive,
  onSelectMovie,
  onSelectSeries,
}) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Global keyboard shortcut to trigger search (/ or Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA'].includes(activeTag)) return;

      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setShowSearchModal(true);
      } else if (e.key === '/') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectLiveChannel = (stream: LiveStream) => {
    if (onSelectLive) onSelectLive(stream);
    onTabChange('live');
  };

  const handleSelectMovieItem = (movie: MovieStream) => {
    if (onSelectMovie) onSelectMovie(movie);
    onTabChange('movies');
  };

  const handleSelectSeriesItem = (series: SeriesStream) => {
    if (onSelectSeries) onSelectSeries(series);
    onTabChange('series');
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Server Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
                <Tv className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white">PLAYID</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-zinc-800 text-amber-400 font-mono font-bold">WEB</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="truncate max-w-[130px] font-mono">
                    {isDemo ? 'สมาชิกแอดมิน (VIP)' : serverUrl?.replace(/https?:\/\//, '')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              id="nav-tab-live"
              onClick={() => onTabChange('live')}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition whitespace-nowrap ${
                isTvMode ? 'text-base' : 'text-xs sm:text-sm'
              } ${
                activeTab === 'live'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4 text-rose-500" />
              <span>ถ่ายทอดสด</span>
            </button>

            <button
              id="nav-tab-movies"
              onClick={() => onTabChange('movies')}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition whitespace-nowrap ${
                isTvMode ? 'text-base' : 'text-xs sm:text-sm'
              } ${
                activeTab === 'movies'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-sky-400" />
              <span>ภาพยนตร์</span>
            </button>

            <button
              id="nav-tab-series"
              onClick={() => onTabChange('series')}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition whitespace-nowrap ${
                isTvMode ? 'text-base' : 'text-xs sm:text-sm'
              } ${
                activeTab === 'series'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Clapperboard className="w-4 h-4 text-purple-400" />
              <span>ซีรีส์</span>
            </button>

            <button
              id="nav-tab-epg"
              onClick={() => onTabChange('epg')}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition whitespace-nowrap ${
                isTvMode ? 'text-base' : 'text-xs sm:text-sm'
              } ${
                activeTab === 'epg'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>ผังรายการ EPG</span>
            </button>
          </nav>

          {/* Right Controls: Search, Contact Admin, TV Mode toggle & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Global Search Button */}
            <button
              id="header-search-btn"
              onClick={() => setShowSearchModal(true)}
              title="ค้นหาช่องรายการสด, ภาพยนตร์, ซีรีส์ (กด / หรือ Ctrl+K)"
              className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-medium transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden lg:inline text-zinc-300 font-normal">ค้นหาช่อง, หนัง, ซีรีส์...</span>
              <span className="hidden sm:inline lg:hidden text-zinc-300 font-normal">ค้นหา</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700/60 ml-0.5">
                /
              </kbd>
            </button>

            {/* Contact Admin LINE Button */}
            <button
              id="header-contact-admin-btn"
              onClick={() => setShowContactModal(true)}
              title="ติดต่อแอดมิน LINE (สอบถาม/ขอสิทธิ์/แจ้งปัญหา)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold bg-[#06C755]/15 hover:bg-[#06C755]/25 text-[#06C755] border border-[#06C755]/30 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span className="hidden xl:inline">ติดต่อแอดมิน</span>
            </button>

            {/* TV Browser Mode Toggle Button */}
            <button
              id="toggle-tv-mode-btn"
              onClick={onToggleTvMode}
              title="โหมดเบราว์เซอร์ทีวี (ขนาดปุ่มใหญ่ เหมาะกับรีโมท Fire TV/Android TV)"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isTvMode
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">
                {isTvMode ? 'โหมดทีวี: เปิดอยู่' : 'โหมดเบราว์เซอร์ทีวี'}
              </span>
            </button>

            {/* Logout / Switch Server */}
            <button
              id="logout-server-btn"
              onClick={onLogout}
              title="ออกจากระบบ / เปลี่ยนเซิร์ฟเวอร์"
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-rose-950/40 hover:text-rose-400 text-zinc-400 border border-zinc-800 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        liveStreams={liveStreams}
        movies={movies}
        seriesList={seriesList}
        onSelectLive={handleSelectLiveChannel}
        onSelectMovie={handleSelectMovieItem}
        onSelectSeries={handleSelectSeriesItem}
        isTvMode={isTvMode}
      />

      {/* Admin Contact Modal */}
      <AdminContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </header>
  );
};
