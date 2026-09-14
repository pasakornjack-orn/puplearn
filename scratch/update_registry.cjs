const fs = require('fs');

let txt = fs.readFileSync('src/data/levelARegistry.ts', 'utf8');

// 1. Import mission_B1
txt = txt.replace(
  "import { mission00, missionA2, missionA3, missionA4, missionA5, missionA6 } from './missions';",
  "import { mission00, missionA2, missionA3, missionA4, missionA5, missionA6, mission_B1 } from './missions';"
);

// 2. Add to catalog
const newEntry = `, {
    mission: mission_B1,
    cardImage: productsDB.toothbrushA.image,
    status: 'draft'
  }
];`;

txt = txt.replace("];", newEntry);

fs.writeFileSync('src/data/levelARegistry.ts', txt);
console.log('levelARegistry.ts updated');
