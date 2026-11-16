import React from 'react';
import { Check } from 'lucide-react';

export default function StageNav({ stages, currentStageNumber, completedStages, onSelectStage }) {
  return (
    <div className="w-full bg-white border-b border-slate-200 px-4 py-2.5 shadow-2xs">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {stages.map((stage) => {
            const isCurrent = stage.stage_number === currentStageNumber;
            const isCompleted = completedStages[stage.stage_number] !== undefined;
            const isPast = stage.stage_number < currentStageNumber;

            return (
              <button
                key={stage.stage_number}
                onClick={() => onSelectStage(stage.stage_number)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    : isPast
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    : 'bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-slate-200/60'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-white text-emerald-800'
                      : isCompleted
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    stage.stage_number
                  )}
                </span>
                <span className="hidden sm:inline">
                  {stage.short_name || stage.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
