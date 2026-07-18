import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Tipagem do item que vai para o carrinho
export interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number; // A quantidade do mesmo item
}

// 2. Tipagem das funções que o carrinho terá
interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
}

// 3. Criação da Store com o middleware 'persist'
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      // Adiciona um item ou soma +1 se já existir
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item._id === product._id,
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),

      // Remove o item completamente
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== id),
        })),

      // Aumenta a quantidade em +1
      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
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

      // Esvazia o carrinho (usado após a compra)
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'loja-luan-cart', // Nome da chave que ficará salva no localStorage
    },
  ),
);
