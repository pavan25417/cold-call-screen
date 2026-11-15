import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  PhoneOff, 
  MessageSquareQuote, 
  CheckCircle2, 
  Quote, 
  CornerDownLeft, 
  AlertCircle,
  Building2,
  UserCheck
} from 'lucide-react';

export default function LiveCallScreen({
  activeCall,
  currentStage,
  stages,
  savedStageData,
  onSaveAndNext,
  onPrevStage,
  onEndCall
}) {
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [prospectWords, setProspectWords] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state whenever current stage changes or savedStageData updates
  useEffect(() => {
    if (savedStageData) {
      setSelectedOutcome(savedStageData.what_happened || '');
      setProspectWords(savedStageData.prospect_words || '');
    } else {
      setSelectedOutcome('');
      setProspectWords('');
    }
  }, [currentStage?.stage_number, savedStageData]);

  if (!currentStage) return null;

  const stageNum = currentStage.stage_number;
  const nextStage = stages.find((s) => s.stage_number === stageNum + 1);
  const prevStage = stages.find((s) => s.stage_number === stageNum - 1);

  const handleNextClick = async () => {
    if (!selectedOutcome) {
      alert('Please tap what happened at this stage before proceeding.');
      return;
    }
    setIsSaving(true);
    await onSaveAndNext({
      stage_number: stageNum,
      what_happened: selectedOutcome,
      prospect_words: prospectWords
    });
    setIsSaving(false);
  };

  const handleQuoteClick = (quoteText) => {
    // Clean outer quotes and paste into text box
    const clean = quoteText.replace(/^["']|["']$/g, '');
    setProspectWords((prev) => (prev ? `${prev} | ${clean}` : clean));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      
      {/* Prospect & Call Context Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                {activeCall.prospect_name}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Cold Call
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeCall.company}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Stage {stageNum} of {stages.length}
          </span>
          <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${(stageNum / stages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Stage Card */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        
        {/* Stage Header */}
        <div className="border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Stage {stageNum} of {stages.length}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currentStage.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-1 font-normal leading-relaxed">
            {currentStage.purpose}
          </p>
        </div>

        {/* They May Say (Direct quotes from the 100 transcripts) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-emerald-400" />
              <span>They may say (Tap to copy)</span>
            </label>
            <span className="text-[11px] text-slate-500 italic hidden sm:inline">
              Extracted from 100 Hyderabad transcripts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {currentStage.they_may_say.map((quote, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuoteClick(quote)}
                className="text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition group relative flex flex-col justify-between"
                title="Click to copy quote into prospect's exact words"
              >
                <div className="flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                  <span className="text-xs font-medium leading-snug">
                    {quote}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400/80 mt-2 font-mono flex items-center gap-1 self-end opacity-0 group-hover:opacity-100 transition">
                  Insert <CornerDownLeft className="w-2.5 h-2.5" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* What Happened (Tap Buttons) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>What happened (Tap one)</span>
            </label>
            <span className="text-[11px] text-slate-500">Caller barely types</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentStage.what_happened_options.map((option, idx) => {
              const isSelected = selectedOutcome === option;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOutcome(option)}
                  className={`p-3.5 rounded-xl text-left text-sm font-semibold transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950/40 ring-2 ring-emerald-500/30'
                      : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate pr-2">{option}</span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-white border-white text-emerald-700'
                        : 'border-slate-600 bg-slate-800'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Their Words (Prospect's exact words) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Their words (Exact quote)</span>
            </label>
            {stageNum === 5 && (
              <span className="text-[11px] text-amber-400 font-medium bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                Crucial stage: record verbatim bottleneck
              </span>
            )}
          </div>

          <textarea
            value={prospectWords}
            onChange={(e) => setProspectWords(e.target.value)}
            rows={3}
            placeholder={currentStage.placeholder || "Type or tap above to record the prospect's exact words..."}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition resize-none leading-relaxed"
          />
        </div>

        {/* Action Controls Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {stageNum > 1 && (
              <button
                type="button"
                onClick={onPrevStage}
                className="px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous stage</span>
              </button>
            )}

            {/* End Call Button: MUST be on every stage because most calls end early */}
            <button
              type="button"
              onClick={() => onEndCall({ currentStageNumber: stageNum, currentOutcome: selectedOutcome, currentWords: prospectWords })}
              className="px-4 py-2.5 rounded-xl border border-rose-900/60 hover:border-rose-700 bg-rose-950/30 hover:bg-rose-950/50 text-rose-300 hover:text-rose-100 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="End call now (Most cold calls end early)"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End call</span>
            </button>
          </div>

          {/* Next Stage Button */}
          <button
            type="button"
            disabled={isSaving}
            onClick={handleNextClick}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold transition shadow-lg shadow-emerald-950/40 flex items-center gap-2 disabled:opacity-50"
          >
            <span>
              {stageNum === stages.length
                ? 'Complete call'
                : `Next: ${nextStage?.short_name || nextStage?.name || 'Next Stage'}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
}
