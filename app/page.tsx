import { client } from '@/sanity/lib/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AddToCartButton } from '@/components/AddToCartButton';
import Image from 'next/image';

// 1. Configuração de ISR (Incremental Static Regeneration)
export const revalidate = 60;

// 2. Tipagem
interface Product {
  _id: string;
  title: string;
  price: number;
  slug: string;
  imageUrl: string;
  categoryName: string;
}

// 3. Query do Sanity
const GET_PRODUCTS_QUERY = `
  *[_type == "product"] {
    _id,
    title,
    price,
    "slug": slug.current,
    "imageUrl": images[0].asset->url,
    "categoryName": category->title
  }
`;

export default async function Home() {
  // 4. Busca os dados
  const products: Product[] = await client.fetch(GET_PRODUCTS_QUERY);

  return (
    <main className='container mx-auto max-w-6xl p-8'>
      <h1 className='text-4xl font-bold mb-8'>Nossos Produtos</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {products.map((product) => (
          <Card key={product._id} className='flex flex-col overflow-hidden'>
            {/* Imagem do Produto */}
            {product.imageUrl && (
              <div className='h-48 overflow-hidden bg-muted'>
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  width={400}
                  height={300}
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
            <CardFooter className='p-4 pt-0'>
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
        ))}
      </div>
    </main>
  );
}
