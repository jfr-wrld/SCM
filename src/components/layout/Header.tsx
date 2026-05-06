import React from 'react';
import { Search, Bell, User, Sun } from 'lucide-react';

export function Header() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10 px-10 flex items-center justify-between">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-all duration-300" />
          <input 
            type="text" 
            placeholder="Search shipments, contracts, or customers..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-100/50 border-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm transition-all duration-300 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-slate-100 text-slate-500 rounded-xl transition-all duration-300 relative group">
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          <button className="p-2.5 hover:bg-slate-100 text-slate-500 rounded-xl transition-all duration-300 group">
            <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-4 cursor-pointer group px-2 py-1.5 hover:bg-slate-50 rounded-2xl transition-all duration-300">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Aljas Idik</span>
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest leading-none">Super Admin</span>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-600 border-2 border-white shadow-sm overflow-hidden group-hover:border-blue-200 group-hover:shadow-md transition-all">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
