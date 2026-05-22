# Healthy Way Landing

This is a code bundle for Sports App Landing Page for Healthy Way (Vite + React). The original project is available at https://www.figma.com/design/tkqFBuVjjC3oTERSCdmyUZ/Sports-App-Landing-Page.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:5173/landing/` (the app is built for subpath `/landing/`).

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
  
