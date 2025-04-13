import RegisterForm from './components/RegisterForm/RegisterForm';
import styles from './Register.module.scss';

const Register = () => {
  return (
    <div className={styles.registerPage}>
      <h1 className={styles.title}>Страница регистрации</h1>
      <RegisterForm />
    </div>
  );
};

export default Register;
