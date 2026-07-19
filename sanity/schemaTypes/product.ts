import { defineType, defineField } from 'sanity';

// 1. Definição do objeto de variante (o que o usuário escolhe: P, M, G, Azul, Vermelho)
export const productVariant = defineType({
  name: 'productVariant',
  title: 'Variante do Produto',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Nome da Variação' }),
    defineField({ name: 'sku', type: 'string', title: 'SKU' }),
    defineField({ name: 'price', type: 'number', title: 'Preço' }),
    defineField({ name: 'stock', type: 'number', title: 'Estoque' }),
    defineField({
      name: 'stripePriceId',
      type: 'string',
      title: 'Stripe Price ID',
    }),
  ],
});

// 2. O documento principal do Produto
export const product = defineType({
  name: 'product',
  title: 'Produto',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Nome do Produto' }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'URL',
      options: { source: 'title' },
    }),
    defineField({ name: 'description', type: 'text', title: 'Descrição' }),
    defineField({
      name: 'images',
      type: 'array',
      of: [{ type: 'image' }],
      title: 'Galeria de Imagens',
    }),

    // Novas funcionalidades solicitadas
    defineField({
      name: 'variants',
      type: 'array',
      title: 'Variantes (Tamanhos/Cores)',
      of: [{ type: 'productVariant' }],
    }),
    defineField({
      name: 'details',
      type: 'object',
      title: 'Detalhes Técnicos',
      fields: [
        { name: 'material', type: 'string', title: 'Material/Composição' },
        {
          name: 'careInstructions',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Instruções de Lavagem',
        },
      ],
    }),
    defineField({
      name: 'isNew',
      type: 'boolean',
      title: 'Produto Novo?',
      initialValue: false,
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
  ],
});
