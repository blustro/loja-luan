import { CartList } from '@/components/CartList';
import { CartSummary } from '@/components/CartSummary';

export default function CartPage() {
  return (
    <div className='container mx-auto py-12'>
      <h1 className='text-3xl font-bold mb-8'>Seu Carrinho</h1>

      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-2'>
          <CartList />
        </div>

        <div className='md:col-span-1'>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
