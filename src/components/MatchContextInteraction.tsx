import React, { useState, useEffect } from 'react';
import type { Mission, ContextChoice } from '../data/missions';
import { productsDB } from '../data/missions';
import { getMascotAsset } from '../config/mascots';
import { playSpeech, stopSpeech } from '../utils/audio';

interface MatchContextInteractionProps {
  mission: Mission;
  isAudioMuted: boolean;
  onComplete: () => void;
}

export const MatchContextInteraction: React.FC<MatchContextInteractionProps> = ({
  mission,
  isAudioMuted,
  onComplete
}) => {
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<{
    mascot: any;
    emotion?: any;
    text: string;
    audioId?: string;
    timestamp?: number;
  } | null>(null);

  const centralObject = mission.centralObjectId ? productsDB[mission.centralObjectId] : null;
  const instructionText = mission.dialogue?.instruction?.text || mission.instructionThai;
  const instructionAudioId = mission.dialogue?.instruction?.audioId || `${mission.id}.instruction`;

  // On mount instruction
  useEffect(() => {
    if (!isAudioMuted) {
      stopSpeech();
      playSpeech(instructionText, 'th-TH', 1.0, instructionAudioId);
    }
  }, [mission, isAudioMuted, instructionText, instructionAudioId]);

  const handleTap = (choice: ContextChoice) => {
    if (choice.id === mission.targetContext) {
      // Success
      setHintMessage({
        mascot: mission.guideMascot || 'Peter',
        emotion: 'happy',
        text: mission.dialogue?.correct?.text || 'ใช่แล้ว!',
        audioId: `${mission.id}.correct`,
        timestamp: Date.now()
      });
      if (!isAudioMuted) {
        stopSpeech();
        playSpeech(mission.dialogue?.correct?.text || 'ใช่แล้ว!', 'th-TH', 1.0, `${mission.id}.correct`);
      }
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      // Wrong tap
      setBouncingId(choice.id);
      const wrongText = 'ลองดูอีกที่นะ';
      setHintMessage({
        mascot: mission.guideMascot || 'Peter',
        emotion: 'hint',
        text: wrongText,
        audioId: choice.wrongAudioId,
        timestamp: Date.now()
      });
      
      if (!isAudioMuted) {
        stopSpeech();
        playSpeech(wrongText, 'th-TH', 1.0, choice.wrongAudioId);
      }

      setTimeout(() => setBouncingId(null), 800);
    }
  };

  const handleReplay = () => {
    const msgText = hintMessage ? hintMessage.text : instructionText;
    const msgAudioId = hintMessage ? hintMessage.audioId : instructionAudioId;
    if (!isAudioMuted) {
      stopSpeech();
      if (msgAudioId) {
        playSpeech(msgText, 'th-TH', 1.0, msgAudioId);
      } else {
        playSpeech(msgText, 'th-TH', 1.0);
      }
    }
  };

  const choices = mission.contextChoices || [];

  return (
    <div className="absolute inset-0 flex flex-col h-full z-10 overflow-hidden animate-fade-in pb-safe select-none">
      
      {/* 1. Top Section: Bubble + Peter with Toothbrush Together */}
      <div className="w-full max-w-sm mx-auto px-4 pt-2 sm:pt-3 flex-shrink-0 z-30 flex flex-col items-center">
        
        {/* Speech Bubble on top */}
        <div className="relative mb-1.5 w-full max-w-sm pointer-events-auto px-2">
          <div className="bg-white border-[4px] border-yellow-300 rounded-[2.2rem] p-2.5 sm:p-3 pr-11 shadow-md relative text-center">
            {/* Replay button */}
            <button
              onClick={handleReplay}
              className="absolute top-1/2 -translate-y-1/2 right-2.5 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-gray-100 text-sky-500 active:scale-95 transition-transform"
              aria-label="ฟังอีกครั้ง"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293-1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            
            {/* Tail pointing down toward Peter */}
            <div className="absolute -bottom-2 left-20 w-4 h-4 bg-white border-b-[4px] border-r-[4px] border-yellow-300 transform rotate-45"></div>
            
            <p className="text-xs font-display font-bold uppercase tracking-wider text-purple-600 mb-0.5">
              {hintMessage?.mascot || mission.guideMascot || 'Peter'}
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-800 leading-snug">
              {hintMessage?.text || instructionText}
            </p>
          </div>
        </div>

        {/* Peter & Toothbrush together row */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 w-full py-0.5">
          {/* Peter Mascot on Left - Large like Bingo */}
          <div className="relative w-40 sm:w-48 h-40 sm:h-48 flex-shrink-0">
            <img 
              src={getMascotAsset(hintMessage?.mascot || mission.guideMascot || 'Peter', hintMessage?.emotion || 'thinking')}
              alt="Peter"
              className="w-full h-full object-contain object-bottom drop-shadow-xl animate-breath origin-bottom"
            />
          </div>

          {/* Toothbrush on Right */}
          {centralObject && (
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-1.5 bg-yellow-300/40 rounded-[2.5rem] blur-md"></div>
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-[2.2rem] p-3 border-[5px] border-yellow-300 shadow-[0_8px_20px_rgba(250,204,21,0.25)] flex items-center justify-center relative">
                <img 
                  src={centralObject.image} 
                  alt={centralObject.name} 
                  className="w-full h-full object-contain drop-shadow-md pointer-events-none" 
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 2. Room Choices: 2 Large 1:1 Square Cards Stacked Vertically */}
      <div className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-start items-center px-4 pt-1 pb-8 sm:pb-10 gap-2.5 sm:gap-3 z-20">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleTap(choice)}
            className={`w-full max-w-[180px] sm:max-w-[200px] aspect-square bg-white rounded-[2.2rem] p-2.5 sm:p-3 border-[5px] border-sky-300 shadow-[0_10px_20px_rgba(2,132,199,0.15)] transition-all active:scale-98 active:translate-y-1 flex items-center justify-center relative group overflow-hidden ${
              bouncingId === choice.id ? 'animate-friendly-wiggle' : 'hover:scale-[1.02]'
            }`}
            aria-label={choice.id}
          >
            <div className="w-full h-full rounded-[1.6rem] overflow-hidden relative">
              <img 
                src={choice.image} 
                alt={choice.id} 
                className="w-full h-full object-cover object-center pointer-events-none" 
              />
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};

export default MatchContextInteraction;
