import { ReactNode } from 'react';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  code?: number;
  message: ReactNode;
  onClose?: () => void;
}

const ErrorMessage = ({ code, message, onClose }: ErrorMessageProps) => (
  <div className={styles.errorMessage}>
    <div className={styles.errorContent}>
      {code && <span className={styles.errorCode}>Ошибка {code}:</span>}
      <span className={styles.errorText}>{message}</span>
    </div>
    {onClose && (
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    )}
  </div>
);

export default ErrorMessage;
