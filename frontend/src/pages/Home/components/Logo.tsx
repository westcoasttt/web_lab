import styles from './Logo.module.scss';
import logo from './logo.jpg';
const Logo = () => {
  return (
    <div className={styles.logo}>
      <img src={logo} alt="Logo" />
      <span>EventApp</span>
    </div>
  );
};

export default Logo;
