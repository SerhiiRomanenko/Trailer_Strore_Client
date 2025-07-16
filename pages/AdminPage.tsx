import React from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import Dashboard from "../components/admin/Dashboard";
import AdminProducts from "../components/admin/AdminProducts";
import AdminProductForm from "../components/admin/AdminProductForm";
import AdminOrders from "../components/admin/AdminOrders";
import AdminUsers from "../components/admin/AdminUsers";
import AdminUserForm from "../components/admin/AdminUserForm";
import AdminAccessories from "../components/admin/AdminAccessories";

interface AdminPageProps {
  route: string;
}

const AdminPage: React.FC<AdminPageProps> = ({ route }) => {
  const renderContent = () => {
    if (route === "/admin/product/new") {
      return <AdminProductForm productType="Причепи" />;
    }
    if (route.startsWith("/admin/product/edit/")) {
      const productId = route.split("/")[4];
      return <AdminProductForm productId={productId} productType="Причепи" />;
    }

    if (route === "/admin/accessory/new") {
      return <AdminProductForm productType="Комплектуючі" />;
    }
    if (route.startsWith("/admin/accessory/edit/")) {
      const productId = route.split("/")[4];
      return (
        <AdminProductForm productId={productId} productType="Комплектуючі" />
      );
    }

    if (route.startsWith("/admin/user/edit/")) {
      const userId = route.split("/")[4];
      return <AdminUserForm userId={userId} />;
    }

    switch (route) {
      case "/admin/products":
        return <AdminProducts />;
      case "/admin/accessories":
        return <AdminAccessories />;
      case "/admin/orders":
        return <AdminOrders />;
      case "/admin/users":
        return <AdminUsers />;
      case "/admin":
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      <AdminSidebar activeRoute={route} />
      <div className="flex-1 p-6 lg:p-10">{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
