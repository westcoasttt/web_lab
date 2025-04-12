import React, { useState } from 'react';
import styles from './LoginForm.module.scss';
import { login } from '@/api/authService';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.token); // можно вынести в localStorageUtils
      // навигация на главную или страницу профиля
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
};

export default LoginForm;
