'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Ceritanya loading bentar biar keliatan real, terus lempar ke dashboard admin
    setTimeout(() => {
      router.push('/admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">SINTEL KAI</h1>
          <p className="text-slate-500 mt-2 text-sm">Sistem Informasi Inventory Warehouse</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username / NIPP
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Masukkan NIPP Anda"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Memproses...</span>
            ) : (
              'Masuk Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          <p>© 2026 Divisi Sintel KAI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}