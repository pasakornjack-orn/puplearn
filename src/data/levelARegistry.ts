import { mission00, missionA2, missionA3, missionA4, missionA5 } from './missions';
import { productsDB } from './missions';
import type { Mission } from './missions';

export type MissionStatus =
  | 'draft'
  | 'audio_pending'
  | 'ready_to_enable'
  | 'enabled'
  | 'validated';

export interface CatalogEntry {
  mission: Mission;
  cardImage: string;
  status: MissionStatus;
}

export const levelAMissionCatalog: CatalogEntry[] = [
  { mission: mission00, cardImage: productsDB.apple.image, status: 'validated' },
  { mission: missionA2, cardImage: productsDB.banana.image, status: 'validated' },
  { mission: missionA3, cardImage: productsDB.redCar.image, status: 'validated' },
  { mission: missionA4, cardImage: productsDB.apple.image, status: 'validated' },
  { mission: missionA5, cardImage: productsDB.soap.image, status: 'validated' }
];

export const levelARegistry = levelAMissionCatalog.filter(
  entry => entry.status === 'enabled' || entry.status === 'validated'
);
