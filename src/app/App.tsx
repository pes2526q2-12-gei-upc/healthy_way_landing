import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import BrandsPage from './pages/BrandsPage';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/brands/dashboard" element={<BrandsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LanguageProvider>
  );
}
