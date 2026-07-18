'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pegamos o valor atual da URL
  const queryParam = searchParams.get('query') || '';

  // 1. Estados locais
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [prevQuery, setPrevQuery] = useState(queryParam);

  // 2. Padrão oficial do React para sincronizar sem useEffect
  // Se a URL mudou (ex: usuário clicou em 'Voltar' no navegador), nós atualizamos o estado.
  if (queryParam !== prevQuery) {
    setPrevQuery(queryParam);
    setSearchTerm(queryParam);
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set('query', term);
    else params.delete('query');

    router.push(`/?${params.toString()}`);
  }, 300);

  return (
    <div className='relative w-full max-w-xs md:max-w-md mx-auto'>
      <div className='absolute inset-y-0 left-2.5 flex items-center pointer-events-none'>
        <Search className='h-4 w-4 text-muted-foreground' />
      </div>

      <Input
        type='search'
        placeholder='Buscar produtos...'
        className='pl-9 w-full bg-secondary/50 border-transparent focus-visible:bg-transparent'
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}
