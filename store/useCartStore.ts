import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Tipagem alinhada com os atributos flexíveis do Sanity
export type OptionType = 'clothing_size' | 'shoe_size' | 'color' | 'other';

export interface CartItem {
  id: string;
  _id: string; // Mapeado a partir do _key da variante embutida no array do Sanity
  productId: string; // ID do Produto pai
  title: string; // Nome do Produto
  price: number; // Preço final (preço específico da variante ou preço base)
  imageUrl: string; // Imagem específica da variante ou do produto base
  quantity: number;
  stock: number; // Estoque máximo da variante (crucial para validação)

  // Detalhes estruturados da variante (iguais ao Sanity)
  variantTitle?: string; // Ex: "Azul - G" ou "Preto - 41"
  optionType?: OptionType;
  optionValue?: string; // Ex: "G", "38", "Azul"
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

      // Adiciona um item respeitando o limite de estoque
      // Substitua o trecho do addItem na sua store por este:

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item._id === product._id,
          );

          // Pega a quantidade que veio dentro do objeto do produto (ou 1 como fallback)
          const quantityToAdd = product.quantity ?? 1;

          if (existingItem) {
            const newQuantity = Math.min(
              existingItem.quantity + quantityToAdd,
              product.stock,
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
              { ...product, quantity: Math.min(quantityToAdd, product.stock) },
            ],
          };
        }),

      // Remove o item completamente
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== id),
        })),

      // Aumenta a quantidade em +1 (respeitando o estoque)
      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item._id === id) {
              const newQuantity = Math.min(item.quantity + 1, item.stock);
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
