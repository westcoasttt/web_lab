import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import Logo from '@/pages/Home/components/Logo';
import {
  isAuthenticated,
  getUserName,
  logout as clearAuthData,
} from '@/utils/localStorage';

import { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setIsAuth(isAuthenticated());
    const name = getUserName();
    if (name) setUserName(name);
  }, []);

  const logout = () => {
    clearAuthData();
    setIsAuth(false);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <Logo />
      <div className={styles.nav}>
        {!isAuth ? (
          <>
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
        ) : (
          <>
            <span className={styles.username}>Вы вошли как: {userName}</span>
            <button onClick={logout} className={styles.button}>
              Выйти
            </button>
            <button onClick={() => navigate('/')} className={styles.button}>
              Главная
            </button>
          </>
        )}
        <button onClick={() => navigate('/events')} className={styles.button}>
          Список мероприятий
        </button>
      </div>
    </header>
  );
};

export default Header;
