import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { client } from '@/sanity/lib/client';
// 2. Configuração da fonte
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mano do corre',
  description: 'E-commerce rápido e eficiente',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await client.fetch(
    `*[_type == "settings"][0]{ primaryColor }`,
  );
  const primaryColor = settings?.primaryColor?.hex || '#000000';
  return (
    <html lang='pt-BR'>
      <body
        className={inter.className}
        style={{ '--primary-color': primaryColor } as React.CSSProperties}
      >
        <Header />
        <main className='container mx-auto max-w-6xl p-4'>{children}</main>
      </body>
    </html>
  );
}
