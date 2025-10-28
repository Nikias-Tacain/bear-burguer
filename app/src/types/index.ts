// src/types/index.ts

// El producto tal como viene de la "base de datos"
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

// El item dentro del carrito, que incluye la cantidad
export type CartItem = {
  product: Product;
  quantity: number;
};