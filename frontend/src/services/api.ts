import axios from 'axios';
import type { ISale, ISalePayload } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://ds-backend-phi.vercel.app/api';

const api = axios.create({
  baseURL: `${API_URL}/sales`,
});

export const getSales = async (): Promise<ISale[]> => {
  const response = await api.get('/');
  return response.data;
};

export const createSale = async (data: ISalePayload): Promise<ISale> => {
  const response = await api.post('/', data);
  return response.data;
};

export const updateSale = async (id: string, data: Partial<ISalePayload>): Promise<ISale> => {
  const response = await api.put(`/${id}`, data);
  return response.data;
};

export const deleteSale = async (id: string): Promise<void> => {
  await api.delete(`/${id}`);
};
