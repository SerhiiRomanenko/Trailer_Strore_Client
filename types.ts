export interface Specification {
  name: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku?: string;
  brand: string;
  model?: string;
  category: "Причепи" | "Комплектуючі";
  subCategory?: string;
  type: "product" | "accessory" | "spare_part";
  price: number;
  currency: string;
  inStock: boolean;
  quantity: number;
  images: string[];
  specifications: Specification[];
  compatibility?: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  avatar?: string | null;
}
