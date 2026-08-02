'use client';

import { useCartStore, CartItem } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export function CartList() {
  const { items, increaseQuantity, decreaseQuantity, removeItem, addItem } =
    useCartStore();

  if (items.length === 0) {
    return null;
  }

  const handleRemove = (item: CartItem) => {
    removeItem(item._id);

    const variantText = item.variantTitle ? ` (${item.variantTitle})` : '';

    toast.info(`${item.title}${variantText} foi removido.`, {
      unstyled: true,
      classNames: {
        toast:
          'bg-red-50 text-red-900 border border-red-200 p-4 rounded-lg shadow-sm flex items-center justify-between gap-4 font-bold text-xs w-full',
        actionButton:
          'bg-red-900 text-white px-3 py-1.5 rounded text-[11px] hover:bg-red-800 transition-colors shrink-0',
      },
      action: {
        label: 'Desfazer',
        onClick: () => {
          addItem(item);
          toast.success('Item restaurado ao carrinho!', {
            unstyled: true,
            classNames: {
              toast:
                'bg-green-50 text-green-900 border border-green-200 p-4 rounded-lg shadow-sm flex items-center gap-3 font-bold text-xs',
            },
          });
        },
      },
    });
  };

  const handleDecrease = (item: CartItem) => {
    if (item.quantity === 1) {
      toast.info(
        `${item.title} ${item.variantTitle ? `(${item.variantTitle})` : ''} foi removido do carrinho.`,
        {
          unstyled: true,
          classNames: {
            toast:
              'bg-red-50 text-red-900 border border-red-200 p-4 rounded-lg shadow-sm flex items-center gap-3 font-bold text-xs',
          },
        },
      );
    }
    decreaseQuantity(item._id);
  };

  const handleIncrease = (item: CartItem) => {
    const maxStock = item.stock ?? 99;

    if (item.quantity >= maxStock) {
      toast.warning(
        `Ops! Você atingiu o limite máximo em estoque (${maxStock} un.) para ${item.title}.`,
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

    increaseQuantity(item._id);
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-xs font-bold text-muted-foreground tracking-wider'>
        ITENS NO CARRINHO
      </h3>

      <div className='divide-y divide-border'>
        {items.map((item) => {
          const unitPrice = item.price ?? 0;
          const totalItemPrice = unitPrice * item.quantity;
          const maxStock = item.stock ?? 99;
          const isMaxedOut = item.quantity >= maxStock;

          return (
            <div key={item._id} className='py-3 first:pt-0 last:pb-0 space-y-2'>
              {/* LINHA 1: Imagem, Título, Variante e Preço Total */}
              <div className='flex items-start gap-3'>
                {item.imageUrl ? (
                  <div className='relative w-14 h-14 shrink-0 rounded-md overflow-hidden border bg-muted'>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                ) : (
                  <div className='w-14 h-14 shrink-0 rounded-md bg-muted flex items-center justify-center text-[10px] text-muted-foreground'>
                    Sem foto
                  </div>
                )}

                <div className='flex-1 min-w-0'>
                  <h4 className='text-xs font-medium text-foreground line-clamp-2 leading-snug'>
                    {item.title}
                  </h4>
                  {item.variantTitle && (
                    <span className='inline-block text-[10px] text-muted-foreground mt-0.5 bg-muted px-1.5 py-0.5 rounded'>
                      Tam/Var: {item.variantTitle}
                    </span>
                  )}
                </div>

                <div className='text-right shrink-0'>
                  <span className='text-xs font-bold text-foreground'>
                    R$ {totalItemPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* LINHA 2: Controles de Quantidade + Botão de Excluir */}
              <div className='flex items-center justify-between pt-1'>
                <div className='flex items-center border rounded-md overflow-hidden bg-background'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDecrease(item)}
                    className='h-7 w-7 rounded-none text-muted-foreground hover:bg-muted'
                  >
                    <Minus className='h-3 w-3' />
                  </Button>

                  <span className='px-3 text-xs font-semibold w-8 text-center'>
                    {item.quantity}
                  </span>

                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => handleIncrease(item)}
                    className={`h-7 w-7 rounded-none text-muted-foreground hover:bg-muted ${
                      isMaxedOut ? 'opacity-40 hover:bg-transparent' : ''
                    }`}
                  >
                    <Plus className='h-3 w-3' />
                  </Button>
                </div>

                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => handleRemove(item)}
                  className='h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs gap-1'
                >
                  <Trash2 className='h-3 w-3' />
                  <span>Remover</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
