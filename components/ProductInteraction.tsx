'use client';

import { useState } from 'react';
import { VariantSelector } from './VariantSelector';
import { AddToCartButton } from './AddToCartButton';
import { Product, Variant } from '@/app/types/sanity'; // Certifique-se de importar Variant

interface ProductInteractionProps {
  product: Product;
}

export function ProductInteraction({ product }: ProductInteractionProps) {
  // 1. Inicialize com a primeira variante se ela existir, caso contrário null
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants?.[0] || null,
  );

  const [quantity, setQuantity] = useState(1);

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-2xl font-semibold text-primary'>
        R$ {(selectedVariant?.price || product.price).toFixed(2)}
      </p>

      <VariantSelector
        variants={product.variants || []}
        selectedVariant={selectedVariant}
        onSelect={(variant) => setSelectedVariant(variant)}
      />

      <AddToCartButton
        product={product}
        variant={selectedVariant}
        // Agora o botão estará ativo se houver uma variante selecionada
        // OU se o produto não tiver variantes (o que é improvável, mas trata o erro)
        disabled={
          product.variants && product.variants.length > 0
            ? !selectedVariant
            : false
        }
        quantity={quantity}
      />
    </div>
  );
}
