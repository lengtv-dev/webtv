import React, { useState, useMemo } from 'react';
import { Category, LiveStream, PlaybackItem, EPGItem } from '../types';
import { 
  Search, 
  Star, 
  Radio, 
  Calendar, 
  Tv, 
  Play, 
  Clock, 
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';

interface LiveTvViewProps {
  categories: Category[];
  streams: LiveStream[];
  currentPlayback: PlaybackItem | null;
  onSelectChannel: (stream: LiveStream) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onViewEPG: (stream: LiveStream) => void;
  isTvMode: boolean;
}

export const LiveTvView: React.FC<LiveTvViewProps> = ({
  categories,
  streams,
  currentPlayback,
  onSelectChannel,
  favorites,
  onToggleFavorite,
  onViewEPG,
  isTvMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filter channels
  const filteredStreams = useMemo(() => {
    return streams.filter((stream) => {
      // Category filter
      if (selectedCategory !== 'all' && stream.category_id !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(Number(stream.stream_id))) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = stream.name.toLowerCase().includes(query);
        const matchesNum = String(stream.num || stream.stream_id).includes(query);
        return matchesName || matchesNum;
      }
      return true;
    });
  }, [streams, selectedCategory, showFavoritesOnly, favorites, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Category Pills & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Category horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-1">
          <button
            id="cat-all-btn"
            onClick={() => { setSelectedCategory('all'); setShowFavoritesOnly(false); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedCategory === 'all' && !showFavoritesOnly
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            ทั้งหมด ({streams.length})
          </button>

          <button
            id="cat-favorites-btn"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              showFavoritesOnly
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : 'text-amber-400'}`} />
            ช่องโปรด ({favorites.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.category_id}
              id={`cat-${cat.category_id}-btn`}
              onClick={() => { setSelectedCategory(cat.category_id); setShowFavoritesOnly(false); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCategory === cat.category_id && !showFavoritesOnly
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="live-channel-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อช่อง หรือเลขช่อง..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

      </div>

      {/* Channels Grid / List */}
      {filteredStreams.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-400">
          <Tv className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <p className="text-base font-semibold text-zinc-300">ไม่พบช่องรายการที่ตรงกับเงื่อนไข</p>
          <p className="text-xs text-zinc-400 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น</p>
        </div>
      ) : (
        <div 
          className={`grid gap-2.5 ${
            isTvMode
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
        >
          {filteredStreams.map((stream) => {
            const isPlaying = currentPlayback?.type === 'live' && String(currentPlayback?.id) === String(stream.stream_id);
            const isFav = favorites.includes(Number(stream.stream_id));

            return (
              <div
                key={stream.stream_id}
                id={`channel-card-${stream.stream_id}`}
                className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isPlaying
                    ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-zinc-900/70 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700'
                } ${isTvMode ? 'p-4' : 'p-3'}`}
              >
                {/* Channel Icon or Placeholder */}
                <div 
                  onClick={() => onSelectChannel(stream)}
                  className={`relative shrink-0 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center cursor-pointer ${
                    isTvMode ? 'w-16 h-16' : 'w-12 h-12'
                  }`}
                >
                  {stream.stream_icon ? (
                    <img
                      src={stream.stream_icon}
                      alt={stream.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback on broken image
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Radio className="w-5 h-5 text-amber-500/70" />
                  )}

                  {/* Play badge on hover */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>

                {/* Channel Details */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onSelectChannel(stream)}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      CH {stream.num || stream.stream_id}
                    </span>
                    {isPlaying && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                        PLAYING
                      </span>
                    )}
                  </div>
                  <h3 className={`font-semibold text-zinc-100 truncate ${isTvMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                    {stream.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span>กำลังออกอากาศรายการสด</span>
                  </p>
                </div>

                {/* Action buttons: EPG & Favorite */}
                <div className="flex items-center gap-1">
                  <button
                    id={`channel-epg-btn-${stream.stream_id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewEPG(stream);
                    }}
                    title="ดูตารางรายการช่องนี้ (EPG)"
                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>

                  <button
                    id={`channel-fav-btn-${stream.stream_id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(Number(stream.stream_id));
                    }}
                    title={isFav ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                    className={`p-2 rounded-lg hover:bg-zinc-800 transition ${
                      isFav ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
