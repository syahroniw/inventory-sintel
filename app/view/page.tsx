'use client';
import React, { useState } from 'react';

// Data dummy yang sama, tapi di sini STRICT nggak ada tombol aksi
const data = [
  { no: 1, nama: 'CAT KUNING', idBarang: 'STLKT/6.5/HP/001', lokasi: 'KABINET 1/ RAK 3', jumlahAwal: 15, satuan: 'KALENG', penggunaan: { jmlh: 1, tgl: '13/09/2026' }, jumlahAkhir: 16, kategori: 'Barang Habis Pakai' },
  { no: 2, nama: 'REL R54', idBarang: 'STLKT/6.5/SP/002', lokasi: 'AREA LUAR/ RAK 1', jumlahAwal: 20, satuan: 'BATANG', penggunaan: { jmlh: 5, tgl: '14/09/2026' }, jumlahAkhir: 15, kategori: 'Spare Part / Suku Cadang' },
  { no: 3, nama: 'MULTIMETER DIGITAL', idBarang: 'STLKT/6.5/AK/001', lokasi: 'LEMARI ALAT/ RAK 2', jumlahAwal: 5, satuan: 'UNIT', penggunaan: { jmlh: 0, tgl: '-' }, jumlahAkhir: 5, kategori: 'Alat Kerja' }
];

export default function PublicViewPage() {
  const [activeTab, setActiveTab] = useState('Semua');

  const filteredData = activeTab === 'Semua' 
    ? data 
    : data.filter(item => item.kategori === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-in fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Publik */}
        <div className="bg-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Ketersediaan Stok Sintel KAI</h1>
            <p className="text-blue-100 mt-2 font-medium">UPT STL 6.5 Klaten - Mode Pengunjung (Read-Only)</p>
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex overflow-x-auto bg-white p-2 rounded-xl shadow-sm border border-slate-200 hide-scrollbar">
          {['Semua', 'Barang Habis Pakai', 'Spare Part / Suku Cadang', 'Alat Kerja'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tabel Data (Tanpa Kolom Aksi) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-800 text-white font-semibold text-xs text-center uppercase tracking-wider">
              <tr>
                <th className="px-3 py-4 border border-slate-700" rowSpan={2}>No</th>
                <th className="px-4 py-4 border border-slate-700" rowSpan={2}>Nama Bahan</th>
                <th className="px-4 py-4 border border-slate-700" rowSpan={2}>No. ID</th>
                <th className="px-4 py-4 border border-slate-700" rowSpan={2}>Lokasi Penyimpanan</th>
                <th className="px-4 py-2 border border-slate-700" colSpan={2}>Jumlah</th>
                <th className="px-4 py-2 border border-slate-700" colSpan={2}>Penggunaan</th>
                <th className="px-4 py-4 border border-slate-700" rowSpan={2}>Jumlah Akhir</th>
              </tr>
              <tr>
                <th className="px-3 py-2 border border-slate-700 bg-slate-700">Awal</th>
                <th className="px-3 py-2 border border-slate-700 bg-slate-700">Satuan</th>
                <th className="px-3 py-2 border border-slate-700 bg-slate-700">Jmlh</th>
                <th className="px-3 py-2 border border-slate-700 bg-slate-700">Tgl</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-center">
              {filteredData.map((item, index) => (
                <tr key={item.idBarang} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3 border border-slate-200 font-semibold">{index + 1}</td>
                  <td className="px-4 py-3 border border-slate-200 font-medium text-left">{item.nama}</td>
                  <td className="px-4 py-3 border border-slate-200 text-blue-600 font-semibold">{item.idBarang}</td>
                  <td className="px-4 py-3 border border-slate-200 text-xs">{item.lokasi}</td>
                  <td className="px-3 py-3 border border-slate-200 font-bold">{item.jumlahAwal}</td>
                  <td className="px-3 py-3 border border-slate-200 text-xs">{item.satuan}</td>
                  <td className="px-3 py-3 border border-slate-200 text-red-600 font-semibold">{item.penggunaan.jmlh}</td>
                  <td className="px-3 py-3 border border-slate-200 text-xs">{item.penggunaan.tgl}</td>
                  <td className="px-4 py-3 border border-slate-200 font-black text-slate-800">{item.jumlahAkhir}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}