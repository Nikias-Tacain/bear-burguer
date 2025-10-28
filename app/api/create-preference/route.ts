// src/app/api/create-preference/route.ts
import { NextResponse } from 'next/server';
// 1. Dejamos solo las importaciones que funcionan
import { MercadoPagoConfig, Preference } from 'mercadopago'; 
import { CartItem } from '../../src/types/index'; // <-- Asegúrate que esta ruta sea la correcta

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { cartItems } = (await request.json()) as { cartItems: CartItem[] };

    // 2. Quitamos el tipo ': PreferenceItem[]' de aquí
    // Dejamos que TypeScript infiera el tipo automáticamente.
    const items = cartItems.map((item) => ({
      id: item.product.id,
      title: item.product.name,
      description: item.product.description, // Es buena idea añadir la descripción
      quantity: item.quantity,
      unit_price: item.product.price,
      currency_id: 'ARS', // (Recuerda cambiar si no es ARS)
    }));

    const preference = new Preference(client);

    // 3. Pasamos el 'body'. El SDK de MP es lo suficientemente
    // inteligente para entender el array 'items'
    const result = await preference.create({
      body: {
        items: items, // <--- El warning original debería desaparecer
        back_urls: {
          success: 'http://localhost:3000/pago-exitoso', 
          failure: 'http://localhost:3000/pago-fallido',
          pending: 'http://localhost:3000/pago-pendiente',
        }
      },
    });

    return NextResponse.json({ id: result.id });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia' },
      { status: 500 }
    );
  }
}