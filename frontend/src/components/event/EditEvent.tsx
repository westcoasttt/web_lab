import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { getEventById } from '@/api/eventService';
import EventForm from '@/components/event/EventForm';
import { Event } from '@/types/event';
import styles from './EditEventPage.module.scss'; // Импортируем стили

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (id && token) {
      getEventById(id, token)
        .then((fetchedEvent) => {
          setEvent(fetchedEvent);
        })
        .catch((error) => {
          console.error('Ошибка загрузки события:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, token]);

  if (isLoading) return <p>Загрузка...</p>;
  if (!event) return <p>Событие не найдено.</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Редактирование мероприятия</h1>
      <EventForm eventId={event.id} />
    </div>
  );
};

export default EditEventPage;
