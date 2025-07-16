import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types";

const API_BASE_URL = "http://localhost:5001/api";

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface DeliveryData {
  method: "pickup" | "nova-poshta";
  cityRef?: string;
  cityName?: string;
  branchRef?: string;
  branchName?: string;
}

interface PaymentData {
  method: "cash" | "card";
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  date: string;
  customer: CustomerData;
  delivery: DeliveryData;
  payment: PaymentData;
  items: (Product & { quantity: number })[];
  total: number;
  status: OrderStatus;
}

type Status = "idle" | "loading" | "succeeded" | "failed";

interface OrdersState {
  list: Order[];
  status: Status;
  error: string | null | undefined;
}

const initialState: OrdersState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");
    if (!token) return rejectWithValue("No token found");
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return rejectWithValue("Failed to fetch orders");
    return await response.json();
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");
    if (!token) return rejectWithValue("No token found");
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return rejectWithValue("Failed to fetch all orders");
    return await response.json();
  }
);

export const addOrder = createAsyncThunk(
  "orders/addOrder",
  async (newOrderData: Omit<Order, "id">, { rejectWithValue }) => {
    const token = localStorage.getItem("authToken");
    if (!token) return rejectWithValue("No token found");
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newOrderData),
    });
    if (!response.ok) return rejectWithValue("Failed to create order");
    return await response.json();
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async (
    { orderId, status }: { orderId: string; status: OrderStatus },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("authToken");
    if (!token) return rejectWithValue("No token found");
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) return rejectWithValue("Failed to update status");
    return await response.json();
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchMyOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.list.unshift(action.payload);
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const index = state.list.findIndex((o) => o.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        }
      );
  },
});

export default ordersSlice.reducer;
