import React, { useState } from 'react';
import { STAGES } from '../stagesData.js';

export default function PastCallsScreen({ calls, onRefresh, isLoading, onViewCallDetails }) {
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

  const getStageName = (stageNumber) => {
    const stage = STAGES.find((s) => s.stage_number === stageNumber);
    return stage ? stage.name : `Stage ${stageNumber}`;
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 text-zinc-900">
      
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Past calls
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Where your cold calls ended and what was agreed.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs text-zinc-500 hover:text-zinc-900 transition"
        >
          {isLoading ? 'refreshing...' : 'refresh list'}
        </button>
      </div>

      {/* Calls List (Exact Reference Screen formatting) */}
      {!calls || calls.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-400">
          No saved calls yet. Start your first call to see it recorded here.
        </div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {calls.map((call) => {
            const isExpanded = expandedCallId === call.id;
            const fullCall = callDetailsMap[call.id];

            return (
              <div
                key={call.id}
                className="py-4 space-y-1 hover:bg-zinc-50/50 rounded-lg px-2 -mx-2 transition cursor-pointer"
                onClick={() => toggleExpand(call.id)}
              >
                {/* Line 1: Prospect & Company */}
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
                    {call.prospect_name}, {call.company}
                  </h3>
                </div>

                {/* Line 2: One-line Summary */}
                <p className="text-sm text-zinc-700 leading-snug">
                  {call.summary || 'Call logged.'}
                </p>

                {/* Line 3: Stage Reached · Timestamp */}
                <div className="flex items-center gap-2 text-xs text-zinc-400 pt-0.5 font-medium">
                  <span>{getStageName(call.last_stage || 1)}</span>
                  <span>·</span>
                  <span>{formatCallTime(call.started_at)}</span>
                  {call.outcome && (
                    <>
                      <span>·</span>
                      <span className="capitalize">{call.outcome.replace(/_/g, ' ')}</span>
                    </>
                  )}
                </div>

                {/* Expandable audit notes */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                    <div className="font-semibold text-zinc-700">Stage breakdown:</div>
                    {fullCall?.stages && fullCall.stages.length > 0 ? (
                      <div className="space-y-1.5 pl-2 border-l border-zinc-200">
                        {fullCall.stages.map((stg) => (
                          <div key={stg.stage_number} className="space-y-0.5">
                            <span className="font-medium text-zinc-900">
                              Stage {stg.stage_number} ({getStageName(stg.stage_number)}):
                            </span>{' '}
                            <span>{stg.what_happened}</span>
                            {stg.prospect_words && (
                              <p className="italic text-zinc-500 pl-2">
                                “{stg.prospect_words}”
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="italic text-zinc-400">Loading notes...</div>
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
