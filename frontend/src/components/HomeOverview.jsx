import React from 'react';
import {
  Layers,
  Activity,
  Gauge,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  GitFork,
  Wrench,
  Clock,
  Zap
} from 'lucide-react';

export default function HomeOverview({
  telemetry,
  setActiveTab
}) {
  const chi = telemetry ? Math.round(telemetry.chi) : 42;
  const isCritical = chi < 60;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      
      {/* 1. Welcome Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mb-1.5">
            Operational Overview
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
            Power House A — Substation Command
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time grid health monitoring, predictive maintenance and autonomous failover simulator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('health')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <span>View Asset Health</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Top Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Fleet Transformers</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mt-2">
            12
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            10 Nominal • 1 Watch • 1 Critical
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Average Fleet Health</span>
            <Gauge className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mt-2">
            84%
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Composite Index Target &gt; 80%
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Active Unit (TR-017)</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className={`text-3xl font-extrabold font-sans tracking-tight mt-2 ${
            isCritical ? 'text-rose-700' : 'text-emerald-800'
          }`}>
            {chi} CHI
          </div>
          <span className={`text-[11px] font-semibold mt-1 block ${
            isCritical ? 'text-rose-600' : 'text-emerald-700'
          }`}>
            {isCritical ? 'High Degradation Alert' : 'Normal Operation'}
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Failover Readiness</span>
            <GitFork className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight mt-2">
            100%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Substation B Ready (42% Headroom)
          </span>
        </div>

      </div>

      {/* 3. Operational Quick-Jump Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tile 1: Health Assessment */}
        <div
          onClick={() => setActiveTab('health')}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-emerald-300 transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
              Health Assessment
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Detailed Composite Health Index (CHI) physics scoring and unsupervised Isolation Forest anomaly telemetry.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Open Diagnostic View</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Tile 2: Grid Failover */}
        <div
          onClick={() => setActiveTab('failover')}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-emerald-300 transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
              Grid Failover Simulator
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              NetworkX topology solver simulating automated feeder transfer, controlled load shedding, and tie-breaker interlocks.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Simulate Switching</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Tile 3: Maintenance & Spares */}
        <div
          onClick={() => setActiveTab('maintenance')}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-emerald-300 transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
              Maintenance &amp; Spares
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Verify pre-service physical checklists, query compatible reserve transformers, and authorize emergency dispatch tickets.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Manage Inventory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

      </div>

    </div>
  );
}
