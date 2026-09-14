const fs = require('fs');
let appSrc = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Home Start button
appSrc = appSrc.replace(/onClick=\{\(\) => \{\s*initBgm\(\);\s*setGameState\('mission_select'\);\s*\}\}/g, `onClick={() => {
                    initBgm();
                    setGameState('game_select');
                  }}`);

// 2. Header Back Button
appSrc = appSrc.replace(/<button\s*onClick=\{\(\) => setGameState\('home'\)\}([^>]*text-sky-500)/g, `<button 
                onClick={() => setGameState('game_select')}$1`);

// 3. Header title
appSrc = appSrc.replace(/>\s*เลือกภารกิจ\s*<\/h2>/g, `>
                {activeGame?.title || 'เลือกภารกิจ'}
              </h2>`);

fs.writeFileSync('src/App.tsx', appSrc);
console.log('src/App.tsx part 3 updated.');
