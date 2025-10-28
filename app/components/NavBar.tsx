// src/components/Navbar.tsx
'use client'; 

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../src/context/CartContext'; 

export default function Navbar() {
  const { cartItems } = useCart(); 

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-zinc-900 text-white shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        <Link href="/" className="text-3xl font-bold text-yellow-400 hover:text-yellow-300">
          Bear Burguer
        </Link>

        <Link href="/carrito" className="relative p-2 rounded-full hover:bg-zinc-700 transition-colors">
          <ShoppingCart className="h-6 w-6" />
          
          {/* CAMBIO AQUÍ: Quitamos el 'totalItems > 0 &&' */}
          {/* Ahora el 'span' siempre se muestra, incluso con 0 */}
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        </Link>
      </div>
    </nav>
  );
}