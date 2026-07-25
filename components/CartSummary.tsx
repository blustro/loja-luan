'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createCheckoutSession } from '@/app/actions/checkout';
import { checkoutButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';
import { CartList } from './CartList';

interface AddressInfo {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deadline?: string;
}

export function CartSummary() {
  const { items } = useCartStore();

  const [cep, setCep] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [address, setAddress] = useState<AddressInfo | null>(null);
  const [cepError, setCepError] = useState<string | null>(null);

  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');

  const subtotal = items.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0,
  );

  const shippingPrice = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal + shippingPrice;

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setCepError('Digite um CEP válido.');
      return;
    }

    setLoadingCep(true);
    setCepError(null);
    setAddress(null);
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cleanCep }),
      });

      const data = await response.json();

      if (data.success) {
        setAddress({
          ...data.address,
          cep: cleanCep,
        });
        setShippingOptions(data.options);

        if (data.options && data.options.length > 0) {
          setSelectedShipping(data.options[0]);
        }
      } else {
        setCepError(data.error || 'CEP não encontrado.');
      }
    } catch (err) {
      setCepError('Erro ao consultar CEP.');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleShippingChange = (optionId: string) => {
    const option = shippingOptions.find((opt) => opt.id === optionId);
    if (option) {
      setSelectedShipping(option);
    }
  };

  const handleCheckout = async () => {
    const response = await createCheckoutSession({
      items,
      shippingCost: shippingPrice,
      shippingName: selectedShipping?.name || 'Frete',
      address: address ? { ...address, numero, complemento } : null,
    });

    if (response.url) window.location.href = response.url;
    else if (response.error) alert(response.error);
  };

  if (items.length === 0) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground'>
        <p>Seu carrinho está vazio.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      {/* 1. ÁREA ROLÁVEL DO MEIO (Itens + Frete + Endereço) */}
      <div className='flex-1 overflow-y-auto p-6 space-y-2'>
        <CartList />

        <div className='border-t pt-6 space-y-4'>
          <h3 className='text-xs font-bold text-muted-foreground tracking-wider'>
            CALCULAR FRETE E ENDEREÇO
          </h3>
          <form onSubmit={handleCalculateShipping} className='flex gap-2'>
            <Input
              type='text'
              placeholder='00000-000'
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              maxLength={9}
            />
            <Button type='submit' variant='outline' disabled={loadingCep}>
              {loadingCep ? '...' : 'OK'}
            </Button>
          </form>

          {cepError && <p className='text-xs text-red-500'>{cepError}</p>}

          {address && (
            <div className='space-y-3 bg-muted/40 p-3 rounded-md overflow-hidden'>
              <div className='text-xs text-muted-foreground break-words'>
                📍 {address.logradouro}, {address.bairro} - {address.cidade}/
                {address.uf}
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <Input
                  type='text'
                  placeholder='Número *'
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required
                />
                <Input
                  type='text'
                  placeholder='Apto / Bloco'
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
            </div>
          )}

          {shippingOptions.length > 0 && (
            <div className='space-y-2 pt-2 w-full overflow-hidden'>
              <Label className='text-xs font-bold text-muted-foreground'>
                OPÇÕES DE ENTREGA
              </Label>
              <RadioGroup
                value={selectedShipping?.id || ''}
                onValueChange={handleShippingChange}
                className='space-y-2 w-full'
              >
                {shippingOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-md border text-sm cursor-pointer transition-all gap-2 w-full box-border overflow-hidden',
                      selectedShipping?.id === opt.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/40',
                    )}
                  >
                    <div className='flex items-center space-x-3 min-w-0 flex-1'>
                      <RadioGroupItem
                        value={opt.id}
                        id={opt.id}
                        className='shrink-0'
                      />
                      <Label
                        htmlFor={opt.id}
                        className='cursor-pointer min-w-0'
                      >
                        <span className='text-xs text-foreground block truncate'>
                          {opt.name}
                        </span>
                        {opt.deadline && (
                          <span className='block text-[10px] text-muted-foreground mt-0.5 truncate'>
                            Prazo: {opt.deadline}
                          </span>
                        )}
                      </Label>
                    </div>
                    <span className='text-xs font-semibold text-foreground shrink-0 pl-1'>
                      R$ {opt.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>
      </div>

      {/* 2. RODAPÉ FIXO (Totais e Botão de Finalizar sempre visíveis) */}
      <div className='border-t bg-card p-6 space-y-3 shrink-0 shadow-lg'>
        <div className='space-y-1 text-sm'>
          <div className='flex justify-between text-muted-foreground'>
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          {selectedShipping && (
            <div className='flex justify-between text-muted-foreground'>
              <span>Frete ({selectedShipping.name})</span>
              <span>R$ {shippingPrice.toFixed(2)}</span>
            </div>
          )}
          <div className='flex justify-between text-lg font-bold text-foreground pt-2 border-t'>
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          onClick={handleCheckout}
          disabled={
            items.length === 0 || !address || !numero || !selectedShipping
          }
          className={cn(checkoutButtonStyle, 'w-full')}
        >
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
}
