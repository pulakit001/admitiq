# Admit IQ

**Admit IQ** is an AI-powered college and career matching web app built for Indian students. It replaces months of scattered Googling and spreadsheet comparisons with one guided workspace: answer a short questionnaire, and the app researches real universities, scores them against *your* constraints, compares them on weighted measures that you define, maps your interests to concrete career paths, and grades your application essays the way an admissions officer would.

Everything runs client-side — there is no server and no database. All user data lives in the browser's `localStorage`, so nothing about a student ever leaves their machine except the anonymous prompts sent to the Gemini API.

---

## What it does

| Tool | What happens |
|---|---|
| **Match my college** | A 9-question questionnaire (study field, exams & scores, budget, location, learning style, priorities, campus vibe, hostel, extras — every question also accepts free text). The AI applies your hard constraints first (fees ceiling, entrance-bar realism), then returns 6 real institutions mixing Ambitious / Target / Safe picks with fit scores, fees, placement data, exams, programs, hostel & scholarship notes, and a student-voice sentiment signal. |
| **Compare colleges** | Name up to four colleges. Keep the built-in measures (annual fees, median placement, scholarship share, internship rate) or add *any* measure as free text ("campus life", "startup culture") — the AI scores custom measures 0–10. Slide 0–3 weights on each measure and the app re-scores every college live with a weighted-average algorithm while the AI writes the final verdict, per-college takes, and the trade-off to watch. |
| **Career Compass** | List your hobbies and interests — chess, guitar, football, coding. The AI reads them *together as one picture* (not one by one) and returns 5 career paths, each with a fit %, real job titles, Indian market outlook, early-career salary, a 4-step roadmap from today to first job, and one concrete first step for the next month. |
| **Essay feedback** | Pick the target college (Harvard, Cambridge, IIT Bombay — any), the essay type, paste the exact prompt and your full essay. The AI grades it 0–100 on five axes (Clarity, Structure, Fit to prompt, Voice & originality, Mechanics), tells you what the prompt *really* asks for, lists strengths, gives 4 specific improvement bullets referencing your actual sentences, and rewrites one line to show the difference. |
| **Ask Anything** | A popup counsellor (✦ button or Ctrl/⌘+K) that sees your saved profile, matches, comparisons and essay reports — answers render with real markdown (bold, bullets, headings), not raw symbols. |
| **Insights** | Two tabs: **Responses** (every questionnaire answer, researched-college table, essay reports) and **General analytics** (AI research runs, active API key, activity summary). |

---

## How the matching algorithm works

The recommendation pipeline has three deterministic stages around two AI calls:

```
 ┌────────────────┐   hard-constraint    ┌─────────────────┐   weighted scoring   ┌──────────────┐
 │ Questionnaire  │ ───────────────────▶ │  AI research +  │ ───────────────────▶ │  Dashboard   │
 │ (9 answers)    │   filter (excludes   │  fit scoring    │   + AI narrative     │  (6 cards)   │
 └────────────────┘   out-of-budget /    └─────────────────┘   (summary, why,    └──────────────┘
                      out-of-reach)                            verdict, takes)
```

1. **Hard-constraint filter** — before any college is recommended, the model is instructed to exclude institutions whose annual fees clearly exceed the stated budget and whose entrance bar is clearly out of reach of the exam performance, and to state in the summary what got excluded.
2. **AI research + fit scoring** — each returned college carries `fitScore` (0–100), `reach` (Ambitious / Target / Safe), fees in ₹ lakh/year, median placement in LPA, admission exam, programs, hostel and scholarship notes, plus a `studentVoice` object (sentiment + recurring themes from public student discussions — used as a supporting signal only, never as fact).
3. **Weighted comparison (deterministic)** — in Compare, each college gets `score = Σ(norm(valueᵢ) × weightᵢ) / Σweightᵢ × 100` across all active measures, where higher-is-better measures normalize as `v/max` and lower-is-better (fees) as `1 − v/max`. Custom AI-scored measures normalize on a 0–10 scale. Moving a slider re-computes every score instantly — no new AI call.

### Metrics and data sources

- **Fees** — typical UG annual fees in ₹ lakh.
- **Placements** — median package in LPA.
- **Scholarship share** and **internship rate** (%).
- **Admission exam & cutoff context** — JEE / CUET / SAT / state exams with realistic entrance-bar commentary.
- **Student voice** — sentiment and recurring themes drawn from public forums (Reddit etc.), explicitly marked as a soft signal with a confidence level (high / medium / low) per college.
- Live grounding uses Gemini's `google_search` tool when quota allows; if grounding is unavailable the app transparently labels results *"from AI knowledge — live search unavailable"* and the model answers from its trained knowledge, never inventing named institutions.

---

## How the AI layer works

All AI goes through one client module (`js/ai.js`) talking to the **Gemini `generateContent`** API with the model chain `gemini-3.5-flash-lite` → `gemini-flash-lite-latest`.

### Three-key failover

```
 request ──▶ key #1 ── grounded ── 429? ──▶ same key, ungrounded ──▶ OK
                │                                              │
                └── ungrounded 429/403 ──▶ rotate to key #2 ──▶ key #2 ──▶ key #3 ──▶ error surfaced
```

- The **primary key is always tried first**. A `429` (quota exhausted) or `403` (key rejected) on a *plain* call permanently rotates the active key and persists that choice in `localStorage`, so every later call starts on the healthy key.
- A `429` on a **grounded** call only (grounding quota is billed separately) silently retries **ungrounded on the same key** before touching the chain.
- The active key index, the AI run counter, and every report survive reloads.

### Secrets policy

API keys never enter the repository:

- Local development: paste keys into `js/config.js` (gitignored).
- Vercel: set **one** environment variable `GEMINI_API_KEYS=key1,key2,key3` — the build step (`scripts/build.js`) injects them into `js/config.js` at deploy time. The file is served with `Cache-Control: no-store`.

---

## Data persistence

Every piece of user data is persisted under the `aiq:` localStorage namespace (with a one-time fallback read from the legacy `aiq2.` namespace): questionnaire profile, matches, per-college research, comparison setup + verdicts, career analysis, essay reports, chat history, theme, API-key rotation index and AI run count. Clearing data is an explicit button in Insights — nothing disappears on reload or session end.

## Motion system

The UI is deliberately heavily animated: an SVG logo draw-on splash, layered reveal-on-scroll transitions (IntersectionObserver + staggered delays), floating card hovers, press-scale on every button, focus glow rings on inputs, a rotating placeholder in the command bar, and an instant light/dark theme switch — all disabled automatically under `prefers-reduced-motion`.

---

## Project structure

```
admitiq/
├── index.html            # App shell: header, nav, command bar, AI popup (no secrets)
├── styles.css            # Full stylesheet (theme tokens, motion system, responsive)
├── js/
│   ├── config.js         # ⛔ gitignored — your Gemini keys (see config.example.js)
│   ├── config.example.js # Template showing the key-chain shape
│   ├── core.js           # State, localStorage layer, helpers, markdown renderer
│   ├── ai.js             # Gemini client + 3-key failover chain
│   ├── chat.js           # Ask Anything popup
│   ├── motion.js         # Reveal-on-scroll + rotating search hint
│   ├── main.js           # Router, theme, command bar, splash
│   └── views/
│       ├── dash.js       # Overview (quick access card, workspace tiles)
│       ├── match.js      # Questionnaire + AI college matching
│       ├── compare.js    # Measures, weights, deterministic scoring, AI verdict
│       ├── career.js     # Career Compass
│       ├── essay.js      # Essay feedback grader
│       └── insights.js   # Responses + General analytics
├── scripts/
│   └── build.js          # Vercel build step: injects GEMINI_API_KEYS
├── package.json          # npm run build / dev
└── vercel.json           # Static deploy config, security headers, cache rules
```

Each file has one specific job, so any bug is easy to locate: AI problems → `js/ai.js`, rendering bugs → the one view file, persistence bugs → `js/core.js`.

---

## Run locally

```bash
npx serve -l 3000 .        # or any static server
```

1. Copy `js/config.example.js` → `js/config.js`.
2. Paste your Gemini API keys into `window.ADMIQ_KEYS` (first key = primary).
3. Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import it in Vercel — the included `vercel.json` and `package.json` make it a zero-config static deploy (`npm run build` runs the key-injection step).
3. In **Project → Settings → Environment Variables** add:
   ```
   GEMINI_API_KEYS = your_primary_key,your_backup_1,your_backup_2
   ```
4. Deploy. Failover order = the order you list them.

## Security notes

- `js/config.js` and the legacy single-file build are **gitignored**; keys exist only on your machine and (at deploy time) in Vercel's encrypted environment variables.
- The app is fully client-side, so API keys are visible in the browser by design — treat them as rate-limit quotas, not secrets, and rotate via the env var if one leaks.
- No analytics, no tracking, no user data leaves the browser except anonymous AI prompts.

---

*Built as a guided-admissions workspace: questionnaire → research → weighted decision → career map → essay feedback, all in one animated, offline-persistent dashboard.*
