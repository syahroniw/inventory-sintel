'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutUser } from '@/app/actions/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sembunyikan Sidebar saat nge-print */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#2D2A70] text-white flex flex-col shadow-2xl z-20 transition-all duration-300 ease-in-out print:hidden`}>
        <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
          {!isCollapsed && (
            <div className="text-2xl font-black tracking-wider text-white whitespace-nowrap overflow-hidden">
              SINTEL<span className="text-[#F36F21]">KAI</span>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg bg-white/10 hover:bg-[#F36F21] text-white transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              )}
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 py-4 space-y-2 overflow-hidden px-3">
          {menuItems.map((menu) => {
            const isActive = pathname === menu.path;
            return (
              <Link 
                key={menu.name} 
                href={menu.path} 
                title={isCollapsed ? menu.name : ""}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#F36F21] text-white shadow-md' 
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                {menu.icon}
                {!isCollapsed && <span>{menu.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button 
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ""}
            className={`flex items-center gap-2 px-3 py-3 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-colors whitespace-nowrap ${isCollapsed ? 'justify-center' : 'justify-center w-full'}`}
          >
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible">
        {/* Sembunyikan Header saat nge-print */}
        <header className="h-20 bg-white border-b-2 border-[#F36F21] flex items-center justify-end px-8 shadow-sm z-10 print:hidden">
          <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-[#2D2A70]">Admin Gudang</p>
              <p className="text-xs text-slate-500 font-medium">UPT STL 6.5 Klaten</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#2D2A70] flex items-center justify-center text-white font-black text-lg shadow-sm">
              AK
            </div>
          </div>
        </header>

        {/* Hilangkan padding saat di-print biar QR posisinya center sempurna */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 print:p-0 print:overflow-visible bg-white">
          {children}
        </div>
      </main>
    </div>
  );
}