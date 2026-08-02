import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import { Product } from '@/app/types/sanity';
import { productBySlugQuery } from '@/sanity/lib/queries';
import { ProductInteraction } from '@/components/ProductInteraction';
import { Metadata } from 'next';

// 1. Função que gera dinamicamente o preview para o WhatsApp e redes sociais
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await client.fetch<Product>(productBySlugQuery, {
    slug: slug,
  });

  if (!product) {
    return {
      title: 'Produto não encontrado | Mano do corre',
    };
  }

  return {
    title: product.title,
    description: product.description || 'Confira este produto no Mano do corre',
    openGraph: {
      title: product.title,
      description:
        product.description || 'Confira este produto no Mano do corre',
      images: [
        {
          url: product.imageUrl || '',
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
  };
}

// 2. Componente principal da Página do Produto
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await nos params (padrão do Next.js App Router)
  const { slug } = await params;

  const product = await client.fetch<Product>(productBySlugQuery, {
    slug: slug,
  });

  if (!product) {
    return <div className='p-10 text-center'>Produto não encontrado.</div>;
  }

  return (
    <div className='container mx-auto max-w-6xl p-6 grid md:grid-cols-2 gap-10'>
      <div>
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={600}
          height={600}
          priority
          className='rounded-lg w-full h-auto object-cover'
        />
      </div>

      {/* Detalhes */}
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>{product.title}</h1>
        <p className='text-gray-600'>{product.description}</p>

        <ProductInteraction product={product} />
      </div>
    </div>
  );
}
