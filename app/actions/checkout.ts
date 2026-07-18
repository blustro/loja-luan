'use server';

import { stripe } from '@/lib/stripe';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createCheckoutSession(items: any[]) {
  try {
    // Transforma seus itens do carrinho no formato do Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.title,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
      },
      quantity: item.quantity || 1,
    }));

    // Cria a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Adicione outros se desejar
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    // Retorna a URL da sessão para o frontend
    return { url: session.url };
  } catch (error) {
    console.error('Erro ao criar sessão Stripe:', error);
    return { error: 'Falha ao iniciar pagamento' };
  }
}
