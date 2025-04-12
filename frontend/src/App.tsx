import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Events from '@/pages/Events';
import NotFound from '@pages/NotFound';
import './App.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/events" element={<Events />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
