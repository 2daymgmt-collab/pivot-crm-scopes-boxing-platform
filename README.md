# Scopes Boxing Club — Front Desk CRM (Prototype)

A single-page React app for gym check-ins, membership tracking, coach scheduling, and event/lead management. Built as an interactive prototype — front-end only, no real backend yet (see **Limitations** below).

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

Build for production:
```bash
npm run build
npm run preview   # serve the built files locally to sanity-check
```

## Testing on GitHub or GitLab

This repo includes CI config for both:

- **GitHub Actions** — `.github/workflows/ci.yml` runs `npm ci && npm run build` on every push/PR to `main`. Push this repo to GitHub and Actions will run automatically.
- **GitLab CI** — `.gitlab-ci.yml` does the same on GitLab's shared runners, and keeps the built `dist/` folder as a downloadable artifact.

There are no unit tests yet — the build step itself acts as a smoke test (it fails on broken imports or syntax errors). To add real tests later, [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) is the natural fit for a Vite project like this one.

### Pushing this to a repo
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Getting it live online (step by step)

**1. Create the GitHub repo**
- Go to github.com → click **New repository** → give it a name (e.g. `scopes-boxing-crm`) → **Create repository**. Leave it empty (no README/license) since this project already has one.

**2. Get the code into it**
- *With a computer and git installed:* unzip this project, open a terminal in the folder, and run the "Pushing this to a repo" commands above, replacing `<your-repo-url>` with the URL GitHub shows you (something like `https://github.com/yourname/scopes-boxing-crm.git`).
- *Without git/terminal:* on the repo page, click **uploading an existing file**, then drag in every file and folder from the unzipped project (including the hidden `.github` folder — you may need to enable "show hidden files" on your computer to see it), and commit.

**3. Turn on GitHub Pages (makes it a live website)**
- In your repo, go to **Settings → Pages**.
- Under "Build and deployment," set **Source** to **GitHub Actions**.
- That's it — this repo already includes `.github/workflows/deploy.yml`, which builds the app and publishes it automatically every time you push to `main`.
- After the first push, check the **Actions** tab for a "Deploy to GitHub Pages" run. Once it finishes (green check), your site is live at `https://yourname.github.io/scopes-boxing-crm/`.

**Alternative — Vercel or Netlify (often simpler, no Pages setup needed)**
- Go to vercel.com or netlify.com, sign in with your GitHub account, click **Import/Add New Project**, and pick this repo.
- Both auto-detect Vite: build command `npm run build`, output directory `dist`. Click deploy.
- You get a live URL immediately, and it auto-redeploys on every future push — no workflow file needed for this path.

### Deploying
Since this builds to static files (`dist/`), it deploys cleanly to:
- **GitHub Pages** (add a `deploy` job to the Actions workflow, or use `gh-pages` npm package)
- **GitLab Pages** (add a `pages` job to `.gitlab-ci.yml` that copies `dist/` to `public/`)
- Netlify / Vercel (point either at this repo, build command `npm run build`, output dir `dist`)

## Login Flows

- **Membership Code** — existing members/guests sign in with their 4-digit code.
- **Day Pass** — new walk-ins sign in with their name, sign a waiver, pick single-pass or 3-pack, and get a code for next time.
- **Staff & Coach Access** — shared front-desk code (`4477`) for full admin access, or an individual coach code (e.g. Natasha: `6789`) for a personal coach dashboard. New coaches can self-register a profile and get their own code.
- **Google / Apple quick login** — only offered as a "forgot your code?" recovery path, not a primary login method. This is a **UI simulation only** — no real OAuth is wired up.

## What's Simulated vs. Real

This is a front-end prototype. The following are **simulated in-app** rather than connected to real services:
- **WhatsApp notifications** — shown as a live feed inside the Check-In Kiosk, not sent to a real WhatsApp number.
- **Email confirmations** — logged into the same feed with a 📧 prefix, not actually emailed.
- **Payments** — deposits, day-pass fees, and 1-on-1 rates are displayed and tracked in state, but no real payment processor is connected.
- **PDF signing** — "Print / Save as PDF" uses the browser's native print dialog (a real PDF you can save), but nothing is stored server-side.

## Connecting Real Google Tools / WhatsApp

A written architecture for a real daily-sync pipeline (PDF membership records → Google Sheets → WhatsApp Business API) was scoped out separately and isn't wired into this codebase yet. At a high level, making the simulated pieces real would mean:

1. **Google Sheets as a data layer** — replace the in-memory `useState` data in `App.jsx` with calls to the Google Sheets API (or a small backend that syncs to Sheets), so front-desk staff can also view/edit data in a spreadsheet.
2. **WhatsApp Business Cloud API** — replace `pushToFeed(...)` calls with real API calls once a Meta Business account and approved message templates are set up.
3. **Real email** — swap the 📧 feed entries for calls to an email provider (e.g. Postmark, SendGrid) from a small server function, since browser JavaScript can't send email directly.
4. **Real payments** — integrate a processor (Stripe, Square) for the day-pass and 1-on-1 payment steps.

None of steps 1–4 can run from a static front-end alone — they all need a small backend or serverless functions layer, since API keys for Sheets/WhatsApp/email/payments can't safely live in browser code.

## Project Structure

```
├── index.html
├── src/
│   ├── main.jsx      # React entry point
│   └── App.jsx        # entire application (single-file prototype)
├── .github/workflows/ci.yml
├── .gitlab-ci.yml
└── package.json
```

`App.jsx` is currently one large file containing every view (landing/login, member portal, coach portal, staff roster, kiosk, etc.) as a set of components. It's a reasonable size for a prototype; if this becomes a real production app, splitting it into `src/components/*.jsx` files is the natural next refactor.
