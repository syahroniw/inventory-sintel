import React from 'react';
import AdminTable from '@/components/AdminTable';

export default function InventoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-[#2D2A70] tracking-tight">Data Inventory</h1>
        <p className="text-slate-500 mt-1 font-medium">Manajemen stok Barang Habis Pakai, Suku Cadang, dan Alat Kerja.</p>
      </div>
      
      <AdminTable />
    </div>
  );
}