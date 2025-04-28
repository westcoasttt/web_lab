import { useAppSelector } from '@/app/hooks';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
