const fs = require('fs');

let txt = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Hide SHARED V2 HEADER from Game Select
txt = txt.replace(/gameState !== 'home' && gameState !== 'mission_select'/g, "gameState !== 'home' && gameState !== 'mission_select' && gameState !== 'game_select'");

// 2. Locate Game Select block
const gsIndex = txt.indexOf("{/* STATE: GAME SELECT */}");
const gsEnd = txt.indexOf("{/* Game Cards */}");
let gsBlock = txt.substring(gsIndex, gsEnd);

// In gsBlock, we replace the button content and right div
gsBlock = gsBlock.replace(
  '<span className="text-2xl leading-none -mt-1">⬅️</span>',
  '<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>'
);

// We should also ensure the back button has hover effects.
gsBlock = gsBlock.replace(
  'active:translate-y-1 transition-all flex-shrink-0',
  'hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none transition-all flex-shrink-0'
);

const soundBtn = `              <button 
                onClick={() => {
                  stopSpeech();
                  setIsAudioMuted(prev => {
                    const next = !prev;
                    setMasterVolume(next);
                    return next;
                  });
                }}
                className={\`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-white hover:scale-105 active:scale-95 active:translate-y-1 active:shadow-none transition-all flex-shrink-0 \${isAudioMuted ? 'text-gray-400' : 'text-sky-500'}\`}
              >
                {isAudioMuted ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293-1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
                )}
              </button>`;

gsBlock = gsBlock.replace('<div className="w-12 h-12 flex-shrink-0"></div>', soundBtn);

txt = txt.substring(0, gsIndex) + gsBlock + txt.substring(gsEnd);

fs.writeFileSync('src/App.tsx', txt);
console.log('src/App.tsx updated properly.');
