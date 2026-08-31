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

export type MissionLevel = 'A' | 'B' | 'C' | 'D';

export type Mission = {
  id: string;
  level: MissionLevel;
  instructionThai: string;
  budget?: number; // Optional for Level A
  requiredCategories: { category: string; quantity: number }[];
  targetIds?: string[]; // Used for Level A explicitly
  targetColor?: string; // Used for color hunt
  targetCount?: number; // How many items needed to complete
  layoutTemplate?: 'find-one' | 'color-hunt' | 'pick-two';
  englishTeachingText?: string;
  products: Product[];
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
    category: 'toothbrush'
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
    category: 'soap'
  },
  apple: {
    id: 'apple',
    name: 'แอปเปิล',
    englishName: 'Apple',
    price: 5,
    image: '/products/apple.png',
    color: 'bg-red-100 border-red-400',
    colorName: 'red',
    category: 'food'
  },
  banana: {
    id: 'banana',
    name: 'กล้วย',
    englishName: 'Banana',
    price: 4,
    image: '/products/banana.png',
    color: 'bg-yellow-100 border-yellow-400',
    colorName: 'yellow',
    category: 'food'
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
    colorName: 'blue',
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
    category: 'toy'
  },
  greenLeaf: {
    id: 'greenLeaf',
    name: 'ใบไม้',
    englishName: 'Leaf',
    price: 1,
    image: '/products/leaf-green.png',
    color: 'bg-green-50 border-green-300',
    colorName: 'green',
    category: 'other'
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
  requiredCategories: [],
  targetIds: ['apple'],
  targetCount: 1,
  layoutTemplate: 'find-one',
  englishTeachingText: 'Apple',
  products: [
    productsDB.apple,
    productsDB.banana,
    productsDB.soap,
    productsDB.toothbrushA
  ]
};

export const missionA2: Mission = {
  id: 'mission_A2',
  level: 'A',
  instructionThai: 'ช่วย Bingo หากล้วยหน่อย!',
  requiredCategories: [],
  targetIds: ['banana'],
  targetCount: 1,
  layoutTemplate: 'find-one',
  englishTeachingText: 'Banana',
  products: [
    productsDB.apple,
    productsDB.banana,
    productsDB.soap,
    productsDB.toothbrushA
  ]
};

export const missionA3: Mission = {
  id: 'mission_A3',
  level: 'A',
  instructionThai: 'ช่วย Bingo หาของสีแดงหน่อย!',
  requiredCategories: [],
  targetColor: 'red',
  targetCount: 1,
  layoutTemplate: 'find-one', // 2x2 grid
  englishTeachingText: 'Red',
  products: [
    productsDB.redCar,
    productsDB.blueBall,
    productsDB.yellowDuck,
    productsDB.greenLeaf
  ]
};

export const missionA4: Mission = {
  id: 'mission_A4',
  level: 'A',
  instructionThai: 'ช่วย Bingo เลือกผลไม้ 2 อย่างหน่อย!',
  requiredCategories: [],
  targetIds: ['apple', 'banana'],
  targetCount: 2,
  layoutTemplate: 'pick-two',
  englishTeachingText: 'Apple!... Banana',
  products: [
    productsDB.apple,
    productsDB.banana,
    productsDB.soap,
    productsDB.toothbrushA
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
