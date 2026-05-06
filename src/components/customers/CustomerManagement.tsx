import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  MoreHorizontal,
  LayoutGrid,
  List,
  ExternalLink,
  Briefcase,
  History,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Customer {
  id: string;
  name: string;
  logo: string;
  type: string;
  contracts: number;
  revenue: string;
  status: 'Active' | 'Churned' | 'Onboarding';
  location: string;
  pic: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Apple South East Asia',
    logo: 'https://logo.clearbit.com/apple.com',
    type: 'Electronics',
    contracts: 5,
    revenue: 'Rp 14.2B',
    status: 'Active',
    location: 'Jakarta, ID',
    pic: 'Sarah Johnson'
  },
  {
    id: 'CUST-002',
    name: 'Unilever Logistics',
    logo: 'https://logo.clearbit.com/unilever.com',
    type: 'FMCG',
    contracts: 12,
    revenue: 'Rp 28.5B',
    status: 'Active',
    location: 'Singapore, SG',
    pic: 'Budi Hartono'
  },
  {
    id: 'CUST-003',
    name: 'Tesla Indonesia',
    logo: 'https://logo.clearbit.com/tesla.com',
    type: 'Automotive',
    contracts: 2,
    revenue: 'Rp 8.1B',
    status: 'Onboarding',
    location: 'Jakarta, ID',
    pic: 'Elon Musk'
  },
  {
    id: 'CUST-004',
    name: 'Nestle Manufacturing',
    logo: 'https://logo.clearbit.com/nestle.com',
    type: 'Food & Bev',
    contracts: 8,
    revenue: 'Rp 42.0B',
    status: 'Active',
    location: 'Karawang, ID',
    pic: 'Jessica Wong'
  }
];

const statusColors: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Onboarding': 'bg-blue-50 text-blue-600 border-blue-200',
  'Churned': 'bg-rose-50 text-rose-600 border-rose-200',
};

const CustomerManagement: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-10 font-sans text-slate-900 leading-normal">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Unified CRM</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Portfolios</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Omnichannel customer relationship & intelligence</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl mr-2">
            <button 
              onClick={() => setView('grid')}
              className={cn("p-2.5 rounded-lg transition-all", view === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-2.5 rounded-lg transition-all", view === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Register Partner
          </button>
        </div>
      </div>

       {/* Standardized Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Active Partners', value: '1,240', change: '+12 new', icon: Users, color: 'text-blue-600' },
          { label: 'Renewal Pipeline', value: '42 Deals', change: 'Urgent', icon: History, color: 'text-amber-600' },
          { label: 'Annual Value', value: 'IDR 124B', change: '+18.5%', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Lead Conversion', value: '84%', change: 'Optimal', icon: Star, color: 'text-indigo-600' },
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

       {/* Search Bar */}
       <div className="bg-white border border-slate-200 rounded-[3rem] p-4 flex items-center shadow-sm mb-12">
          <div className="relative flex-1">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input 
               type="text" 
               placeholder="SEARCH ACROSS CLIENT DATA, PIC, OR REGION..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-300"
             />
          </div>
       </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {filteredCustomers.map((customer) => (
            <motion.div 
               layout
               key={customer.id}
               className="group bg-white border border-slate-200 rounded-[3.5rem] p-10 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-5 h-5 text-slate-400" />
               </div>
               
               <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-24 h-24 bg-white rounded-3xl border border-slate-100 flex items-center justify-center p-4 shadow-xl mb-6 group-hover:scale-110 transition-transform duration-500">
                     <img src={customer.logo} alt={customer.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">{customer.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{customer.type} Industry</p>
                  <span className={cn(
                    "mt-4 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                    statusColors[customer.status]
                  )}>
                    {customer.status}
                  </span>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Deals</p>
                     <p className="text-sm font-black text-slate-900">{customer.contracts} Frameworks</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Annual Value</p>
                     <p className="text-sm font-black text-slate-900">{customer.revenue}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-500">
                     <MapPin className="w-4 h-4" />
                     <span className="text-[11px] font-bold uppercase tracking-tight">{customer.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                     <User className="w-4 h-4" />
                     <span className="text-[11px] font-bold uppercase tracking-tight">PIC: {customer.pic}</span>
                  </div>
               </div>

               <div className="mt-10 pt-8 border-t border-slate-100 flex gap-2">
                  <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all">
                     Analytics
                  </button>
                  <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:border-blue-600 hover:text-blue-600 transition-all">
                     Profile
                  </button>
               </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
           <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                   <th className="px-10 py-6">Customer Legal Entity</th>
                   <th className="px-8 py-6">Compliance Status</th>
                   <th className="px-8 py-6">Primary Contact</th>
                   <th className="px-8 py-6">Active Contracts</th>
                   <th className="px-8 py-6 text-right">Revenue (MTD)</th>
                   <th className="px-10 py-6 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {filteredCustomers.map(customer => (
                   <tr key={customer.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                               <img src={customer.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                               <p className="text-[15px] font-black text-slate-900 tracking-tight leading-none mb-1">{customer.name}</p>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">#{customer.id}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-8">
                         <span className={cn(
                            "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            statusColors[customer.status]
                         )}>
                            {customer.status}
                         </span>
                      </td>
                      <td className="px-8 py-8 text-xs font-black text-slate-700 uppercase tracking-tight">{customer.pic}</td>
                      <td className="px-8 py-8 text-xs font-black text-slate-900">{customer.contracts} Frameworks</td>
                      <td className="px-8 py-8 text-right text-base font-black text-slate-900 tracking-tight">{customer.revenue}</td>
                      <td className="px-10 py-8 text-right">
                         <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                            <MoreHorizontal className="w-4.5 h-4.5" />
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
