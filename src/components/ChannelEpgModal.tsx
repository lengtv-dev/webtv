import React from 'react';
import { LiveStream, EPGItem } from '../types';
import { Calendar, Play, Radio, X, Clock } from 'lucide-react';

interface ChannelEpgModalProps {
  stream: LiveStream | null;
  epgList: EPGItem[];
  onClose: () => void;
  onPlay: (stream: LiveStream) => void;
}

export const ChannelEpgModal: React.FC<ChannelEpgModalProps> = ({
  stream,
  epgList,
  onClose,
  onPlay,
}) => {
  if (!stream) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl my-8 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden">
              {stream.stream_icon ? (
                <img src={stream.stream_icon} alt="" className="w-full h-full object-contain p-1" />
              ) : (
                <Radio className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400">
                CH {stream.num || stream.stream_id}
              </span>
              <h3 className="text-base font-bold text-white leading-tight">{stream.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              ตารางรายการวันนี้
            </h4>
            <span className="text-xs text-zinc-500">เวลาท้องถิ่น</span>
          </div>

          {epgList.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              ไม่มีข้อมูลผังรายการสำหรับช่องนี้
            </div>
          ) : (
            epgList.map((epg, idx) => (
              <div
                key={epg.id || idx}
                className={`p-3 rounded-xl border transition ${
                  idx === 0
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-white truncate pr-2">
                    {epg.title}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                    {epg.start} - {epg.end}
                  </span>
                </div>
                {epg.description && (
                  <p className="text-[11px] text-zinc-400 line-clamp-3 mt-1 leading-relaxed">
                    {epg.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 flex gap-2">
          <button
            onClick={() => {
              onPlay(stream);
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            เปิดรับชมช่องนี้ทันที
          </button>
        </div>
      </div>
    </div>
  );
};
