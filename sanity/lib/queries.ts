// lib/sanity/queries.ts
import { groq } from 'next-sanity';

// Fragmentos reutilizáveis
export const productFields = groq`
  _id,
  title,
  price,
  slug,
  "imageUrl": coalesce(image.asset->url, images[0].asset->url),
  "categoryName": category->title
`;

export const categoryFields = groq`
  _id,
  title,
  "slug": slug.current
`;

// Queries nomeadas
export const allProductsQuery = groq`
*[_type == "product" && 
  (!defined($category) || category->slug.current == $category) &&
  (!defined($search) || title match $search + "*")
] { ${productFields} }
`;
export const allCategoriesQuery = groq`*[_type == "category"] | order(title asc) { ${categoryFields} }`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  price,
  "imageUrl": images[0].asset->url,
  description,
  // Novos campos adicionados aqui:
  variants[] {
    title,
    price,
    sku,
    stripePriceId,
    stock
  },
  details {
    material,
    careInstructions
  }
}`;

export const globalDataQuery = groq`{
  "settings": *[_type == "settings"][0]{ 
    "logo": images[0].asset->url, 
    "primaryColor": primaryColor.hex 
  },
  "categories": *[_type == "category"] | order(title asc) { 
    ${categoryFields} 
  }
}`;
