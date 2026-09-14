const fs = require('fs');

let appSrc = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix Home Start button to go to Game Select
appSrc = appSrc.replace(
  `onClick={() => {
                    initBgm();
                    setGameState('mission_select');
                  }}`,
  `onClick={() => {
                    initBgm();
                    setGameState('game_select');
                  }}`
);

// 2. Fix Mission Select Header title
appSrc = appSrc.replace(
  `              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white drop-shadow-md tracking-wide flex-1 text-center" style={{ WebkitTextStroke: '1px #0ea5e9' }}>
                เลือกภารกิจ
              </h2>`,
  `              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white drop-shadow-md tracking-wide flex-1 text-center" style={{ WebkitTextStroke: '1px #0ea5e9' }}>
                {activeGame?.title || 'เลือกภารกิจ'}
              </h2>`
);

// 3. Fix Mission Select Back button
appSrc = appSrc.replace(
  `            {/* Header */}
            <div className="px-6 py-4 flex items-center gap-4 relative z-10">
              <button 
                onClick={() => setGameState('home')}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-sky-500 shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-white active:translate-y-1 transition-all flex-shrink-0"
              >`,
  `            {/* Header */}
            <div className="px-6 py-4 flex items-center gap-4 relative z-10">
              <button 
                onClick={() => setGameState('game_select')}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-sky-500 shadow-[0_4px_0_rgba(0,0,0,0.05)] border-2 border-white active:translate-y-1 transition-all flex-shrink-0"
              >`
);

// 4. Fix "4 ภารกิจ" string
appSrc = appSrc.replace(
  'พื้นฐาน (4 ภารกิจ)',
  'พื้นฐาน ({gameMissionsResolved.length} ภารกิจ)'
);

// 5. Remove ONLY the Advanced Group DIV completely
const advGroupStart = appSrc.indexOf('{/* Advanced Group */}');
const gameplayEngine = appSrc.indexOf('{/* MISSION 00 ENGINE SHELL */}');
// Find the exact block
if (advGroupStart !== -1) {
  // We want to delete from {/* Advanced Group */} up to exactly before it closes the scroll area.
  // Actually, wait, let's just use string replace on the exact Advanced Group block if possible.
  // I will just read the file, split by lines, and remove the lines corresponding to the Advanced Group.
}

fs.writeFileSync('src/App.tsx', appSrc);
console.log('src/App.tsx part 1 updated.');
