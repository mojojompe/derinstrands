import axios from 'axios';
import type { ISale, ISalePayload, IProduct, IProductPayload } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://ds-backend-phi.vercel.app/api';

const authApi = axios.create({ baseURL: `${API_URL}/auth` });
const salesApi = axios.create({ baseURL: `${API_URL}/sales` });
const productsApi = axios.create({ baseURL: `${API_URL}/products` });

// Interceptor to add auth token
const authInterceptor = (config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

salesApi.interceptors.request.use(authInterceptor);
productsApi.interceptors.request.use(authInterceptor);

// --- Auth ---
export const loginUser = async (password: string): Promise<{ token: string }> => {
  const response = await authApi.post('/login', { password });
  return response.data;
};

// --- Sales ---
export const getSales = async (): Promise<ISale[]> => {
  const response = await salesApi.get('');
  return response.data;
};

export const createSale = async (data: ISalePayload): Promise<ISale> => {
  const response = await salesApi.post('', data);
  return response.data;
};

export const updateSale = async (id: string, data: Partial<ISalePayload>): Promise<ISale> => {
  const response = await salesApi.put(`/${id}`, data);
  return response.data;
};

export const deleteSale = async (id: string): Promise<void> => {
  await salesApi.delete(`/${id}`);
};

// --- Products ---
export const getProducts = async (): Promise<IProduct[]> => {
  const response = await productsApi.get('');
  return response.data;
};

export const createProduct = async (data: IProductPayload): Promise<IProduct> => {
  const response = await productsApi.post('', data);
  return response.data;
};

export const updateProduct = async (id: string, data: Partial<IProductPayload>): Promise<IProduct> => {
  const response = await productsApi.put(`/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await productsApi.delete(`/${id}`);
};
