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
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '@/lib/stripe-client';
import { createCheckoutSession } from '@/app/actions/checkout';
import { CheckoutForm } from './CheckoutForm';
import { useState } from 'react';

export default function CartSidebar() {
  const { items, increaseQuantity, decreaseQuantity, removeItem } =
    useCartStore();

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleCheckout = async () => {
    // O TypeScript agora sabe que 'result' segue o modelo CheckoutResponse
    const result = await createCheckoutSession(items);

    if (result.success && result.clientSecret) {
      setClientSecret(result.clientSecret);
    } else {
      // Aqui você pode tratar o erro, por exemplo:
      alert(result.error || 'Erro desconhecido');
    }
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
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

          {items.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-muted-foreground space-y-4'>
              <ShoppingCart className='h-12 w-12 opacity-20' />
              <p>Seu carrinho está vazio.</p>
            </div>
          ) : (
            <>
              <div className='flex-1 overflow-y-auto py-6 space-y-6'>
                {items.map((item) => (
                  <div
                    key={item._id}
                    className='flex gap-4 items-center border-b'
                  >
                    <div className='h-16 w-16 bg-muted rounded overflow-hidden relative shrink-0 ml-4'>
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
                    <div className='flex items-center gap-2 mr-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => decreaseQuantity(item._id)}
                      >
                        <Minus className='h-3 w-3' />
                      </Button>
                      <span className='text-sm w-4 text-center'>
                        {item.quantity}
                      </span>
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

              <div className='mt-auto border-t p-4 space-y-4'>
                <Separator className='mb-4' />
                <div className='flex justify-between font-semibold text-lg mb-4 mx-4'>
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm />
                  </Elements>
                ) : (
                  <Button
                    className='w-full h-12 text-base'
                    size='lg'
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </ClientOnly>
  );
}
