'use client';
import React from 'react';

export default function MasterQrPage() {
  const publicLink = "http://localhost:3001/admin/inventory"; 

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-[#2D2A70] tracking-tight">Master QR Code</h1>
        <p className="text-slate-500 mt-1 font-medium">Cetak QR Code ini untuk ditempel di pintu masuk Gudang UPT STL 6.5 Klaten.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center max-w-md mx-auto">
        <h2 className="text-2xl font-black text-[#2D2A70] mb-2">SINTEL KAI</h2>
        <p className="text-sm text-slate-500 font-bold mb-8 uppercase tracking-widest text-center">Portal Akses Gudang Internal</p>
        
        <div className="border-4 border-[#2D2A70] p-4 rounded-xl mb-8 bg-white">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(publicLink)}`} 
            alt="Master QR Code" 
            className="w-48 h-48"
          />
        </div>

        <button 
          onClick={() => window.print()}
          className="w-full bg-[#F36F21] hover:bg-[#d85e18] text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors shadow-md"
        >
          🖨️ Cetak QR Code (Print)
        </button>
        <p className="text-xs text-slate-400 mt-4 text-center">
          QR Code ini mengarahkan karyawan langsung ke sistem manajemen inventory internal.
        </p>
      </div>
    </div>
  );
}