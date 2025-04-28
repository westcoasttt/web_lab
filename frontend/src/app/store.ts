import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import registerReducer from '@/features/register/registerSlice';
import eventReducer from '@/features/events/eventSlice';
import profileReducer from '@/features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
    events: eventReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
