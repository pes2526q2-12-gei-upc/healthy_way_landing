import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  Building2,
  Gift,
  LogOut,
  Mail,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  brandDeleteAccount,
  brandLogin,
  brandLogout,
  brandMe,
  brandRegister,
  cancelBrandPromotion,
  createBrandPromotion,
  listBrandPromotions,
  updateBrandPromotion,
} from '../api/brandApi';
import { publicStaticUrl } from '../config';

type Brand = { id: number; companyName: string; email: string; logoUrl: string | null };

type Promotion = {
  id: number;
  promotionCode: string | null;
  description: string | null;
  message: string | null;
  status: string;
  sportModality: string;
  eligibleWinnerScope: string;
  adminFeedback: string | null;
  validity_start_date: string | null;
  validity_end_date: string | null;
};

const emptyPromoForm = {
  promotionCode: '',
  description: '',
  message: '',
  sportModality: 'both',
  eligibleWinnerScope: 'both',
  validity_start_date: '',
  validity_end_date: '',
};

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-900 ring-amber-200',
  approved: 'bg-emerald-100 text-emerald-900 ring-emerald-200',
  rejected: 'bg-rose-100 text-rose-900 ring-rose-200',
  changes_requested: 'bg-orange-100 text-orange-900 ring-orange-200',
};

const inputClass =
  'w-full rounded-xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200';

function StatusPill({ status }: { status: string }) {
  const cls = statusStyles[status] || 'bg-slate-100 text-slate-700 ring-slate-200';
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${cls}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function BrandsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authBusy, setAuthBusy] = useState(false);
  const [authForm, setAuthForm] = useState({
    companyName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [registerLogoFile, setRegisterLogoFile] = useState<File | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promoForm, setPromoForm] = useState(emptyPromoForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadPromotions = useCallback(async () => {
    const promos = await listBrandPromotions();
    setPromotions(promos.promotions || []);
  }, []);

  const loadSession = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await brandMe();
      setBrand(data.brand);
      await loadPromotions();
    } catch {
      setBrand(null);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, [loadPromotions]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (authMode === 'register') {
      if (authForm.password !== authForm.passwordConfirm) {
        setError('Les contrasenyes no coincideixen.');
        return;
      }
      if (!registerLogoFile) {
        setError('Cal pujar el logo de l’empresa (PNG, JPEG, WebP o GIF).');
        return;
      }
    }
    setAuthBusy(true);
    try {
      let sessionBrand: Brand;
      if (authMode === 'register') {
        const fd = new FormData();
        fd.append('companyName', authForm.companyName);
        fd.append('email', authForm.email);
        fd.append('password', authForm.password);
        fd.append('passwordConfirm', authForm.passwordConfirm);
        fd.append('logo', registerLogoFile);
        const data = await brandRegister(fd);
        sessionBrand = data.brand as Brand;
      } else {
        const data = await brandLogin({ email: authForm.email, password: authForm.password });
        sessionBrand = data.brand as Brand;
      }
      setBrand(sessionBrand);
      try {
        await loadPromotions();
      } catch {
        setPromotions([]);
      }
      navigate('/brands/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    await brandLogout();
    setBrand(null);
    setPromotions([]);
    navigate('/brands');
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Eliminar el compte i totes les promocions? Aquesta acció no es pot desfer.')) {
      return;
    }
    try {
      await brandDeleteAccount();
      setBrand(null);
      navigate('/brands');
      setMessage('Compte eliminat.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No s’ha pogut eliminar el compte');
    }
  };

  const buildPromoFormData = () => {
    const fd = new FormData();
    Object.entries(promoForm).forEach(([k, v]) => {
      if (v !== '') fd.append(k, v);
    });
    return fd;
  };

  const submitPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const fd = buildPromoFormData();
      if (editingId) {
        await updateBrandPromotion(editingId, fd);
        setMessage('Promoció actualitzada i reenviada per revisió.');
      } else {
        await createBrandPromotion(fd);
        setMessage('Promoció enviada per revisió.');
      }
      setPromoForm(emptyPromoForm);
      setEditingId(null);
      await loadPromotions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No s’ha pogut guardar la promoció');
    }
  };

  const startEdit = (p: Promotion) => {
    if (p.status !== 'pending' && p.status !== 'changes_requested') return;
    setEditingId(p.id);
    setPromoForm({
      promotionCode: p.promotionCode || '',
      description: p.description || '',
      message: p.message || '',
      sportModality: p.sportModality,
      eligibleWinnerScope: p.eligibleWinnerScope,
      validity_start_date: p.validity_start_date?.slice(0, 10) || '',
      validity_end_date: p.validity_end_date?.slice(0, 10) || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm font-medium">Carregant portal de marques…</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-12 sm:py-20">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl" />

        <div className="relative mx-auto max-w-lg">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            ← Tornar a l’inici
          </Link>

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Portal de marques</h1>
                <p className="text-sm text-slate-600">Healthy Way · Partners</p>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              Crea el teu compte, envia promocions per revisió i apareix als guanyadors de la temporada.
            </p>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100/80 p-1">
              {(['login', 'register'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setAuthMode(mode);
                    setError('');
                    setAuthForm((f) => ({ ...f, passwordConfirm: '' }));
                    setRegisterLogoFile(null);
                  }}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                    authMode === mode
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode === 'login' ? 'Iniciar sessió' : 'Registrar-se'}
                </button>
              ))}
            </div>

            {error ? (
              <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {error}
              </p>
            ) : null}

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' ? (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Empresa</label>
                  <input
                    required
                    className={inputClass}
                    value={authForm.companyName}
                    onChange={(e) => setAuthForm((f) => ({ ...f, companyName: e.target.value }))}
                  />
                </div>
              ) : null}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Correu</label>
                <input
                  type="email"
                  required
                  className={inputClass}
                  value={authForm.email}
                  onChange={(e) => setAuthForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Contrasenya</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className={inputClass}
                  value={authForm.password}
                  onChange={(e) => setAuthForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              {authMode === 'register' ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Confirmar contrasenya
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      className={inputClass}
                      value={authForm.passwordConfirm}
                      onChange={(e) =>
                        setAuthForm((f) => ({ ...f, passwordConfirm: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Logo de l’empresa *
                    </label>
                    <input
                      type="file"
                      required
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-800 hover:file:bg-blue-100"
                      onChange={(e) => setRegisterLogoFile(e.target.files?.[0] ?? null)}
                    />
                    <p className="mt-1 text-xs text-slate-500">PNG, JPEG, WebP o GIF (màx. 3 MB).</p>
                  </div>
                </>
              ) : null}
              <button
                type="submit"
                disabled={authBusy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110 disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                {authBusy
                  ? 'Un moment…'
                  : authMode === 'register'
                    ? 'Crear compte'
                    : 'Entrar al panell'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const onDashboard = location.pathname.includes('/dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-4">
            {brand.logoUrl ? (
              <img
                src={publicStaticUrl(brand.logoUrl)}
                alt=""
                className="h-14 w-14 rounded-2xl border border-slate-200 object-contain bg-white p-1 shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md">
                <Building2 className="h-7 w-7" />
              </div>
            )}
            <div>
              <Link to="/" className="text-xs font-medium text-blue-600 hover:underline">
                ← Inici
              </Link>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{brand.companyName}</h1>
              <p className="flex items-center gap-1 text-sm text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                {brand.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Sortir
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar compte
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        {onDashboard ? null : (
          <p className="text-center text-sm text-slate-500">
            <button
              type="button"
              className="font-semibold text-blue-600 hover:underline"
              onClick={() => navigate('/brands/dashboard')}
            >
              Anar al panell complet →
            </button>
          </p>
        )}

        {message ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        ) : null}

        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 px-6 py-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Plus className="h-5 w-5 text-blue-600" />
              {editingId ? 'Editar promoció' : 'Nova promoció'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Les promocions passen per revisió abans de publicar-se a l’app.
            </p>
          </div>
          <form onSubmit={submitPromotion} className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Codi de promoció *</label>
              <input
                required
                className={inputClass}
                value={promoForm.promotionCode}
                onChange={(e) => setPromoForm((f) => ({ ...f, promotionCode: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Descripció (usuaris)</label>
              <textarea
                className={inputClass}
                rows={3}
                value={promoForm.description}
                onChange={(e) => setPromoForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Missatge (admin)</label>
              <textarea
                className={inputClass}
                rows={3}
                value={promoForm.message}
                onChange={(e) => setPromoForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Esport</label>
              <select
                className={inputClass}
                value={promoForm.sportModality}
                onChange={(e) => setPromoForm((f) => ({ ...f, sportModality: e.target.value }))}
              >
                <option value="running">Running</option>
                <option value="cycling">Cycling</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Àmbit guanyadors</label>
              <select
                className={inputClass}
                value={promoForm.eligibleWinnerScope}
                onChange={(e) => setPromoForm((f) => ({ ...f, eligibleWinnerScope: e.target.value }))}
              >
                <option value="individual">Individual</option>
                <option value="team">Equip</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Vàlid des de</label>
              <input
                type="date"
                className={inputClass}
                value={promoForm.validity_start_date}
                onChange={(e) => setPromoForm((f) => ({ ...f, validity_start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Vàlid fins</label>
              <input
                type="date"
                className={inputClass}
                value={promoForm.validity_end_date}
                onChange={(e) => setPromoForm((f) => ({ ...f, validity_end_date: e.target.value }))}
              />
            </div>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110"
              >
                <Gift className="h-4 w-4" />
                {editingId ? 'Actualitzar' : 'Enviar per revisió'}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setPromoForm(emptyPromoForm);
                  }}
                  className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel·lar
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Les teves promocions</h2>
          {promotions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Encara no tens promocions. Crea la primera amb el formulari de dalt.
            </p>
          ) : (
            <ul className="space-y-4">
              {promotions.map((p) => (
                <li
                  key={p.id}
                  className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-5 transition hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{p.promotionCode || '—'}</p>
                      {p.description ? (
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{p.description}</p>
                      ) : null}
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                  {p.adminFeedback ? (
                    <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900">
                      <span className="font-semibold">Feedback: </span>
                      {p.adminFeedback}
                    </p>
                  ) : null}
                  <div className="mt-4 flex gap-3">
                    {(p.status === 'pending' || p.status === 'changes_requested') && (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="text-sm font-semibold text-blue-600 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await cancelBrandPromotion(p.id);
                            await loadPromotions();
                          }}
                          className="text-sm font-semibold text-rose-600 hover:underline"
                        >
                          Cancel·lar
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
