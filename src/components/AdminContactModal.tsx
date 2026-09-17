import React, { useState } from 'react';
import { MessageCircle, ExternalLink, QrCode, Copy, Check, X, ShieldCheck } from 'lucide-react';

interface AdminContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ADMIN_LINE_URL = 'https://line.me/ti/p/mGZ04jWToY';
export const ADMIN_LINE_ID = 'mGZ04jWToY';

export const AdminContactModal: React.FC<AdminContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ADMIN_LINE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl text-zinc-100 p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="ปิด"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#06C755]/20 border border-[#06C755]/40 flex items-center justify-center text-[#06C755] shadow-lg shadow-[#06C755]/10">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              ติดต่อแอดมิน
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#06C755]/20 text-[#06C755] font-semibold border border-[#06C755]/30">
                LINE Official
              </span>
            </h3>
            <p className="text-xs text-zinc-400">สอบถามข้อมูล • แจ้งปัญหา • สมัครสมาชิก IPTV</p>
          </div>
        </div>

        {/* QR Code Section for TV/PC user convenience */}
        <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800/80 flex flex-col items-center text-center my-4">
          <div className="bg-white p-2.5 rounded-xl shadow-md mb-2">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ADMIN_LINE_URL)}`}
              alt="LINE QR Code แอดมิน"
              className="w-36 h-36 object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <QrCode className="w-3.5 h-3.5 text-[#06C755]" />
            <span>สแกน QR Code ด้วยกล้องหรือแอป LINE ในมือถือ</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            id="open-line-link-btn"
            href={ADMIN_LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-xl text-sm transition shadow-lg shadow-[#06C755]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            เปิด LINE ติดต่อแอดมินทันที
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <div className="flex-1 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 truncate select-all">
              {ADMIN_LINE_URL}
            </div>
            <button
              id="copy-line-link-btn"
              onClick={handleCopy}
              className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl text-xs flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอกลิงก์</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-zinc-400" />
            LINE ID / ลิงก์ตรงจากผู้ดูแล
          </span>
          <button 
            onClick={onClose}
            className="hover:text-zinc-300 transition underline cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
