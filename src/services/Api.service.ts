// ApiService.ts
import axios, { AxiosRequestConfig } from 'axios';

const baseURL = 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL,
});

export default {
  async request<T>(url: string, method: string = 'get', data: any = null): Promise<T> {
    try {
      const response = await axiosInstance({
        method,
        url,
        data,
      } as AxiosRequestConfig);
      return response.data as T;
    } catch (error) {
      console.error(`Erro na requisição para ${url}:`, error);
      throw error;
    }
  },
};
