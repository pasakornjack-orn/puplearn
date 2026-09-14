const fs = require('fs');
let txt = fs.readFileSync('scripts/validation.ts', 'utf8');
txt = txt.replace(
  'if (mission.choices) {\n    if (mission.choices.length === 0)',
  'if (mission.layoutTemplate !== "match-context" && mission.choices) {\n    if (mission.choices.length === 0)'
);
fs.writeFileSync('scripts/validation.ts', txt);
console.log('updated validation.ts again');
