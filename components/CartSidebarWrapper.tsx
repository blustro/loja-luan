'use client';

import dynamic from 'next/dynamic';

// Carrega o CartSidebar apenas no navegador
const CartSidebar = dynamic(() => import('@/components/CartSidebar'), {
  ssr: false,
});

export function CartSidebarWrapper() {
  return <CartSidebar />;
}
