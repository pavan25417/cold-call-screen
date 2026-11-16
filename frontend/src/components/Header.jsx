import React from 'react';

export default function Header({
  activeCall,
  callDuration,
  activeTab,
  setActiveTab,
  backendHealth,
  onStartNewCall,
  callsCount
}) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand & Call Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm tracking-tight text-zinc-900">
              Meridian
            </span>
            <span className="text-zinc-400 text-xs">·</span>
            <span className="text-xs text-zinc-500 font-normal">call guide</span>
          </div>

          {activeCall && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-600 pl-3 border-l border-zinc-200">
              <span className="font-medium text-zinc-900">{activeCall.prospect_name}</span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-500">{activeCall.company}</span>
            </div>
          )}
        </div>

        {/* Live Timer */}
        {activeCall && (
          <div className="font-mono text-xs font-medium text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
            {formatDuration(callDuration)}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50 text-xs">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-3 py-1 rounded-md transition font-medium ${
                activeTab === 'live'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Live call
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
                activeTab === 'past'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span>Past calls</span>
              {typeof callsCount === 'number' && (
                <span className="text-[11px] text-zinc-400">{callsCount}</span>
              )}
            </button>
          </div>

          {!activeCall && (
            <button
              onClick={onStartNewCall}
              className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition"
            >
              New call
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
