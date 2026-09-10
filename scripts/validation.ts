import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { productsDB } from '../src/data/missions';
import { audioIdMap } from '../src/config/audio/manifest';
import type { Mission } from '../src/data/missions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

export function getFilesRecursively(dir: string, base: string = ''): string[] {
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
  physicalAudioFiles = new Set(getFilesRecursively(audioDir, 'audio'));
} catch(e) {}

export type AudioStatus = 'OK' | 'MISSING_MAP' | 'MISSING_FILE' | 'CASE_MISMATCH' | 'EMPTY' | 'INVALID_EXT';

export interface AudioCheck {
  status: AudioStatus;
  path?: string;
  matchedCase?: string;
}

export function getAudioStatus(audioId: string): AudioCheck {
  if (!audioIdMap[audioId]) return { status: 'MISSING_MAP' };
  const expectedPath = audioIdMap[audioId];
  if (!expectedPath.endsWith('.mp3')) return { status: 'INVALID_EXT', path: expectedPath };
  const cleanPath = expectedPath.split('?')[0].split('#')[0];
  
  if (!physicalAudioFiles.has(cleanPath)) {
    const lowerPath = cleanPath.toLowerCase();
    const matchCase = [...physicalAudioFiles].find(p => p.toLowerCase() === lowerPath);
    if (matchCase) return { status: 'CASE_MISMATCH', path: cleanPath, matchedCase: matchCase };
    return { status: 'MISSING_FILE', path: cleanPath };
  }
  
  const fullPath = path.join(publicDir, cleanPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).size === 0) return { status: 'EMPTY', path: cleanPath };
  return { status: 'OK', path: cleanPath };
}

export function validateMission(mission: Mission, strictAudio: boolean): string[] {
  const errors: string[] = [];
  function reportError(msg: string) { errors.push(msg); }
  
  function checkAudioId(id: string, context: string) {
    const res = getAudioStatus(id);
    if (res.status === 'OK') return;
    
    // If we are not in strict audio mode (e.g. draft), missing maps/files are OK structurally
    if (!strictAudio && (res.status === 'MISSING_MAP' || res.status === 'MISSING_FILE')) {
      return; 
    }
    
    if (res.status === 'MISSING_MAP') reportError(`[AUDIO_MISSING] [${context}] Audio ID not mapped in audioIdMap: ${id}`);
    else if (res.status === 'MISSING_FILE') reportError(`[AUDIO_MISSING] [${context}] File not found in public/audio: ${res.path}`);
    else if (res.status === 'CASE_MISMATCH') reportError(`[AUDIO_CASE_MISMATCH] [${context}] Manifest: ${res.path}, Physical: ${res.matchedCase}`);
    else if (res.status === 'EMPTY') reportError(`[AUDIO_EMPTY] [${context}] File is 0 bytes: ${res.path}`);
    else if (res.status === 'INVALID_EXT') reportError(`[${context}] Audio path does not end with .mp3: ${res.path}`);
  }

  if (!mission.layoutTemplate) reportError(`[${mission.id}] Missing layoutTemplate`);

  const availableChoices = new Set<string>();
  if (mission.choices) {
    for (const choice of mission.choices) {
      availableChoices.add(choice.productId);
    }
  } else {
    reportError(`[${mission.id}] Missing choices array`);
  }

  if (mission.targetIds) {
    const uniqueTargets = new Set<string>();
    for (const targetId of mission.targetIds) {
      if (uniqueTargets.has(targetId)) reportError(`[${mission.id}] [DUPLICATE_TARGET] Duplicate targetId: ${targetId}`);
      uniqueTargets.add(targetId);
      
      if (!productsDB[targetId]) reportError(`[${mission.id}] targetId not found in productsDB: ${targetId}`);
      if (mission.choices && !availableChoices.has(targetId)) reportError(`[${mission.id}] [TARGET_NOT_IN_CHOICES] targetId '${targetId}' is not present in the choices array`);
    }
    
    if (mission.targetCount !== undefined) {
      if (mission.targetCount <= 0) reportError(`[${mission.id}] Invalid targetCount: ${mission.targetCount}`);
      if (mission.targetCount > uniqueTargets.size) reportError(`[${mission.id}] [INVALID_TARGET_COUNT] targetCount (${mission.targetCount}) cannot exceed number of UNIQUE targetIds (${uniqueTargets.size})`);
    }
  }

  if (mission.choices) {
    if (mission.choices.length === 0) reportError(`[${mission.id}] Choices array is empty`);
    const choiceIds = new Set<string>();
    for (const choice of mission.choices) {
      if (!productsDB[choice.productId]) reportError(`[${mission.id}] Choice productId not found in productsDB: ${choice.productId}`);
      if (choiceIds.has(choice.productId)) reportError(`[${mission.id}] Duplicate choice productId: ${choice.productId}`);
      choiceIds.add(choice.productId);
      
      if (choice.wrongAudioId) checkAudioId(choice.wrongAudioId, `${mission.id} wrongAudioId for ${choice.productId}`);
      if (choice.wrongFeedback?.audioId) checkAudioId(choice.wrongFeedback.audioId, `${mission.id} wrongFeedback audio for ${choice.productId}`);
      if (choice.wrongFeedback && (!choice.wrongFeedback.text || !choice.wrongFeedback.audioId)) {
        reportError(`[${mission.id}] Incomplete wrongFeedback for choice ${choice.productId}`);
      }
    }
  }

  if (mission.validation?.kind === 'attribute') {
    if (!mission.validation.field) reportError(`[${mission.id}] Missing validation.field`);
    if (!mission.validation.equals) reportError(`[${mission.id}] Missing validation.equals`);
    
    if (mission.choices && mission.validation.field && mission.validation.equals) {
      const hasSatisfyingChoice = mission.choices.some(c => {
        const product = productsDB[c.productId];
        return product && product[mission.validation!.field!] === mission.validation!.equals;
      });
      if (!hasSatisfyingChoice) reportError(`[${mission.id}] No choice satisfies the attribute validation (${mission.validation.field} = ${mission.validation.equals})`);
    }
  }

  if (mission.dialogue) {
    if (mission.dialogue.instruction) {
      if (!mission.dialogue.instruction.text || !mission.dialogue.instruction.audioId) reportError(`[${mission.id}] Incomplete instruction dialogue`);
      else checkAudioId(mission.dialogue.instruction.audioId, `${mission.id} dialogue.instruction`);
    } else {
      reportError(`[${mission.id}] Missing dialogue.instruction`);
    }

    if (mission.dialogue.correct) {
      if (!mission.dialogue.correct.text || !mission.dialogue.correct.audioId) reportError(`[${mission.id}] Incomplete correct dialogue`);
      else checkAudioId(mission.dialogue.correct.audioId, `${mission.id} dialogue.correct`);
    }

    if (mission.dialogue.complete) {
      if (!mission.dialogue.complete.text || !mission.dialogue.complete.audioId) reportError(`[${mission.id}] Incomplete complete dialogue`);
      else checkAudioId(mission.dialogue.complete.audioId, `${mission.id} dialogue.complete`);
    }

    if (mission.dialogue.first_correct) {
      if (!mission.dialogue.first_correct.text || !mission.dialogue.first_correct.audioId) reportError(`[${mission.id}] Incomplete first_correct dialogue`);
      else checkAudioId(mission.dialogue.first_correct.audioId, `${mission.id} dialogue.first_correct`);
    }

    if (!mission.dialogue.correct && !mission.dialogue.complete) reportError(`[${mission.id}] Missing both dialogue.correct and dialogue.complete`);
  } else {
    reportError(`[${mission.id}] Missing dialogue configuration`);
  }

  if (mission.vocabularyConfigs) {
    for (const vocab of mission.vocabularyConfigs) {
      if (!vocab.text) reportError(`[${mission.id}] Vocabulary missing text`);
      if (!vocab.audioId) reportError(`[${mission.id}] Vocabulary missing audioId`);
      else checkAudioId(vocab.audioId, `${mission.id} vocabulary ${vocab.text}`);
      if (vocab.productId && !productsDB[vocab.productId]) reportError(`[${mission.id}] Vocabulary productId not found in productsDB: ${vocab.productId}`);
    }
    
    if (mission.layoutTemplate === 'pick-two' && mission.targetIds) {
      for (const targetId of mission.targetIds) {
        const hasVocab = mission.vocabularyConfigs.some(v => v.productId === targetId);
        if (!hasVocab) reportError(`[${mission.id}] Pick-n target ${targetId} missing corresponding vocabularyConfig`);
      }
    }
  }
  
  return errors;
}
