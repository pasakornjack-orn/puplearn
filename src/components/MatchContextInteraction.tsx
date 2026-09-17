import React, { useState, useEffect } from 'react';
import type { Mission, ContextChoice } from '../data/missions';
import { productsDB } from '../data/missions';
import { MascotBubble } from './MascotBubble';
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
      
      {/* 1. Top Guide Area: Enlarged Peter + Question Bubble */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto px-3 pt-1 pb-1 flex-shrink-0 z-30">
        <MascotBubble 
          mascot={hintMessage?.mascot || mission.guideMascot || 'Peter'} 
          emotion={hintMessage?.emotion || 'thinking'} 
          message={hintMessage?.text || instructionText}
          variant="mascot-guide-large"
          audioEnabled={!isAudioMuted}
          playTrigger={hintMessage?.timestamp || 0}
          audioId={hintMessage?.audioId || instructionAudioId}
          onReplay={handleReplay}
        />
      </div>

      {/* 2. Central Object: Enlarged Toothbrush Card */}
      {centralObject && (
        <div className="w-full flex justify-center items-center py-2 sm:py-3 flex-shrink-0 z-20">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-yellow-300/40 rounded-[2.8rem] blur-md"></div>
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-[2.5rem] p-3.5 sm:p-4 border-[5px] border-yellow-300 shadow-[0_10px_25px_rgba(250,204,21,0.2)] flex items-center justify-center relative">
              <img 
                src={centralObject.image} 
                alt={centralObject.name} 
                className="w-full h-full object-contain drop-shadow-md pointer-events-none" 
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Room Choices: 2 Large Side-by-Side Cards (Equal Size) */}
      <div className="flex-1 w-full max-w-sm sm:max-w-md mx-auto flex flex-col justify-center items-center px-4 pb-6 pt-1 z-20">
        <div className="flex justify-center items-center gap-4 sm:gap-6 w-full">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleTap(choice)}
              className={`w-[calc(50%-0.5rem)] max-w-[165px] sm:max-w-[175px] aspect-square bg-white rounded-[2.5rem] p-2.5 sm:p-3 border-[5px] border-sky-300 shadow-[0_12px_24px_rgba(2,132,199,0.15)] transition-all active:scale-95 active:translate-y-1.5 flex items-center justify-center relative group ${
                bouncingId === choice.id ? 'animate-friendly-wiggle' : 'hover:scale-[1.03]'
              }`}
              aria-label={choice.id}
            >
              <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
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

    </div>
  );
};

export default MatchContextInteraction;
