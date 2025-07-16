import React, { useCallback, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import ProductList from "../components/ProductList";
import { Product } from "../types";
import Button from "../components/Button";

const DetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const favoriteIdsArray = useSelector(
    (state: RootState): string[] => state.favorites.ids
  );
  const favoriteIds = useMemo(
    () => new Set(favoriteIdsArray),
    [favoriteIdsArray]
  );

  const allProducts = useSelector((state: RootState) => state.products.list);
  const accessoryProducts = useMemo(
    () => allProducts.filter((p) => p.category === "Комплектуючі"),
    [allProducts]
  );

  useEffect(() => {
    document.title = "Комплектуючі для причепів | Trailers";
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute(
        "content",
        "Великий вибір комплектуючих для легкових причепів: електрика, колеса, осі, ресори та багато іншого. Купуйте онлайн з доставкою по Україні."
      );
    }
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart(product));
    },
    [dispatch]
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      dispatch(toggleFavorite(productId));
    },
    [dispatch]
  );

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Комплектуючі
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mt-4">
          Все необхідне для ремонту та модернізації вашого причепа.
        </p>
      </div>

      {accessoryProducts.length > 0 ? (
        <ProductList
          products={accessoryProducts}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteIds}
        />
      ) : (
        <div className="text-center py-20 px-6 bg-white rounded-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">
            Комплектуючих ще немає
          </h2>
          <p className="text-slate-500 mt-3 mb-6">
            Ми активно працюємо над наповненням цього розділу.
          </p>
          <Button onClick={(e) => handleNav(e, "/")} variant="primary">
            Повернутись до каталогу причепів
          </Button>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
