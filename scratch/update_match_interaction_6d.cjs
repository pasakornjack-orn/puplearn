const fs = require('fs');

let txt = fs.readFileSync('src/components/MatchContextInteraction.tsx', 'utf8');

// Update correct text logic
txt = txt.replace(/text: 'เก่งมาก!'/g, "text: mission.dialogue?.correct?.text || 'ใช่แล้ว!'");
txt = txt.replace(/playSpeech\('เก่งมาก!',/g, "playSpeech(mission.dialogue?.correct?.text || 'ใช่แล้ว!',");

// Update wrong text logic
txt = txt.replace("const wrongText = 'ลองดูใหม่นะ';", "const wrongText = 'ลองดูอีกที่นะ';");

// Remove the text fallback label from the choice buttons
const fallbackSpan = `{/* Fallback label for draft preview if image is a placeholder */}
                <span className="relative z-10 text-white font-display font-bold text-3xl drop-shadow-md tracking-wide">
                  {choice.id.toUpperCase()}
                </span>`;
txt = txt.replace(fallbackSpan, '');

fs.writeFileSync('src/components/MatchContextInteraction.tsx', txt);
console.log('MatchContextInteraction.tsx updated with correct text and removed fallback label.');
