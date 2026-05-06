import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Truck, 
  User, 
  Calendar, 
  Activity, 
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  MapPin,
  Clock,
  Fuel,
  Settings,
  Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  status: 'Active' | 'Maintenance' | 'Assigned' | 'Idle';
  driver: string | null;
  fuel: number;
  mileage: string;
  lastService: string;
  expiry: string;
}

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'FLEET-001',
    plate: 'B 9231 TKI',
    type: 'Blind Van',
    status: 'Assigned',
    driver: 'Bagus Setiawan',
    fuel: 85,
    mileage: '42,500 KM',
    lastService: '12 Jan 2026',
    expiry: 'Dec 2026'
  },
  {
    id: 'FLEET-002',
    plate: 'B 1122 XYZ',
    type: 'Wingbox Trailer',
    status: 'Maintenance',
    driver: null,
    fuel: 12,
    mileage: '128,400 KM',
    lastService: '01 May 2026',
    expiry: 'Nov 2027'
  },
  {
    id: 'FLEET-003',
    plate: 'B 7766 JKL',
    type: 'CDD Long Box',
    status: 'Active',
    driver: 'Hendri Wahyudi',
    fuel: 64,
    mileage: '88,200 KM',
    lastService: '15 Mar 2026',
    expiry: 'Jan 2027'
  },
  {
    id: 'FLEET-004',
    plate: 'B 5544 OPA',
    type: 'CDE Box',
    status: 'Idle',
    driver: null,
    fuel: 45,
    mileage: '65,100 KM',
    lastService: '20 Feb 2026',
    expiry: 'Aug 2026'
  }
];

const statusColors: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Maintenance': 'bg-rose-50 text-rose-600 border-rose-200',
  'Assigned': 'bg-blue-50 text-blue-600 border-blue-200',
  'Idle': 'bg-slate-50 text-slate-400 border-slate-200',
};

const FleetManagement: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filteredVehicles = MOCK_VEHICLES.filter(v => filter === 'All' || v.status === filter);

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-amber-600 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Mobility Core</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Fleet <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Command</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Vehicle lifecycle & driver performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-amber-600 transition-all shadow-sm">
            Route Optimizer
          </button>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Enroll Vehicle
          </button>
        </div>
      </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Fleet Utilization', value: '78.5%', change: '+5.2%', icon: BarChart3, color: 'text-amber-600' },
          { label: 'Active Drivers', value: '142', change: '84%', icon: User, color: 'text-blue-600' },
          { label: 'Average Fuel', value: '1:12', change: 'Efficiency', icon: Fuel, color: 'text-emerald-600' },
          { label: 'Compliance Rate', value: '100%', change: 'Verified', icon: ShieldCheck, color: 'text-indigo-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl bg-slate-50", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.change}</span>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-[3rem] p-4 mb-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
           <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
            {['All', 'Active', 'Assigned', 'Maintenance', 'Idle'].map((v) => (
              <button 
                key={v}
                onClick={() => setFilter(v)}
                className={cn(
                  "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="SEARCH PLATE OR DRIVER..."
                className="pl-14 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none w-64 focus:ring-2 focus:ring-amber-500/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-6">Vehicle Identity</th>
                <th className="px-8 py-6">Operation Status</th>
                <th className="px-8 py-6">Assigned Driver</th>
                <th className="px-8 py-6 text-center">Maintenance</th>
                <th className="px-8 py-6">Mileage & Fuel</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center p-3 shadow-sm group-hover:scale-105 transition-transform">
                        <Car className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1.5">{vehicle.plate}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vehicle.type}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                          <span className="text-[10px] font-mono font-bold text-amber-600">{vehicle.id}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border inline-flex items-center gap-2",
                      statusColors[vehicle.status]
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", vehicle.status === 'Active' || vehicle.status === 'Assigned' ? 'bg-current animate-pulse' : 'bg-current')}></div>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    {vehicle.driver ? (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                          {vehicle.driver.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-xs font-black text-slate-900">{vehicle.driver}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase italic tracking-widest">Unassigned</span>
                    )}
                  </td>
                  <td className="px-8 py-8 text-center">
                    <div className="flex flex-col items-center">
                       <p className="text-[11px] font-black text-slate-900">{vehicle.lastService}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Next: {vehicle.expiry}</p>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                          <Fuel className="w-3.5 h-3.5 text-slate-400" />
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                             <div className="h-full bg-orange-500 rounded-full" style={{ width: `${vehicle.fuel}%` }}></div>
                          </div>
                          <span className="text-[10px] font-black text-slate-900">{vehicle.fuel}%</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-900">{vehicle.mileage}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FleetManagement;
