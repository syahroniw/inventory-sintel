'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/app/actions/inventory';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const loadStats = async () => {
    setLoading(true);
    const res = await getDashboardStats();
    if (res.success) {
      setStats(res.stats);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 font-bold animate-pulse">Memuat statistik real-time dari Supabase... 🔄</p>
      </div>
    );
  }

  const totalCat = (stats?.categories?.hp || 0) + (stats?.categories?.sp || 0) + (stats?.categories?.ak || 0);
  const hpPercent = totalCat > 0 ? Math.round(((stats?.categories?.hp || 0) / totalCat) * 100) : 0;
  const spPercent = totalCat > 0 ? Math.round(((stats?.categories?.sp || 0) / totalCat) * 100) : 0;
  const akPercent = totalCat > 0 ? Math.round(((stats?.categories?.ak || 0) / totalCat) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2D2A70] tracking-tight">Overview Gudang</h1>
          <p className="text-slate-500 mt-1 font-medium">Ringkasan status inventori UPT STL 6.5 Klaten secara real-time.</p>
        </div>
        <Link 
          href="/admin/inventory" 
          className="bg-[#F36F21] hover:bg-[#d85e18] text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 text-sm"
        >
          <span>📦</span> Kelola Semua Data
        </Link>
      </div>

      {/* Grid 1: Stat Cards Real-time */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#2D2A70]"></div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Item Barang</p>
          <p className="text-3xl font-black text-slate-800 mt-2">{stats?.totalItems || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Terdaftar di Supabase</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Stok Aman</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{stats?.safeItemsCount || 0}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">✓ Siap digunakan</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Stok Kritis</p>
          <p className="text-3xl font-black text-red-600 mt-2">{stats?.criticalCount || 0}</p>
          <p className="text-xs text-red-500 font-medium mt-1">⚠️ Stok ≤ 3 unit</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F36F21]"></div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Karyawan Aktif</p>
          <p className="text-3xl font-black text-slate-800 mt-2">{stats?.userCount || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Terdaftar di sistem internal</p>
        </div>
      </div>

      {/* Grid 2: Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri & Tengah */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Box Peringatan Stok Kritis */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-red-500">🚨</span> Stok Kritis & Perlu Restock
                </h2>
                <p className="text-xs text-slate-400">Barang dengan sisa jumlah ≤ 3 unit</p>
              </div>
              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                {stats?.criticalCount || 0} Barang
              </span>
            </div>

            <div className="space-y-3">
              {stats?.criticalItems?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center font-medium">Semua stok aman sentosa! 🎉</p>
              ) : (
                stats?.criticalItems?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{item.nama}</p>
                      <p className="text-xs font-mono text-blue-600 font-bold">{item.idBarang} • {item.lokasi}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase">Sisa Stok</p>
                      <p className="text-lg font-black text-red-600">
                        {item.jumlahAkhir} <span className="text-xs font-semibold text-slate-600">{item.satuan}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Box Distribusi Kategori */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Distribusi Kategori Inventori</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Barang Habis Pakai (HP)</span>
                  <span className="text-[#2D2A70]">{stats?.categories?.hp || 0} Item ({hpPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#2D2A70] h-full rounded-full transition-all duration-500" style={{ width: `${hpPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Spare Part / Suku Cadang (SP)</span>
                  <span className="text-[#F36F21]">{stats?.categories?.sp || 0} Item ({spPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#F36F21] h-full rounded-full transition-all duration-500" style={{ width: `${spPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Alat Kerja (AK)</span>
                  <span className="text-emerald-600">{stats?.categories?.ak || 0} Item ({akPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${akPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Kolom Kanan - Real-time Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">Aktivitas Terakhir</h2>
            <p className="text-xs text-slate-400">Jejak mutasi barang terbaru</p>
          </div>

          <div className="space-y-4">
            {stats?.recentActivities?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Belum ada riwayat mutasi.</p>
            ) : (
              stats?.recentActivities?.map((act: any) => (
                <div key={act.id} className="flex gap-3 text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                    act.tipe === 'MASUK' ? 'bg-emerald-500' : 'bg-[#F36F21]'
                  }`}>
                    {act.tipe === 'MASUK' ? '↓' : '↑'}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">
                      {act.user?.nama} <span className="font-normal text-slate-400">({act.user?.nipp})</span>
                    </p>
                    <p className="text-slate-600">
                      {act.tipe === 'MASUK' ? 'Menambah' : 'Mengambil'} <span className="font-bold text-[#2D2A70]">{act.jumlah} {act.barang?.satuan}</span> {act.barang?.nama}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">{act.tanggal}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link 
            href="/admin/laporan" 
            className="block text-center w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-xs transition-colors mt-2"
          >
            Lihat Seluruh Mutasi ➔
          </Link>
        </div>

      </div>
    </div>
  );
}