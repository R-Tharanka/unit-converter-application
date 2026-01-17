// App.jsx
// Top-level routing. Keep this file minimal - routes map to pages.
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Converter from './pages/Converter';
import History from './pages/History';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Converter />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}
