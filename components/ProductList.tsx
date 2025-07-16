import React from "react";
import { Product } from "../types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  favoriteIds: Set<string>;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
  onToggleFavorite,
  favoriteIds,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteIds.has(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductList;
