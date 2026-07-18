'use server';

import { stripe } from '@/lib/stripe';

// Definimos o formato da resposta que a função vai enviar
export type CheckoutResponse = {
  success: boolean;
  clientSecret?: string;
  error?: string;
};

export async function createCheckoutSession(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[],
): Promise<CheckoutResponse> {
  try {
    const amount = Math.round(
      items.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100,
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'brl',
      automatic_payment_methods: { enabled: true },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret || '',
    };
  } catch (error) {
    console.error('Erro ao criar sessão Stripe:', error);
    return {
      success: false,
      error: 'Falha ao iniciar pagamento',
    };
  }
}
