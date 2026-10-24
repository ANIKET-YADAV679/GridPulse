import React, { useState } from 'react';
import {
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Zap,
  Activity,
  Filter
} from 'lucide-react';

export default function AssetsView({ telemetry, isDegraded, onOpenFailoverModal }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const liveChi = telemetry ? Math.round(telemetry.chi) : (isDegraded ? 42 : 94);

  const assets = [
    {
      id: 'T-248',
      name: 'Transformer T-248',
      type: 'Power Transformer',
      substation: 'North Zone Hub (Bay 01)',
      rating: '10 MVA • 33/11 kV',
      health: liveChi,
      status: isDegraded ? 'CRITICAL' : 'OPTIMAL',
      temp: telemetry ? telemetry.temp_wti.toFixed(1) + '°C' : (isDegraded ? '114.2°C' : '64.0°C'),
      load: telemetry ? `${Math.round((telemetry.current_a / 525) * 100)}%` : (isDegraded ? '82%' : '48%'),
      isTarget: true
    },
    {
      id: 'T-249',
      name: 'Transformer T-249',
      type: 'Backup Transformer',
      substation: 'North Zone Hub (Bay 02)',
      rating: '10 MVA • 33/11 kV',
      health: 96,
      status: 'OPTIMAL',
      temp: '58.5°C',
      load: '45% (Headroom: 5.5 MVA)',
      isTarget: false
    },
    {
      id: 'S-102',
      name: 'Substation S-102',
      type: '132/33 kV Gas Insulated Substation',
      substation: 'East Regional Transmission Terminal',
      rating: '150 MVA Capacity',
      health: 92,
      status: 'OPTIMAL',
      temp: '48.0°C',
      load: '64%',
      isTarget: false
    },
    {
      id: 'L-103',
      name: 'Line L-103',
      type: '400 kV Quad-Bundle Overhead Line',
      substation: 'North-East Intertie Corridor (42 km)',
      rating: '800 MW Thermal Limit',
      health: 78,
      status: 'WATCH',
      temp: '42.0°C',
      load: '71%',
      isTarget: false
    },
    {
      id: 'S-077',
      name: 'Substation S-077',
      type: '33/11 kV Distribution Substation',
      substation: 'South Metro Industrial Feeder Terminal',
      rating: '25 MVA Capacity',
      health: 89,
      status: 'OPTIMAL',
      temp: '51.2°C',
      load: '58%',
      isTarget: false
    }
  ];

  const filtered = assets.filter(a => {
    if (filter !== 'ALL' && a.status !== filter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono tracking-tight">
              Grid Assets &amp; SCADA Historian Register
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Physical inventory, continuous telemetry health metrics, and automated risk scoring.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'OPTIMAL', 'WATCH', 'CRITICAL'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Register Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
        
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search asset ID, tag, location..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-xl focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <span className="text-xs font-mono text-slate-400">
            REGISTER: {filtered.length} ACTIVE NODES
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Asset ID &amp; Model</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Substation Location</th>
                <th className="py-3 px-4">Ratings</th>
                <th className="py-3 px-4">Winding Temp</th>
                <th className="py-3 px-4">Health (CHI)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Interlock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((a) => {
                let badgeClass = 'bg-emerald-950 text-emerald-400 border-emerald-500/40';
                if (a.status === 'CRITICAL') badgeClass = 'bg-rose-950 text-rose-400 border-rose-500/50 shadow-neon-rose';
                if (a.status === 'WATCH') badgeClass = 'bg-amber-950 text-amber-400 border-amber-500/40';

                return (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span>{a.name}</span>
                        {a.isTarget && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[9px] font-bold border border-cyan-500/30">
                            LIVE TELEMETRY
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{a.type}</td>
                    <td className="py-3.5 px-4 text-slate-300">{a.substation}</td>
                    <td className="py-3.5 px-4 text-slate-400">{a.rating}</td>
                    <td className="py-3.5 px-4 text-slate-200">{a.temp}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{a.health}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${badgeClass}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {a.isTarget ? (
                        <button
                          onClick={onOpenFailoverModal}
                          className="px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs inline-flex items-center gap-1 transition"
                        >
                          <span>Simulate Failover</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs">Standard Telemetry</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
