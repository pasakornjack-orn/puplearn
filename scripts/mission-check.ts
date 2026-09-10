import { levelAMissionCatalog } from '../src/data/levelARegistry';
import { validateMission, getAudioStatus } from './validation';

const args = process.argv.slice(2);
const targetMissionId = args[0];

if (!targetMissionId) {
  console.error("Please specify a mission ID to check. Example: npm run mission-check -- mission_A5");
  process.exit(1);
}

const catalogEntry = levelAMissionCatalog.find(e => e.mission.id === targetMissionId);
if (!catalogEntry) {
  console.error(`Mission '${targetMissionId}' not found in levelAMissionCatalog.`);
  process.exit(1);
}

const { mission, status } = catalogEntry;
console.log(`\nMission Check: ${mission.id}`);
console.log(`Catalog Status: ${status.toUpperCase()}`);
console.log('────────────────────────');

const strictAudio = (status === 'ready_to_enable' || status === 'enabled' || status === 'validated');
const structuralErrors = validateMission(mission, strictAudio);

let hasStructuralErrors = structuralErrors.length > 0;
if (hasStructuralErrors) {
  console.log('\nSTRUCTURAL ERRORS:');
  for (const err of structuralErrors) {
    console.error(`  ✗ ${err}`);
  }
} else {
  console.log('\nStructural check: ✓ PASSED');
}

console.log(`\nMission ${mission.id} — Audio Checklist\n`);

let totalAudio = 0;
let missingAudio = 0;

function renderAudioItem(audioId: string, text: string) {
  totalAudio++;
  const audioStatus = getAudioStatus(audioId);
  if (audioStatus.status === 'OK') {
    console.log(`✓ ${audioId}`);
    console.log(`  "${text}" (REUSE / EXISTS)`);
  } else {
    missingAudio++;
    const failMessage = audioStatus.status === 'MISSING_MAP' ? 'NOT MAPPED' : 'FILE PENDING';
    console.log(`○ ${audioId}`);
    console.log(`  text: "${text}"`);
    console.log(`  status: ${failMessage}`);
  }
  console.log('');
}

console.log('BINGO\n');
if (mission.dialogue) {
   if (mission.dialogue.instruction?.audioId) renderAudioItem(mission.dialogue.instruction.audioId, mission.dialogue.instruction.text);
   if (mission.dialogue.first_correct?.audioId) renderAudioItem(mission.dialogue.first_correct.audioId, mission.dialogue.first_correct.text);
   if (mission.dialogue.correct?.audioId) renderAudioItem(mission.dialogue.correct.audioId, mission.dialogue.correct.text);
   if (mission.dialogue.complete?.audioId) renderAudioItem(mission.dialogue.complete.audioId, mission.dialogue.complete.text);
}
if (mission.choices) {
   for (const choice of mission.choices) {
     if (choice.wrongFeedback?.audioId) {
        renderAudioItem(choice.wrongFeedback.audioId, choice.wrongFeedback.text);
     }
   }
}

if (mission.vocabularyConfigs && mission.vocabularyConfigs.length > 0) {
  console.log('PILLOW VOCABULARY\n');
  for (const vocab of mission.vocabularyConfigs) {
     if (vocab.audioId) renderAudioItem(vocab.audioId, vocab.text);
  }
}

console.log('SHARED — REUSE\n');
function renderSharedItem(audioId: string) {
  const s = getAudioStatus(audioId);
  if (s.status === 'OK') {
    console.log(`✓ ${audioId} (REUSE / EXISTS)`);
  } else {
    console.log(`✗ ${audioId} (MISSING SHARED ASSET!)`);
    hasStructuralErrors = true; // Shared assets must exist
  }
}
renderSharedItem('pillow.listen');
renderSharedItem('pillow.repeat');

console.log(`\nAudio complete: ${totalAudio - missingAudio}/${totalAudio} mission assets`);

console.log('\n────────────────────────');
console.log(`AUTHORING STATUS: ${status.toUpperCase()}`);

if (hasStructuralErrors) {
   console.log('Mission contains structural errors. It is not ready.');
   process.exit(1);
} else if (missingAudio > 0) {
   console.log(`${missingAudio} audio assets still required.`);
   if (strictAudio) {
     console.log('ERROR: Mission is marked ready/enabled but is missing audio!');
     process.exit(1);
   } else {
     console.log('This is expected for a draft/audio_pending mission.');
     process.exit(0);
   }
} else {
   if (status === 'draft' || status === 'audio_pending') {
     console.log('All structural and audio checks passed.');
     console.log('Mission is fully populated and READY TO ENABLE.');
     process.exit(0);
   } else if (status === 'ready_to_enable') {
     console.log('All structural and audio checks passed.');
     console.log('Mission is not currently child-facing.');
     process.exit(0);
   } else {
     console.log('Mission is enabled and all checks passed.');
     process.exit(0);
   }
}
