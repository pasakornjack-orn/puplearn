const fs = require('fs');
const content = fs.readFileSync('src/components/ProductDisplayV2.tsx', 'utf8');
const lines = content.split('\n');
let start = lines.findIndex(l => l.includes('const ProductDisplayV2:'));
let renderStart = lines.findIndex((l, i) => i > start && l.includes('return ('));
console.log(lines.slice(renderStart, renderStart + 30).join('\n'));
