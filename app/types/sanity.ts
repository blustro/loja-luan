export type OptionType = 'clothing_size' | 'shoe_size' | 'color' | 'other';

export interface Variant {
  _id: string; // Mapeado a partir do _key do array embutido no Sanity
  title?: string;
  sku?: string;
  optionType: OptionType;
  optionValue: string; // Ex: "P", "38", "Azul"
  price?: number; // Preço específico (opcional, sobrescreve o base se preenchido)
  stock: number;
  imageUrl?: string; // Foto específica desta variante
}

export interface Product {
  _id: string;
  title: string;
  price: number; // Preço base do produto
  slug: { current: string };
  imageUrl: string;
  categoryName?: string;
  description?: string;
  variants?: Variant[];
  details?: {
    material?: string;
    careInstructions?: string;
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
}

export interface Settings {
  logo: string;
  primaryColor: string;
}
