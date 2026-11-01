'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [nipp, setNipp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loginUser(nipp, password);
    if (res.success) {
      router.push('/admin');
    } else {
      setError(res.error || 'Login gagal!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        
        {/* Header Visual */}
        <div className="bg-[#2D2A70] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F36F21] rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <h1 className="text-3xl font-black text-white tracking-wider">
            SINTEL<span className="text-[#F36F21]">KAI</span>
          </h1>
          <p className="text-slate-300 text-xs mt-2 font-medium">
            Sistem Informasi Inventori Gudang UPT STL 6.5 Klaten
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-xs font-bold border border-red-200 text-center animate-shake">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              NIPP Pegawai
            </label>
            <input 
              type="text"
              required
              value={nipp}
              onChange={(e) => setNipp(e.target.value)}
              placeholder="Masukkan NIPP (Contoh: 87654)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F36F21] font-mono transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F36F21] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F36F21] hover:bg-[#d85e18] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all flex justify-center items-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Sistem ➔'}
          </button>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              Gunakan akun resmi NIPP yang terdaftar di database internal.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}