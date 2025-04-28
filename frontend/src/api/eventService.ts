import axiosInstance from './axios';
import { Event } from '@/types/event';

export interface EventsResponse {
  events: Event[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Получить мероприятие по id
export const getEventById = async (
  id: string,
  token: string, // Токен передается как аргумент
): Promise<Event> => {
  if (!token) throw new Error('Токен не найден');

  const res = await axiosInstance.get<Event>(`/public/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Создать новое мероприятие
export const createEvent = async (
  eventData: {
    title: string;
    description?: string;
    date: string;
  },
  token: string, // Токен передается как аргумент
): Promise<Event> => {
  if (!token) throw new Error('Токен не найден');

  const res = await axiosInstance.post<Event>('/events', eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Обновить существующее мероприятие
export const updateEvent = async (
  id: string,
  eventData: {
    title: string;
    description?: string;
    date: string;
    createdBy?: string;
  },
  token: string, // Токен передается как аргумент
): Promise<Event> => {
  if (!token) throw new Error('Токен не найден');

  const res = await axiosInstance.put<Event>(`/events/${id}`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// Получить все мероприятия
export const getAllEvents = async (page = 1, limit = 10, token: string) => {
  // Токен передается как аргумент
  try {
    if (!token) throw new Error('Токен не найден');

    const response = await axiosInstance.get(
      `/public?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error; // Здесь может быть обработка ошибки (например, логирование или улучшение сообщений)
  }
};

// Получить мероприятия с пагинацией
export const getEventsPaginated = async (
  page = 1,
  limit = 5,
  token: string, // Токен передается как аргумент
) => {
  if (!token) throw new Error('Токен не найден');

  const response = await axiosInstance.get(`/public`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data as {
    events: Event[];
    total: number;
  };
};
