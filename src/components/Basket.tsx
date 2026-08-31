import type { Product, MissionLevel } from '../data/missions';
import { getMascotAsset } from '../config/mascots';

interface BasketProps {
  items: Product[];
  budget?: number;
  level: MissionLevel;
  targetCount?: number;
  onRemove: (index: number) => void;
  onCheckout: () => void;
}

export const Basket = ({ items, budget = 0, level, targetCount = 1, onRemove, onCheckout }: BasketProps) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const remaining = budget - total;
  const isOverBudget = remaining < 0;
  
  const mascotImg = getMascotAsset('A-Chi', isOverBudget ? 'money' : 'neutral');

  if (level === 'A') {
    const slots = Math.max(targetCount, 1);
    
    return (
      <div className="bg-sky-100 rounded-t-[2.5rem] pt-10 pb-5 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] border-t-[6px] border-white relative z-20 flex-shrink-0 mt-auto">
        
        {/* Slot Progress Indicator (Pick Two layout) */}
        {targetCount > 1 && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {Array.from({ length: slots }).map((_, idx) => (
              <div key={`ind-${idx}`} className={`w-8 h-8 rounded-full border-4 ${idx < items.length ? 'bg-green-400 border-green-200' : 'bg-white border-sky-200'} shadow-sm transition-colors duration-300`} />
            ))}
          </div>
        )}

        <div className="relative mx-auto w-full max-w-[220px]">
          {/* Basket Handle */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-16 border-[8px] border-amber-400 rounded-t-full border-b-0 z-0"></div>
          
          {/* Basket Body */}
          <div className="bg-amber-300 rounded-b-[2rem] rounded-t-lg p-3 shadow-[0_5px_15px_rgba(0,0,0,0.1)] border-[5px] border-amber-400 relative z-10 min-h-[70px] flex items-center justify-center">
            {/* Basket Texture/Grid */}
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,#000_6px,#000_12px)] rounded-b-[2rem] rounded-t-lg mix-blend-overlay"></div>
            
            <div className="relative z-20 flex gap-3 overflow-x-auto snap-x justify-center w-full">
              {Array.from({ length: Math.max(items.length, slots) }).map((_, idx) => {
                const item = items[idx];
                return (
                  <div key={idx} className={`relative snap-center shrink-0 w-12 h-12 rounded-[1rem] p-1.5 shadow-sm border-2 flex items-center justify-center ${item ? 'bg-white/90 border-white/50 animate-fade-in-up' : 'bg-amber-400/30 border-amber-500/30 border-dashed'}`}>
                    {item ? (
                      item.image.startsWith('/') ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-sm" />
                      ) : (
                        <span className="text-2xl drop-shadow-sm">{item.image}</span>
                      )
                    ) : (
                      <span className="text-amber-600/30 text-xl font-bold">?</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sky-100 rounded-t-[2.5rem] shadow-[0_-10px_20px_rgba(0,0,0,0.1)] p-4 w-full z-30 border-t-[8px] border-sky-300 flex flex-col gap-3 flex-shrink-0 mt-auto relative basket-target">
      
      {/* Decorative Cart Handle/Rim */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-4 bg-sky-200 rounded-full shadow-inner border-2 border-sky-300" />

      {/* A-Chi's Budget Display */}
      <div className={`rounded-3xl p-2 flex justify-between items-center border-4 transition-colors shadow-sm ${isOverBudget ? 'bg-rose-50 border-rose-300' : 'bg-white border-sky-200'}`}>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-end justify-center shadow-inner border-[3px] border-orange-200 overflow-hidden relative flex-shrink-0">
            <img src={mascotImg} alt="A-Chi" className="w-[90%] h-[90%] object-contain object-bottom relative z-10 drop-shadow-sm" />
          </div>
          <div>
            <p className="text-sm font-display font-bold text-sky-600 leading-tight">A-Chi</p>
            <p className="text-xs font-semibold text-gray-500">มีเงิน {budget} ฿</p>
          </div>
        </div>
        <div className="text-right bg-gray-50 px-3 py-1.5 rounded-xl shadow-inner border-2 border-gray-100 flex flex-col justify-center min-w-[80px]">
          <p className="text-[10px] font-semibold text-gray-400 mb-0.5">รวม <span className="text-gray-800 text-sm font-bold">{total} ฿</span></p>
          <p className={`text-sm font-bold ${isOverBudget ? 'text-rose-500 animate-pulse' : 'text-green-500'}`}>
            เหลือ {remaining} ฿
          </p>
        </div>
      </div>

      {/* Selected Items Tray */}
      <div className="bg-sky-200/50 rounded-3xl p-3 min-h-[90px] flex gap-3 overflow-x-auto items-center shadow-[inset_0_4px_10px_rgba(0,0,0,0.06)] border-[4px] border-sky-200/80 relative scrollbar-hide">
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-sky-600/50 text-base font-semibold">
            แตะของบนชั้น ใส่รถเข็นเลย!
          </div>
        )}
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="relative flex-shrink-0 animate-fade-in-up">
            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-4 border-white shadow-sm relative overflow-hidden ${item.color}`}>
              <div className="z-10 drop-shadow-sm flex items-center justify-center w-10 h-10">
                {item.image.startsWith('/') ? (
                  <img src={item.image} alt={item.name} className="w-[110%] h-[110%] object-contain" />
                ) : (
                  item.image
                )}
              </div>
              <div className="absolute bottom-0 w-full h-1/4 bg-black/10" />
            </div>
            <button 
              onClick={() => onRemove(index)}
              className="absolute -top-3 -right-3 bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold shadow-[0_3px_0_rgb(159,18,57)] active:translate-y-1 active:shadow-none border-[3px] border-white z-20 transition-all hover:scale-110"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-green-500 active:bg-green-600 text-white font-bold text-2xl py-3 rounded-[2rem] shadow-[0_6px_0_rgb(22,163,74)] transition-all active:translate-y-2 active:shadow-none border-[4px] border-green-300 tracking-wide"
      >
        จ่ายเงิน
      </button>
    </div>
  );
};
