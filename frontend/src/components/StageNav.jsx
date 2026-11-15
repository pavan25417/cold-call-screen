import React from 'react';
import { Check } from 'lucide-react';

export default function StageNav({ stages, currentStageNumber, completedStages, onSelectStage }) {
  return (
    <div className="w-full bg-slate-950/60 border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {stages.map((stage) => {
            const isCurrent = stage.stage_number === currentStageNumber;
            const isCompleted = completedStages[stage.stage_number] !== undefined;
            const isPast = stage.stage_number < currentStageNumber;

            return (
              <button
                key={stage.stage_number}
                onClick={() => onSelectStage(stage.stage_number)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 ring-2 ring-emerald-400/40'
                    : isCompleted
                    ? 'bg-slate-800/80 text-emerald-400 hover:bg-slate-800 border border-emerald-900/40'
                    : isPast
                    ? 'bg-slate-900/80 text-slate-400 hover:bg-slate-800/60 border border-slate-800'
                    : 'bg-slate-900/40 text-slate-600 hover:text-slate-400 border border-slate-900'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-white text-emerald-800'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    stage.stage_number
                  )}
                </span>
                <span className="hidden sm:inline font-medium">
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
