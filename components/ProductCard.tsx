'use client';

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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from '@/components/ui/drawer';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Variant } from '@/app/types/sanity';
import { ChevronLeft, ChevronRight, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductCard({ product }: { product: Product }) {
  const validVariants = product.variants?.filter(Boolean) || [];

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    validVariants[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Monta o array de imagens de forma segura
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl].filter(Boolean);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentPrice = selectedVariant?.price ?? product.price ?? 0;

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
    <>
      <Card className='flex flex-col h-full overflow-hidden group relative'>
        {/* Link direto para a página do produto */}
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
                priority
                className='object-cover transition-transform duration-300 group-hover:scale-105'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-xs text-muted-foreground'>
                Sem imagem
              </div>
            )}
          </div>
        </Link>

        {/* Botão Flutuante de Quick Look (Discreto na imagem) */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger
            render={
              <Button
                type='button'
                size='icon'
                variant='secondary'
                className='absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity'
                aria-label='Visualização rápida'
              >
                <Eye className='h-4 w-4' />
              </Button>
            }
          ></DrawerTrigger>

          {/* Conteúdo da Gaveta (Drawer Mobile-First) */}
          <DrawerContent className='p-4 max-h-[90vh] flex flex-col'>
            <DrawerHeader className='p-0 pb-4 text-left'>
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
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span>Ver detalhes</span>
                  <ExternalLink className='h-3 w-3' />
                </Link>
              </div>
            </DrawerHeader>

            <div className='overflow-y-auto space-y-4 pr-1'>
              {/* Carrossel de Imagens dentro do Drawer */}
              <div className='relative w-full h-64 rounded-lg overflow-hidden bg-muted border'>
                {images.length > 0 ? (
                  <Image
                    src={
                      images[currentImageIndex] ||
                      product.imageUrl ||
                      '/placeholder.png'
                    }
                    alt={product.title}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-xs text-muted-foreground'>
                    Sem imagem
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type='button'
                      onClick={handlePrevImage}
                      className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full flex items-center justify-center h-8 w-8'
                      aria-label='Anterior'
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </button>
                    <button
                      type='button'
                      onClick={handleNextImage}
                      className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full flex items-center justify-center h-8 w-8'
                      aria-label='Próxima'
                    >
                      <ChevronRight className='h-4 w-4' />
                    </button>

                    <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
                      {images.map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? 'w-4 bg-white'
                              : 'w-1.5 bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Preço */}
              <div className='flex items-center justify-between pt-1'>
                <span className='text-xs text-muted-foreground'>
                  Preço unitário
                </span>
                <span className='text-lg font-bold'>
                  R$ {currentPrice.toFixed(2)}
                </span>
              </div>

              {/* Seletores de Variante e Quantidade */}
              <div className='grid grid-cols-2 gap-3 pt-2'>
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
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Selecione' />
                    </SelectTrigger>
                    <SelectContent>
                      {validVariants.map((v) => {
                        const isIdLike =
                          !v.optionValue ||
                          v.optionValue.length > 10 ||
                          /^[a-f0-9]{8,}$/i.test(v.optionValue);
                        const cleanValue = isIdLike
                          ? 'Tamanho Único'
                          : v.optionValue;

                        return (
                          <SelectItem key={v._id} value={cleanValue}>
                            {cleanValue}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-1'>
                  <Label className='text-xs font-bold text-muted-foreground'>
                    QTD
                  </Label>
                  <Select
                    value={quantity.toString()}
                    onValueChange={(val) => setQuantity(Number(val))}
                  >
                    <SelectTrigger className='w-full'>
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
            </div>

            <DrawerFooter className='p-0 pt-4 mt-auto'>
              <div onClick={() => setIsDrawerOpen(false)} className='w-full'>
                <AddToCartButton
                  product={product}
                  variant={selectedVariant}
                  quantity={quantity}
                  disabled={(selectedVariant?.stock ?? 0) === 0}
                />
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Informações básicas visíveis no Card principal */}
        <CardContent className='flex flex-col grow p-4'>
          <p className='text-xs text-muted-foreground mb-1 uppercase tracking-wider'>
            {product.categoryName || 'Sem Categoria'}
          </p>
          <h2 className='text-sm font-semibold mb-2 line-clamp-1'>
            {product.title}
          </h2>
          <p className='text-base font-bold mt-auto pt-2'>
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
    </>
  );
}
