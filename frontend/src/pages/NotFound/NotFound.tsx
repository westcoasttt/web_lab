import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <p>Ой! Страница не найдена.</p>
      <Link to="/" className={styles.link}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
