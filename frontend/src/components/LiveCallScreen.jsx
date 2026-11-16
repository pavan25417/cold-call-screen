import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  PhoneOff, 
  MessageSquareQuote, 
  CheckCircle2, 
  Quote, 
  CornerDownLeft, 
  Building2, 
  UserCheck, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles,
  Keyboard
} from 'lucide-react';
import { DEMO_T095_SCRIPT } from '../stagesData.js';

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
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [speechNotice, setSpeechNotice] = useState('');

  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  const stageNum = currentStage?.stage_number || 1;
  const isDemoCall = Boolean(
    activeCall?.prospect_name?.toLowerCase().includes('dhanchand') || activeCall?.isDemo
  );

  // Initialize Speech Recognition (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Optimized for Indian English / accent

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setProspectWords((prev) => {
          const base = prev.trim();
          return base ? `${base} ${transcript.trim()}` : transcript.trim();
        });
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechNotice('Microphone access denied in browser.');
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setMicSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Sync state whenever stage changes
  useEffect(() => {
    if (!currentStage) return;

    if (savedStageData) {
      setSelectedOutcome(savedStageData.what_happened || currentStage.what_happened_options[0]);
      setProspectWords(savedStageData.prospect_words || '');
    } else if (isDemoCall && DEMO_T095_SCRIPT[stageNum]) {
      // Pre-fill transcript words for demo call
      setSelectedOutcome(DEMO_T095_SCRIPT[stageNum].what_happened);
      setProspectWords(DEMO_T095_SCRIPT[stageNum].prospect_words);
    } else {
      // Reference screen rule: "Four taps, one of them already pressed."
      setSelectedOutcome(currentStage.what_happened_options[0] || '');
      setProspectWords('');
    }

    // Stop listening when changing stages
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {}
    }
  }, [currentStage?.stage_number, savedStageData, isDemoCall]);

  // Keyboard Shortcuts: Space (toggle voice), 1-4 (select option), Enter (next stage)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If typing inside textarea, only trigger on Ctrl+Enter or Cmd+Enter
      if (document.activeElement === textareaRef.current) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          handleNextClick();
        }
        return;
      }

      // Spacebar toggles voice when outside input
      if (e.code === 'Space') {
        e.preventDefault();
        toggleVoice();
        return;
      }

      // 1, 2, 3, 4 pick options
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentStage?.what_happened_options[idx]) {
          setSelectedOutcome(currentStage.what_happened_options[idx]);
        }
        return;
      }

      // Enter advances to next stage
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNextClick();
        return;
      }

      // ArrowLeft goes back
      if (e.key === 'ArrowLeft' && stageNum > 1) {
        e.preventDefault();
        onPrevStage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOutcome, prospectWords, isListening, currentStage, stageNum]);

  if (!currentStage) return null;

  const nextStage = stages.find((s) => s.stage_number === stageNum + 1);
  const prevStage = stages.find((s) => s.stage_number === stageNum - 1);

  // Toggle Microphone
  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported on this browser (use Chrome, Edge, or Safari).');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {}
    } else {
      try {
        setSpeechNotice('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  // Instant 0ms Optimistic Transition!
  const handleNextClick = () => {
    const outcomeToSave = selectedOutcome || currentStage.what_happened_options[0] || 'Completed';
    // Instant trigger with zero network wait!
    onSaveAndNext({
      stage_number: stageNum,
      what_happened: outcomeToSave,
      prospect_words: prospectWords
    });
  };

  const handleQuoteClick = (quoteText) => {
    const clean = quoteText.replace(/^["']|["']$/g, '');
    setProspectWords(clean);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 sm:py-7 space-y-5">
      
      {/* Prospect & Call Context Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {activeCall.prospect_name}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Cold Call
              </span>
              {isDemoCall && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                  <span>Demo Mode T095</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeCall.company}</span>
            </p>
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 font-mono font-medium">
            Stage {stageNum} of {stages.length}
          </span>
          <div className="w-24 h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-200 rounded-full"
              style={{ width: `${(stageNum / stages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Stage Card - Clean White Layout */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
        
        {/* Stage Header */}
        <div className="border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Stage {stageNum} of {stages.length}
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Press [1-4] for options · [Enter] for next stage
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentStage.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1 font-normal leading-relaxed">
            {currentStage.purpose}
          </p>
        </div>

        {/* They May Say (Quotes directly from transcripts) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-emerald-600" />
              <span>They may say (Tap to insert quote)</span>
            </label>
            <span className="text-[11px] text-slate-400 italic hidden sm:inline">
              Real phrases from 100 transcripts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {currentStage.they_may_say.map((quote, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuoteClick(quote)}
                className="text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/90 hover:border-emerald-300 text-slate-700 hover:text-slate-900 transition-all group relative flex flex-col justify-between shadow-2xs"
                title="Click to copy quote into prospect's exact words"
              >
                <div className="flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 opacity-70 group-hover:opacity-100" />
                  <span className="text-xs font-semibold leading-snug">
                    {quote}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 mt-2 font-mono flex items-center gap-1 self-end opacity-0 group-hover:opacity-100 transition font-bold">
                  Use quote <CornerDownLeft className="w-2.5 h-2.5" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* What Happened (Tap Buttons - One Already Pressed!) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What happened (One already selected)</span>
            </label>
            <span className="text-[11px] text-slate-500 font-medium">Barely type, just tap</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentStage.what_happened_options.map((option, idx) => {
              const isSelected = selectedOutcome === option;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOutcome(option)}
                  className={`p-3.5 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <span className="truncate pr-2 flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {idx + 1}
                    </span>
                    <span>{option}</span>
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-white border-white text-emerald-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Their Words (With Live Voice Toggle & Spacebar hotkey!) */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Their words (Exact quote)
              </label>
              {stageNum === 5 ? (
                <span className="text-[10px] text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Crucial: Verbatim need
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 italic">Optional</span>
              )}
            </div>

            {/* Voice Toggle Button */}
            <button
              type="button"
              onClick={toggleVoice}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                isListening
                  ? 'bg-rose-50 text-rose-700 border border-rose-300 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Click or press Spacebar to toggle microphone voice transcription"
            >
              {isListening ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                  <span className="font-bold">Live Transcribing...</span>
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Speaker Voice Transcribe</span>
                  <span className="hidden sm:inline text-[10px] font-mono px-1 py-0.2 rounded bg-white text-slate-500 border border-slate-300">
                    Space
                  </span>
                </>
              )}
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={prospectWords}
            onChange={(e) => setProspectWords(e.target.value)}
            rows={3}
            placeholder={
              isListening
                ? 'Listening to live customer speech... words will transcribe here in real-time.'
                : currentStage.placeholder || "Type, tap a quote above, or press Spacebar to transcribe live..."
            }
            className={`w-full bg-slate-50/70 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all resize-none leading-relaxed ${
              isListening
                ? 'border-rose-400 bg-rose-50/20 ring-2 ring-rose-200'
                : 'border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
            }`}
          />

          {speechNotice && (
            <p className="text-xs text-rose-600 font-medium">{speechNotice}</p>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {stageNum > 1 && (
              <button
                type="button"
                onClick={onPrevStage}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous stage</span>
              </button>
            )}

            {/* End Call Button on EVERY stage */}
            <button
              type="button"
              onClick={() => onEndCall({ currentStageNumber: stageNum, currentOutcome: selectedOutcome, currentWords: prospectWords })}
              className="px-4 py-2.5 rounded-xl border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              title="End call now (Most cold calls end early)"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>End call</span>
            </button>
          </div>

          {/* Next Stage Button (Instant 0ms transition!) */}
          <button
            type="button"
            onClick={handleNextClick}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
          >
            <span>
              {stageNum === stages.length
                ? 'Complete call ✓'
                : `Next: ${nextStage?.short_name || nextStage?.name || 'Next Stage'}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
}
