import { useState, useEffect } from 'react';
import { Star, Download, Send, MapPin, Trophy, Users } from 'lucide-react';
import { translations, type Language } from './translations';

const API_BASE_URL = 'http://nattech.fib.upc.edu:40540';
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import BrandsPage from './pages/BrandsPage';

const LANG_LABELS: Record<Language, string> = { ca: 'CA', es: 'ES', en: 'EN' };
const LANGUAGES: Language[] = ['ca', 'es', 'en'];

export default function App() {
  const [lang, setLang] = useState<Language>('ca');
  const t = translations[lang];

  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    message: ''
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-pop-in');
        } else {
          entry.target.classList.remove('animate-pop-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [showSponsorForm]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/promotions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Request failed');
      alert(t.alertSuccess);
      setShowSponsorForm(false);
      setFormData({ company: '', email: '', message: '' });
    } catch {
      alert(t.alertError);
    }
  };

  const maxScroll = typeof window !== 'undefined' && typeof document !== 'undefined' && document.documentElement?.scrollHeight > window.innerHeight
    ? document.documentElement.scrollHeight - window.innerHeight
    : 5000;
  const scrollProgress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
  const currentProgress = isNaN(scrollProgress) ? 0 : Math.max(0, Math.min(scrollProgress * 100, 100));

  const piratePath = "M 55,0 C 75,8 30,16 42,26 C 54,36 78,42 66,54 C 54,66 22,68 36,80 C 48,90 72,95 60,100";

  const getDotPos = (progress: number) => {
    const segs = [
      [[55,0],[75,8],[30,16],[42,26]],
      [[42,26],[54,36],[78,42],[66,54]],
      [[66,54],[54,66],[22,68],[36,80]],
      [[36,80],[48,90],[72,95],[60,100]],
    ];
    const idx = Math.min(Math.floor(progress * 4), 3);
    const t = progress * 4 - idx;
    const [p0, p1, p2, p3] = segs[idx];
    const mt = 1 - t;
    return {
      x: mt*mt*mt*p0[0] + 3*mt*mt*t*p1[0] + 3*mt*t*t*p2[0] + t*t*t*p3[0],
      y: mt*mt*mt*p0[1] + 3*mt*mt*t*p1[1] + 3*mt*t*t*p2[1] + t*t*t*p3[1],
    };
  };

  const dotPos = scrollProgress > 0 ? getDotPos(Math.min(scrollProgress, 0.999)) : null;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/brands/dashboard" element={<BrandsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
