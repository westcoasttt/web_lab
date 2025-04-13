import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.scss';
import { registerUser } from '@/api/authService';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerUser({ name, email, password });
      navigate('/login');
    } catch (error: any) {
      console.error(error.message || 'Ошибка при регистрации');
    }
  };

  const goToLogin = () => navigate('/login');

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <button type="submit">Зарегистрироваться</button>
      <button type="button" onClick={goToLogin} className={styles.linkButton}>
        Уже есть аккаунт? Войти
      </button>
    </form>
  );
};

export default RegisterForm;
