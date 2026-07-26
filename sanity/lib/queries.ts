import { groq } from 'next-sanity';

// Fragmentos reutilizáveis
export const productFields = groq`
  _id,
  title,
  slug,
  price,
  "variants": variants[]{
    "_id": _key,
    optionType,
    optionValue, // <--- ADICIONE ESTA LINHA
    price,
    sku,
    stock,
    "imageUrl": image.asset->url
  },
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

// Otimizado: Reaproveita productFields e adiciona description e details
export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0]{
  ${productFields},
  description,
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
