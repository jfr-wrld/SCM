import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Layers, 
  Box, 
  Activity, 
  MapPin, 
  ChevronRight, 
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
  Maximize2,
  Package,
  Barcode,
  Layout,
  PieChart,
  HardDrive,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  occupancy: number;
  capacity: string;
  zones: number;
  totalSKUs: number;
  recentActivity: string;
  type: 'Cold' | 'Dry' | 'Hazmat';
}

const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: 'WH-JKT-01',
    name: 'Main Distribution Cikarang',
    location: 'Cikarang, West Java',
    occupancy: 84,
    capacity: '120,000 m3',
    zones: 12,
    totalSKUs: 4500,
    recentActivity: 'Large Inbound from Samsung',
    type: 'Dry'
  },
  {
    id: 'WH-SBY-02',
    name: 'Surabaya Cooling Node',
    location: 'Tandes, Surabaya',
    occupancy: 62,
    capacity: '45,000 m3',
    zones: 5,
    totalSKUs: 800,
    recentActivity: 'Temperature stable at -18°C',
    type: 'Cold'
  },
  {
    id: 'WH-MED-03',
    name: 'Sumatra Regional Hub',
    location: 'Medan, North Sumatra',
    occupancy: 95,
    capacity: '80,000 m3',
    zones: 8,
    totalSKUs: 2100,
    recentActivity: 'Picking Queue High',
    type: 'Dry'
  }
];

const WarehouseManagement: React.FC = () => {
  const [selectedWhId, setSelectedWhId] = useState(MOCK_WAREHOUSES[0].id);
  const selectedWh = MOCK_WAREHOUSES.find(w => w.id === selectedWhId);

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-indigo-600 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Storage Ecosystem</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Warehouse <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Nodes</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Inventory placement & spatial optimization</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all shadow-sm group flex items-center gap-2">
            <Barcode className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            Inventory Audit
          </button>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Provision Hub
          </button>
        </div>
      </div>

      {/* Standardized Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Capacity', value: '245,000 m3', change: '+12.4%', icon: Maximize2, color: 'text-indigo-600' },
          { label: 'Net Occupancy', value: '80.4%', change: 'Optimization', icon: PieChart, color: 'text-blue-600' },
          { label: 'Active Nodes', value: '12 Centers', change: 'Regional', icon: HardDrive, color: 'text-emerald-600' },
          { label: 'Safety Incidents', value: '0', change: 'Perfect Record', icon: ShieldCheck, color: 'text-rose-600' },
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar - Node List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[3rem] p-4 shadow-sm mb-8">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="FIND DISTRIBUTION CENTRE..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_WAREHOUSES.map((wh) => (
              <button 
                key={wh.id}
                onClick={() => setSelectedWhId(wh.id)}
                className={cn(
                  "w-full text-left p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group",
                  selectedWhId === wh.id 
                    ? "bg-[#0a0c10] border-slate-900 text-white shadow-2xl shadow-slate-900/40" 
                    : "bg-white border-slate-100 text-slate-900 hover:border-indigo-600 shadow-sm"
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border",
                    selectedWhId === wh.id ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors"
                  )}>
                    <HardDrive className={cn("w-6 h-6", selectedWhId === wh.id ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-600")} />
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                    selectedWhId === wh.id ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    {wh.id}
                  </span>
                </div>
                <h4 className="text-xl font-black tracking-tight mb-1">{wh.name}</h4>
                <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-6", selectedWhId === wh.id ? "text-slate-500" : "text-slate-400")}>{wh.location}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>Occupancy</span>
                    <span className={selectedWhId === wh.id ? "text-indigo-400" : "text-indigo-600"}>{wh.occupancy}%</span>
                  </div>
                  <div className={cn("h-1.5 rounded-full overflow-hidden", selectedWhId === wh.id ? "bg-white/10" : "bg-slate-100")}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${wh.occupancy}%` }}
                      className={cn("h-full rounded-full transition-all", selectedWhId === wh.id ? "bg-indigo-400" : "bg-indigo-600")}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Visual Heatmap & Details */}
        <div className="lg:col-span-8 space-y-10">
          {/* Active Node Dashboard */}
          <div className="bg-white border border-slate-200 rounded-[4rem] p-12 shadow-sm relative overflow-hidden">
             <div className="absolute right-0 top-0 p-12 opacity-[0.03] pointer-events-none">
                <Box className="w-64 h-64" />
             </div>

             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
                <div>
                   <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Live</span>
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedWh?.name}</h2>
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedWh?.type} Facility • {selectedWh?.capacity}</p>
                </div>
                <div className="flex gap-4">
                   <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                      3D Layout View
                   </button>
                   <button className="w-12 h-12 bg-white border border-slate-200 text-slate-900 rounded-2xl flex items-center justify-center hover:border-indigo-600 transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                   </button>
                </div>
             </div>

             {/* KPIs */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 relative z-10">
                {[
                  { label: 'Active Zones', value: selectedWh?.zones, icon: Layers, color: 'text-blue-500' },
                  { label: 'Unique SKUs', value: selectedWh?.totalSKUs.toLocaleString(), icon: Barcode, color: 'text-purple-500' },
                  { label: 'Receiving Queue', value: '4 Hubs', icon: TrendingUp, color: 'text-emerald-500' },
                  { label: 'Pick Accuracy', value: '99.4%', icon: Activity, color: 'text-indigo-500' },
                ].map((kpi, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                       <kpi.icon className={cn("w-4 h-4", kpi.color)} />
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
                  </div>
                ))}
             </div>

             {/* Heatmap Visual - Representation of Zones */}
             <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Spatial Utilization Heatmap</h4>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded bg-slate-100"></div>
                         <span className="text-[8px] font-black text-slate-400 uppercase">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded bg-indigo-200"></div>
                         <span className="text-[8px] font-black text-slate-400 uppercase">Moderate</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded bg-indigo-600"></div>
                         <span className="text-[8px] font-black text-slate-400 uppercase">Full</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                   {Array.from({ length: 24 }).map((_, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: i * 0.02 }}
                       className={cn(
                         "aspect-square rounded-2xl border transition-all cursor-pointer group relative",
                         i % 5 === 0 ? "bg-indigo-600 border-indigo-700 shadow-lg shadow-indigo-600/20" : 
                         i % 3 === 0 ? "bg-indigo-300 border-indigo-200" : 
                         "bg-slate-50 border-slate-100"
                       )}
                     >
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[#0a0c10]/80 rounded-2xl transition-opacity text-white text-[9px] font-black">
                         R{Math.floor(i/4)+1}-C{(i%4)+1}
                       </div>
                     </motion.div>
                   ))}
                </div>
             </div>
          </div>

          {/* Recent Warehouse Logs */}
          <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm transition-all hover:shadow-xl">
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Warehouse Activity Logs</h4>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                   View Full Logs <ChevronRight className="w-4 h-4" />
                </button>
             </div>
             <div className="space-y-6">
                {[
                  { event: 'Inbound Receipt #PO-992', desc: 'Samsung Electronics S24 Ultra - 500 Units', time: '12 mins ago', type: 'IN' },
                  { event: 'Outbound Picking #SO-881', desc: 'Apple Store PIK 2 - 120 Units', time: '45 mins ago', type: 'OUT' },
                  { event: 'Inventory Adjustment', desc: 'Rack B2 Damage Check - No Issues', time: '2 hours ago', type: 'MOD' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-indigo-100 transition-all">
                     <div className="flex items-center gap-5">
                        <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black",
                           log.type === 'IN' ? "bg-emerald-50 text-emerald-600" : log.type === 'OUT' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                        )}>
                           {log.type}
                        </div>
                        <div>
                           <p className="text-xs font-black text-slate-900 leading-none mb-1">{log.event}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{log.desc}</p>
                        </div>
                     </div>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{log.time}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseManagement;
