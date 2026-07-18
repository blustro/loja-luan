// app/actions/payment.ts
'use server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPixPayment(amount: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe usa centavos
    currency: 'brl',
    payment_method_types: ['pix'],
  });

  return {
    success: true,
    clientSecret: paymentIntent.client_secret,
    // A Stripe te retorna o código via API, igual ao Mercado Pago
  };
}
