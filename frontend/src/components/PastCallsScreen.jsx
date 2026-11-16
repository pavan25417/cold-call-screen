import React, { useState, useMemo } from 'react';
import { STAGES } from '../stagesData.js';
import { ChevronDown, ChevronRight, Calendar, Clock, Search, X, Filter } from 'lucide-react';

export default function PastCallsScreen({ calls, onRefresh, isLoading, onViewCallDetails }) {
  const [expandedCallId, setExpandedCallId] = useState(null);
  const [callDetailsMap, setCallDetailsMap] = useState({});

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

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

  // Extract unique dates for the date filter dropdown
  const availableDates = useMemo(() => {
    if (!calls || calls.length === 0) return [];
    const map = new Map();
    calls.forEach((c) => {
      const d = c.started_at ? new Date(c.started_at) : new Date(c.created_at || Date.now());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map.has(key)) {
        map.set(key, { key, dateObj: d });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.dateObj - a.dateObj);
  }, [calls]);

  // Filtered calls
  const filteredCalls = useMemo(() => {
    if (!calls) return [];
    return calls.filter((call) => {
      // Date filter
      if (dateFilter !== 'all') {
        const d = call.started_at ? new Date(call.started_at) : new Date(call.created_at || Date.now());
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (key !== dateFilter) return false;
      }

      // Stage filter
      if (stageFilter !== 'all') {
        const stg = call.last_stage || 1;
        if (String(stg) !== String(stageFilter)) return false;
      }

      // Search query (search name, company, summary, outcome)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = call.prospect_name?.toLowerCase().includes(q);
        const matchCompany = call.company?.toLowerCase().includes(q);
        const matchSummary = call.summary?.toLowerCase().includes(q);
        const matchOutcome = call.outcome?.toLowerCase().includes(q);
        if (!matchName && !matchCompany && !matchSummary && !matchOutcome) {
          return false;
        }
      }

      return true;
    });
  }, [calls, dateFilter, stageFilter, searchQuery]);

  const isFiltered = searchQuery.trim() !== '' || dateFilter !== 'all' || stageFilter !== 'all';

  // Group filtered calls by date and calculate descending call numbers per day (#N down to #1)
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

    const sortedGroups = Array.from(groupsMap.values()).sort((a, b) => b.dateObj - a.dateObj);

    return sortedGroups.map((group) => {
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

  const dateGroups = groupCallsByDate(filteredCalls);

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

      {/* Simple, Clean Filter & Search Bar */}
      <div className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prospect, company, notes..."
            className="w-full bg-white border border-zinc-200 focus:border-zinc-900 focus:outline-none rounded-lg pl-8 pr-7 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-white border border-zinc-200 focus:border-zinc-900 focus:outline-none rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 font-medium cursor-pointer"
        >
          <option value="all">All Dates ({calls?.length || 0})</option>
          {availableDates.map((d) => (
            <option key={d.key} value={d.key}>
              {formatDateHeader(d.dateObj)}
            </option>
          ))}
        </select>

        {/* Stage Filter */}
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="bg-white border border-zinc-200 focus:border-zinc-900 focus:outline-none rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 font-medium cursor-pointer"
        >
          <option value="all">All Stages (1-8)</option>
          {STAGES.map((s) => (
            <option key={s.stage_number} value={s.stage_number}>
              Stage {s.stage_number}: {s.name}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={() => {
              setSearchQuery('');
              setDateFilter('all');
              setStageFilter('all');
            }}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 px-2 py-1 transition whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Filter Stats Notice */}
      {isFiltered && (
        <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
          <span>Showing {filteredCalls.length} matching {filteredCalls.length === 1 ? 'call' : 'calls'}</span>
          <button
            onClick={() => {
              setSearchQuery('');
              setDateFilter('all');
              setStageFilter('all');
            }}
            className="text-zinc-400 hover:text-zinc-700 underline text-[11px]"
          >
            Reset view
          </button>
        </div>
      )}

      {/* Empty State */}
      {(!calls || calls.length === 0) ? (
        <div className="py-16 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
          No saved calls yet. Start your first call to see it recorded here.
        </div>
      ) : filteredCalls.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-200 rounded-xl space-y-2">
          <p>No past calls match your search or filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDateFilter('all');
              setStageFilter('all');
            }}
            className="text-xs font-semibold text-zinc-900 underline"
          >
            Clear all filters
          </button>
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
