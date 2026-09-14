const fs = require('fs');

let txt = fs.readFileSync('src/components/MatchContextInteraction.tsx', 'utf8');

const oldBlock = `<div className="w-full flex flex-col gap-4">
          {mission.contextChoices?.map(choice => (
             <button
                key={choice.id}
                onClick={() => handleTap(choice)}
                className={\`relative w-full h-28 bg-white rounded-[2rem] border-[4px] border-sky-300 shadow-[0_8px_15px_rgba(0,0,0,0.08)] overflow-hidden transition-transform active:scale-95 flex items-center justify-center \${bouncingId === choice.id ? 'animate-friendly-wiggle' : 'hover:scale-105'}\`}
             >
                <img src={choice.image} alt={choice.id} className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                
             </button>
          ))}
        </div>`;

const newBlock = `<div className="w-full grid grid-cols-2 gap-4">
          {mission.contextChoices?.map((choice, index) => {
             const isLastOdd = index === 2 && mission.contextChoices?.length === 3;
             return (
               <button
                  key={choice.id}
                  onClick={() => handleTap(choice)}
                  className={\`relative aspect-square w-full bg-white rounded-[2rem] border-[4px] border-sky-300 shadow-[0_8px_15px_rgba(0,0,0,0.08)] overflow-hidden transition-transform active:scale-95 flex items-center justify-center \${bouncingId === choice.id ? 'animate-friendly-wiggle' : 'hover:scale-105'} \${isLastOdd ? 'col-span-2 w-[calc(50%-0.5rem)] mx-auto' : ''}\`}
               >
                  <img src={choice.image} alt={choice.id} className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
               </button>
             );
          })}
        </div>`;

txt = txt.replace(oldBlock, newBlock);

fs.writeFileSync('src/components/MatchContextInteraction.tsx', txt);
console.log('MatchContextInteraction layout updated');
