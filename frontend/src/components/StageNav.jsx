import React from 'react';

export default function StageNav({ stages, currentStageNumber, completedStages, onSelectStage }) {
  return (
    <div className="w-full bg-white border-b border-zinc-200/80 px-4 py-2.5">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        
        {/* Minimal 1 2 3 4 5 6 7 8 Stepper */}
        <div className="flex items-center gap-1 sm:gap-2">
          {stages.map((stage) => {
            const isCurrent = stage.stage_number === currentStageNumber;
            const isCompleted = completedStages[stage.stage_number] !== undefined;

            return (
              <button
                key={stage.stage_number}
                onClick={() => onSelectStage(stage.stage_number)}
                className={`w-7 h-7 rounded-md text-xs font-mono font-medium transition flex items-center justify-center ${
                  isCurrent
                    ? 'bg-zinc-900 text-white font-bold'
                    : isCompleted
                    ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200'
                    : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
                }`}
                title={`Stage ${stage.stage_number}: ${stage.name}`}
              >
                {stage.stage_number}
              </button>
            );
          })}
        </div>

        {/* Current Stage Indicator */}
        <div className="text-xs text-zinc-500 font-medium">
          Stage {currentStageNumber} of {stages.length}
        </div>

      </div>
    </div>
  );
}
