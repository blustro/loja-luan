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
import { Product } from '@/app/types/sanity';

export function ProductCard({ product }: { product: Product }) {
  // Estado inicial: a primeira variante (ou a única)
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const [quantity, setQuantity] = useState(1);

  console.log('Variante selecionada:', selectedVariant);
  console.log('Stock da variante:', selectedVariant?.stock);

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

        {/* Select de Tamanho/Variante */}
        <div className='space-y-1'>
          <Label className='text-xs font-bold text-muted-foreground'>
            TAMANHO
          </Label>
          <Select
            key={selectedVariant?.title}
            onValueChange={(val) =>
              setSelectedVariant(product.variants?.find((v) => v.title === val))
            }
            defaultValue={product.variants?.[0]?.title}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {product.variants?.map((v) => (
                <SelectItem key={v.title} value={v.title}>
                  {v.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select de Quantidade baseado no Stock */}
        <div className='space-y-1'>
          <Label className='text-xs font-bold text-muted-foreground'>QTD</Label>
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

        <p className='text-xl font-bold mt-auto'>
          R$ {selectedVariant?.price.toFixed(2) ?? 0}
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
