import { client } from '@/sanity/lib/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AddToCartButton } from '@/components/AddToCartButton';
import { CategoryFilter } from '@/components/CategoryFilter'; // 1. Adicione a importação
import Image from 'next/image';
import Link from 'next/link';
import { globalDataQuery, allProductsQuery } from '@/sanity/lib/queries';
import { Product, Category, Settings } from './types/sanity';

export const revalidate = 60;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>;
}) {
  const { query, category } = await searchParams;

  // Chamada única para dados globais e produtos
  const [data, products] = await Promise.all([
    client.fetch<{ settings: Settings; categories: Category[] }>(
      globalDataQuery,
    ),
    client.fetch<Product[]>(allProductsQuery, {
      category: category ?? null,
      search: query ?? null,
    }),
  ]);

  return (
    <main className='container mx-auto max-w-6xl p-8'>
      <h1 className='text-4xl font-bold mb-4'>Nossos Produtos</h1>

      {/* 3. Renderiza o Componente de Filtro */}
      <CategoryFilter
        categories={data.categories}
        currentCategory={category}
        currentQuery={query}
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product.slug.current}`}
            className='flex flex-col'
          >
            <Card className='flex flex-col h-full overflow-hidden'>
              {/* Imagem do Produto */}
              {product.imageUrl && (
                <div className='relative w-full h-48 overflow-hidden bg-muted'>
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                    className='object-cover transition-transform hover:scale-105'
                  />
                </div>
              )}

              {/* Informações */}
              <CardContent className='flex flex-col grow p-4'>
                <p className='text-xs text-muted-foreground mb-1 uppercase tracking-wider'>
                  {product.categoryName || 'Sem Categoria'}
                </p>
                <h2 className='text-lg font-semibold mb-2'>{product.title}</h2>

                <p className='text-xl font-bold mt-auto'>
                  R$ {product.price.toFixed(2)}
                </p>
              </CardContent>

              {/* Botão de Compra */}
              <CardFooter className='p-0 mt-auto'>
                <AddToCartButton
                  product={{
                    _id: product._id,
                    title: product.title,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    slug: product.slug,
                  }}
                />
              </CardFooter>
            </Card>
          </Link>
        ))}

        {/* Mensagem caso não encontre produtos */}
        {products.length === 0 && (
          <div className='col-span-full py-12 text-center text-muted-foreground'>
            Nenhum produto encontrado para este filtro.
          </div>
        )}
      </div>
    </main>
  );
}
