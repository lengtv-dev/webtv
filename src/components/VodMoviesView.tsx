import React, { useState, useMemo } from 'react';
import { Category, MovieStream } from '../types';
import { 
  Search, 
  Film, 
  Play, 
  Star, 
  Clock, 
  Calendar, 
  X,
  Tag
} from 'lucide-react';

interface VodMoviesViewProps {
  categories: Category[];
  movies: MovieStream[];
  onSelectMovie: (movie: MovieStream) => void;
  isTvMode: boolean;
}

export const VodMoviesView: React.FC<VodMoviesViewProps> = ({
  categories,
  movies,
  onSelectMovie,
  isTvMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMovieModal, setActiveMovieModal] = useState<MovieStream | null>(null);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      if (selectedCategory !== 'all' && movie.category_id !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return movie.name.toLowerCase().includes(query) || (movie.genre && movie.genre.toLowerCase().includes(query));
      }
      return true;
    });
  }, [movies, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-1">
          <button
            id="movie-cat-all-btn"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            ภาพยนตร์ทั้งหมด ({movies.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.category_id}
              id={`movie-cat-${cat.category_id}-btn`}
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
            id="movie-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาภาพยนตร์, แนวหนัง..."
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

      {/* Visual Posters Grid */}
      {filteredMovies.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-400">
          <Film className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <p className="text-base font-semibold text-zinc-300">ไม่พบภาพยนตร์ในหมวดหมู่นี้</p>
          <p className="text-xs text-zinc-400 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น</p>
        </div>
      ) : (
        <div 
          className={`grid gap-4 ${
            isTvMode
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
          }`}
        >
          {filteredMovies.map((movie) => (
            <div
              key={movie.stream_id}
              id={`movie-card-${movie.stream_id}`}
              onClick={() => setActiveMovieModal(movie)}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/80 hover:shadow-xl hover:shadow-amber-500/10 transition-all cursor-pointer select-none"
            >
              {/* Poster Image */}
              <div className="relative aspect-2/3 w-full bg-zinc-950 overflow-hidden">
                {movie.stream_icon ? (
                  <img
                    src={movie.stream_icon}
                    alt={movie.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-700">
                    <Film className="w-12 h-12" />
                  </div>
                )}

                {/* Rating badge */}
                {movie.rating && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs border border-zinc-700 text-amber-400 text-[11px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{movie.rating}</span>
                  </div>
                )}

                {/* Hover Play button overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/40 mb-2 transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">ดูรายละเอียด</span>
                </div>
              </div>

              {/* Movie info snippet */}
              <div className="p-3 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {movie.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                    {movie.year && <span>{movie.year}</span>}
                    {movie.duration && (
                      <>
                        <span>•</span>
                        <span>{movie.duration}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Movie Details Modal */}
      {activeMovieModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setActiveMovieModal(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl my-8 text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              id="close-movie-modal-btn"
              onClick={() => setActiveMovieModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-zinc-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row">
              {/* Poster Column */}
              <div className="sm:w-2/5 aspect-2/3 sm:aspect-auto bg-zinc-950 relative shrink-0">
                {activeMovieModal.stream_icon ? (
                  <img
                    src={activeMovieModal.stream_icon}
                    alt={activeMovieModal.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-zinc-700">
                    <Film className="w-16 h-16" />
                  </div>
                )}
              </div>

              {/* Info Column */}
              <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase">
                      VOD ภาพยนตร์
                    </span>
                    {activeMovieModal.rating && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {activeMovieModal.rating}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                    {activeMovieModal.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mb-4">
                    {activeMovieModal.year && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {activeMovieModal.year}
                      </span>
                    )}
                    {activeMovieModal.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {activeMovieModal.duration}
                      </span>
                    )}
                    {activeMovieModal.genre && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-zinc-500" />
                        {activeMovieModal.genre}
                      </span>
                    )}
                  </div>

                  {activeMovieModal.plot ? (
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                      {activeMovieModal.plot}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-400 mb-6 italic">
                      ไม่มีเนื้อเรื่องย่อสำหรับรายการนี้
                    </p>
                  )}
                </div>

                {/* Play Button */}
                <div className="pt-4 border-t border-zinc-800 flex gap-3">
                  <button
                    id="play-movie-btn"
                    onClick={() => {
                      onSelectMovie(activeMovieModal);
                      setActiveMovieModal(null);
                    }}
                    className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    เล่นภาพยนตร์ทันที
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
