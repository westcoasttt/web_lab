import axiosInstance from '@/api/axios'; // если используешь общий axios
import { User } from '@/types/user';

export const getUserProfile = async () => {
  const token = localStorage.getItem('token'); // получаем токен из localStorage
  if (!token) throw new Error('Токен не найден');

  const response = await axiosInstance.get('/user', {
    headers: {
      Authorization: `Bearer ${token}`, // добавляем токен в заголовок
    },
  });
  return response.data;
};

export const getUserEvents = async () => {
  const token = localStorage.getItem('token'); // получаем токен из localStorage
  if (!token) throw new Error('Токен не найден');

  const response = await axiosInstance.get('/user/events', {
    headers: {
      Authorization: `Bearer ${token}`, // добавляем токен в заголовок
    },
  });
  return response.data;
};
export const updateUserProfile = async (updatedData: Partial<User>) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Токен не найден');

  const response = await axiosInstance.put('/user', updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
