import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Admin } from './pages/Admin';
import { Confirmation } from './pages/Confirmation';
import { Home } from './pages/Home';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirmacao/:id" element={<Confirmation />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}