const fs = require('fs');

let txt = fs.readFileSync('src/data/missions.ts', 'utf8');

txt = txt.replace('/contexts/bathroom-placeholder.png', '/environments/bathroom.png');
txt = txt.replace('/contexts/kitchen-placeholder.png', '/environments/kitchen.png');
txt = txt.replace('/contexts/bedroom-placeholder.png', '/environments/bedroom.png');

// Update correct text to "ใช่แล้ว!" 
txt = txt.replace("correct: { text: 'เก่งมาก!'", "correct: { text: 'ใช่แล้ว!'");

fs.writeFileSync('src/data/missions.ts', txt);
console.log('missions.ts updated with final art paths and correct text.');
