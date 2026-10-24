import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Gauge,
  Activity,
  SlidersHorizontal
} from 'lucide-react';

export default function TransformersView({ telemetry, onSelectAsset }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const liveChi = telemetry ? Math.round(telemetry.chi) : 42;
  const isCritical = liveChi < 60;

  const fleet = [
    {
      id: 'TR-017',
      name: 'TR-017 East Grid',
      substation: 'Power House A (Bay 04)',
      ratio: '66/11 kV',
      capacity: '25 MVA',
      chi: liveChi,
      status: isCritical ? 'CRITICAL' : 'HEALTHY',
      loadPct: telemetry ? Math.round((telemetry.current_a / 525) * 100) : 82,
      lastCheck: '2 mins ago',
      isActiveMonitored: true
    },
    {
      id: 'TR-018',
      name: 'TR-018 North Primary',
      substation: 'North Primary (Bay 01)',
      ratio: '33/11 kV',
      capacity: '15 MVA',
      chi: 92,
      status: 'HEALTHY',
      loadPct: 45,
      lastCheck: '10 mins ago',
      isActiveMonitored: false
    },
    {
      id: 'TR-019',
      name: 'TR-019 West Terminal',
      substation: 'Western Bay Hub',
      ratio: '66/11 kV',
      capacity: '20 MVA',
      chi: 88,
      status: 'HEALTHY',
      loadPct: 56,
      lastCheck: '14 mins ago',
      isActiveMonitored: false
    },
    {
      id: 'TR-020',
      name: 'TR-020 South Feeder',
      substation: 'South Hub Depot',
      ratio: '33/11 kV',
      capacity: '10 MVA',
      chi: 84,
      status: 'HEALTHY',
      loadPct: 62,
      lastCheck: '18 mins ago',
      isActiveMonitored: false
    },
    {
      id: 'TR-021',
      name: 'TR-021 Central Depot',
      substation: 'Power House A (Bay 02)',
      ratio: '33/11 kV',
      capacity: '12.5 MVA',
      chi: 71,
      status: 'WATCH',
      loadPct: 78,
      lastCheck: '25 mins ago',
      isActiveMonitored: false
    }
  ];

  const filteredFleet = fleet.filter(item => {
    if (filter !== 'ALL' && item.status !== filter) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.id.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">
              Transformers Fleet
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status, voltage ratio, and Composite Health Index across all substation bays.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['ALL', 'HEALTHY', 'WATCH', 'CRITICAL'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === f
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transformer name or tag..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredFleet.length} of {fleet.length} Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Asset ID &amp; Name</th>
                <th className="py-3 px-4">Substation Location</th>
                <th className="py-3 px-4">Specifications</th>
                <th className="py-3 px-4">Loading</th>
                <th className="py-3 px-4">Health (CHI)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredFleet.map((t) => {
                let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                if (t.status === 'CRITICAL') badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                if (t.status === 'WATCH') badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span>{t.name}</span>
                        {t.isActiveMonitored && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold tracking-tight">
                            LIVE SCADA
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {t.substation}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {t.ratio} • {t.capacity}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="flex items-center gap-2">
                        <span>{t.loadPct}%</span>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              t.loadPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${t.loadPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {t.chi} / 100
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badgeClass}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={onSelectAsset}
                        className="px-3 py-1 rounded-lg text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 font-semibold text-xs transition inline-flex items-center gap-1"
                      >
                        <span>Diagnostics</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
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
