'use client'; // Necessário por causa do useState

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AddToCartButton } from '@/components/AddToCartButton';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Variant } from '@/app/types/sanity';

export function ProductCard({ product }: { product: Product }) {
  // Filtra variantes nulas com segurança para a lista e para o estado inicial
  const validVariants = product.variants?.filter(Boolean) || [];

  // Garante que se não houver variante, o valor inicial será null (e nunca undefined)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    validVariants[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedVariant?.price ?? product.price ?? 0;

  return (
    <Card className='flex flex-col h-full overflow-hidden'>
      <Link href={`/product/${product.slug.current}`} className='block'>
        {product.imageUrl && (
          <div className='relative w-full h-48 overflow-hidden bg-muted'>
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
              priority // <--- Adicione isso para carregar a imagem imediatamente e eliminar o aviso de LCP
              className='object-cover transition-transform hover:scale-105'
            />
          </div>
        )}
      </Link>

      <CardContent className='flex flex-col grow p-4'>
        <p className='text-xs text-muted-foreground mb-1 uppercase tracking-wider'>
          {product.categoryName || 'Sem Categoria'}
        </p>
        <h2 className='text-lg font-semibold mb-2'>{product.title}</h2>

        <div className='flex justify-between'>
          {/* Select de Tamanho/Variante controlado por ID com blindagem de texto */}
          <div className='space-y-1'>
            <Label className='text-xs font-bold text-muted-foreground'>
              TAMANHO
            </Label>
            <Select
              value={
                selectedVariant
                  ? selectedVariant.optionValue &&
                    selectedVariant.optionValue.length <= 10 &&
                    !/^[a-f0-9]{8,}$/i.test(selectedVariant.optionValue)
                    ? selectedVariant.optionValue
                    : 'Tamanho Único'
                  : ''
              }
              onValueChange={(val) =>
                setSelectedVariant(
                  validVariants.find((v) => {
                    const isId =
                      !v.optionValue ||
                      v.optionValue.length > 10 ||
                      /^[a-f0-9]{8,}$/i.test(v.optionValue);
                    const label = isId ? 'Tamanho Único' : v.optionValue;
                    return label === val;
                  }) ?? null,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                {validVariants.map((v) => {
                  // Padroniza o valor: se não houver optionValue ou se parecer um ID técnico, usa "Tamanho Único"
                  const isIdLike =
                    !v.optionValue ||
                    v.optionValue.length > 10 ||
                    /^[a-f0-9]{8,}$/i.test(v.optionValue);
                  const cleanValue = isIdLike ? 'Tamanho Único' : v.optionValue;

                  return (
                    <SelectItem key={v._id} value={cleanValue}>
                      {cleanValue}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Select de Quantidade baseado no Stock */}
          <div className='space-y-1'>
            <Label className='text-xs font-bold text-muted-foreground'>
              QTD
            </Label>
            <Select
              value={quantity.toString()}
              onValueChange={(val) => setQuantity(Number(val))}
            >
              <SelectTrigger>
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

        <p className='text-xl font-bold mt-auto pt-4'>
          R$ {currentPrice.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className='p-0 mt-auto'>
        <AddToCartButton
          product={product}
          variant={selectedVariant}
          quantity={quantity}
          disabled={(selectedVariant?.stock ?? 0) === 0}
        />
      </CardFooter>
    </Card>
  );
}
