import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loginUser, clearError } from '@/features/auth/authSlice';
import styles from './LoginForm.module.scss';
import { LoginData } from '@/types/authreg';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

// Тип для ответа от loginUser
interface LoginResponse {
  token: string;
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, isLoading, isError, errorMessage } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginData: LoginData = { email, password };

    // Отправляем запрос на вход и обрабатываем результат
    dispatch(loginUser(loginData)).then((res) => {
      if ((res.payload as LoginResponse).token) {
        // Сохраняем токен в localStorage
        localStorage.setItem('token', (res.payload as LoginResponse).token);
        navigate('/profile'); // Переходим на страницу профиля
      }
    });
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        {isError && errorMessage && (
          <ErrorMessage message={errorMessage} onClose={handleCloseError} />
        )}

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

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>

        <button
          type="button"
          onClick={handleGoToRegister}
          className={styles.linkButton}
        >
          Зарегистрироваться
        </button>

        <button
          type="button"
          onClick={handleGoHome}
          className={styles.linkButton}
        >
          На главную
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
