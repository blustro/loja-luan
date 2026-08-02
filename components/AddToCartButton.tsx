'use client';

import { Product, Variant } from '@/app/types/sanity';
import { Button } from '@/components/ui/button';
import { checkoutButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

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

    // Função auxiliar segura para obter o rótulo da variante
    const getVariantLabel = (v: Variant) => {
      return !v.optionValue ||
        v.optionValue.length > 10 ||
        /^[a-f0-9]{8,}$/i.test(v.optionValue)
        ? 'Tamanho Único'
        : v.optionValue;
    };

    const variantLabel = getVariantLabel(selectedVariant);

    addItem({
      id: selectedVariant._id,
      _id: selectedVariant._id,
      productId: product._id,
      title: product.title,
      price: unitPrice,
      quantity: quantity,
      stock: selectedVariant.stock ?? 99,
      imageUrl: selectedVariant.imageUrl || product.imageUrl || '',
      variantTitle: variantLabel,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      optionType: selectedVariant.optionType as any,
      optionValue: selectedVariant.optionValue,
    });

    toast.success(
      `${product.title} (${variantLabel}) adicionado ao carrinho!`,
      {
        unstyled: true,
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
