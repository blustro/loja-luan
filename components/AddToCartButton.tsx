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
  const { items, addItem, removeItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedVariant = variant ?? product.variants?.[0];

    if (!selectedVariant) {
      toast.error('Este produto não possui variante configurada.');
      return;
    }

    const unitPrice = selectedVariant.price ?? product.price ?? 0;
    const maxStock = selectedVariant.stock ?? 99;

    // Verifica quanto já existe do item no carrinho e valida com a quantidade nova
    const existingItem = items.find((item) => item._id === selectedVariant._id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const totalRequestedQty = currentQtyInCart + quantity;

    if (totalRequestedQty > maxStock) {
      toast.warning(
        `Ops! Você atingiu o limite máximo em estoque (${maxStock} un.) para ${product.title}.`,
        {
          unstyled: true,
          classNames: {
            toast:
              'bg-amber-50 text-amber-900 border border-amber-200 p-4 rounded-lg shadow-sm flex items-center gap-3 font-bold text-xs',
          },
        },
      );
      return;
    }

    const getVariantLabel = (v: Variant) => {
      return !v.optionValue ||
        v.optionValue.length > 10 ||
        /^[a-f0-9]{8,}$/i.test(v.optionValue)
        ? 'Tamanho Único'
        : v.optionValue;
    };

    const variantLabel = getVariantLabel(selectedVariant);

    const cartItemData = {
      id: selectedVariant._id,
      _id: selectedVariant._id,
      productId: product._id,
      title: product.title,
      price: unitPrice,
      quantity: quantity,
      stock: maxStock,
      imageUrl: selectedVariant.imageUrl || product.imageUrl || '',
      variantTitle: variantLabel,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      optionType: selectedVariant.optionType as any,
      optionValue: selectedVariant.optionValue,
    };

    addItem(cartItemData);

    toast.success(
      `${product.title} (${variantLabel}) adicionado ao carrinho!`,
      {
        unstyled: true,
        classNames: {
          toast:
            'bg-green-50 text-green-900 border border-green-200 p-4 rounded-lg shadow-sm flex items-center justify-between gap-4 font-bold text-xs w-full',
          actionButton:
            'bg-green-900 text-white px-3 py-1.5 rounded text-[11px] hover:bg-green-800 transition-colors shrink-0',
        },
        action: {
          label: 'Desfazer',
          onClick: () => {
            removeItem(cartItemData._id);
            toast.info('Ação desfeita. Item removido do carrinho.', {
              unstyled: true,
              classNames: {
                toast:
                  'bg-red-50 text-red-900 border border-red-200 p-4 rounded-lg shadow-sm flex items-center gap-3 font-bold text-xs',
              },
            });
          },
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
