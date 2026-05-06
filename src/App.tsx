/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StatCards } from './components/dashboard/StatCards';
import { DashboardCharts } from './components/dashboard/Charts';
import { ContractList } from './components/contracts/ContractList';
import { ContractWizard } from './components/contracts/ContractWizard';
import { ContractDetail } from './components/contracts/ContractDetail';
import ShipmentManagement from './components/shipments/ShipmentManagement';
import WarehouseManagement from './components/warehouse/WarehouseManagement';
import FleetManagement from './components/fleet/FleetManagement';
import BillingManagement from './components/billing/BillingManagement';
import CustomerManagement from './components/customers/CustomerManagement';
import TeamManagement from './components/settings/TeamManagement';
import { Boxes, Truck, AlertTriangle } from 'lucide-react';

function DashboardHome() {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Enterprise Core</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Operations <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Overview</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Real-time logistics performance and contract tracking</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
            Generate Report
          </button>
        </div>
      </div>
      
      <StatCards />
      <DashboardCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Truck className="w-6 h-6 text-blue-600" />
              RECENT SHIPMENTS
            </h3>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All Activities</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-6 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900 tracking-tight">SHP-2024-8849{i}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">JKT → SUB • On Delivery</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Just now</p>
                  <span className="text-[9px] px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-black uppercase tracking-tighter">Priority</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              SYSTEM ALERTS
            </h3>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mark read</button>
          </div>
          <div className="space-y-4">
             <div className="p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex gap-4">
               <div className="w-10 h-10 bg-amber-200/50 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
                  <Boxes className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-sm font-black text-amber-900 tracking-tight mb-1 uppercase">Low Stock Threshold</p>
                  <p className="text-xs text-amber-700/80 font-medium">Warehouse WH-01: SKU-992288 (Samsung) is below threshold capacity.</p>
               </div>
             </div>
             <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex gap-4">
               <div className="w-10 h-10 bg-rose-200/50 rounded-xl flex items-center justify-center text-rose-700 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-sm font-black text-rose-900 tracking-tight mb-1 uppercase">Contract Expiration</p>
                  <p className="text-xs text-rose-700/80 font-medium">Wilmar Group master agreement expires in 3 days. Action required.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/contracts" element={<ContractList />} />
              <Route path="/contracts/new" element={<ContractWizard />} />
              <Route path="/contracts/edit/:id" element={<ContractWizard />} />
              <Route path="/contracts/:id" element={<ContractDetail />} />
              <Route path="/shipments" element={<ShipmentManagement />} />
              <Route path="/warehouse" element={<WarehouseManagement />} />
              <Route path="/fleet" element={<FleetManagement />} />
              <Route path="/billing" element={<BillingManagement />} />
              <Route path="/customers" element={<CustomerManagement />} />
              <Route path="/team" element={<TeamManagement />} />
              {/* Fallback for other routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

