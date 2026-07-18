'use client'; // <-- Isso avisa ao Next.js que este componente roda no navegador

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react'; // Ícone nativo que já vem com shadcn

interface AddToCartButtonProps {
  product: {
    _id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  // Puxamos a função de adicionar do nosso Zustand
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    alert(`${product.title} adicionado ao carrinho!`); // Um aviso simples por enquanto
  };

  return (
    <Button className='w-full' onClick={handleAddToCart}>
      <ShoppingCart className='mr-2 h-4 w-4' />
      Adicionar ao Carrinho
    </Button>
  );
}
