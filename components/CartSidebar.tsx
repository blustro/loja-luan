'use client';

import { useCartStore } from '@/store/useCartStore';
import { ClientOnly } from '@/components/ClientOnly'; // Importe o novo componente
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { CartList } from './CartList';
import { CartSummary } from './CartSummary';

export default function CartSidebar() {
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    // O ClientOnly garante que o conteúdo só renderize após o mount no cliente
    <ClientOnly>
      <Sheet>
        <SheetTrigger
          render={
            <Button variant='outline' size='icon' className='relative'>
              <ShoppingCart className='h-5 w-5' />
              <span className='absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                {itemCount}
              </span>
            </Button>
          }
        />

        <SheetContent className='w-full sm:max-w-lg flex flex-col'>
          <SheetHeader>
            <SheetTitle>Seu Carrinho</SheetTitle>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto py-6'>
            <CartList />
          </div>

          <div className='mt-auto border-t p-4'>
            <CartSummary />
          </div>
        </SheetContent>
      </Sheet>
    </ClientOnly>
  );
}
