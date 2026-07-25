'use server';

import { stripe } from '@/lib/stripe';

interface CheckoutItem {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  imageUrl?: string;
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
    const lineItems = items.map((item) => {
      const productName = item.title || item.name || 'Produto';
      const productImage = item.imageUrl ? [item.imageUrl] : [];

      return {
        price_data: {
          currency: 'brl',
          product_data: {
            name: productName,
            images: productImage,
            metadata: {
              productId: item.id || item._id || '',
              variantKey: item.variant?._key || '',
            },
          },
          unit_amount: Math.round((item.price || 0) * 100),
        },
        quantity: item.quantity,
      };
    });

    // Se houver custo de frete maior que zero, adiciona como item na sessão
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: `${payload.shippingName || 'Frete'} (${address?.cidade || ''}/${address?.uf || ''})`,
            images: [], // 💡 Adicionado array vazio para satisfazer a tipagem obrigatória do Stripe/TypeScript
            metadata: {
              productId: '',
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        cep: address?.cep || '',
        logradouro: address?.logradouro || '',
        bairro: address?.bairro || '',
        cidade: address?.cidade || '',
        uf: address?.uf || '',
        numero: address?.numero || '',
        complemento: address?.complemento || '',
        shippingName: payload.shippingName,
        shippingCost: String(payload.shippingCost),
      },
    });

    return { url: session.url };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro ao criar sessão do Stripe:', error);
    return { error: error.message || 'Erro ao processar pagamento.' };
  }
}
