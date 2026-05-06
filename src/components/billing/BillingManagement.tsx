import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Download, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  Filter,
  DollarSign,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  currency: string;
  date: string;
  dueDate: string;
  status: 'Published' | 'Draft' | 'Paid' | 'Overdue';
  category: 'Subscription' | 'Usage' | 'One-time';
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    customer: 'Toyota Manufacturing',
    amount: 145000000,
    currency: 'IDR',
    date: '01 May 2026',
    dueDate: '31 May 2026',
    status: 'Published',
    category: 'Usage'
  },
  {
    id: 'INV-2026-002',
    customer: 'Lazada Logistics',
    amount: 82400000,
    currency: 'IDR',
    date: '02 May 2026',
    dueDate: '01 Jun 2026',
    status: 'Paid',
    category: 'Subscription'
  },
  {
    id: 'INV-2026-003',
    customer: 'Nestle Indonesia',
    amount: 210500000,
    currency: 'IDR',
    date: '25 Apr 2026',
    dueDate: '25 May 2026',
    status: 'Overdue',
    category: 'Usage'
  },
  {
    id: 'INV-2026-004',
    customer: 'Astra Honda Motor',
    amount: 32000000,
    currency: 'IDR',
    date: '05 May 2026',
    dueDate: '04 Jun 2026',
    status: 'Draft',
    category: 'One-time'
  }
];

const statusColors: Record<string, string> = {
  'Published': 'bg-blue-50 text-blue-600 border-blue-200',
  'Paid': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Overdue': 'bg-rose-50 text-rose-600 border-rose-200',
  'Draft': 'bg-slate-50 text-slate-400 border-slate-200',
};

const BillingManagement: React.FC = () => {
  const [filter, setFilter] = useState('All');

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-emerald-600 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Financial Ops</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Revenue <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Stream</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Automated billing & payment reconciliation</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-600 transition-all shadow-sm">
            Revenue Report
          </button>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Issue Invoice
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Realized Revenue', value: 'IDR 4.82B', change: '+14.2%', icon: DollarSign, color: 'text-emerald-600' },
          { label: 'Total Outstanding', value: 'IDR 1.24B', change: 'Urgent', icon: Clock, color: 'text-amber-600' },
          { label: 'Tax Liability', value: 'IDR 530.2M', change: 'PPN 11%', icon: Receipt, color: 'text-indigo-600' },
          { label: 'Completion Rate', value: '94.8%', change: 'Optimal', icon: CheckCircle2, color: 'text-blue-600' },
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

      {/* Invoice Ledger */}
      <div className="bg-white border border-slate-200 rounded-[4rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
            {['All', 'Paid', 'Published', 'Overdue', 'Draft'].map((v) => (
              <button 
                key={v}
                onClick={() => setFilter(v)}
                className={cn(
                  "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  filter === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="SEARCH BY INVOICE ID OR CUSTOMER..."
              className="pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none w-80 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-12 py-8">Billing Entity</th>
                <th className="px-8 py-8">Invoice Protocol</th>
                <th className="px-8 py-8">Issue & Due Date</th>
                <th className="px-8 py-8 text-right">Total Amount</th>
                <th className="px-8 py-8">Lifecycle State</th>
                <th className="px-12 py-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_INVOICES.filter(i => filter === 'All' || i.status === filter).map((invoice) => (
                <tr key={invoice.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                         <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900 tracking-tight leading-none mb-1.5">{invoice.customer}</p>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{invoice.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-10">
                    <span className="font-mono text-sm font-bold text-slate-900">{invoice.id}</span>
                  </td>
                  <td className="px-8 py-10">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-black text-slate-900 text-slate-600">{invoice.date}</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Due: {invoice.dueDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-10 text-right">
                    <div className="flex flex-col">
                       <span className="text-base font-black text-slate-900 tracking-tight">{invoice.currency} {invoice.amount.toLocaleString()}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incl. PPN 11%</span>
                    </div>
                  </td>
                  <td className="px-8 py-10">
                    <span className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-2",
                      statusColors[invoice.status]
                    )}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="relative inline-block">
                       <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                          <MoreHorizontal className="w-5 h-5" />
                       </button>
                    </div>
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

export default BillingManagement;
