import React, { useState, useEffect, useRef } from 'react';
import { DEMO_T095_SCRIPT } from '../stagesData.js';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

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
  const [voiceError, setVoiceError] = useState(null);

  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  const stageNum = currentStage?.stage_number || 1;
  const isDemoCall = Boolean(
    activeCall?.prospect_name?.toLowerCase().includes('dhanchand') || activeCall?.isDemo
  );

  // Sync stage data when current stage changes
  useEffect(() => {
    if (!currentStage) return;

    if (savedStageData) {
      setSelectedOutcome(savedStageData.what_happened || currentStage.what_happened_options[0]);
      setProspectWords(savedStageData.prospect_words || '');
    } else if (isDemoCall && DEMO_T095_SCRIPT[stageNum]) {
      setSelectedOutcome(DEMO_T095_SCRIPT[stageNum].what_happened);
      setProspectWords(DEMO_T095_SCRIPT[stageNum].prospect_words);
    } else {
      const defaultOpt = currentStage.what_happened_options[0] || '';
      setSelectedOutcome(defaultOpt);
      const defaultRelText = currentStage.relative_texts?.[defaultOpt] || '';
      setProspectWords(defaultRelText);
    }

    // Stop listening when switching stages
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }
    setVoiceError(null);
  }, [currentStage?.stage_number, savedStageData, isDemoCall]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If typing in textarea, allow cmd/ctrl+enter to advance
      if (document.activeElement === textareaRef.current) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      // Spacebar toggles microphone transcription
      if (e.code === 'Space') {
        e.preventDefault();
        toggleVoice();
        return;
      }

      // 1-4 hotkeys for the 4 outcomes
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentStage?.what_happened_options[idx]) {
          handleSelectOutcome(currentStage.what_happened_options[idx]);
        }
        return;
      }

      // Enter advances to next stage
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
        return;
      }

      // Left arrow goes back
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

  // Tapping an outcome selects it AND sets the relative text in the text box
  const handleSelectOutcome = (option) => {
    setSelectedOutcome(option);
    const relText = currentStage.relative_texts?.[option];
    if (relText) {
      setProspectWords(relText);
    }
  };

  // Toggle voice transcription
  const toggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      // CLEAR the text box immediately so only the live spoken transcribe is captured
      setProspectWords('');
      setVoiceError(null);

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English, fallback supported

      let finalTranscript = '';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event) => {
        let interim = '';
        for (let i = 0; i < event.results.length; ++i) {
          const part = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += part + ' ';
          } else {
            interim += part;
          }
        }
        const spoken = (finalTranscript + interim).trim();
        setProspectWords(spoken);
      };

      recognition.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone access blocked. Click the lock/tune icon near your browser address bar to allow microphone.');
        } else if (event.error === 'no-speech') {
          // Normal pause, keep listening
        } else {
          setVoiceError(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setVoiceError('Could not start microphone: ' + err.message);
      setIsListening(false);
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
      
      {/* Prospect Header */}
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

      {/* They may say (Clickable Quotes) */}
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

      {/* What happened (4 Options with Relative Quick Text) */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-zinc-900 flex items-center justify-between">
          <span>What happened</span>
          <span className="text-[11px] text-zinc-400 font-normal">tap option to auto-fill relative prospect words</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentStage.what_happened_options.map((option, idx) => {
            const isSelected = selectedOutcome === option;
            const relText = currentStage.relative_texts?.[option];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOutcome(option)}
                className={`p-3 rounded-lg text-left transition border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">
                    <span className={`font-mono mr-1.5 ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                      {idx + 1}.
                    </span>
                    {option}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  )}
                </div>
                {relText && (
                  <p className={`text-[11px] italic mt-1 line-clamp-2 ${
                    isSelected ? 'text-zinc-300' : 'text-zinc-500'
                  }`}>
                    “{relText}”
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Their words (with Voice Transcription) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-zinc-900">
            Their words
            {stageNum === 5 && (
              <span className="ml-1.5 text-[10px] text-zinc-500 font-normal uppercase tracking-wider">
                (verbatim notes)
              </span>
            )}
          </label>

          {/* Voice Toggle Button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`text-xs px-2.5 py-1 rounded-md transition flex items-center gap-1.5 font-medium border ${
              isListening
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
            }`}
            title="Click or press Spacebar to toggle voice transcription"
          >
            {isListening ? (
              <>
                <Mic className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
                <span className="font-semibold text-[11px]">Transcribing... (Space to stop)</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[11px]">Transcribe [Space]</span>
              </>
            )}
          </button>
        </div>

        {/* Live Transcribing Indicator */}
        {isListening && (
          <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1.5 py-0.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>Listening to prospect speech... Transcribing directly into box.</span>
          </div>
        )}

        {/* Error notice if microphone blocked */}
        {voiceError && (
          <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
            <span>{voiceError}</span>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={prospectWords}
          onChange={(e) => setProspectWords(e.target.value)}
          placeholder={
            isListening
              ? "Listening... spoken words will appear here"
              : currentStage.placeholder || "Type what the prospect said, or tap an outcome above to populate"
          }
          rows={3}
          className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition font-sans ${
            isListening
              ? 'border-rose-400 ring-1 ring-rose-400 bg-rose-50/10'
              : 'border-zinc-300 focus:border-zinc-900'
          }`}
        />

        {/* Quick Quote chips helper */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] text-zinc-400 font-medium mr-1">Quick fill:</span>
          {currentStage.they_may_say.map((quote, idx) => {
            const clean = quote.replace(/^["'“]|["'”]$/g, '');
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuoteClick(quote)}
                className="text-[10px] text-zinc-500 hover:text-zinc-800 bg-zinc-100 hover:bg-zinc-200/80 px-2 py-0.5 rounded transition truncate max-w-[200px]"
                title={clean}
              >
                {clean}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
        <div>
          {stageNum > 1 && (
            <button
              onClick={onPrevStage}
              className="text-xs text-zinc-500 hover:text-zinc-800 font-medium transition"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onEndCall(stageNum, selectedOutcome, prospectWords)}
            className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
          >
            End call
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition shadow-2xs"
          >
            {stageNum === 8 ? (
              'Complete call'
            ) : (
              <span>Next: {nextStage?.name || `Stage ${stageNum + 1}`} →</span>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
