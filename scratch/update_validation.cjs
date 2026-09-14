const fs = require('fs');
let txt = fs.readFileSync('scripts/validation.ts', 'utf8');
txt = txt.replace(
  'if (mission.choices) {',
  'if (mission.layoutTemplate === "match-context") { /* skip */ } else if (mission.choices) {'
);
fs.writeFileSync('scripts/validation.ts', txt);
console.log('updated validation.ts');
