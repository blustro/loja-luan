'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Variant } from '@/app/types/sanity';

interface ShippingCalculatorProps {
  selectedVariant: Variant | null;
}

interface AddressInfo {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deadline: string;
}

export function ShippingCalculator({
  selectedVariant,
}: ShippingCalculatorProps) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<AddressInfo | null>(null);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep || cep.length < 8) {
      setError('Digite um CEP válido.');
      return;
    }

    setLoading(true);
    setError(null);
    setAddress(null);
    setOptions([]);

    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep, variant: selectedVariant }),
      });

      const data = await response.json();

      if (data.success) {
        setAddress(data.address);
        setOptions(data.options);
      } else {
        setError(data.error || 'CEP não encontrado.');
      }
    } catch (err) {
      setError('Erro de conexão ao consultar CEP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-3 pt-4 border-t'>
      <p className='text-xs font-bold text-muted-foreground'>
        CONSULTAR ENDEREÇO E FRETE
      </p>

      <form onSubmit={handleCalculate} className='flex gap-2'>
        <Input
          type='text'
          placeholder='00000-000'
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          maxLength={9}
          className='max-w-40'
        />
        <Button type='submit' variant='outline' disabled={loading}>
          {loading ? 'Buscando...' : 'OK'}
        </Button>
      </form>

      {error && <p className='text-xs text-red-500'>{error}</p>}

      {address && (
        <div className='text-xs text-muted-foreground bg-muted/30 p-2 rounded'>
          📍 {address.logradouro}, {address.bairro} - {address.cidade}/
          {address.uf}
        </div>
      )}

      {options.length > 0 && (
        <div className='space-y-2 bg-muted/50 p-3 rounded-md text-sm'>
          {options.map((opt) => (
            <div key={opt.id} className='flex justify-between items-center'>
              <span className='text-muted-foreground'>
                {opt.name} <span className='text-xs'>({opt.deadline})</span>
              </span>
              <span className='font-semibold'>R$ {opt.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
