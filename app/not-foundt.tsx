import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-4'>
      <h2 className='text-xl font-bold'>Página não encontrada</h2>
      <p className='text-xs text-muted-foreground max-w-sm'>
        Desculpe, não encontramos a página ou o produto que você está
        procurando.
      </p>
      <Button asChild className='font-bold text-xs'>
        <Link href='/'>Voltar para a Loja</Link>
      </Button>
    </div>
  );
}
