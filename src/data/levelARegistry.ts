import { mission00, missionA2, missionA3, missionA4, missionA5, missionA6, mission_B1, mission_B2, mission_B3, mission_B4, mission_B5, mission_B6 } from './missions';
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
  , {
    mission: missionA6,
    cardImage: productsDB.toothbrushA.image,
    status: 'validated'
  }
, {
    mission: mission_B1,
    cardImage: productsDB.toothbrushA.image,
    status: 'enabled'
  }
, {
    mission: mission_B2,
    cardImage: productsDB.fryingPanYellow.image,
    status: 'enabled'
  }
, {
    mission: mission_B3,
    cardImage: productsDB.pillowBlue.image,
    status: 'enabled'
  }
, {
    mission: mission_B4,
    cardImage: productsDB.buildingBlocks.image,
    status: 'enabled'
  }
, {
    mission: mission_B5,
    cardImage: productsDB.sneakersPink.image,
    status: 'enabled'
  }
, {
    mission: mission_B6,
    cardImage: productsDB.shampooBlue.image,
    status: 'enabled'
  }
];

export const levelARegistry = levelAMissionCatalog.filter(
  entry => entry.status === 'enabled' || entry.status === 'validated'
);
