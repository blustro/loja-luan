/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@sanity/client';
import Stripe from 'stripe';
import { Resend } from 'resend';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Client do Sanity com permissão de escrita
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-06-24',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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
        (item.price?.product as Stripe.Product)?.metadata?.variantId !==
        'shipping',
    );

    const shippingItem = lineItems.find(
      (item) =>
        (item.price?.product as Stripe.Product)?.metadata?.variantId ===
        'shipping',
    );

    const customerEmail =
      expandedSession.customer_details?.email ||
      session.customer_details?.email;

    const customerName =
      expandedSession.customer_details?.name ||
      session.customer_details?.name ||
      'Cliente';

    console.log('DEBUG - E-mail capturado:', customerEmail);

    try {
      // 1. Salvar o pedido no Sanity CMS
      const orderDoc = {
        _type: 'order',
        stripeCheckoutId: session.id,
        customerName: customerName || 'Cliente não identificado',
        customerEmail: customerEmail || '',
        shippingAddress: addressData,

        shippingName:
          shippingItem?.description ||
          session.metadata?.shippingName ||
          'Frete',
        shippingCost:
          shippingItem && shippingItem.amount_total
            ? shippingItem.amount_total / 100
            : session.metadata?.shippingCost
              ? Number(session.metadata.shippingCost)
              : 0,

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
            variantKey: productMetadata?.variantId || '',
          };
        }),
        totalPrice: session.amount_total ? session.amount_total / 100 : 0,
        status: 'paid',
        createdAt: new Date().toISOString(),
      };

      const createdOrder = await writeClient.create(orderDoc as any);
      console.log('Pedido salvo com sucesso no Sanity ID:', createdOrder._id);

      // --- 2. ENVIAR E-MAIL DE CONFIRMAÇÃO ---
      if (customerEmail) {
        try {
          const itemsHtml = products
            .map((p) => {
              const productObj = p.price?.product as Stripe.Product;
              const imageUrl = productObj?.images?.[0];
              const qty = p.quantity || 1;
              const unitPrice = p.amount_total ? p.amount_total / 100 / qty : 0;
              const productMetadata = productObj?.metadata;

              return `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          ${
            imageUrl
              ? `<td style="padding: 12px 10px 12px 0; width: 50px; vertical-align: middle;">
                   <img src="${imageUrl}" alt="${p.description}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; display: block;" />
                 </td>`
              : ''
          }
          <td style="padding: 12px 0; vertical-align: middle; font-size: 14px; color: #333;">
            <strong>${p.description}</strong><br/>
            <span style="font-size: 12px; color: #6b7280;">
              Qtd: ${qty} ${productMetadata?.variantId && productMetadata.variantId !== 'shipping' ? `| Variante ID: ${productMetadata.variantId}` : ''}
            </span>
          </td>
          <td style="padding: 12px 0; vertical-align: middle; text-align: right; font-size: 14px; color: #333; white-space: nowrap;">
            R$ ${(unitPrice * qty).toFixed(2)}
          </td>
        </tr>
      `;
            })
            .join('');

          await resend.emails.send({
            from: 'Mano do Corre Store <onboarding@resend.dev>',
            to: customerEmail,
            subject: `Confirmação do Pedido #${createdOrder._id.slice(-6)}`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #4f46e5; margin-top: 0;">Obrigado pela sua compra, ${customerName || 'Cliente'}!</h2>
          <p style="color: #555;">Recebemos o seu pagamento com sucesso e o seu pedido já está sendo preparado para envio.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          
          <h3 style="font-size: 16px; color: #111; margin-bottom: 12px;">Itens do Pedido:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 20px; background-color: #f9fafb; padding: 15px; border-radius: 6px;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Frete:</strong> R$ ${orderDoc.shippingCost.toFixed(2)} (${orderDoc.shippingName})</p>
            <p style="margin: 4px 0; font-size: 16px; color: #4f46e5;"><strong>Total pago:</strong> R$ ${orderDoc.totalPrice.toFixed(2)}</p>
          </div>

          <h3 style="font-size: 16px; color: #111; margin-top: 20px; margin-bottom: 8px;">Endereço de Entrega:</h3>
          <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.5;">
            ${addressData.logradouro}, ${addressData.numero} ${addressData.complemento ? `- ${addressData.complemento}` : ''}<br/>
            ${addressData.bairro} - ${addressData.cidade}/${addressData.uf}<br/>
            CEP: ${addressData.cep}
          </p>
          
          <p style="margin-top: 30px; font-size: 13px; color: #6b7280; text-align: center;">
            Se tiver qualquer dúvida, entre em contato respondendo a esta mensagem.
          </p>
        </div>
      `,
          });
        } catch (emailError: any) {
          console.error('Erro ao enviar e-mail:', emailError.message);
        }
      }

      // --- 3. DAR BAIXA NO ESTOQUE DA VARIANTE NO ARRAY EMBUTIDO DO SANITY ---
      for (const item of products) {
        const productMetadata = (item.price?.product as Stripe.Product)
          ?.metadata;
        const productId = productMetadata?.productId;
        const variantId = productMetadata?.variantId;
        const qtyBought = item.quantity || 1;

        if (productId && variantId) {
          try {
            // Busca o produto e seu array de variantes atual
            const productDoc = await writeClient.fetch(
              `*[_type == "product" && _id == $productId][0]{_id, variants}`,
              { productId },
            );

            if (productDoc && productDoc.variants) {
              const updatedVariants = productDoc.variants.map((v: any) => {
                if (v._key === variantId) {
                  return {
                    ...v,
                    stock: Math.max(0, (v.stock || 0) - qtyBought),
                  };
                }
                return v;
              });

              // Atualiza o documento de produto com o array modificado
              await writeClient
                .patch(productId)
                .set({ variants: updatedVariants })
                .commit();

              console.log(
                `Estoque atualizado: -${qtyBought} para a variante (${variantId}) no produto ${productId}`,
              );
            }
          } catch (stockError: any) {
            console.error(
              `Erro ao atualizar estoque da variante ${variantId}:`,
              stockError.message,
            );
          }
        }
      }
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
