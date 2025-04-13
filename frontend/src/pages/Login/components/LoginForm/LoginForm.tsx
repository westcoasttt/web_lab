import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import { login } from '@/api/authService';
import { saveToken, saveUserName, isAuthenticated } from '@/utils/localStorage';
import { LoginData } from '@/types/authreg';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/events');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginData: LoginData = { email, password };

    try {
      const { token, name } = await login(loginData);

      saveToken(token);
      saveUserName(name);
      navigate('/events');
    } catch (error: any) {
      console.error(error.message || 'Ошибка авторизации');
    }
  };

  const goToRegister = () => navigate('/register');

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Вход</h2>

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

        <button type="submit">Войти</button>
        <button
          type="button"
          onClick={goToRegister}
          className={styles.linkButton}
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
