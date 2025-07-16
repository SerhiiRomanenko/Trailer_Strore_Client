import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types";

const API_BASE_URL = "http://localhost:5001/api";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface ProductsState {
  list: Product[];
  status: Status;
  error: string | null | undefined;
}

const initialState: ProductsState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (
    product: Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">,
    { getState }
  ) => {
    const { token } = (getState() as any).auth;
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    return await response.json();
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (product: Product, { getState }) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    return await response.json();
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId: string, { getState }) => {
    const token = localStorage.getItem("authToken");
    await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return productId;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add Product
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.list.push(action.payload);
        }
      )
      // Update Product
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.list.findIndex((p) => p.id === action.payload.id);
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        }
      )
      // Delete Product
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.list = state.list.filter((p) => p.id !== action.payload);
        }
      );
  },
});

export default productsSlice.reducer;
