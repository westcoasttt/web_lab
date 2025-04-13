// src/pages/Home/Home.tsx
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import { isAuthenticated, getUserName, logout } from '@/utils/localStorage';
import Logo from './components/Logo';

const Home = () => {
  const navigate = useNavigate();
  const isAuth = isAuthenticated();
  const userName = getUserName();

  return (
    <div className={styles.container}>
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
            </>
          )}
          <button onClick={() => navigate('/events')} className={styles.button}>
            Список мероприятий
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <h1>Добро пожаловать в наше приложение!</h1>
        <p>
          Это платформа для просмотра и управления мероприятиями.
          Зарегистрируйтесь или войдите, чтобы продолжить.
        </p>
      </main>
    </div>
  );
};

export default Home;
