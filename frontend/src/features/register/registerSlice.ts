import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUser } from '@/api/authService';
import type { RegisterData, RegisterResponse } from '@/types/authreg';

interface AuthState {
  user: {
    name: string;
    [key: string]: any;
  } | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isError: false,
  errorMessage: null,
  token: null,
};

export const register = createAsyncThunk<
  RegisterResponse,
  RegisterData,
  { rejectValue: any }
>('register/registerUser', async (credentials, thunkAPI) => {
  try {
    const data = await registerUser(credentials);
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Ошибка регистрации');
  }
});

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    clearError(state) {
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || 'Ошибка регистрации';
      });
  },
});

export const { clearError } = registerSlice.actions;
export default registerSlice.reducer;
