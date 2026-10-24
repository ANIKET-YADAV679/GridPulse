import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewView from './components/OverviewView';
import GridMapView from './components/GridMapView';
import AssetsView from './components/AssetsView';
import AlertsView from './components/AlertsView';
import PredictionsView from './components/PredictionsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import FailoverModal from './components/FailoverModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // Default: Overview mission control
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [gridTopology, setGridTopology] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFailoverModalOpen, setIsFailoverModalOpen] = useState(false);
  const [isInterlockExecuting, setIsInterlockExecuting] = useState(false);
  const [signoffSuccess, setSignoffSuccess] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  // Initial fetch
  useEffect(() => {
    fetchInitialData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Polling loop when stream is active
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        advanceStep();
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const fetchInitialData = async () => {
    try {
      const [resCurrent, resTopology] = await Promise.all([
        fetch(`${API_BASE}/api/telemetry/current`),
        fetch(`${API_BASE}/api/grid/topology`)
      ]);
      const currentData = await resCurrent.json();
      const topoData = await resTopology.json();

      setTelemetry(currentData);
      setGridTopology(topoData);

      const resHist = await fetch(`${API_BASE}/api/telemetry/history?limit=30`);
      if (resHist.ok) {
        const histData = await resHist.json();
        setHistory(histData);
      } else {
        setHistory([currentData]);
      }
      setError(null);
    } catch (err) {
      console.warn('Backend connecting or offline:', err);
      setError('Backend API unreachable at ' + API_BASE + ' — Operating in standalone demo mode.');
      // Fallback baseline telemetry
      setTelemetry({
        step: 0,
        voltage_kv: 11.02,
        current_a: 248.5,
        thd_i: 2.65,
        temp_oti: 52.1,
        temp_wti: 64.3,
        delta_theta: 12.2,
        p_mw: 4.5,
        q_mvar: 1.2,
        q_p_ratio: 0.267,
        chi: 94.2,
        status: 'NORMAL',
        status_color: '#10b981',
        is_anomaly: false,
        anomaly_score: 0.124,
        interlock_executed: false
      });
    }
  };

  const advanceStep = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/telemetry/next`);
      if (!res.ok) throw new Error('API error on next step');
      const data = await res.json();
      setTelemetry(data);
      setHistory(prev => {
        const next = [...prev, data];
        return next.length > 30 ? next.slice(next.length - 30) : next;
      });
      fetchGridTopology();
      setError(null);
    } catch (err) {
      console.error('Error streaming telemetry:', err);
      setIsPlaying(false);
    }
  };

  const fetchGridTopology = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/grid/topology`);
      if (res.ok) {
        const data = await res.json();
        setGridTopology(data);
      }
    } catch (err) {
      console.error('Error fetching topology:', err);
    }
  };

  const handleInjectDegradation = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/simulation/fault-inject`, { method: 'POST' });
      const data = await res.json();
      setTelemetry(data.telemetry);
      setHistory(prev => [...prev.slice(-15), data.telemetry]);
      fetchGridTopology();
      setError(null);
    } catch (err) {
      console.error('Fault injection error:', err);
      // Local fallback
      setTelemetry(prev => ({
        ...prev,
        step: 157,
        voltage_kv: 10.42,
        current_a: 428.0,
        thd_i: 13.8,
        temp_oti: 81.2,
        temp_wti: 116.4,
        delta_theta: 35.2,
        p_mw: 4.45,
        q_mvar: 3.65,
        q_p_ratio: 0.82,
        chi: 38.6,
        status: 'CRITICAL',
        status_color: '#ef4444',
        is_anomaly: true,
        anomaly_score: -0.214,
        interlock_executed: false
      }));
    }
  };

  const handleReset = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/simulation/reset`, { method: 'POST' });
      const data = await res.json();
      setTelemetry(data.telemetry);
      setHistory([data.telemetry]);
      setSignoffSuccess(false);
      fetchGridTopology();
      setError(null);
    } catch (err) {
      console.error('Reset error:', err);
      setTelemetry(prev => ({
        ...prev,
        step: 0,
        voltage_kv: 11.02,
        current_a: 248.5,
        thd_i: 2.65,
        temp_oti: 52.1,
        temp_wti: 64.3,
        delta_theta: 12.2,
        p_mw: 4.5,
        q_mvar: 1.2,
        q_p_ratio: 0.267,
        chi: 94.2,
        status: 'NORMAL',
        status_color: '#10b981',
        is_anomaly: false,
        anomaly_score: 0.124,
        interlock_executed: false
      }));
      setSignoffSuccess(false);
    }
  };

  const handleExecuteInterlock = async () => {
    setIsInterlockExecuting(true);
    try {
      const res = await fetch(`${API_BASE}/api/failover/execute`, { method: 'POST' });
      if (res.ok) {
        await fetchGridTopology();
        const resCur = await fetch(`${API_BASE}/api/telemetry/current`);
        if (resCur.ok) {
          const curData = await resCur.json();
          setTelemetry(curData);
        }
      }
    } catch (err) {
      console.error('Execute interlock error:', err);
      setTelemetry(prev => ({ ...prev, interlock_executed: true }));
    } finally {
      setTimeout(() => {
        setIsInterlockExecuting(false);
      }, 500);
    }
  };

  const handleSignoffDispatch = async (operatorName) => {
    try {
      const ticketId = telemetry?.spare_dispatch?.ticket_id || 'GP-DISPATCH-TR01-EMERGENCY';
      const res = await fetch(`${API_BASE}/api/spares/signoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          operator_name: operatorName,
          notes: 'Emergency low-bed transporter authorized for replacement asset TX-SPARE-01'
        })
      });
      if (res.ok) {
        setSignoffSuccess(true);
      }
    } catch (err) {
      console.error('Signoff dispatch error:', err);
      setSignoffSuccess(true);
    }
  };

  const chi = telemetry ? Math.round(telemetry.chi) : 94;
  const isDegraded = chi < 60 || telemetry?.status === 'CRITICAL' || telemetry?.status === 'WARNING';

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex font-sans antialiased overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={isDegraded ? 4 : 3}
        isDegraded={isDegraded}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#020617]">
        
        {/* Top Header Bar */}
        <Header
          telemetry={telemetry}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onInjectDegradation={handleInjectDegradation}
          onReset={handleReset}
          isDegraded={isDegraded}
          onOpenFailoverModal={() => setIsFailoverModalOpen(true)}
        />

        {/* Backend Warning Banner if offline */}
        {error && (
          <div className="bg-amber-950/40 border-b border-amber-500/30 px-6 py-2 flex items-center justify-between text-xs font-mono text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchInitialData}
              className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Dynamic Main Views */}
        <main className="flex-1 overflow-y-auto pb-12">
          {activeTab === 'overview' && (
            <OverviewView
              telemetry={telemetry}
              history={history}
              isDegraded={isDegraded}
              onOpenFailoverModal={() => setIsFailoverModalOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'grid-map' && (
            <GridMapView
              telemetry={telemetry}
              isDegraded={isDegraded}
              onOpenFailoverModal={() => setIsFailoverModalOpen(true)}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsView
              telemetry={telemetry}
              isDegraded={isDegraded}
              onOpenFailoverModal={() => setIsFailoverModalOpen(true)}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              telemetry={telemetry}
              isDegraded={isDegraded}
              onOpenFailoverModal={() => setIsFailoverModalOpen(true)}
            />
          )}

          {activeTab === 'predictions' && (
            <PredictionsView
              telemetry={telemetry}
              isDegraded={isDegraded}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              telemetry={telemetry}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>

      </div>

      {/* Failover & Dispatch Modal */}
      <FailoverModal
        isOpen={isFailoverModalOpen}
        onClose={() => setIsFailoverModalOpen(false)}
        telemetry={telemetry}
        gridTopology={gridTopology}
        onExecuteInterlock={handleExecuteInterlock}
        onSignoffDispatch={handleSignoffDispatch}
        isExecuting={isInterlockExecuting}
        signoffSuccess={signoffSuccess}
      />

    </div>
  );
}
