import { client } from '@/sanity/lib/client';
import { CategoryFilter } from '@/components/CategoryFilter'; // 1. Adicione a importação
import { globalDataQuery, allProductsQuery } from '@/sanity/lib/queries';
import { Product, Category, Settings } from '../types/sanity';
import { ProductCard } from '@/components/ProductCard';

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
          <ProductCard key={product._id} product={product} />
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
