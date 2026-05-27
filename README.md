# Healthy Way — Landing Page

Marketing landing page and brand portal for the **Healthy Way** sports app. Built with Vite + React + TypeScript + Tailwind CSS 4 + shadcn/ui (Radix UI).

## Pages

| Route | Description |
|---|---|
| `/landing/` | Public marketing page |
| `/landing/brands` | Partner brand portal (register, login, manage promotions) |

### Landing page sections

1. **Hero** — headline, key benefits, and Android APK download button
2. **App showcase** — 6-screen walkthrough of the app (home, activity, routes, route detail, team ranking, team chat)
3. **Season rewards** — explains how users earn discounts by conquering territories and finishing seasons
4. **Features** — smart routes (air quality + weather), territory conquest, and brand discounts
5. **Athlete reviews** — scrollable cards: Kaleb Grove, Pau Víctor Gabriel, Kevin Grove, Rayan Abriak
6. **Partner brands** — logos of approved sponsors fetched live from the API
7. **CTA** — final download prompt

### Brand portal

Self-service portal for partner brands at `/landing/brands`:

- Register with company name, email, password, and logo upload
- Submit promotions (code, description, sport modality, winner scope, validity dates) for admin review
- Edit or cancel pending/rejected promotions
- Statuses: pending → approved / rejected / changes requested

## Internationalisation

Three languages switchable in the UI:

| Code | Language |
|---|---|
| `ca` | Catalan (default) |
| `es` | Spanish |
| `en` | English |

All copy lives in `src/app/translations.ts`.

## Local development

```bash
npm ci
cp .env.example .env   # optional — see env vars below
npm run dev
```

Open `http://localhost:5173/landing/`.

The Vite dev server proxies `/api` to the backend. Ensure the backend is running on port **8080** (Docker) or override with `VITE_API_BASE_URL` in `.env`.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | *(empty — same-origin)* | Backend base URL for local dev without Vite proxy |
| `VITE_ADMIN_CONTACT_EMAIL` | *(empty)* | Support mailto link shown in the brand portal |
| `VITE_APP_DOWNLOAD_URL` | `BASE_URL/downloads/healthy-way.apk` | Override APK download URL |

### App download (APK)

Place the Android package at `public/downloads/healthy-way.apk`, or set `VITE_APP_DOWNLOAD_URL` to an external URL. The file is already bundled in `public/downloads/` — the download button returns 404 only if the file is missing.

## Docker

```bash
docker build -t healthy-way-landing .
docker run --rm -p 8081:80 healthy-way-landing
```

Open `http://localhost:8081/landing/`.

## CI / CD

GitHub Actions workflows:

- **`develop`** — install and production build
- **`main`** — install, build, SonarCloud analysis, deploy to self-hosted runner

Deploy syncs this repo to `~/healthy-way/landing` on the Virtech VM and rebuilds the `landing` Docker Compose service.

**Production note:** do not set `VITE_API_BASE_URL` at build time. The brand portal calls `/api/v1/…` on the same public host as `/landing/`; root nginx proxies `/api` to the backend. Baking in a `localhost` URL breaks brand registration for all users and causes `brandToken` cookie errors in the browser.

On the API server, set `LANDING_FRONTEND_URL` to the browser origin of the landing (e.g. `http://nattech.fib.upc.edu:8080` — origin only, no path).

## Tech stack

- [Vite 6](https://vitejs.dev/) + [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)
- [React 18](https://react.dev/) + [React Router 7](https://reactrouter.com/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives + class-variance-authority)
- [Lucide React](https://lucide.dev/) icons
- [Motion](https://motion.dev/) for animations

## Attributions

UI components from [shadcn/ui](https://ui.shadcn.com/) — MIT licence.  
Photos from [Unsplash](https://unsplash.com) — [Unsplash licence](https://unsplash.com/license).
