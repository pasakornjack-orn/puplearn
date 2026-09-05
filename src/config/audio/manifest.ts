export const audioAssets = {
  bgm: '/audio/bgm/supermarket-loop.mp3',

  pillowListen: '/audio/vocabulary/listen.mp3',
  pillowRepeat: '/audio/vocabulary/repeat.mp3',
  vocabApple: '/audio/vocabulary/apple.mp3',
  vocabBanana: '/audio/vocabulary/banana.mp3',
  vocabRed: '/audio/vocabulary/red.mp3',

  m00Instruction: '/audio/mission00/bingo/instruction.mp3',
  m00WrongBanana: '/audio/mission00/bingo/wrong-banana.mp3',
  m00WrongSoap: '/audio/mission00/bingo/wrong-soap.mp3',
  m00WrongToothbrush: '/audio/mission00/bingo/wrong-toothbrush.mp3',
  m00Correct: '/audio/mission00/bingo/correct.mp3',

  a2Instruction: '/audio/a2/bingo/instruction.mp3',
  a2WrongApple: '/audio/a2/bingo/wrong-apple.mp3',
  a2WrongSoap: '/audio/a2/bingo/wrong-soap.mp3',
  a2WrongToothbrush: '/audio/a2/bingo/wrong-toothbrush.mp3',
  a2Correct: '/audio/a2/bingo/correct.mp3',

  a3Instruction: '/audio/a3/bingo/instruction.mp3',
  a3WrongBlue: '/audio/a3/bingo/wrong-blue.mp3',
  a3WrongGreen: '/audio/a3/bingo/wrong-green.mp3',
  a3WrongYellow: '/audio/a3/bingo/wrong-yellow.mp3',
  a3Correct: '/audio/a3/bingo/correct.mp3',

  a4Instruction: '/audio/a4/bingo/instruction.mp3',
  a4WrongSoap: '/audio/a4/bingo/wrong-soap.mp3',
  a4WrongToothbrush: '/audio/a4/bingo/wrong-toothbrush.mp3',
  a4FirstCorrect: '/audio/a4/bingo/first-correct.mp3',
  a4Complete: '/audio/a4/bingo/complete.mp3',
};

// Primary mapping from audioId to MP3 path – source of truth for production audio
export const audioIdMap: Record<string, string> = {
  // Mission 00
  'mission_00.instruction': audioAssets.m00Instruction,
  'mission_00.wrong_banana': audioAssets.m00WrongBanana,
  'mission_00.wrong_soap': audioAssets.m00WrongSoap,
  'mission_00.wrong_toothbrush': audioAssets.m00WrongToothbrush,
  'mission_00.correct': audioAssets.m00Correct,
  // Mission A2
  'mission_A2.instruction': audioAssets.a2Instruction,
  'mission_A2.wrong_apple': audioAssets.a2WrongApple,
  'mission_A2.wrong_soap': audioAssets.a2WrongSoap,
  'mission_A2.wrong_toothbrush': audioAssets.a2WrongToothbrush,
  'mission_A2.correct': audioAssets.a2Correct,
  // Mission A3
  'mission_A3.instruction': audioAssets.a3Instruction,
  'mission_A3.wrong_blue': audioAssets.a3WrongBlue,
  'mission_A3.wrong_green': audioAssets.a3WrongGreen,
  'mission_A3.wrong_yellow': audioAssets.a3WrongYellow,
  'mission_A3.correct': audioAssets.a3Correct,
  // Mission A4
  'mission_A4.instruction': audioAssets.a4Instruction,
  'mission_A4.wrong_soap': audioAssets.a4WrongSoap,
  'mission_A4.wrong_toothbrush': audioAssets.a4WrongToothbrush,
  'mission_A4.first_correct': audioAssets.a4FirstCorrect,
  'mission_A4.complete': audioAssets.a4Complete,
  // Vocabulary (Pillow)
  'vocab.apple': audioAssets.vocabApple,
  'vocab.banana': audioAssets.vocabBanana,
  'vocab.red': audioAssets.vocabRed,
  // Pillow prompt assets
  'pillow.listen': audioAssets.pillowListen,
  'pillow.repeat': audioAssets.pillowRepeat,
};

/** Resolve MP3 path with priority: audioIdMap → textToAudioMap → null (fallback to TTS) */
export const resolveAudioPath = (audioId?: string, text?: string): string | null => {
  if (audioId && audioIdMap[audioId]) {
    return audioIdMap[audioId];
  }
  if (text && textToAudioMap[text]) {
    return textToAudioMap[text];
  }
  return null;
};





// Provide exact mapping via audioId string keys
export const textToAudioMap: Record<string, string> = {
  // Mission 00
  'mission_00.instruction': audioAssets.m00Instruction,
  'mission_00.wrong_banana': audioAssets.m00WrongBanana,
  'mission_00.wrong_soap': audioAssets.m00WrongSoap,
  'mission_00.wrong_toothbrushA': audioAssets.m00WrongToothbrush,
  'mission_00.wrong_toothbrushB': audioAssets.m00WrongToothbrush,
  'mission_00.correct': audioAssets.m00Correct,

  // Mission A2
  'mission_A2.instruction': audioAssets.a2Instruction,
  'mission_A2.wrong_apple': audioAssets.a2WrongApple,
  'mission_A2.wrong_soap': audioAssets.a2WrongSoap,
  'mission_A2.wrong_toothbrushA': audioAssets.a2WrongToothbrush,
  'mission_A2.wrong_toothbrushB': audioAssets.a2WrongToothbrush,
  'mission_A2.correct': audioAssets.a2Correct,

  // Mission A3
  'mission_A3.instruction': audioAssets.a3Instruction,
  'mission_A3.wrong_blueBall': audioAssets.a3WrongBlue,
  'mission_A3.wrong_blueCar': audioAssets.a3WrongBlue,
  'mission_A3.wrong_yellowDuck': audioAssets.a3WrongYellow,
  'mission_A3.wrong_greenLeaf': audioAssets.a3WrongGreen,
  'mission_A3.correct': audioAssets.a3Correct,

  // Mission A4
  'mission_A4.instruction': audioAssets.a4Instruction,
  'mission_A4.wrong_soap': audioAssets.a4WrongSoap,
  'mission_A4.wrong_toothbrushA': audioAssets.a4WrongToothbrush,
  'mission_A4.wrong_toothbrushB': audioAssets.a4WrongToothbrush,
  'mission_A4.first_correct': audioAssets.a4FirstCorrect,
  'mission_A4.complete': audioAssets.a4Complete,

  // Fallbacks by exact Thai text as final net
  'ช่วย Bingo หาแอปเปิลหน่อย!': audioAssets.m00Instruction,
  'นี่คือกล้วย ลองหาชิ้นอื่นดูนะ': audioAssets.m00WrongBanana,
  'นี่คือสบู่ ลองหาชิ้นอื่นดูนะ': audioAssets.m00WrongSoap,
  'นี่คือแปรงสีฟัน ลองหาชิ้นอื่นดูนะ': audioAssets.m00WrongToothbrush,
  'เก่งมาก!': audioAssets.m00Correct,
  'ช่วย Bingo หากล้วยหน่อย!': audioAssets.a2Instruction,
  'นี่คือแอปเปิล ลองหาชิ้นอื่นดูนะ': audioAssets.a2WrongApple,
  'ช่วย Bingo หาของสีแดงหน่อย!': audioAssets.a3Instruction,
  'ช่วย Bingo เลือกผลไม้ 2 อย่างหน่อย!': audioAssets.a4Instruction,
  
  // Vocabulary single-word taps
  'Apple': audioAssets.vocabApple,
  'Banana': audioAssets.vocabBanana,
  'Red': audioAssets.vocabRed,
};

// Fallback text mapped from MP3 paths in case of failure
export const audioFallbackMap: Record<string, string> = {
  [audioAssets.m00Instruction]: 'ช่วย Bingo หาแอปเปิลหน่อย!',
  [audioAssets.m00WrongBanana]: 'นี่คือกล้วย ลองหาชิ้นอื่นดูนะ',
  [audioAssets.m00WrongSoap]: 'นี่คือสบู่ ลองหาชิ้นอื่นดูนะ',
  [audioAssets.m00WrongToothbrush]: 'นี่คือแปรงสีฟัน ลองหาชิ้นอื่นดูนะ',
  [audioAssets.m00Correct]: 'เก่งมาก!',

  [audioAssets.a2Instruction]: 'ช่วย Bingo หากล้วยหน่อย!',
  [audioAssets.a2WrongApple]: 'นี่คือแอปเปิล ลองหาชิ้นอื่นดูนะ',
  [audioAssets.a2WrongSoap]: 'นี่คือสบู่ ลองหาชิ้นอื่นดูนะ',
  [audioAssets.a2WrongToothbrush]: 'นี่คือแปรงสีฟัน ลองหาชิ้นอื่นดูนะ',
  [audioAssets.a2Correct]: 'เก่งมาก!',

  [audioAssets.a3Instruction]: 'ช่วย Bingo หาของสีแดงหน่อย!',
  [audioAssets.a3WrongBlue]: 'นี่คือสีฟ้า ลองหาชิ้นอื่นดูนะ',
  [audioAssets.a3WrongGreen]: 'นี่คือสีเขียว ลองหาชิ้นอื่นดูนะ',
  [audioAssets.a3WrongYellow]: 'นี่คือสีเหลือง ลองหาชิ้นอื่นดูนะ',
  [audioAssets.a3Correct]: 'เก่งมาก!',

  [audioAssets.a4Instruction]: 'ช่วย Bingo เลือกผลไม้ 2 อย่างหน่อย!',
  [audioAssets.a4WrongSoap]: 'อันนี้ไม่ใช่ผลไม้นะ',
  [audioAssets.a4WrongToothbrush]: 'อันนี้ไม่ใช่ผลไม้นะ',
  [audioAssets.a4FirstCorrect]: 'เยี่ยมไปเลย! หาอีก 1 อย่างนะ',
  [audioAssets.a4Complete]: 'เก่งมาก!',
  
  [audioAssets.pillowListen]: 'ฟังนะ...',
  [audioAssets.pillowRepeat]: 'พูดตาม Pillow นะ...',
  [audioAssets.vocabApple]: 'Apple',
  [audioAssets.vocabBanana]: 'Banana',
  [audioAssets.vocabRed]: 'Red',
};

export const getPillowSequence = (itemName: string, englishTextOverride?: string) => {
  const nameLower = itemName.toLowerCase();
  let wordAudioPath = audioAssets.vocabApple; // default fallback

  if (nameLower === 'apple') wordAudioPath = audioAssets.vocabApple;
  else if (nameLower === 'banana') wordAudioPath = audioAssets.vocabBanana;
  else if (nameLower === 'red') wordAudioPath = audioAssets.vocabRed;
  else if (nameLower.includes('apple')) wordAudioPath = audioAssets.vocabApple;
  else if (nameLower.includes('banana')) wordAudioPath = audioAssets.vocabBanana;
  else wordAudioPath = `/audio/vocabulary/${nameLower}.mp3`;

  const fallbackText = englishTextOverride || itemName;

  return [
    { phaseId: 'listen1', audioPath: audioAssets.pillowListen, fallbackText: 'ฟังนะ...', pauseAfterMs: 400 },
    { phaseId: 'listen2', audioPath: wordAudioPath, fallbackText: fallbackText, pauseAfterMs: 700, lang: 'en-US' as const },
    { phaseId: 'repeat1', audioPath: audioAssets.pillowRepeat, fallbackText: 'พูดตาม Pillow นะ...', pauseAfterMs: 400 },
    { phaseId: 'repeat2', audioPath: wordAudioPath, fallbackText: fallbackText, pauseAfterMs: 0, lang: 'en-US' as const }
  ];
};