import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const shipmentData = [
  { name: 'May 01', shipments: 400 },
  { name: 'May 05', shipments: 300 },
  { name: 'May 10', shipments: 600 },
  { name: 'May 15', shipments: 800 },
  { name: 'May 20', shipments: 500 },
  { name: 'May 25', shipments: 900 },
  { name: 'May 30', shipments: 1100 },
];

const revenueData = [
  { name: 'Unilever', value: 4500 },
  { name: 'P&G', value: 3000 },
  { name: 'Samsung', value: 2000 },
  { name: 'Wilmar', value: 2780 },
  { name: 'Nestle', value: 1890 },
];

const COLORS = ['#2563eb', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="font-black text-slate-900 text-xl tracking-tight">Shipment Volume Trend</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Daily volume • May 2024</p>
          </div>
          <select className="text-[10px] font-black bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-4 focus:ring-blue-100 outline-none uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-all">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={shipmentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={15}
                fontFamily="inherit"
                fontWeight={800}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dx={-15}
                fontFamily="inherit"
                fontWeight={800}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', fontWeight: 900 }}
              />
              <Line 
                type="monotone" 
                dataKey="shipments" 
                stroke="#2563eb" 
                strokeWidth={5} 
                dot={{ r: 0 }} 
                activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5">
        <div className="mb-10">
          <h3 className="font-black text-slate-900 text-xl tracking-tight">Revenue by Customer</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Top Performers • Q2 2024</p>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#1e293b" 
                fontSize={12} 
                fontWeight={900}
                tickLine={false} 
                axisLine={false}
                fontFamily="inherit"
              />
              <Tooltip 
                 cursor={{ fill: '#f8fafc' }}
                 contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', fontWeight: 900 }}
              />
              <Bar dataKey="value" radius={[0, 16, 16, 0]} barSize={32}>
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
