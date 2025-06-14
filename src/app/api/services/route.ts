import { NextRequest, NextResponse } from 'next/server';
import { createMetadata, Metadata, ValidatedMetadata, type ExecutionResponse } from '@sherrylinks/sdk';
import { abi } from '@/blockchain/abi';
import { celoAlfajores } from 'viem/chains';
import { serialize } from 'wagmi';
import { encodeFunctionData, TransactionSerializable, parseUnits } from 'viem';

const CONTRACT_ADDRESS = "0x5837d7635e7E9bf06245A75Ccd00A9a486Dd0b72";

export async function GET(req: NextRequest) {
    try {
      const host = req.headers.get('host') || 'localhost:3000';
      const protocol = req.headers.get('x-forwarded-proto') || 'http';
      const serverUrl = `${protocol}://${host}`;
  
      const metadata: Metadata = {
        url: 'https://servicios.chipipay.com/',
        icon: 'https://servicios.chipipay.com/chipi-chunky.png',
        title: 'Servicios ChipiPay',
        baseUrl: serverUrl,
        description:
          'Compra Servicios directamente con crypto en ChipiPay',
        actions: [
            {
                type: 'dynamic',
                label: 'Comprar Recarga',
                description: 'Compra una recarga de celular con crypto',
                chains: { source: 'alfajores'},
                path: '/api/services',
                params: [
                    {
                      name: 'number',
                      label: 'Numero de telefono',
                      type: 'text',
                      required: true,
                      description: 'Ingresa el numero de telefono de la recarga',
                    }
                  ],
            }
        ]
      }
       // Validar metadata usando el SDK
    const validated: ValidatedMetadata = createMetadata(metadata);

    // Retornar con headers CORS para acceso cross-origin
    return NextResponse.json(validated, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    });
    } catch (error) {
      console.error('Error al crear la metadata:', error);
      return NextResponse.json({ error: 'Error al crear la metadata' }, { status: 500 });
    }
  }

  export async function POST(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const number = searchParams.get('number');
  
      if (!number) {
        return NextResponse.json({ error: 'Number is required' }, { status: 400 });
      }
  
      // Codificar los datos de la función del contrato
      const data = encodeFunctionData({
        abi: abi,
        functionName: 'processRecharge',
        args: [parseUnits("1", 6), "recarga_1234", "telcel_10", "sherry"],
      });
  
      // Crear transacción de interacción con contrato inteligente
      const tx: TransactionSerializable = {
        to: CONTRACT_ADDRESS,
        data: data,
        chainId: celoAlfajores.id,
        type: 'legacy',
      };
  
      const serialized = serialize(tx);

    // Crear respuesta
    const resp: ExecutionResponse = {
      serializedTransaction: serialized,
      chainId: celoAlfajores.name,
    };

    return NextResponse.json(resp, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    } catch (error) {
        console.error('Error en petición POST:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {
      status: 204, // Sin Contenido
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
      },
    });
  }