'use client';

import { useState } from 'react';
import { VariantSelector } from './VariantSelector';
import { AddToCartButton } from './AddToCartButton';
import { Product, Variant } from '@/app/types/sanity';

interface ProductInteractionProps {
  product: Product;
}

export function ProductInteraction({ product }: ProductInteractionProps) {
  const variants = product.variants || [];

  // 1. Inicializa com a primeira variante se existir
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants[0] || null,
  );

  const [quantity, setQuantity] = useState(1);

  // 2. Uso do `??` para segurança caso o preço seja 0 ou indefinido
  const currentPrice = selectedVariant?.price ?? product.price ?? 0;

  // 3. Obtém o estoque da variante selecionada (ou 0)
  const currentStock = selectedVariant?.stock ?? 0;

  // Lógica para desabilitar: sem variante selecionada OU estoque esgotado
  const isOutOfStock = currentStock <= 0;
  const isSelectionMissing = variants.length > 0 && !selectedVariant;
  const isDisabled = isSelectionMissing || isOutOfStock;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <p className='text-3xl font-bold text-primary'>
          R$ {currentPrice.toFixed(2)}
        </p>

        {/* Feedback visual rápido de estoque */}
        <span
          className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}
        >
          {isOutOfStock
            ? '✕ Esgotado'
            : `✓ ${currentStock} disponíveis em estoque`}
        </span>
      </div>

      <VariantSelector
        variants={variants}
        selectedVariant={selectedVariant}
        onSelect={(variant) => {
          setSelectedVariant(variant);
          setQuantity(1); // Reseta a quantidade para 1 ao trocar de variante
        }}
      />

      <AddToCartButton
        product={product}
        variant={selectedVariant}
        disabled={isDisabled}
        quantity={quantity}
      />
    </div>
  );
}
