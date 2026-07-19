'use client';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

export function CartList() {
  const { items, increaseQuantity, decreaseQuantity, removeItem } =
    useCartStore();

  if (items.length === 0)
    return <p className='text-muted-foreground'>Seu carrinho está vazio.</p>;

  return (
    <div className='space-y-4'>
      {items.map((item) => (
        <div key={item._id} className='flex gap-4 items-center border-b pb-4'>
          <div className='h-16 w-16 bg-muted rounded overflow-hidden relative shrink-0'>
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className='object-cover'
            />
          </div>
          <div className='flex-1'>
            <h3 className='text-sm font-semibold'>{item.title}</h3>
            <p className='text-sm text-muted-foreground'>
              R$ {item.price.toFixed(2)}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => decreaseQuantity(item._id)}
            >
              <Minus className='h-3 w-3' />
            </Button>
            <span className='text-sm w-4 text-center'>{item.quantity}</span>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => increaseQuantity(item._id)}
            >
              <Plus className='h-3 w-3' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-destructive ml-2'
              onClick={() => removeItem(item._id)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
