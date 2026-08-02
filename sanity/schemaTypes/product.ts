import { defineField } from 'sanity';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const product = {
  name: 'product',
  title: 'Produtos',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nome do Produto',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Preço Base (R$)',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Imagem Principal (Capa)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    defineField({
      name: 'images',
      title: 'Galeria de Imagens do Produto',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description:
        'Adicione fotos extras para exibir no carrossel e na visualização rápida.',
    }),
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
    },
    defineField({
      name: 'variants',
      title: 'Variantes do Produto',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'optionType',
              title: 'Tipo de Variante',
              type: 'string',
              options: {
                list: [
                  {
                    title: 'Tamanho (Roupa: P, M, G...)',
                    value: 'clothing_size',
                  },
                  { title: 'Tamanho (Calçado: 38, 39...)', value: 'shoe_size' },
                  { title: 'Cor', value: 'color' },
                  { title: 'Outro / Tamanho Único', value: 'other' },
                ],
                layout: 'dropdown',
              },
              initialValue: 'other',
            }),
            defineField({
              name: 'optionValue',
              title: 'Valor (Ex: Tamanho Único, G, 42)',
              type: 'string',
              initialValue: 'Tamanho Único',
            }),
            defineField({
              name: 'price',
              title: 'Preço Específico (Opcional)',
              type: 'number',
              description: 'Deixe em branco para usar o preço base do produto',
            }),
            defineField({
              name: 'stock',
              title: 'Estoque',
              type: 'number',
              initialValue: 10,
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'sku',
              title: 'SKU (Código)',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Imagem Específica da Variante (Opcional)',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
          ],
          preview: {
            select: {
              type: 'optionType',
              value: 'optionValue',
              stock: 'stock',
              media: 'image',
            },
            prepare(selection) {
              const { type, value, stock, media } = selection;
              const typeLabels: Record<string, string> = {
                clothing_size: 'Roupa',
                shoe_size: 'Calçado',
                color: 'Cor',
                other: 'Geral',
              };
              return {
                title: `${value || 'Tamanho Único'} (${typeLabels[type] || 'Único'})`,
                subtitle: `Estoque: ${stock ?? 0}`,
                media: media,
              };
            },
          },
        },
      ],
    }),
  ],
};
