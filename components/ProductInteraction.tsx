'use client';

import { useState } from 'react';
import { VariantSelector } from './VariantSelector';
import { AddToCartButton } from './AddToCartButton';
import { Product, Variant } from '@/app/types/sanity'; // Certifique-se de importar Variant

interface ProductInteractionProps {
  product: Product;
}

export function ProductInteraction({ product }: ProductInteractionProps) {
  // 1. Diga explicitamente que o estado pode ser Variant ou null
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-2xl font-semibold text-primary'>
        {/* Agora o TypeScript entende que selectedVariant pode ser Variant */}
        R${' '}
        {selectedVariant
          ? selectedVariant.price.toFixed(2)
          : product.price.toFixed(2)}
      </p>

      {/* 2. Envolva em uma função anônima para resolver o erro de incompatibilidade */}
      <VariantSelector
        variants={product.variants}
        onSelect={(variant) => setSelectedVariant(variant)}
      />

      <AddToCartButton
        product={product}
        variant={selectedVariant}
        disabled={!selectedVariant}
      />
    </div>
  );
}
