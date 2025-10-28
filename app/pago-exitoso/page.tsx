// src/app/pago-exitoso/page.tsx
'use client';

import { useCart } from '../src/context/CartContext';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function PagoExitosoPage() {
  const { clearCart } = useCart();

  // Usamos useEffect para limpiar el carrito
  // solo una vez, cuando el componente se monta.
  useEffect(() => {
    clearCart();
    
    // El array vacío [clearCart] asegura que esto solo se ejecute
    // una vez.
  }, [clearCart]); 

  return (
    <div className="flex flex-col items-center justify-center text-center mt-20">
      <CheckCircle className="h-24 w-24 text-green-500" />
      <h1 className="text-4xl font-bold mt-6 mb-4">¡Pago Exitoso!</h1>
      <p className="text-lg text-zinc-700 mb-8">
        Tu orden ha sido recibida y está en preparación.
      </p>
      
      {/* Aquí irá el PDF y el botón de WhatsApp que pediste */}
      
      <Link 
        href="/"
        className="bg-yellow-400 text-zinc-900 font-bold py-3 px-6 rounded-full transition-transform duration-200 hover:bg-yellow-300 hover:scale-105"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
