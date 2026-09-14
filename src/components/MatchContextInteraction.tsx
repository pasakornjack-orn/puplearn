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
  // Replay counter managed by mascot bubble internally or ignored here

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
        mascot: mission.guideMascot || 'Bingo',
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
      }, 2500);
    } else {
      // Wrong tap
      setBouncingId(choice.id);
      const wrongText = 'ลองดูอีกที่นะ'; // Usually driven by choice config in production
      setHintMessage({
        mascot: mission.guideMascot || 'Bingo',
        emotion: 'encourage',
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
    // no replay stat needed for draft
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

  return (
    <div className="absolute inset-0 flex flex-col h-full z-10 overflow-hidden animate-fade-in pb-safe">
      <div className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-start pt-6 relative z-20 px-5">
        
        {centralObject && (
          <div className="w-full flex justify-center mb-6">
            <div className="w-40 h-40 bg-white rounded-[2rem] p-4 border-[6px] border-yellow-300 shadow-[0_8px_20px_rgba(0,0,0,0.1)] flex items-center justify-center relative">
               <img src={centralObject.image} alt={centralObject.name} className="w-full h-full object-contain drop-shadow-md pointer-events-none" />
            </div>
          </div>
        )}

        <div className="w-full grid grid-cols-2 gap-4">
          {mission.contextChoices?.map((choice, index) => {
             const isLastOdd = index === 2 && mission.contextChoices?.length === 3;
             return (
               <button
                  key={choice.id}
                  onClick={() => handleTap(choice)}
                  className={`relative aspect-square w-full bg-white rounded-[2rem] border-[4px] border-sky-300 shadow-[0_8px_15px_rgba(0,0,0,0.08)] overflow-hidden transition-transform active:scale-95 flex items-center justify-center ${bouncingId === choice.id ? 'animate-friendly-wiggle' : 'hover:scale-105'} ${isLastOdd ? 'col-span-2 w-[calc(50%-0.5rem)] mx-auto' : ''}`}
               >
                  <img src={choice.image} alt={choice.id} className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
               </button>
             );
          })}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 h-[160px] z-40 pointer-events-none flex items-end justify-between px-4 max-w-md mx-auto">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-full animate-fade-in-up">
            <MascotBubble 
              mascot={hintMessage?.mascot || mission.guideMascot || 'Bingo'} 
              emotion={hintMessage?.emotion || 'guide'} 
              message={hintMessage?.text || instructionText}
              variant="mascot-gameplay-v2"
              audioEnabled={!isAudioMuted}
              playTrigger={hintMessage?.timestamp || 0}
              audioId={hintMessage?.audioId || instructionAudioId}
              onReplay={handleReplay}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MatchContextInteraction;
