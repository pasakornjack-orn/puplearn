import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import configurations
import { levelARegistry } from '../src/data/levelARegistry';
import { productsDB } from '../src/data/missions';
import { audioIdMap } from '../src/config/audio/manifest';

// Get public dir
const publicDir = path.join(__dirname, '..', 'public');

let errors = 0;

function reportError(msg: string) {
  console.error(`  ✗ ERROR: ${msg}`);
  errors++;
}

// 1. Build a Set of all physical files under public/audio, with exact casing relative to public/
function getFilesRecursively(dir: string, base: string = ''): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const res = path.posix.join(base, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFilesRecursively(path.join(dir, entry.name), res));
    } else {
      files.push('/' + res);
    }
  }
  return files;
}

let physicalAudioFiles: Set<string> = new Set();
try {
  const audioDir = path.join(publicDir, 'audio');
  const files = getFilesRecursively(audioDir, 'audio');
  physicalAudioFiles = new Set(files);
} catch (e) {
  reportError("Could not read public/audio directory");
}

function checkAudioPath(expectedPath: string, context: string) {
  if (!expectedPath.endsWith('.mp3')) {
    reportError(`[${context}] Audio path does not end with .mp3: ${expectedPath}`);
    return;
  }
  
  const cleanPath = expectedPath.split('?')[0].split('#')[0];
  
  if (!physicalAudioFiles.has(cleanPath)) {
    // Check if it exists with different casing
    const lowerPath = cleanPath.toLowerCase();
    const matchCase = [...physicalAudioFiles].find(p => p.toLowerCase() === lowerPath);
    if (matchCase) {
      reportError(`[AUDIO_CASE_MISMATCH] [${context}] Manifest: ${cleanPath}, Physical: ${matchCase}`);
    } else {
      reportError(`[AUDIO_MISSING] [${context}] File not found in public/audio: ${cleanPath}`);
    }
  } else {
    // Verify it's not 0 bytes
    const fullPath = path.join(publicDir, cleanPath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      if (stats.size === 0) {
        reportError(`[AUDIO_EMPTY] [${context}] File is 0 bytes: ${cleanPath}`);
      }
    }
  }
}

function checkAudioId(audioId: string, context: string) {
  if (!audioIdMap[audioId]) {
    reportError(`[AUDIO_MISSING] [${context}] Audio ID not mapped in audioIdMap: ${audioId}`);
    return;
  }
  checkAudioPath(audioIdMap[audioId], `${context} -> ${audioId}`);
}

console.log('Mission Validation');
console.log('────────────────────────\n');

const missionIds = new Set<string>();

for (const entry of levelARegistry) {
  const mission = entry.mission;
  console.log(`Checking ${mission.id}...`);
  
  if (missionIds.has(mission.id)) {
    reportError(`Duplicate mission ID found in registry: ${mission.id}`);
  }
  missionIds.add(mission.id);

  if (!mission.layoutTemplate) {
    reportError(`[${mission.id}] Missing layoutTemplate`);
  }

  // Extract available choice IDs for cross-referencing
  const availableChoices = new Set<string>();
  if (mission.choices) {
    for (const choice of mission.choices) {
      availableChoices.add(choice.productId);
    }
  }

  // Check target configuration
  if (mission.targetIds) {
    const uniqueTargets = new Set<string>();
    for (const targetId of mission.targetIds) {
      if (uniqueTargets.has(targetId)) {
        reportError(`[${mission.id}] [DUPLICATE_TARGET] Duplicate targetId: ${targetId}`);
      }
      uniqueTargets.add(targetId);

      if (!productsDB[targetId]) {
        reportError(`[${mission.id}] targetId not found in productsDB: ${targetId}`);
      }

      if (mission.choices && !availableChoices.has(targetId)) {
        reportError(`[${mission.id}] [TARGET_NOT_IN_CHOICES] targetId '${targetId}' is not present in the choices array`);
      }
    }
    
    if (mission.targetCount !== undefined) {
      if (mission.targetCount <= 0) {
        reportError(`[${mission.id}] Invalid targetCount: ${mission.targetCount}`);
      }
      if (mission.targetCount > uniqueTargets.size) {
        reportError(`[${mission.id}] [INVALID_TARGET_COUNT] targetCount (${mission.targetCount}) cannot exceed number of UNIQUE targetIds (${uniqueTargets.size})`);
      }
    }
  }

  // Check choices
  if (mission.choices) {
    if (mission.choices.length === 0) {
      reportError(`[${mission.id}] Choices array is empty`);
    }
    const choiceIds = new Set<string>();
    for (const choice of mission.choices) {
      if (!productsDB[choice.productId]) {
        reportError(`[${mission.id}] Choice productId not found in productsDB: ${choice.productId}`);
      }
      if (choiceIds.has(choice.productId)) {
        reportError(`[${mission.id}] Duplicate choice productId: ${choice.productId}`);
      }
      choiceIds.add(choice.productId);

      if (choice.wrongAudioId) {
        checkAudioId(choice.wrongAudioId, `${mission.id} wrongAudioId for ${choice.productId}`);
      }
      if (choice.wrongFeedback?.audioId) {
        checkAudioId(choice.wrongFeedback.audioId, `${mission.id} wrongFeedback audio for ${choice.productId}`);
      }
      if (choice.wrongFeedback && (!choice.wrongFeedback.text || !choice.wrongFeedback.audioId)) {
        reportError(`[${mission.id}] Incomplete wrongFeedback for choice ${choice.productId}`);
      }
    }
  } else {
    reportError(`[${mission.id}] Missing choices array`);
  }

  // Check validation rule (find-attribute)
  if (mission.validation?.kind === 'attribute') {
    if (!mission.validation.field) reportError(`[${mission.id}] Missing validation.field`);
    if (!mission.validation.equals) reportError(`[${mission.id}] Missing validation.equals`);
    
    // Ensure at least one choice satisfies the attribute rule
    if (mission.choices && mission.validation.field && mission.validation.equals) {
      const hasSatisfyingChoice = mission.choices.some(c => {
        const product = productsDB[c.productId];
        return product && product[mission.validation!.field!] === mission.validation!.equals;
      });
      if (!hasSatisfyingChoice) {
        reportError(`[${mission.id}] No choice satisfies the attribute validation (${mission.validation.field} = ${mission.validation.equals})`);
      }
    }
  }

  // Check Dialogue
  if (mission.dialogue) {
    if (mission.dialogue.instruction) {
      if (!mission.dialogue.instruction.text || !mission.dialogue.instruction.audioId) {
        reportError(`[${mission.id}] Incomplete instruction dialogue (needs text and audioId)`);
      } else {
        checkAudioId(mission.dialogue.instruction.audioId, `${mission.id} dialogue.instruction`);
      }
    } else {
      reportError(`[${mission.id}] Missing dialogue.instruction`);
    }

    if (mission.dialogue.correct) {
      if (!mission.dialogue.correct.text || !mission.dialogue.correct.audioId) {
        reportError(`[${mission.id}] Incomplete correct dialogue (needs text and audioId)`);
      } else {
        checkAudioId(mission.dialogue.correct.audioId, `${mission.id} dialogue.correct`);
      }
    }

    if (mission.dialogue.complete) {
      if (!mission.dialogue.complete.text || !mission.dialogue.complete.audioId) {
        reportError(`[${mission.id}] Incomplete complete dialogue (needs text and audioId)`);
      } else {
        checkAudioId(mission.dialogue.complete.audioId, `${mission.id} dialogue.complete`);
      }
    }

    if (mission.dialogue.first_correct) {
      if (!mission.dialogue.first_correct.text || !mission.dialogue.first_correct.audioId) {
        reportError(`[${mission.id}] Incomplete first_correct dialogue (needs text and audioId)`);
      } else {
        checkAudioId(mission.dialogue.first_correct.audioId, `${mission.id} dialogue.first_correct`);
      }
    }

    // Require either correct or complete for standard missions
    if (!mission.dialogue.correct && !mission.dialogue.complete) {
      reportError(`[${mission.id}] Missing both dialogue.correct and dialogue.complete`);
    }
  } else {
    reportError(`[${mission.id}] Missing dialogue configuration`);
  }

  // Check Vocabulary
  if (mission.vocabularyConfigs) {
    for (const vocab of mission.vocabularyConfigs) {
      if (!vocab.text) reportError(`[${mission.id}] Vocabulary missing text`);
      if (!vocab.audioId) {
        reportError(`[${mission.id}] Vocabulary missing audioId`);
      } else {
        checkAudioId(vocab.audioId, `${mission.id} vocabulary ${vocab.text}`);
      }
      if (vocab.productId && !productsDB[vocab.productId]) {
        reportError(`[${mission.id}] Vocabulary productId not found in productsDB: ${vocab.productId}`);
      }
    }
    
    // Pick-n validation
    if (mission.layoutTemplate === 'pick-two' && mission.targetIds) {
      for (const targetId of mission.targetIds) {
        const hasVocab = mission.vocabularyConfigs.some(v => v.productId === targetId);
        if (!hasVocab) {
          reportError(`[${mission.id}] Pick-n target ${targetId} missing corresponding vocabularyConfig`);
        }
      }
    }
  }
}

// Check shared Pillow IDs
console.log(`Checking shared Pillow audio...`);
if (audioIdMap['pillow.listen']) checkAudioId('pillow.listen', 'Shared Pillow Listen');
if (audioIdMap['pillow.repeat']) checkAudioId('pillow.repeat', 'Shared Pillow Repeat');

console.log('\n────────────────────────');
if (errors > 0) {
  console.error(`\nMISSION VALIDATION FAILED`);
  console.error(`${errors} error(s) found.`);
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
