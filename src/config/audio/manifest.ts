export interface AudioAsset {
  id: string;
  character: 'bingo' | 'pillow';
  voiceId: string;
  text: string;
  output: string;
}

const VOICES = {
  bingo: 'YloftjPXmDNsV92Rk9z7',
  pillow: '5Pja6eJBiLWIwJOIGip8'
};

export const mission00Audio: AudioAsset[] = [
  { id: 'mission00.instruction', character: 'bingo', voiceId: VOICES.bingo, text: 'ช่วย Bingo หาแอปเปิลหน่อย!', output: '/audio/bingo/mission00/instruction.mp3' },
  { id: 'mission00.wrong_banana', character: 'bingo', voiceId: VOICES.bingo, text: 'นี่คือกล้วย ลองหาชิ้นอื่นดูนะ', output: '/audio/bingo/mission00/wrong-banana.mp3' },
  { id: 'mission00.wrong_soap', character: 'bingo', voiceId: VOICES.bingo, text: 'นี่คือสบู่ ลองหาชิ้นอื่นดูนะ', output: '/audio/bingo/mission00/wrong-soap.mp3' },
  { id: 'mission00.wrong_toothbrush', character: 'bingo', voiceId: VOICES.bingo, text: 'นี่คือแปรงสีฟัน ลองหาชิ้นอื่นดูนะ', output: '/audio/bingo/mission00/wrong-toothbrush.mp3' },
  { id: 'mission00.correct', character: 'bingo', voiceId: VOICES.bingo, text: 'เก่งมาก!', output: '/audio/bingo/mission00/correct.mp3' },
  { id: 'pillow.listen', character: 'pillow', voiceId: VOICES.pillow, text: 'ฟังนะ...', output: '/audio/pillow/shared/listen.mp3' },
  { id: 'pillow.repeat', character: 'pillow', voiceId: VOICES.pillow, text: 'พูดตาม Pillow นะ...', output: '/audio/pillow/shared/repeat.mp3' },
  { id: 'pillow.apple', character: 'pillow', voiceId: VOICES.pillow, text: 'Apple', output: '/audio/pillow/mission00/apple.mp3' }
];

export const audioManifest: Record<string, string> = {};
for (const asset of mission00Audio) {
  audioManifest[asset.text] = asset.output;
}