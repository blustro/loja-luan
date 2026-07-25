export const order = {
  name: 'order',
  title: 'Pedidos',
  type: 'document',
  fields: [
    {
      name: 'stripeCheckoutId',
      title: 'ID da Sessão Stripe',
      type: 'string',
    },
    {
      name: 'customerName',
      title: 'Nome do Cliente',
      type: 'string',
    },
    {
      name: 'customerEmail',
      title: 'E-mail',
      type: 'string',
    },
    {
      name: 'shippingAddress',
      title: 'Endereço de Entrega',
      type: 'object',
      fields: [
        { name: 'cep', title: 'CEP', type: 'string' },
        { name: 'logradouro', title: 'Logradouro', type: 'string' },
        { name: 'bairro', title: 'Bairro', type: 'string' },
        { name: 'cidade', title: 'Cidade', type: 'string' },
        { name: 'uf', title: 'UF', type: 'string' },
        { name: 'numero', title: 'Número', type: 'string' },
        { name: 'complemento', title: 'Complemento', type: 'string' },
      ],
    },
    {
      name: 'shippingOption',
      title: 'Opção de Frete',
      type: 'object',
      fields: [
        { name: 'name', title: 'Modalidade', type: 'string' },
        { name: 'cost', title: 'Custo', type: 'number' },
      ],
    },
    {
      name: 'items',
      title: 'Itens do Pedido',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Nome do Produto', type: 'string' },
            { name: 'quantity', title: 'Quantidade', type: 'number' },
            { name: 'price', title: 'Preço Unitário', type: 'number' },
            { name: 'variantKey', title: 'Chave da Variante', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'totalPrice',
      title: 'Preço Total',
      type: 'number',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pago', value: 'paid' },
          { title: 'Enviado', value: 'shipped' },
          { title: 'Cancelado', value: 'canceled' },
        ],
      },
    },
    {
      name: 'createdAt',
      title: 'Data do Pedido',
      type: 'datetime',
    },
  ],
};
