import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@sanity/client';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Client do Sanity com permissão de escrita
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-06-24',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(`⚠️ Erro na assinatura do Webhook: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const addressData = {
      cep: session.metadata?.cep || '',
      logradouro: session.metadata?.logradouro || '',
      bairro: session.metadata?.bairro || '',
      cidade: session.metadata?.cidade || '',
      uf: session.metadata?.uf || '',
      numero: session.metadata?.numero || '',
      complemento: session.metadata?.complemento || '',
    };

    const expandedSession = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ['line_items', 'line_items.data.price.product'],
      },
    );

    const lineItems = expandedSession.line_items?.data || [];

    const products = lineItems.filter(
      (item) =>
        (item.price?.product as Stripe.Product)?.metadata?.variantKey !==
        'shipping',
    );

    const shippingItem = lineItems.find(
      (item) =>
        (item.price?.product as Stripe.Product)?.metadata?.variantKey ===
        'shipping',
    );

    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;

    try {
      // 1. Salvar o pedido no Sanity CMS
      const orderDoc = {
        _type: 'order',
        stripeCheckoutId: session.id,
        customerName: customerName || 'Cliente não identificado',
        customerEmail: customerEmail || '',
        shippingAddress: addressData,
        shippingOption: {
          name: shippingItem?.description || 'Frete',
          cost:
            shippingItem && shippingItem.amount_total
              ? shippingItem.amount_total / 100
              : 0,
        },
        items: products.map((p) => {
          const productMetadata = (p.price?.product as Stripe.Product)
            ?.metadata;
          return {
            _key: Math.random().toString(36).substring(2, 9),
            name: p.description,
            quantity: p.quantity || 1,
            price: p.amount_total
              ? p.amount_total / 100 / (p.quantity || 1)
              : 0,
            variantKey: productMetadata?.variantKey || '',
          };
        }),
        totalPrice: session.amount_total ? session.amount_total / 100 : 0,
        status: 'paid',
        createdAt: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createdOrder = await writeClient.create(orderDoc as any);
      console.log('Pedido salvo com sucesso no Sanity ID:', createdOrder._id);

      // --- 2. DAR BAIXA NO ESTOQUE DAS VARIANTES NO SANITY ---
      for (const item of products) {
        const productMetadata = (item.price?.product as Stripe.Product)
          ?.metadata;
        const productId = productMetadata?.productId;
        const variantKey = productMetadata?.variantKey;
        const qtyBought = item.quantity || 1;

        if (productId && variantKey) {
          try {
            // Atualiza o estoque usando a propriedade computada correta com colchetes []
            await writeClient
              .patch(productId)
              .dec({ [`variants[_key=="${variantKey}"].stock`]: qtyBought })
              .commit();

            console.log(
              `Estoque atualizado: -${qtyBought} para o produto ${productId} (Variante: ${variantKey})`,
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (stockError: any) {
            console.error(
              `Erro ao atualizar estoque do produto ${productId}:`,
              stockError.message,
            );
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (sanityError: any) {
      console.error('Erro ao salvar pedido no Sanity:', sanityError.message);
      return NextResponse.json(
        { error: 'Erro interno ao salvar pedido' },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
