const fs = require('fs');

let txt = fs.readFileSync('src/data/missions.ts', 'utf8');

// 1. Extend Mission type
txt = txt.replace(
  "layoutTemplate?: 'find-one' | 'color-hunt' | 'pick-two';",
  "layoutTemplate?: 'find-one' | 'color-hunt' | 'pick-two' | 'match-context';\n  centralObjectId?: string;\n  contextChoices?: { id: string; image: string; wrongAudioId?: string }[];\n  targetContext?: string;"
);

// 2. Export ContextChoice type if needed by MatchContextInteraction
txt = txt.replace(
  "export type MissionChoice = {",
  "export type ContextChoice = { id: string; image: string; wrongAudioId?: string; };\n\nexport type MissionChoice = {"
);

// 3. Add mission_B1
const b1 = `
export const mission_B1: Mission = {
  id: 'mission_B1',
  level: 'B',
  instructionThai: 'แปรงสีฟันควรอยู่ที่ไหนนะ?',
  dialogue: {
    instruction: { text: 'แปรงสีฟันควรอยู่ที่ไหนนะ?', audioId: 'mission_B1.instruction' },
    correct: { text: 'เก่งมาก!', audioId: 'mission_B1.correct' }
  },
  requiredCategories: [],
  layoutTemplate: 'match-context',
  centralObjectId: 'toothbrushA',
  targetContext: 'bathroom',
  contextChoices: [
    { id: 'bathroom', image: '/contexts/bathroom-placeholder.png', wrongAudioId: 'mission_B1.wrong_bathroom' },
    { id: 'kitchen', image: '/contexts/kitchen-placeholder.png', wrongAudioId: 'mission_B1.wrong_kitchen' },
    { id: 'bedroom', image: '/contexts/bedroom-placeholder.png', wrongAudioId: 'mission_B1.wrong_bedroom' }
  ]
};
`;

txt += b1;

fs.writeFileSync('src/data/missions.ts', txt);
console.log('missions.ts updated');
