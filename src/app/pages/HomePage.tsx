import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Star } from 'lucide-react';
import { fetchApprovedSponsors } from '../api/brandApi';
import { publicStaticUrl } from '../config';
import { useLanguage, LANGUAGES, LANG_LABELS } from '../context/LanguageContext';
import { AppJourneyShowcase } from '../components/landing/AppJourneyShowcase';
import { DownloadButton } from '../components/landing/DownloadButton';
import { Footer } from '../components/landing/Footer';
import { PhoneFrame } from '../components/landing/PhoneFrame';

export default function HomePage() {
  const { lang, setLang, t } = useLanguage();
  const [sponsors, setSponsors] = useState<{ companyName: string; logoUrl: string | null }[]>([]);

  useEffect(() => {
    fetchApprovedSponsors()
      .then((data) => setSponsors(data.items || []))
      .catch(() => setSponsors([]));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand">
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand to-brand-hover opacity-95" />

        <div className="absolute top-4 right-4 z-20 flex gap-1">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded px-3 py-1 text-sm font-semibold transition ${
                lang === l
                  ? 'bg-white text-brand shadow'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-20 lg:px-8">
          <div className="max-w-xl text-center text-white lg:text-left">
            <img
              src="logo-full-removebg-preview.png"
              alt="Healthy Way"
              className="mx-auto mb-6 h-24 w-auto lg:mx-0"
            />
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{t.heroTitle}</h1>
            <p className="mt-4 text-base text-white/90 sm:text-lg">{t.heroSubtitle}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <DownloadButton label={t.downloadApp} />
            </div>

            <ul className="mt-8 flex flex-wrap justify-center gap-4 border-t border-white/20 pt-6 text-sm text-white/90 lg:justify-start">
              <li>{t.heroBenefit1}</li>
              <li className="hidden sm:list-item">·</li>
              <li>{t.heroBenefit2}</li>
              <li className="hidden sm:list-item">·</li>
              <li>{t.heroBenefit3}</li>
            </ul>
          </div>

          <div className="shrink-0">
            <PhoneFrame src="screenshots/01-home.png" alt={t.showcase1Title} className="lg:w-[260px]" />
          </div>
        </div>
      </section>

      <AppJourneyShowcase />

      {/* Season rewards */}
      <section className="border-y border-brand-muted bg-brand-muted/40 py-12 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t.rewardsTitle}</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">{t.rewardsText}</p>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t.featuresTitle}</h2>
            <p className="mt-2 text-lg text-slate-600">{t.featuresSubtitle}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: '1', title: t.feature1Title, desc: t.feature1Desc },
              { n: '2', title: t.feature2Title, desc: t.feature2Desc },
              { n: '3', title: t.feature3Title, desc: t.feature3Desc },
            ].map((f) => (
              <div
                key={f.n}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-muted text-sm font-bold text-brand">
                  {f.n}
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">{t.reviewsTitle}</h2>
            <p className="mt-2 text-lg text-slate-600">{t.reviewsSubtitle}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { text: t.review1Text, role: t.review1Role, stars: 5 },
              { text: t.review2Text, role: t.review2Role, stars: 5 },
              { text: t.review3Text, role: t.review3Role, stars: 4 },
            ].map((review, i) => (
              <article
                key={i}
                className="flex flex-col rounded-2xl border border-slate-200 bg-surface p-6"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className={`h-4 w-4 ${
                        si < review.stars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="flex-1 text-slate-700">{review.text}</p>
                <p className="mt-4 text-sm font-medium text-slate-500">{review.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900">{t.sponsorsTitle}</h2>
            <p className="mt-2 text-lg text-slate-600">{t.sponsorsSubtitle}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10">
            <div className="mb-8 grid grid-cols-2 items-center justify-items-center gap-8 md:grid-cols-4">
              {sponsors.length > 0 ? (
                sponsors.map((s) => (
                  <div
                    key={s.companyName}
                    className="opacity-70 transition hover:opacity-100"
                    title={s.companyName}
                  >
                    <img
                      src={publicStaticUrl(s.logoUrl || '')}
                      alt={s.companyName}
                      className="h-14 w-auto max-w-[120px] object-contain"
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-sm text-slate-500">
                  {t.sponsorNoSponsors}
                </p>
              )}
            </div>

            <div className="text-center">
              <Link
                to="/brands"
                className="inline-flex rounded-xl bg-brand px-8 py-3 text-base font-semibold text-white transition hover:bg-brand-hover"
              >
                {t.sponsorCollaborate}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.ctaTitle}</h2>
          <p className="mt-3 text-lg text-white/90">{t.ctaSubtitle}</p>
          <div className="mt-8 flex justify-center">
            <DownloadButton label={t.downloadApp} size="large" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
