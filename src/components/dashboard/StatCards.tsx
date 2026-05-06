import React from 'react';
import { Truck, FileCheck, DollarSign, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency } from '../../lib/utils';

const stats = [
  { label: 'Active Shipments', value: '1,284', trend: '+12%', icon: Truck, color: 'blue' },
  { label: 'Pending Contracts', value: '42', trend: '-2.4%', icon: FileCheck, color: 'amber' },
  { label: 'Revenue MTD', value: 452800000, isCurrency: true, trend: '+8.1%', icon: DollarSign, color: 'emerald' },
  { label: 'Inv Utilization', value: '82%', trend: '+4%', icon: Package, color: 'indigo' },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className={cn(
              "p-3 rounded-2xl bg-slate-50 transition-all duration-300 group-hover:scale-110",
              stat.color === 'blue' && "text-blue-600",
              stat.color === 'amber' && "text-amber-600",
              stat.color === 'emerald' && "text-emerald-600",
              stat.color === 'indigo' && "text-indigo-600",
            )}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              stat.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"
            )}>
              {stat.trend}
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tight mb-1">
              {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
