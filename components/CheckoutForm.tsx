'use client';

import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from './ui/button';

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submetido!'); // Se isso aparecer, o form está ok

    if (!stripe || !elements) {
      console.log('Stripe ou Elements não estão prontos');
      return;
    }

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      console.error('Erro no Stripe:', error);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <PaymentElement />

      {/* 
        1. Adicionamos type="submit" para garantir que o navegador entenda a função.
        2. Adicionamos um onClick de teste para ver se o clique acontece.
      */}
      <Button
        type='submit'
        disabled={!stripe || loading}
        className='w-full'
        onClick={() => console.log('Botão clicado!')}
      >
        {loading ? 'Processando...' : 'Pagar Agora'}
      </Button>
    </form>
  );
}
