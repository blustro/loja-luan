import { client } from '@/sanity/lib/client';
import { AddToCartButton } from '@/components/AddToCartButton';
import Image from 'next/image';
import { Product } from '@/app/types/sanity';
import { productBySlugQuery } from '@/sanity/lib/queries';

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

  const price = product.variants?.[0]?.price || 0;

  return (
    <div className='container mx-auto max-w-6xl p-6 grid md:grid-cols-2 gap-10'>
      <div>
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={600}
          height={600}
          className='rounded-lg w-full h-auto object-cover'
        />
      </div>

      {/* Detalhes */}
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>{product.title}</h1>
        <p className='text-2xl font-semibold text-primary'>
          R$ {price.toFixed(2)}
        </p>
        <p className='text-gray-600'>{product.description}</p>

        <div className='mt-4'>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
