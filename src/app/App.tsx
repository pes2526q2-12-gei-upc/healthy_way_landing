import { useState, useEffect, useRef } from 'react';
import { Star, Download, Send, MapPin, Trophy, Users } from 'lucide-react';

export default function App() {
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your interest! We will contact you soon.');
    setShowSponsorForm(false);
    setFormData({ companyName: '', contactName: '', email: '', phone: '', message: '' });
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
                Discover the Healthiest Routes for Your Workout—Breathe Clean Air, Achieve Peak Performance
              </h1>

              <p className="text-base lg:text-lg text-blue-50">
                Reach your fitness goals in 30 days with smart route recommendations that avoid pollution and adapt to real-time weather—95% of athletes see measurable health improvements.
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
                    <div className="text-xs opacity-90">GET IT ON</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/20">
                <div>
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-blue-100 text-sm">Active Athletes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-blue-100 text-sm">Success Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">1M+</div>
                  <div className="text-blue-100 text-sm">Routes Tracked</div>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Athletes Love Healthy Way</h2>
          <p className="text-xl text-gray-600">The only app that combines health, competition, and community</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow scroll-animate">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Route Recommendations</h3>
            <p className="text-gray-600">AI-powered routes optimized for air quality, weather conditions, and your fitness goals.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow scroll-animate">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Trophy className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Territory Conquest</h3>
            <p className="text-gray-600">Compete with teams monthly to capture zones and win exclusive prizes from top sports brands.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow scroll-animate">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Driven</h3>
            <p className="text-gray-600">Join teams, share routes, and build lasting connections with fellow athletes.</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Athletes Are Saying</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied users</p>
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
                <p className="text-gray-700 mb-2">"Healthy Way transformed my training! The air quality alerts helped me avoid polluted routes and I've never felt better. Plus, the team competition keeps me motivated every single day!"</p>
              </div>
              <p className="font-semibold text-gray-900">Marc Rodriguez</p>
              <p className="text-gray-600 text-sm">Professional Cyclist</p>
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
                <p className="text-gray-700 mb-2">"The gamification is genius! Our team captured 14 zones last month and won Decathlon vouchers. It's not just exercise anymore—it's an adventure with friends!"</p>
              </div>
              <p className="font-semibold text-gray-900">Sarah Johnson</p>
              <p className="text-gray-600 text-sm">Marathon Runner</p>
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
                <p className="text-gray-700 mb-2">"As someone new to running, the route recommendations based on weather made it easy to start. I went from zero to 5K in just 30 days! The community support is incredible."</p>
              </div>
              <p className="font-semibold text-gray-900">Alex Chen</p>
              <p className="text-gray-600 text-sm">Fitness Enthusiast</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Amazing Sponsors</h2>
          <p className="text-xl text-gray-600">Partnering with the best brands in sports</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-12 scroll-animate">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center mb-12">
            <div className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
              <img src="https://images.unsplash.com/photo-1614231125961-38323d6c485b?w=200&h=100&fit=crop" alt="Sponsor 1" className="h-16 w-auto" />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
              <img src="https://images.unsplash.com/photo-1600269453258-30a2e10c72f3?w=200&h=100&fit=crop" alt="Sponsor 2" className="h-16 w-auto" />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
              <img src="https://images.unsplash.com/photo-1656057903797-175389ce695d?w=200&h=100&fit=crop" alt="Sponsor 3" className="h-16 w-auto" />
            </div>
            <div className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
              <img src="https://images.unsplash.com/photo-1610664676282-55c8de64f746?w=200&h=100&fit=crop" alt="Sponsor 4" className="h-16 w-auto" />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowSponsorForm(!showSponsorForm)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Send className="w-5 h-5" />
              Want to Join Us as a Sponsor?
            </button>
          </div>
        </div>

        {/* Sponsor Form */}
        {showSponsorForm && (
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-xl p-8 md:p-12 scroll-animate animate-pop-in">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Become a Sponsor</h3>
            <p className="text-gray-600 text-center mb-8">Fill out this form and we'll get back to you within 24 hours</p>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us about your brand and why you'd like to partner with Healthy Way..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowSponsorForm(false)}
                  className="px-8 py-4 rounded-xl font-semibold border-2 border-gray-300 hover:border-gray-400 text-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-animate">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Athletic Journey?
          </h2>
          <p className="text-xl text-blue-50 mb-10">
            Join 50,000+ athletes conquering territories and achieving their goals
          </p>
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white px-10 py-5 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl"
          >
            <Download className="w-6 h-6" />
            <div className="text-left">
              <div className="text-xs opacity-90">DOWNLOAD NOW ON</div>
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
            <p className="text-sm mt-6">&copy; 2025 Healthy Way. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
