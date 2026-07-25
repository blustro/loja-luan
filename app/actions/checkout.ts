'use server';

import { stripe } from '@/lib/stripe';

// Defina a interface para o payload de checkout
interface CheckoutItem {
  id?: string;
  name?: string;
  price?: number;
  quantity: number;
  variant?: {
    _key: string;
    name: string;
  };
}

interface CheckoutPayload {
  items: CheckoutItem[];
  shippingCost: number;
  shippingName: string;
  address: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
  } | null;
}

export async function createCheckoutSession(payload: CheckoutPayload) {
  try {
    const { items, shippingCost, address } = payload;

    // Mapeia os itens do carrinho para o formato do Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.name || 'Produto',
          metadata: {
            variantKey: item.variant?._key || '',
          },
        },
        unit_amount: Math.round((item.price || 0) * 100), // Stripe trabalha em centavos
      },
      quantity: item.quantity,
    }));

    // Se houver custo de frete maior que zero, podemos adicioná-lo como um item na sessão ou via shipping_options
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: `${payload.shippingName || 'Frete'} (${address?.cidade || ''}/${address?.uf || ''})`,
            metadata: {
              variantKey: 'shipping',
            },
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_KEY}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: {
        cep: address?.cep || '',
        cidade: address?.cidade || '',
        uf: address?.uf || '',
      },
    });

    return { url: session.url };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro ao criar sessão do Stripe:', error);
    return { error: error.message || 'Erro ao processar pagamento.' };
  }
}
