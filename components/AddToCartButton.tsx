'use client';

import { Product, Variant } from '@/app/types/sanity';
import { Button } from '@/components/ui/button';
import { checkoutButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  variant?: Variant | null;
  quantity: number;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  variant,
  quantity,
  disabled,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Lógica inteligente: usa a variante passada ou a primeira do array
    const selectedVariant = variant ?? product.variants?.[0];

    if (!selectedVariant) {
      alert('Erro: Este produto não possui variante configurada.');
      return;
    }

    // Fallback seguro para o preço
    const unitPrice = selectedVariant.price ?? product.price ?? 0;
    const variantLabel = selectedVariant.title || selectedVariant.optionValue;

    // Passando o objeto completo exigido pela interface CartItem
    addItem({
      id: selectedVariant._id,
      _id: selectedVariant._id,
      productId: product._id,
      title: product.title,
      price: unitPrice,
      quantity: quantity,
      stock: selectedVariant.stock ?? 0,
      imageUrl: selectedVariant.imageUrl || product.imageUrl || '',
      variantTitle: variantLabel,
      optionType: selectedVariant.optionType,
      optionValue: selectedVariant.optionValue,
    });

    alert(`${product.title} (${variantLabel}) adicionado ao carrinho!`);
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
