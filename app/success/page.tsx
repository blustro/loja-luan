import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center p-4'>
      <Card className='max-w-md w-full text-center'>
        <CardHeader>
          <div className='flex justify-center mb-4 text-green-500'>
            <CheckCircle2 size={48} />
          </div>
          <CardTitle className='text-2xl'>Pagamento Confirmado!</CardTitle>
          <CardDescription className='mt-2 text-base'>
            Muito obrigado pela sua compra. Seu pedido foi recebido e está sendo
            processado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className='w-full mt-4'
            render={<Link href='/'>Voltar para a loja</Link>}
          ></Button>
        </CardContent>
      </Card>
    </div>
  );
}
