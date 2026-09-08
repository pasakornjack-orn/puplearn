export type Product = {
  id: string;
  name: string;
  englishName: string;
  price: number;
  image: string; // URL or emoji placeholder
  color: string; // UI theme color
  colorName?: string; // Logical color for learning (e.g., 'red', 'yellow')
  category: 'toothbrush' | 'toothpaste' | 'soap' | 'food' | 'other' | 'toy';
};


export type DialogueFeedback = {
  text: string;
  audioId: string;
};

export type MissionChoice = {
  productId: string;
  wrongAudioId?: string;
  wrongFeedback?: DialogueFeedback;
};

export type MissionLevel = 'A' | 'B' | 'C' | 'D';

export type MissionDialogue = {
  instruction: DialogueFeedback;
  correct?: DialogueFeedback;
  first_correct?: DialogueFeedback;
  complete?: DialogueFeedback;
};

export type Mission = {
  id: string;
  level: MissionLevel;
  instructionThai: string;
  dialogue?: MissionDialogue;
  budget?: number; // Optional for Level A
  requiredCategories: { category: string; quantity: number }[];
  targetIds?: string[]; // Used for Level A explicitly
  targetColor?: string; // Used for color hunt
  targetCount?: number; // How many items needed to complete
  layoutTemplate?: 'find-one' | 'color-hunt' | 'pick-two';
  validation?: {
    kind: 'attribute';
    field: keyof Product;
    equals: string | number;
  };
  englishTeachingText?: string;
  vocabularyConfigs?: { text: string; audioId: string }[];
  // Level A mission-specific choices (source of truth)
  choices?: MissionChoice[];
  // Legacy fallback for missions using direct product list (e.g., Mission07)
  products?: Product[];
};

export const productsDB: Record<string, Product> = {
  toothbrushA: {
    id: 'toothbrushA',
    name: 'แปรงสีฟัน',
    englishName: 'Toothbrush',
    price: 8,
    image: '/products/toothbrush-blue.png',
    color: 'bg-cyan-100 border-cyan-400',
    colorName: 'blue',
    category: 'toothbrush',

  },
  toothbrushB: {
    id: 'toothbrushB',
    name: 'แปรงสีฟัน',
    englishName: 'Toothbrush',
    price: 12,
    image: '/products/toothbrush-pink.png',
    color: 'bg-fuchsia-100 border-fuchsia-400',
    colorName: 'pink',
    category: 'toothbrush'
  },
  toothpasteA: {
    id: 'toothpasteA',
    name: 'ยาสีฟัน',
    englishName: 'Toothpaste',
    price: 7,
    image: '/products/toothpaste-pink.png',
    color: 'bg-rose-100 border-rose-400',
    colorName: 'pink',
    category: 'toothpaste'
  },
  toothpasteB: {
    id: 'toothpasteB',
    name: 'ยาสีฟัน',
    englishName: 'Toothpaste',
    price: 15,
    image: '/products/toothpaste-mint.png',
    color: 'bg-green-100 border-green-400',
    colorName: 'green',
    category: 'toothpaste'
  },
  soap: {
    id: 'soap',
    name: 'สบู่',
    englishName: 'Soap',
    price: 6,
    image: '/products/soap.png',
    color: 'bg-sky-100 border-sky-400',
    colorName: 'blue',
    category: 'soap',

  },
  apple: {
    id: 'apple',
    name: 'แอปเปิล',
    englishName: 'Apple',
    price: 5,
    image: '/products/apple.png',
    color: 'bg-red-100 border-red-400',
    colorName: 'red',
    category: 'food',

  },
  banana: {
    id: 'banana',
    name: 'กล้วย',
    englishName: 'Banana',
    price: 5,
    image: '/products/banana.png',
    color: 'bg-yellow-100 border-yellow-400',
    colorName: 'yellow',
    category: 'food',

  },
  redBall: {
    id: 'redBall',
    name: 'ลูกบอลแดง',
    englishName: 'Red Ball',
    price: 10,
    image: '/products/ball-red.png',
    color: 'bg-red-50 border-red-300',
    colorName: 'red',
    category: 'toy'
  },
  blueBall: {
    id: 'blueBall',
    name: 'ลูกบอลฟ้า',
    englishName: 'Blue Ball',
    price: 10,
    image: '/products/ball-blue.png',
    color: 'bg-blue-50 border-blue-300',

    category: 'toy'
  },
  redCar: {
    id: 'redCar',
    name: 'รถแดง',
    englishName: 'Red Car',
    price: 15,
    image: '/products/toy-car-red.png',
    color: 'bg-red-50 border-red-300',
    colorName: 'red',
    category: 'toy'
  },
  blueCar: {
    id: 'blueCar',
    name: 'รถฟ้า',
    englishName: 'Blue Car',
    price: 15,
    image: '/products/toy-car-blue.png',
    color: 'bg-blue-50 border-blue-300',
    colorName: 'blue',
    category: 'toy'
  },
  strawberry: {
    id: 'strawberry',
    name: 'สตรอว์เบอร์รี',
    englishName: 'Strawberry',
    price: 5,
    image: '/products/strawberry.png',
    color: 'bg-red-50 border-red-300',
    colorName: 'red',
    category: 'food'
  },
  yellowDuck: {
    id: 'yellowDuck',
    name: 'เป็ดยาง',
    englishName: 'Rubber Duck',
    price: 8,
    image: '/products/rubber-duck-yellow.png',
    color: 'bg-yellow-50 border-yellow-300',
    colorName: 'yellow',
    category: 'toy',

  },
  greenLeaf: {
    id: 'greenLeaf',
    name: 'ใบไม้',
    englishName: 'Leaf',
    price: 1,
    image: '/products/leaf-green.png',
    color: 'bg-green-50 border-green-300',
    colorName: 'green',
    category: 'other',

  },
  teddyBear: {
    id: 'teddyBear',
    name: 'ตุ๊กตาหมี',
    englishName: 'Teddy Bear',
    price: 20,
    image: '/products/teddy-bear.png',
    color: 'bg-amber-50 border-amber-300',
    colorName: 'brown',
    category: 'toy'
  }
};

export const mission00: Mission = {
    id: 'mission_00',
    level: 'A',
    instructionThai: 'ช่วย Bingo หาแอปเปิลหน่อย!',
    dialogue: {
      instruction: { text: 'ช่วย Bingo หาแอปเปิลหน่อย!', audioId: 'mission_00.instruction' },
      correct: { text: 'ใช่แล้ว! แอปเปิล!', audioId: 'mission_00.correct' }
    },
    requiredCategories: [],
    targetIds: ['apple'],
    targetCount: 1,
    layoutTemplate: 'find-one',
    englishTeachingText: 'Apple',
    vocabularyConfigs: [{ text: 'Apple', audioId: 'vocab.apple' }],
    choices: [
    { productId: 'apple' },
    { productId: 'banana', wrongAudioId: 'mission_00.wrong_banana', wrongFeedback: { text: 'นี่คือกล้วย... ลองหาแอปเปิลอีกทีนะ!', audioId: 'mission_00.wrong_banana' } },
    { productId: 'soap', wrongAudioId: 'mission_00.wrong_soap', wrongFeedback: { text: 'นี่คือสบู่... อันนี้ไม่ใช่ผลไม้นะ', audioId: 'mission_00.wrong_soap' } },
    { productId: 'toothbrushA', wrongAudioId: 'mission_00.wrong_toothbrush', wrongFeedback: { text: 'นี่คือแปรงสีฟัน... ลองหาแอปเปิลอีกทีนะ!', audioId: 'mission_00.wrong_toothbrush' } }
  ]
};


export const missionA2: Mission = {
    id: 'mission_A2',
    level: 'A',
    instructionThai: 'ช่วย Bingo หากล้วยหน่อย!',
    dialogue: {
      instruction: { text: 'ช่วย Bingo หากล้วยหน่อย!', audioId: 'mission_A2.instruction' },
      correct: { text: 'ใช่แล้ว! กล้วย!', audioId: 'mission_A2.correct' }
    },
    requiredCategories: [],
    targetIds: ['banana'],
    targetCount: 1,
    layoutTemplate: 'find-one',
    englishTeachingText: 'Banana',
    vocabularyConfigs: [{ text: 'Banana', audioId: 'vocab.banana' }],
    choices: [
    { productId: 'banana' },
    { productId: 'apple', wrongAudioId: 'mission_A2.wrong_apple', wrongFeedback: { text: 'นี่คือแอปเปิล... ลองหากล้วยอีกทีนะ!', audioId: 'mission_A2.wrong_apple' } },
    { productId: 'soap', wrongAudioId: 'mission_A2.wrong_soap', wrongFeedback: { text: 'นี่คือสบู่... ลองหากล้วยอีกทีนะ!', audioId: 'mission_A2.wrong_soap' } },
    { productId: 'toothbrushA', wrongAudioId: 'mission_A2.wrong_toothbrush', wrongFeedback: { text: 'นี่คือแปรงสีฟัน... ลองหากล้วยอีกทีนะ!', audioId: 'mission_A2.wrong_toothbrush' } }
  ]
};

export const getMissionProducts = (mission: Mission): Product[] =>
  mission.choices?.map(c => productsDB[c.productId]).filter(Boolean) ?? (mission.products || []);


  export const missionA3: Mission = {
    id: 'mission_A3',
    level: 'A',
    instructionThai: 'ช่วย Bingo หาของสีแดงหน่อย!',
    dialogue: {
      instruction: { text: 'ช่วย Bingo หาของสีแดงหน่อย!', audioId: 'mission_A3.instruction' },
      correct: { text: 'ใช่แล้ว! สีแดง!', audioId: 'mission_A3.correct' }
    },
    requiredCategories: [],
    targetColor: 'red',
    targetCount: 1,
    layoutTemplate: 'color-hunt',
    validation: {
      kind: 'attribute',
      field: 'colorName',
      equals: 'red'
    },
    englishTeachingText: 'Red',
    vocabularyConfigs: [{ text: 'Red', audioId: 'vocab.red' }],
    choices: [
    { productId: 'redCar' },
    { productId: 'blueBall', wrongAudioId: 'mission_A3.wrong_blue', wrongFeedback: { text: 'อันนี้สีฟ้านะ... ลองหาสีแดงอีกที!', audioId: 'mission_A3.wrong_blue' } },
    { productId: 'yellowDuck', wrongAudioId: 'mission_A3.wrong_yellow', wrongFeedback: { text: 'อันนี้สีเหลืองนะ... ลองหาสีแดงอีกที!', audioId: 'mission_A3.wrong_yellow' } },
    { productId: 'greenLeaf', wrongAudioId: 'mission_A3.wrong_green', wrongFeedback: { text: 'อันนี้สีเขียวนะ... ลองหาสีแดงอีกที!', audioId: 'mission_A3.wrong_green' } }
  ]
};

export const missionA4: Mission = {
  id: 'mission_A4',
  level: 'A',
  instructionThai: 'ช่วย Bingo เลือกผลไม้ 2 อย่างหน่อย!',
  dialogue: {
    instruction: { text: 'ช่วย Bingo เลือกผลไม้ 2 อย่างหน่อย!', audioId: 'mission_A4.instruction' },
    first_correct: { text: 'ใช่แล้ว! ผลไม้! หาอีกหนึ่งอย่างนะ!', audioId: 'mission_A4.first_correct' },
    complete: { text: 'เก่งมาก! ได้ผลไม้สองอย่างแล้ว!', audioId: 'mission_A4.complete' }
  },
  requiredCategories: [],
  targetIds: ['apple', 'banana'],
  targetCount: 2,
  layoutTemplate: 'pick-two',
  englishTeachingText: 'Apple!... Banana',
  choices: [
    { productId: 'apple' },
    { productId: 'banana' },
    { productId: 'soap', wrongAudioId: 'mission_A4.wrong_soap', wrongFeedback: { text: 'นี่คือสบู่... อันนี้ไม่ใช่ผลไม้นะ', audioId: 'mission_A4.wrong_soap' } },
    { productId: 'toothbrushA', wrongAudioId: 'mission_A4.wrong_toothbrush', wrongFeedback: { text: 'นี่คือแปรงสีฟัน... อันนี้ไม่ใช่ผลไม้นะ', audioId: 'mission_A4.wrong_toothbrush' } }
  ]
};

export const mission07: Mission = {
  id: 'mission_07',
  level: 'D',
  instructionThai: 'ซื้อแปรงสีฟัน 1 อัน และยาสีฟัน 1 หลอด มีเงิน 20 บาท',
  budget: 20,
  requiredCategories: [
    { category: 'toothbrush', quantity: 1 },
    { category: 'toothpaste', quantity: 1 }
  ],
  products: [
    productsDB.toothbrushA,
    productsDB.toothbrushB,
    productsDB.toothpasteA,
    productsDB.toothpasteB,
    productsDB.soap,
    productsDB.apple
  ]
};
