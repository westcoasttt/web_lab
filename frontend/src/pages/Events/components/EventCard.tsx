import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EventCard.module.scss';
import { Event } from '@/types/event';

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <div className={styles.card}>
      <h2>{event.title}</h2>
      {event.description && <p>{event.description}</p>}
      <p className={styles.date}>Дата: {event.date}</p>

      <div className={styles.buttonGroup}>
        <Link to={`/profile/edit-event/${event.id}`}>
          <button className={styles.editButton}>Редактировать</button>
        </Link>

        <button
          className={styles.deleteButton}
          onClick={() => alert(`Удалить мероприятие с id: ${event.id}`)}
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default EventCard;
