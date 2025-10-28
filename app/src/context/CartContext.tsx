// src/context/CartContext.tsx
'use client'; 

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types/index'; 

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  increaseQuantity: (productId: string) => void; 
  decreaseQuantity: (productId: string) => void; 
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);


export function CartProvider({ children }: { children: ReactNode }) {
  // 1. Inicializar SIEMPRE como array vacío en el render inicial
  // Esto soluciona el error de hidratación, ya que el servidor y 
  // el primer render del cliente coincidirán.
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // 2. Añadir un estado para saber si el componente está "montado" en el cliente
  const [isMounted, setIsMounted] = useState(false);

  // 3. Este useEffect se ejecuta SOLO en el cliente, después del primer render
  useEffect(() => {
    setIsMounted(true); // Marcamos que estamos en el cliente
    
    // Ahora sí, leemos de localStorage
    try {
      const item = window.localStorage.getItem('burgerpro-cart');
      if (item) {
        setCartItems(JSON.parse(item));
      }
    } catch (error) {
      console.warn('Error al parsear el carrito desde localStorage', error);
    }
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // 4. Este useEffect GUARDA en localStorage CADA VEZ que cartItems cambie,
  // PERO solo si ya estamos montados (para evitar escrituras innecesarias)
  useEffect(() => {
    if (isMounted) {
      window.localStorage.setItem('burgerpro-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]); // Depende de cartItems y isMounted

  
  // --- (Las funciones de 'add', 'increase', 'decrease', 'remove' quedan EXACTAMENTE IGUAL) ---

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  const increaseQuantity = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };


  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook (sin cambios)
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}

