import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useAuth } from "../../contexts/AuthContext";
import { fetchAllOrders } from "../../redux/ordersSlice";
import StatCard from "./StatCard";
import DashboardIcon from "../icons/DashboardIcon";
import PackageIcon from "../icons/PackageIcon";
import ClipboardListIcon from "../icons/ClipboardListIcon";
import UsersIcon from "../icons/UsersIcon";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders.list);
  const products = useSelector((state: RootState) => state.products.list);
  const { users, fetchUsers } = useAuth();

  useEffect(() => {
    dispatch(fetchAllOrders());
    fetchUsers();
  }, [dispatch, fetchUsers]);

  const totalRevenue = orders.reduce(
    (sum, order) => (order.status !== "Cancelled" ? sum + order.total : sum),
    0
  );
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Панель керування
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Загальний дохід"
          value={`${totalRevenue.toLocaleString("uk-UA")} UAH`}
          icon={DashboardIcon}
          color="amber"
        />
        <StatCard
          title="Замовлення"
          value={totalOrders.toString()}
          icon={ClipboardListIcon}
          color="blue"
        />
        <StatCard
          title="Користувачі"
          value={totalUsers.toString()}
          icon={UsersIcon}
          color="green"
        />
        <StatCard
          title="Товари"
          value={totalProducts.toString()}
          icon={PackageIcon}
          color="purple"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Останні замовлення
        </h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID Замовлення
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Клієнт
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Дата
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Сума
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {order.id}
                      </th>
                      <td className="px-6 py-4">{order.customer.name}</td>
                      <td className="px-6 py-4">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {order.total.toLocaleString("uk-UA")} UAH
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Processing"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Немає недавніх замовлень.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
