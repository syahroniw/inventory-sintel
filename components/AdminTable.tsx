'use client';

import React, { useState, useEffect } from 'react';
import { getInventory, addBarang, recordUsage, deleteBarang, restockBarang } from '@/app/actions/inventory';

export default function AdminTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');
  
  // State Modals
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [usageItem, setUsageItem] = useState<any>(null);
  const [restockItem, setRestockItem] = useState<any>(null); // State baru buat modal nambah stok

  // State Forms
  const [usageQty, setUsageQty] = useState(1);
  const [usageDate, setUsageDate] = useState('');
  const [restockQty, setRestockQty] = useState(1);
  const [restockDate, setRestockDate] = useState('');

  const [newItem, setNewItem] = useState({
    nama: '',
    idBarang: '',
    kategori: 'Barang Habis Pakai',
    lokasi: '',
    jumlahAwal: 1,
    satuan: 'UNIT',
  });

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'danger' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'danger' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await getInventory();
    if (res.success && res.data) {
      setData(res.data);
    } else {
      showToast(res.error || 'Gagal memuat data!', 'danger');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesTab = activeTab === 'Semua' || item.kategori === activeTab;
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || 
                          item.idBarang.toLowerCase().includes(search.toLowerCase()) ||
                          item.lokasi.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddBarang = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addBarang(newItem);
    if (res.success) {
      showToast(`Barang ${newItem.nama} berhasil disimpan!`);
      setIsInputModalOpen(false);
      setNewItem({ nama: '', idBarang: '', kategori: 'Barang Habis Pakai', lokasi: '', jumlahAwal: 1, satuan: 'UNIT' });
      fetchData();
    } else {
      showToast(res.error || 'Gagal menyimpan barang', 'danger');
    }
  };

  const handleSaveUsage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usageItem) return;
    if (usageQty > usageItem.jumlahAkhir) {
      showToast('Jumlah penggunaan melebihi stok akhir!', 'danger');
      return;
    }
    const res = await recordUsage({
      id: usageItem.id,
      jumlahPakai: usageQty,
      tanggal: usageDate || new Date().toLocaleDateString('id-ID'),
    });
    if (res.success) {
      showToast(`Penggunaan ${usageItem.nama} berhasil dicatat!`);
      setUsageItem(null);
      setUsageQty(1);
      setUsageDate('');
      fetchData();
    } else {
      showToast(res.error || 'Gagal mencatat penggunaan!', 'danger');
    }
  };

  const handleSaveRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem) return;
    const res = await restockBarang({
      id: restockItem.id,
      jumlahTambah: restockQty,
      tanggal: restockDate || new Date().toLocaleDateString('id-ID'),
    });
    if (res.success) {
      showToast(`Restock ${restockItem.nama} berhasil ditambahkan!`);
      setRestockItem(null);
      setRestockQty(1);
      setRestockDate('');
      fetchData();
    } else {
      showToast(res.error || 'Gagal mencatat restock!', 'danger');
    }
  };

  const handleHapus = async (id: string, nama: string) => {
    if (window.confirm(`Yakin mau ngapus barang: ${nama}?`)) {
      const res = await deleteBarang(id);
      if (res.success) {
        showToast(`Data ${nama} dihapus!`, 'danger');
        fetchData();
      } else {
        showToast(res.error || 'Gagal menghapus!', 'danger');
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      {toast?.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-bold flex items-center gap-3 animate-bounce ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID, Nama Bahan, atau Lokasi..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F36F21]"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto hide-scrollbar">
          {['Semua', 'Barang Habis Pakai', 'Spare Part / Suku Cadang', 'Alat Kerja'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#2D2A70] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>{tab}</button>
          ))}
        </div>
        <button onClick={() => setIsInputModalOpen(true)} className="bg-[#F36F21] hover:bg-[#d85e18] text-white px-4 py-2.5 rounded-xl font-bold shadow-sm flex items-center gap-2 text-sm whitespace-nowrap">
          <span>+</span> Barang Baru
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
          <thead className="bg-[#2D2A70] text-white font-semibold text-xs text-center uppercase tracking-wider">
            <tr>
              <th className="px-3 py-4 border border-slate-700" rowSpan={2}>No</th>
              <th className="px-4 py-4 border border-slate-700" rowSpan={2}>Nama Bahan</th>
              <th className="px-4 py-4 border border-slate-700" rowSpan={2}>No. ID</th>
              <th className="px-4 py-4 border border-slate-700" rowSpan={2}>Lokasi</th>
              <th className="px-4 py-2 border border-slate-700" colSpan={2}>Jumlah Awal</th>
              <th className="px-4 py-4 border border-slate-700 bg-emerald-900" rowSpan={2}>Sisa Akhir</th>
              <th className="px-4 py-4 border border-slate-700 bg-slate-900" rowSpan={2}>Aksi Inventory</th>
            </tr>
            <tr>
              <th className="px-3 py-2 border border-slate-700 bg-slate-800">Jmlh</th>
              <th className="px-3 py-2 border border-slate-700 bg-slate-800">Satuan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-center">
            {loading ? (
              <tr><td colSpan={10} className="px-4 py-10 text-slate-400 font-medium">Memuat data dari Supabase... 🔄</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-10 text-slate-400 font-medium">Data tidak ditemukan.</td></tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3 border border-slate-200 font-semibold">{index + 1}</td>
                  <td className="px-4 py-3 border border-slate-200 font-bold text-slate-800 text-left">
                    <button onClick={() => setDetailItem(item)} className="hover:text-[#F36F21] hover:underline text-left">{item.nama}</button>
                  </td>
                  <td className="px-4 py-3 border border-slate-200 text-blue-700 font-mono font-bold">{item.idBarang}</td>
                  <td className="px-4 py-3 border border-slate-200 text-xs font-medium">{item.lokasi}</td>
                  <td className="px-3 py-3 border border-slate-200 font-bold">{item.jumlahAwal}</td>
                  <td className="px-3 py-3 border border-slate-200 text-xs text-slate-500">{item.satuan}</td>
                  <td className="px-4 py-3 border border-slate-200 font-black text-emerald-700 text-base">{item.jumlahAkhir}</td>
                  <td className="px-4 py-3 border border-slate-200">
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      <button onClick={() => setRestockItem(item)} className="bg-blue-100 text-blue-800 hover:bg-blue-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors" title="Tambah Stok Masuk">
                        + Stok
                      </button>
                      <button onClick={() => setUsageItem(item)} className="bg-orange-100 text-orange-800 hover:bg-[#F36F21] hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors" title="Catat Penggunaan Barang">
                        Pakai
                      </button>
                      <button onClick={() => handleHapus(item.id, item.nama)} className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal 1: Restock Barang (BARU) */}
      {restockItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">Tambah Stok (Restock)</h3>
              <button onClick={() => setRestockItem(null)} className="text-white hover:text-blue-200 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleSaveRestock} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-extrabold text-slate-800">{restockItem.nama}</p>
                <p className="text-xs text-blue-600 font-mono font-bold mt-0.5">{restockItem.idBarang}</p>
                <p className="text-xs text-slate-500 mt-1">Stok Saat Ini: <span className="font-bold text-slate-800">{restockItem.jumlahAkhir} {restockItem.satuan}</span></p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Barang Masuk</label>
                <input type="number" min="1" required value={restockQty} onChange={(e) => setRestockQty(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Masuk</label>
                <input type="date" required value={restockDate} onChange={(e) => setRestockDate(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setRestockItem(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-xs">Batal</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-xl font-bold text-xs">Simpan Restock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Catat Penggunaan (PAKAI) */}
      {usageItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="bg-[#F36F21] p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">Ambil / Pakai Barang</h3>
              <button onClick={() => setUsageItem(null)} className="text-white hover:text-red-900 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleSaveUsage} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-extrabold text-slate-800">{usageItem.nama}</p>
                <p className="text-xs text-blue-600 font-mono font-bold mt-0.5">{usageItem.idBarang}</p>
                <p className="text-xs text-slate-500 mt-1">Sisa Stok: <span className="font-bold text-slate-800">{usageItem.jumlahAkhir} {usageItem.satuan}</span></p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Dipakai</label>
                <input type="number" min="1" max={usageItem.jumlahAkhir} required value={usageQty} onChange={(e) => setUsageQty(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F36F21]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Penggunaan</label>
                <input type="date" required value={usageDate} onChange={(e) => setUsageDate(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F36F21]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setUsageItem(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-xs">Batal</button>
                <button type="submit" className="px-4 py-2 text-white bg-[#F36F21] rounded-xl font-bold text-xs">Simpan Penggunaan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Form Input Barang Baru */}
      {isInputModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="bg-[#2D2A70] p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">Registrasi Barang Baru</h3>
              <button onClick={() => setIsInputModalOpen(false)} className="text-white hover:text-red-300 font-bold text-xl">&times;</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleAddBarang}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Bahan</label>
                  <input type="text" required value={newItem.nama} onChange={(e) => setNewItem({ ...newItem, nama: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F36F21]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. ID Barang</label>
                  <input type="text" required value={newItem.idBarang} onChange={(e) => setNewItem({ ...newItem, idBarang: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F36F21]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select value={newItem.kategori} onChange={(e) => setNewItem({ ...newItem, kategori: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F36F21]">
                    <option>Barang Habis Pakai</option>
                    <option>Spare Part / Suku Cadang</option>
                    <option>Alat Kerja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi</label>
                  <input type="text" required value={newItem.lokasi} onChange={(e) => setNewItem({ ...newItem, lokasi: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F36F21]" />
                </div>
                <div className="flex gap-2 col-span-2">
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Awal</label>
                    <input type="number" min="1" required value={newItem.jumlahAwal} onChange={(e) => setNewItem({ ...newItem, jumlahAwal: Number(e.target.value) })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F36F21]" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Satuan</label>
                    <input type="text" required value={newItem.satuan} onChange={(e) => setNewItem({ ...newItem, satuan: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#F36F21]" />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t mt-4">
                <button type="button" onClick={() => setIsInputModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-xs">Batal</button>
                <button type="submit" className="px-4 py-2 text-white bg-[#F36F21] rounded-xl font-bold text-xs">Simpan ke Supabase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}