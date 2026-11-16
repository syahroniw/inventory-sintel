'use client';

import React, { useEffect, useState } from 'react';
import { getSemuaKaryawan, tambahKaryawan, hapusKaryawan } from '@/app/actions/auth'; 

export default function ManajemenUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nama: '', nipp: '', password: '' });

  // State buat Modal Konfirmasi Hapus yang Elegan
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; nama: string } | null>(null);

  // State buat Toast Notifikasi Melayang Modern
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'danger' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'danger' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getSemuaKaryawan();
    if (res.success && res.data) setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await tambahKaryawan(form);
    if (res.success) {
      showToast(`Berhasil mendaftarkan ${form.nama}!`);
      setForm({ nama: '', nipp: '', password: '' });
      fetchUsers();
    } else {
      showToast(res.error || 'Gagal mendaftarkan karyawan!', 'danger');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const res = await hapusKaryawan(deleteTarget.id);
    if (res.success) {
      showToast(`Akses login ${deleteTarget.nama} berhasil dihapus!`);
      setDeleteTarget(null);
      fetchUsers();
    } else {
      showToast(res.error || 'Gagal menghapus akun!', 'danger');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Toast Notifikasi Melayang */}
      {toast?.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 animate-bounce ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
          <span className="text-sm">{toast.msg}</span>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-extrabold text-[#2D2A70] tracking-tight">Manajemen Akun</h1>
        <p className="text-slate-500 mt-1 font-medium">Kelola akses login karyawan UPT STL 6.5 Klaten.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Tambah Karyawan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Tambah Karyawan</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <input type="text" required value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#2D2A70] focus:outline-none" placeholder="Misal: Syahroni Wijayanto" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIPP / ID</label>
              <input type="text" required value={form.nipp} onChange={(e) => setForm({...form, nipp: e.target.value})} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#2D2A70] focus:outline-none" placeholder="Misal: 87654" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#2D2A70] focus:outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-[#2D2A70] hover:bg-blue-900 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm">
              + Daftarkan Karyawan
            </button>
          </form>
        </div>

        {/* Tabel Karyawan Aktif */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama Pegawai</th>
                <th className="px-6 py-4">NIPP</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-medium">Memuat data...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-medium">Belum ada data karyawan.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{u.nama}</td>
                    <td className="px-6 py-4 font-mono text-blue-600 font-bold text-xs">{u.nipp}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">Aktif</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setDeleteTarget({ id: u.id, nama: u.nama })}
                        className="bg-red-100 hover:bg-red-600 hover:text-white text-red-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Modal Konfirmasi Hapus (Estetik, Bukan Bawaan Browser) */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
              !
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">Hapus Akses Login?</h3>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                Tindakan ini akan menghapus permanen akun <span className="font-bold text-slate-800">{deleteTarget.nama}</span> dari sistem UPT STL 6.5.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs transition-colors shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}