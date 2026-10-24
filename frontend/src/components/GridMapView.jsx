import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Radio,
  Plus,
  Minus,
  Crosshair,
  Layers,
  ArrowRight,
  ShieldAlert,
  Flame,
  Activity,
  Zap
} from 'lucide-react';

export default function GridMapView({ telemetry, isDegraded, onOpenFailoverModal }) {
  const [zoom, setZoom] = useState(1);
  const [activeZone, setActiveZone] = useState('ALL');

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-mono tracking-tight">
                Regional Grid Telemetry Map
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                400/132/33 kV High-Voltage Regional Transmission Topography
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            {['ALL', 'NORTH', 'EAST', 'SOUTH', 'WEST'].map(z => (
              <button
                key={z}
                onClick={() => setActiveZone(z)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeZone === z
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Fullscreen Grid Map Card */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md p-6 relative overflow-hidden">
        
        <div className="relative w-full h-[520px] rounded-xl bg-[#020617] border border-slate-800/80 overflow-hidden flex items-center justify-center">
          
          {/* Cyber Grid */}
          <div className="absolute inset-0 bg-cyber-grid opacity-35" />

          {/* SVG Map Canvas */}
          <svg viewBox="0 0 900 500" className="w-full h-full select-none">
            
            {/* Zone Boundaries */}
            <rect x="40" y="40" width="380" height="200" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" rx="12" />
            <text x="55" y="65" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">
              ZONE A: NORTH REGIONAL RING (400 kV)
            </text>

            <rect x="480" y="40" width="380" height="200" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" rx="12" />
            <text x="495" y="65" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">
              ZONE B: EAST INDUSTRIAL SECTOR (132 kV)
            </text>

            <rect x="180" y="270" width="540" height="190" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" rx="12" />
            <text x="195" y="295" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">
              ZONE C: SOUTH METRO LOAD CENTERS (33/11 kV)
            </text>

            {/* Transmission Traces */}
            <line x1="200" y1="140" x2="450" y2="120" stroke="#06b6d4" strokeWidth="3" opacity="0.7" />
            <line x1="450" y1="120" x2="680" y2="130" stroke="#06b6d4" strokeWidth="3" opacity="0.7" />
            
            {/* Faulted Feeder path to T-248 */}
            <line
              x1="450"
              y1="120"
              x2="450"
              y2="340"
              stroke={isDegraded ? "#ef4444" : "#06b6d4"}
              strokeWidth={isDegraded ? "3.5" : "2"}
              strokeDasharray={isDegraded ? "6 4" : "none"}
              className={isDegraded ? "animate-conduit" : ""}
            />

            <line x1="450" y1="340" x2="300" y2="380" stroke="#10b981" strokeWidth="2.5" opacity="0.8" />
            <line x1="450" y1="340" x2="600" y2="380" stroke="#10b981" strokeWidth="2.5" opacity="0.8" />

            {/* Substation Nodes */}
            {/* North 400kV Hub */}
            <g transform="translate(200, 140)">
              <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="8" fill="#06b6d4" />
              <text x="0" y="-28" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                S-400 NORTH HUB
              </text>
            </g>

            {/* East Substation S-102 */}
            <g transform="translate(680, 130)">
              <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <circle cx="0" cy="0" r="6" fill="#10b981" />
              <text x="0" y="-26" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                S-102 (132 kV)
              </text>
            </g>

            {/* Central Junction */}
            <g transform="translate(450, 120)">
              <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="9" fill="#06b6d4" />
              <text x="0" y="-30" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                CENTRAL SWITCHING TERMINAL
              </text>
            </g>

            {/* TARGET UNIT: T-248 */}
            <g transform="translate(450, 340)" className="cursor-pointer" onClick={onOpenFailoverModal}>
              {isDegraded ? (
                <>
                  <circle cx="0" cy="0" r="36" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" opacity="0.6" />
                  <circle cx="0" cy="0" r="24" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="3" />
                  <rect x="-14" y="-14" width="28" height="28" fill="#ef4444" rx="4" />
                </>
              ) : (
                <>
                  <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                  <rect x="-12" y="-12" width="24" height="24" fill="#10b981" rx="4" />
                </>
              )}

              {/* Callout Tag */}
              <g transform="translate(38, -32)">
                <rect x="0" y="0" width="200" height="54" rx="8" fill="#0f172a" stroke={isDegraded ? "#ef4444" : "#10b981"} strokeWidth="1.5" />
                <text x="12" y="20" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  Transformer T-248
                </text>
                <text x="12" y="35" fill={isDegraded ? "#f87171" : "#34d399"} fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {isDegraded ? 'STATUS: CRITICAL FAILOVER' : 'STATUS: OPTIMAL RUNNING'}
                </text>
                <text x="12" y="47" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  Click to launch NetworkX Failover Interlock
                </text>
              </g>
            </g>

            {/* Load Feeders */}
            <g transform="translate(300, 380)">
              <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="0" y="26" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">Feeder 1 (Crit)</text>
            </g>

            <g transform="translate(600, 380)">
              <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="0" y="26" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">Feeder 2 (Comm)</text>
            </g>

          </svg>

          {/* Compass Rose */}
          <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="font-bold text-cyan-400">&uarr; NORTH</span>
            <span className="text-slate-500">GIS 400kV GRID</span>
          </div>

          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5">
            <button
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center justify-center text-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.7, z - 0.1))}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center justify-center text-sm"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
