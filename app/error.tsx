'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-4'>
      <h2 className='text-xl font-bold'>Ops, algo deu errado!</h2>
      <p className='text-xs text-muted-foreground max-w-sm'>
        Ocorreu um erro inesperado ao carregar este conteúdo. Tente novamente.
      </p>
      <Button onClick={() => reset()} className='font-bold text-xs'>
        Tentar novamente
      </Button>
    </div>
  );
}
