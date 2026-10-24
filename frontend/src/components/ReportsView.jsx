import React from 'react';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function ReportsView({ telemetry }) {
  const reports = [
    {
      id: 'REP-01',
      title: 'T-248 Transformer Health & Dielectric Assessment (CHI Audit)',
      date: 'Today, 11:00 UTC',
      size: '2.4 MB PDF',
      badge: 'Official SCADA Audit'
    },
    {
      id: 'REP-02',
      title: 'NetworkX Grid Contingency & 33kV Interlock Switching Plan',
      date: 'Today, 10:45 UTC',
      size: '1.8 MB PDF',
      badge: 'Interlock Sequence'
    },
    {
      id: 'REP-03',
      title: 'Real-Time SCADA Historian 200-Tick Raw Telemetry Stream (CSV)',
      date: 'Today, 10:30 UTC',
      size: '480 KB CSV',
      badge: 'Raw Sensor Telemetry'
    },
    {
      id: 'REP-04',
      title: 'Quarterly Utility Transformer Spares Logistics & Fleet Readiness',
      date: '15 Oct 2026',
      size: '3.6 MB PDF',
      badge: 'Inventory Audit'
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono tracking-tight">
              SCADA Historian &amp; Compliance Reports
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Export official IEEE C57.104 diagnostics, contingency failover plans, and telemetry logs.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Downloading all official SCADA reports package...")}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-neon-cyan transition active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Export All Compliance Reports</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden divide-y divide-slate-800/80 font-mono text-xs">
        {reports.map((r) => (
          <div key={r.id} className="p-4.5 hover:bg-slate-800/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    {r.badge}
                  </span>
                  <span className="text-slate-500">{r.date}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{r.size}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-sans">{r.title}</h4>
              </div>
            </div>

            <button
              onClick={() => alert(`Downloading: ${r.title}`)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-mono text-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
