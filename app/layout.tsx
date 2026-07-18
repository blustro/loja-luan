import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // 1. Importação da fonte
import './globals.css';
import { CartSidebarWrapper } from '@/components/CartSidebarWrapper';
// 2. Configuração da fonte
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mano do corre',
  description: 'E-commerce rápido e eficiente',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      {/* 3. Aplicação da classe 'inter' aqui */}
      <body className={inter.className}>
        <header className='border-b'>
          <div className='container mx-auto max-w-6xl p-4 flex justify-between items-center'>
            <div className='font-bold text-xl tracking-tight'>
              Mano do corre
            </div>
            <CartSidebarWrapper />
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
