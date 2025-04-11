// src/api/authService.ts

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  name: string;
  password: string;
}

// Вход
export const login = async (data: LoginData) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'Ошибка входа');
  }

  return res.json(); // { message, token }
};

// Регистрация
export const registerUser = async (data: RegisterData) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'Ошибка регистрации');
  }

  return res.json(); // { message }
};
