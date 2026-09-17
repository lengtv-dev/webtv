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
  Radio
} from 'lucide-react';

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

  const handleDemoClick = () => {
    onLogin({
      server: 'https://demo.streamly.tv',
      username: 'demo_viewer',
      password: 'demo_password',
      label: 'Demo Account (บัญชีตัวอย่าง)',
    }, true);
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
            Streamly <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">Xtream Player</span>
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
                  หมายเหตุ: หากเซิร์ฟเวอร์ยังไม่เปิดใช้งาน คุณสามารถกดปุ่ม "ลองเล่นบัญชีตัวอย่าง (Demo Mode)" ด้านล่างได้ทันที
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
            <span className="relative bg-zinc-900 px-3 text-xs text-zinc-400">
              หรือทดลองรับชมทันที
            </span>
          </div>

          {/* Demo Button */}
          <button
            id="login-demo-btn"
            type="button"
            onClick={handleDemoClick}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-xl text-sm transition border border-zinc-700/80 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            ทดลองเข้าใช้งาน (Demo Account - ช่องสด & หนัง VOD ฟรี)
          </button>
        </div>

        {/* Privacy Note from Prompt */}
        <div className="mt-6 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center text-xs text-zinc-400 space-y-1">
          <p className="font-medium text-zinc-300">
            🔒 ข้อมูลส่วนตัวของคุณยังคงเป็นของคุณ
          </p>
          <p>
            Streamly ไม่ได้ขายเพลย์ลิสต์ ข้อมูลการเข้าสู่ระบบจะถูกบันทึกไว้ในอุปกรณ์ของคุณเท่านั้น เรามีพร็อกซีสตรีมมิ่งในตัวเพื่อให้ HLS เล่นได้ในเบราว์เซอร์โดยไม่มีปัญหา CORS
          </p>
        </div>
      </div>
    </div>
  );
};
