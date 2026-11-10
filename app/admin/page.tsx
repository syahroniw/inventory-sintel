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

  // Kumpulan menu Portal
  const portals = [
    {
      title: 'Alat Kerja',
      desc: 'Kelola peminjaman dan pengembalian alat kerja proyek.',
      href: '/admin/inventory',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-800',
      borderColor: 'hover:border-emerald-500',
      iconBg: 'bg-emerald-600',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: 'Barang Habis Pakai',
      desc: 'Kelola stok barang material yang langsung habis digunakan.',
      href: '/admin/inventory',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'hover:border-blue-500',
      iconBg: 'bg-blue-600',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: 'Suku Cadang',
      desc: 'Pantau komponen pengganti dan perbaikan infrastruktur.',
      href: '/admin/inventory',
      bgColor: 'bg-orange-50',
      textColor: 'text-[#F36F21]',
      borderColor: 'hover:border-[#F36F21]',
      iconBg: 'bg-[#F36F21]',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      title: 'Laporan Mutasi',
      desc: 'Cetak PDF dan pantau histori barang keluar-masuk.',
      href: '/admin/laporan',
      bgColor: 'bg-slate-100',
      textColor: 'text-[#2D2A70]',
      borderColor: 'hover:border-[#2D2A70]',
      iconBg: 'bg-[#2D2A70]',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Master QR Code',
      desc: 'Cetak barcode portal untuk ditempel di pintu gudang.',
      href: '/admin/qr',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-800',
      borderColor: 'hover:border-purple-500',
      iconBg: 'bg-purple-600',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      )
    },
    {
      title: 'Manajemen Akun',
      desc: 'Kelola akses login karyawan dan admin UPT STL 6.5.',
      href: '/admin/users',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-800',
      borderColor: 'hover:border-rose-500',
      iconBg: 'bg-rose-600',
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 font-bold animate-pulse">Menyiapkan Portal Akses... 🔄</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Portal */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#2D2A70] tracking-tight">Portal Gudang</h1>
        <p className="text-slate-500 mt-1 font-medium">Pilih menu akses cepat untuk mengelola inventori UPT STL 6.5 Klaten.</p>
      </div>

      {/* Widget Peringatan Stok Kritis (Mati otomatis kalau stok aman) */}
      {stats?.criticalCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start md:items-center justify-between flex-col md:flex-row gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-red-500 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-red-800 font-bold text-lg">Peringatan Stok Kritis!</h2>
              <p className="text-red-600 text-sm font-medium">Ada {stats.criticalCount} barang dengan sisa jumlah ≤ 3 unit yang perlu segera di-restock.</p>
            </div>
          </div>
          <Link href="/admin/inventory" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all">
            Periksa Data
          </Link>
        </div>
      )}

      {/* Grid Menu Portal (Shortcut ala Windows/Aplikasi Modern) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {portals.map((menu, index) => (
          <Link 
            key={index} 
            href={menu.href}
            className={`group block bg-white p-6 rounded-2xl border-2 border-slate-100 ${menu.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
          >
            {/* Aksen Background Dekoratif */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${menu.bgColor} rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform`}></div>
            
            <div className="relative z-10">
              {/* Ikon Keren (Bukan Emoji) */}
              <div className={`w-14 h-14 ${menu.iconBg} rounded-2xl flex items-center justify-center shadow-md mb-6 transform group-hover:-translate-y-1 transition-transform`}>
                {menu.icon}
              </div>
              
              <h2 className={`text-xl font-extrabold ${menu.textColor} mb-2`}>{menu.title}</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{menu.desc}</p>
            </div>
            
            {/* Tanda Panah */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              <svg className={`w-6 h-6 ${menu.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}