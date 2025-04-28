import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '@/pages/Events/Events.module.scss';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchEvents, clearError } from '@/features/events/eventSlice';
import { getUserName, isAuthenticated } from '@/utils/localStorage';
import EventC from './EventC';

import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

const Events = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const name = getUserName();
  const { events, total, isLoading, isError, errorMessage } = useAppSelector(
    (state) => state.events,
  );

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  /*useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);*/

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchEvents({ page, limit }));
  }, [dispatch, page, limit]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.eventsPage}>
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
            setPage(1); // Сбрасываем на первую страницу при изменении лимита
          }}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      {/* Ошибка */}
      {isError && errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => dispatch(clearError())}
        />
      )}

      {/* Загрузка */}
      {isLoading && <div>Загрузка...</div>}

      {/* Список событий */}
      <div className={styles.eventsGrid}>
        {events.map((event) => (
          <EventC key={event.id} event={event} />
        ))}
      </div>

      {/* Пагинация */}
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
