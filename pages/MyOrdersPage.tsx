import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import { fetchMyOrders } from "../redux/ordersSlice";
import SpinnerIcon from "../components/icons/SpinnerIcon";

const MyOrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, loading: authLoading } = useAuth();
  const {
    list: userOrders,
    status: orderStatus,
    error,
  } = useSelector((state: RootState) => state.orders);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, authLoading]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchMyOrders());
    }
  }, [currentUser, dispatch]);

  if (authLoading || orderStatus === "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <SpinnerIcon className="h-10 w-10 text-amber-500" />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const statusClasses = {
    Processing: "bg-amber-100 text-amber-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-emerald-100 text-emerald-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Мої замовлення
      </h1>

      {userOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-6">
            У вас ще немає жодного замовлення.
          </p>
          <Button onClick={(e) => handleNav(e, "/")} variant="primary">
            Перейти до покупок
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Номер</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Дата</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-right">
                  Сума
                </th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-center">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-4 font-medium text-gray-500">
                    {order.id}
                  </td>
                  <td className="px-4 py-4 text-gray-800">
                    {new Date(order.date).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-900 text-right">
                    {order.total.toLocaleString("uk-UA")} UAH
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        statusClasses[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
