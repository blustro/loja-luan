import { defineField, defineType } from 'sanity';

export const settings = defineType({
  name: 'settings',
  title: 'Configurações da Loja',
  type: 'document',
  fields: [
    defineField({
      name: 'storeName',
      title: 'Nome da Loja',
      type: 'string',
    }),
    defineField({
      name: 'primaryColor',
      title: 'Cor Primária (Hexadecimal)',
      type: 'color',
      description: 'Escolha a cor principal para botões e destaques do site',
    }),
    defineField({
      name: 'images',
      title: 'Logo',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
});
