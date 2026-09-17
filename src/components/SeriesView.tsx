import React, { useState, useMemo, useEffect } from 'react';
import { Category, SeriesStream, SeriesEpisode } from '../types';
import { 
  Search, 
  Clapperboard, 
  Play, 
  Star, 
  X, 
  Layers, 
  Tv, 
  Clock,
  ChevronRight
} from 'lucide-react';

interface SeriesViewProps {
  categories: Category[];
  seriesList: SeriesStream[];
  onSelectEpisode: (series: SeriesStream, episode: any, seasonNum: number) => void;
  fetchSeriesDetails: (seriesId: number | string) => Promise<any>;
  isTvMode: boolean;
  selectedSeries?: SeriesStream | null;
}

export const SeriesView: React.FC<SeriesViewProps> = ({
  categories,
  seriesList,
  onSelectEpisode,
  fetchSeriesDetails,
  isTvMode,
  selectedSeries,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeries, setActiveSeries] = useState<SeriesStream | null>(null);
  const [seriesInfo, setSeriesInfo] = useState<any | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // If a series was selected externally (e.g. from header search), open it automatically
  useEffect(() => {
    if (selectedSeries) {
      handleOpenSeries(selectedSeries);
    }
  }, [selectedSeries]);

  const filteredSeries = useMemo(() => {
    return seriesList.filter((series) => {
      if (selectedCategory !== 'all' && series.category_id !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return series.name.toLowerCase().includes(query) || (series.genre && series.genre.toLowerCase().includes(query));
      }
      return true;
    });
  }, [seriesList, selectedCategory, searchQuery]);

  const handleOpenSeries = async (series: SeriesStream) => {
    setActiveSeries(series);
    setIsLoadingDetails(true);
    setSeriesInfo(null);
    try {
      const data = await fetchSeriesDetails(series.series_id);
      setSeriesInfo(data);
      if (data?.seasons && data.seasons.length > 0) {
        setSelectedSeason(data.seasons[0].season_number || 1);
      } else if (data?.episodes) {
        const firstSeasonKey = Object.keys(data.episodes)[0];
        setSelectedSeason(parseInt(firstSeasonKey, 10) || 1);
      }
    } catch (err) {
      console.error('Failed to load series episodes:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const currentEpisodes = useMemo(() => {
    if (!seriesInfo?.episodes) return [];
    return seriesInfo.episodes[String(selectedSeason)] || seriesInfo.episodes[selectedSeason] || [];
  }, [seriesInfo, selectedSeason]);

  return (
    <div className="space-y-4">
      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-1">
          <button
            id="series-cat-all-btn"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            ซีรีส์ทั้งหมด ({seriesList.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.category_id}
              id={`series-cat-${cat.category_id}-btn`}
              onClick={() => setSelectedCategory(cat.category_id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCategory === cat.category_id
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="series-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาซีรีส์..."
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

      {/* Series Grid */}
      {filteredSeries.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-400">
          <Clapperboard className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <p className="text-base font-semibold text-zinc-300">ไม่พบซีรีส์ในหมวดหมู่นี้</p>
        </div>
      ) : (
        <div 
          className={`grid gap-4 ${
            isTvMode
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
          }`}
        >
          {filteredSeries.map((series) => (
            <div
              key={series.series_id}
              id={`series-card-${series.series_id}`}
              onClick={() => handleOpenSeries(series)}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/80 hover:shadow-xl hover:shadow-amber-500/10 transition-all cursor-pointer select-none"
            >
              <div className="relative aspect-2/3 w-full bg-zinc-950 overflow-hidden">
                {series.cover ? (
                  <img
                    src={series.cover}
                    alt={series.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-700">
                    <Clapperboard className="w-12 h-12" />
                  </div>
                )}

                {series.rating && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs border border-zinc-700 text-amber-400 text-[11px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{series.rating}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/40 mb-2 transform group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">เลือกตอน (Episodes)</span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                  {series.name}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                  {series.genre || series.releaseDate || 'ซีรีส์'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Series Episodes Modal */}
      {activeSeries && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setActiveSeries(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl my-8 text-zinc-100 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800 flex items-start justify-between gap-4 shrink-0 bg-zinc-950/40">
              <div className="flex gap-4 items-start">
                <div className="w-16 h-24 rounded-lg bg-zinc-800 overflow-hidden shrink-0 hidden sm:block">
                  {activeSeries.cover && (
                    <img src={activeSeries.cover} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
                      ซีรีส์ VOD
                    </span>
                    {activeSeries.rating && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {activeSeries.rating}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {activeSeries.name}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 max-w-xl">
                    {activeSeries.plot}
                  </p>
                </div>
              </div>

              <button
                id="close-series-modal-btn"
                onClick={() => setActiveSeries(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center shrink-0 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {isLoadingDetails ? (
                <div className="py-12 flex flex-col items-center justify-center text-zinc-400">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-xs">กำลังโหลดรายชื่อซีซั่นและตอน...</p>
                </div>
              ) : (
                <>
                  {/* Season selector pills */}
                  {seriesInfo?.seasons && seriesInfo.seasons.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {seriesInfo.seasons.map((s: any) => (
                        <button
                          key={s.season_number}
                          id={`season-btn-${s.season_number}`}
                          onClick={() => setSelectedSeason(s.season_number)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                            selectedSeason === s.season_number
                              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                          }`}
                        >
                          {s.name || `ซีซั่น ${s.season_number}`}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Episodes List */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      ตอนทั้งหมดใน ซีซั่น {selectedSeason} ({currentEpisodes.length} ตอน)
                    </h4>

                    {currentEpisodes.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 text-xs border border-zinc-800 rounded-xl">
                        ไม่พบตอนในซีซั่นนี้
                      </div>
                    ) : (
                      currentEpisodes.map((ep: any) => (
                        <div
                          key={ep.id}
                          id={`episode-row-${ep.id}`}
                          onClick={() => {
                            onSelectEpisode(activeSeries, ep, selectedSeason);
                            setActiveSeries(null);
                          }}
                          className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-amber-500/60 transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <div className="w-9 h-9 rounded-lg bg-zinc-900 group-hover:bg-amber-500 text-zinc-400 group-hover:text-black flex items-center justify-center shrink-0 font-bold text-xs transition">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-amber-400 truncate">
                                {ep.title || `EP ${ep.episode_num}`}
                              </p>
                              {ep.info?.plot && (
                                <p className="text-[11px] text-zinc-400 truncate max-w-md">
                                  {ep.info.plot}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-xs text-zinc-400 font-mono">
                            {ep.info?.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-zinc-500" />
                                {ep.info.duration}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
