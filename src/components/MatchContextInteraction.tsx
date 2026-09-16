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
  const topRowChoices = choices.slice(0, 2);
  const bottomRowChoices = choices.slice(2);

  return (
    <div className="absolute inset-0 flex flex-col h-full z-10 overflow-hidden animate-fade-in pb-safe select-none">
      
      {/* 1. Top Guide Area: Peter + Question Bubble */}
      <div className="w-full max-w-sm mx-auto px-4 pt-1 pb-1 flex-shrink-0 z-30">
        <MascotBubble 
          mascot={hintMessage?.mascot || mission.guideMascot || 'Peter'} 
          emotion={hintMessage?.emotion || 'thinking'} 
          message={hintMessage?.text || instructionText}
          variant="mascot-top-left"
          audioEnabled={!isAudioMuted}
          playTrigger={hintMessage?.timestamp || 0}
          audioId={hintMessage?.audioId || instructionAudioId}
          onReplay={handleReplay}
        />
      </div>

      {/* 2. Central Object: Prominent Toothbrush Card */}
      {centralObject && (
        <div className="w-full flex justify-center items-center py-1 flex-shrink-0 z-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-yellow-300/40 rounded-[2.2rem] blur-sm"></div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-[2rem] p-3 border-[4px] border-yellow-300 shadow-[0_8px_18px_rgba(0,0,0,0.08)] flex items-center justify-center relative">
              <img 
                src={centralObject.image} 
                alt={centralObject.name} 
                className="w-full h-full object-contain drop-shadow-md pointer-events-none" 
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Room Choices: 2 Top + 1 Centered Bottom, ALL EQUAL SIZE */}
      <div className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-center items-center px-4 pb-4 pt-1 z-20">
        <div className="w-full flex flex-col items-center gap-3">
          
          {/* Row 1: 2 cards */}
          <div className="flex justify-center gap-3 w-full">
            {topRowChoices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleTap(choice)}
                className={`w-[calc(50%-0.375rem)] max-w-[140px] aspect-square bg-white rounded-[2rem] p-2 border-[4px] border-sky-300 shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all active:scale-95 active:translate-y-1 flex items-center justify-center relative group ${
                  bouncingId === choice.id ? 'animate-friendly-wiggle' : 'hover:scale-[1.03]'
                }`}
                aria-label={choice.id}
              >
                <div className="w-full h-full rounded-[1.4rem] overflow-hidden relative">
                  <img 
                    src={choice.image} 
                    alt={choice.id} 
                    className="w-full h-full object-cover object-center pointer-events-none" 
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Row 2: 1 centered card - EXACT SAME SIZE */}
          <div className="flex justify-center w-full">
            {bottomRowChoices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleTap(choice)}
                className={`w-[calc(50%-0.375rem)] max-w-[140px] aspect-square bg-white rounded-[2rem] p-2 border-[4px] border-sky-300 shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all active:scale-95 active:translate-y-1 flex items-center justify-center relative group ${
                  bouncingId === choice.id ? 'animate-friendly-wiggle' : 'hover:scale-[1.03]'
                }`}
                aria-label={choice.id}
              >
                <div className="w-full h-full rounded-[1.4rem] overflow-hidden relative">
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

    </div>
  );
};

export default MatchContextInteraction;
