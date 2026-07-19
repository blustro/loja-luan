export interface Product {
  _id: string;
  title: string;
  price: number;
  slug: { current: string };
  imageUrl: string;
  categoryName?: string;
  description?: string;
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
