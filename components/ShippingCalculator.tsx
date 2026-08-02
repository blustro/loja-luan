'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Variant } from '@/app/types/sanity';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deadline: string;
}

interface AddressInfo {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string; // Incluído para facilitar o uso no checkout se precisar
}

interface ShippingCalculatorProps {
  selectedVariant: Variant | null;
  onSelectShipping: (option: ShippingOption, address: AddressInfo) => void;
}

export function ShippingCalculator({
  selectedVariant,
  onSelectShipping,
}: ShippingCalculatorProps) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<AddressInfo | null>(null);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
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
    setSelectedOptionId(null);

    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep, variant: selectedVariant }),
      });

      const data = await response.json();

      if (data.success) {
        const addressData = { ...data.address, cep };
        setAddress(addressData);
        setOptions(data.options);

        // Seleciona a primeira opção por padrão (ex: PAC) se houver opções
        if (data.options.length > 0) {
          const firstOption = data.options[0];
          setSelectedOptionId(firstOption.id);
          onSelectShipping(firstOption, addressData);
        }
      } else {
        setError(data.error || 'CEP não encontrado.');
      }
    } catch (err) {
      setError('Erro de conexão ao consultar CEP.');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (optionId: string) => {
    setSelectedOptionId(optionId);
    const chosenOption = options.find((opt) => opt.id === optionId);
    if (chosenOption && address) {
      onSelectShipping(chosenOption, address);
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
        <div className='space-y-2 mt-2'>
          <Label className='text-xs font-semibold text-muted-foreground'>
            Escolha o método de envio:
          </Label>
          <RadioGroup
            value={selectedOptionId || ''}
            onValueChange={handleShippingChange}
            className='space-y-2'
          >
            {options.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center justify-between p-3 border rounded-md cursor-pointer transition-all ${
                  selectedOptionId === opt.id
                    ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-600'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className='flex items-center space-x-3'>
                  <RadioGroupItem value={opt.id} id={opt.id} />
                  <Label htmlFor={opt.id} className='cursor-pointer'>
                    <span className='font-medium text-sm'>{opt.name}</span>
                    <span className='block text-xs text-muted-foreground'>
                      Prazo: {opt.deadline}
                    </span>
                  </Label>
                </div>
                <span className='font-semibold text-sm'>
                  R$ {opt.price.toFixed(2)}
                </span>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
