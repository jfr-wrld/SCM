import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  FileText, 
  Wallet, 
  Boxes, 
  Users, 
  Settings,
  ChevronRight,
  LogOut,
  Map,
  ClipboardList,
  UserCheck,
  BellRing
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

const navItems = [
  { group: 'Overview', items: [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: ClipboardList },
  ]},
  { group: 'Operations', items: [
    { name: 'Shipments', path: '/shipments', icon: Truck },
    { name: 'Warehouse', path: '/warehouse', icon: Boxes },
    { name: 'Fleet', path: '/fleet', icon: Truck },
  ]},
  { group: 'Sales & Contracts', items: [
    { name: 'Contracts', path: '/contracts', icon: FileText },
    { name: 'Customers', path: '/customers', icon: Users },
  ]},
  { group: 'Finance', items: [
    { name: 'Billing', path: '/billing', icon: Wallet },
  ]},
  { group: 'Team', items: [
    { name: 'Members', path: '/team', icon: UserCheck },
  ]},
  { group: 'Config', items: [
    { name: 'Settings', path: '/settings', icon: Settings },
  ]}
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#0a0c10] text-slate-400 h-screen sticky top-0 flex flex-col border-r border-white/5">
      <div className="p-8 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Truck className="text-white w-5 h-5" />
        </div>
        <span className="font-extrabold text-xl text-white tracking-tight">LogiTrack</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {navItems.map((group) => (
          <div key={group.group} className="mb-8">
            <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">
              {group.group}
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "hover:bg-white/5 hover:text-white"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-slate-500"
                      )} />
                      <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                      {!isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-300 group">
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-tight">Log out</span>
        </button>
      </div>
    </aside>
  );
}
