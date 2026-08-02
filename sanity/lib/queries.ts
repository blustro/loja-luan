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
    optionValue,
    price,
    sku,
    stock,
    "imageUrl": image.asset->url + "?w=600&auto=format&fit=max"
  },
  "imageUrl": coalesce(image.asset->url, images[0].asset->url) + "?w=800&auto=format&fit=max",
  "images": images[]{
    "url": asset->url + "?w=800&auto=format&fit=max"
  }.url,
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
  ${productFields},
  description,
  details {
    material,
    careInstructions
  }
}`;

export const globalDataQuery = groq`{
  "settings": *[_type == "settings"][0]{ 
    "logo": images[0].asset->url + "?w=200&auto=format", 
    "primaryColor": primaryColor.hex 
  },
  "categories": *[_type == "category"] | order(title asc) { 
    ${categoryFields} 
  }
}`;
