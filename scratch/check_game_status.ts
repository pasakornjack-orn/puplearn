import { gameRegistry } from './src/data/gameRegistry.js';
import { levelARegistry } from './src/data/levelARegistry.js';
import { getGameStatus } from './src/utils/gameProgress.js';

const g2 = gameRegistry.find(g => g.id === 'game_daily_life');
const rawCount = g2.missionIds.length;
const playable = g2.missionIds.map(id => levelARegistry.find(r => r.mission.id === id)).filter(x => x);
const resolvedCount = playable.length;
const status = getGameStatus(g2, 1, {}, 'available');

console.log(`Raw: ${rawCount}`);
console.log(`Resolved: ${resolvedCount}`);
console.log(`Status: ${status}`);
