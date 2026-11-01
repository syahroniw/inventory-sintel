'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutUser } from '@/app/actions/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Otomatis tutup sidebar di HP kalau lu pindah halaman
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = '/login';
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ) 
    },
    { 
      name: 'Data Inventory', 
      path: '/admin/inventory', 
      icon: (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ) 
    },
    { 
      name: 'Generate QR', 
      path: '/admin/qr', 
      icon: (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ) 
    },
    { 
      name: 'Laporan & Mutasi', 
      path: '/admin/laporan', 
      icon: (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ) 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      
      {/* Layar Gelap (Overlay) buat nutupin background pas menu HP kebuka */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Responsive (Ngumpet di kiri kalau di HP, muncul kalau di Laptop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col bg-[#2D2A70] text-white shadow-2xl transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
        md:relative md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        print:hidden
      `}>
        <div className="h-20 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          {(!isCollapsed || isMobileOpen) && (
            <div className="text-2xl font-black tracking-wider text-white whitespace-nowrap overflow-hidden">
              SINTEL<span className="text-[#F36F21]">KAI</span>
            </div>
          )}
          
          {/* Tombol Togle Laptop (Disembunyikan di HP) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:block p-2 rounded-lg bg-white/10 hover:bg-[#F36F21] text-white transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              )}
            </svg>
          </button>

          {/* Tombol Silang (Close) Khusus HP */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-red-500 text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <nav className="flex-1 py-4 space-y-2 overflow-y-auto px-3 hide-scrollbar">
          {menuItems.map((menu) => {
            const isActive = pathname === menu.path;
            return (
              <Link 
                key={menu.name} 
                href={menu.path} 
                title={isCollapsed && !isMobileOpen ? menu.name : ""}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#F36F21] text-white shadow-md' 
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                } ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}
              >
                {menu.icon}
                {(!isCollapsed || isMobileOpen) && <span>{menu.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 shrink-0">
          <button 
            onClick={handleLogout}
            title={isCollapsed && !isMobileOpen ? "Logout" : ""}
            className={`flex items-center gap-2 px-3 py-3 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-colors whitespace-nowrap ${isCollapsed && !isMobileOpen ? 'justify-center' : 'justify-center w-full'}`}
          >
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible w-full min-w-0">
        
        {/* Header Atas */}
        <header className="h-20 bg-white border-b-2 border-[#F36F21] flex items-center justify-between md:justify-end px-4 md:px-8 shadow-sm z-10 print:hidden shrink-0">
          
          {/* Tombol Hamburger Khusus HP */}
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#2D2A70] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Profil User */}
          <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-[#2D2A70]">Admin Gudang</p>
              <p className="text-xs text-slate-500 font-medium">UPT STL 6.5 Klaten</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2D2A70] flex items-center justify-center text-white font-black text-sm md:text-lg shadow-sm">
              AK
            </div>
          </div>
        </header>

        {/* Isi Konten (Dashboard/Tabel) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 print:p-0 print:overflow-visible bg-slate-50 w-full relative">
          {children}
        </div>
      </main>

    </div>
  );
}