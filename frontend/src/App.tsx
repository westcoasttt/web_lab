import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import Login from '@/pages/Login/Login';
import Register from '@/pages/Register/Register';
import Events from '@/pages/AllEvents/Events';
import NotFound from '@/pages/NotFound/NotFound';
import ProfilePage from '@/pages/Profile/ProfilePage';
import { ProtectedRoute } from '@/components/Protect/ProtectedRoute';
import Header from './components/header/Header';
import './App.css';
import EditEventPage from './components/event/EditEvent';
import CreateEventPage from './components/event/CreateEvent';

const App = () => (
  <Router>
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/create-event" element={<CreateEventPage />} />
          <Route path="/profile/edit-event/:id" element={<EditEventPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </Router>
);

export default App;
