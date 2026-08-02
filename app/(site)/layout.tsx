import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: {
    default: 'Mano do corre',
    template: '%s | Mano do corre', // Permite que páginas filhas adicionem o nome do produto automaticamente
  },
  description: 'Mano do Corre Store - E-commerce rápido e eficiente',
  openGraph: {
    title: 'Mano do corre',
    description: 'Mano do Corre Store - E-commerce rápido e eficiente',
    url: 'https://loja-luan.vercel.app/', // Substitua pela URL final de produção
    siteName: 'Mano do corre',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
