# Healthy Way Landing

This is a code bundle for Sports App Landing Page for Healthy Way (Vite + React). The original project is available at https://www.figma.com/design/tkqFBuVjjC3oTERSCdmyUZ/Sports-App-Landing-Page.

## Local development

```bash
npm ci
cp .env.example .env   # optional; defaults API to http://localhost:8080
npm run dev
```

Open `http://localhost:5173/landing/` (the app is built for subpath `/landing/`).

Brand logos and other uploads are loaded from `/api/v1/public/static/...` on the backend. The Vite dev server proxies `/api` to the API (see `vite.config.ts`). Ensure the backend is running on port **8080** (Docker) or set `VITE_API_BASE_URL` in `.env`.

Set `VITE_ADMIN_CONTACT_EMAIL` in `.env` so brands see a support mailto link on the portal (login and dashboard).

### App download (APK)

Place the Android package at `public/downloads/healthy-way.apk`, or set `VITE_APP_DOWNLOAD_URL` in `.env` to an external URL. Until the file exists, the download button will return 404 — that is expected during development.

## Docker

```bash
docker build -t healthy-way-landing .
docker run --rm -p 8081:80 healthy-way-landing
```

Then open `http://localhost:8081/landing/`.

## CI and CD

GitHub Actions workflows:

- `develop` — install and production build
- `main` — install, build, SonarCloud, deploy on the self-hosted runner

Deploy syncs this repo to `~/healthy-way/landing` on the Virtech VM and rebuilds the `landing` Docker Compose service.
  
