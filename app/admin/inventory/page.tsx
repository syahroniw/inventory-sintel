import React, { Suspense } from 'react';
import AdminTable from '@/components/AdminTable';

export default function InventoryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 font-bold animate-pulse">Memuat data inventori... 🔄</p>
      </div>
    }>
      <AdminTable />
    </Suspense>
  );
}