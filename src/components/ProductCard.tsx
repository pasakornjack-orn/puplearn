import type { Product } from '../data/missions';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product, event: React.MouseEvent<HTMLButtonElement>) => void;
  hidePrice?: boolean;
  compact?: boolean;
}

export const ProductCard = ({ product, onSelect, hidePrice, compact }: ProductCardProps) => {
  return (
    <button
      onClick={(e) => onSelect(product, e)}
      className={`group relative flex flex-col items-center justify-start ${compact ? 'pt-4 pb-2 px-2 h-36 rounded-[2rem]' : 'pt-6 pb-4 px-3 h-48 rounded-[2.5rem]'} shadow-[0_10px_0_rgba(0,0,0,0.1)] border-4 border-white active:translate-y-2 active:shadow-none transition-all w-full ${product.color} bg-gradient-to-b from-white/40 to-transparent`}
    >
      <div className={`${compact ? 'text-[4rem] w-16 h-16 mb-1' : 'text-[5rem] w-24 h-24 mb-2'} leading-none drop-shadow-xl group-active:scale-95 transition-transform flex items-center justify-center`}>
        {product.image.startsWith('/') ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        ) : (
          product.image
        )}
      </div>
      
      {!compact && (
        <div className="mt-auto w-full">
          <div className="bg-white/90 rounded-2xl py-1.5 px-2 shadow-sm border-2 border-white/50 mb-4">
            <div className="text-sm font-semibold text-gray-800 leading-tight text-center drop-shadow-sm truncate">{product.name}</div>
          </div>
        </div>
      )}
      
      {!hidePrice && (
        <div className="absolute -bottom-6 bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full text-2xl font-bold shadow-[0_6px_0_rgb(202,138,4)] border-4 border-white group-active:shadow-none group-active:translate-y-1.5 transition-all">
          {product.price} ฿
        </div>
      )}
    </button>
  );
};
