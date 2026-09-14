const fs = require('fs');

let txt = fs.readFileSync('src/engine/MissionEngine.tsx', 'utf8');

// 1. Add import
txt = txt.replace(
  "import ProductDisplayV2 from '../components/ProductDisplayV2';",
  "import ProductDisplayV2 from '../components/ProductDisplayV2';\nimport { MatchContextInteraction } from '../components/MatchContextInteraction';"
);

// 2. Add dispatch
const returnIndex = txt.lastIndexOf('return (');
const dispatch = `
  if (mission.layoutTemplate === 'match-context') {
    return (
      <MatchContextInteraction
        mission={mission}
        isAudioMuted={isAudioMuted}
        onComplete={() => onComplete(wrongTaps, replayCount)}
      />
    );
  }

  `;

txt = txt.substring(0, returnIndex) + dispatch + txt.substring(returnIndex);

fs.writeFileSync('src/engine/MissionEngine.tsx', txt);
console.log('MissionEngine.tsx updated');
