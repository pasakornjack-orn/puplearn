export const mission00Audio = {
  instruction: "/audio/mission00/bingo/instruction.mp3",
  wrongBanana: "/audio/mission00/bingo/wrong-banana.mp3",
  wrongSoap: "/audio/mission00/bingo/wrong-soap.mp3",
  wrongToothbrush: "/audio/mission00/bingo/wrong-toothbrush.mp3",
  correct: "/audio/mission00/bingo/correct.mp3",

  pillowListen: "/audio/mission00/pillow/listen.mp3",
  pillowApple: "/audio/mission00/pillow/apple.mp3",
  pillowRepeat: "/audio/mission00/pillow/repeat.mp3",
  pillowAppleRepeat: "/audio/mission00/pillow/apple-repeat.mp3"
};

// Fallback mapping in case MP3s are missing
export const audioFallbackMap: Record<string, string> = {
  [mission00Audio.instruction]: 'ช่วย Bingo หาแอปเปิลหน่อย!',
  [mission00Audio.wrongBanana]: 'นี่คือกล้วย ลองหาชิ้นอื่นดูนะ',
  [mission00Audio.wrongSoap]: 'นี่คือสบู่ ลองหาชิ้นอื่นดูนะ',
  [mission00Audio.wrongToothbrush]: 'นี่คือแปรงสีฟัน ลองหาชิ้นอื่นดูนะ',
  [mission00Audio.correct]: 'เก่งมาก!',
  [mission00Audio.pillowListen]: 'ฟังนะ...',
  [mission00Audio.pillowApple]: 'Apple',
  [mission00Audio.pillowRepeat]: 'พูดตาม Pillow นะ...',
  [mission00Audio.pillowAppleRepeat]: 'Apple'
};

// Reverse mapping for Bingo gameplay which passes text directly
export const textToAudioMap: Record<string, string> = {
  'ช่วย Bingo หาแอปเปิลหน่อย!': mission00Audio.instruction,
  'นี่คือกล้วย ลองหาชิ้นอื่นดูนะ': mission00Audio.wrongBanana,
  'นี่คือสบู่ ลองหาชิ้นอื่นดูนะ': mission00Audio.wrongSoap,
  'นี่คือแปรงสีฟัน ลองหาชิ้นอื่นดูนะ': mission00Audio.wrongToothbrush,
  'เก่งมาก!': mission00Audio.correct,
  'Apple': mission00Audio.pillowApple,
};

export const getPillowSequence = (itemName: string) => {
  // Only explicitly supported for apple right now per Mission 00 requirement.
  // Fallback to dynamic paths if others are requested in the future.
  const nameLower = itemName.toLowerCase();
  
  return [
    { phaseId: 'listen1', audioPath: mission00Audio.pillowListen, fallbackText: 'ฟังนะ...', pauseAfterMs: 400 },
    { phaseId: 'listen2', audioPath: nameLower === 'apple' ? mission00Audio.pillowApple : `/audio/mission00/pillow/${nameLower}.mp3`, fallbackText: itemName, pauseAfterMs: 700, lang: 'en-US' as const },
    { phaseId: 'repeat1', audioPath: mission00Audio.pillowRepeat, fallbackText: 'พูดตาม Pillow นะ...', pauseAfterMs: 400 },
    { phaseId: 'repeat2', audioPath: nameLower === 'apple' ? mission00Audio.pillowAppleRepeat : `/audio/mission00/pillow/${nameLower}-repeat.mp3`, fallbackText: itemName, pauseAfterMs: 0, lang: 'en-US' as const }
  ];
};