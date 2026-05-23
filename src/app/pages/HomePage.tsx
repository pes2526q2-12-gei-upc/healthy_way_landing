import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Star, Download, MapPin, Trophy, Users } from 'lucide-react';
import { fetchApprovedSponsors } from '../api/brandApi';
import { publicStaticUrl } from '../config';

export default function HomePage() {
  const [sponsors, setSponsors] = useState<{ companyName: string; logoUrl: string | null }[]>([]);
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
  }, [sponsors.length]);

  useEffect(() => {
    fetchApprovedSponsors()
      .then((data) => setSponsors(data.items || []))
      .catch(() => setSponsors([]));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Animated Route Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.9 }} />
              <stop offset="50%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0.8 }} />
            </linearGradient>
            <mask id="progressMask">
              <rect x="0" y="0" width="100" height={currentProgress || 0} fill="white" />
            </mask>
          </defs>

          {/* Faint full path preview */}
          <path
            d={piratePath}
            stroke="#3B82F6"
            strokeWidth="0.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1,2"
            opacity="0.25"
          />

          {/* Revealed route */}
          <path
            d={piratePath}
            stroke="url(#routeGradient)"
            strokeWidth="0.35"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            mask="url(#progressMask)"
          />

        </svg>

        {dotPos && (
          <div
            className="absolute pointer-events-none"
            style={{ left: `${dotPos.x}%`, top: `${dotPos.y}%` }}
          >
            <div style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#3B82F6',
              opacity: 0.9,
              animation: 'dot-pulse 2s ease-in-out infinite',
              transform: 'translate(-50%, -50%)',
            }} />
          </div>
        )}
      </div>

      <style>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-pop-in {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes dot-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.4; }
        }
      `}</style>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 z-10 h-screen flex flex-col justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1920')] bg-cover bg-center"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            {/* Left: Headline & CTA */}
            <div className="text-white space-y-4">
              <div className="flex justify-center">
                <img src="/logo.png" alt="Healthy Way" className="h-28 w-auto" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                Descobreix les Rutes més Saludables per al teu Entrenament—Respira Aire Net, Assoleix el Màxim Rendiment
              </h1>

              <p className="text-base lg:text-lg text-blue-50">
                Assoleix els teus objectius de fitness en 30 dies amb recomanacions de rutes intel·ligents que eviten la contaminació i s'adapten al temps en temps real—el 95% dels atletes veuen millores de salut mesurables.
              </p>

              <div className="pt-1">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-xl"
                >
                  <Download className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-90">DISPONIBLE A</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/20">
                <div>
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-blue-100 text-sm">Atletes Actius</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-blue-100 text-sm">Taxa d'Èxit</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1M+</div>
                  <div className="text-blue-100 text-sm">Rutes Registrades</div>
                </div>
              </div>
            </div>

            {/* Right: App Preview */}
            <div className="relative flex justify-end">
              <img
                src="https://images.unsplash.com/photo-1545575439-3261931f52f1?w=600&h=800&fit=crop"
                alt="Athletes using Healthy Way"
                className="rounded-3xl shadow-2xl w-full max-w-xs lg:max-w-sm object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Per Què els Atletes Estimen Healthy Way</h2>
          <p className="text-xl text-gray-600">L'única app que combina salut, competició i comunitat</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow scroll-animate">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Recomanacions de Rutes Intel·ligents</h3>
            <p className="text-gray-600">Rutes optimitzades amb IA per a la qualitat de l'aire, les condicions meteorològiques i els teus objectius de fitness.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow scroll-animate">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Trophy className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Conquesta de Territoris</h3>
            <p className="text-gray-600">Competeix amb equips mensualment per capturar zones i guanyar premis exclusius de les millors marques esportives.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow scroll-animate">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Impulsada per la Comunitat</h3>
            <p className="text-gray-600">Uneix-te a equips, comparteix rutes i construeix connexions duradores amb altres atletes.</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Què Diuen els Atletes</h2>
            <p className="text-xl text-gray-600">Uneix-te a milers d'usuaris satisfets</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="flex flex-col items-center text-center scroll-animate">
              <img
                src="https://images.unsplash.com/photo-1605827277785-2c51c2b3182b?w=150&h=150&fit=crop"
                alt="Marc Rodriguez"
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-200"
              />
              <div className="bg-white rounded-2xl p-6 shadow-lg relative mb-4">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45"></div>
                <div className="flex justify-center mb-3 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-2">"Healthy Way ha transformat el meu entrenament! Les alertes de qualitat de l'aire m'han ajudat a evitar rutes contaminades i mai m'he sentit millor. A més, la competició en equip em manté motivat cada dia!"</p>
              </div>
              <p className="font-semibold text-gray-900">Marc Rodriguez</p>
              <p className="text-gray-600 text-sm">Ciclista Professional</p>
            </div>

            {/* Review 2 */}
            <div className="flex flex-col items-center text-center scroll-animate">
              <img
                src="https://images.unsplash.com/photo-1542393881816-df51684879df?w=150&h=150&fit=crop"
                alt="Sarah Johnson"
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-green-200"
              />
              <div className="bg-white rounded-2xl p-6 shadow-lg relative mb-4">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45"></div>
                <div className="flex justify-center mb-3 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-2">"La gamificació és genial! El nostre equip va capturar 14 zones el mes passat i vam guanyar vals de Decathlon. Ja no és només exercici, és una aventura amb amics!"</p>
              </div>
              <p className="font-semibold text-gray-900">Sarah Johnson</p>
              <p className="text-gray-600 text-sm">Corredora de Marató</p>
            </div>

            {/* Review 3 */}
            <div className="flex flex-col items-center text-center scroll-animate">
              <img
                src="https://images.unsplash.com/photo-1739567994955-6441a2fbb62d?w=150&h=150&fit=crop"
                alt="Alex Chen"
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-purple-200"
              />
              <div className="bg-white rounded-2xl p-6 shadow-lg relative mb-4">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45"></div>
                <div className="flex justify-center mb-3 gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-gray-700 mb-2">"Com a algú nou al running, les recomanacions de rutes basades en el temps han facilitat el començament. Vaig passar de zero a 5K en només 30 dies! El suport de la comunitat és increïble."</p>
              </div>
              <p className="font-semibold text-gray-900">Alex Chen</p>
              <p className="text-gray-600 text-sm">Entusiasta del Fitness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Els Nostres Increïbles Patrocinadors</h2>
          <p className="text-xl text-gray-600">Col·laborant amb les millors marques esportives</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-12 scroll-animate">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center mb-12">
            {sponsors.length > 0 ? (
              sponsors.map((s) => (
                <div
                  key={s.companyName}
                  className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                  title={s.companyName}
                >
                  <img
                    src={publicStaticUrl(s.logoUrl || '')}
                    alt={s.companyName}
                    className="h-16 w-auto max-w-[140px] object-contain"
                  />
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-sm">
                Les marques col·laboradores apareixeran aquí quan tinguin promocions aprovades.
              </p>
            )}
          </div>

          <div className="text-center">
            <Link
              to="/brands"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Col·labora amb nosaltres
            </Link>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-animate">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Preparat per Transformar el Teu Camí Atlètic?
          </h2>
          <p className="text-xl text-blue-50 mb-10">
            Uneix-te a més de 50.000 atletes que conquesten territoris i assoleixen els seus objectius
          </p>
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white px-10 py-5 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl"
          >
            <Download className="w-6 h-6" />
            <div className="text-left">
              <div className="text-xs opacity-90">DESCARREGA ARA A</div>
              <div className="text-xl">Google Play</div>
            </div>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-white mb-2">Healthy Way - The Only Way</p>
            <p className="text-sm">Gamifica el teu esforç</p>
            <p className="text-sm mt-6">&copy; 2025 Healthy Way. Tots els drets reservats.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
