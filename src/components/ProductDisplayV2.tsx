import React, { useState } from 'react';
import type { Mission, Product } from '../data/missions';
import { MascotBubble } from './MascotBubble';

import ToyBasket from './ToyBasket';

interface ProductDisplayV2Props {
  mission: Mission;
  isAudioMuted: boolean;
  onTargetFound: (target: Product, event: React.MouseEvent) => void;
  onWrongTap: (product: Product, event: React.MouseEvent) => void;
  hintMessage: { text: string; mascot: any; emotion?: any; timestamp?: number } | null;
  replayCount: number;
  setReplayCount: React.Dispatch<React.SetStateAction<number>>;
  basketItems: Product[];
}

const ProductSlot: React.FC<{
  product: Product;
  isBouncing: boolean;
  onTap: (product: Product, event: React.MouseEvent) => void;
}> = ({ product, isBouncing, onTap }) => {
  return (
    <button
      onClick={(e) => onTap(product, e)}
      className="relative w-full aspect-square flex items-center justify-center pointer-events-auto transition-transform active:scale-95 group"
    >
      <img src="/ui/product-tray-v2.png" alt="Tray" className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm" />
      <div className={`relative w-[65%] h-[65%] flex items-center justify-center -translate-y-3 transition-transform ${isBouncing ? 'animate-[bounce_0.8s_ease-in-out]' : 'group-hover:scale-105'}`}>
        <div className="absolute -bottom-2 w-[70%] h-4 bg-black/15 rounded-[100%] blur-[3px]"></div>
        <img src={product.image} alt={product.name} className="w-full h-full object-contain relative z-10 drop-shadow-sm origin-bottom pointer-events-none" />
      </div>
    </button>
  );
};

const ProductDisplayV2: React.FC<ProductDisplayV2Props> = ({
  mission,
  isAudioMuted,
  onTargetFound,
  onWrongTap,
  hintMessage,
  setReplayCount,
  basketItems
}) => {
  const [bouncingId, setBouncingId] = useState<string | null>(null);

  const handleTap = (product: Product, event: React.MouseEvent) => {
    let isTarget = false;
    if (mission.targetIds) {
      isTarget = mission.targetIds.includes(product.id);
    } else if (mission.targetColor) {
      isTarget = product.colorName === mission.targetColor;
    }

    if (isTarget) {
      onTargetFound(product, event);
    } else {
      setBouncingId(product.id);
      setTimeout(() => setBouncingId(null), 800);
      onWrongTap(product, event);
    }
  };

  const cols = (mission.products || []).length > 4 ? 3 : 2;

  return (
    <div className="absolute inset-0 flex flex-col h-full z-10 overflow-hidden animate-fade-in pb-safe">
      
      {/* Product Grid Centered */}
      <div className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-center relative z-20 px-5 pt-8 pb-[180px]">
        {/* Modular Shelf Display */}
        <div className="w-full bg-[#FFF8EE] rounded-[3rem] border-b-[12px] border-[#FFE4C4] shadow-[0_15px_30px_rgba(0,0,0,0.1)] p-4 relative z-30">
          <div className="bg-white rounded-[2.5rem] p-5 shadow-[inset_0_4px_15px_rgba(0,0,0,0.03)] border-[4px] border-[#FFF0D9]">
            {/* Dynamic Grid */}
            <div className={`grid grid-cols-${cols} gap-4 w-full`}>
              {(mission.products || []).map((product) => (
                <ProductSlot 
                  key={product.id}
                  product={product}
                  isBouncing={bouncingId === product.id}
                  onTap={handleTap}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Mascot and Basket */}
      <div className="absolute bottom-6 left-0 right-0 h-[160px] z-40 pointer-events-none flex items-end justify-between px-4 max-w-md mx-auto">
        
        {/* Mascot on Left */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {hintMessage ? (
            <div className="absolute bottom-0 left-0 w-full h-full animate-fade-in-up">
              <MascotBubble 
                mascot={hintMessage.mascot} 
                emotion={hintMessage.emotion} 
                message={hintMessage.text}
                variant="mascot-gameplay-v2"
                audioEnabled={!isAudioMuted}
                playTrigger={hintMessage.timestamp}
                onReplay={() => setReplayCount(r => r + 1)}
              />
            </div>
          ) : (
            <div className="absolute bottom-0 left-0 w-full h-full animate-fade-in-up">
              <MascotBubble 
                mascot="Bingo" 
                emotion="guide" 
                message={mission.instructionThai} 
                variant="mascot-gameplay-v2"
                audioEnabled={!isAudioMuted} 
                onReplay={() => setReplayCount(r => r + 1)} 
              />
            </div>
          )}
        </div>

        {/* Basket on Right */}
        <div className="relative z-30 flex-1 flex justify-end pb-2 pr-2">
           <ToyBasket items={basketItems} />
        </div>
      </div>

    </div>
  );
};

export default ProductDisplayV2;
