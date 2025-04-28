import { useForm } from 'react-hook-form';
import { createEvent, getEventById, updateEvent } from '@/api/eventService';
import { Event } from '@/types/event';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import styles from './EventForm.module.scss';

interface EventFormProps {
  eventId?: string;
}

interface EventFormInputs {
  title: string;
  description?: string;
  date: string;
}

const EventForm = ({ eventId }: EventFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Reset значения формы
  } = useForm<EventFormInputs>({
    defaultValues: {
      title: '',
      description: '',
      date: '',
    },
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        try {
          const eventData: Event = await getEventById(eventId, token!);
          reset({
            // Обновляем значения формы через reset
            title: eventData.title,
            description: eventData.description || '',
            date: eventData.date.split('T')[0], // Форматируем дату для input[type="date"]
          });
        } catch (error) {
          console.error('Ошибка при загрузке события', error);
        }
      }
    };

    fetchEvent();
  }, [eventId, reset, token]);

  const onSubmit = async (data: EventFormInputs) => {
    try {
      setLoading(true);
      if (eventId) {
        await updateEvent(eventId, data, token!);
      } else {
        await createEvent(data, token!);
      }
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при отправке формы', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Название</label>
          <input
            type="text"
            {...register('title', {
              required: 'Введите название',
              minLength: { value: 3, message: 'Минимум 3 символа' },
              maxLength: { value: 100, message: 'Максимум 100 символов' },
            })}
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          />
          {errors.title && (
            <span className={styles.error}>{errors.title.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Описание: </label>
          <textarea
            {...register('description', {
              maxLength: { value: 500, message: 'Максимум 500 символов' },
            })}
            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Дата</label>
          <input
            type="date"
            {...register('date', {
              required: 'Выберите дату',
              validate: (value) => {
                const today = new Date().toISOString().split('T')[0];
                return value >= today || 'Дата не может быть в прошлом';
              },
            })}
            className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
          />
          {errors.date && (
            <span className={styles.error}>{errors.date.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? (
            <span className={styles.loading}>
              {eventId ? 'Сохранение...' : 'Создание...'}
            </span>
          ) : eventId ? (
            'Сохранить изменения'
          ) : (
            'Создать мероприятие'
          )}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
