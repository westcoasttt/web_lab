import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserProfile,
  getUserEvents,
  updateUserProfile,
} from '@/api/userService';
import { Event } from '@/types/event';
import { User } from '@/types/user';

interface ProfileState {
  user: User | null;
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

const initialState: ProfileState = {
  user: null,
  events: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
};

export const fetchProfile = createAsyncThunk<User>(
  'profile/fetchProfile',
  async (_, thunkAPI) => {
    try {
      return await getUserProfile();
    } catch (err: any) {
      console.error(err);
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Ошибка загрузки профиля',
      );
    }
  },
);

export const fetchProfileEvents = createAsyncThunk<Event[]>(
  'profile/fetchProfileEvents',
  async (_, thunkAPI) => {
    try {
      return await getUserEvents();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Ошибка загрузки событий',
      );
    }
  },
);

// 👉 Новый AsyncThunk для обновления профиля
export const updateProfile = createAsyncThunk<User, Partial<User>>(
  'profile/updateProfile',
  async (updatedData, thunkAPI) => {
    try {
      return await updateUserProfile(updatedData);
    } catch (err: any) {
      console.error(err);
      return thunkAPI.rejectWithValue(
        err.response?.data || 'Ошибка обновления профиля',
      );
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(fetchProfileEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      })

      // Обработка обновления профиля
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
