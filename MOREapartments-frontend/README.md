# Soul Digits — Next.js Frontend

Next.js 16 frontend with locale-based bilingual routing (`/en`, `/he`), Tailwind CSS, and `next-intl`.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start the Express backend (from `../souldigits-backend`):

```bash
npm run dev
```

4. Start the Next.js app:

```bash
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) or [http://localhost:3000/he](http://localhost:3000/he).

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL (local: `http://localhost:3001`, production: Render backend URL) |

## Deploy to Vercel

1. Create a new Vercel project with **Root Directory** set to `souldigits-web`.
2. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://doris-numerology-website-backend.onrender.com`
3. Deploy.

4. Update Render backend env var:
   - `FRONTEND_URL=https://your-new-vercel-url.vercel.app`

5. Test all routes in both locales and submit the WhatsApp contact form.

## Routes

| English | Hebrew |
|---------|--------|
| `/en` | `/he` |
| `/en/about` | `/he/about` |
| `/en/services` | `/he/services` |
| `/en/testimonials` | `/he/testimonials` |
| `/en/contact` | `/he/contact` |

Visiting `/` redirects to `/he` (Hebrew is the default locale).

## Legacy frontend

The previous Vite SPA lives in `../souldigits-frontend`. Keep it until the Next.js site is verified in production, then archive it.
