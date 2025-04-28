/*import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchProfile,
  fetchProfileEvents,
} from '@/features/profile/profileSlice';
import EventCard from '@/pages/Events/components/EventCard';
import styles from './ProfilePage.module.scss';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, events, isLoading, isError, errorMessage } = useAppSelector(
    (state) => state.profile,
  );

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchProfileEvents());
  }, [dispatch]);

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка: {errorMessage}</div>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <h1>Профиль</h1>
        {user && (
          <div className={styles.userInfo}>
            <p>
              <strong>Никнейм:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Фамилия:</strong> {user.lastName}
            </p>
            <p>
              <strong>Имя:</strong> {user.firstName}
            </p>
            <p>
              <strong>Отчество:</strong> {user.middleName}
            </p>
            <p>
              <strong>Пол:</strong> {user.gender}
            </p>
            <p>
              <strong>Дата рождения:</strong>{' '}
              {user.birthDate
                ? new Date(user.birthDate).toLocaleDateString()
                : 'Не указано'}
            </p>
          </div>
        )}
      </div>
      

    /*  <Link to="/profile/create-event">
        <button className={styles.createEventButton}>
          Создать новое мероприятие
        </button>
      </Link>

      <h2>Мои мероприятия</h2>

      <div className={styles.eventsGrid}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;*/
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchProfile,
  fetchProfileEvents,
} from '@/features/profile/profileSlice';
import { updateUserProfile } from '@/api/userService';
import EventCard from '@/pages/Events/components/EventCard';
import { User } from '@/types/user';
import styles from './ProfilePage.module.scss';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, events, isLoading, isError, errorMessage } = useAppSelector(
    (state) => state.profile,
  );

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<User>>();

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchProfileEvents());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        gender: user.gender,
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split('T')[0]
          : undefined,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: Partial<User>) => {
    try {
      await updateUserProfile(data);
      setIsEditing(false);
      dispatch(fetchProfile()); // перезагрузим данные профиля
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка: {errorMessage}</div>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <h1>Профиль</h1>

        {user && (
          <form className={styles.userInfo} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.field}>
              <strong>Никнейм: </strong>
              {isEditing ? (
                <input {...register('name', { required: 'Введите никнейм' })} />
              ) : (
                <span>{user.name}</span>
              )}
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <strong>Email: </strong>
              {isEditing ? (
                <input
                  type="email"
                  {...register('email', { required: 'Введите email' })}
                />
              ) : (
                <span>{user.email}</span>
              )}
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <strong>Фамилия:</strong>
              {isEditing ? (
                <input
                  {...register('lastName', { required: 'Введите Фамилию' })}
                />
              ) : (
                <span>{user.lastName}</span>
              )}
              {errors.lastName && (
                <span className={styles.error}>{errors.lastName.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <strong>Имя: </strong>
              {isEditing ? (
                <input
                  {...register('firstName', { required: 'Введите Имя' })}
                />
              ) : (
                <span>{user.firstName}</span>
              )}
              {errors.firstName && (
                <span className={styles.error}>{errors.firstName.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <strong>Отчество: </strong>
              {isEditing ? (
                <input
                  {...register('middleName', { required: 'Введите Имя' })}
                />
              ) : (
                <span>{user.middleName}</span>
              )}
              {errors.middleName && (
                <span className={styles.error}>
                  {errors.middleName.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <strong>Пол: </strong>
              {isEditing ? (
                <select {...register('gender')}>
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              ) : (
                <span>{user.gender}</span>
              )}
            </div>

            <div className={styles.field}>
              <strong>Дата рождения: </strong>
              {isEditing ? (
                <input
                  type="date"
                  {...register('birthDate', {
                    validate: (value) =>
                      !value ||
                      new Date(value) <= new Date() ||
                      'Дата рождения не может быть в будущем',
                  })}
                />
              ) : (
                <span>
                  {user.birthDate
                    ? new Date(user.birthDate).toLocaleDateString()
                    : 'Не указана'}
                </span>
              )}
              {errors.birthDate && (
                <span className={styles.error}>{errors.birthDate.message}</span>
              )}
            </div>

            {isEditing ? (
              <div className={styles.editButtons}>
                <button type="submit" className={styles.saveButton}>
                  Сохранить
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    reset();
                    setIsEditing(false);
                  }}
                >
                  Отмена
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                Редактировать
              </button>
            )}
          </form>
        )}
      </div>

      <Link to="/profile/create-event">
        <button className={styles.createEventButton}>
          Создать новое мероприятие
        </button>
      </Link>

      <h2>Мои мероприятия</h2>

      <div className={styles.eventsGrid}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
