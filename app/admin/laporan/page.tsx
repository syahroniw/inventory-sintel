'use client';

import React, { useEffect, useState } from 'react';
import { getLaporanMutasi } from '@/app/actions/inventory';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function LaporanPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const res = await getLaporanMutasi();
      if (res.success && res.data) {
        setLogs(res.data);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  // Fungsi Sakti Bikin PDF
  const handleDownloadPDF = () => {
    if (logs.length === 0) {
      alert('Belum ada data mutasi untuk dicetak!');
      return;
    }

    const doc = new jsPDF('landscape'); // Kertas landscape biar lega

    // Kop Surat KAI Sintel
    doc.setFontSize(20);
    doc.setTextColor(45, 42, 112); // Warna Navy KAI
    doc.text('Laporan Mutasi Inventori Gudang', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('UPT STL 6.5 Klaten - SINTEL KAI', 14, 30);
    
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 38);

    // Bikin Tabel PDF
    const tableColumn = ["No", "Tanggal", "Petugas (NIPP)", "ID Barang", "Nama Barang", "Status", "Qty", "Keterangan"];
    const tableRows: any[] = [];

    logs.forEach((log, index) => {
      const logData = [
        index + 1,
        log.tanggal,
        `${log.user?.nama || 'Unknown'} (${log.user?.nipp || '-'})`,
        log.barang?.idBarang || '-',
        log.barang?.nama || 'Barang Dihapus',
        log.tipe,
        `${log.jumlah} ${log.barang?.satuan || ''}`,
        log.keterangan || '-'
      ];
      tableRows.push(logData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [45, 42, 112], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        5: { fontStyle: 'bold', textColor: [243, 111, 33] } 
      }
    });

    // Save File
    doc.save(`Laporan_Mutasi_Sintel_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2D2A70] tracking-tight">Laporan Mutasi</h1>
          <p className="text-slate-500 mt-1 font-medium">Riwayat barang masuk (Restock) dan keluar (Dipakai) dari Supabase.</p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          disabled={loading || logs.length === 0}
          className="bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2 text-sm"
        >
          📄 Export Laporan (.PDF)
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#2D2A70] text-white font-semibold">
            <tr>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Petugas</th>
              <th className="px-6 py-4">ID Barang</th>
              <th className="px-6 py-4">Nama Barang</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Qty</th>
              <th className="px-6 py-4">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-bold">
                  Menarik riwayat mutasi dari database... 🔄
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-bold">
                  Belum ada riwayat mutasi.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600 font-medium">{log.tanggal}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{log.user?.nama || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{log.user?.nipp || '-'}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600 font-mono text-xs">{log.barang?.idBarang || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-800 font-bold">{log.barang?.nama || <span className="text-red-500 italic">Barang telah dihapus</span>}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                      log.tipe === 'MASUK' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}>
                      {log.tipe}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-800 text-base">
                    {log.jumlah} <span className="text-xs font-semibold text-slate-500">{log.barang?.satuan || ''}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs italic max-w-[200px] truncate" title={log.keterangan || '-'}>
                    {log.keterangan || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}