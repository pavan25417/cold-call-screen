import React, { useState, useEffect, useRef } from 'react';
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

  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  const stageNum = currentStage?.stage_number || 1;
  const isDemoCall = Boolean(
    activeCall?.prospect_name?.toLowerCase().includes('dhanchand') || activeCall?.isDemo
  );

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

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

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Sync stage data
  useEffect(() => {
    if (!currentStage) return;

    if (savedStageData) {
      setSelectedOutcome(savedStageData.what_happened || currentStage.what_happened_options[0]);
      setProspectWords(savedStageData.prospect_words || '');
    } else if (isDemoCall && DEMO_T095_SCRIPT[stageNum]) {
      setSelectedOutcome(DEMO_T095_SCRIPT[stageNum].what_happened);
      setProspectWords(DEMO_T095_SCRIPT[stageNum].prospect_words);
    } else {
      setSelectedOutcome(currentStage.what_happened_options[0] || '');
      setProspectWords('');
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {}
    }
  }, [currentStage?.stage_number, savedStageData, isDemoCall]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === textareaRef.current) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        toggleVoice();
        return;
      }

      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentStage?.what_happened_options[idx]) {
          setSelectedOutcome(currentStage.what_happened_options[idx]);
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
        return;
      }

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

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {}
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {}
    }
  };

  const handleNext = () => {
    const outcomeToSave = selectedOutcome || currentStage.what_happened_options[0] || 'Completed';
    onSaveAndNext({
      stage_number: stageNum,
      what_happened: outcomeToSave,
      prospect_words: prospectWords
    });
  };

  const handleQuoteClick = (quoteText) => {
    const clean = quoteText.replace(/^["'“]|["'”]$/g, '');
    setProspectWords(clean);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-7 text-zinc-900">
      
      {/* Prospect Header (Reference Screen style) */}
      <div className="border-b border-zinc-200 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          {activeCall.prospect_name}
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          {activeCall.company} · first call
        </p>
      </div>

      {/* Stage Number & Title */}
      <div className="space-y-1">
        <div className="text-xs text-zinc-400 font-medium">
          Stage {stageNum} of {stages.length}
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-zinc-900">
          {currentStage.name}
        </h3>
        <p className="text-sm text-zinc-600 leading-relaxed pt-0.5">
          {currentStage.purpose}
        </p>
      </div>

      {/* She / They may say */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-zinc-900">
          They may say
        </div>
        <div className="space-y-1.5">
          {currentStage.they_may_say.map((quote, idx) => (
            <div
              key={idx}
              onClick={() => handleQuoteClick(quote)}
              className="text-sm text-zinc-600 hover:text-zinc-900 cursor-pointer transition select-none flex items-start gap-1.5 group"
              title="Click to copy into notes"
            >
              <span className="text-zinc-300 group-hover:text-zinc-500 font-serif leading-none mt-0.5">“</span>
              <span className="italic leading-snug">{quote.replace(/^["'“]|["'”]$/g, '')}</span>
              <span className="text-zinc-300 group-hover:text-zinc-500 font-serif leading-none mt-0.5">”</span>
            </div>
          ))}
        </div>
      </div>

      {/* What happened (Four taps, one of them already pressed) */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-zinc-900 flex items-center justify-between">
          <span>What happened</span>
          <span className="text-[11px] text-zinc-400 font-normal">tap to change</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {currentStage.what_happened_options.map((option, idx) => {
            const isSelected = selectedOutcome === option;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedOutcome(option)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition border ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Her words / Their words */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-zinc-900">
            Their words
          </label>
          <button
            type="button"
            onClick={toggleVoice}
            className={`text-[11px] font-mono transition flex items-center gap-1.5 ${
              isListening ? 'text-rose-600 font-bold' : 'text-zinc-400 hover:text-zinc-600'
            }`}
            title="Press Spacebar to toggle microphone"
          >
            {isListening ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                <span>listening... (Space to stop)</span>
              </>
            ) : (
              <span>voice: press Space to speak</span>
            )}
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={prospectWords}
          onChange={(e) => setProspectWords(e.target.value)}
          rows={3}
          placeholder="exact words spoken by the prospect..."
          className="w-full bg-white border border-zinc-300 focus:border-zinc-900 rounded-lg p-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition resize-none leading-relaxed font-sans"
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition shadow-2xs"
          >
            {stageNum === stages.length
              ? 'Complete call'
              : `Next: ${nextStage?.name || 'Next'}`}
          </button>

          <button
            type="button"
            onClick={() => onEndCall({ currentStageNumber: stageNum, currentOutcome: selectedOutcome, currentWords: prospectWords })}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium transition"
          >
            End call
          </button>
        </div>

        {stageNum > 1 && (
          <button
            type="button"
            onClick={onPrevStage}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition"
          >
            Previous stage
          </button>
        )}
      </div>

    </div>
  );
}
