import Link from 'next/link';

interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  currentCategory?: string;
  currentQuery?: string;
}

export function CategoryFilter({
  categories,
  currentCategory,
  currentQuery,
}: CategoryFilterProps) {
  // Função que monta a nova URL preservando a busca existente (se houver)
  const buildUrl = (categorySlug?: string) => {
    const params = new URLSearchParams();
    if (currentQuery) params.set('query', currentQuery);
    if (categorySlug) params.set('category', categorySlug);

    // Retorna a rota com os parâmetros montados (ex: /?query=tenis&category=nike)
    const queryString = params.toString();
    return queryString ? `/?${queryString}` : '/';
  };

  return (
    <div className='flex flex-wrap gap-2 mb-8'>
      {/* Botão "Todos" (Remove a categoria, mas mantém a busca) */}
      <Link
        href={buildUrl()}
        className={`px-4 py-2 rounded-full text-sm transition-colors ${
          !currentCategory
            ? 'font-bold bg-(--primary-color) text-primary'
            : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
        }`}
      >
        Todos
      </Link>

      {/* Mapeando as Categorias Dinâmicas do Sanity */}
      {categories.map((category) => (
        <Link
          key={category._id}
          href={buildUrl(category.slug)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            currentCategory === category.slug
              ? 'font-bold bg-(--primary-color) text-primary'
              : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
          }`}
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
}
