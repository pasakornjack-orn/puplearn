const fs = require('fs');

let txt = fs.readFileSync('src/data/missions.ts', 'utf8');

// Add guideMascot to Mission type
txt = txt.replace(
  "layoutTemplate?: 'find-one' | 'color-hunt' | 'pick-two' | 'match-context';",
  "layoutTemplate?: 'find-one' | 'color-hunt' | 'pick-two' | 'match-context';\n  guideMascot?: 'Bingo' | 'Peter' | 'A-Chi' | 'Pillow';"
);

// Add guideMascot to mission_B1
txt = txt.replace(
  "layoutTemplate: 'match-context',",
  "layoutTemplate: 'match-context',\n  guideMascot: 'Peter',"
);

// Update mission_B1 wrong text (just conceptually in the config, though it's currently hardcoded in the interaction as 'ลองดูใหม่นะ' - wait, we should move that out later, but for now just the config).

fs.writeFileSync('src/data/missions.ts', txt);
console.log('missions.ts updated');
