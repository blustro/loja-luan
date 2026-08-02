import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import { CartSidebarWrapper } from './CartSidebarWrapper';
import { Suspense } from 'react';
import { SearchBar } from './SearchBar';
import { MobileMenu } from './MobileMenu';

export default async function Header() {
  const data = await client.fetch(`{
    "settings": *[_type == "settings"][0]{ "logo": images[0].asset->url, "primaryColor": primaryColor.hex },
    "categories": *[_type == "category"]{ title, "slug": slug.current }
  }`);

  const { settings, categories } = data;

  return (
    <header
      style={
        { '--primary-color': settings?.primaryColor } as React.CSSProperties
      }
      className='border-b bg-white sticky top-0 z-50 w-full'
    >
      <div className='container mx-auto px-4 h-16 flex items-center justify-between gap-2 md:gap-6'>
        {/* Esquerda: Menu Hambúrguer (Mobile) + Logo */}
        <div className='flex items-center gap-2'>
          <Link href='/' className='shrink-0'>
            {settings?.logo ? (
              <Image
                className='w-25 h-full'

                src={settings.logo}
                alt='Logo'
                width={80}
                height={40}
                priority
              />
            ) : (
              <span className='text-lg md:text-xl font-bold'>
                Mano do Corre
              </span>
            )}
          </Link>
        </div>

        {/* Centro: Barra de Busca com Suspense */}
        <div className='flex-1 flex justify-center px-1 md:px-0 max-w-md'>
          <Suspense
            fallback={
              <div className='h-9 w-full bg-muted animate-pulse rounded-md' />
            }
          >
            <SearchBar />
          </Suspense>
        </div>

        {/* Direita: Menu de Categorias (Apenas Desktop) + Carrinho */}
        <div className='flex items-center gap-4'>
          <nav className='hidden md:block'>
            <ul className='flex gap-6 items-center'>
              {categories?.map((cat: { title: string; slug: string }) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className='relative group py-2 text-sm text-black hover:font-bold transition-all'
                  >
                    {cat.title}
                    <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-(--primary-color) transition-all duration-300 group-hover:w-full' />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <MobileMenu categories={categories} />

          <CartSidebarWrapper />
        </div>
      </div>
    </header>
  );
}
