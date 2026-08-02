'use client';

import { Product, Variant } from '@/app/types/sanity';
import { Button } from '@/components/ui/button';
import { checkoutButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner'; // Importação do Sonner

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

    const selectedVariant = variant ?? product.variants?.[0];

    if (!selectedVariant) {
      toast.error('Este produto não possui variante configurada.');
      return;
    }

    const unitPrice = selectedVariant.price ?? product.price ?? 0;
    const variantLabel = selectedVariant.title || selectedVariant.optionValue;

    // No seu AddToCartButton.tsx
    addItem({
      id: selectedVariant._id,
      _id: selectedVariant._id,
      productId: product._id,
      title: product.title,
      price: unitPrice,
      quantity: quantity,
      stock: selectedVariant.stock ?? 99, // <--- Alterado de 0 para 99 como segurança
      imageUrl: selectedVariant.imageUrl || product.imageUrl || '',
      variantTitle: variantLabel,
      optionType: selectedVariant.optionType,
      optionValue: selectedVariant.optionValue,
    });

    // Notificação elegante no topo da tela em vez do alert travado
    toast.success(
      `${product.title} (${variantLabel}) adicionado ao carrinho!`,
      {
        unstyled: true, // Remove o estilo padrão do Sonner
        classNames: {
          toast:
            'bg-green-50 text-green-900 border border-green-200 p-4 rounded-lg shadow-sm flex items-center gap-3 text-xs font-bold',
        },
      },
    );
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
