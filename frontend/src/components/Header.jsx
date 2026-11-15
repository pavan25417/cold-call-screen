import React from 'react';
import { Phone, PhoneCall, History, Activity, ExternalLink, RefreshCw, PlusCircle } from 'lucide-react';

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
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Call Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-tight text-slate-100 flex items-center gap-1.5">
                Meridian Growth Partners
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Call Guide
                </span>
              </h1>
            </div>
            {activeCall ? (
              <p className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-slate-200">{activeCall.prospect_name}</span>
                <span className="text-slate-600">·</span>
                <span>{activeCall.company}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-500">Live Cold Call Progression Companion</p>
            )}
          </div>
        </div>

        {/* Live Call Timer (If on call) */}
        {activeCall && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono font-semibold text-sm tracking-wider">
              {formatDuration(callDuration)}
            </span>
          </div>
        )}

        {/* Navigation & Controls */}
        <div className="flex items-center gap-3">
          
          {/* Tabs */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Live Call</span>
              {activeCall && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'past'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Calls</span>
              {typeof callsCount === 'number' && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                  {callsCount}
                </span>
              )}
            </button>
          </div>

          {/* New Call button (When not currently in call) */}
          {!activeCall && (
            <button
              onClick={onStartNewCall}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Start Call</span>
            </button>
          )}

          {/* Backend Status indicator */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] font-mono ${
                backendHealth?.status === 'ok'
                  ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
                  : 'bg-amber-950/30 border-amber-800/40 text-amber-300'
              }`}
              title="Render backend health status"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendHealth?.status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                }`}
              />
              <span>{backendHealth?.status === 'ok' ? 'API Online' : 'Waking...'}</span>
              {backendHealth?.status !== 'ok' && (
                <button
                  onClick={onWakeBackend}
                  title="Ping Render health endpoint"
                  className="hover:text-white"
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
