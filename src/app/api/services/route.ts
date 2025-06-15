import { NextRequest, NextResponse } from 'next/server';
import { createMetadata, Metadata, ValidatedMetadata } from '@sherrylinks/sdk';
import { abi } from '@/blockchain/abi';
import { celoAlfajores } from 'viem/chains';
import { serialize } from 'wagmi';
import { encodeFunctionData, TransactionSerializable, parseUnits } from 'viem';

// Definir el tipo personalizado para la respuesta
interface MultiTransactionResponse {
  serializedTransaction: string[];
  chainId: string;
}

const CONTRACT_ADDRESS = "0x5837d7635e7E9bf06245A75Ccd00A9a486Dd0b72";
const USDC_ADDRESS = "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B"; // USDC en Alfajores

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
                    },
                    {
                      name: 'carrier',
                      label: 'Operador',
                      type: 'select',
                      required: true,
                      description: 'Selecciona la operadora de la recarga',
                      options: [
                        { label: 'Telcel', value: 'telcel' },
                        { label: 'Movistar', value: 'movistar' },
                        { label: 'Claro', value: 'claro' },
                        { label: 'Iusacell', value: 'iusacell' },
                        { label: 'Nextel', value: 'nextel' },
                        { label: 'PilloFon', value: 'pillofon' },
                      ],
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
      const carrier = searchParams.get('carrier');
  
      if (!number || !carrier) {
        return NextResponse.json({ error: 'Number and carrier are required' }, { status: 400 });
      }

      const amount = parseUnits("1", 6);
  
      // Transacción de aprobación del USDC
      const approveData = encodeFunctionData({
        abi: [
          {
            name: 'approve',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'spender', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ type: 'bool' }]
          }
        ],
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amount],
      });

      const approveTx: TransactionSerializable = {
        to: USDC_ADDRESS,
        data: approveData,
        chainId: celoAlfajores.id,
        type: 'legacy',
      };
  
      // Codificar los datos de la función del contrato
      const rechargeData = encodeFunctionData({
        abi: abi,
        functionName: 'processRecharge',
        args: [amount, "recarga_1234", carrier, "sherry"],
      });
  
      // Crear transacción de interacción con contrato inteligente
      const rechargeTx: TransactionSerializable = {
        to: CONTRACT_ADDRESS,
        data: rechargeData,
        chainId: celoAlfajores.id,
        type: 'legacy',
      };
  
      const serializedApprove = serialize(approveTx);
      const serializedRecharge = serialize(rechargeTx);

      // Crear respuesta con array de transacciones
      const resp: MultiTransactionResponse = {
        serializedTransaction: [serializedApprove, serializedRecharge],
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