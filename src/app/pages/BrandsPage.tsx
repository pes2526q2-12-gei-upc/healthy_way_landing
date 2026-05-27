import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { X } from 'lucide-react';
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
  type BrandPromotionPayload,
} from '../api/brandApi';
import { ADMIN_CONTACT_EMAIL, publicStaticUrl } from '../config';
import {
  apiDateToDisplay,
  DATE_DISPLAY_PLACEHOLDER,
  displayDateToApi,
  formatDateDdMmYyyy,
  parseDisplayDate,
} from '../utils/dateFormat';
import { useLanguage } from '../context/LanguageContext';

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

type DashTab = 'list' | 'form';

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
  pending: 'bg-amber-50 text-amber-900 ring-amber-200',
  approved: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
  rejected: 'bg-rose-50 text-rose-900 ring-rose-200',
  changes_requested: 'bg-orange-50 text-orange-900 ring-orange-200',
};

const statusLabelsCa: Record<string, string> = {
  pending: 'Pendent',
  approved: 'Aprovada',
  rejected: 'Rebutjada',
  changes_requested: 'Canvis sol·licitats',
};

const sportLabels: Record<string, string> = {
  running: 'Running',
  cycling: 'Ciclisme',
  both: 'Running i ciclisme',
};

const scopeLabels: Record<string, string> = {
  individual: 'Individual',
  team: 'Equip',
  both: 'Individual i equip',
};

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

const btnPrimary =
  'rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60';

const btnSecondary =
  'rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50';

function StatusPill({ status }: { status: string }) {
  const cls = statusStyles[status] || 'bg-slate-50 text-slate-700 ring-slate-200';
  const label = statusLabelsCa[status] || status.replace(/_/g, ' ');
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${cls}`}>
      {label}
    </span>
  );
}

function formatPromoPeriod(start: string | null, end: string | null) {
  const s = formatDateDdMmYyyy(start);
  const e = formatDateDdMmYyyy(end);
  if (s === '—' && e === '—') return '—';
  if (s !== '—' && e !== '—') return `${s} – ${e}`;
  return s !== '—' ? s : e;
}

function AdminContactBanner() {
  if (!ADMIN_CONTACT_EMAIL) return null;
  return (
    <p className="rounded-lg border border-brand-muted bg-brand-muted/50 px-4 py-3 text-sm text-slate-700">
      <span className="font-medium text-slate-900">Necessites ajuda?</span>{' '}
      <a
        href={`mailto:${ADMIN_CONTACT_EMAIL}`}
        className="font-semibold text-brand underline underline-offset-2 hover:text-brand-hover"
      >
        {ADMIN_CONTACT_EMAIL}
      </a>
    </p>
  );
}

function PromotionDetailDialog({
  promotion,
  onClose,
}: {
  promotion: Promotion;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-detail-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 id="promo-detail-title" className="text-lg font-bold text-slate-900">
              Detalls de la promoció
            </h3>
            <p className="mt-1 font-mono text-sm text-slate-600">{promotion.promotionCode || '—'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Tancar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <StatusPill status={promotion.status} />
        </div>

        <dl className="space-y-3 text-sm text-slate-700">
          <div>
            <dt className="font-semibold text-slate-900">Descripció (usuaris)</dt>
            <dd className="mt-0.5 whitespace-pre-wrap">{promotion.description || '—'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Missatge (admin)</dt>
            <dd className="mt-0.5 whitespace-pre-wrap">{promotion.message || '—'}</dd>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Esport</dt>
              <dd className="mt-0.5">{sportLabels[promotion.sportModality] || promotion.sportModality}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Àmbit guanyadors</dt>
              <dd className="mt-0.5">
                {scopeLabels[promotion.eligibleWinnerScope] || promotion.eligibleWinnerScope}
              </dd>
            </div>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Període de validesa</dt>
            <dd className="mt-0.5">
              {formatPromoPeriod(promotion.validity_start_date, promotion.validity_end_date)}
            </dd>
          </div>
        </dl>

        {promotion.adminFeedback ? (
          <p className="mt-4 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900">
            <span className="font-semibold">Feedback de l’admin: </span>
            {promotion.adminFeedback}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className={btnSecondary}>
            Tancar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BrandsPage() {
  const { lang } = useLanguage();
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
  const [dashTab, setDashTab] = useState<DashTab>('list');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [detailPromotion, setDetailPromotion] = useState<Promotion | null>(null);

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
      try {
        await loadPromotions();
      } catch (err) {
        setPromotions([]);
        setError(err instanceof Error ? err.message : 'No s’han pogut carregar les promocions');
      }
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

  const discardEdit = () => {
    setEditingId(null);
    setPromoForm(emptyPromoForm);
    setDashTab('list');
  };

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
      setMessage('');
      try {
        await loadPromotions();
        setDashTab('list');
      } catch (err) {
        setPromotions([]);
        setError(err instanceof Error ? err.message : 'No s’han pogut carregar les promocions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error d’autenticació');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    setError('');
    try {
      await brandLogout();
      setBrand(null);
      setPromotions([]);
      discardEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No s’ha pogut tancar la sessió');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Eliminar el compte i totes les promocions? Aquesta acció no es pot desfer.')) {
      return;
    }
    setError('');
    try {
      await brandDeleteAccount();
      setBrand(null);
      setPromotions([]);
      discardEdit();
      setMessage('Compte eliminat.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No s’ha pogut eliminar el compte');
    }
  };

  const buildPromoPayload = (): BrandPromotionPayload => {
    const payload: Record<string, string> = {};
    Object.entries(promoForm).forEach(([k, v]) => {
      if (v === '') return;
      if (k === 'validity_start_date' || k === 'validity_end_date') {
        const iso = displayDateToApi(v);
        if (iso) payload[k] = iso;
        return;
      }
      payload[k] = v;
    });
    payload.descriptionLocale = lang;
    return payload as BrandPromotionPayload;
  };

  const submitPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!promoForm.validity_start_date.trim() || !promoForm.validity_end_date.trim()) {
      setError('Cal indicar el període de validesa (des de i fins).');
      return;
    }
    const start = parseDisplayDate(promoForm.validity_start_date);
    const end = parseDisplayDate(promoForm.validity_end_date);
    if (!start || !end) {
      setError(`Les dates han de tenir el format ${DATE_DISPLAY_PLACEHOLDER}.`);
      return;
    }
    if (start > end) {
      setError('La data «fins» ha de ser igual o posterior a «des de».');
      return;
    }
    try {
      const payload = buildPromoPayload();
      if (editingId) {
        await updateBrandPromotion(editingId, payload);
        setMessage('Promoció actualitzada i reenviada per revisió.');
      } else {
        await createBrandPromotion(payload);
        setMessage('Promoció enviada per revisió.');
      }
      setPromoForm(emptyPromoForm);
      setEditingId(null);
      setDashTab('list');
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
      validity_start_date: apiDateToDisplay(p.validity_start_date),
      validity_end_date: apiDateToDisplay(p.validity_end_date),
    });
    setDashTab('form');
    setError('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelPromotion = async (p: Promotion) => {
    if (
      !confirm(
        `Cancel·lar la promoció «${p.promotionCode || p.id}»? Aquesta acció no es pot desfer.`,
      )
    ) {
      return;
    }
    setError('');
    setMessage('');
    try {
      await cancelBrandPromotion(p.id);
      setMessage('Promoció cancel·lada.');
      if (editingId === p.id) discardEdit();
      await loadPromotions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No s’ha pogut cancel·lar la promoció');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-muted border-t-brand" />
          <p className="text-sm font-medium">Carregant portal de marques…</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-surface px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-md">
          <Link to="/" className="text-sm font-medium text-brand hover:text-brand-hover">
            ← Tornar a l’inici
          </Link>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <img
              src="logo-full-removebg-preview.png"
              alt="Healthy Way"
              className="mb-4 h-12 w-auto"
            />
            <h1 className="text-2xl font-bold text-slate-900">Portal de marques</h1>
            <p className="mt-2 text-sm text-slate-600">
              Registra’t, envia promocions per revisió i apareix als guanyadors de la temporada.
            </p>

            <div className="mb-6 mt-6">
              <AdminContactBanner />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
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
                  className={`rounded-md py-2 text-sm font-semibold transition ${
                    authMode === mode
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode === 'login' ? 'Iniciar sessió' : 'Registrar-se'}
                </button>
              ))}
            </div>

            {error ? (
              <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
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
                      className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-muted file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand-muted/80"
                      onChange={(e) => setRegisterLogoFile(e.target.files?.[0] ?? null)}
                    />
                    <p className="mt-1 text-xs text-slate-500">PNG, JPEG, WebP o GIF (màx. 3 MB).</p>
                  </div>
                </>
              ) : null}
              <button type="submit" disabled={authBusy} className={`w-full ${btnPrimary}`}>
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

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-4">
            {brand.logoUrl ? (
              <img
                src={publicStaticUrl(brand.logoUrl)}
                alt=""
                className="h-12 w-12 rounded-lg border border-slate-200 object-contain bg-white p-1"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-muted text-sm font-bold text-brand">
                {brand.companyName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <Link to="/" className="text-xs font-medium text-brand hover:underline">
                ← Inici
              </Link>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">{brand.companyName}</h1>
              <p className="text-sm text-slate-500">{brand.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleLogout} className={btnSecondary}>
              Sortir
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Eliminar compte
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {message ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        ) : null}

        <AdminContactBanner />

        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => {
              setDashTab('list');
              if (!editingId) setPromoForm(emptyPromoForm);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
              dashTab === 'list' ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Les meves promocions
          </button>
          <button
            type="button"
            onClick={() => {
              setDashTab('form');
              setError('');
              if (!editingId) setPromoForm(emptyPromoForm);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
              dashTab === 'form' ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {editingId ? 'Editar promoció' : 'Nova promoció'}
          </button>
        </div>

        {dashTab === 'form' ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {editingId ? (
              <p className="mb-4 rounded-lg bg-brand-muted px-4 py-2 text-sm text-slate-800">
                Editant promoció{' '}
                <span className="font-mono font-semibold">
                  {promoForm.promotionCode || `#${editingId}`}
                </span>
                .{' '}
                <button
                  type="button"
                  onClick={discardEdit}
                  className="font-semibold text-brand hover:underline"
                >
                  Descartar edició
                </button>
              </p>
            ) : (
              <p className="mb-4 text-sm text-slate-600">
                Les promocions passen per revisió abans de publicar-se a l’app.
              </p>
            )}

            <form onSubmit={submitPromotion} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Codi de promoció *
                </label>
                <input
                  required
                  className={inputClass}
                  value={promoForm.promotionCode}
                  onChange={(e) => setPromoForm((f) => ({ ...f, promotionCode: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Descripció (usuaris)
                </label>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={promoForm.description}
                  onChange={(e) => setPromoForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Missatge (admin)
                </label>
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
                  <option value="cycling">Ciclisme</option>
                  <option value="both">Running i ciclisme</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Àmbit guanyadors
                </label>
                <select
                  className={inputClass}
                  value={promoForm.eligibleWinnerScope}
                  onChange={(e) =>
                    setPromoForm((f) => ({ ...f, eligibleWinnerScope: e.target.value }))
                  }
                >
                  <option value="individual">Individual</option>
                  <option value="team">Equip</option>
                  <option value="both">Individual i equip</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Vàlid des de *
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder={DATE_DISPLAY_PLACEHOLDER}
                  pattern="\d{1,2}/\d{1,2}/\d{4}"
                  title={DATE_DISPLAY_PLACEHOLDER}
                  className={inputClass}
                  value={promoForm.validity_start_date}
                  onChange={(e) =>
                    setPromoForm((f) => ({ ...f, validity_start_date: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Vàlid fins *
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder={DATE_DISPLAY_PLACEHOLDER}
                  pattern="\d{1,2}/\d{1,2}/\d{4}"
                  title={DATE_DISPLAY_PLACEHOLDER}
                  className={inputClass}
                  value={promoForm.validity_end_date}
                  onChange={(e) =>
                    setPromoForm((f) => ({ ...f, validity_end_date: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button type="submit" className={btnPrimary}>
                  {editingId ? 'Actualitzar' : 'Enviar per revisió'}
                </button>
                {editingId ? (
                  <button type="button" onClick={discardEdit} className={btnSecondary}>
                    Cancel·lar edició
                  </button>
                ) : null}
              </div>
            </form>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">Les teves promocions</h2>
              <button
                type="button"
                onClick={() => {
                  discardEdit();
                  setDashTab('form');
                }}
                className={btnPrimary}
              >
                Nova promoció
              </button>
            </div>

            {promotions.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Encara no tens promocions. Crea la primera des de «Nova promoció».
              </p>
            ) : (
              <ul className="space-y-3">
                {promotions.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{p.promotionCode || '—'}</p>
                        {p.description ? (
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{p.description}</p>
                        ) : null}
                        <p className="mt-1 text-xs text-slate-500">
                          {formatPromoPeriod(p.validity_start_date, p.validity_end_date)}
                        </p>
                      </div>
                      <StatusPill status={p.status} />
                    </div>
                    {p.adminFeedback ? (
                      <p className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-900">
                        <span className="font-semibold">Feedback: </span>
                        {p.adminFeedback}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <button
                        type="button"
                        onClick={() => setDetailPromotion(p)}
                        className="font-semibold text-slate-700 hover:text-brand"
                      >
                        Veure detalls
                      </button>
                      {(p.status === 'pending' || p.status === 'changes_requested') && (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(p)}
                            className="font-semibold text-brand hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelPromotion(p)}
                            className="font-semibold text-rose-600 hover:underline"
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
        )}
      </main>

      {detailPromotion ? (
        <PromotionDetailDialog
          promotion={detailPromotion}
          onClose={() => setDetailPromotion(null)}
        />
      ) : null}
    </div>
  );
}
