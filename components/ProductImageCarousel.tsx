'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@base-ui/react';
import { cn } from '@/lib/utils';
import { checkoutButtonStyle } from '@/lib/styles';

interface ProductImageCarouselProps {
  images: string[];
  title: string;
  heightClass?: string; // Ex: 'h-48' para o card ou 'h-64' para o drawer
}

export function ProductImageCarousel({
  images,
  title,
  heightClass = 'h-48',
}: ProductImageCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Sincroniza o índice atual sem disparar renders síncronos no effect
  React.useEffect(() => {
    if (!api) return;

    queueMicrotask(() => {
      setCurrent(api.selectedScrollSnap());
    });

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!images || images.length === 0) {
    return (
      <div
        className={`relative w-full ${heightClass} overflow-hidden bg-muted flex items-center justify-center text-xs text-muted-foreground`}
      >
        Sem imagem
      </div>
    );
  }

  return (
    <div className={`relative w-full ${heightClass} group`}>
      <Carousel setApi={setApi} className='w-full h-full'>
        <CarouselContent className='h-full ml-0'>
          {images.map((img, idx) => (
            <CarouselItem key={idx} className='relative h-full pl-0'>
              <div
                className={`relative w-full ${heightClass} overflow-hidden bg-muted`}
              >
                <Image
                  src={img}
                  alt={`${title} - ${idx + 1}`}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                  priority={idx === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Controles condicionais perfeitamente centralizados */}
      {images.length > 1 && (
        <>
          <Button
            type='button'
            onClick={() => api?.scrollPrev()}
            className={cn(
              checkoutButtonStyle,
              'absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full flex items-center justify-center h-8 w-8 transition-opacity z-10',
            )}
            aria-label='Imagem anterior'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            onClick={() => api?.scrollNext()}
            className={cn(
              checkoutButtonStyle,
              'absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full flex items-center justify-center h-8 w-8 transition-opacity z-10',
            )}
            aria-label='Próxima imagem'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>

          {/* Indicadores (Bolinhas) com clique direto */}
          <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10'>
            {images.map((_, idx) => (
              <Button
                key={idx}
                type='button'
                onClick={() => api?.scrollTo(idx)}
                className={`h-1.5 rounded-full transition-all border-1 ${
                  idx === current
                    ? 'w-4 bg-[var(--primary-color)] border-black'
                    : 'w-1.5 bg-black  border-[var(--primary-color)]'
                }`}
                aria-label={`Ir para imagem ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
