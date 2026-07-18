'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

export function CartCleaner() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null; // Este componente não renderiza nada, apenas executa a lógica
}
