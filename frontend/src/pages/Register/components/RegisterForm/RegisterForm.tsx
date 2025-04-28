import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { register, clearError } from '@/features/register/registerSlice';
import styles from './RegisterForm.module.scss';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(
    (state: any) => state.auth.isAuthenticated,
  );

  const { isLoading, isError, errorMessage } = useAppSelector(
    (state) => state.register,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError()); // сбрасываем ошибку перед новой попыткой
    dispatch(
      register({
        name,
        firstName,
        lastName,
        middleName,
        gender,
        birthDate,
        email,
        password,
      }),
    )
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        // Ошибка уже обработана в слайсе
      });
  };

  const goToLogin = () => navigate('/login');

  // Можно ещё очищать ошибку при изменении полей
  const handleChange =
    (setter: (val: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(clearError());
      setter(e.target.value);
    };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      {isError && errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => dispatch(clearError())}
        />
      )}
      <input
        type="text"
        placeholder="Никнейм"
        value={name}
        onChange={handleChange(setName)}
        required
      />

      <input
        type="text"
        placeholder="Имя"
        value={firstName}
        onChange={handleChange(setFirstName)}
        required
      />
      <input
        type="text"
        placeholder="Фамилия"
        value={lastName}
        onChange={handleChange(setLastName)}
        required
      />
      <input
        type="text"
        placeholder="Отчество"
        value={middleName}
        onChange={handleChange(setMiddleName)}
        required
      />
      <select
        value={gender}
        onChange={(e) =>
          setGender(e.target.value as 'male' | 'female' | 'other')
        }
        required
      >
        <option value="male">Мужской</option>
        <option value="female">Женский</option>
      </select>
      <input
        type="date"
        max={new Date().toISOString().split('T')[0]}
        placeholder="Дата рождения"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleChange(setEmail)}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={handleChange(setPassword)}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
      <button type="button" onClick={goToLogin} className={styles.linkButton}>
        Уже есть аккаунт? Войти
      </button>
      <button
        type="button"
        onClick={() => navigate('/')}
        className={styles.linkButton}
      >
        На главную
      </button>
    </form>
  );
};

export default RegisterForm;
