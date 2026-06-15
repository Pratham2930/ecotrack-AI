# 🌱 EcoTrack AI — Carbon Footprint Awareness Platform

A production-ready, visually polished web app that helps people **measure, understand and reduce** their carbon footprint — with an AI Climate Coach, global benchmarking, gamification and a Duolingo-style green streak system.

Built with **React + Vite**, **Tailwind CSS**, **Firebase (Auth + Firestore)**, **Recharts**, **React Leaflet**, **React Hook Form** and **Framer Motion**. Fully tested with **Vitest + React Testing Library**.

> **Runs with zero setup.** Without Firebase credentials the app automatically runs in **Demo Mode** (localStorage-backed auth + data), so you can explore every feature immediately. Add Firebase env vars to switch to a real cloud backend.

---

## ✨ Features

### Core
- **Authentication** — email/password sign-up, login, logout, protected routes (Firebase Auth, with demo fallback).
- **Dashboard** — total & monthly footprint, sustainability score, recent activity, KPIs.
- **Carbon Calculator** — transport (car/bike/bus/train/flight), home energy (electricity, LPG), diet, and waste with recycling, using realistic emission factors.
- **Analytics** — Recharts visualisations: monthly trend, category pie, score trend, reduction progress.
- **Personalised Recommendations** — rule-based engine ranking actions by estimated CO₂ savings.
- **Carbon Reduction Goals** — create, track progress, complete, earn points.
- **Gamification** — eco points, 5-tier green level system, weekly challenges, achievement badges.
- **Carbon Offset** — trees required + equivalences (car km, flights, gasoline, phone charges).
- **Accessibility** — WCAG-friendly palette, keyboard navigation, ARIA labels, focus indicators, skip link, responsive/mobile-first.
- **Security** — env-var config, Firestore security rules, form validation + input sanitization.
- **Dark / light mode**, glassmorphism UI, smooth animations.

### Advanced / global-scale
- **AI Climate Coach** — conversational assistant, daily challenges, weekly reports, monthly roadmaps. Works offline via a rule-based engine, with an optional OpenAI-powered serverless function.
- **Global Carbon Benchmarking** — country/city/global averages, percentile ranking, country leaderboard.
- **Eco Impact Marketplace** — sustainable product alternatives with annual CO₂ savings + ratings, personalised to your footprint.
- **Community Challenges** — global/country/city/friends leaderboards, joinable challenges, reward points.
- **Carbon Footprint World Map** — interactive Leaflet map of country sustainability scores + regional trends.
- **Green Streak System** — daily eco habits, streak tracking, milestone badges, sustainability levels.

---

## 🧱 Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 + Vite |
| Styling | Tailwind CSS (custom eco/earth palette, glassmorphism) |
| Auth & DB | Firebase Authentication + Cloud Firestore (localStorage demo fallback) |
| Routing | React Router (lazy-loaded routes) |
| Charts | Recharts |
| Maps | React Leaflet + OpenStreetMap |
| Forms | React Hook Form |
| Animation | Framer Motion |
| AI | Rule-based engine + optional OpenAI serverless function |
| Testing | Vitest + React Testing Library |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure Firebase — otherwise demo mode is used
cp .env.example .env   # then fill in your values

# 3. Start the dev server
npm run dev
```

Open the printed local URL (default http://localhost:5173).

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the Vitest unit/component suite |
| `npm run coverage` | Run tests with a coverage report |

---

## 🔥 Firebase Setup

1. Create a project at the [Firebase Console](https://console.firebase.google.com/).
2. **Authentication → Sign-in method →** enable **Email/Password**.
3. **Firestore Database →** create a database (production mode).
4. **Project settings → General → Your apps →** register a Web app and copy the config values into `.env`:

   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
5. Publish the security rules from [`firestore.rules`](./firestore.rules):
   - Paste them into **Firestore → Rules**, or
   - Deploy with the Firebase CLI: `firebase deploy --only firestore:rules`

   These rules ensure each user can only read/write their own `/users/{uid}` document.

---

## 🤖 AI Climate Coach (optional)

The coach always works using a built-in rule-based engine. To enable real LLM-generated replies, deploy the included serverless function [`api/coach.js`](./api/coach.js) and set server-side env vars in your host (e.g. Vercel):

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini   # optional, defaults to gpt-4o-mini
```

The frontend calls `/api/coach` and **automatically falls back** to the local engine if the endpoint is unavailable or unconfigured.

---

## ▲ Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, **Add New → Project** and import the repo.
3. Framework preset: **Vite** (build `npm run build`, output `dist`). The included [`vercel.json`](./vercel.json) handles SPA routing and keeps `/api/*` serverless.
4. Add **Environment Variables** (the `VITE_FIREBASE_*` values, and optionally `OPENAI_API_KEY`).
5. **Deploy.** The `api/coach.js` function is deployed automatically as a serverless route.

> Any static host works for the frontend (Netlify, Firebase Hosting, etc.) — only the AI coach route needs a serverless platform.

---

## 🧪 Testing

Unit and component tests cover the core logic and rendering:

- `carbon.test.js` — emission calculations, scoring, offsets, formatting
- `validation.test.js` — email/password validation + input sanitization
- `gamification.test.js` — levels, badges, streak computation
- `recommendations.test.js` — recommendation ranking + impact
- `benchmark.test.js` — global comparison + percentile logic
- `Dashboard.test.jsx` — loading, empty and populated dashboard rendering

```bash
npm run test
```

---

## 📁 Project Structure

```
src/
├── assets/          # static assets
├── components/      # ui primitives, layout, charts, auth, forms
├── context/         # Auth, Theme, UserData providers (+ contexts.js)
├── data/            # reference datasets (countries, marketplace, challenges)
├── firebase/        # Firebase init (with demo fallback)
├── hooks/           # useAuth / useTheme / useUserData
├── pages/           # route screens (dashboard, calculator, coach, map, …)
├── routes/          # protected / public-only route guards
├── services/        # auth, data (Firestore + localStorage), coach
├── tests/           # Vitest setup + suites
└── utils/           # carbon, recommendations, gamification, benchmark, coach…
api/
└── coach.js         # optional Vercel serverless AI endpoint
firestore.rules      # Firestore security rules
vercel.json          # SPA rewrites + serverless config
```

---

## 🔢 Emission Factors

Calculations use widely cited public averages (DEFRA / EPA / IPCC), in kg CO₂e:

| Category | Factor |
| --- | --- |
| Car | 0.192 / km |
| Bus | 0.105 / km |
| Train | 0.041 / km |
| Flight | 0.18 / km |
| Electricity | 0.475 / kWh |
| LPG | 2.983 / kg |
| Tree offset | ~21 kg CO₂ absorbed / year |

---

## 📄 License

MIT — built for sustainability hackathons and learning. Contributions welcome.
