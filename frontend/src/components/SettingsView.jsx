import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Shield,
  Save,
  Radio,
  CheckCircle2,
  Database
} from 'lucide-react';

export default function SettingsView() {
  const [streamInterval, setStreamInterval] = useState('1000');
  const [criticalChiThreshold, setCriticalChiThreshold] = useState('40');
  const [warningChiThreshold, setWarningChiThreshold] = useState('60');
  const [autoFailoverEnabled, setAutoFailoverEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1200px] mx-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono tracking-tight">
              SCADA Engine &amp; Mission Operations Settings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Telemetry ingest interval, autonomous contingency trip thresholds, and operator permissions.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-neon-cyan transition active:scale-95"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Configuration Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Telemetry & Ingestion */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Telemetry &amp; Historian Ingestion
            </h3>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1.5">
              Polling / Stream Refresh Interval (ms)
            </label>
            <input
              type="number"
              value={streamInterval}
              onChange={(e) => setStreamInterval(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Default: 1000ms (1-second IEEE SCADA stream)</span>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1.5">
              FastAPI Endpoint URL
            </label>
            <input
              type="text"
              readOnly
              value="http://localhost:8000"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Card 2: Health Thresholds */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Composite Health Index (CHI) Thresholds
            </h3>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1.5">
              Critical Failover Trigger Threshold (CHI &lt;)
            </label>
            <input
              type="number"
              value={criticalChiThreshold}
              onChange={(e) => setCriticalChiThreshold(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-rose-400 font-bold focus:outline-none focus:border-rose-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">CHI &lt; 40 initiates automated tie-breaker sequence</span>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1.5">
              Warning Alert Threshold (CHI &lt;)
            </label>
            <input
              type="number"
              value={warningChiThreshold}
              onChange={(e) => setWarningChiThreshold(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">CHI &lt; 60 triggers yellow stress warning</span>
          </div>
        </div>

      </div>

    </div>
  );
}
