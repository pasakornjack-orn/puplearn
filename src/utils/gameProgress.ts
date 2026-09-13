import type { GameDefinition } from '../data/gameRegistry';
import { levelARegistry } from '../data/levelARegistry';

export type AdventureState = 'coming_soon' | 'locked' | 'available' | 'completed';

export function getGameStatus(
  game: GameDefinition,
  index: number,
  completedMissions: Record<string, boolean>,
  previousGameStatus: AdventureState | null
): AdventureState {
  const playableMissions = game.missionIds
    .map(id => levelARegistry.find(r => r.mission.id === id))
    .filter((entry): entry is typeof levelARegistry[0] => entry !== undefined);

  if (playableMissions.length === 0) {
    return 'coming_soon';
  }

  const isComplete = playableMissions.every(m => completedMissions[m.mission.id] === true);

  if (isComplete) {
    return 'completed';
  }

  if (index === 0 || previousGameStatus === 'completed') {
    return 'available';
  }

  return 'locked';
}
