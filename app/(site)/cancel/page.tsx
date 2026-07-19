import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagamento Cancelado | Mano do corre',
  robots: { index: false, follow: false },
};

export default function CancelPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center'>
      <div className='p-4 bg-red-100 rounded-full mb-6'>
        <XCircle className='w-16 h-16 text-red-600' />
      </div>

      <h1 className='text-3xl font-bold mb-2'>Pagamento Cancelado</h1>

      <p className='text-muted-foreground mb-8 max-w-md'>
        Nenhuma cobrança foi realizada. Se você encontrou algum problema ou
        mudou de ideia, pode tentar finalizar sua compra novamente ou continuar
        navegando pela nossa loja.
      </p>

      <div className='flex gap-4'>
        <Button asChild>
          <Link href='/'>Voltar para a Loja</Link>
        </Button>
        <Button asChild>
          <Link href='/'>Continuar Comprando</Link>
        </Button>
      </div>
    </div>
  );
}
