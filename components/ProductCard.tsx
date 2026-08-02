'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductConfigurator } from '@/components/ProductConfigurator';
import { ProductQuickView } from '@/components/ProductQuickView';
import { Product, Variant } from '@/app/types/sanity';

export function ProductCard({ product }: { product: Product }) {
  const validVariants = product.variants?.filter(Boolean) || [];

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    validVariants[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  const currentPrice = selectedVariant?.price ?? product.price ?? 0;
  const isOutOfStock = (selectedVariant?.stock ?? 0) === 0;

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className='flex flex-col h-full overflow-hidden group relative'>
      {/* Imagem de Capa Estática no Card Inicial */}
      <Link
        href={`/product/${product.slug.current}`}
        className='block relative'
      >
        <div className='relative w-full h-48 overflow-hidden bg-muted'>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-xs text-muted-foreground'>
              Sem imagem
            </div>
          )}
        </div>
      </Link>

      {/* Drawer / Quick View com o Carrossel Completo */}
      <ProductQuickView
        product={product}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        images={images}
        currentImageIndex={currentImageIndex}
        onPrevImage={handlePrevImage}
        onNextImage={handleNextImage}
        selectedVariant={selectedVariant}
        onVariantChange={handleVariantChange}
        quantity={quantity}
        onQuantityChange={setQuantity}
        currentPrice={currentPrice}
        isOutOfStock={isOutOfStock}
      />

      {/* Informações básicas do Card principal */}
      <CardContent className='flex flex-col grow p-4 gap-3'>
        <div>
          <p className='text-xs text-muted-foreground mb-1 uppercase tracking-wider'>
            {product.categoryName || 'Sem Categoria'}
          </p>
          <h2 className='text-sm font-semibold line-clamp-1'>
            {product.title}
          </h2>
          <p className='text-base font-bold pt-1'>
            R$ {currentPrice.toFixed(2)}
          </p>
        </div>

        {/* Seletor de tamanho/quantidade em Desktop */}
        <div className='hidden md:block mt-auto'>
          <ProductConfigurator
            product={product}
            selectedVariant={selectedVariant}
            onVariantChange={handleVariantChange}
            quantity={quantity}
            onQuantityChange={setQuantity}
            layout='vertical'
          />
        </div>
      </CardContent>

      {/* Footer do Card em Desktop */}
      <CardFooter className='p-0 mt-auto border-t hidden md:block'>
        <AddToCartButton
          product={product}
          variant={selectedVariant}
          quantity={quantity}
          disabled={isOutOfStock}
        />
      </CardFooter>
    </Card>
  );
}
