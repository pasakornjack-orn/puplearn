const fs = require('fs');
let txt = fs.readFileSync('src/components/MatchContextInteraction.tsx', 'utf8');

// Use mission.guideMascot
txt = txt.replace(/mascot: 'Bingo',/g, "mascot: mission.guideMascot || 'Bingo',");
txt = txt.replace(/mascot={hintMessage\?\.mascot \|\| 'Bingo'}/g, "mascot={hintMessage?.mascot || mission.guideMascot || 'Bingo'}");

// Remove border-red-400
txt = txt.replace(/animate-friendly-wiggle border-red-400/g, "animate-friendly-wiggle");

fs.writeFileSync('src/components/MatchContextInteraction.tsx', txt);
console.log('MatchContextInteraction.tsx updated');
