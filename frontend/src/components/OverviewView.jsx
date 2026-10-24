import React, { useState } from 'react';
import {
  Activity,
  HeartPulse,
  Layers,
  Bell,
  Coins,
  Radio,
  Plus,
  Minus,
  Crosshair,
  Compass,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  Flame,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Database,
  Filter,
  Cpu,
  CheckCircle2,
  GitFork,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function OverviewView({
  telemetry,
  history = [],
  isDegraded = false,
  onOpenFailoverModal,
  setActiveTab
}) {
  // Stability graph time filter
  const [stabilityFilter, setStabilityFilter] = useState('24H');
  const [loadFilter, setLoadFilter] = useState('7 Days');
  const [mapZoom, setMapZoom] = useState(1);
  const [selectedMapNode, setSelectedMapNode] = useState('T-248');

  // Compute live health values based on telemetry
  const liveChi = telemetry ? Math.round(telemetry.chi) : (isDegraded ? 42 : 94);
  const healthScore = isDegraded ? Math.min(62, liveChi) : (liveChi >= 80 ? liveChi : 94);
  const activeAlertCount = isDegraded ? 4 : 3;

  // Stability graph data
  const stabilityData = history.length > 5
    ? history.slice(-24).map((h, i) => ({
        time: `${10 + Math.floor(i / 2)}:${(i % 2) * 30 || '00'}`,
        stability: Math.round(h.chi),
        temperature: Math.round(h.temp_wti)
      }))
    : [
        { time: '00:00', stability: 96, temperature: 64 },
        { time: '02:00', stability: 95, temperature: 65 },
        { time: '04:00', stability: 95, temperature: 64 },
        { time: '06:00', stability: 96, temperature: 65 },
        { time: '08:00', stability: 94, temperature: 67 },
        { time: '10:00', stability: 95, temperature: 68 },
        { time: '12:00', stability: 93, temperature: 71 },
        { time: '14:00', stability: isDegraded ? 68 : 94, temperature: isDegraded ? 88 : 72 },
        { time: '16:00', stability: isDegraded ? 52 : 94, temperature: isDegraded ? 104 : 73 },
        { time: '18:00', stability: isDegraded ? 41 : 95, temperature: isDegraded ? 116 : 70 },
        { time: '20:00', stability: isDegraded ? 39 : 94, temperature: isDegraded ? 118 : 68 },
        { time: '22:00', stability: isDegraded ? 42 : 95, temperature: isDegraded ? 117 : 66 },
      ];

  // Load Prediction vs Actual (7 Days MW)
  const loadComparisonData = [
    { date: '16 Oct', actual: 185, predicted: 180 },
    { date: '17 Oct', actual: 198, predicted: 192 },
    { date: '18 Oct', actual: 215, predicted: 210 },
    { date: '19 Oct', actual: 228, predicted: 220 },
    { date: '20 Oct', actual: 242, predicted: 238 },
    { date: '21 Oct', actual: 235, predicted: 240 },
    { date: '22 Oct', actual: isDegraded ? 248 : 224, predicted: 228 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto select-none">
      
      {/* =========================================================================
          SECTION 1: OPERATOR GREETING & EXECUTIVE KPI STRIP
      ========================================================================= */}
      <div className="flex flex-col gap-5">
        
        {/* Operator Greeting Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Good Afternoon, Aniket</span>
              <span className="text-xl">👋</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Here's what's happening with your grid today.
            </p>
          </div>

          {/* Quick Substation Status Tag */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              TELEMETRY: <strong className="text-cyan-400 font-semibold">1,248 SCADA CHANNELS</strong>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>LIVE FEED</span>
            </span>
          </div>
        </div>

        {/* 4 Executive KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Grid Health Score */}
          <div className={`p-4 rounded-2xl bg-slate-900/80 border transition-all duration-300 backdrop-blur-md shadow-xl ${
            isDegraded
              ? 'border-rose-500/50 shadow-neon-rose/30 bg-gradient-to-br from-rose-950/40 to-slate-900/90'
              : 'border-slate-800/80 hover:border-slate-700'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Grid Health Score
              </span>
              <div className={`p-2 rounded-xl flex items-center justify-center ${
                isDegraded
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-neon-emerald/30'
              }`}>
                <HeartPulse className="w-4 h-4" />
              </div>
            </div>

            <div className="my-2.5">
              <div className="text-3xl font-black font-mono tracking-tight text-white flex items-baseline gap-2">
                {healthScore}%
                <span className={`text-xs font-semibold font-sans flex items-center gap-0.5 ${
                  isDegraded ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {isDegraded ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  {isDegraded ? '↓ 32%' : '↑ 2%'}
                </span>
              </div>
              <p className={`text-[11px] font-medium mt-1 ${isDegraded ? 'text-rose-300 font-bold' : 'text-slate-400'}`}>
                {isDegraded ? 'Critical Degradation: T-248' : 'Stable & Optimal Operations'}
              </p>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isDegraded ? 'bg-rose-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          {/* Card 2: Assets Monitored */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Assets Monitored
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-neon-cyan/20">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <div className="my-2.5">
              <div className="text-3xl font-black font-mono tracking-tight text-white flex items-baseline gap-2">
                1,248
                <span className="text-xs font-semibold text-cyan-400 font-sans flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  ↑ 12%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                Transformers | Lines | Substations
              </p>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-cyan-400 w-[88%]" />
            </div>
          </div>

          {/* Card 3: Active Alerts */}
          <div className={`p-4 rounded-2xl bg-slate-900/80 border transition-all duration-300 backdrop-blur-md shadow-xl ${
            isDegraded
              ? 'border-rose-500/50 shadow-neon-rose/30 bg-gradient-to-br from-rose-950/30 to-slate-900/90'
              : 'border-slate-800/80 hover:border-slate-700'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Active Alerts
              </span>
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-neon-rose/20">
                <Bell className="w-4 h-4" />
              </div>
            </div>

            <div className="my-2.5">
              <div className="text-3xl font-black font-mono tracking-tight text-white flex items-baseline gap-2">
                {activeAlertCount}
                <span className={`text-xs font-semibold font-sans flex items-center gap-0.5 ${
                  isDegraded ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {isDegraded ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {isDegraded ? '↑ Critical' : '↓ 60%'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                {isDegraded ? '2 Critical Alarms | 2 Warnings' : '1 Critical | 2 Warnings'}
              </p>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isDegraded ? 'bg-rose-500 w-[75%]' : 'bg-amber-400 w-[35%]'
                }`}
              />
            </div>
          </div>

          {/* Card 4: Predicted Savings */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Predicted Savings
              </span>
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Coins className="w-4 h-4" />
              </div>
            </div>

            <div className="my-2.5">
              <div className="text-3xl font-black font-mono tracking-tight text-white flex items-baseline gap-2">
                ₹ 12.4 L
                <span className="text-xs font-semibold text-purple-400 font-sans flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  ↑ 18%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                vs. last 7 days predictive prevention
              </p>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-purple-400 w-[82%]" />
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION 2: COMMAND CENTER SPLIT VISUALIZERS (50/50 GRID)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CARD 1: Live Grid Map (Real-time Topology) - 6 cols */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-2xl backdrop-blur-md p-5 flex flex-col justify-between relative overflow-hidden group">
          
          {/* Header */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Live Grid Map
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Real-time
              </span>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative my-3 w-full h-80 rounded-xl bg-[#030712] border border-slate-800/70 overflow-hidden flex items-center justify-center">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-cyber-grid opacity-30" />

            {/* Regional Zones Overlays */}
            <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-600 uppercase font-bold tracking-wider">
              [North Zone • 400kV Ring]
            </div>
            <div className="absolute top-2 right-3 text-[10px] font-mono text-slate-600 uppercase font-bold tracking-wider">
              [East Zone • Heavy Industry]
            </div>
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-600 uppercase font-bold tracking-wider">
              [South Zone • Metro Hub]
            </div>
            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-600 uppercase font-bold tracking-wider">
              [West Zone • Hydro Incomer]
            </div>

            {/* SVG Regional Grid Topology */}
            <svg viewBox="0 0 540 320" className="w-full h-full select-none">
              
              {/* Transmission Lines (Buses) */}
              {/* Bus 1: North Substation to S-102 */}
              <line x1="120" y1="80" x2="270" y2="60" stroke="#06b6d4" strokeWidth="2.5" opacity="0.6" />
              <line x1="270" y1="60" x2="420" y2="100" stroke="#06b6d4" strokeWidth="2" opacity="0.6" />
              
              {/* Bus 2: Line to T-248 (Target Unit) */}
              <line
                x1="270"
                y1="60"
                x2="280"
                y2="175"
                stroke={isDegraded ? "#ef4444" : "#06b6d4"}
                strokeWidth={isDegraded ? "3" : "2"}
                strokeDasharray={isDegraded ? "5 4" : "none"}
                className={isDegraded ? "animate-conduit" : ""}
              />

              {/* Bus 3: T-248 to South Substations */}
              <line x1="280" y1="175" x2="160" y2="240" stroke="#10b981" strokeWidth="2" opacity="0.6" />
              <line x1="280" y1="175" x2="390" y2="250" stroke="#10b981" strokeWidth="2" opacity="0.6" />
              <line x1="160" y1="240" x2="390" y2="250" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Node 1: S-102 (Main North Substation) */}
              <g transform="translate(270, 60)">
                <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                <circle cx="0" cy="0" r="6" fill="#06b6d4" />
                <text x="0" y="-22" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  Substation S-102
                </text>
              </g>

              {/* Node 2: West Grid Incomer */}
              <g transform="translate(120, 80)">
                <circle cx="0" cy="0" r="12" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="4" fill="#10b981" />
                <text x="-16" y="4" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                  West-01
                </text>
              </g>

              {/* Node 3: East Hub S-077 */}
              <g transform="translate(420, 100)">
                <circle cx="0" cy="0" r="12" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="4" fill="#10b981" />
                <text x="18" y="4" fill="#64748b" fontSize="9" fontFamily="monospace">
                  S-077 (33kV)
                </text>
              </g>

              {/* Node 4: South Feeder 1 */}
              <g transform="translate(160, 240)">
                <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#10b981" />
                <text x="0" y="22" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  Load-F1
                </text>
              </g>

              {/* Node 5: South Feeder 2 */}
              <g transform="translate(390, 250)">
                <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#10b981" />
                <text x="0" y="22" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  Load-F2
                </text>
              </g>

              {/* TARGET NODE: Transformer T-248 (Crucial Highlight) */}
              <g transform="translate(280, 175)" className="cursor-pointer" onClick={onOpenFailoverModal}>
                
                {/* Animated radar rings when degraded */}
                {isDegraded ? (
                  <>
                    <circle cx="0" cy="0" r="28" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
                    <circle cx="0" cy="0" r="20" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="8" fill="#ef4444" />
                  </>
                ) : (
                  <>
                    <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <circle cx="0" cy="0" r="6" fill="#10b981" />
                  </>
                )}

                {/* Popover Callout Tag for T-248 */}
                <g transform="translate(32, -28)">
                  <rect
                    x="0"
                    y="0"
                    width="180"
                    height="50"
                    rx="8"
                    fill="#0f172a"
                    stroke={isDegraded ? "#ef4444" : "#06b6d4"}
                    strokeWidth="1.5"
                    className="shadow-2xl"
                  />
                  <text x="10" y="18" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    Transformer T-248
                  </text>
                  <text x="10" y="32" fill={isDegraded ? "#f87171" : "#34d399"} fontSize="9" fontWeight="bold" fontFamily="monospace">
                    {isDegraded ? 'STATUS: CRITICAL (THD 15%)' : 'STATUS: NOMINAL (94% CHI)'}
                  </text>
                  <text x="10" y="44" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                    {isDegraded ? 'Risk Score: 87% • Failover Ready' : 'Load: 250A • Temp: 64°C'}
                  </text>
                </g>
              </g>

            </svg>

            {/* Floating Sub-Card: North Region Health */}
            <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs font-mono flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">North Region</span>
                <span className="text-emerald-400 font-bold">Grid Health: 96%</span>
              </div>
              <div className="w-12 h-5 flex items-center">
                <svg viewBox="0 0 40 16" className="w-full h-full fill-none stroke-emerald-400 stroke-2">
                  <path d="M 0 12 L 8 10 L 16 12 L 24 6 L 32 8 L 40 4" />
                </svg>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              <button
                onClick={() => setMapZoom(z => Math.min(1.4, z + 0.1))}
                className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMapZoom(z => Math.max(0.8, z - 0.1))}
                className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center text-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMapZoom(1)}
                className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center text-xs"
                title="Reset Center"
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Footer status link */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span>Grid Incomer: 400 kV Synchronized</span>
            <button
              onClick={() => setActiveTab('grid-map')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>Explore Detailed Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 2: Satellite Substation View (Live Imagery) - 6 cols */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-2xl backdrop-blur-md p-5 flex flex-col justify-between relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Satellite View
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Live Imagery
              </span>
            </div>
          </div>

          {/* Satellite Aerial Container */}
          <div className="relative my-3 w-full h-80 rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center">
            
            {/* Dark Satellite Substation Yard Background Illustration */}
            <div className="absolute inset-0 opacity-40">
              <svg viewBox="0 0 600 400" className="w-full h-full">
                {/* Switchyard gravel texture and bay footprints */}
                <rect x="0" y="0" width="600" height="400" fill="#090e1a" />
                
                {/* Busbar structures */}
                <line x1="60" y1="80" x2="540" y2="80" stroke="#1e293b" strokeWidth="4" />
                <line x1="60" y1="120" x2="540" y2="120" stroke="#1e293b" strokeWidth="4" />
                <line x1="60" y1="160" x2="540" y2="160" stroke="#1e293b" strokeWidth="4" />

                {/* Transformer Bays Concrete Pads */}
                <rect x="180" y="190" width="80" height="100" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <rect x="340" y="190" width="80" height="100" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <rect x="80" y="190" width="60" height="80" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
                <rect x="460" y="190" width="60" height="80" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />

                {/* Control Room Building */}
                <rect x="230" y="310" width="140" height="70" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                <text x="300" y="350" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  CONTROL ROOM
                </text>
              </svg>
            </div>

            {/* Glowing Overlays */}
            <svg viewBox="0 0 600 400" className="w-full h-full relative z-10 select-none">
              
              {/* 400 kV Transmission Line pathing */}
              <path
                d="M 40 40 L 220 190"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-conduit"
                fill="none"
              />
              <path
                d="M 560 40 L 380 190"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                fill="none"
              />

              {/* Tag: 132/33 kV Substation (S-102) */}
              <g transform="translate(100, 50)">
                <rect x="0" y="0" width="150" height="24" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#06b6d4" strokeWidth="1" />
                <text x="75" y="16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  132/33 kV Substation (S-102)
                </text>
              </g>

              {/* Tag: 400 kV Transmission Line */}
              <g transform="translate(360, 50)">
                <rect x="0" y="0" width="170" height="24" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#06b6d4" strokeWidth="1" />
                <text x="85" y="16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  Transmission Line (400 kV)
                </text>
              </g>

              {/* Bay 01: Transformer T-248 (Target Highlight) */}
              <g transform="translate(220, 240)">
                {isDegraded ? (
                  <>
                    <circle cx="0" cy="0" r="32" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" opacity="0.5" />
                    <circle cx="0" cy="0" r="24" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="3" />
                    <rect x="-14" y="-14" width="28" height="28" fill="#ef4444" rx="4" />
                    <text x="0" y="38" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      T-248 (CRITICAL)
                    </text>
                  </>
                ) : (
                  <>
                    <circle cx="0" cy="0" r="22" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
                    <rect x="-12" y="-12" width="24" height="24" fill="#10b981" rx="4" />
                    <text x="0" y="36" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      T-248 (10 MVA)
                    </text>
                  </>
                )}
              </g>

              {/* Bay 02: Transformer T-249 (Healthy Backup) */}
              <g transform="translate(380, 240)">
                <circle cx="0" cy="0" r="22" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
                <rect x="-12" y="-12" width="24" height="24" fill="#10b981" rx="4" />
                <text x="0" y="36" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  T-249 (Backup Bay)
                </text>
              </g>

              {/* Tag: 33/11 kV Substation (S-077) */}
              <g transform="translate(210, 320)">
                <rect x="0" y="0" width="180" height="22" rx="5" fill="rgba(15, 23, 42, 0.85)" stroke="#475569" strokeWidth="1" />
                <text x="90" y="15" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  33/11 kV Substation (S-077)
                </text>
              </g>

            </svg>

            {/* Compass Rose */}
            <div className="absolute top-3 left-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 font-mono text-[10px] flex items-center gap-1">
              <span className="font-bold text-cyan-400">&uarr; N</span>
              <span className="text-slate-500">28°36'N 77°12'E</span>
            </div>

            {/* Satellite Map Legend */}
            <div className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[10px] font-mono flex items-center gap-3">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> 400 kV Line
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded bg-emerald-500 inline-block" /> Transformer
              </span>
              {isDegraded && (
                <span className="flex items-center gap-1 text-rose-400 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Thermal Outage
                </span>
              )}
            </div>

          </div>

          {/* Footer satellite details */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span>Resolution: 0.3m Sentinel Geo-Feed</span>
            <button
              onClick={onOpenFailoverModal}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>Inspect Asset T-248</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 3: OPERATIONAL ANALYTICS & TRIAGE STRIP (3-COLUMN GRID)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Grid Stability Trend (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-2xl backdrop-blur-md p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Grid Stability Trend
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Frequency &amp; Voltage Harmonization
              </p>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
              {['24H', '7D', '30D'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStabilityFilter(tab)}
                  className={`px-2 py-0.5 rounded transition ${
                    stabilityFilter === tab
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Smooth Area Graph */}
          <div className="h-56 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stabilityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanAreaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  formatter={(value) => [`${value}% Stability`, 'Index']}
                />
                <Area
                  type="monotone"
                  dataKey="stability"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cyanAreaGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Target: 95.0% Index</span>
            <span className="text-cyan-400 font-bold">Current: {healthScore}%</span>
          </div>
        </div>

        {/* Column 2: Top Alerts Triage (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-2xl backdrop-blur-md p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Top Alerts Triage
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Priority Incident Queue
              </p>
            </div>

            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Alert Cards */}
          <div className="space-y-2.5 my-3">
            
            {/* Alert 1: Critical T-248 */}
            <div
              onClick={onOpenFailoverModal}
              className="p-3 rounded-xl bg-slate-950/70 border border-rose-500/40 hover:border-rose-500 transition cursor-pointer flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/40">
                    CRITICAL
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">1h ago</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1 group-hover:text-rose-300 transition">
                  T-248 Transformer
                </h4>
                <p className="text-[11px] text-slate-400">
                  High temperature (87°C) • Hotspot gradient Δθ &gt; 31°C
                </p>
              </div>
            </div>

            {/* Alert 2: Warning Line L-103 */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/40 hover:border-amber-500 transition flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0 mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/40">
                    WARNING
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">3h ago</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1">
                  Line L-103 (400 kV)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Voltage fluctuation detected on phase B (±4.2%)
                </p>
              </div>
            </div>

            {/* Alert 3: Warning T-112 */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/40 hover:border-amber-500 transition flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0 mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/40">
                    WARNING
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">5h ago</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1">
                  T-112 Transformer
                </h4>
                <p className="text-[11px] text-slate-400">
                  Conservator oil level sensor dropping (-8%)
                </p>
              </div>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>SLA Response: Under 15m</span>
            <span className="text-emerald-400">All Handled</span>
          </div>
        </div>

        {/* Column 3: Predicted Load vs Actual (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-2xl backdrop-blur-md p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Predicted Load vs Actual
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                AI Demand Forecasting (MW)
              </p>
            </div>

            {/* Dropdown Filter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <span>{loadFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </div>
          </div>

          {/* Recharts Composite Chart */}
          <div className="h-56 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={loadComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[150, 260]} stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />
                <Bar dataKey="actual" name="Actual Load (MW)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="Predicted Load (MW)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#06b6d4' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-emerald-500 inline-block" /> Actual Load
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-0.5 border-t border-dashed border-cyan-400 inline-block" /> AI Predicted
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 4: AI EXPLAINABILITY (XAI) PIPELINE FOOTER
      ========================================================================= */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0b1120] to-slate-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
        
        {/* Banner Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 fill-current" />
              <h3 className="text-sm font-bold text-white font-mono tracking-tight">
                How GridPulse AI Works
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              From raw telemetry data to autonomous, human-verified grid resilience.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] font-bold self-start md:self-auto">
            END-TO-END XAI PIPELINE
          </span>
        </div>

        {/* 6-Step Workflow Pipeline connected by glowing arrows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
          
          {/* Step 1: Sensor Data */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between relative group hover:border-cyan-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs mb-2">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Sensor Data
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                IoT + SCADA (1s interval)
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 z-10" />
          </div>

          {/* Step 2: Data Validation */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between relative group hover:border-cyan-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs mb-2">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Validation
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Clean, Filter &amp; Physics Bounds
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 z-10" />
          </div>

          {/* Step 3: AI Prediction */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between relative group hover:border-cyan-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs mb-2">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                AI Prediction
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                ML + Isolation Forest
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 z-10" />
          </div>

          {/* Step 4: Explainability */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between relative group hover:border-cyan-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs mb-2">
              4
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Explainability
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                XAI Factor Attribution (CHI)
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 z-10" />
          </div>

          {/* Step 5: Recommendations */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between relative group hover:border-cyan-500/50 transition">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs mb-2">
              5
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                Recommendations
              </h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                NetworkX Switching Path
              </p>
            </div>
            <ArrowRight className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 z-10" />
          </div>

          {/* Step 6: Human Approved */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex flex-col justify-between relative group hover:border-emerald-400 transition">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs mb-2">
              6
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-300">
                Human Approved
              </h4>
              <p className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                Failover / Dispatch Sign-Off
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
