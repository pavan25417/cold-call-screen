import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { CALL_OUTCOMES, STAGES } from '../stagesData.js';

export default function EndCallModal({
  isOpen,
  onClose,
  activeCall,
  currentStageNumber,
  currentOutcome,
  currentWords,
  onConfirmClose
}) {
  const [selectedOutcome, setSelectedOutcome] = useState(
    currentStageNumber === 8 || currentStageNumber === 7 ? 'next_step_agreed' : 'follow_up'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [closedResult, setClosedResult] = useState(null);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedOutcome(
        currentStageNumber === 8 || currentStageNumber === 7 ? 'next_step_agreed' : 'follow_up'
      );
      setClosedResult(null);
    }
  }, [isOpen, currentStageNumber]);

  if (!isOpen) return null;

  const getStageName = (num) => {
    const s = STAGES.find((item) => item.stage_number === num);
    return s ? s.name : `Stage ${num}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await onConfirmClose({
        outcome: selectedOutcome,
        final_stage_number: currentStageNumber,
        what_happened: currentOutcome || 'Call concluded',
        prospect_words: currentWords || ''
      });
      setClosedResult(result);
    } catch (err) {
      alert(`Error closing call: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 w-full max-w-lg rounded-xl p-6 shadow-xl relative space-y-5 text-zinc-900">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              {closedResult ? 'Call summary recorded' : 'End call and record outcome'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {activeCall?.prospect_name} · {activeCall?.company}
            </p>
          </div>
          {!closedResult && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-700 transition p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Closed Success State */}
        {closedResult ? (
          <div className="space-y-4 py-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
              <span>
                Completed at Stage {closedResult.call?.last_stage || currentStageNumber} ({getStageName(closedResult.call?.last_stage || currentStageNumber)})
              </span>
            </div>

            {/* Generated Summary Display */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                One-Line Summary:
              </span>
              <p className="text-sm text-zinc-900 leading-relaxed font-medium">
                "{closedResult.summary || closedResult.call?.summary}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onClose('view_past')}
                className="flex-1 py-2 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition"
              >
                View in past calls
              </button>
              <button
                onClick={() => onClose('new_call')}
                className="flex-1 py-2 px-4 rounded-lg bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold border border-zinc-300 transition"
              >
                Start new call
              </button>
            </div>
          </div>
        ) : (
          /* Form to select outcome */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Stage Info */}
            <div className="flex items-center justify-between text-xs py-1.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg font-medium text-zinc-600">
              <span>Terminating stage:</span>
              <span className="font-bold text-zinc-900">
                Stage {currentStageNumber} of 8 · {getStageName(currentStageNumber)}
              </span>
            </div>

            {/* Outcome Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">
                Outcome
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-0.5">
                {CALL_OUTCOMES.map((outcome) => {
                  const isSelected = selectedOutcome === outcome.value;
                  return (
                    <button
                      key={outcome.value}
                      type="button"
                      onClick={() => setSelectedOutcome(outcome.value)}
                      className={`p-2.5 rounded-lg text-left border transition text-xs flex flex-col justify-between ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                          : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800'
                      }`}
                    >
                      <span className="font-semibold truncate">{outcome.label}</span>
                      <span className={`text-[10px] line-clamp-1 mt-0.5 font-normal ${
                        isSelected ? 'text-zinc-300' : 'text-zinc-500'
                      }`}>
                        {outcome.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quiet summary notice */}
            <p className="text-[11px] text-zinc-500 leading-normal">
              A one-line executive summary will be synthesized automatically from Stage 5 prospect notes and saved to the call record.
            </p>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedOutcome}
                className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving call...</span>
                  </>
                ) : (
                  <span>End call and save</span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
