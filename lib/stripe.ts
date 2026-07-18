import 'server-only';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não foi definida no .env.local');
}

// Criamos uma instância única para toda a aplicação
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-06-24.dahlia', // Pode manter a versão padrão ou atualizar se necessário
  typescript: true,
});
