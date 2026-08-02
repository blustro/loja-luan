Headless E-commerce Order Management System
===========================================

A robust, mobile-optimized, full-stack e-commerce architecture built with **Next.js**, **Stripe Checkout**, **Sanity CMS**, and **Resend**. This system ensures seamless end-to-end data flow from client-side cart interactions to secure payment processing, automated inventory tracking, and dynamic transactional email delivery.

🚀 Tech Stack
-------------

*   **Framework:** Next.js (App Router) with TypeScript
    
*   **Payment Gateway:** Stripe Checkout & Webhooks
    
*   **Headless CMS & Database:** Sanity CMS
    
*   **Transactional Emails:** Resend
    
*   **UI Components:** Shadcn UI (Tailwind CSS)
    

🛠️ Architecture & Key Features
-------------------------------

### 1\. Mobile-First UI & Error Resilience

*   **Mobile Navigation:** Implemented a responsive MobileMenu utilizing Shadcn's Sheet component alongside an optimized CartList to guarantee a smooth mobile shopping experience.
    
*   **Null Safety:** Patched server-side rendering (SSR) runtime errors (such as toFixed failures on undefined variables) by applying robust null-safe operators (?? 0) across all pricing and subtotal computations.
    

### 2\. End-to-End Data Flow & Metadata Propagation

*   **Server Actions (createCheckoutSession.ts):** Dynamically builds Stripe line items, mapping product titles, quantities, variant keys, and image URLs into Stripe's product metadata and session payloads.
    
*   **Shipping Integration:** Captures dynamic shipping methods (e.g., PAC/SEDEX) and shipping costs, passing them securely through session metadata to ensure precise fee calculations at checkout.
    

### 3\. Automated Webhook & Inventory Sync (api/webhook/route.ts)

*   **Sanity Order Ingestion:** Upon a successful payment event (checkout.session.completed), the webhook securely constructs and writes an order document into Sanity CMS.
    
*   **Inventory Decrement:** Automatically synchronizes and decrements product variant stock levels in Sanity to prevent overselling.
    

### 4\. Rich Transactional Emails via Resend

*   Generates customized, responsive HTML confirmation emails containing item thumbnails, variant specifications, unit pricing, shipping details, and localized totals (R$).
    

📋 Sanity Order Schema Alignment
--------------------------------

To ensure flawless data ingestion, the Sanity CMS schema uses a flat field structure for order metadata, decoupling shipping details from nested objects:

```
export const order = {
  name: 'order',
  title: 'Pedidos',
  type: 'document',
  fields: [
    { name: 'stripeCheckoutId', title: 'ID da Sessão Stripe', type: 'string' },
    { name: 'customerName', title: 'Nome do Cliente', type: 'string' },
    { name: 'customerEmail', title: 'E-mail', type: 'string' },
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
    { name: 'shippingName', title: 'Método de Envio', type: 'string' },
    { name: 'shippingCost', title: 'Custo do Frete', type: 'number' },
    { name: 'items', title: 'Itens do Pedido', type: 'array' },
    { name: 'totalPrice', title: 'Preço Total', type: 'number' },
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
    { name: 'createdAt', title: 'Data do Pedido', type: 'datetime' },
  ],
};
```

💡 Technical Highlights & Learnings
-----------------------------------

*   **Handling Stripe Image Constraints:** Ensuring product\_data.images is explicitly populated (using empty arrays \[\] for non-product items like shipping) satisfies strict TypeScript typing and allows product thumbnails to render correctly in downstream transactional emails.
    
*   **Flat vs. Nested Schema Mapping:** Aligning webhook payload formatting directly with Sanity's root fields (shippingName and shippingCost) resolved ingestion gaps caused by mismatched object nesting.
    
*   **Decoupled Webhook Architecture:** Shifting order creation and email dispatch to server-side webhooks guarantees reliable state management and audit trails, independent of client-side browser disconnects after checkout completion.
