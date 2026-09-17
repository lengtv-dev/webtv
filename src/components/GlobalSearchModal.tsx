import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  Radio, 
  Film, 
  Clapperboard, 
  Play, 
  Star, 
  Clock, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { LiveStream, MovieStream, SeriesStream } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveStreams: LiveStream[];
  movies: MovieStream[];
  seriesList: SeriesStream[];
  onSelectLive: (stream: LiveStream) => void;
  onSelectMovie: (movie: MovieStream) => void;
  onSelectSeries: (series: SeriesStream) => void;
  isTvMode?: boolean;
}

type SearchFilterType = 'all' | 'live' | 'movies' | 'series';

interface SearchResultItem {
  id: string | number;
  type: 'live' | 'movie' | 'series';
  title: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  rating?: string;
  data: LiveStream | MovieStream | SeriesStream;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  liveStreams,
  movies,
  seriesList,
  onSelectLive,
  onSelectMovie,
  onSelectSeries,
  isTvMode = false,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilterType>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Compute search results across all streams
  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    const items: SearchResultItem[] = [];

    // Search Live Streams
    if (activeFilter === 'all' || activeFilter === 'live') {
      const liveMatches = (q 
        ? liveStreams.filter((s) => 
            s.name.toLowerCase().includes(q) || 
            String(s.num || '').includes(q) || 
            String(s.stream_id).includes(q)
          )
        : liveStreams.slice(0, 8)
      ).map((s) => ({
        id: `live-${s.stream_id}`,
        type: 'live' as const,
        title: s.name,
        subtitle: s.num ? `ช่อง ${s.num}` : `Stream #${s.stream_id}`,
        badge: 'ช่องสด',
        image: s.stream_icon,
        data: s,
      }));
      items.push(...liveMatches);
    }

    // Search Movies
    if (activeFilter === 'all' || activeFilter === 'movies') {
      const movieMatches = (q
        ? movies.filter((m) => 
            m.name.toLowerCase().includes(q) || 
            (m.genre && m.genre.toLowerCase().includes(q)) ||
            (m.year && String(m.year).includes(q))
          )
        : movies.slice(0, 8)
      ).map((m) => ({
        id: `movie-${m.stream_id}`,
        type: 'movie' as const,
        title: m.name,
        subtitle: [m.year, m.genre, m.duration].filter(Boolean).join(' • ') || 'ภาพยนตร์ VOD',
        badge: 'ภาพยนตร์',
        image: m.stream_icon,
        rating: m.rating,
        data: m,
      }));
      items.push(...movieMatches);
    }

    // Search Series
    if (activeFilter === 'all' || activeFilter === 'series') {
      const seriesMatches = (q
        ? seriesList.filter((s) => 
            s.name.toLowerCase().includes(q) || 
            (s.genre && s.genre.toLowerCase().includes(q))
          )
        : seriesList.slice(0, 8)
      ).map((s) => ({
        id: `series-${s.series_id}`,
        type: 'series' as const,
        title: s.name,
        subtitle: [s.releaseDate, s.genre].filter(Boolean).join(' • ') || 'ซีรีส์ชุด',
        badge: 'ซีรีส์',
        image: s.cover,
        rating: s.rating,
        data: s,
      }));
      items.push(...seriesMatches);
    }

    return items;
  }, [query, activeFilter, liveStreams, movies, seriesList]);

  // Reset selected index when query or results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length, activeFilter]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelectItem = (item: SearchResultItem) => {
    if (item.type === 'live') {
      onSelectLive(item.data as LiveStream);
    } else if (item.type === 'movie') {
      onSelectMovie(item.data as MovieStream);
    } else if (item.type === 'series') {
      onSelectSeries(item.data as SeriesStream);
    }
    onClose();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectItem(results[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  // Counts for tabs
  const liveCount = query.trim() 
    ? liveStreams.filter((s) => s.name.toLowerCase().includes(query.toLowerCase().trim())).length 
    : liveStreams.length;
  const moviesCount = query.trim() 
    ? movies.filter((m) => m.name.toLowerCase().includes(query.toLowerCase().trim())).length 
    : movies.length;
  const seriesCount = query.trim() 
    ? seriesList.filter((s) => s.name.toLowerCase().includes(query.toLowerCase().trim())).length 
    : seriesList.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 pb-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-2xl text-zinc-100 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              id="global-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อช่องทีวี, ภาพยนตร์, หรือซีรีส์..."
              className="w-full bg-transparent text-white placeholder-zinc-500 text-base sm:text-lg font-medium focus:outline-none pr-8"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="ปิดหน้าต่างค้นหา"
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Badges Bar */}
        <div className="px-4 py-2.5 bg-zinc-950/40 border-b border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            ทั้งหมด ({liveCount + moviesCount + seriesCount})
          </button>
          <button
            onClick={() => setActiveFilter('live')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
              activeFilter === 'live'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span>ช่องถ่ายทอดสด ({liveCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('movies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
              activeFilter === 'movies'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-sky-400" />
            <span>ภาพยนตร์ ({moviesCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('series')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
              activeFilter === 'series'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5 text-purple-400" />
            <span>ซีรีส์ ({seriesCount})</span>
          </button>
        </div>

        {/* Search Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[55vh]"
        >
          {results.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 space-y-3">
              <Search className="w-10 h-10 mx-auto text-zinc-600" />
              <div>
                <p className="text-sm font-semibold text-zinc-400">
                  ไม่พบผลการค้นหาสำหรับ "{query}"
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  ลองพิมพ์คำสั้นๆ เช่น ชื่อช่อง 'True', 'Mono', 'Ch3' หรือชื่อหนัง 'Inception'
                </p>
              </div>
            </div>
          ) : (
            <>
              {!query.trim() && (
                <div className="px-2 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>รายการแนะนำยอดนิยม</span>
                </div>
              )}

              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    data-index={index}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition border ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md'
                        : 'bg-zinc-950/40 hover:bg-zinc-800/60 border-zinc-800/70 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Image Thumbnail / Icon */}
                      <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt="" 
                            className="w-full h-full object-contain p-0.5"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : item.type === 'live' ? (
                          <Radio className="w-5 h-5 text-rose-400" />
                        ) : item.type === 'movie' ? (
                          <Film className="w-5 h-5 text-sky-400" />
                        ) : (
                          <Clapperboard className="w-5 h-5 text-purple-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">
                            {item.title}
                          </h4>
                          {/* Type Badge */}
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                            item.type === 'live' 
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : item.type === 'movie'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                          {item.subtitle && <span className="truncate">{item.subtitle}</span>}
                          {item.rating && (
                            <span className="flex items-center gap-1 text-amber-400 font-bold shrink-0">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {item.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500 text-black shadow-md'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{item.type === 'series' ? 'ดูซีรีส์' : 'รับชม'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Search Footer info */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-[10px] font-mono">↓</kbd>
              <span>เลื่อนเลือก</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-[10px] font-mono">Enter</kbd>
              <span>เปิดรับชม</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-[10px] font-mono">ESC</kbd>
              <span>ปิด</span>
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            พบทั้งหมด {results.length} รายการ
          </span>
        </div>
      </div>
    </div>
  );
};
