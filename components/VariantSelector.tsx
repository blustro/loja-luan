'use client';

import { useState } from 'react';

// Ajuste conforme seu arquivo de tipos
interface Variant {
  title: string;
  sku: string;
  price: number;
  stock: number;
  stripePriceId: string;
}

interface VariantSelectorProps {
  variants: Variant[];
  onSelect: (variant: Variant | null) => void;
}

export function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  const handleSelect = (variant: Variant) => {
    setSelectedSku(variant.sku);
    onSelect(variant);
  };

  return (
    <div className='space-y-4'>
      <h3 className='font-medium text-gray-900'>Selecione o tamanho:</h3>

      <div className='flex flex-wrap gap-2'>
        {variants.map((variant) => {
          const isOutOfStock = variant.stock <= 0;
          const isSelected = selectedSku === variant.sku;

          return (
            <button
              key={variant.sku}
              disabled={isOutOfStock}
              onClick={() => handleSelect(variant)}
              className={`
                px-4 py-2 border rounded-md transition-all
                ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-white text-gray-900 border-gray-300 hover:border-black'
                }
                ${isSelected ? 'border-2 border-black ring-1 ring-black' : ''}
              `}
            >
              {variant.title}
              {isOutOfStock && (
                <span className='text-[10px] block opacity-50'>
                  Indisponível
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
