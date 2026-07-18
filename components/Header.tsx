// components/Header.tsx
import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import { CartSidebarWrapper } from './CartSidebarWrapper'; // Importe aqui
import { Suspense } from 'react';
import { SearchBar } from './SearchBar';

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
      className='border-b bg-white sticky top-0 z-50'
    >
      <div className='container mx-auto px-4 h-16 flex items-center justify-between gap-2 md:gap-6'>
        {/* Logo */}
        <Link href='/' className=' md:min-w-fit shrink-0'>
          {settings?.logo ? (
            <Image src={settings.logo} alt='Logo' width={85} height={40} />
          ) : (
            <span className='text-xl font-bold'>Mano do Corre</span>
          )}
        </Link>

        {/* Barra de Busca com Suspense */}
        <div className='flex-1 flex justify-center px-1 md:px-0'>
          <Suspense
            fallback={
              <div className='h-9 w-full max-w-xs md:max-w-md bg-muted animate-pulse rounded-md' />
            }
          >
            <SearchBar />
          </Suspense>
        </div>

        {/* Menu de Categorias */}
        <nav>
          <ul className='flex gap-6'>
            {categories?.map((cat: { title: string; slug: string }) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className='relative group py-2 text-black'
                >
                  {cat.title}
                  <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-(--primary-color) transition-all duration-300 group-hover:w-full' />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Carrinho (agora dentro do header) */}
        <div>
          <CartSidebarWrapper />
        </div>
      </div>
    </header>
  );
}
