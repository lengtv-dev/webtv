import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { PlaybackItem } from '../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Tv, 
  Radio, 
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

interface VideoPlayerProps {
  item: PlaybackItem | null;
  onClose?: () => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
  isTvMode?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  item,
  onClose,
  onNextChannel,
  onPrevChannel,
  isTvMode = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showEpgOverlay, setShowEpgOverlay] = useState(false);
  const [streamQuality, setStreamQuality] = useState<string>('Auto (HLS)');
  const hideControlsTimer = useRef<any>(null);

  const triggerControlsVisibility = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 4000);
  };

  useEffect(() => {
    const handleMouseMove = () => triggerControlsVisibility();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!item || !videoRef.current) return;

    setLoading(true);
    setError(null);

    const video = videoRef.current;
    const streamUrl = item.streamUrl;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHlsUrl = streamUrl.includes('.m3u8') || streamUrl.includes('/api/proxy/stream');

    if (isHlsUrl && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        manifestLoadingTimeOut: 15000,
        levelLoadingTimeOut: 15000,
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setLoading(false);
        if (data.levels && data.levels.length > 0) {
          const highest = data.levels[data.levels.length - 1];
          if (highest.height) {
            setStreamQuality(`${highest.height}p`);
          }
        }
        video.play().then(() => setIsPlaying(true)).catch(() => {
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('HLS Fatal Error:', data.type, data.details);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('เครือข่ายขัดข้อง กำลังลองเชื่อมต่อใหม่...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('ข้อผิดพลาดการถอดรหัสสื่อ กำลังกู้คืน...');
              hls.recoverMediaError();
              break;
            default:
              setError('ไม่สามารถเล่นสตรีมนี้ได้ (สัญญาณอาจออฟไลน์หรือถูกจำกัดสิทธิ์)');
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') || !isHlsUrl) {
      // Native Safari HLS support or regular MP4 file
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setError('ไม่สามารถเล่นไฟล์สื่อนี้ได้ในเบราว์เซอร์');
        setLoading(false);
      });
    } else {
      setError('เบราว์เซอร์นี้ไม่รองรับการเล่นสตรีม HLS');
      setLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.removeAttribute('src');
      video.load();
    };
  }, [item?.streamUrl, item?.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const reloadStream = () => {
    setError(null);
    setLoading(true);
    if (hlsRef.current) {
      hlsRef.current.loadSource(item?.streamUrl || '');
    } else if (videoRef.current && item?.streamUrl) {
      videoRef.current.src = item.streamUrl;
      videoRef.current.load();
    }
  };

  if (!item) {
    return (
      <div className="w-full aspect-video bg-zinc-900/80 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
        <Tv className="w-16 h-16 mb-4 text-zinc-600 animate-pulse" />
        <h3 className="text-xl font-semibold text-zinc-200 mb-2">เลือกช่อง หรือภาพยนตร์เพื่อเริ่มรับชม</h3>
        <p className="text-sm max-w-md text-zinc-400">
          คลิกที่รายการถ่ายทอดสด หนัง หรือซีรีส์ด้านล่าง เพื่อส่งสตรีม HLS เข้าสู่เพลเยอร์
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      id="main-video-player-container"
      className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 group select-none ${
        isTvMode ? 'ring-2 ring-amber-500/30' : ''
      }`}
    >
      <video
        ref={videoRef}
        id="html5-video-element"
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
        onWaiting={() => setLoading(true)}
        onPlaying={() => {
          setLoading(false);
          setIsPlaying(true);
        }}
      />

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs pointer-events-none z-20">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-medium text-zinc-200">กำลังเชื่อมต่อสัญญาณสตรีม...</p>
        </div>
      )}

      {/* Error Display with Retry */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 p-6 text-center z-25">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <p className="text-base font-medium text-rose-300 mb-1">{error}</p>
          <p className="text-xs text-zinc-400 max-w-md mb-4">
            ระบบใช้พร็อกซีป้องกัน CORS อัตโนมัติ หากสัญญาณยังไม่เล่น อาจเป็นเพราะเซิร์ฟเวอร์ต้นทางจำกัดการเชื่อมต่อพร้อมกัน
          </p>
          <div className="flex gap-3">
            <button
              id="retry-stream-btn"
              onClick={reloadStream}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-sm transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              ลองใหม่อีกครั้ง
            </button>
            {onNextChannel && (
              <button
                id="next-channel-error-btn"
                onClick={onNextChannel}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg text-sm transition"
              >
                สลับไปช่องถัดไป
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Header Overlay */}
      <div 
        className={`absolute top-0 inset-x-0 p-4 bg-linear-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 z-15 flex items-center justify-between ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-bold uppercase tracking-wider animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            {item.type === 'live' ? 'LIVE' : item.type === 'series' ? 'SERIES' : 'VOD'}
          </span>
          <div>
            <h2 className="text-base font-semibold text-white truncate max-w-xs sm:max-w-md">
              {item.title}
            </h2>
            {item.currentProgram && (
              <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <span>รายการ:</span> {item.currentProgram}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {item.epgList && item.epgList.length > 0 && (
            <button
              id="toggle-epg-overlay-btn"
              onClick={() => setShowEpgOverlay(!showEpgOverlay)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                showEpgOverlay 
                  ? 'bg-amber-500 text-black' 
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              ผังรายการ (EPG)
            </button>
          )}

          <div className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-mono">
            {streamQuality}
          </div>
        </div>
      </div>

      {/* EPG Overlay Drawer */}
      {showEpgOverlay && item.epgList && (
        <div className="absolute top-16 right-4 w-80 max-h-72 overflow-y-auto bg-zinc-950/95 border border-zinc-800 rounded-xl p-4 shadow-2xl z-30 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5" />
              ผังรายการวันนี้
            </h4>
            <button 
              onClick={() => setShowEpgOverlay(false)}
              className="text-zinc-400 hover:text-white text-xs"
            >
              ปิด ✕
            </button>
          </div>
          <div className="space-y-2.5">
            {item.epgList.map((epg, idx) => (
              <div 
                key={epg.id || idx}
                className={`p-2.5 rounded-lg text-xs ${
                  idx === 0 
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200' 
                    : 'bg-zinc-900/70 border border-zinc-800/80 text-zinc-300'
                }`}
              >
                <div className="flex justify-between font-semibold mb-1">
                  <span className="truncate pr-2">{epg.title}</span>
                  <span className="font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                    {epg.start} - {epg.end}
                  </span>
                </div>
                {epg.description && (
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{epg.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div 
        className={`absolute bottom-0 inset-x-0 p-4 bg-linear-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-15 flex flex-col gap-2 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Play/Pause Button */}
            <button
              id="player-play-pause-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className={`rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition shadow-lg ${
                isTvMode ? 'w-14 h-14' : 'w-10 h-10'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Prev / Next channel buttons */}
            {item.type === 'live' && (
              <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
                <button
                  id="player-prev-channel-btn"
                  onClick={onPrevChannel}
                  title="ช่องก่อนหน้า"
                  className={`rounded-lg hover:bg-zinc-800 text-zinc-200 flex items-center justify-center transition ${
                    isTvMode ? 'w-12 h-12' : 'w-8 h-8'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  id="player-next-channel-btn"
                  onClick={onNextChannel}
                  title="ช่องถัดไป"
                  className={`rounded-lg hover:bg-zinc-800 text-zinc-200 flex items-center justify-center transition ${
                    isTvMode ? 'w-12 h-12' : 'w-8 h-8'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Volume controls */}
            <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-zinc-800">
              <button
                id="player-volume-toggle-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="text-zinc-300 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                id="player-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24 accent-amber-500 h-1.5 rounded-lg bg-zinc-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="player-fullscreen-btn"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className={`rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 flex items-center justify-center border border-zinc-800 transition ${
                isTvMode ? 'w-12 h-12' : 'w-9 h-9'
              }`}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
