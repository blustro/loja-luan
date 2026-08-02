import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: {
    default: 'Mano do corre',
    template: '%s | Mano do corre', // Permite que páginas filhas adicionem o nome do produto automaticamente
  },
  description: 'Mano do Corre Store - E-commerce rápido e eficiente',
  icons: {
    icon: [
      { url: '/icon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: ['/icon/favicon.ico'], // O .ico principal
    apple: [
      {
        url: '/icon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/icon/site.webmanifest',
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
