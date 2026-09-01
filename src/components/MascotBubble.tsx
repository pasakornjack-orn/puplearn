import { useEffect } from 'react';
import type { MascotType, MascotEmotion } from '../config/mascots';
import { getMascotAsset } from '../config/mascots';
import { playSpeech } from '../utils/audio';

interface MascotBubbleProps {
  mascot: MascotType;
  emotion?: MascotEmotion;
  message: string;
  variant?: 'mascot-top-left' | 'mascot-left' | 'mascot-celebrate' | 'mascot-left-floating' | 'mascot-gameplay-v2' | 'mascot-vocabulary';
  layout?: 'horizontal' | 'vertical'; // Deprecated, keeping for backwards compatibility if needed
  audioEnabled?: boolean;
  audioLang?: 'th-TH' | 'en-US';
  audioRate?: number;
  audioOverrideText?: string;
  playTrigger?: number;
  onReplay?: () => void;
}

export const MascotBubble = ({ 
  mascot, 
  emotion, 
  message, 
  variant = 'mascot-top-left',
  layout,
  audioEnabled, 
  audioLang = 'th-TH', 
  audioRate = 1.0, 
  audioOverrideText, 
  playTrigger, 
  onReplay 
}: MascotBubbleProps) => {
  
  let currentEmotion = emotion;
  if (!currentEmotion) {
    if (mascot === 'Bingo') currentEmotion = 'guide';
    else if (mascot === 'Peter') currentEmotion = 'thinking';
    else if (mascot === 'A-Chi') currentEmotion = 'neutral';
    else if (mascot === 'Pillow') currentEmotion = 'asking';
    else currentEmotion = 'neutral';
  }

  const imageSrc = getMascotAsset(mascot, currentEmotion as MascotEmotion);

  useEffect(() => {
    if (audioEnabled && (audioOverrideText || message)) {
      playSpeech(audioOverrideText || message, audioLang, audioRate);
    }
  }, [message, audioEnabled, audioLang, audioRate, audioOverrideText, playTrigger]);

  const handleReplay = () => {
    if (audioEnabled && (audioOverrideText || message)) {
      playSpeech(audioOverrideText || message, audioLang, audioRate);
      if (onReplay) onReplay();
    }
  };

  const renderReplayButton = (className: string) => {
    if (!audioEnabled) return null;
    return (
      <button 
        onClick={handleReplay}
        className={`bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-gray-200 text-sky-500 active:scale-95 transition-transform ${className}`}
        aria-label="ฟังอีกครั้ง"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
      </button>
    );
  };
  
  // LEGACY SUPPORT (if old components still use layout="vertical")
  if (layout === 'vertical') {
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto relative mt-2 pointer-events-none">
        <div className="relative z-10 w-56 h-56 flex items-end justify-center -mb-4">
          <img src={imageSrc} alt={mascot} className="w-full h-full object-contain object-bottom drop-shadow-2xl animate-breath" />
        </div>
        <div className="w-full bg-white border-[6px] border-yellow-300 rounded-[3rem] p-6 pt-10 pb-6 shadow-[0_12px_20px_rgba(0,0,0,0.08)] text-center relative z-20 pointer-events-auto">
          {renderReplayButton("absolute top-6 right-6 w-12 h-12 text-2xl border-4 border-gray-100 hover:scale-105")}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-t-[6px] border-l-[6px] border-yellow-300 transform rotate-45"></div>
          <p className="text-2xl font-display font-bold mb-2 uppercase tracking-wide text-orange-500">{mascot}</p>
          <p className="text-2xl font-semibold text-gray-800 leading-relaxed pr-2">{message}</p>
        </div>
      </div>
    );
  }

  // 1.5) GAMEPLAY SCENE (mascot-left-floating)
  if (variant === 'mascot-left-floating') {
    return (
      <div className="flex flex-col items-start w-[240px] pointer-events-none">
        {/* Bubble above mascot */}
        <div className="relative mb-2 pointer-events-auto ml-4">
          <div className="bg-white/95 backdrop-blur-sm border-[4px] border-yellow-300 rounded-[2rem] rounded-bl-xl p-3 pr-10 shadow-lg relative z-10 w-48">
            {renderReplayButton("absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 border-2 border-gray-100")}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b-[4px] border-l-[4px] border-yellow-300 transform -rotate-45"></div>
            <p className="text-xs font-display font-bold mb-0.5 uppercase tracking-wider text-orange-500">{mascot}</p>
            <p className="text-sm font-semibold text-gray-800 leading-snug">{message}</p>
          </div>
        </div>
        {/* Mascot */}
        <div className="relative w-40 h-40 flex-shrink-0 z-20">
          <img src={imageSrc} alt={mascot} className="absolute bottom-0 w-[140%] max-w-none object-contain object-bottom drop-shadow-lg animate-breath origin-bottom-left" />
        </div>
      </div>
    );
  }

  if (variant === 'mascot-gameplay-v2') {
    return (
      <div className="w-full h-full relative pointer-events-none">
        {/* Decoupled Bubble: Anchored to the right of Bingo's head */}
        <div className="absolute bottom-[130px] sm:bottom-[160px] left-[150px] sm:left-[190px] pointer-events-auto z-50">
          <div className="bg-white/95 backdrop-blur-sm border-[4px] border-yellow-300 rounded-[2rem] rounded-bl-sm p-3 pr-8 shadow-lg relative z-10 w-40 sm:w-48">
            {renderReplayButton("absolute top-1/2 -translate-y-1/2 right-1 w-6 h-6 border-2 border-gray-100 scale-[0.8]")}
            {/* Tail pointing left towards Bingo */}
            <div className="absolute top-[60%] -left-2.5 -translate-y-1/2 w-4 h-4 bg-white border-b-[4px] border-l-[4px] border-yellow-300 transform rotate-45 origin-center"></div>
            <p className="text-[10px] font-display font-bold mb-0.5 uppercase tracking-wider text-orange-500">{mascot}</p>
            <p className="text-xs font-semibold text-gray-800 leading-tight">{message}</p>
          </div>
        </div>
        {/* Mascot: Anchored at the bottom left, slightly reduced */}
        <div className="absolute bottom-0 -left-2 sm:-left-4 z-0">
          <img src={imageSrc} alt={mascot} className="w-[200px] sm:w-[260px] max-h-[25vh] max-w-none h-auto object-contain drop-shadow-xl origin-bottom-left animate-breath" />
        </div>
      </div>
    );
  }

  if (variant === 'mascot-vocabulary') {
    return (
      <div className="w-full flex flex-col justify-center items-center pointer-events-none mt-2">
        {/* Bubble on top */}
        <div className="relative mb-2 sm:mb-4 pointer-events-auto z-20">
          <div className="bg-white border-[4px] border-yellow-300 rounded-[2rem] p-3 sm:p-4 pr-10 shadow-lg relative z-10 w-48 sm:w-56 text-left">
            {renderReplayButton("absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 border-2 border-gray-100")}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-b-[4px] border-r-[4px] border-yellow-300 transform rotate-45 origin-center"></div>
            <p className="text-xs font-display font-bold mb-0.5 uppercase tracking-wider text-orange-500 text-center">{mascot}</p>
            <p className="text-sm sm:text-base font-semibold text-gray-800 leading-snug text-center">{message}</p>
          </div>
        </div>
        {/* Mascot on bottom */}
        <div className="relative w-48 sm:w-56 h-auto flex-shrink-0 z-10 min-h-[160px] flex items-end justify-center">
          <img src={imageSrc} alt={mascot} className="w-full max-h-[22vh] max-w-none h-auto object-contain drop-shadow-xl origin-bottom animate-breath" />
        </div>
      </div>
    );
  }

  // 1) FIND ONE GAMEPLAY & WRONG TAP (mascot-scene)
  if (variant === 'mascot-top-left') {
    return (
      <div className="flex items-end w-full max-w-md mx-auto pointer-events-none">
        <div className="relative w-32 sm:w-36 h-32 flex-shrink-0 z-20 -ml-2">
          <img src={imageSrc} alt={mascot} className="absolute bottom-0 w-[140%] max-w-none object-contain object-bottom drop-shadow-lg animate-breath origin-bottom-left" />
        </div>
        <div className="flex-1 mb-2 ml-1 relative pointer-events-auto">
          <div className="bg-white border-[4px] border-yellow-300 rounded-[2rem] rounded-bl-xl p-3 sm:p-4 pr-12 shadow-md relative z-10">
            {renderReplayButton("absolute top-1/2 -translate-y-1/2 right-2 w-9 h-9 border-2 border-gray-100")}
            <div className="absolute bottom-4 -left-3 w-5 h-5 bg-white border-b-[4px] border-l-[4px] border-yellow-300 transform rotate-45"></div>
            <p className="text-xs font-display font-bold mb-0.5 uppercase tracking-wider text-orange-500">{mascot}</p>
            <p className="text-sm sm:text-base font-semibold text-gray-800 leading-snug">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  // 2) VOCABULARY / REPEAT (mascot-left)
  if (variant === 'mascot-left') {
    return (
      <div className="flex w-full max-w-md mx-auto items-end px-2 z-40 pointer-events-none mt-4">
        <div className="relative w-32 h-40 flex-shrink-0 z-20">
          <img src={imageSrc} alt={mascot} className="absolute bottom-0 w-[130%] max-w-none object-contain object-bottom drop-shadow-lg animate-breath origin-bottom" />
        </div>
        <div className="flex-1 mb-6 ml-2 relative pointer-events-auto">
          <div className="bg-white border-[4px] border-yellow-300 rounded-[2rem] rounded-bl-lg p-4 pr-12 shadow-[0_10px_20px_rgba(0,0,0,0.08)] relative z-10">
            {renderReplayButton("absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10 border-2 border-gray-100")}
            <div className="absolute bottom-6 -left-3 w-5 h-5 bg-white border-b-[4px] border-l-[4px] border-yellow-300 transform rotate-45"></div>
            <p className="text-base font-semibold text-gray-800 leading-snug">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  // 3) SUCCESS CELEBRATION (mascot-celebrate)
  if (variant === 'mascot-celebrate') {
    return (
      <div className="flex flex-col items-center w-full max-w-sm mx-auto relative mt-4 pointer-events-none">
        <div className="relative w-full flex justify-center mb-4">
          <img src={imageSrc} alt={mascot} className="relative z-10 w-[75%] h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] animate-bounce-twice" />
        </div>
        <div className="w-full text-center relative z-20 pointer-events-auto">
          <p className="text-4xl font-display font-bold mb-2 uppercase text-green-500 tracking-wide">Excellent!</p>
          <p className="text-2xl font-bold text-gray-700">{message}</p>
        </div>
      </div>
    );
  }

  return null;
};
