'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/app/actions/inventory';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.stats);
      }
      setLoading(false);
    };
    loadStats();
  }, []);

  // Shortcut ringkas (QR & Mutasi udah dibuang!)
  const tiles = [
    {
      title: 'Alat Kerja',
      subtitle: 'Pinjam & kembalikan obeng, tang, multitester, dll.',
      badge: stats?.categories?.ak ? `${stats.categories.ak} Item` : 'Buka Menu',
      // Mengarahkan langsung ke tab Alat Kerja
      href: '/admin/inventory?tab=Alat Kerja',
      bgColor: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: 'Barang Habis Pakai',
      subtitle: 'Ambil isolasi, kabel, cat, & material sekali pakai.',
      badge: stats?.categories?.hp ? `${stats.categories.hp} Item` : 'Buka Menu',
      // Mengarahkan langsung ke tab Barang Habis Pakai
      href: '/admin/inventory?tab=Barang Habis Pakai',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: 'Spare Part / Suku Cadang',
      subtitle: 'Stok komponen pengganti & cadangan sistem.',
      badge: stats?.categories?.sp ? `${stats.categories.sp} Item` : 'Buka Menu',
      // Mengarahkan langsung ke tab Spare Part
      href: '/admin/inventory?tab=Spare Part / Suku Cadang',
      bgColor: 'bg-[#F36F21]',
      hoverColor: 'hover:bg-[#d85e18]',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      title: 'Manajemen Akun',
      subtitle: 'Tambah & kelola akun admin/karyawan.',
      badge: stats?.userCount ? `${stats.userCount} User` : 'Kelola',
      href: '/admin/users',
      bgColor: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 font-bold animate-pulse">Menyiapkan Dashboard Utama... 🔄</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Utama */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#2D2A70] tracking-tight">Sistem Inventori Gudang</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Pilih kategori menu di bawah untuk mengelola data UPT STL 6.5 Klaten.</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          Sistem Online
        </div>
      </div>

      {/* Peringatan Stok Kritis */}
      {stats?.criticalCount > 0 && (
        <Link 
          href="/admin/inventory"
          className="block bg-red-500 hover:bg-red-600 text-white p-5 rounded-3xl shadow-lg transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-black tracking-wide">PERINGATAN STOK KRITIS!</h3>
                <p className="text-xs md:text-sm font-medium text-red-100">Ada {stats.criticalCount} barang stoknya ≤ 3. Klik untuk periksa!</p>
              </div>
            </div>
            <span className="hidden md:inline-block bg-white text-red-600 font-black px-4 py-2 rounded-2xl text-xs shadow-sm">
              Periksa Sekarang →
            </span>
          </div>
        </Link>
      )}

      {/* Grid 4 Shortcut Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tiles.map((tile, index) => (
          <Link
            key={index}
            href={tile.href}
            className={`group relative ${tile.bgColor} ${tile.hoverColor} p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[190px] overflow-hidden transform hover:-translate-y-1.5`}
          >
            <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform pointer-events-none" />

            <div className="flex justify-between items-start">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                {tile.icon}
              </div>
              <span className="bg-white/20 backdrop-blur-md text-white font-black text-xs px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                {tile.badge}
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-black text-white tracking-wide">
                {tile.title}
              </h2>
              <p className="text-white/80 text-xs font-medium mt-1 leading-relaxed">
                {tile.subtitle}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-white text-xs font-bold">
              <span>Buka Menu</span>
              <span className="transform group-hover:translate-x-2 transition-transform">➔</span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}