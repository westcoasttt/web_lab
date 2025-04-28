import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '@/api/authService';
import type { LoginData, LoginResponse } from '@/types/authreg';
import type { UserInfo } from '@/types/user';

interface AuthState {
  user: UserInfo | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  errorMessage: string | null;
  token: string | null;
}

const token = localStorage.getItem('token');
const userName = localStorage.getItem('userName');

const initialState: AuthState = {
  user: token && userName ? { name: userName } : null,
  isLoading: false,
  isError: false,
  isAuthenticated: !!token,
  errorMessage: null,
  token: token,
};

export const loginUser = createAsyncThunk<LoginResponse, LoginData>(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const data = await login(credentials);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Unknown error',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isError = false;
      state.errorMessage = null;

      // Очищаем localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
    },

    clearError(state) {
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isError = false;

        state.user = { name: action.payload.name }; // формируем объект user
        localStorage.setItem('userName', action.payload.name);
        localStorage.setItem('token', action.payload.token);
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.errorMessage =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка авторизации';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
