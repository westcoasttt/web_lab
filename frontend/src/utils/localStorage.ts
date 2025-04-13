const TOKEN_KEY = 'auth_token';
const USER_NAME_KEY = 'user_name';

// Токен
export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Имя пользователя
export const saveUserName = (name: string) => {
  localStorage.setItem(USER_NAME_KEY, name);
};

export const getUserName = (): string | null => {
  return localStorage.getItem(USER_NAME_KEY);
};

export const removeUserName = () => {
  localStorage.removeItem(USER_NAME_KEY);
};

// Проверка авторизации
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Полный выход
export const logout = () => {
  removeToken();
  removeUserName();
};
