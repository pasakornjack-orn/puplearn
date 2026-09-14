const fs = require('fs');

let appSrc = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update checkProgress
appSrc = appSrc.replace(
  '[...levelASession, mission07].forEach(m => {',
  '[...levelARegistry.map(r => r.mission), mission07].forEach(m => {'
);

// 2. Remove puplearn_level_A_session_completed
appSrc = appSrc.replace(/localStorage\.setItem\('puplearn_level_A_session_completed', new Date\(\)\.toISOString\(\)\);\n?/g, '');

// 3. Update localStorage.clear() in resetProgress
appSrc = appSrc.replace(
  'localStorage.clear();',
  `Object.keys(localStorage).forEach(key => {
      if (key.startsWith('puplearn_')) {
        localStorage.removeItem(key);
      }
    });`
);

// 4. Import the new Game Progress helper
if (!appSrc.includes('getGameStatus')) {
  appSrc = appSrc.replace(
    "import { gameRegistry } from './data/gameRegistry';",
    "import { gameRegistry } from './data/gameRegistry';\nimport { getGameStatus, type AdventureState } from './utils/gameProgress';"
  );
}

// 5. Replace Game Select Rendering
const oldGameCards = `{gameRegistry.map((game) => {
                const isAvailable = game.missionIds && game.missionIds.length > 0;
                
                return (
                  <button
                    key={game.id}
                    disabled={!isAvailable}
                    onClick={() => {
                      if (isAvailable) {
                        setActiveGameId(game.id);
                        setGameState('mission_select');
                      }
                    }}
                    className={\`w-full relative rounded-[3rem] p-4 transition-all flex flex-col items-center border-[6px] \${
                      isAvailable 
                        ? 'bg-white border-sky-300 shadow-[0_15px_30px_rgba(2,132,199,0.15)] active:translate-y-2 active:shadow-none hover:scale-[1.02]' 
                        : 'bg-gray-100 border-gray-200 opacity-90 cursor-not-allowed'
                    }\`}
                  >
                    <div className={\`w-full aspect-[2/1] rounded-[2rem] overflow-hidden relative mb-4 \${isAvailable ? 'bg-sky-100' : 'bg-gray-200 grayscale'}\`}>
                      {game.coverImage && (
                        <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                      )}
                      
                      {/* Mascot Decoration */}
                      {isAvailable && game.mascot === 'Bingo' && (
                        <img src="/mascots/bingo-happy.png" alt="Bingo" className="absolute -bottom-2 -right-2 w-32 h-32 object-contain drop-shadow-md" />
                      )}

                      {!isAvailable && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                           <div className="bg-gray-800/80 text-white font-bold font-display px-6 py-3 rounded-full text-2xl tracking-wide backdrop-blur-sm border-2 border-gray-600/50 shadow-lg">
                             Coming Soon
                           </div>
                        </div>
                      )}
                    </div>
                    <h3 className={\`text-3xl font-display font-bold \${isAvailable ? 'text-sky-600' : 'text-gray-500'} mb-2 text-center\`}>
                      {game.title}
                    </h3>
                  </button>
                );
              })}`;

const newGameCards = `{(() => {
                let previousStatus: AdventureState | null = null;
                return gameRegistry.map((game, index) => {
                  const status = getGameStatus(game, index, completedMissions, previousStatus);
                  previousStatus = status;
                  
                  const isPlayable = status === 'available' || status === 'completed';
                  
                  return (
                    <button
                      key={game.id}
                      disabled={!isPlayable}
                      onClick={() => {
                        if (isPlayable) {
                          setActiveGameId(game.id);
                          setGameState('mission_select');
                        }
                      }}
                      className={\`w-full relative rounded-[3rem] p-4 transition-all flex flex-col items-center border-[6px] \${
                        isPlayable 
                          ? 'bg-white border-sky-300 shadow-[0_15px_30px_rgba(2,132,199,0.15)] active:translate-y-2 active:shadow-none hover:scale-[1.02]' 
                          : 'bg-gray-100 border-gray-200 opacity-90 cursor-not-allowed'
                      }\`}
                    >
                      <div className={\`w-full aspect-[2/1] rounded-[2rem] overflow-hidden relative mb-4 \${isPlayable ? 'bg-sky-100' : 'bg-gray-200 grayscale'}\`}>
                        {game.coverImage && (
                          <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                        )}
                        
                        {/* Mascot Decoration */}
                        {isPlayable && game.mascot === 'Bingo' && (
                          <img src="/mascots/bingo-happy.png" alt="Bingo" className="absolute -bottom-2 -right-2 w-32 h-32 object-contain drop-shadow-md" />
                        )}

                        {status === 'coming_soon' && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
                             <div className="bg-gray-800/80 text-white font-bold font-display px-6 py-3 rounded-full text-2xl tracking-wide backdrop-blur-sm border-2 border-gray-600/50 shadow-lg">
                               Coming Soon
                             </div>
                          </div>
                        )}

                        {status === 'locked' && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
                             <div className="bg-gray-800/80 text-white font-bold font-display px-6 py-3 rounded-full text-2xl tracking-wide backdrop-blur-sm border-2 border-gray-600/50 shadow-lg flex items-center gap-2">
                               <span className="text-3xl">🔒</span> Locked
                             </div>
                          </div>
                        )}

                        {status === 'completed' && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white font-bold font-display px-4 py-2 rounded-full text-xl tracking-wide border-4 border-green-300 shadow-[0_4px_15px_rgba(34,197,94,0.3)] flex items-center gap-2 z-10 animate-bounce-twice">
                            🌟 ทำครบแล้ว
                          </div>
                        )}
                      </div>
                      <h3 className={\`text-3xl font-display font-bold \${isPlayable ? 'text-sky-600' : 'text-gray-500'} mb-2 text-center\`}>
                        {game.title}
                      </h3>
                    </button>
                  );
                });
              })()}`;

if (appSrc.includes(oldGameCards)) {
  appSrc = appSrc.replace(oldGameCards, newGameCards);
} else {
  console.log("WARNING: Could not find oldGameCards EXACT match.");
  // Use regex to be safe
  const regex = /\{gameRegistry\.map\(\(game\) => \{[\s\S]*?\}\)\}/;
  appSrc = appSrc.replace(regex, newGameCards);
}

// 6. Update Game Complete UX (for Play All ending)
appSrc = appSrc.replace(
  '<h2 className="text-3xl font-bold text-green-600 mb-8 drop-shadow-sm tracking-wide bg-white/80 px-6 py-2 rounded-full border-2 border-green-200 relative z-30 mt-4">ทำครบ {levelASession.length} ภารกิจแล้ว!</h2>',
  '<h2 className="text-3xl font-bold text-green-600 mb-8 drop-shadow-sm tracking-wide bg-white/80 px-6 py-2 rounded-full border-2 border-green-200 relative z-30 mt-4">ทำภารกิจในการผจญภัยนี้ครบแล้ว!</h2>'
);

// We need to change "กลับหน้าเลือกด่าน" to "กลับไปเลือกเกม" and `setGameState('mission_select')` to `setGameState('game_select')` ONLY in the block:
// {isSessionMode && sessionIndex === levelASession.length - 1 ? (
//   ...
//   setGameState('mission_select');
//   ...
//   กลับหน้าเลือกด่าน
//   ...
// )

const sessionCompletedBlockRegex = /(isSessionMode && sessionIndex === levelASession\.length - 1 \? \([\s\S]*?)(setGameState\('mission_select'\);)([\s\S]*?)(กลับหน้าเลือกด่าน)([\s\S]*?\))/;

appSrc = appSrc.replace(sessionCompletedBlockRegex, '$1setGameState(\'game_select\');$3กลับไปเลือกเกม$5');

fs.writeFileSync('src/App.tsx', appSrc);
console.log('src/App.tsx updated.');
