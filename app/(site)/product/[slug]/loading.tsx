// app/product/[slug]/loading.tsx
export default function ProductLoading() {
  return (
    <div className='container mx-auto px-4 py-8 animate-pulse'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='h-96 bg-muted rounded-lg' />
        <div className='space-y-4'>
          <div className='h-8 bg-muted rounded w-3/4' />
          <div className='h-6 bg-muted rounded w-1/4' />
          <div className='h-24 bg-muted rounded' />
        </div>
      </div>
    </div>
  );
}
