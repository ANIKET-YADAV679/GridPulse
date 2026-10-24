import React, { useState } from 'react';
import {
  X,
  GitFork,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Truck,
  Check,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function FailoverModal({
  isOpen,
  onClose,
  telemetry,
  gridTopology,
  onExecuteInterlock,
  onSignoffDispatch,
  isExecuting = false,
  signoffSuccess = false
}) {
  if (!isOpen) return null;

  const isInterlockDone = telemetry?.interlock_executed || gridTopology?.interlock_executed;
  const [operatorSignoffName, setOperatorSignoffName] = useState('Aniket Yadav (Chief Operator)');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">
                  Autonomous Grid Failover &amp; Interlock Execution
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-500/40">
                  CRITICAL: T-248
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Target: Substation Bay-01 • NetworkX Topology Solver v3.7
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Contingency Assessment Summary */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Degrading Unit</span>
              <span className="text-rose-400 font-bold">Transformer T-248</span>
              <span className="text-slate-400 text-[11px] block">Load: 7.7 MVA (Fault)</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Backup Target</span>
              <span className="text-emerald-400 font-bold">Transformer T-249</span>
              <span className="text-slate-400 text-[11px] block">Headroom: 5.5 MVA avail</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Controlled Shedding</span>
              <span className="text-amber-400 font-bold">Feeder 2 (3.5 MVA)</span>
              <span className="text-slate-400 text-[11px] block">Non-critical commercial</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Rebalanced Load</span>
              <span className="text-cyan-400 font-bold">8.7 MVA (87% Safe)</span>
              <span className="text-slate-400 text-[11px] block">Within continuous rating</span>
            </div>
          </div>

          {/* Switching Sequence Steps */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
              Automated Interlock Switching Sequence
            </span>

            {[
              { step: 1, title: 'Trip Feeder 2 Breaker (CB_F2)', desc: 'Shed 3.5 MVA load to prevent overloading backup transformer T-249.' },
              { step: 2, title: 'Trip 33 kV HV Breaker (CB_HV_01)', desc: 'Isolate high-voltage primary supply to degraded transformer T-248.' },
              { step: 3, title: 'Trip 11 kV LV Breaker (CB_LV_01)', desc: 'Decouple secondary from 11 kV Busbar A.' },
              { step: 4, title: 'Bus-Dead & Synchro-Check Verification', desc: 'Interlock 25A confirm zero reverse backfeed on Bus A.' },
              { step: 5, title: 'Close Bus Tie-Breaker (TB_12)', desc: 'Transfer Bus A & critical Feeder 1 load to backup transformer T-249.' },
            ].map(s => (
              <div
                key={s.step}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono transition ${
                  isInterlockDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    isInterlockDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {s.step}
                  </span>
                  <div>
                    <h5 className="font-bold text-white">{s.title}</h5>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">{s.desc}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  isInterlockDone
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isInterlockDone ? 'EXECUTED' : 'READY'}
                </span>
              </div>
            ))}
          </div>

          {/* Emergency Spare Asset Dispatch Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white font-mono">
                    Emergency Spare Asset Match: TX-SPARE-01
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    100% SPEC MATCH
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  10 MVA • 33/11 kV • Dyn11 • Central Yard (28.5 km) • Transit ETA: 2.5h
                </p>
              </div>
            </div>

            <button
              onClick={() => onSignoffDispatch(operatorSignoffName)}
              disabled={signoffSuccess}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 shadow-lg ${
                signoffSuccess
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-neon-cyan'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{signoffSuccess ? 'Order Dispatched ✓' : 'Authorize Emergency Rig'}</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <span className="text-xs font-mono text-slate-500">
            Safety interlocks verified per IEEE C37.90
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-mono"
            >
              Close
            </button>

            <button
              onClick={onExecuteInterlock}
              disabled={isInterlockDone || isExecuting}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl transition active:scale-95 ${
                isInterlockDone
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-neon-amber'
              }`}
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Switching...</span>
                </>
              ) : isInterlockDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Interlock Sequence Active</span>
                </>
              ) : (
                <>
                  <GitFork className="w-4 h-4" />
                  <span>Execute Failover Interlock</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
