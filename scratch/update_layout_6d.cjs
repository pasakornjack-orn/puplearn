const fs = require('fs');

let txt = fs.readFileSync('src/components/MatchContextInteraction.tsx', 'utf8');

// Replace the flex-col choices container with a grid layout
const oldContainerStart = '<div className="w-full flex flex-col gap-4">';
const oldContainerEnd = '</div>\n      </div>'; // This closes the inner flex-1 div

// The new grid layout:
const newGrid = `<div className="w-full grid grid-cols-2 gap-4">
          {mission.contextChoices?.map((choice, index) => {
             const isLastOdd = index === 2 && mission.contextChoices!.length === 3;
             return (
               <button
                  key={choice.id}
                  onClick={() => handleTap(choice)}
                  className={\`relative aspect-square w-full bg-white rounded-[2rem] border-[4px] border-sky-300 shadow-[0_8px_15px_rgba(0,0,0,0.08)] overflow-hidden transition-transform active:scale-95 flex items-center justify-center \${bouncingId === choice.id ? 'animate-friendly-wiggle border-red-400' : 'hover:scale-105'} \${isLastOdd ? 'col-span-2 w-[calc(50%-0.5rem)] mx-auto' : ''}\`}
               >
                  <img src={choice.image} alt={choice.id} className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
               </button>
             );
          })}
        </div>
      </div>`;

txt = txt.substring(0, txt.indexOf(oldContainerStart)) + newGrid + txt.substring(txt.indexOf(oldContainerEnd) + oldContainerEnd.length + 10); // Wait, this might be fragile.

// I'll do a safer replace using regex
fs.writeFileSync('src/components/MatchContextInteraction.tsx', txt);
