import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Copy, 
  Trash2, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  DollarSign,
  Package,
  Layers,
  Archive,
  X,
  History,
  TrendingUp,
  MapPin,
  Calendar,
  ChevronDown,
  User,
  ArrowUpDown,
  LifeBuoy,
  RefreshCw,
  Ban
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const contracts = [
  { 
    id: 'CTR-2026-001', 
    name: 'Samsung Electronics Contract 2026', 
    customer: 'Samsung Electronics', 
    logo: 'https://logo.clearbit.com/samsung.com', 
    status: 'Active', 
    start: '2026-01-15', 
    end: '2026-12-31', 
    duration: '12 Months',
    value: 1250000000, 
    type: 'Standard', 
    currency: 'IDR', 
    warehouse: 'Jakarta DC',
    productsCount: 12,
    pricingRules: 24,
    manager: 'Andi Pratama',
    updatedAt: '2 hours ago',
    createdBy: 'Andi Pratama',
    tags: ['Urgent', 'VVIP', 'FMCG']
  },
  { 
    id: 'CTR-2026-002', 
    name: 'Unilever Distribution Agreement', 
    customer: 'Unilever Indonesia', 
    logo: 'https://logo.clearbit.com/unilever.com', 
    status: 'Pending Review', 
    start: '2026-05-20', 
    end: '2027-05-19', 
    duration: '1 Year',
    value: 890000000, 
    type: 'Framework', 
    currency: 'IDR', 
    warehouse: 'Surabaya Hub',
    productsCount: 8,
    pricingRules: 16,
    manager: 'Budi Santoso',
    updatedAt: 'Yesterday',
    createdBy: 'Budi Santoso',
    tags: ['Logistics', 'Regional']
  },
  { 
    id: 'CTR-2026-003', 
    name: 'Indofood Cold Storage 2026', 
    customer: 'Indofood Sukses Makmur', 
    logo: 'https://logo.clearbit.com/indofood.com', 
    status: 'Draft', 
    start: '2026-06-01', 
    end: '2027-05-31', 
    duration: '1 Year',
    value: 450000000, 
    type: 'Custom', 
    currency: 'IDR', 
    warehouse: 'Semarang WH',
    productsCount: 5,
    pricingRules: 10,
    manager: 'Citra Dewi',
    updatedAt: '5 days ago',
    createdBy: 'Citra Dewi',
    tags: ['Cold Storage', 'Seasonal']
  },
  { 
    id: 'CTR-2026-004', 
    name: 'Astra Spare Parts Logistics', 
    customer: 'Astra International', 
    logo: 'https://logo.clearbit.com/astra.co.id', 
    status: 'Active', 
    start: '2026-02-10', 
    end: '2027-02-09', 
    duration: '12 Months',
    value: 340000000, 
    type: 'Standard', 
    currency: 'IDR', 
    warehouse: 'Jakarta DC',
    productsCount: 22,
    pricingRules: 44,
    manager: 'Andi Pratama',
    updatedAt: '1 week ago',
    createdBy: 'Admin',
    tags: ['Automotive', 'Express']
  },
  { 
    id: 'CTR-2026-005', 
    name: 'Wilmar Group Master Service', 
    customer: 'Wilmar Group', 
    logo: 'https://logo.clearbit.com/wilmar-international.com', 
    status: 'Expired', 
    start: '2025-01-01', 
    end: '2025-12-31', 
    duration: '1 Year',
    value: 2100000000, 
    type: 'Framework', 
    currency: 'IDR', 
    warehouse: 'Regional',
    productsCount: 45,
    pricingRules: 90,
    manager: 'Budi Santoso',
    updatedAt: '3 months ago',
    createdBy: 'System',
    tags: ['Agriculture', 'Global']
  },
];

const statusColors: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Pending Review': 'bg-amber-50 text-amber-600 border-amber-100',
  'Draft': 'bg-slate-100 text-slate-500 border-slate-200',
  'Expired': 'bg-rose-50 text-rose-600 border-rose-100',
  'Terminated': 'bg-red-50 text-red-700 border-red-200',
  'Incomplete': 'bg-orange-50 text-orange-600 border-orange-100',
};

const contractTypes = ['Standard', 'Custom', 'Framework'];
const accountManagers = ['Andi Pratama', 'Budi Santoso', 'Citra Dewi'];
const warehouses = ['Jakarta DC', 'Surabaya Hub', 'Semarang WH', 'Regional'];

export function ContractList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [managerFilter, setManagerFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [view, setView] = useState<'all' | 'active' | 'expiring' | 'high-value'>('all');

  const filteredContracts = useMemo(() => {
    let result = contracts.filter(contract => {
      const matchesSearch = 
        contract.id.toLowerCase().includes(search.toLowerCase()) ||
        contract.name.toLowerCase().includes(search.toLowerCase()) ||
        contract.customer.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(contract.status);
      const matchesType = typeFilter.length === 0 || typeFilter.includes(contract.type);
      const matchesManager = !managerFilter || contract.manager === managerFilter;
      const matchesWarehouse = !warehouseFilter || contract.warehouse === warehouseFilter;
      const matchesDate = (!dateRange.start || contract.start >= dateRange.start) && 
                         (!dateRange.end || contract.end <= dateRange.end);
      
      return matchesSearch && matchesStatus && matchesType && matchesManager && matchesWarehouse && matchesDate;
    });

    if (view === 'active') result = result.filter(c => c.status === 'Active');
    if (view === 'expiring') result = result.filter(c => c.status === 'Active' && new Date(c.end) < new Date('2027-01-01'));
    if (view === 'high-value') result = result.filter(c => c.value > 1000000000);

    return result;
  }, [search, statusFilter, typeFilter, managerFilter, warehouseFilter, dateRange, view]);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredContracts.length && filteredContracts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContracts.map(c => c.id));
    }
  };

  const resetFilters = () => {
    setStatusFilter([]);
    setTypeFilter([]);
    setManagerFilter('');
    setWarehouseFilter('');
    setDateRange({ start: '', end: '' });
    setSearch('');
  };

  const previewContract = contracts.find(c => c.id === previewId);

  const Highlight = ({ text, query }: { text: string; query: string }) => {
    if (!query) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="bg-yellow-100 text-slate-900 rounded-sm font-black">{part}</span> 
            : part
        )}
      </span>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-indigo-600 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Agreement Ledger</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Contract <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Repository</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{contracts.length} Enterprise Agreements Active</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Ledger
          </button>
          <button 
            onClick={() => navigate('/contracts/new')}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Framework
          </button>
        </div>
      </div>

      {/* Recommended Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Active Service', value: '24', change: 'Optimal', icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Pending Review', value: '12', change: 'Audit', icon: Clock, color: 'text-amber-600' },
          { label: 'Pipeline Value', value: 'Rp 12.4B', change: '+15.2%', icon: TrendingUp, color: 'text-blue-600' },
          { label: 'Expiring Soon', value: '5', change: 'Critical', icon: AlertCircle, color: 'text-rose-600' },
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

      {/* Toolbar & Filter Panel */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search contract ID or customer..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-200 rounded-3xl text-sm focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-900"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-3 px-6 py-4.5 bg-white border border-slate-200 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all shadow-sm",
                showFilters ? "border-blue-500 text-blue-600 bg-blue-50/50" : "hover:border-blue-200"
              )}
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              {(statusFilter.length > 0 || typeFilter.length > 0) && (
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">!</span>
              )}
            </button>
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {[
                { id: 'all', label: 'All Agreements' },
                { id: 'active', label: 'Active Only' },
                { id: 'expiring', label: 'Expiring Soon' },
                { id: 'high-value', label: 'High Value' },
              ].map((v) => (
                <button 
                  key={v.id}
                  onClick={() => setView(v.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    view === v.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white border border-slate-200 rounded-[2.5rem] shadow-xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contract Status</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(statusColors).map(s => (
                      <button 
                        key={s}
                        onClick={() => setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[9px] font-black border transition-all uppercase tracking-tighter",
                          statusFilter.includes(s) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contract Type</label>
                  <div className="relative">
                    <select 
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-blue-500/10"
                      onChange={(e) => setTypeFilter(e.target.value ? [e.target.value] : [])}
                    >
                      <option value="">All Types</option>
                      {contractTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Manager</label>
                  <div className="relative">
                    <select 
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-blue-500/10"
                      value={managerFilter}
                      onChange={(e) => setManagerFilter(e.target.value)}
                    >
                      <option value="">Any Manager</option>
                      {accountManagers.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiring Before</label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-8 border-t border-slate-100">
                <button 
                  onClick={resetFilters}
                  className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20"
                >
                  Apply Filter Matrix
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em] border-b border-slate-100">
                <th className="px-6 py-5 w-16">
                  <div 
                    onClick={toggleSelectAll}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all",
                      selectedIds.length === filteredContracts.length && filteredContracts.length > 0
                        ? "bg-blue-600 border-blue-600" 
                        : "bg-white border-slate-200"
                    )}
                  >
                    {selectedIds.length === filteredContracts.length && filteredContracts.length > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                </th>
                <th className="px-6 py-5">Contract & Client</th>
                <th className="px-6 py-5">Status & Classification</th>
                <th className="px-6 py-5">Timeline</th>
                <th className="px-6 py-5 text-right">Annual Value</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-100">
                        <FileText className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">No Matching Contracts Found</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Adjust filters to broaden search</p>
                      </div>
                      <button 
                        onClick={resetFilters}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95"
                      >
                        Reset All Criteria
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredContracts.map((contract) => (
                <tr 
                  key={contract.id} 
                  onClick={() => setPreviewId(contract.id)}
                  className={cn(
                    "hover:bg-blue-50/10 transition-colors group cursor-pointer",
                    selectedIds.includes(contract.id) ? "bg-blue-50/30" : ""
                  )}
                >
                  <td className="px-6 py-4" onClick={(e) => toggleSelect(contract.id, e)}>
                    <div 
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                        selectedIds.includes(contract.id) 
                          ? "bg-blue-600 border-blue-600" 
                          : "bg-white border-slate-200 group-hover:border-blue-300"
                      )}
                    >
                      {selectedIds.includes(contract.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 shrink-0 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-1.5 shadow-sm">
                        <img 
                          src={contract.logo} 
                          alt="" 
                          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[13px] font-black text-slate-900 leading-tight truncate">
                            <Highlight text={contract.name} query={search} />
                          </p>
                          <span className="shrink-0 font-mono text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#{contract.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                            {contract.customer}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contract.manager}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit",
                        statusColors[contract.status]
                      )}>
                        {contract.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                          {contract.type === 'Framework' ? <Layers className="w-3 h-3 text-purple-600" /> : <FileText className="w-3 h-3 text-blue-600" />}
                          {contract.type}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{contract.warehouse}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="text-[10px] font-bold uppercase">{contract.start}</span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-bold uppercase">{contract.end}</span>
                      </div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{contract.duration} · {contract.pricingRules} RULES</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-black text-slate-900 tracking-tight">{contract.currency} {contract.value.toLocaleString()}</span>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Active Annual</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="relative inline-block text-left">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === contract.id ? null : contract.id)}
                        className={cn(
                          "p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all",
                          activeMenuId === contract.id ? "bg-slate-900 text-white" : ""
                        )}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      <AnimatePresence>
                        {activeMenuId === contract.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden p-1"
                          >
                            <button onClick={() => { navigate(`/contracts/${contract.id}`); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-left">
                              <Eye className="w-4 h-4 text-blue-500" />
                              View Detail
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-left">
                              <Edit2 className="w-4 h-4 text-amber-500" />
                              Edit Plan
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-left">
                              <Copy className="w-4 h-4 text-purple-500" />
                              Duplicate
                            </button>
                            <div className="h-px bg-slate-100 my-1 mx-2"></div>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left">
                              <Trash2 className="w-4 h-4" />
                              Archive
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* Bulk Action Toolbar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 px-10 py-5 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl flex items-center gap-12 z-40 border border-white/10"
            >
              <div className="flex items-center gap-5 border-r border-white/10 pr-12">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                  {selectedIds.length}
                </div>
                <div>
                  <p className="text-sm font-black leading-none mb-1">Contract Items</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execute selection</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                {[
                  { icon: Download, label: 'Export PDF' },
                  { icon: Archive, label: 'Archive' },
                  { icon: RefreshCw, label: 'Change Status' },
                  { icon: User, label: 'Assign Manager' },
                ].map((action, i) => (
                  <button 
                    key={i} 
                    className="flex flex-col items-center gap-2 group text-slate-400 hover:text-white transition-colors"
                  >
                    <action.icon className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest">{action.label}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setSelectedIds([])}
                className="ml-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-10">
        <div className="flex items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows per page</p>
          <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black shadow-sm outline-none">
            <option>20 Rows</option>
            <option>50 Rows</option>
            <option>100 Rows</option>
          </select>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Showing 1-20 of {contracts.length} Enterprise Records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          {[1, 2, 3].map(p => (
            <button 
              key={p}
              className={cn(
                "w-12 h-12 rounded-2xl text-[10px] font-black transition-all",
                p === 1 ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 shadow-sm"
              )}
            >
              {p}
            </button>
          ))}
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Side Preview Drawer */}
      <AnimatePresence>
        {previewId && previewContract && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setPreviewId(null); setActiveMenuId(null); }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-[650px] bg-white z-[70] shadow-[-40px_0_100px_-20px_rgba(0,0,0,0.15)] flex flex-col font-sans"
            >
              {/* Drawer Header */}
              <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-3 border border-slate-100 shadow-xl shadow-slate-200/50">
                    <img src={previewContract.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">{previewContract.name}</h3>
                    <div className="flex items-center gap-3">
                       <span className={cn(
                        "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                        statusColors[previewContract.status]
                      )}>
                        {previewContract.status}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-bold bg-white px-2 py-1 rounded-lg border border-slate-100 tracking-tighter">#{previewContract.id}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setPreviewId(null)} className="p-4 text-slate-300 hover:text-slate-900 hover:bg-white rounded-3xl transition-all shadow-sm">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-white scroll-smooth custom-scrollbar">
                {/* Contract Summary Section */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                    <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.05]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estimated Annual Value</p>
                    <p className="text-3xl font-black">{previewContract.currency} {previewContract.value.toLocaleString()}</p>
                    <div className="mt-6 flex items-center gap-2 text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">+12.4% projected growth</span>
                    </div>
                  </div>
                  <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden">
                    <Layers className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.05]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Internal Framework</p>
                    <div className="space-y-1">
                      <p className="text-3xl font-black">{previewContract.pricingRules} Rules</p>
                      <p className="text-[9px] font-bold text-blue-100 uppercase tracking-widest">Active pricing configurations</p>
                    </div>
                  </div>
                </div>

                {/* Contract Period */}
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 tracking-tight">Contract Period</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Effective: {previewContract.start} — {previewContract.end}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {previewContract.duration} Total
                    </span>
                  </div>
                </div>

                {/* Section: Selected Products */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                      <Package className="w-4 h-4 text-blue-600" />
                      Assigned Products ({previewContract.productsCount})
                    </h4>
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Manage All</button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {['Enterprise Logistics Bundle A', 'Standard DC Storage Service', 'Refrigerated Transport SKU'].map((p, i) => (
                      <div key={i} className="px-6 py-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between hover:border-blue-300 transition-all cursor-pointer group shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <span className="text-[10px] font-black">{i + 1}</span>
                          </div>
                          <div>
                            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{p}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">S-Class Asset</span>
                              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                              <span className="text-[9px] font-black text-emerald-500 uppercase">Discount Applied</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-blue-600 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Additional Charges */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Strategic Charges Summary
                  </h4>
                  <div className="p-8 bg-emerald-50/20 border-2 border-dashed border-emerald-100 rounded-[2.5rem] grid grid-cols-2 gap-8">
                     <div>
                        <p className="text-[11px] font-black text-slate-900 mb-1">Overtime Handling</p>
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Rp 250,000 / Trip</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-3 leading-relaxed">Applied for any transaction after 19:00 WIB DC Time.</p>
                     </div>
                     <div>
                        <p className="text-[11px] font-black text-slate-900 mb-1">Waiting Surcharge</p>
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Rp 50,000 / Hour</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-3 leading-relaxed">Effective after 2 hours of buffer wait time.</p>
                     </div>
                  </div>
                </div>

                {/* Section: Approval Workflow Status */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <Ban className="w-4 h-4 text-blue-600 rotate-180" />
                    Approval Workflow Progress
                  </h4>
                  <div className="flex items-center justify-between px-6 pt-4 pb-10">
                    {[
                      { step: 'Ops Desk', status: 'Completed', color: 'bg-emerald-500', done: true },
                      { step: 'Fin Review', status: 'Active', color: 'bg-blue-600', done: false },
                      { step: 'Commercial', status: 'Pending', color: 'bg-slate-200', done: false },
                      { step: 'VP Sales', status: 'Pending', color: 'bg-slate-200', done: false },
                    ].map((s, i, arr) => (
                      <React.Fragment key={i}>
                        <div className="flex flex-col items-center gap-3 relative">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xs font-black transition-all shadow-xl",
                            s.done ? "bg-emerald-500 shadow-emerald-500/20" : s.status === 'Active' ? "bg-blue-600 shadow-blue-600/30 ring-4 ring-blue-50 scale-110" : "bg-slate-50 text-slate-300 border border-slate-100 shadow-none ring-0"
                          )}>
                            {s.done ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                          </div>
                          <div className="text-center absolute -bottom-10 w-24">
                            <span className={cn("text-[9px] font-black uppercase tracking-widest", s.status !== 'Pending' ? "text-slate-900" : "text-slate-300")}>{s.step}</span>
                          </div>
                        </div>
                        {i < arr.length - 1 && (
                          <div className={cn("flex-1 h-1 rounded-full mx-2 -mt-10 transition-all", s.done ? "bg-emerald-500" : "bg-slate-100")}></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Section: Activity Timeline */}
                <div className="space-y-8 pt-6">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <History className="w-4 h-4 text-blue-600" />
                    Activity Audit Pipeline
                  </h4>
                  <div className="border-l-4 border-slate-100 ml-5 pl-10 space-y-12 pb-10">
                    {[
                      { event: 'Rate Matrix Recalibration', user: 'Andi Pratama', time: '2 hours ago', meta: 'Updated SKU Rates for Category A' },
                      { event: 'Contract Terms Initialized', user: 'Citra Dewi', time: 'Yesterday, 10:45 AM', meta: 'Draft created from Template v2.1' },
                    ].map((log, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[54px] top-0 w-8 h-8 rounded-xl bg-white border-4 border-slate-50 flex items-center justify-center text-blue-600 shadow-sm">
                           <RefreshCw className="w-4 h-4" />
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                             <p className="text-[12px] font-black text-slate-900">{log.event}</p>
                             <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">{log.time}</span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Action by {log.user}</p>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-slate-100 italic">"{log.meta}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Sticky Footer Actions */}
              <div className="p-10 border-t border-slate-100 bg-white/80 backdrop-blur-md flex gap-4">
                <button 
                  onClick={() => navigate(`/contracts/${previewId}`)}
                  className="flex-1 py-5 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
                >
                  Open Full Audit Dashboard
                </button>
                <div className="flex gap-2">
                  <button className="p-5 bg-white border border-slate-200 text-slate-400 rounded-3xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm group">
                    <Edit2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  </button>
                  <button className="p-5 bg-white border border-slate-200 text-slate-400 rounded-3xl hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
