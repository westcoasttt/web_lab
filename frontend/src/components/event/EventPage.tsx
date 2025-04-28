import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventForm from './EventForm'; // Компонент формы
import { useSelector } from 'react-redux';

const EventPage = () => {
  const { id } = useParams(); // Получаем id из URL, если есть
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated,
  );

  // Если пользователь не авторизован, редиректим на страницу входа
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h1>{id ? 'Редактировать мероприятие' : 'Создать новое мероприятие'}</h1>
      <EventForm eventId={id} />
    </div>
  );
};

export default EventPage;
