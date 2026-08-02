import { Inter } from 'next/font/google';
import './globals.css';
import { client } from '@/sanity/lib/client';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let primaryColor = '#ccff00';

  try {
    const settings = await client.fetch(
      `*[_type == "settings"][0]{ primaryColor }`,
    );
    if (settings?.primaryColor?.hex) {
      primaryColor = settings.primaryColor.hex;
    }
  } catch (error) {
    console.error('Erro ao buscar configurações do Sanity no Layout:', error);
  }

  return (
    <html lang='pt-BR'>
      <body
        className={inter.className}
        style={{ '--primary-color': primaryColor } as React.CSSProperties}
      >
        <Toaster
          position='bottom-center' // Melhor para telas de celular
          richColors
          expand={false} // Mantém os toasts colapsados ocupando menos espaço
          visibleToasts={2} // Mostra no máximo 2 toasts por vez para não lotar a tela pequena
          closeButton // Adiciona botão de fechamento acessível
          toastOptions={{
            className: 'w-full max-w-sm mx-auto', // Garante largura responsiva correta
          }}
        />{' '}
        {children}
      </body>
    </html>
  );
}
