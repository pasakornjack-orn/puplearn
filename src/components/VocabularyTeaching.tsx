import React from 'react';
import { MascotBubble } from './MascotBubble';
import { playSpeech } from '../utils/audio';

interface VocabularyTeachingProps {
  targetImage: string;
  targetEnglishName: string;
  englishPhase: string;
  isAudioMuted: boolean;
  onReplay: () => void;
  onComplete: () => void;
}

const VocabularyTeaching: React.FC<VocabularyTeachingProps> = ({
  targetImage,
  targetEnglishName,
  englishPhase,
  isAudioMuted,
  onReplay,
  onComplete
}) => {
  const displayTargetText = targetEnglishName;
  const isPulsing = englishPhase === 'listen2' || englishPhase === 'repeat2';

  const message = 
    englishPhase === 'listen1' ? 'ฟังนะ...' : 
    englishPhase === 'listen2' ? displayTargetText : 
    englishPhase === 'repeat1' ? 'พูดตาม Pillow นะ...' : 
    displayTargetText;

  const currentAudioId = 
    englishPhase === 'listen1' ? 'pillow.listen' :
    englishPhase === 'listen2' ? `vocab.${targetEnglishName.toLowerCase()}` :
    englishPhase === 'repeat1' ? 'pillow.repeat' :
    `vocab.${targetEnglishName.toLowerCase()}`;

  return (
    <div className="absolute inset-0 flex flex-col z-10 overflow-hidden animate-fade-in pb-safe">
      
      {/* Top Spacer */}
      <div className="flex-shrink-0 h-[4px] sm:h-[10px]"></div>

      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-start items-center gap-2 px-6 relative z-10 mt-1 sm:mt-2">
        
        {/* Hero Learning Card */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-[3rem] sm:rounded-[3.5rem] border-b-[8px] sm:border-b-[12px] border-sky-100 shadow-[0_15px_30px_rgba(0,0,0,0.1)] pt-4 pb-4 sm:pt-6 sm:pb-6 px-4 relative flex flex-col items-center z-20 mb-2">
          
          <button 
            onClick={() => {
              if (!isAudioMuted) {
                playSpeech(targetEnglishName, 'en-US', 0.6, `vocab.${targetEnglishName.toLowerCase()}`);
              }
            }}
            className={`relative flex items-center justify-center transition-transform hover:scale-100 active:scale-95 mb-4 z-20 ${isPulsing ? 'animate-[pulse_2s_ease-in-out_infinite]' : 'animate-bounce-slow'}`}
          >
            {/* Glowing Backdrop */}
            <div className="absolute inset-0 bg-yellow-100/60 rounded-full blur-3xl scale-[1.2]"></div>
            
            <img src={targetImage} alt={targetEnglishName} className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] relative z-10" />
            
            {(englishPhase === 'repeat1' || englishPhase === 'repeat2') && (
               <div className="absolute -right-2 top-0 bg-white rounded-full p-2 shadow-xl border-4 border-sky-100 z-20 animate-bounce">
                <span className="text-2xl leading-none">🔊</span>
              </div>
            )}
          </button>

          {/* Word Card */}
          <div className="w-full text-center mt-2">
            <p className="text-4xl sm:text-5xl font-display font-bold text-sky-500 tracking-wide drop-shadow-sm">{displayTargetText}</p>
          </div>
        </div>

        {/* Mascot grouped unit in lower-middle */}
        <div className="w-full flex-1 flex flex-col justify-center items-center z-20 min-h-[140px]">
          <MascotBubble 
          mascot="Pillow" 
          emotion={(englishPhase === 'listen1' || englishPhase === 'listen2') ? 'neutral' : 'asking'} 
          message={message} 
          variant="mascot-vocabulary"
          audioEnabled={!isAudioMuted}
          audioId={currentAudioId}
          disableAutoPlay={true}
          audioLang={(englishPhase === 'listen2' || englishPhase === 'repeat2') ? 'en-US' : 'th-TH'} 
          audioRate={(englishPhase === 'listen2' || englishPhase === 'repeat2') ? 0.65 : 1.0}
          audioOverrideText={
            (englishPhase === 'listen2' || englishPhase === 'repeat2') ? targetEnglishName : undefined
          }
          onReplay={onReplay}
        />
        </div>

        {/* Bottom Area: CTA */}
        <div className="w-full flex justify-center relative z-50 mb-4 sm:mb-6 mt-1 flex-shrink-0">
          <button 
            onClick={onComplete}
            className="w-[200px] bg-green-500 text-white font-bold text-2xl py-4 rounded-[2.5rem] shadow-[0_8px_0_rgb(22,163,74),_0_15px_20px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-[0.98] active:translate-y-2 active:shadow-[0_0_0_rgb(22,163,74)] transition-all border-[5px] border-green-300 tracking-wide flex justify-center items-center gap-2"
          >
            <span className="text-xl leading-none">✅</span> เสร็จแล้ว
          </button>
        </div>

      </div>
    </div>
  );
};

export default VocabularyTeaching;
