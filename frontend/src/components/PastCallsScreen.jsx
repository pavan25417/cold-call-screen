import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { CALL_OUTCOMES, STAGES } from '../stagesData.js';

export default function PastCallsScreen({ calls, onRefresh, isLoading, onViewCallDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [expandedCallId, setExpandedCallId] = useState(null);
  const [callDetailsMap, setCallDetailsMap] = useState({});

  const formatCallTime = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) return `Today ${timeStr}`;

    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${timeStr}`;
  };

  const getOutcomeBadge = (outcomeValue) => {
    const outcome = CALL_OUTCOMES.find((o) => o.value === outcomeValue) || {
      label: outcomeValue || 'Not logged',
      color: 'slate'
    };

    const colorClasses = {
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      teal: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      red: 'bg-red-500/10 text-red-400 border-red-500/30',
      violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      slate: 'bg-slate-800 text-slate-400 border-slate-700'
    };

    return (
      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${colorClasses[outcome.color] || colorClasses.slate}`}>
        {outcome.label}
      </span>
    );
  };

  const getStageBadge = (stageNumber) => {
    const stage = STAGES.find((s) => s.stage_number === stageNumber);
    const stageName = stage ? stage.name : `Stage ${stageNumber}`;
    return (
      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
        Stage {stageNumber}: {stageName}
      </span>
    );
  };

  const toggleExpand = async (callId) => {
    if (expandedCallId === callId) {
      setExpandedCallId(null);
      return;
    }
    setExpandedCallId(callId);
    if (!callDetailsMap[callId] && onViewCallDetails) {
      try {
        const full = await onViewCallDetails(callId);
        setCallDetailsMap((prev) => ({ ...prev, [callId]: full }));
      } catch (err) {
        console.error('Failed to load call detail:', err);
      }
    }
  };

  const filteredCalls = (calls || []).filter((call) => {
    const matchesSearch =
      (call.prospect_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.summary || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOutcome = outcomeFilter === 'all' || call.outcome === outcomeFilter;
    return matchesSearch && matchesOutcome;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Past Calls</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {calls?.length || 0} calls logged
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real records showing where calls end, verbatim need statements, and AI summaries.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Calls</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by prospect, company, or need..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
          />
        </div>

        <div>
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none"
          >
            <option value="all">All Outcomes</option>
            {CALL_OUTCOMES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calls List */}
      {filteredCalls.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-300">No calls found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || outcomeFilter !== 'all'
              ? 'Try adjusting your search query or outcome filter.'
              : 'Start your first cold call to see it recorded here!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCalls.map((call) => {
            const isExpanded = expandedCallId === call.id;
            const fullCall = callDetailsMap[call.id];

            return (
              <div
                key={call.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition shadow-sm space-y-3"
              >
                {/* Header row: Prospect & Time */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {call.prospect_name}
                      <span className="text-slate-400 font-normal text-sm ml-2">
                        · {call.company}
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {formatCallTime(call.started_at)}
                    </span>
                  </div>
                </div>

                {/* AI Summary One-Liner */}
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                    {call.summary || 'Summary pending generation.'}
                  </p>
                </div>

                {/* Badges & Expand Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStageBadge(call.last_stage || 1)}
                    {getOutcomeBadge(call.outcome)}
                  </div>

                  <button
                    onClick={() => toggleExpand(call.id)}
                    className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide stage notes' : 'View stage notes'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Stage Log Accordion */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2.5 animate-in fade-in duration-200">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Stage-by-Stage Transcript Log
                    </h4>

                    {fullCall?.stages && fullCall.stages.length > 0 ? (
                      <div className="space-y-2">
                        {fullCall.stages.map((stg) => {
                          const stageInfo = STAGES.find((s) => s.stage_number === stg.stage_number);
                          return (
                            <div
                              key={stg.id || stg.stage_number}
                              className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between text-slate-400">
                                <span className="font-semibold text-emerald-400">
                                  Stage {stg.stage_number}: {stageInfo?.name || 'Stage'}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {stg.what_happened}
                                </span>
                              </div>
                              {stg.prospect_words && (
                                <p className="text-slate-300 font-normal italic pl-2 border-l-2 border-slate-700 mt-1">
                                  "{stg.prospect_words}"
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic py-2">
                        Loading detailed stage records from database...
                      </p>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
