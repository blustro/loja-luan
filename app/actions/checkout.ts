'use server';

import { stripe } from '@/lib/stripe';

export async function createCheckoutSession(
  items: { price: number; title: string; quantity: number }[],
) {
  try {
    // 1. Calculamos o total em centavos (o Stripe exige inteiros em centavos)
    const amount = Math.round(
      items.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100,
    );

    // 2. Criamos o PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'brl', // Reais
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Erro ao criar sessão Stripe:', error);
    return { success: false, error: 'Falha ao iniciar pagamento' };
  }
}
