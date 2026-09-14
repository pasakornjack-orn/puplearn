const fs = require('fs');

let txt = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix Background
const oldBg = `{gameState !== 'home' && gameState !== 'mission_select' && gameState !== 'game_select' ? (
          <>
            <img src="/environments/supermarket-interior-bg.png" alt="Supermarket Interior" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
          </>
        ) : (`;
const newBg = `{gameState !== 'home' && gameState !== 'mission_select' && gameState !== 'game_select' ? (
          activeMission.layoutTemplate === 'match-context' ? (
             <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-amber-50"></div>
          ) : (
            <>
              <img src="/environments/supermarket-interior-bg.png" alt="Supermarket Interior" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
            </>
          )
        ) : (`;
txt = txt.replace(oldBg, newBg);

// 2. Fix MissionEngine route
const oldEngine = `{(gameState === 'shopping' || gameState === 'english_interaction') && levelASession.some(m => m.id === activeMission.id) && (`;
const newEngine = `{(gameState === 'shopping' || gameState === 'english_interaction') && (levelASession.some(m => m.id === activeMission.id) || activeMission.layoutTemplate === 'match-context') && (`;
txt = txt.replace(oldEngine, newEngine);

// 3. Fix Fallback route
const oldFallback = `{gameState === 'shopping' && !levelASession.some(m => m.id === activeMission.id) && (`;
const newFallback = `{gameState === 'shopping' && !levelASession.some(m => m.id === activeMission.id) && activeMission.layoutTemplate !== 'match-context' && (`;
txt = txt.replace(oldFallback, newFallback);

fs.writeFileSync('src/App.tsx', txt);
console.log('App.tsx updated to fix shell regression');
