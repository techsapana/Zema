import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  additionalImages?: string[];
  category: string;
  rating: number;
  stockCount: number;
  createdAt: string;
}

export interface ProductOrder {
  id: string;
  productId?: string;
  product?: Product;
  cartItems?: any;
  totalAmount?: number;
  deliveryFee?: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod?: string;
  paymentScreenshot?: string;
  status: string;
  createdAt: string;
}

export interface SiteSettings {
  whatsappNumber: string | null;
  deliveryFee: number;
  paymentQRs: string[];
}

// PUBLIC: Get Settings
export const getPublicSettingsApi = async () => {
  const res = await apiClient.get(`/public/settings`);
  return res.data;
};

// ADMIN: Get Settings
export const getAdminSettingsApi = async () => {
  const token = localStorage.getItem("token");
  const res = await apiClient.get(`/admin/settings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ADMIN: Update Settings
export const updateAdminSettingsApi = async (data: any) => {
  const token = localStorage.getItem("token");
  const res = await apiClient.put(`/admin/settings`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// PUBLIC: Get Products
export const getPublicProductsApi = async (page = 1, limit = 8) => {
  const res = await apiClient.get(`/public/products`, { params: { page, limit } });
  return res.data;
};

// PUBLIC: Get Single Product
export const getPublicProductByIdApi = async (id: string) => {
  const res = await apiClient.get(`/public/products/${id}`);
  return res.data;
};

// PUBLIC: Create Order
export const createOrderApi = async (data: any) => {
  const res = await apiClient.post(`/public/orders`, data);
  return res.data;
};

// ADMIN: Get Products
export const getAdminProductsApi = async () => {
  const token = localStorage.getItem("token");
  const res = await apiClient.get(`/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ADMIN: Create Product
export const createProductApi = async (data: any) => {
  const token = localStorage.getItem("token");
  const res = await apiClient.post(`/admin/products`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ADMIN: Delete Product
export const deleteProductApi = async (id: string) => {
  const token = localStorage.getItem("token");
  const res = await apiClient.delete(`/admin/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProductApi = async ({ id, data }: { id: string; data: any }) => {
  const token = localStorage.getItem("token");
  const res = await apiClient.put(`/admin/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ADMIN: Get Orders
export const getAdminOrdersApi = async () => {
  const token = localStorage.getItem("token");
  const res = await apiClient.get(`/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ADMIN: Update Order Status
export const updateOrderStatusApi = async (id: string, status: string) => {
  const token = localStorage.getItem("token");
  const res = await apiClient.patch(`/admin/orders/${id}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ADMIN: Delete Order
export const deleteOrderApi = async (id: string) => {
  const token = localStorage.getItem("token");
  const res = await apiClient.delete(`/admin/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
