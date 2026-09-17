import React from 'react';
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
  Layers
} from 'lucide-react';
import { UserInfo, ServerInfo } from '../types';

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
}) => {
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
                  <span className="text-lg font-black tracking-tight text-white">Streamly</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-zinc-800 text-amber-400 font-mono font-bold">WEB</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="truncate max-w-[130px] font-mono">
                    {isDemo ? 'Demo Preview' : serverUrl?.replace(/https?:\/\//, '')}
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

          {/* Right Controls: TV Mode toggle & Logout */}
          <div className="flex items-center gap-2">
            {/* TV Browser Mode Toggle Button */}
            <button
              id="toggle-tv-mode-btn"
              onClick={onToggleTvMode}
              title="โหมดเบราว์เซอร์ทีวี (ขนาดปุ่มใหญ่ เหมาะกับรีโมท Fire TV/Android TV)"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
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
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-rose-950/40 hover:text-rose-400 text-zinc-400 border border-zinc-800 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
