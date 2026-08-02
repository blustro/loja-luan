'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Product, Variant } from '@/app/types/sanity';

interface ProductConfiguratorProps {
  product: Product;
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  layout?: 'vertical' | 'horizontal';
}

export function ProductConfigurator({
  product,
  selectedVariant,
  onVariantChange,
  quantity,
  onQuantityChange,
  layout = 'vertical',
}: ProductConfiguratorProps) {
  const validVariants = product.variants?.filter(Boolean) || [];

  const getVariantLabel = (v: Variant) => {
    return !v.optionValue ||
      v.optionValue.length > 10 ||
      /^[a-f0-9]{8,}$/i.test(v.optionValue)
      ? 'Tamanho Único'
      : v.optionValue;
  };

  const selectedVariantLabel = selectedVariant
    ? getVariantLabel(selectedVariant)
    : '';

  // Ajustado para aceitar string | null vindo do Select
  const handleVariantSelect = (label: string | null) => {
    if (!label) return;
    const found = validVariants.find((v) => getVariantLabel(v) === label);
    if (found) {
      onVariantChange(found);
    }
  };

  return (
    <div
      className={`grid gap-3 ${layout === 'horizontal' ? 'grid-cols-2' : 'grid-cols-1'}`}
    >
      {/* Seletor de Tamanho */}
      <div className='space-y-1'>
        <Label className='text-xs font-bold text-muted-foreground'>
          TAMANHO
        </Label>
        <Select
          value={selectedVariantLabel}
          onValueChange={handleVariantSelect}
        >
          <SelectTrigger className='w-full h-9'>
            <SelectValue placeholder='Selecione' />
          </SelectTrigger>
          <SelectContent>
            {validVariants.map((v) => {
              const cleanValue = getVariantLabel(v);
              return (
                <SelectItem key={v._id} value={cleanValue}>
                  {cleanValue}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Seletor de Quantidade */}
      <div className='space-y-1'>
        <Label className='text-xs font-bold text-muted-foreground'>QTD</Label>
        <Select
          value={quantity.toString()}
          onValueChange={(val) => {
            if (val) onQuantityChange(Number(val));
          }}
        >
          <SelectTrigger className='w-full h-9'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: selectedVariant?.stock ?? 1 },
              (_, i) => i + 1,
            ).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
