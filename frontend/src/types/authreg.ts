import { User } from './user';
export interface LoginData {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  name: string;
}
export interface RegisterData {
  name: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string; // или Date, но обычно с формы отправляется как строка (например, "2000-01-01")
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}
