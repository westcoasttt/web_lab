import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout as clearAuthState } from '@/features/auth/authSlice';
import Logo from '@/pages/Home/components/Logo';
import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(clearAuthState());
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <Logo />
      <div className={styles.nav}>
        {/* Кнопки доступны всегда */}

        {/* Если пользователь авторизован */}
        {isAuthenticated ? (
          <>
            {user && (
              <span className={styles.username}>Вы вошли как: {user.name}</span>
            )}
            <button onClick={() => navigate('/')} className={styles.button}>
              Главная
            </button>
            <button
              onClick={() => navigate('/events')}
              className={styles.button}
            >
              Все мероприятия
            </button>
            <button
              onClick={() => navigate('/profile')}
              className={styles.button}
            >
              Профиль
            </button>
            <button onClick={handleLogout} className={styles.button}>
              Выйти
            </button>
          </>
        ) : (
          // Если пользователь не авторизован
          <>
            <button onClick={() => navigate('/')} className={styles.button}>
              Главная
            </button>

            <button
              onClick={() => navigate('/login')}
              className={styles.button}
            >
              Вход
            </button>
            <button
              onClick={() => navigate('/register')}
              className={styles.button}
            >
              Регистрация
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
