// src/app/pago-fallido/page.tsx
'use client';

import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PagoFallidoPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-20">
      <XCircle className="h-24 w-24 text-red-500" />
      <h1 className="text-4xl font-bold mt-6 mb-4">¡Hubo un problema!</h1>
      <p className="text-lg text-zinc-700 mb-8">
        No pudimos procesar tu pago. Por favor, intenta de nuevo.
      </p>
      
      <Link 
        href="/carrito"
        className="bg-yellow-400 text-zinc-900 font-bold py-3 px-6 rounded-full transition-transform duration-200 hover:bg-yellow-300 hover:scale-105"
      >
        Volver al Carrito
      </Link>
    </div>
  );
}
