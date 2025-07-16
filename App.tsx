import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DetailsPage from "./pages/DetailsPage";
import ContactsPage from "./pages/ContactsPage";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import DeliveryAndPaymentPage from "./pages/DeliveryAndPaymentPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminLayout from "./components/admin/AdminLayout";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyProfilePage from "./pages/MyProfilePage";
import { AppDispatch } from "./redux/store";
import { fetchProducts } from "./redux/productsSlice";

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [route, setRoute] = useState(window.location.pathname);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("locationchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("locationchange", handleLocationChange);
    };
  }, []);

  const renderPage = () => {
    if (route.startsWith("/admin")) {
      return (
        <AdminLayout>
          <AdminPage route={route} />
        </AdminLayout>
      );
    }

    if (route.startsWith("/order-confirmation/")) {
      const orderId = route.split("/")[2];
      return <OrderConfirmationPage orderId={orderId} />;
    }

    if (route.startsWith("/product/")) {
      const slug = route.split("/")[2];
      return <ProductDetailPage slug={slug} />;
    }

    switch (route) {
      case "/login":
        return <LoginPage />;
      case "/register":
        return <RegisterPage />;
      case "/cart":
        return <CartPage />;
      case "/favorites":
        return <FavoritesPage />;
      case "/details":
        return <DetailsPage />;
      case "/contacts":
        return <ContactsPage />;
      case "/delivery-and-payment":
        return <DeliveryAndPaymentPage />;
      case "/checkout":
        return <CheckoutPage />;
      case "/my-orders":
        return <MyOrdersPage />;
      case "/my-profile":
        return <MyProfilePage />;
      case "/":
      default:
        return <HomePage />;
    }
  };

  const isAuthPage = route === "/login" || route === "/register";
  const isAdminPage = route.startsWith("/admin");

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isAdminPage ? "bg-gray-100" : "text-gray-800"
      }`}
    >
      {!isAdminPage && <Header route={route} />}
      <main
        className={`flex-grow ${
          !isAdminPage ? "container mx-auto px-4 py-8 sm:py-12" : ""
        } ${isAuthPage ? "flex flex-col justify-center" : ""}`}
      >
        {renderPage()}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
