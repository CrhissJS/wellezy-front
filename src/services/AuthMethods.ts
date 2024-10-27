// src/services/authService.ts

import { LoginResponse } from '../common/Types';
import ApiService from './ApiService';

export const register = async (name: string, email: string, password: string) => {
  const response = await ApiService.post(`/register`, {
    name,
    email,
    password,
  });

  return response.data;
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await ApiService.post(`/login`, {
    email,
    password,
  });

  return response.data as LoginResponse;
};