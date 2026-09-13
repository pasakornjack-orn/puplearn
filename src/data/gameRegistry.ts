import type { MascotType } from '../config/mascots';

export interface GameDefinition {
  id: string;
  title: string;
  coverImage?: string;
  mascot?: MascotType;
  missionIds: string[];
}

export const gameRegistry: GameDefinition[] = [
  {
    id: 'game_supermarket',
    title: 'Supermarket Adventure',
    coverImage: '/environments/supermarket-interior-bg.png',
    mascot: 'Bingo',
    missionIds: [
      'mission_00',
      'mission_A2',
      'mission_A3',
      'mission_A4',
      'mission_A5',
      'mission_A6'
    ]
  },
  {
    id: 'game_daily_life',
    title: "Bingo's Daily Life",
    coverImage: '/environments/mission-select-bg.png',
    mascot: 'Bingo',
    missionIds: [] // Coming soon
  }
];
