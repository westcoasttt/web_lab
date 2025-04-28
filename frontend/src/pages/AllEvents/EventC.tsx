import React from 'react';
import styles from '@/pages/AllEvents/EventsC.module.scss';
import { Event } from '@/types/event';

const EventC: React.FC<{ event: Event }> = ({ event }) => {
  return (
    <div className={styles.card}>
      <h2>{event.title}</h2>
      {event.description && <p>{event.description}</p>}
      <p className={styles.date}>Дата: {event.date}</p>
    </div>
  );
};

export default EventC;
