'use client';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/app/actions/checkout';
import { checkoutButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';

export function CartSummary() {
  const { items } = useCartStore();
  const total = items.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    const response = await createCheckoutSession(items);
    if (response.url) window.location.href = response.url;
    else if (response.error) alert(response.error);
  };

  return (
    <div className='border rounded-lg p-6 space-y-4 h-fit'>
      <h2 className='text-xl font-bold'>Resumo</h2>
      <div className='flex justify-between text-lg'>
        <span>Total</span>
        <span className='font-bold'>R$ {total.toFixed(2)}</span>
      </div>
      <Button
        onClick={handleCheckout}
        className={cn(checkoutButtonStyle, 'w-full')}
      >
        Finalizar Compra
      </Button>
    </div>
  );
}
