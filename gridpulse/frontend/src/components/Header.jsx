import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  Zap,
  RotateCcw,
  Bell,
  Radio,
  ShieldCheck,
  ShieldAlert,
  Flame,
  GitFork
} from 'lucide-react';

export default function Header({
  telemetry,
  isPlaying,
  setIsPlaying,
  onInjectDegradation,
  onReset,
  isDegraded = false,
  onOpenFailoverModal
}) {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      setTimeString(`${day} | ${time}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-[#020617]/90 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 select-none backdrop-blur-md">
      
      {/* Left: System Status & Clock */}
      <div className="flex items-center gap-5">
        
        {/* System Online Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${
            isDegraded ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'
          }`} />
          <span className={isDegraded ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
            {isDegraded ? 'Alert: Grid Stress' : 'System Online'}
          </span>
        </div>

        {/* Real-time Clock */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 border-l border-slate-800 pl-4">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">
            {timeString || '24 Oct 2026 | 11:15'}
          </span>
        </div>

        {/* Substation Breadcrumb Badge */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>REGION:</span>
          <span className="text-cyan-400 font-semibold">NORTH-ZONE GRID (400/132 kV)</span>
        </div>
      </div>

      {/* Right: Simulation Controls & User Profile */}
      <div className="flex items-center gap-4">
        
        {/* Simulation Controls Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-lg">
          
          {/* Stream Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause SCADA Telemetry Stream" : "Start Live SCADA Stream"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition active:scale-95 ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current text-cyan-400" />
                <span>Stream</span>
              </>
            )}
          </button>

          {/* Inject Critical Degradation Button */}
          <button
            onClick={onInjectDegradation}
            title="Inject Thermal & Harmonic Degradation on Transformer T-248"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/40 transition active:scale-95 shadow-neon-rose/40"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span className="hidden sm:inline">Inject Critical Degradation</span>
            <span className="sm:hidden">Fault</span>
          </button>

          {/* Reset Baseline */}
          <button
            onClick={onReset}
            title="Reset Simulation to Baseline Nominal State"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Failover Quick Access when Degraded */}
        {isDegraded && (
          <button
            onClick={onOpenFailoverModal}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-mono text-xs font-bold shadow-neon-amber animate-pulse"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Failover Interlock</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            title="Active Grid Alerts"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>
        </div>

        {/* User Profile Chip */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-neon-cyan">
            A
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-white leading-tight font-sans">
              Aniket Yadav
            </span>
            <span className="text-[10px] text-cyan-400 font-mono font-medium">
              Operator
            </span>
          </div>
        </div>

      </div>

    </header>
  );
}
