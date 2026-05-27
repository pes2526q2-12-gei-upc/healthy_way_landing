import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SCREENSHOT_STEPS, screenshotUrl } from '../../screenshots';
import { PhoneFrame } from './PhoneFrame';

export function AppJourneyShowcase() {
  const { lang, t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const clamped = Math.min(Math.max(index, 0), SCREENSHOT_STEPS.length - 1);
    const slide = el.querySelectorAll('[data-slide]')[clamped] as HTMLElement | undefined;
    if (!slide) return;

    const targetLeft = slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    setActiveIndex(clamped);
  }, []);

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const slides = Array.from(el.querySelectorAll('[data-slide]')) as HTMLElement[];
    if (slides.length === 0) return;

    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let minDist = Number.POSITIVE_INFINITY;

    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(center - slideCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateActiveFromScroll();
    el.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    window.addEventListener('resize', updateActiveFromScroll);
    return () => {
      el.removeEventListener('scroll', updateActiveFromScroll);
      window.removeEventListener('resize', updateActiveFromScroll);
    };
  }, [updateActiveFromScroll]);

  useEffect(() => {
    setActiveIndex(0);
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [lang]);

  const atStart = activeIndex <= 0;
  const atEnd = activeIndex >= SCREENSHOT_STEPS.length - 1;

  return (
    <section className="relative z-10 bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t.showcaseTitle}</h2>
          <p className="mt-2 text-lg text-slate-600">{t.showcaseSubtitle}</p>
        </div>

        <div className="relative px-12 sm:px-14">
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={atStart}
            aria-label={t.showcasePrev}
            className="absolute left-0 top-[calc(50%-2rem)] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-md transition hover:bg-brand-muted disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={atEnd}
            aria-label={t.showcaseNext}
            className="absolute right-0 top-[calc(50%-2rem)] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-md transition hover:bg-brand-muted disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {SCREENSHOT_STEPS.map((step, index) => (
              <article
                key={`${lang}-${index}`}
                data-slide
                className="flex w-[240px] shrink-0 snap-center flex-col items-center sm:w-[260px]"
                style={{ scrollMarginInline: 'auto' }}
              >
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {index + 1}
                </span>
                <PhoneFrame src={screenshotUrl(lang, step.file)} alt={t[step.titleKey]} />
                <p className="mt-4 max-w-[240px] text-center text-sm font-medium text-slate-800">
                  {t[step.titleKey]}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
            <p className="text-xs text-slate-500 tabular-nums">
              {activeIndex + 1} / {SCREENSHOT_STEPS.length}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SCREENSHOT_STEPS.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`${index + 1} / ${SCREENSHOT_STEPS.length}`}
                  aria-current={activeIndex === index ? 'true' : undefined}
                  onClick={() => scrollToIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeIndex === index ? 'w-8 bg-brand' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
