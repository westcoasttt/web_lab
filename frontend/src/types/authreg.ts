export interface LoginData {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  name: string;
}
export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}
