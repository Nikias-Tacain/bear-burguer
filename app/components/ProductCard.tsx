// src/components/ProductCard.tsx
'use client'; 

import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import { Product } from "../src/types/index";
import { useCart } from '../src/context/CartContext';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { name, description, price, imageUrl } = product;
  const { addToCart } = useCart(); 

  return (
    // CAMBIO 1: Añadimos 'flex flex-col' al div principal
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col">
      {/* Imagen del Producto (sin cambios) */}
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Contenido de la Tarjeta */}
      {/* CAMBIO 2: 'flex-1' (para que crezca) y quitamos 'h-full' */}
      <div className="p-4 flex flex-col flex-1"> 
        <h3 className="text-xl font-bold text-zinc-800 mb-1">{name}</h3>
        <p className="text-sm text-zinc-600 mb-4 h-10">{description}</p>
        
        {/* Esto ahora es empujado al fondo gracias a 'mt-auto' y 'flex-1' */}
        <div className="flex justify-between items-center mt-auto pt-4"> 
          <span className="text-2xl font-black text-zinc-900">
            ${price.toFixed(2)}
          </span>
          <button 
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 bg-yellow-400 text-zinc-900 font-bold py-2 px-4 rounded-full transition-transform duration-200 hover:bg-yellow-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="h-5 w-5" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}