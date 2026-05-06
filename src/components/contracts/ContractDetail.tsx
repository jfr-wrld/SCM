import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  User, 
  MapPin, 
  Package, 
  FileText, 
  MoreHorizontal, 
  Edit3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  RefreshCcw,
  CreditCard,
  MessageSquare,
  Plus,
  Save,
  X,
  Upload,
  Download,
  Trash2,
  Paperclip,
  File
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from '../../lib/utils';

// Mock data fetcher for the demo
const getContractById = (id: string) => ({
  id,
  contractName: 'Samsung Electronics Contract 2026',
  customer: {
    name: 'Samsung Electronics',
    logo: 'https://logo.clearbit.com/samsung.com',
    id: 'C-SAM-001',
    industry: 'Electronics'
  },
  status: 'Active',
  startDate: '2026-01-15',
  endDate: '2027-01-14',
  value: 1250000000,
  accountManager: 'Andi Pratama',
  currency: 'IDR',
  contractType: 'Standard Agreement',
  tags: ['Electronics', 'Jakarta DC', 'High Value'],
  notes: 'Priority handling for electronics with temperature control requirements. SLA requires < 24h turnaround for cross-docking.',
  selectedProducts: [
    { name: 'Ultra High Def Monitor 32"', sku: 'SKU-ELEC-001', category: 'Electronics', unit: 'Pack', warehouse: 'Jakarta DC', inventory: 1250 },
    { name: 'NVMe SSD 1TB Enterprise', sku: 'SKU-ELEC-002', category: 'Electronics', unit: 'Pack', warehouse: 'Surabaya Hub', inventory: 450 }
  ],
  pricing: [
    { unit: 'Pack / Karton', rate: 15000, minQty: 100, timeUnit: 'Per Day' },
    { unit: 'Weight (Kg)', rate: 2500, minQty: 1000, timeUnit: 'Per Month' }
  ],
  additionalCharges: [
    { id: 'ac1', name: 'Outbound Handling', category: 'Handling', rate: 2500, unit: 'Per Shipment', taxable: true, notes: 'Standard processing' },
    { id: 'ac2', name: 'Labeling Service', category: 'Documentation', rate: 500, unit: 'Fixed', taxable: false, notes: 'Barcode application' },
  ],
  trendData: [
    { month: 'Jan', value: 100000000 },
    { month: 'Mar', value: 250000000 },
    { month: 'May', value: 400000000 },
    { month: 'Jul', value: 650000000 },
    { month: 'Sep', value: 850000000 },
    { month: 'Nov', value: 1100000000 },
    { month: 'Dec', value: 1250000000 },
  ],
  history: [
    { id: 'h1', action: 'Contract Finalized', type: 'creation', user: 'Admin User', timestamp: '2024-01-15 09:30 AM' },
    { id: 'h2', action: 'Inbound Fee Adjustment', type: 'edit', user: 'Siska Putri', timestamp: '2024-02-10 14:45 PM' },
    { id: 'h3', action: 'Status changed to Active', type: 'status', user: 'System', timestamp: '2024-02-15 00:01 AM' },
    { id: 'h4', action: 'Payment Received (Inv #0022)', type: 'payment', user: 'Agus Salim (Finance)', timestamp: '2024-03-01 11:20 AM' },
    { id: 'h5', action: 'Dispute raised on Storage calc', type: 'dispute', user: 'Customer Rep', timestamp: '2024-03-05 16:10 PM' },
    { id: 'h6', action: 'Dispute resolved', type: 'status', user: 'Budi Santoso', timestamp: '2024-03-08 10:00 AM' },
  ],
  attachments: [
    { id: 'a1', name: 'Master_Service_Agreement_v2.pdf', size: '2.4 MB', type: 'application/pdf', uploadedAt: '2024-01-15', uploadedBy: 'Admin User' },
    { id: 'a2', name: 'Price_Addendum_Jakarta.pdf', size: '1.1 MB', type: 'application/pdf', uploadedAt: '2024-02-10', uploadedBy: 'Siska Putri' },
    { id: 'a3', name: 'Warehouse_Layout_Annex.png', size: '5.8 MB', type: 'image/png', uploadedAt: '2024-01-20', uploadedBy: 'Siska Putri' },
  ]
});

const historyIcons: Record<string, any> = {
  creation: <Plus className="w-4 h-4 text-emerald-500" />,
  status: <RefreshCcw className="w-4 h-4 text-blue-500" />,
  edit: <Edit3 className="w-4 h-4 text-amber-500" />,
  payment: <CreditCard className="w-4 h-4 text-indigo-500" />,
  dispute: <MessageSquare className="w-4 h-4 text-rose-500" />,
};

const attachmentIcons: Record<string, any> = {
  'application/pdf': <FileText className="w-5 h-5 text-rose-500" />,
  'image/png': <Plus className="w-5 h-5 text-indigo-500" />, // Use Image if available, but staying within lucide imports
  'default': <FileText className="w-5 h-5 text-slate-400" />
};

const statusColors: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Pending Review': 'bg-amber-50 text-amber-600 border-amber-100',
  'Draft': 'bg-slate-100 text-slate-600 border-slate-200',
  'Expired': 'bg-rose-50 text-rose-600 border-rose-100',
};

export function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const contract = getContractById(id || 'CTR-2024-001');

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesContent, setNotesContent] = useState(contract.notes);

  const handleSaveNotes = () => {
    // Mock save action
    setIsEditingNotes(false);
    // In a real application, you would make an API call to update the contract notes here
  };

  const handleCancelNotes = () => {
    setNotesContent(contract.notes);
    setIsEditingNotes(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate('/contracts')}
            className="w-16 h-16 bg-white border border-slate-200 rounded-3xl flex items-center justify-center hover:bg-slate-50 hover:border-blue-600 group transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </button>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Agreement Insight</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-2 shadow-sm">
                <img src={contract.customer.logo} alt={contract.customer.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
                {contract.contractName.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{contract.contractName.split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Contract Identifier: #{contract.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/contracts/edit/${contract.id}`)}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            Modify Agreement
          </button>
          <button className="w-14 h-14 bg-white border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center hover:text-slate-900 hover:border-blue-600 transition-all shadow-sm">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mb-4 shadow-sm relative group",
                  statusColors[contract.status]
                )}
              >
                <span className="relative flex h-2 w-2">
                  <motion.span 
                    animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-75",
                      contract.status === 'Active' ? 'bg-emerald-400' : 
                      contract.status === 'Pending Review' ? 'bg-amber-400' : 'bg-slate-400'
                    )}
                  />
                  <span className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    contract.status === 'Active' ? 'bg-emerald-500' : 
                    contract.status === 'Pending Review' ? 'bg-amber-500' : 'bg-slate-500'
                  )} />
                </span>
                {contract.status}
              </motion.div>
              <p className="text-2xl font-black text-slate-900 mb-1">{contract.currency} {contract.value.toLocaleString()}</p>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-tight mb-6">Estimated Annual Value</p>
              
              <div className="flex flex-wrap gap-2">
                {(contract as any).tags?.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-white border border-slate-200 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Validity Period</p>
                  <p className="text-sm font-semibold text-slate-700">{contract.startDate} — {contract.endDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Account Owner</p>
                  <p className="text-sm font-semibold text-slate-700">{contract.accountManager}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contract Scope</p>
                  <p className="text-sm font-semibold text-slate-700">{contract.contractType}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
            <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <h4 className="font-bold mb-2">Billing Cycle</h4>
            <p className="text-sm text-blue-100 mb-4">Invoices are automatically generated on the 1st of every month based on actual warehouse usage.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-all">View Billing Rules</button>
          </div>
        </div>

        {/* Right Column: Detailed Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            <div className="flex border-b border-slate-100">
              {['Overview', 'Pricing Rules', 'Additional Charges', 'Products', 'History', 'Attachments'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={cn(
                    "px-6 py-4 text-sm font-bold transition-all relative",
                    activeTab === tab.toLowerCase() ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                         <TrendingUp className="w-4 h-4 text-blue-500" />
                         Projected Value Progression
                      </h5>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Forecast • 2024</span>
                    </div>
                    <div className="h-[280px] w-full bg-slate-50/30 rounded-3xl p-6 border border-slate-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={contract.trendData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                          <XAxis 
                            dataKey="month" 
                            stroke="#94a3b8" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10}
                            fontFamily="Plus Jakarta Sans"
                            fontWeight={700}
                          />
                          <YAxis 
                            stroke="#94a3b8" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `Rp${value/1000000}M`}
                            fontFamily="Plus Jakarta Sans"
                            fontWeight={700}
                          />
                          <RechartsTooltip 
                            formatter={(value: number) => [formatCurrency(value), 'Projected Value']}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#2563eb" 
                            strokeWidth={4} 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-3 text-slate-900">
                      <h5 className="text-sm font-bold flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        Terms and Special Notes
                      </h5>
                      {!isEditingNotes ? (
                        <button 
                          onClick={() => setIsEditingNotes(true)}
                          className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Notes
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={handleCancelNotes}
                            className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                          <button 
                            onClick={handleSaveNotes}
                            className="flex items-center gap-1.5 px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-500/20"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "p-1 transition-all rounded-2xl",
                      isEditingNotes ? "bg-blue-50 ring-2 ring-blue-500/20" : "bg-transparent"
                    )}>
                      {isEditingNotes ? (
                        <textarea
                          value={notesContent}
                          onChange={(e) => setNotesContent(e.target.value)}
                          className="w-full min-h-[120px] p-4 bg-white border border-blue-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/5 font-medium leading-relaxed resize-none shadow-inner"
                          placeholder="Enter special terms or notes..."
                          autoFocus
                        />
                      ) : (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white transition-all cursor-text group" onClick={() => setIsEditingNotes(true)}>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {notesContent || <span className="text-slate-400 italic">No notes provided for this contract.</span>}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                  <section className="grid grid-cols-2 gap-8">
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 mb-3">Service Locations</h5>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">Jakarta HUB, Surabaya DC, Medan WH</span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 mb-3">Currency</h5>
                      <p className="text-sm font-medium text-slate-600 uppercase">{contract.currency}</p>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'pricing rules' && (
                <div className="space-y-4">
                  {contract.pricing.map((rule, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors">
                      <div>
                        <p className="font-bold text-slate-900">{rule.unit}</p>
                        <p className="text-xs text-slate-500">Min. Quantity: {rule.minQty} units • {rule.timeUnit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(rule.rate)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm italic">
                    All prices are exclusive of 11% PPN (VAT)
                  </div>
                </div>
              )}

               {activeTab === 'additional charges' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contract.additionalCharges.map((charge: any) => (
                      <div key={charge.id} className="p-6 border border-slate-100 rounded-[2.5rem] flex items-center justify-between hover:border-blue-200 transition-colors bg-slate-50/20">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-slate-100">
                            <DollarSign className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 uppercase tracking-tight">{charge.name}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{charge.category}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{charge.unit}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-slate-900">{contract.currency} {charge.rate.toLocaleString()}</p>
                          {charge.taxable && <span className="text-[9px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 tracking-tighter">Taxable (PPN)</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 text-center flex items-center justify-center gap-3">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Additional charges are applied per service transaction or triggered events</p>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contract.selectedProducts.map((product: any, i: number) => (
                    <div key={i} className="p-5 border border-slate-100 rounded-[2rem] flex items-center gap-5 hover:bg-slate-50/50 transition-all">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-400">
                        <Package className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 truncate uppercase tracking-tight">{product.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{product.sku}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest border border-blue-50 rounded px-1.5">{product.warehouse}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">{product.inventory.toLocaleString()}</p>
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{product.unit}s</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-0 relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                  {contract.history?.map((item, i) => (
                    <div key={item.id} className="relative pl-14 pb-8 last:pb-0">
                      <div className="absolute left-[1.375rem] top-1 w-3 h-3 rounded-full bg-white border-2 border-slate-200 z-10 group-hover:border-blue-500 transition-colors"></div>
                      <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                              {historyIcons[item.type] || <Clock className="w-4 h-4 text-slate-400" />}
                            </div>
                            <span className="font-bold text-slate-900">{item.action}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {item.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                             <User className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-600">Initiated by {item.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'attachments' && (
                <div className="space-y-8">
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-slate-50/30 hover:bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all group cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="max-w-xs space-y-1">
                      <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">PDF, JPG, or PNG formats up to 20MB</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Recent Documents</h5>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                        {contract.attachments?.length || 0} Files
                      </span>
                    </div>
                    {contract.attachments?.map((file: any) => (
                      <div 
                        key={file.id} 
                        className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                          {attachmentIcons[file.type] || <File className="w-5 h-5 text-slate-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate mb-0.5">{file.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{file.size}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Uploaded {file.uploadedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <Download className="w-4.5 h-4.5" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Info({ className }: { className?: string }) {
  return <AlertCircle className={className} />;
}
