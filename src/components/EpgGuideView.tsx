import React, { useState } from 'react';
import { LiveStream, EPGItem } from '../types';
import { Calendar, Clock, Play, Radio, Search, Tv } from 'lucide-react';

interface EpgGuideViewProps {
  streams: LiveStream[];
  getChannelEpg: (streamId: number) => EPGItem[];
  onSelectChannel: (stream: LiveStream) => void;
  isTvMode: boolean;
}

export const EpgGuideView: React.FC<EpgGuideViewProps> = ({
  streams,
  getChannelEpg,
  onSelectChannel,
  isTvMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStreams = streams.filter((s) => {
    if (!searchQuery.trim()) return true;
    return s.name.toLowerCase().includes(searchQuery.toLowerCase()) || String(s.num || s.stream_id).includes(searchQuery);
  });

  return (
    <div className="space-y-4">
      {/* Top filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            ตารางผังรายการทีวี (Electronic Program Guide - EPG)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            เช็ครายการที่กำลังออกอากาศสด และรายการถัดไป ไม่พลาดทุกแมตช์สำคัญและการถ่ายทอดสด
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="epg-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาช่องรายการ..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-700/80 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* EPG Timeline by Channels */}
      <div className="space-y-3">
        {filteredStreams.map((stream) => {
          const epgList = getChannelEpg(Number(stream.stream_id));

          return (
            <div
              key={stream.stream_id}
              id={`epg-channel-row-${stream.stream_id}`}
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 hover:border-zinc-700 transition"
            >
              {/* Channel identification */}
              <div 
                className="md:w-64 shrink-0 flex items-center gap-3 cursor-pointer group"
                onClick={() => onSelectChannel(stream)}
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                  {stream.stream_icon ? (
                    <img 
                      src={stream.stream_icon} 
                      alt="" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-1" 
                    />
                  ) : (
                    <Radio className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400">
                      CH {stream.num || stream.stream_id}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-amber-400 transition">
                    {stream.name}
                  </h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChannel(stream);
                    }}
                    className="mt-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    กดเพื่อรับชม
                  </button>
                </div>
              </div>

              {/* Schedule list */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {epgList && epgList.length > 0 ? (
                  epgList.map((prog, idx) => (
                    <div
                      key={prog.id || idx}
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        idx === 0
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                            {prog.start} - {prog.end}
                          </span>
                          {idx === 0 && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse uppercase">
                              กำลังออกอากาศ
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-semibold line-clamp-1 mb-1 text-white">
                          {prog.title}
                        </h4>
                        {prog.description && (
                          <p className="text-[11px] text-zinc-400 line-clamp-2">
                            {prog.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-4 text-center text-zinc-500 text-xs bg-zinc-950/40 rounded-xl border border-zinc-800/60">
                    ไม่มีข้อมูลผังรายการล่วงหน้าสำหรับช่องนี้
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
