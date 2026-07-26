'use client';

import { Button } from '@/components/ui/button';
import { Variant } from '@/app/types/sanity';

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
          // Substituído _key por _id conforme a tipagem do projeto
          const isSelected =
            selectedVariant?._id !== undefined && selectedVariant._id === v._id;

          // Chave única baseada em _id com fallback para sku ou índice
          const uniqueKey = `${v._id ?? v.sku ?? 'variant'}-${index}`;

          // Tratamento seguro para exibir o valor ou um texto padrão
          const isTechnicalId =
            !v.optionValue || /^[a-f0-9]{8,}$/i.test(v.optionValue);
          const displayText = isTechnicalId ? 'Tamanho Único' : v.optionValue;

          return (
            <Button
              key={uniqueKey}
              type='button'
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onSelect(v)}
            >
              {displayText}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
