import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { cep } = await request.json();
    const cleanCep = cep?.replace(/\D/g, '');

    if (!cleanCep || cleanCep.length !== 8) {
      return NextResponse.json(
        { success: false, error: 'CEP inválido. Digite 8 dígitos.' },
        { status: 400 },
      );
    }

    // Consulta direta à API pública do ViaCEP
    const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const addressData = await viaCepRes.json();

    if (addressData.erro) {
      return NextResponse.json(
        { success: false, error: 'CEP não encontrado.' },
        { status: 404 },
      );
    }

    // Exemplo de regra simples de frete baseada na região (UF)
    let shippingPrice = 25.0; // Padrão nacional
    if (addressData.uf === 'SP') {
      shippingPrice = 15.0; // Frete mais barato para o estado de São Paulo
    } else if (
      ['AM', 'RR', 'AP', 'AC', 'RO', 'PA', 'MA'].includes(addressData.uf)
    ) {
      shippingPrice = 45.0; // Frete para regiões mais distantes
    }

    return NextResponse.json({
      success: true,
      address: {
        cep: addressData.cep,
        logradouro: addressData.logradouro,
        bairro: addressData.bairro,
        cidade: addressData.localidade,
        uf: addressData.uf,
      },
      options: [
        {
          id: 'standard',
          name: `Entrega Padrão (${addressData.localidade} - ${addressData.uf})`,
          price: shippingPrice,
          deadline: '5 a 8 dias úteis',
        },
      ],
    });
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao consultar o CEP.' },
      { status: 500 },
    );
  }
}
