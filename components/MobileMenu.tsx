'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface Category {
  title: string;
  slug: string;
}

interface MobileMenuProps {
  categories: Category[];
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant='ghost' size='icon' className='md:hidden shrink-0'>
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Abrir Menu</span>
          </Button>
        }
      ></SheetTrigger>
      <SheetContent side='left' className='w-70 sm:w-[320px] p-0 flex flex-col'>
        <SheetHeader className='p-6 pb-4 border-b shrink-0'>
          <SheetTitle>Categorias</SheetTitle>
        </SheetHeader>
        <nav className='flex-1 overflow-y-auto p-6 space-y-4'>
          {categories?.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={() => setOpen(false)}
              className='block text-sm font-medium text-foreground hover:text-primary transition-colors py-2 border-b border-border/40 last:border-0'
            >
              {cat.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
