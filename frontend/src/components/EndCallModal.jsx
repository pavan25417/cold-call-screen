import React, { useState } from 'react';
import { 
  X, 
  PhoneOff, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  History, 
  PlusCircle, 
  AlertTriangle 
} from 'lucide-react';
import { CALL_OUTCOMES } from '../stagesData.js';

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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await onConfirmClose({
        outcome: selectedOutcome,
        final_stage_number: currentStageNumber,
        what_happened: currentOutcome || 'Call terminated at stage',
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <PhoneOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">End Call & Record Outcome</h3>
              <p className="text-xs text-slate-400">
                {activeCall?.prospect_name} · {activeCall?.company}
              </p>
            </div>
          </div>
          {!closedResult && (
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Closed Success State with AI Summary */}
        {closedResult ? (
          <div className="space-y-5 py-2">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-100 text-sm">Call Closed & Saved to Supabase</h4>
              <p className="text-xs text-slate-400">
                Reached Stage {closedResult.call?.last_stage || currentStageNumber} of 8
              </p>
            </div>

            {/* AI Generated Summary Display */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Generated One-Line Summary (Gemini)</span>
              </div>
              <p className="text-sm text-slate-200 font-medium leading-relaxed italic">
                "{closedResult.summary || closedResult.call?.summary}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose('view_past');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40"
              >
                <History className="w-4 h-4" />
                <span>View in Past Calls</span>
              </button>
              <button
                onClick={() => {
                  onClose('new_call');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start New Call</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form to select outcome */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-slate-400">
              <span>Terminating at Stage:</span>
              <span className="font-semibold text-slate-200">
                Stage {currentStageNumber} of 8
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Select Call Outcome (From Transcripts)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {CALL_OUTCOMES.map((outcome) => {
                  const isSelected = selectedOutcome === outcome.value;
                  return (
                    <button
                      key={outcome.value}
                      type="button"
                      onClick={() => setSelectedOutcome(outcome.value)}
                      className={`p-2.5 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/40'
                          : 'bg-slate-950/40 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="font-semibold truncate">{outcome.label}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {outcome.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Summary Notice */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-200 font-medium">Automatic Gemini 1-Line Summary:</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Backend will synthesize the prospect's words from Stage 5 and agreed next steps into a single sentence.
                </p>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedOutcome}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Summary & Closing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save & Generate AI Summary</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
