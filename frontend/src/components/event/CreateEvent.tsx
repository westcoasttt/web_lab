import EventForm from '@/components/event/EventForm';
import styles from './CreateEventPage.module.scss'; // Импортируем стили

const CreateEventPage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Создание мероприятия</h1>
      <EventForm />
    </div>
  );
};

export default CreateEventPage;
