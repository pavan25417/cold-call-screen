import React, { useState } from 'react';
import { STAGES } from '../stagesData.js';
import { ChevronDown, ChevronRight, Calendar, PhoneCall, CheckCircle2, Clock } from 'lucide-react';

export default function PastCallsScreen({ calls, onRefresh, isLoading, onViewCallDetails }) {
  const [expandedCallId, setExpandedCallId] = useState(null);
  const [callDetailsMap, setCallDetailsMap] = useState({});

  const getStageName = (stageNumber) => {
    const stage = STAGES.find((s) => s.stage_number === stageNumber);
    return stage ? stage.name : `Stage ${stageNumber}`;
  };

  const getStageBadgeStyle = (stageNumber) => {
    if (stageNumber >= 7) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
    }
    if (stageNumber >= 4) {
      return 'bg-zinc-100 text-zinc-800 border-zinc-200 font-semibold';
    }
    return 'bg-amber-50 text-amber-800 border-amber-200 font-semibold';
  };

  const formatDateHeader = (dateObj) => {
    const now = new Date();
    const isToday = dateObj.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = dateObj.toDateString() === yesterday.toDateString();

    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (isToday) return `Today · ${formattedDate}`;
    if (isYesterday) return `Yesterday · ${formattedDate}`;
    return formattedDate;
  };

  const formatCallTime = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Group calls by date and calculate descending call numbers per day (#N down to #1)
  const groupCallsByDate = (callsList) => {
    if (!callsList || callsList.length === 0) return [];

    const groupsMap = new Map();

    callsList.forEach((call) => {
      const dateObj = call.started_at ? new Date(call.started_at) : new Date(call.created_at || Date.now());
      const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

      if (!groupsMap.has(dateKey)) {
        groupsMap.set(dateKey, {
          dateKey,
          dateObj,
          calls: []
        });
      }
      groupsMap.get(dateKey).calls.push(call);
    });

    // Sort groups latest date first
    const sortedGroups = Array.from(groupsMap.values()).sort((a, b) => b.dateObj - a.dateObj);

    return sortedGroups.map((group) => {
      // Sort calls in that day from newest to oldest
      const sortedCalls = [...group.calls].sort((a, b) => {
        const timeA = new Date(a.started_at || a.created_at || 0).getTime();
        const timeB = new Date(b.started_at || b.created_at || 0).getTime();
        return timeB - timeA;
      });

      const totalInDay = sortedCalls.length;
      const callsWithDayNumber = sortedCalls.map((call, idx) => ({
        ...call,
        dayNumber: totalInDay - idx, // Descending order: #N, #N-1, ..., #1
        totalInDay
      }));

      return {
        dateKey: group.dateKey,
        dateObj: group.dateObj,
        totalCalls: totalInDay,
        calls: callsWithDayNumber
      };
    });
  };

  const dateGroups = groupCallsByDate(calls);

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
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-zinc-900">
      
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Past calls
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Log of cold calls, stage reached, and synthesized prospect agreements.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs text-zinc-500 hover:text-zinc-900 font-medium transition"
        >
          {isLoading ? 'refreshing...' : 'refresh list'}
        </button>
      </div>

      {/* Empty State */}
      {!calls || calls.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
          No saved calls yet. Start your first call to see it recorded here.
        </div>
      ) : (
        /* Date-wise Groups with Divisions */
        <div className="space-y-8">
          {dateGroups.map((group) => (
            <div key={group.dateKey} className="space-y-3">
              
              {/* Date-wise Division Header */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 tracking-tight">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{formatDateHeader(group.dateObj)}</span>
                </div>
                <div className="h-px bg-zinc-200 flex-1" />
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {group.totalCalls} {group.totalCalls === 1 ? 'call' : 'calls'}
                </span>
              </div>

              {/* Calls within this Date (Numbered in Descending Order) */}
              <div className="space-y-2.5">
                {group.calls.map((call) => {
                  const isExpanded = expandedCallId === call.id;
                  const fullCall = callDetailsMap[call.id];
                  const stageNum = call.last_stage || 1;
                  const stageName = getStageName(stageNum);

                  return (
                    <div
                      key={call.id}
                      onClick={() => toggleExpand(call.id)}
                      className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl p-4 transition cursor-pointer shadow-2xs space-y-2"
                    >
                      {/* Top Row: Call Number in Descending Order + Prospect/Company + Stage Highlight */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Descending Call Number relative to the day */}
                          <span 
                            title={`Call #${call.dayNumber} of ${call.totalInDay} on this date`}
                            className="font-mono text-xs font-bold text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded shrink-0"
                          >
                            #{call.dayNumber}
                          </span>

                          <h3 className="text-sm font-bold text-zinc-900 truncate">
                            {call.prospect_name}
                            <span className="text-zinc-500 font-normal ml-1.5 text-xs">
                              · {call.company}
                            </span>
                          </h3>
                        </div>

                        {/* Highlighted Stage Pill */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${getStageBadgeStyle(stageNum)}`}>
                            Stage {stageNum}: {stageName}
                          </span>
                        </div>
                      </div>

                      {/* Middle Row: One-Line Summary */}
                      <p className="text-xs text-zinc-800 leading-relaxed font-normal">
                        {call.summary || 'Call concluded and logged.'}
                      </p>

                      {/* Bottom Row: Date/Time Highlight + Outcome */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
                        <div className="flex items-center gap-2 font-medium">
                          {/* Highlighted Time */}
                          <span className="flex items-center gap-1 text-zinc-700 font-semibold bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>{formatCallTime(call.started_at)}</span>
                          </span>

                          {call.outcome && (
                            <>
                              <span className="text-zinc-300">·</span>
                              <span className="capitalize font-medium text-zinc-600">
                                {call.outcome.replace(/_/g, ' ')}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700">
                          <span>{isExpanded ? 'Hide stages' : 'Stage audit'}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </div>
                      </div>

                      {/* Expandable Stage Audit Breakdown */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                          <div className="font-semibold text-zinc-800 text-[11px] uppercase tracking-wider">
                            Full Stage Trail:
                          </div>
                          {fullCall?.stages && fullCall.stages.length > 0 ? (
                            <div className="space-y-2 pl-2 border-l-2 border-zinc-200">
                              {fullCall.stages.map((stg) => (
                                <div key={stg.stage_number} className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-zinc-900 text-xs">
                                      Stage {stg.stage_number} ({getStageName(stg.stage_number)}):
                                    </span>
                                    <span className="text-zinc-600 font-medium text-xs">
                                      {stg.what_happened}
                                    </span>
                                  </div>
                                  {stg.prospect_words && (
                                    <p className="italic text-zinc-700 pl-3 border-l border-zinc-200 text-xs">
                                      “{stg.prospect_words}”
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="italic text-zinc-400 text-xs py-1">Loading stage breakdown...</div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
