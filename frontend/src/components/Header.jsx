import React from 'react';
import { Phone, PhoneCall, History, Activity, RefreshCw, PlusCircle, Volume2 } from 'lucide-react';

export default function Header({
  activeCall,
  callDuration,
  activeTab,
  setActiveTab,
  backendHealth,
  onWakeBackend,
  onStartNewCall,
  callsCount
}) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Call Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
            <PhoneCall className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                Meridian Growth Partners
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800 border border-emerald-300/60">
                  Call Guide
                </span>
              </h1>
            </div>
            {activeCall ? (
              <p className="text-xs text-slate-600 truncate flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-900">{activeCall.prospect_name}</span>
                <span className="text-slate-400">·</span>
                <span className="font-medium text-slate-600">{activeCall.company}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-500">Live Cold Call Progression Companion</p>
            )}
          </div>
        </div>

        {/* Live Call Timer (If on call) */}
        {activeCall && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span className="font-mono text-sm tracking-wider">
              {formatDuration(callDuration)}
            </span>
          </div>
        )}

        {/* Navigation & Controls */}
        <div className="flex items-center gap-3">
          
          {/* Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Live Call</span>
              {activeCall && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'past'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Calls</span>
              {typeof callsCount === 'number' && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
                  {callsCount}
                </span>
              )}
            </button>
          </div>

          {/* New Call button */}
          {!activeCall && (
            <button
              onClick={onStartNewCall}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Start Call</span>
            </button>
          )}

          {/* Backend Status indicator */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium ${
                backendHealth?.status === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
              title="Render backend health status"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendHealth?.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'
                }`}
              />
              <span>{backendHealth?.status === 'ok' ? 'API Online' : 'Waking...'}</span>
              {backendHealth?.status !== 'ok' && (
                <button
                  onClick={onWakeBackend}
                  title="Ping Render health endpoint"
                  className="hover:text-amber-900"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
