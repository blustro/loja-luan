'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createCheckoutSession } from '@/app/actions/checkout';
import { checkoutButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';

interface AddressInfo {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

interface ShippingOption {
  name: string;
  price: number;
  days?: number;
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

  // O preço do frete agora depende da opção selecionada
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

        // Define a primeira opção (ex: PAC) como padrão automaticamente
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

  return (
    <div className='border rounded-lg p-6 space-y-6 h-fit bg-card'>
      <h2 className='text-xl font-bold'>Resumo do Pedido</h2>

      <div className='flex justify-between text-sm text-muted-foreground'>
        <span>Subtotal</span>
        <span>R$ {subtotal.toFixed(2)}</span>
      </div>

      <div className='space-y-3 pt-4 border-t'>
        <p className='text-xs font-bold text-muted-foreground'>
          CALCULAR FRETE E ENDEREÇO
        </p>
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
          <div className='space-y-3 bg-muted/40 p-3 rounded'>
            <div className='text-xs text-muted-foreground'>
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

        {/* Lista de Opções de Frete (PAC / SEDEX) */}
        {shippingOptions.length > 0 && (
          <div className='space-y-2 pt-2'>
            <p className='text-xs font-bold text-muted-foreground'>
              OPÇÕES DE ENTREGA
            </p>
            <div className='space-y-2'>
              {shippingOptions.map((opt, index) => (
                <label
                  key={index}
                  className={cn(
                    'flex items-center justify-between p-2.5 rounded-md border text-sm cursor-pointer transition-all',
                    selectedShipping?.name === opt.name
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-border hover:bg-muted/40',
                  )}
                >
                  <div className='flex items-center gap-2.5'>
                    <input
                      type='radio'
                      name='shippingOption'
                      checked={selectedShipping?.name === opt.name}
                      onChange={() => setSelectedShipping(opt)}
                      className='accent-primary'
                    />
                    <div>
                      <p className='text-sm leading-none'>{opt.name}</p>
                      {opt.days && (
                        <p className='text-[10px] text-muted-foreground mt-1'>
                          Até {opt.days} dias úteis
                        </p>
                      )}
                    </div>
                  </div>
                  <span className='font-semibold'>
                    R$ {opt.price.toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='flex justify-between text-lg font-bold pt-4 border-t'>
        <span>Total</span>
        <span>R$ {total.toFixed(2)}</span>
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
  );
}
