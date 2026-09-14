const fs = require('fs');

let txt = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add levelAMissionCatalog import
txt = txt.replace(
  "import { levelARegistry } from './data/levelARegistry';",
  "import { levelARegistry, levelAMissionCatalog } from './data/levelARegistry';"
);

// 2. Add dev-only effect
const newEffect = `
  // DEV PREVIEW HACK
  useEffect(() => {
    if (import.meta.env.DEV && window.location.hash.startsWith('#draft=')) {
      const draftId = window.location.hash.replace('#draft=', '');
      const entry = levelAMissionCatalog.find(e => e.mission.id === draftId);
      if (entry) {
        setActiveMission(entry.mission);
        setGameState('shopping'); // Start engine
      }
    }
  }, []);
`;

const stateIndex = txt.indexOf("const [isAudioMuted, setIsAudioMuted] = useState(");
// We'll insert it right after the states. Let's find a good spot.
const insertSpot = txt.indexOf("useEffect(() => {", stateIndex);

txt = txt.substring(0, insertSpot) + newEffect + txt.substring(insertSpot);

fs.writeFileSync('src/App.tsx', txt);
console.log('App.tsx updated');
