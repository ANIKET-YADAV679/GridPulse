import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Flame,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function AlertsView({ telemetry, isDegraded, onOpenFailoverModal }) {
  const [filter, setFilter] = useState('ALL');

  const alerts = [
    {
      id: 'ALT-901',
      title: 'Transformer T-248 High Winding Temperature Hotspot (87°C)',
      severity: 'CRITICAL',
      asset: 'Transformer T-248 (Bay 01)',
      time: '1h ago',
      desc: 'Severe thermal divergence: WTI 114°C vs OTI 82°C (Δθ = 32°C). High risk of dielectric breakdown.',
      actionable: true
    },
    {
      id: 'ALT-902',
      title: 'Current Harmonic THD Exceeds IEEE 519 Standard (13.8%)',
      severity: 'CRITICAL',
      asset: 'Transformer T-248 (Bay 01)',
      time: '45m ago',
      desc: 'Non-linear load harmonic breakdown detected on secondary busbar A.',
      actionable: true
    },
    {
      id: 'ALT-903',
      title: 'Line L-103 Phase B Voltage Fluctuation Detected (±4.2%)',
      severity: 'WARNING',
      asset: 'Line L-103 (400 kV Corridor)',
      time: '3h ago',
      desc: 'Transient load surge causing sub-harmonic oscillatory resonance.',
      actionable: false
    },
    {
      id: 'ALT-904',
      title: 'T-112 Conservator Tank Oil Level Dropping (-8%)',
      severity: 'WARNING',
      asset: 'Transformer T-112 (East Sector)',
      time: '5h ago',
      desc: 'Slow valve seepage suspected. Maintenance dispatch team alerted.',
      actionable: false
    },
    {
      id: 'ALT-905',
      title: 'Substation S-102 Bus Synchronizer Calibrated',
      severity: 'RESOLVED',
      asset: 'Substation S-102',
      time: '12h ago',
      desc: 'Automatic synchro-check relay 25A verified operational.',
      actionable: false
    }
  ];

  const filtered = alerts.filter(a => {
    if (filter === 'CRITICAL' && a.severity !== 'CRITICAL') return false;
    if (filter === 'WARNING' && a.severity !== 'WARNING') return false;
    if (filter === 'RESOLVED' && a.severity !== 'RESOLVED') return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono tracking-tight">
              Incident Triage &amp; Alert Command
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Prioritized grid events, physics anomaly alarms, and protective relay triggers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'CRITICAL', 'WARNING', 'RESOLVED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                filter === f
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-neon-rose/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden divide-y divide-slate-800/80">
        {filtered.map(a => {
          let badgeClass = 'bg-slate-950 text-slate-400 border-slate-800';
          if (a.severity === 'CRITICAL') badgeClass = 'bg-rose-950 text-rose-400 border-rose-500/50 shadow-neon-rose/30';
          if (a.severity === 'WARNING') badgeClass = 'bg-amber-950 text-amber-400 border-amber-500/40';
          if (a.severity === 'RESOLVED') badgeClass = 'bg-emerald-950 text-emerald-400 border-emerald-500/40';

          return (
            <div key={a.id} className="p-4 hover:bg-slate-800/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${badgeClass}`}>
                  {a.severity === 'CRITICAL' ? <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" /> : <Clock className="w-5 h-5 text-amber-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1 font-mono">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeClass}`}>
                      {a.severity}
                    </span>
                    <span className="text-xs text-white font-bold">{a.asset}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{a.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 font-sans">{a.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-sans">{a.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center font-mono">
                {a.actionable ? (
                  <button
                    onClick={onOpenFailoverModal}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-rose-950"
                  >
                    <span>Failover Interlock</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
