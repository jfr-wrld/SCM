import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Truck, 
  User, 
  Calendar, 
  ChevronRight, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  Package,
  ExternalLink,
  Map as MapIcon,
  Navigation,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Shipment {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  type: 'Inbound' | 'Outbound' | 'Transfer';
  status: 'Pending' | 'In Transit' | 'Arrived' | 'Delivered' | 'Problem';
  eta: string;
  driver: string;
  vehicle: string;
  lastUpdate: string;
}

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-10029',
    customer: 'Apple South East Asia',
    origin: 'JKT-WH-01 (Cikarang)',
    destination: 'Apple Store PIK 2',
    type: 'Outbound',
    status: 'In Transit',
    eta: 'Today, 17:00',
    driver: 'Bagus Setiawan',
    vehicle: 'B 9231 TKI (Blind Van)',
    lastUpdate: 'Passing Gatot Subroto'
  },
  {
    id: 'SHP-10030',
    customer: 'Samsung Electronics',
    origin: 'Port of Tanjung Priok',
    destination: 'WH-ELECTRONICS-02',
    type: 'Inbound',
    status: 'Arrived',
    eta: 'Arrived',
    driver: 'M. Syarif',
    vehicle: 'B 1122 XYZ (Wingbox)',
    lastUpdate: 'Unloading Process'
  },
  {
    id: 'SHP-10031',
    customer: 'Unilever Logistics',
    origin: 'WH-FMCG-MARUNDA',
    destination: 'Distribution Center 1',
    type: 'Outbound',
    status: 'Pending',
    eta: 'Tomorrow, 08:00',
    driver: 'Hendri Wahyudi',
    vehicle: 'B 7766 JKL (CDD)',
    lastUpdate: 'Assigned'
  },
  {
    id: 'SHP-10032',
    customer: 'IKEA Indonesia',
    origin: 'WH-FURNITURE-05',
    destination: 'IKEA Kota Baru Parahyangan',
    type: 'Transfer',
    status: 'Problem',
    eta: 'Delayed',
    driver: 'Dani Ramdan',
    vehicle: 'B 5544 OPA (CDE)',
    lastUpdate: 'Vehicle Breakdown'
  }
];

const statusColors: Record<string, string> = {
  'Pending': 'bg-slate-50 text-slate-500 border-slate-200',
  'In Transit': 'bg-blue-50 text-blue-600 border-blue-200',
  'Arrived': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Delivered': 'bg-indigo-50 text-indigo-600 border-indigo-200',
  'Problem': 'bg-rose-50 text-rose-600 border-rose-200',
};

const ShipmentManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredShipments = MOCK_SHIPMENTS.filter(s => 
    (filter === 'All' || s.status === filter) &&
    (s.id.toLowerCase().includes(search.toLowerCase()) || s.customer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Global Logistics</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Shipment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Fleet</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Real-time terminal visibility & operational tracking</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-600 transition-all shadow-sm">
            Operational Map
          </button>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Create Dispatch
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Active Shipments', value: '1,284', change: '+12%', icon: Truck, color: 'text-blue-600' },
          { label: 'ETA Compliance', value: '98.2%', change: '+0.5%', icon: Clock, color: 'text-emerald-600' },
          { label: 'Pending Dispatch', value: '42', change: '-4', icon: Box, color: 'text-amber-600' },
          { label: 'Exception Alerts', value: '3', change: 'Urgent', icon: AlertCircle, color: 'text-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
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

      {/* Filters & Control Bar */}
      <div className="bg-white border border-slate-200 rounded-[3rem] p-4 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH BY SHIPMENT ID, CUSTOMER, OR DRIVER..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
            {['All', 'In Transit', 'Arrived', 'Pending', 'Problem'].map((v) => (
              <button 
                key={v}
                onClick={() => setFilter(v)}
                className={cn(
                  "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === v ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shipments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredShipments.map((shipment) => (
            <motion.div 
              layout
              key={shipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white border border-slate-200 rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all relative"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      {shipment.type === 'Inbound' ? <ArrowDownLeft className="w-7 h-7" /> : shipment.type === 'Outbound' ? <ArrowUpRight className="w-7 h-7" /> : <Navigation className="w-7 h-7" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{shipment.type}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">#{shipment.id}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{shipment.customer}</h3>
                    </div>
                  </div>
                  <span className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                    statusColors[shipment.status]
                  )}>
                    {shipment.status}
                  </span>
                </div>

                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-dashed border-l-2 border-slate-100 border-dashed"></div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm z-10 mt-1"></div>
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Origin Node</p>
                          <p className="text-[11px] font-bold text-slate-900">{shipment.origin}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm z-10 mt-1"></div>
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Final Destination</p>
                          <p className="text-[11px] font-bold text-slate-900">{shipment.destination}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Driver PIC</p>
                        <p className="text-[11px] font-black text-slate-900">{shipment.driver}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Vehicle</p>
                        <p className="text-[11px] font-black text-slate-900">{shipment.vehicle.split(' ')[0]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{shipment.lastUpdate}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ETA:</span>
                      <span className="text-[11px] font-black text-slate-900">{shipment.eta}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button className="flex-1 bg-white border border-slate-200 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live Tracking
                  </button>
                  <button className="flex-1 bg-slate-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-black transition-all flex items-center justify-center gap-2">
                    <MapIcon className="w-3.5 h-3.5" />
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShipmentManagement;
