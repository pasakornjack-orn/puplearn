export type MascotType = 'Bingo' | 'Peter' | 'A-Chi' | 'Pillow';
export type MascotEmotion = 'guide' | 'happy' | 'thinking' | 'hint' | 'neutral' | 'money' | 'asking';

export const getMascotAsset = (mascot: MascotType, emotion: MascotEmotion): string => {
  if (mascot === 'Bingo') {
    return emotion === 'happy' ? '/mascots/bingo-happy.png' : '/mascots/bingo-guide.png';
  }
  if (mascot === 'Peter') {
    return emotion === 'hint' ? '/mascots/peter-hint.png' : '/mascots/peter-thinking.png';
  }
  if (mascot === 'A-Chi') {
    return emotion === 'money' ? '/mascots/a-chi-money.png' : '/mascots/a-chi-neutral.png';
  }
  if (mascot === 'Pillow') {
    return emotion === 'happy' ? '/mascots/pillow-happy.png' : '/mascots/pillow-asking.png';
  }
  return '/mascots/bingo-guide.png'; // Fallback
};

export const getMascotTheme = (mascot: MascotType) => {
  switch (mascot) {
    case 'Bingo': return { bg: 'bg-yellow-100', border: 'border-yellow-400', nameColor: 'text-yellow-700' };
    case 'Peter': return { bg: 'bg-purple-100', border: 'border-purple-400', nameColor: 'text-purple-700' };
    case 'A-Chi': return { bg: 'bg-orange-100', border: 'border-orange-400', nameColor: 'text-orange-700' };
    case 'Pillow': return { bg: 'bg-blue-100', border: 'border-blue-400', nameColor: 'text-blue-700' };
  }
};
