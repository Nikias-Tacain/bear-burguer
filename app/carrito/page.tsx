// src/app/carrito/page.tsx
'use client';

import { useState } from 'react';
import { useCart } from '../src/context/CartContext'; 
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
if (publicKey) {
  initMercadoPago(publicKey);
} else {
  console.error('Error: La Public Key de MercadoPago no está configurada.');
}

export default function CarritoPage() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCreatePreference = async () => {
    if (cartItems.length === 0) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems }),
      });
      const data = await response.json();
      if (data.id) {
        setPreferenceId(data.id);
      }
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
      alert('Error al intentar crear el pago. Intenta de nuevo.');
    }
    setIsLoading(false);
  };

  return (
    // Envolvemos todo en un Fragment (<>...</>) para poder añadir el <style>
    <>
      {/* --- NUEVO BLOQUE DE ESTILO --- */}
      {/* Esto fuerza al iframe del botón de MP a ocupar el 100% */}
      <style jsx global>{`
        #wallet_container iframe {
          min-width: 100% !important;
          width: 100% !important;
          min-height: 45px;
        }
      `}</style>
      {/* --- FIN DEL NUEVO BLOQUE --- */}

      <div className="max-w-3xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-zinc-900 mb-6">Tu Carrito</h1>

        {/* CAMBIO 1: Grilla de 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Columna de Items */}
          {/* CAMBIO 2: Items ocupan 1 columna */}
          <div className="md:col-span-1">
            <div className="flex flex-col gap-4">
              {cartItems.length === 0 ? (
                <p className="text-zinc-600">Tu carrito está vacío.</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 bg-white p-4 rounded-lg shadow-md items-center"
                  >
                    {/* Imagen */}
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    
                    {/* Info y Cantidad */}
                    <div className="flex-1 flex flex-col justify-start">
                      <div>
                        <h3 className="text-xl font-bold">{item.product.name}</h3>
                        <p className="text-lg font-semibold text-zinc-800">
                          ${item.product.price.toFixed(2)}
                        </p> {/* <-- ERROR CORREGIDO AQUÍ (antes era </id>) */}
                      </div>
                      
                      {/* Controles de Cantidad (más grandes) */}
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => decreaseQuantity(item.product.id)}
                          className="p-2 rounded-full bg-zinc-200 hover:bg-zinc-300"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <span className="font-bold text-xl w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => increaseQuantity(item.product.id)}
                          className="p-2 rounded-full bg-zinc-200 hover:bg-zinc-300"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Botón Eliminar y Total */}
                    <div className="flex flex-col justify-between items-end h-full">
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Columna de Resumen */}
          {/* CAMBIO 3: Resumen ocupa 1 columna */}
          <div className="md:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-md sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Resumen</h2>
              
              <div className="flex justify-between mb-3 text-lg">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-bold text-zinc-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-3 text-lg">
                <span className="text-zinc-600">Envío</span>
                <span className="font-bold text-zinc-800">Gratis</span>
              </div>

              <hr className="my-6" />

              <div className="flex justify-between text-2xl font-black">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="mt-8 text-center" id="wallet_container">
                {!preferenceId ? (
                  <button
                    onClick={handleCreatePreference}
                    className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-zinc-400 flex items-center justify-center"
                    disabled={cartItems.length === 0 || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      'Continuar con el Pago'
                    )}
                  </button>
                ) : (
                  // El ID 'wallet_container' ahora es usado por el <style>
                  <Wallet initialization={{ preferenceId: preferenceId }} />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

