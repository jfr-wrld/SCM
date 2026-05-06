import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Shield, 
  User, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Edit2, 
  Trash2, 
  MoreHorizontal,
  ChevronRight,
  Fingerprint,
  Globe,
  Settings,
  Mail,
  MoreVertical,
  Key,
  Users,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Operations Manager' | 'Sales' | 'Finance' | 'Driver' | 'Viewer';
  status: 'Active' | 'Pending' | 'Suspended';
  avatar?: string;
  lastLogin: string;
}

const MOCK_TEAM: TeamMember[] = [
  {
    id: 'USR-101',
    name: 'Andi Pratama',
    email: 'andi.p@logitrack.com',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: '10 mins ago'
  },
  {
    id: 'USR-102',
    name: 'Sarah Johnson',
    email: 's.johnson@logitrack.com',
    role: 'Operations Manager',
    status: 'Active',
    lastLogin: '2 hours ago'
  },
  {
    id: 'USR-103',
    name: 'Budi Santoso',
    email: 'budi.s@logitrack.com',
    role: 'Sales',
    status: 'Active',
    lastLogin: 'Yesterday'
  },
  {
    id: 'USR-104',
    name: 'Jessica Wong',
    email: 'j.wong@logitrack.com',
    role: 'Finance',
    status: 'Pending',
    lastLogin: 'Never'
  }
];

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-indigo-50 text-indigo-600 border-indigo-200',
  'Operations Manager': 'bg-blue-50 text-blue-600 border-blue-200',
  'Sales': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Finance': 'bg-amber-50 text-amber-600 border-amber-200',
  'Driver': 'bg-slate-50 text-slate-500 border-slate-200',
  'Viewer': 'bg-slate-50 text-slate-400 border-slate-100',
};

const TeamManagement: React.FC = () => {
  const [filter, setFilter] = useState('All');

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-indigo-600 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Access & Security</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Governance</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Identity management & role-based access control</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all shadow-sm">
            Security Audit
          </button>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Standardized Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Members', value: '42', change: '+2 new', icon: Users, color: 'text-indigo-600' },
          { label: 'Online Now', value: '18', change: 'Live Access', icon: Activity, color: 'text-emerald-600' },
          { label: 'Pending Invites', value: '4', change: 'Awaiting', icon: Mail, color: 'text-amber-600' },
          { label: 'Admin Roles', value: '5', change: 'Privileged', icon: ShieldCheck, color: 'text-blue-600' },
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left - Team List */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white border border-slate-200 rounded-[3rem] p-4 shadow-sm">
              <div className="relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="SEARCH TEAM MEMBERS BY NAME OR EMAIL..."
                   className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none placeholder:text-slate-300"
                 />
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                   <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      <th className="px-10 py-8">Identity</th>
                      <th className="px-8 py-8">Authorization Role</th>
                      <th className="px-8 py-8">Status</th>
                      <th className="px-8 py-8">Audit Log</th>
                      <th className="px-10 py-8 text-right">Gate Operations</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {MOCK_TEAM.map(member => (
                     <tr key={member.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center text-sm font-black text-slate-500 border border-slate-200 overflow-hidden">
                                 {member.avatar ? <img src={member.avatar} alt="" /> : member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                 <p className="text-[15px] font-black text-slate-900 tracking-tight leading-none mb-1">{member.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{member.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                           <span className={cn(
                              "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-transparent",
                              roleColors[member.role]
                           )}>
                              {member.role}
                           </span>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex items-center gap-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full", member.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300')}></div>
                              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{member.status}</span>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Last Node Entry</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{member.lastLogin}</p>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                              <MoreVertical className="w-4.5 h-4.5" />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Right - Security Settings & RBAC Detail */}
        <div className="lg:col-span-4 space-y-10">
           <div className="bg-[#0a0c10] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute -right-32 -top-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                    <h4 className="text-xl font-black text-white tracking-tight uppercase">Security Health</h4>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                       <Fingerprint className="w-8 h-8 text-indigo-400" />
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">2FA Enforcement</p>
                          <div className="flex justify-between items-center">
                             <p className="text-sm font-black text-emerald-400">ACTIVATED</p>
                             <div className="w-8 h-4 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                                <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                       <Globe className="w-8 h-8 text-blue-400" />
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Login Geo-fencing</p>
                          <div className="flex justify-between items-center">
                             <p className="text-sm font-black text-slate-400">DISABLED</p>
                             <div className="w-8 h-4 bg-slate-700/50 rounded-full relative p-1 cursor-pointer">
                                <div className="absolute left-1 top-1 w-2 h-2 bg-slate-500 rounded-full"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-10">Permission Matrix</h4>
              <div className="space-y-8">
                 {[
                   { role: 'Super Admin', access: 'Full Root Access', p: 100 },
                   { role: 'Warehouse Ops', access: 'Node & Inventory Only', p: 45 },
                   { role: 'Fleet Manager', access: 'Vehicle & Driver Logic', p: 60 },
                   { role: 'Sales Lead', access: 'Contract Frameworks', p: 30 },
                 ].map((p, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">{p.role}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{p.access}</p>
                         </div>
                         <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-200">Configure</button>
                      </div>
                      <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${p.p}%` }}
                           className="h-full bg-indigo-600 rounded-full"
                         />
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-12 py-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-3 group">
                 Advanced Security Policy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
