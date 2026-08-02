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

    // Regras de cálculo base para o PAC
    let pacPrice = 15.0;
    if (addressData.uf === 'SP') {
      pacPrice = 12.0;
    } else if (
      ['AM', 'RR', 'AP', 'AC', 'RO', 'PA', 'MA'].includes(addressData.uf)
    ) {
      pacPrice = 38.0;
    } else {
      pacPrice = 22.0;
    }

    // Sedex é mais rápido e possui um acréscimo no valor
    const sedexPrice = pacPrice + 16.0;

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
          id: 'pac',
          name: 'Correios PAC',
          price: pacPrice,
          deadline: '5 a 8 dias úteis',
        },
        {
          id: 'sedex',
          name: 'Correios SEDEX',
          price: sedexPrice,
          deadline: '2 a 3 dias úteis',
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
