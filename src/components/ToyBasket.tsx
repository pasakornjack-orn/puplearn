import React, { useEffect, useState } from 'react';
import type { Product } from '../data/missions';

interface ToyBasketProps {
  items: Product[];
}

const ToyBasket: React.FC<ToyBasketProps> = ({ items }) => {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (items.length > 0) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 500);
      return () => clearTimeout(timer);
    }
  }, [items.length]);

  return (
    <div className="relative pointer-events-none flex-shrink-0 basket-target">
      <div className={`relative flex flex-col items-center justify-end transition-transform duration-300 ${bounce ? 'scale-110 -translate-y-4' : 'scale-100'}`}>
        
        {/* Shadow */}
        <div className="absolute -bottom-2 w-[80%] h-6 bg-black/30 blur-md rounded-[100%]"></div>
        
        {/* Front of Basket Image */}
        <img 
          src="/ui/basket-v2.png" 
          alt="Shopping Basket" 
          className="relative z-20 w-40 sm:w-48 h-auto object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.15)] basket-target"
        />

        {/* Optional Sparkle/Success Effect on Drop */}
        {bounce && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 bg-yellow-300/40 rounded-full blur-xl animate-pulse-fast"></div>
            <div className="absolute w-full h-full animate-[spin_3s_linear_infinite]">
              <span className="absolute top-4 left-4 text-3xl animate-bounce-twice">✨</span>
              <span className="absolute top-10 right-4 text-2xl animate-bounce-twice" style={{ animationDelay: '0.1s' }}>⭐</span>
              <span className="absolute bottom-10 left-10 text-xl animate-bounce-twice" style={{ animationDelay: '0.2s' }}>✨</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToyBasket;
