'use client';

import { Button } from '@/components/ui/button';
import { Variant } from '@/app/types/sanity';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  variants: Variant[];
  onSelect: (variant: Variant) => void;
  selectedVariant: Variant | null;
}

export function VariantSelector({
  variants,
  onSelect,
  selectedVariant,
}: VariantSelectorProps) {
  return (
    <div className='space-y-2'>
      <p className='text-xs font-bold text-muted-foreground'>TAMANHO</p>
      <div className='flex flex-wrap gap-2'>
        {variants.map((v, index) => {
          const isSelected =
            selectedVariant?._key !== undefined &&
            selectedVariant._key === v._key;

          // Garantimos que a chave seja única unindo o _key (ou sku) com o índice
          const uniqueKey = `${v._key ?? v.sku ?? 'variant'}-${index}`;

          return (
            <Button
              key={uniqueKey}
              type='button'
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onSelect(v)}
            >
              {v.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
