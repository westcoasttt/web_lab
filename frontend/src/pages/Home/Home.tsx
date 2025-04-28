import Header from '@/components/header/Header';
import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Добро пожаловать в EventApp!</h1>
        <p>Участвуйте в интересных мероприятиях и следите за обновлениями.</p>
      </main>
    </div>
  );
};

export default Home;
