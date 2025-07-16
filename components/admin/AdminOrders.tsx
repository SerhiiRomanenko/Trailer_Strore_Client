import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  updateOrderStatus,
  OrderStatus,
  fetchAllOrders,
} from "../../redux/ordersSlice";

const AdminOrders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: orders, status: orderStatus } = useSelector(
    (state: RootState) => state.orders
  );
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const filteredOrders = orders.filter(
    (order) => filterStatus === "All" || order.status === filterStatus
  );

  const statuses: OrderStatus[] = [
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Керування замовленнями
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Фільтрувати за статусом
        </label>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as OrderStatus | "All")
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="All">Всі</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Дата
                </th>
                <th scope="col" className="px-6 py-3">
                  Клієнт
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
              {orderStatus === "loading" && (
                <tr>
                  <td colSpan={5} className="text-center p-8">
                    Loading orders...
                  </td>
                </tr>
              )}
              {orderStatus !== "loading" &&
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{order.customer.name}</td>
                    <td className="px-6 py-4">
                      {order.total.toLocaleString("uk-UA")} UAH
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as OrderStatus
                          )
                        }
                        className={`p-1.5 text-xs font-semibold rounded-md border-2 focus:outline-none
                                                ${
                                                  order.status === "Delivered"
                                                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                                    : ""
                                                }
                                                ${
                                                  order.status === "Shipped"
                                                    ? "bg-blue-50 border-blue-200 text-blue-800"
                                                    : ""
                                                }
                                                ${
                                                  order.status === "Processing"
                                                    ? "bg-amber-50 border-amber-200 text-amber-800"
                                                    : ""
                                                }
                                                ${
                                                  order.status === "Cancelled"
                                                    ? "bg-red-50 border-red-200 text-red-800"
                                                    : ""
                                                }
                                            `}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
