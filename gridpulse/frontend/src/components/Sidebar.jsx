import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Layers,
  Bell,
  Cpu,
  FileText,
  Settings,
  Zap,
  Leaf,
  ShieldAlert,
  Radio,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, alertCount = 3, isDegraded = false }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'grid-map', label: 'Grid Map', icon: MapPin },
    { id: 'assets', label: 'Assets', icon: Layers },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: alertCount.toString(),
      badgeColor: isDegraded
        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-neon-rose'
        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    { id: 'predictions', label: 'Predictions', icon: Cpu },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#020617]/95 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 select-none z-20 backdrop-blur-md">
      
      {/* Top Section */}
      <div className="p-4 flex flex-col gap-5 overflow-y-auto">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-start gap-3 px-1 pt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-neon-cyan flex-shrink-0">
            <div className="relative">
              <Zap className="w-5 h-5 fill-slate-950 stroke-slate-950 stroke-[2.5]" />
              <Zap className="w-3.5 h-3.5 fill-cyan-200 stroke-cyan-200 absolute -top-1 -right-1" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-white font-mono flex items-center gap-1">
                GridPulse
                <span className="text-cyan-400">AI</span>
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
              Detect Earlier. Explain Clearly. Fail Over Intelligently.
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-1">
            Mission Operations
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 via-cyan-500/10 to-transparent text-cyan-300 font-semibold border-l-2 border-cyan-400 shadow-neon-cyan/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Atmospheric Night-Transmission Footer Banner */}
      <div className="p-4 border-t border-slate-800/70">
        <div className="relative rounded-2xl p-4 overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900/90 to-[#020617] shadow-xl">
          {/* Background night transmission silhouette */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-cyan-400" strokeWidth="1">
              <path d="M 30 120 L 50 40 L 70 120 M 50 60 L 50 120" />
              <path d="M 50 40 L 150 40 M 50 70 L 150 70" strokeDasharray="3 3" />
              <path d="M 130 120 L 150 40 L 170 120 M 150 60 L 150 120" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                <Leaf className="w-3 h-3 text-emerald-400 fill-current" />
                <span>Net-Zero Grid</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                ACTIVE
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white leading-tight">
                Smarter Grids.
              </h4>
              <p className="text-xs font-bold text-emerald-400 leading-tight">
                A Cleaner Tomorrow.
              </p>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
              Autonomous dynamic reactive optimization reducing transmission line loss by 14.2%.
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}
