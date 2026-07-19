import { Inter } from 'next/font/google';
import './globals.css';
import { client } from '@/sanity/lib/client';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await client.fetch(
    `*[_type == "settings"][0]{ primaryColor }`,
  );
  const primaryColor = settings?.primaryColor?.hex || '#ccff00';

  return (
    <html lang='pt-BR'>
      <body
        className={inter.className}
        style={{ '--primary-color': primaryColor } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
