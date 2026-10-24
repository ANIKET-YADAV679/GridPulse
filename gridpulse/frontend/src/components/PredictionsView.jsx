import React from 'react';
import {
  Cpu,
  TrendingUp,
  Activity,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function PredictionsView({ telemetry, isDegraded }) {
  const forecastData = [
    { time: '12:00', load: 195, thermalRisk: 22, anomalyScore: 0.12 },
    { time: '14:00', load: 215, thermalRisk: 25, anomalyScore: 0.14 },
    { time: '16:00', load: 235, thermalRisk: 30, anomalyScore: 0.10 },
    { time: '18:00', load: isDegraded ? 255 : 240, thermalRisk: isDegraded ? 87 : 35, anomalyScore: isDegraded ? -0.22 : 0.08 },
    { time: '20:00', load: isDegraded ? 260 : 230, thermalRisk: isDegraded ? 92 : 32, anomalyScore: isDegraded ? -0.28 : 0.11 },
    { time: '22:00', load: isDegraded ? 245 : 210, thermalRisk: isDegraded ? 85 : 28, anomalyScore: isDegraded ? -0.20 : 0.15 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono tracking-tight">
              AI Predictive Intelligence &amp; Load Forecasting
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Unsupervised Machine Learning, Deep Thermal Forecasting &amp; GenAI Grid Explainability.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
          ISOLATION FOREST + TIME-SERIES PROPHET
        </span>
      </div>

      {/* Main Analytics Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recharts Multi-Variate Load & Thermal Risk (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Predictive Load &amp; Thermal Risk Divergence
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                Model Horizon: Next 12 Hours
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Load (MW)
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-0.5 bg-rose-500 inline-block" /> Thermal Risk %
              </span>
            </div>
          </div>

          <div className="h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 300]} stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />
                <Bar dataKey="load" name="Load (MW)" fill="#06b6d4" radius={[4, 4, 0, 0]} opacity={0.6} />
                <Line
                  type="monotone"
                  dataKey="thermalRisk"
                  name="Thermal Risk Index"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#ef4444' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Model Confidence: 94.6%</span>
            <span className="text-emerald-400">Gradient Boosting Calibrated</span>
          </div>
        </div>

        {/* Right: XAI Attribution Insights (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                XAI Attribution Weights
              </h3>
            </div>

            <div className="space-y-4 my-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Current Harmonic THD (σ_thd):</span>
                  <span className="text-cyan-400 font-bold">45% weight</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Thermal Gradient Δθ (σ_delta):</span>
                  <span className="text-rose-400 font-bold">35% weight</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-full w-[35%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Reactive Displacement (σ_qp):</span>
                  <span className="text-amber-400 font-bold">20% weight</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full w-[20%]" />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 leading-relaxed">
              {isDegraded ? (
                <span className="text-rose-300 font-bold">
                  AI Alert: Harmonic distortion is causing runaway thermal accumulation in T-248 winding insulation. Automated failover ready.
                </span>
              ) : (
                <span className="text-slate-400">
                  Normal Operation: No harmonic distortion detected. All temperature gradients are strictly inside IEEE nominal operating standards.
                </span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs font-mono text-slate-500">
            Composite Health Formula: CHI = 100 - &Sigma;(w_i &times; &sigma;_i)
          </div>
        </div>

      </div>

    </div>
  );
}
