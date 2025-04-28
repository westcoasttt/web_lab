import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllEvents } from '@/api/eventService';
import { Event } from '@/types/event';
import { RootState } from '@/app/store'; // Импортируем тип RootState

interface FetchEventsResponse {
  events: Event[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface EventState {
  events: Event[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: EventState = {
  events: [],
  total: 0,
  totalPages: 0,
  currentPage: 1,
  isLoading: false,
  isError: false,
  errorMessage: null,
};

// Асинхронный экшен для получения событий
export const fetchEvents = createAsyncThunk<
  FetchEventsResponse,
  { page?: number; limit?: number },
  { rejectValue: string }
>('events/fetchEvents', async ({ page = 1, limit = 10 }, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState; // Получаем состояние из thunkAPI
    const token = state.auth.token || localStorage.getItem('token'); // Получаем токен из состояния Redux
    if (!token) throw new Error('Токен не найден');

    const data = await getAllEvents(page, limit, token); // Передаем токен как аргумент
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Ошибка при загрузке событий',
    );
  }
});

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError(state) {
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || 'Не удалось загрузить события';
      });
  },
});

export const { clearError } = eventSlice.actions;
export default eventSlice.reducer;
