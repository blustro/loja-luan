// components/ProductQuickView.tsx
'use client';

import Link from 'next/link';
import { ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Product, Variant } from '@/app/types/sanity';
import { ProductConfigurator } from '@/components/ProductConfigurator';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { checkoutButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  currentImageIndex: number;
  onPrevImage: (e: React.MouseEvent) => void;
  onNextImage: (e: React.MouseEvent) => void;
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  currentPrice: number;
  isOutOfStock: boolean;
}

export function ProductQuickView({
  product,
  isOpen,
  onOpenChange,
  images,
  currentImageIndex,
  onPrevImage,
  onNextImage,
  selectedVariant,
  onVariantChange,
  quantity,
  onQuantityChange,
  currentPrice,
  isOutOfStock,
}: ProductQuickViewProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger
        render={
          <Button
            type='button'
            size='icon'
            variant='secondary'
            className={cn(
              checkoutButtonStyle,
              'absolute top-2 right-2 h-8 w-8 rounded-full backdrop-blur-sm shadow-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20',
            )}
            aria-label='Visualização rápida'
          >
            <Eye className='h-4 w-4' />
          </Button>
        }
      ></DrawerTrigger>

      <DrawerContent className='p-4 max-h-[95vh] flex flex-col'>
        <DrawerHeader className='p-0 pb-3 text-left'>
          <div className='flex justify-between items-start gap-2'>
            <div>
              <p className='text-[10px] text-muted-foreground uppercase tracking-wider'>
                {product.categoryName || 'Sem Categoria'}
              </p>
              <DrawerTitle className='text-base font-bold line-clamp-1'>
                {product.title}
              </DrawerTitle>
            </div>
            <Link
              href={`/product/${product.slug.current}`}
              className='text-xs font-semibold text-primary flex items-center gap-1 shrink-0 pt-1 hover:underline'
              onClick={() => onOpenChange(false)}
            >
              <span>Ver detalhes</span>
              <ExternalLink className='h-3 w-3' />
            </Link>
          </div>
        </DrawerHeader>

        <div className='overflow-y-auto space-y-4 pr-1'>
          {/* Container da imagem ajustado para desktop */}
          <div className='w-full max-w-xs mx-auto sm:max-w-sm rounded-lg overflow-hidden border bg-muted'>
            <ProductImageCarousel
              images={images}
              currentIndex={currentImageIndex}
              onPrev={onPrevImage}
              onNext={onNextImage}
              title={product.title}
              heightClass='h-72 sm:h-80'
            />
          </div>

          <div className='flex items-center justify-between pt-1 max-w-sm mx-auto w-full'>
            <span className='text-xs text-muted-foreground'>
              Preço unitário
            </span>
            <span className='text-lg font-bold'>
              R$ {currentPrice.toFixed(2)}
            </span>
          </div>

          <div className='max-w-md mx-auto w-full'>
            <ProductConfigurator
              product={product}
              selectedVariant={selectedVariant}
              onVariantChange={onVariantChange}
              quantity={quantity}
              onQuantityChange={onQuantityChange}
              layout='horizontal'
            />
          </div>
        </div>

        <DrawerFooter className='p-0 pt-4 mt-auto max-w-md mx-auto w-full'>
          <div onClick={() => onOpenChange(false)} className='w-full'>
            <AddToCartButton
              product={product}
              variant={selectedVariant}
              quantity={quantity}
              disabled={isOutOfStock}
            />
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
