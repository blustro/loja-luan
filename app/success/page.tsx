// app/success/page.tsx
import { stripe } from '@/lib/stripe';
import { CartCleaner } from '@/components/CartCleaner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Isso força a página a ser renderizada apenas no servidor (em tempo de requisição)

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;
  let session = null;

  if (session_id) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (error) {
      console.error('Erro ao buscar sessão do Stripe:', error);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center'>
      {/* Componente invisível para limpar o carrinho */}
      <CartCleaner />

      <div className='p-4 bg-green-100 rounded-full mb-6'>
        <CheckCircle2 className='w-16 h-16 text-green-600' />
      </div>

      <h1 className='text-3xl font-bold mb-2'>Pagamento Aprovado!</h1>

      {session ? (
        <div className='text-muted-foreground mb-8 max-w-md'>
          <p>
            Obrigado,{' '}
            <strong>{session.customer_details?.name || 'cliente'}</strong>!
          </p>
          <p>
            Seu pedido no valor de{' '}
            <strong>R$ {(session.amount_total! / 100).toFixed(2)}</strong> foi
            confirmado.
          </p>
          <p className='mt-2 text-sm'>
            Enviamos as instruções para: {session.customer_details?.email}
          </p>
        </div>
      ) : (
        <p className='text-muted-foreground mb-8'>
          Obrigado pela sua compra. Ela foi processada com sucesso.
        </p>
      )}

      <Button asChild>
        <Link href='/'>Voltar para a Loja</Link>
      </Button>
    </div>
  );
}
