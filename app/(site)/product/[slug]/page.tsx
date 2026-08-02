import { client } from '@/sanity/lib/client';
import { Product } from '@/app/types/sanity';
import { productBySlugQuery } from '@/sanity/lib/queries';
import { ProductInteraction } from '@/components/ProductInteraction';
import ProductGallery from '@/components/ProductGallery';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

  // Garante uma string válida para o OpenGraph (fallback caso imageUrl venha indefinido)
  const ogImage = product.imageUrl || '';

  return {
    title: product.title,
    description: product.description || 'Confira este produto no Mano do corre',
    openGraph: {
      title: product.title,
      description:
        product.description || 'Confira este produto no Mano do corre',
      images: [
        {
          url: ogImage,
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
  const { slug } = await params;

  const product = await client.fetch<Product>(productBySlugQuery, {
    slug: slug,
  });

  if (!product) {
    notFound();
  }

  // Prepara o array de imagens de forma segura para o TypeScript
  // Se houver o array 'images', usa ele; senão, cai no 'imageUrl' unitário como fallback.
  const galleryImages: string[] =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  return (
    <main className='container mx-auto max-w-6xl p-6 grid md:grid-cols-2 gap-10'>
      {/* Galeria Responsiva (Substituiu a imagem única) */}
      <div>
        <ProductGallery images={galleryImages} title={product.title} />
      </div>

      {/* Detalhes do Produto */}
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl md:text-4xl font-bold'>{product.title}</h1>
        <p className='text-gray-600'>{product.description}</p>

        <ProductInteraction product={product} />
      </div>
    </main>
  );
}
