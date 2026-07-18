// components/Header.tsx
import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import { CartSidebarWrapper } from './CartSidebarWrapper'; // Importe aqui

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
      className='border-b'
    >
      <div className='container mx-auto max-w-6xl p-4 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/'>
          {settings?.logo ? (
            <Image src={settings.logo} alt='Logo' width={120} height={40} />
          ) : (
            <span className='text-xl font-bold'>Mano do Corre</span>
          )}
        </Link>

        {/* Menu de Categorias */}
        <nav>
          <ul className='flex gap-6'>
            {categories?.map((cat: { title: string; slug: string }) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className='hover:text-(--primary-color)'
                >
                  {cat.title}
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
