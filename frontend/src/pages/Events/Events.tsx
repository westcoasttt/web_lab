import { useEffect, useState } from 'react';
import styles from './Events.module.scss';
import { getUserName, isAuthenticated } from '@/utils/localStorage';
import { useNavigate } from 'react-router-dom';
import { getEventsPaginated } from '@/api/eventService';
import EventCard from './components/EventCard';
import { Event } from '@/types/event';
import Header from '@/components/header/Header';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const name = getUserName();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const data = await getEventsPaginated(page, limit);
        setEvents(data.events);
        setTotal(data.total);
      } catch (error: any) {
        setError(
          `${error.response?.status || 'Unknown'}: ${error.message || 'Ошибка авторизации'}`,
        );
        console.error(error.message || 'Ошибка при загрузке мероприятий');
      }
    };

    fetchEvents();
  }, [page, limit, navigate]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.eventsPage}>
      <Header />
      <header className={styles.header}>
        <h1>Список мероприятий</h1>
        {name && <p className={styles.welcome}>Привет, {name}!</p>}
      </header>

      <div className={styles.controls}>
        <label>Показывать по: </label>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      <div className={styles.eventsGrid}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={i + 1 === page ? styles.activePage : ''}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Events;
