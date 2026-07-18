import { client } from '@/sanity/lib/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AddToCartButton } from '@/components/AddToCartButton';
import Image from 'next/image';
import Link from 'next/link';

// 1. Configuração de ISR (Incremental Static Regeneration)
export const revalidate = 60;

// 2. Tipagem
interface Product {
  _id: string;
  title: string;
  price: number;
  slug: { current: string }; // <-- Atualize esta linha
  imageUrl: string;
  categoryName: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { query?: string; category: string };
}) {
  const { query, category } = await searchParams;
  // Monta a query dinamicamente
  const filter = [
    `_type == 'product'`,
    query ? `title match '${query}*'` : '',
    category ? `category->slug.current == '${category}'` : '', // <-- Adicionei o ' no final
  ]
    .filter(Boolean)
    .join(' && ');

  // 4. Busca os dados
  const products: Product[] = await client.fetch(
    `*[_type == 'product' && ${filter || 'true'}] {
      _id,
      title,
      price,
      slug,
      "imageUrl": coalesce(image.asset->url, images[0].asset->url),
      "categoryName": category->title
    }`,
  );

  return (
    <main className='container mx-auto max-w-6xl p-8'>
      <h1 className='text-4xl font-bold mb-8'>Nossos Produtos</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {products.map((product) => (
          // 1. Adicionamos 'flex flex-col' no Link para ele esticar na célula da grid
          <Link
            key={product._id}
            href={`/product/${product.slug.current}`}
            className='flex flex-col'
          >
            {/* 2. Adicionamos 'h-full' para o Card preencher o Link */}
            <Card className='flex flex-col h-full overflow-hidden'>
              {/* Imagem do Produto */}
              {product.imageUrl && (
                // 1. Adicionamos a classe 'relative' e 'w-full' no container pai
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

                {/* O mt-auto aqui empurra o preço para baixo se houver espaço livre */}
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
                  }}
                />
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
