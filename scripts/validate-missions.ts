import { levelARegistry } from '../src/data/levelARegistry';
import { validateMission, getAudioStatus } from './validation';

console.log('Mission Validation');
console.log('────────────────────────\n');

let totalErrors = 0;
const missionIds = new Set<string>();

for (const entry of levelARegistry) {
  const mission = entry.mission;
  console.log(`Checking ${mission.id}...`);
  
  if (missionIds.has(mission.id)) {
    console.error(`  ✗ ERROR: Duplicate mission ID found in registry: ${mission.id}`);
    totalErrors++;
  }
  missionIds.add(mission.id);

  const errors = validateMission(mission, true);
  for (const err of errors) {
    console.error(`  ✗ ERROR: ${err}`);
    totalErrors++;
  }
}

console.log('Checking shared Pillow audio...');
const listenStatus = getAudioStatus('pillow.listen');
if (listenStatus.status !== 'OK') {
  console.error(`  ✗ ERROR: [Shared Pillow Listen] Missing or invalid audio`);
  totalErrors++;
}

const repeatStatus = getAudioStatus('pillow.repeat');
if (repeatStatus.status !== 'OK') {
  console.error(`  ✗ ERROR: [Shared Pillow Repeat] Missing or invalid audio`);
  totalErrors++;
}

console.log('\n────────────────────────');
if (totalErrors > 0) {
  console.error(`\nMISSION VALIDATION FAILED`);
  console.error(`${totalErrors} error(s) found.`);
  process.exit(1);
} else {
  console.log(`\nProducts       ✓`);
  console.log(`Targets        ✓`);
  console.log(`Dialogue       ✓`);
  console.log(`Vocabulary     ✓`);
  console.log(`Audio IDs      ✓`);
  console.log(`Audio files    ✓`);
  console.log(`Case matching  ✓\n`);
  console.log(`${missionIds.size} enabled missions validated.`);
  console.log(`\nMISSION VALIDATION PASSED`);
  process.exit(0);
}
