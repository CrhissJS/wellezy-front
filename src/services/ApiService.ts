// src/services/ApiService.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
    });
  }

  // GET METHOD
  public get<T>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  // POST METHOD
  public post<T>(url: string, data: object, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  // PUT METHOD
  public put<T>(url: string, data: object, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  // PATCH METHOD
  public patch<T>(url: string, data: object, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }

  // DELETE METHOD
  public delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }
}

// Exports an instance to use throughout the app
export default new ApiService(import.meta.env.VITE_API_BASE_URL);
