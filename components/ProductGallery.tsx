'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback caso o produto não tenha imagens
  if (!images || images.length === 0) {
    return (
      <div className='aspect-square w-full bg-gray-100 flex items-center justify-center rounded-xl'>
        <span className='text-gray-400 text-sm'>Imagem indisponível</span>
      </div>
    );
  }

  return (
    <div className='flex flex-col md:flex-row-reverse gap-4'>
      {/* Imagem Principal (Destaque) */}
      <div className='relative aspect-square w-full flex-1 overflow-hidden rounded-xl bg-gray-50 border'>
        <Image
          src={images[activeIndex]}
          alt={`${title} - Foto ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          className='object-cover object-center transition-all duration-300'
          sizes='(max-width: 768px) 100vw, 50vw'
        />
      </div>

      {/* Lista de Miniaturas (Thumbnails) */}
      <div className='flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none'>
        {images.map((imgUrl, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              activeIndex === index
                ? 'border-black shadow-sm scale-95 md:scale-100 opacity-100 ring-2 ring-black/10'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={imgUrl}
              alt={`${title} miniatura ${index + 1}`}
              fill
              className='object-cover object-center'
              sizes='80px'
            />
          </button>
        ))}
      </div>
    </div>
  );
}
