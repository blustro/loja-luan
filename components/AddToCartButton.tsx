'use client'; // <-- Isso avisa ao Next.js que este componente roda no navegador

import { Product, Variant } from '@/app/types/sanity';
import { Button } from '@/components/ui/button';
import { checkoutButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react'; // Ícone nativo que já vem com shadcn

interface AddToCartButtonProps {
  product: Product;
  variant?: Variant | null; // Adicione esta linha
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  variant,
  disabled,
}: AddToCartButtonProps) {
  // Agora você pode usar 'variant' aqui dentro para acessar o preço correto
  // e enviar para o Stripe/Carrinho

  // Puxamos a função de adicionar do nosso Zustand
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Lógica inteligente: usa a variante passada ou a primeira do array
    const selectedVariant = variant ?? product.variants?.[0];

    if (!selectedVariant) {
      alert('Erro: Este produto não possui preço configurado.');
      return;
    }

    const itemToAdd = {
      _id: `${product._id}-${selectedVariant.title}`,
      title: `${product.title} (${selectedVariant.title})`,
      price: selectedVariant.price,
      imageUrl: product.imageUrl,
    };

    addItem(itemToAdd);
    alert(`${product.title} adicionado ao carrinho!`); // Um aviso simples por enquanto
  };

  return (
    <Button
      className={cn(
        checkoutButtonStyle,
        'w-full flex justify-center items-center font-bold',
      )}
      onClick={handleAddToCart}
      disabled={disabled}
    >
      <ShoppingCart className='mr-2 h-4 w-4' />
      Adicionar ao Carrinho
    </Button>
  );
}
