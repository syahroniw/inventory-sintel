'use client';

import React, { useState, useEffect } from 'react';
import { getInventory, addBarang, recordUsage, deleteBarang, restockBarang, pinjamAlat, kembalikanAlat } from '@/app/actions/inventory';

export default function AdminTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');
  
  // Modals
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [usageItem, setUsageItem] = useState<any>(null); // Pakai
  const [restockItem, setRestockItem] = useState<any>(null); // Restock
  const [borrowItem, setBorrowItem] = useState<any>(null); // Pinjam
  const [returnItem, setReturnItem] = useState<any>(null); // Kembali

  // Forms
  const [qty, setQty] = useState(1);
  const [dateStr, setDateStr] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const [newItem, setNewItem] = useState({
    nama: '', idBarang: '', kategori: 'Barang Habis Pakai', lokasi: '', jumlahAwal: 1, satuan: 'UNIT',
  });

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'danger' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'danger' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await getInventory();
    if (res.success && res.data) setData(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = data.filter((item) => {
    const matchesTab = activeTab === 'Semua' || item.kategori === activeTab;
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || item.idBarang.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Action Reset Form
  const resetForm = () => {
    setQty(1); setDateStr(''); setKeterangan('');
    setUsageItem(null); setRestockItem(null); setBorrowItem(null); setReturnItem(null);
  };

  const handleAddBarang = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addBarang(newItem);
    if (res.success) {
      showToast(`Berhasil menyimpan barang!`);
      setIsInputModalOpen(false);
      setNewItem({ nama: '', idBarang: '', kategori: 'Barang Habis Pakai', lokasi: '', jumlahAwal: 1, satuan: 'UNIT' });
      fetchData();
    }
  };

  const handleAction = async (e: React.FormEvent, tipe: 'PAKAI' | 'RESTOCK' | 'PINJAM' | 'KEMBALI') => {
    e.preventDefault();
    const dateToUse = dateStr || new Date().toLocaleDateString('id-ID');
    let res;

    if (tipe === 'PAKAI' && usageItem) {
      res = await recordUsage({ id: usageItem.id, jumlahPakai: qty, tanggal: dateToUse, keterangan: keterangan || 'Dipakai' });
    } else if (tipe === 'RESTOCK' && restockItem) {
      res = await restockBarang({ id: restockItem.id, jumlahTambah: qty, tanggal: dateToUse });
    } else if (tipe === 'PINJAM' && borrowItem) {
      res = await pinjamAlat({ id: borrowItem.id, jumlah: qty, tanggal: dateToUse, keterangan });
    } else if (tipe === 'KEMBALI' && returnItem) {
      res = await kembalikanAlat({ id: returnItem.id, jumlah: qty, tanggal: dateToUse, keterangan });
    }

    if (res?.success) {
      showToast(`Aksi ${tipe} berhasil dicatat!`);
      resetForm(); fetchData();
    } else {
      showToast(res?.error || 'Gagal eksekusi aksi!', 'danger');
    }
  };

  const handleHapus = async (id: string, nama: string) => {
    if (window.confirm(`Yakin mau ngapus barang: ${nama}?`)) {
      const res = await deleteBarang(id);
      if (res.success) { showToast(`Dihapus!`, 'danger'); fetchData(); }
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Alert */}
      {toast?.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-bold animate-bounce ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col xl:flex-row justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari barang..." className="w-full xl:max-w-md px-4 py-2 border rounded-xl text-sm" />
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto hide-scrollbar">
          {['Semua', 'Barang Habis Pakai', 'Spare Part / Suku Cadang', 'Alat Kerja'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === tab ? 'bg-[#2D2A70] text-white' : 'text-slate-600'}`}>{tab}</button>
          ))}
        </div>
        <button onClick={() => setIsInputModalOpen(true)} className="bg-[#F36F21] text-white px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap">+ Barang Baru</button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[1000px]">
          <thead className="bg-[#2D2A70] text-white font-semibold text-xs uppercase text-center">
            <tr>
              <th className="px-4 py-4">No</th>
              <th className="px-4 py-4 text-left">Nama Bahan / Alat</th>
              <th className="px-4 py-4">ID Barang</th>
              <th className="px-4 py-4">Kategori</th>
              <th className="px-4 py-4 bg-emerald-900">Stok Akhir</th>
              <th className="px-4 py-4 bg-slate-900">Aksi Inventory</th>
            </tr>
          </thead>
          <tbody className="divide-y text-center">
            {filteredData.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 text-left font-bold">{item.nama}</td>
                <td className="px-4 py-3 font-mono text-blue-600">{item.idBarang}</td>
                <td className="px-4 py-3 text-xs">{item.kategori}</td>
                <td className="px-4 py-3 font-black text-emerald-700">{item.jumlahAkhir} {item.satuan}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1.5 flex-wrap">
                    <button onClick={() => setRestockItem(item)} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">+ Stok</button>
                    
                    {/* Logika Supervisor: Kalau Alat Kerja, jadi Pinjam/Kembali. Kalau bukan, jadi Pakai */}
                    {item.kategori === 'Alat Kerja' ? (
                      <>
                        <button onClick={() => setBorrowItem(item)} className="bg-purple-100 text-purple-800 hover:bg-purple-600 hover:text-white px-2 py-1 rounded text-xs font-bold">Pinjam</button>
                        <button onClick={() => setReturnItem(item)} className="bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded text-xs font-bold">Kembali</button>
                      </>
                    ) : (
                      <button onClick={() => setUsageItem(item)} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">Pakai</button>
                    )}
                    
                    <button onClick={() => handleHapus(item.id, item.nama)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dynamic Modal Universal Buat Pakai / Restock / Pinjam / Kembali */}
      {(usageItem || restockItem || borrowItem || returnItem) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className={`p-4 text-white font-bold flex justify-between ${borrowItem ? 'bg-purple-600' : returnItem ? 'bg-emerald-600' : usageItem ? 'bg-[#F36F21]' : 'bg-blue-600'}`}>
              <h3>{borrowItem ? 'Peminjaman Alat' : returnItem ? 'Pengembalian Alat' : usageItem ? 'Pakai Barang' : 'Restock Barang'}</h3>
              <button onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={(e) => handleAction(e, borrowItem ? 'PINJAM' : returnItem ? 'KEMBALI' : usageItem ? 'PAKAI' : 'RESTOCK')} className="p-6 space-y-4">
              <p className="font-bold text-slate-800">{(borrowItem || returnItem || usageItem || restockItem).nama}</p>
              
              <div>
                <label className="block text-xs font-bold mb-1">Jumlah</label>
                <input type="number" min="1" required value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full border p-2 rounded-xl text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Tanggal</label>
                <input type="date" required value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="w-full border p-2 rounded-xl text-sm" />
              </div>

              {/* Input Wajib Keterangan Buat Pinjam / Kembali / Pakai */}
              {(borrowItem || returnItem || usageItem) && (
                <div>
                  <label className="block text-xs font-bold mb-1">
                    {borrowItem ? 'Nama Peminjam / Keperluan (Wajib)' : returnItem ? 'Dikembalikan oleh (Wajib)' : 'Keterangan'}
                  </label>
                  <input type="text" required={!!borrowItem || !!returnItem} value={keterangan} onChange={(e) => setKeterangan(e.target.value)} 
                    placeholder={borrowItem ? "Cth: Dipinjam Niko - Perawatan Wesel" : "Cth: Dikembalikan Niko dengan aman"} 
                    className="w-full border p-2 rounded-xl text-sm focus:ring-2 focus:ring-[#F36F21]" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold">Batal</button>
                <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form Tambah Barang Baru (Tetap seperti biasa, disingkat di snippet ini untuk fokus) */}
      {isInputModalOpen && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
           {/* (Lu udah punya UI form barang baru yang aman) */}
           <div className="bg-white p-6 rounded-2xl w-full max-w-md">
             <h2 className="font-bold mb-4">Input Barang Sederhana</h2>
             <form onSubmit={handleAddBarang} className="space-y-3 text-sm">
                <input required placeholder="Nama Barang" className="w-full border p-2 rounded" onChange={e => setNewItem({...newItem, nama: e.target.value})}/>
                <input required placeholder="ID Barang" className="w-full border p-2 rounded" onChange={e => setNewItem({...newItem, idBarang: e.target.value})}/>
                <select className="w-full border p-2 rounded" onChange={e => setNewItem({...newItem, kategori: e.target.value})}>
                  <option>Barang Habis Pakai</option>
                  <option>Spare Part / Suku Cadang</option>
                  <option>Alat Kerja</option>
                </select>
                <input required placeholder="Lokasi Rak" className="w-full border p-2 rounded" onChange={e => setNewItem({...newItem, lokasi: e.target.value})}/>
                <div className="flex gap-2">
                  <input type="number" required placeholder="Jml" className="w-1/2 border p-2 rounded" onChange={e => setNewItem({...newItem, jumlahAwal: Number(e.target.value)})}/>
                  <input required placeholder="Satuan" className="w-1/2 border p-2 rounded" onChange={e => setNewItem({...newItem, satuan: e.target.value})}/>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setIsInputModalOpen(false)} className="px-3 py-2 bg-slate-200 rounded">Batal</button>
                  <button type="submit" className="px-3 py-2 bg-[#F36F21] text-white rounded">Simpan</button>
                </div>
             </form>
           </div>
         </div>
      )}
    </div>
  );
}