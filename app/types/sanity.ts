export interface Variant {
  _key: string;
  title: string;
  sku: string;
  price: number;
  stock: number;
  stripePriceId: string;
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  slug: { current: string };
  imageUrl: string;
  categoryName?: string;
  description?: string;
  variants?: Variant[];
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
