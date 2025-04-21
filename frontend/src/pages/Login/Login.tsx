import LoginForm from './components/LoginForm/LoginForm';
import styles from './Login.module.scss';

const Login = () => {
  return (
    <div className={styles.loginPage}>
      <h1 className={styles.title}>Авторизация</h1>
      <LoginForm />
    </div>
  );
};

export default Login;
