const fs = require('fs');

let txt = fs.readFileSync('src/data/gameRegistry.ts', 'utf8');

// Add mission_B1 to game_daily_life
txt = txt.replace(
  "missionIds: [] // Coming soon",
  "missionIds: ['mission_B1'] // Draft"
);

fs.writeFileSync('src/data/gameRegistry.ts', txt);
console.log('gameRegistry.ts updated');
