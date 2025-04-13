import axiosInstance from './axios';
import { getToken } from '../utils/localStorage';
import { Event } from '@/types/event';

export interface EventsResponse {
  events: Event[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const getAllEvents = async (
  page = 1,
  limit = 10,
): Promise<EventsResponse> => {
  const token = getToken();

  const res = await axiosInstance.get<EventsResponse>(
    `/events?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
export const getEventsPaginated = async (page = 1, limit = 5) => {
  const response = await axiosInstance.get(`/public`, {
    params: { page, limit },
  });
  return response.data as {
    events: Event[];
    total: number;
  };
};
