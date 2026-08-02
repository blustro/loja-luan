/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { stripe } from '@/lib/stripe';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

interface CheckoutItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

interface CheckoutPayload {
  items: CheckoutItemInput[];
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

// Query GROQ para buscar o produto e mapear o _key da variante como _id
const checkoutValidationQuery = groq`
  *[_type == "product" && _id == $productId][0]{
    title,
    price,
    "imageUrl": coalesce(image.asset->url, images[0].asset->url),
    "variants": variants[]{
      "_id": _key,
      optionType,
      optionValue,
      price,
      stock,
      "imageUrl": image.asset->url
    }
  }
`;

export async function createCheckoutSession(payload: CheckoutPayload) {
  try {
    const { items, shippingCost, address } = payload;

    // 1. Valida e monta os itens usando o Sanity como Fonte da Verdade
    const lineItems = await Promise.all(
      items.map(async (item) => {
        const product = await client.fetch(checkoutValidationQuery, {
          productId: item.productId,
        });

        if (!product) {
          throw new Error(`Produto não encontrado: ${item.productId}`);
        }

        const variant = product.variants?.find(
          (v: any) => v._id === item.variantId,
        );

        if (!variant) {
          throw new Error(
            `Variante não encontrada para o produto ${product.title}`,
          );
        }

        // Validação de estoque no servidor
        if (variant.stock < item.quantity) {
          throw new Error(
            `Estoque insuficiente para ${product.title} (${variant.optionValue || 'Variante'})`,
          );
        }

        // Preço real do Sanity (prioriza variante, cai no base se não houver)
        const unitPrice = variant.price ?? product.price;
        const itemImage = variant.imageUrl || product.imageUrl;
        const variantLabel = variant.optionValue
          ? ` - ${variant.optionValue}`
          : '';
        const productName = `${product.title}${variantLabel}`;

        return {
          price_data: {
            currency: 'brl',
            product_data: {
              name: productName,
              images: itemImage ? [itemImage] : [],
              metadata: {
                productId: product._id,
                variantId: variant._id,
              },
            },
            unit_amount: Math.round(unitPrice * 100),
          },
          quantity: item.quantity,
        };
      }),
    );

    // 2. Adiciona o frete se houver custo maior que zero
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: `${payload.shippingName || 'Frete'} (${address?.cidade || ''}/${address?.uf || ''})`,
            images: [],
            metadata: {
              productId: '',
              variantId: 'shipping',
            },
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // 3. Cria a sessão de checkout no Stripe
    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
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
        cartItems: JSON.stringify(items),
      },
    });

    return { url: session.url };
  } catch (error: any) {
    console.error('Erro ao criar sessão do Stripe:', error);
    return { error: error.message || 'Erro ao processar pagamento.' };
  }
}

// Função auxiliar para detectar a URL base automaticamente
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};
