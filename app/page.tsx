// src/app/page.tsx
import ProductCard from "./components/ProductCard";
import { Product } from "./src/types/index";

// En el futuro, esto vendrá de una base de datos.
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Doble Cuarto',
    description: 'Doble carne 180g, doble cheddar, pepinillos y mostaza.',
    price: 15.00,
    imageUrl: '/images/burger-placeholder.jpg',
  },
  {
    id: '2',
    name: 'Burger Crispy',
    description: 'Pollo frito crocante, lechuga, tomate y mayonesa de ajo.',
    price: 13.50,
    imageUrl: '/images/burger-placeholder.jpg', // Cambia esto por otra imagen si tienes
  },
  {
    id: '3',
    name: 'Veggie Queen',
    description: 'Medallón de garbanzos, queso halloumi, rúcula y tomate.',
    price: 14.00,
    imageUrl: '/images/burger-placeholder.jpg', // Cambia esto por otra imagen si tienes
  },
];

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Mapeamos los productos y renderizamos una Card por cada uno */}
      {mockProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

    </div>
  );
}