import React, { useState } from 'react';
import { XtreamCredentials } from '../types';
import { 
  Tv, 
  ShieldCheck, 
  Server, 
  Key, 
  User, 
  Sparkles, 
  AlertCircle, 
  ArrowRight,
  Globe,
  Radio,
  MessageCircle,
  ExternalLink,
  QrCode,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { AdminContactModal, ADMIN_LINE_URL } from './AdminContactModal';

interface LoginFormProps {
  onLogin: (creds: XtreamCredentials, isDemo?: boolean) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  initialServer?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading,
  errorMessage,
  initialServer = 'http://103.114.203.129:8080'
}) => {
  const [server, setServer] = useState(initialServer);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [showPasscodeText, setShowPasscodeText] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!server.trim() || !username.trim() || !password.trim()) {
      return;
    }
    onLogin({
      server: server.trim(),
      username: username.trim(),
      password: password.trim(),
    });
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    if (!adminPasscode.trim()) {
      setPasscodeError('กรุณากรอกรหัสผ่านของแอดมิน');
      return;
    }
    if (adminPasscode.trim() === '2027') {
      onLogin({
        server: 'https://vip.playid.tv',
        username: 'admin_member',
        password: 'vip_password',
        label: 'เฉพาะสมาชิกแอดมิน (VIP)',
      }, true);
    } else {
      setPasscodeError('รหัสผ่านไม่ถูกต้อง เฉพาะสมาชิกที่มีรหัสผ่านของแอดมินเท่านั้น (สอบถามรหัสได้ทาง LINE)');
    }
  };

  const pasteSampleServer = () => {
    setServer('http://103.114.203.129:8080');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center px-4 py-8 sm:px-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl mb-4 text-amber-400">
            <Tv className="w-9 h-9" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            PLAYID <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">Xtream Player</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
            เข้าสู่ระบบด้วย URL เซิร์ฟเวอร์ Xtream ของคุณ เพื่อรับชมทีวีถ่ายทอดสด EPG ภาพยนตร์ และซีรีส์ VOD
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800/60 flex items-start gap-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold">ไม่สามารถเชื่อมต่อได้</p>
                <p className="text-xs text-rose-300/90 mt-0.5">{errorMessage}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  หมายเหตุ: หรือสามารถเข้าสู่ระบบด้วยรหัสผ่านของแอดมินด้านล่างได้ทันที
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Server URL */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-amber-400" />
                  เซิร์ฟเวอร์ Xtream (Server URL)
                </label>
                <button
                  type="button"
                  onClick={pasteSampleServer}
                  className="text-xs text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  ใช้ 103.114.203.129:8080
                </button>
              </div>
              <input
                id="login-server-input"
                type="text"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                placeholder="http://103.114.203.129:8080"
                required
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700/70 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono transition"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                ชื่อผู้ใช้งาน (Username)
              </label>
              <input
                id="login-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ใส่ Username ของคุณ"
                required
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700/70 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                รหัสผ่าน (Password)
              </label>
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700/70 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>

            {/* Remember info */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 select-none">
                <input
                  id="login-remember-checkbox"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500/20 w-4 h-4 cursor-pointer"
                />
                จดจำข้อมูลบนอุปกรณ์นี้
              </label>
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ปลอดภัย ไม่ส่งข้อมูลออกนอกเครื่อง
              </span>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  กำลังเชื่อมต่อ Xtream Server...
                </>
              ) : (
                <>
                  เชื่อมต่อเซิร์ฟเวอร์
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <span className="relative bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              เฉพาะสมาชิกที่มีรหัสผ่านของแอดมิน
            </span>
          </div>

          {/* Admin Passcode Form */}
          <form onSubmit={handlePasscodeSubmit} className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <label htmlFor="admin-passcode-input" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                รหัสผ่านของแอดมิน
              </label>
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="text-[11px] text-[#06C755] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3 h-3" />
                <span>ขอรหัสผ่านแอดมิน</span>
              </button>
            </div>

            <div className="relative">
              <input
                id="admin-passcode-input"
                type={showPasscodeText ? 'text' : 'password'}
                value={adminPasscode}
                onChange={(e) => {
                  setAdminPasscode(e.target.value);
                  if (passcodeError) setPasscodeError(null);
                }}
                placeholder="กรอกรหัสผ่านของแอดมิน..."
                autoComplete="off"
                className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPasscodeText(!showPasscodeText)}
                title={showPasscodeText ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                tabIndex={-1}
              >
                {showPasscodeText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {passcodeError && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{passcodeError}</span>
              </div>
            )}

            <button
              id="login-passcode-btn"
              type="submit"
              disabled={isLoading || !adminPasscode.trim()}
              className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-100 font-semibold rounded-xl text-xs sm:text-sm transition border border-zinc-700/80 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              เข้าสู่ระบบเฉพาะสมาชิก
            </button>
          </form>

          {/* Admin Contact LINE Card */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80">
            <div className="p-3.5 bg-emerald-950/25 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#06C755] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#06C755]/20">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>ติดต่อแอดมิน LINE</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#06C755]/20 text-emerald-400 font-medium">
                      ช่วยเหลือ
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate">
                    สอบถามการใช้งาน • ขอสิทธิ์ • แจ้งปัญหา
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  title="แสดง QR Code สำหรับสแกน"
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <a
                  id="login-contact-admin-line-btn"
                  href={ADMIN_LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-sm"
                >
                  <span>แอดไลน์</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Contact Modal */}
        <AdminContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />

        {/* Privacy Note from Prompt */}
        <div className="mt-6 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center text-xs text-zinc-400 space-y-1">
          <p className="font-medium text-zinc-300">
            🔒 ข้อมูลส่วนตัวของคุณยังคงเป็นของคุณ
          </p>
          <p>
            PLAYID ไม่ได้ขายเพลย์ลิสต์ ข้อมูลการเข้าสู่ระบบจะถูกบันทึกไว้ในอุปกรณ์ของคุณเท่านั้น เรามีพร็อกซีสตรีมมิ่งในตัวเพื่อให้ HLS เล่นได้ในเบราว์เซอร์โดยไม่มีปัญหา CORS
          </p>
        </div>
      </div>
    </div>
  );
};
