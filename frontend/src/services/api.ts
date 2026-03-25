import axios from 'axios';
import type { ISale, ISalePayload, IProduct, IProductPayload } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://ds-backend-phi.vercel.app/api';

const salesApi = axios.create({ baseURL: `${API_URL}/sales` });
const productsApi = axios.create({ baseURL: `${API_URL}/products` });

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
