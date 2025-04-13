import axiosInstance from './axios';
import {
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
} from '@/types/authreg';

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const res = await axiosInstance.post<LoginResponse>('/auth/login', data);
  console.log('Ответ от сервера:', res.data);
  return res.data;
};

export const registerUser = async (
  data: RegisterData,
): Promise<RegisterResponse> => {
  const res = await axiosInstance.post<RegisterResponse>(
    '/auth/register',
    data,
  );
  return res.data;
};
