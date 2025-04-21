/*import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import { login } from '@/api/authService';
import { saveToken, saveUserName, isAuthenticated } from '@/utils/localStorage';
import { LoginData } from '@/types/authreg';
import { useFetch } from '@/utils/useFetch';
import {ErrorMessage} from '@/components/ErrorMessage/ErrorMessage';
interface ApiError {
  code?: number;
  message: string;
}
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState<ApiError | null>(null);

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
      setError(null);
      navigate('/events');
    } catch (err: unknown) {
      let errorMessage = 'Ошибка авторизации';
      let errorCode = 400;

      if (typeof err === 'object' && err !== null) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { message?: string };
          };
          message?: string;
        };

        errorCode = axiosError.response?.status || errorCode;
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      }

      setError({
        code: errorCode,
        message: errorMessage,
      });
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

export default LoginForm;*/
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import { login } from '@/api/authService';
import { saveToken, saveUserName, isAuthenticated } from '@/utils/localStorage';
import { LoginData } from '@/types/authreg';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

interface ApiError {
  code?: number;
  message: string;
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState<ApiError | null>(null);

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
      setError(null);
      navigate('/events');
    } catch (err: unknown) {
      let errorMessage = 'Ошибка авторизации';
      let errorCode = 400;

      if (typeof err === 'object' && err !== null) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { message?: string };
          };
          message?: string;
        };

        errorCode = axiosError.response?.status || errorCode;
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      }

      setError({
        code: errorCode,
        message: errorMessage,
      });
    }
  };

  const goToRegister = () => navigate('/register');

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        {error && (
          <ErrorMessage
            code={error.code}
            message={error.message}
            onClose={() => setError(null)}
          />
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

        <button type="submit">Войти</button>
        <button
          type="button"
          onClick={goToRegister}
          className={styles.linkButton}
        >
          Зарегистрироваться
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className={styles.linkButton}
        >
          На главную
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
