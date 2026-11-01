'use client';
import React, { useEffect, useState } from 'react';

export default function MasterQrPage() {
  const [publicLink, setPublicLink] = useState("");

  useEffect(() => {
    setPublicLink(`${window.location.origin}/admin/inventory`);
  }, []);

  return (
    <div className="animate-in fade-in duration-500 print:m-0 print:p-0 flex flex-col items-center justify-center print:h-screen print:w-full">
      
      {/* Sembunyikan teks atas pas nge-print */}
      <div className="space-y-1 w-full max-w-md print:hidden mb-6">
        <h1 className="text-3xl font-extrabold text-[#2D2A70] tracking-tight">Master QR Code</h1>
        <p className="text-slate-500 font-medium">Cetak QR Code ini untuk ditempel di pintu masuk Gudang UPT STL 6.5 Klaten.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center max-w-md w-full print:border-none print:shadow-none print:p-0">
        <h2 className="text-2xl font-black text-[#2D2A70] mb-2">SINTEL KAI</h2>
        <p className="text-sm text-slate-500 font-bold mb-8 uppercase tracking-widest text-center">Portal Akses Gudang Internal</p>
        
        <div className="border-4 border-[#2D2A70] p-4 rounded-xl mb-8 bg-white min-h-[250px] min-w-[250px] flex items-center justify-center">
          {publicLink ? (
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(publicLink)}`} 
              alt="Master QR Code" 
              className="w-48 h-48"
            />
          ) : (
            <p className="text-slate-400 font-bold text-sm animate-pulse">Menyiapkan QR Code...</p>
          )}
        </div>

        {/* Sembunyikan tombol sama teks bawah pas nge-print */}
        <button 
          onClick={() => window.print()}
          className="print:hidden w-full bg-[#F36F21] hover:bg-[#d85e18] text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors shadow-md"
        >
          🖨️ Cetak QR Code (Print)
        </button>
        <p className="print:hidden text-xs text-slate-400 mt-4 text-center">
          Scan dengan kamera HP untuk langsung membuka sistem inventori dari perangkat manapun.
        </p>
      </div>
    </div>
  );
}