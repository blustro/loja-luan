import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OptionType = 'clothing_size' | 'shoe_size' | 'color' | 'other';

export interface CartItem {
  id: string;
  _id: string;
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;

  variantTitle?: string;
  optionType?: OptionType;
  optionValue?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem, quantity?: number) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      // Adiciona um item respeitando o limite de estoque (com fallback seguro se stock for undefined)
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item._id === product._id,
          );

          const quantityToAdd = product.quantity ?? 1;
          const maxStock = product.stock ?? 99; // Fallback se o estoque não vier do Sanity

          if (existingItem) {
            const currentMaxStock = existingItem.stock ?? 99;
            const newQuantity = Math.min(
              existingItem.quantity + quantityToAdd,
              currentMaxStock,
            );
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: newQuantity }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { ...product, quantity: Math.min(quantityToAdd, maxStock) },
            ],
          };
        }),

      // Remove o item completamente
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== id),
        })),

      // Aumenta a quantidade em +1 com proteção contra 'undefined' no stock
      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item._id === id) {
              const maxStock = item.stock ?? 99; // Garante que nunca será NaN se o stock vier vazio
              const newQuantity = Math.min(item.quantity + 1, maxStock);
              return { ...item, quantity: newQuantity };
            }
            return item;
          }),
        })),

      // Diminui em -1 (e remove se chegar a 0)
      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item._id === id ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      // Esvazia o carrinho
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'loja-luan-cart',
    },
  ),
);
