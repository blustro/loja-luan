'use client';

import { useCartStore } from '@/store/useCartStore';
import { ClientOnly } from '@/components/ClientOnly';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { CartSummary } from './CartSummary';

export default function CartSidebar() {
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
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

        {/* p-0 e overflow-hidden são essenciais para o layout flex funcionar */}
        <SheetContent className='flex flex-col h-full p-0 overflow-hidden sm:max-w-md'>
          <SheetHeader className='p-6 pb-4 border-b shrink-0'>
            <SheetTitle>Seu Carrinho</SheetTitle>
          </SheetHeader>

          {/* O CartSummary vai gerenciar os itens, o frete e o botão fixo */}
          <CartSummary />
        </SheetContent>
      </Sheet>
    </ClientOnly>
  );
}
