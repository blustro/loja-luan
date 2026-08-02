export type OptionType = 'clothing_size' | 'shoe_size' | 'color' | 'other';

export interface Variant {
  _id: string;
  optionType?: string;
  optionValue?: string;
  price?: number;
  sku?: string;
  stock?: number;
  imageUrl?: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  price: number;
  imageUrl?: string;
  images?: string[];
  categoryName?: string;
  variants?: Variant[];
  description?: string;
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
