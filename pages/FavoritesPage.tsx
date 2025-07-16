import React, { useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import ProductList from "../components/ProductList";
import { toggleFavorite } from "../redux/favoritesSlice";
import { addToCart } from "../redux/cartSlice";
import { Product } from "../types";
import Button from "../components/Button";

const FavoritesPage: React.FC = () => {
  const dispatch = useDispatch();
  const favoriteIdsArray = useSelector(
    (state: RootState): string[] => state.favorites.ids
  );
  const allProducts = useSelector((state: RootState) => state.products.list);

  const favoriteIds = useMemo(
    () => new Set(favoriteIdsArray),
    [favoriteIdsArray]
  );
  const favoriteProducts = allProducts.filter((product) =>
    favoriteIds.has(product.id)
  );

  useEffect(() => {
    document.title = "Обрані товари | Trailers";
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute(
        "content",
        "Список ваших обраних причепів. Збережіть найкращі варіанти тут."
      );
    }
  }, []);

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      dispatch(toggleFavorite(productId));
    },
    [dispatch]
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart(product));
    },
    [dispatch]
  );

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800">
          Список обраного порожній
        </h1>
        <p className="text-slate-500 mt-3 mb-6">
          Ви ще не позначили жодного товару як улюблений.
        </p>
        <Button onClick={(e) => handleNav(e, "/")} variant="primary">
          Переглянути товари
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-black mb-8 text-center text-slate-900">
        Ваші обрані товари
      </h1>
      <ProductList
        products={favoriteProducts}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        favoriteIds={favoriteIds}
      />
    </div>
  );
};

export default FavoritesPage;
