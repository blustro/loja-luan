'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  currentIndex: number;
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  title: string;
  heightClass?: string; // Ex: 'h-48' para o card ou 'h-64' para o drawer
}

export function ProductImageCarousel({
  images,
  currentIndex,
  onPrev,
  onNext,
  title,
  heightClass = 'h-48',
}: ProductImageCarouselProps) {
  const currentImage = images[currentIndex] || '/placeholder.png';

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden bg-muted`}>
      {images.length > 0 ? (
        <Image
          src={currentImage}
          alt={title}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />
      ) : (
        <div className='w-full h-full flex items-center justify-center text-xs text-muted-foreground'>
          Sem imagem
        </div>
      )}

      {/* Botões e Indicadores (Apenas se houver mais de uma imagem) */}
      {images.length > 1 && (
        <>
          <button
            type='button'
            onClick={onPrev}
            className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full flex items-center justify-center h-8 w-8 opacity-80 hover:opacity-100 transition-opacity z-10'
            aria-label='Imagem anterior'
          >
            <ChevronLeft className='h-4 w-4' />
          </button>
          <button
            type='button'
            onClick={onNext}
            className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full flex items-center justify-center h-8 w-8 opacity-80 hover:opacity-100 transition-opacity z-10'
            aria-label='Próxima imagem'
          >
            <ChevronRight className='h-4 w-4' />
          </button>
          <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10'>
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
