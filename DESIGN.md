---
name: AdmitIQ
description: AI college admissions copilot — an OMR answer sheet on a dark desk
colors:
  desk: "#14120F"
  paper: "#F3EFE4"
  paper-shade: "#E9E2D1"
  ink: "#1A1A18"
  ink-soft: "#4A4740"
  rule-red: "#C22D1E"
  signal-blue: "#1A46D0"
  rule: "rgba(26,26,24,.24)"
  rule-soft: "rgba(26,26,24,.13)"
  scrollbar: "#3B362D"
  scrollbar-hover: "#5A5347"
  vignette-warm: "rgba(255,226,176,.10)"
  vignette-warm-strong: "rgba(255,226,176,.16)"
  shadow-sheet: "rgba(0,0,0,.9)"
  shadow-skip: "rgba(0,0,0,.95)"
  scan-highlight: "rgba(255,255,255,.5)"
  scan-highlight-strong: "rgba(255,255,255,.7)"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(2.7rem, 6vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.93
    letterSpacing: "-0.038em"
    fontVariation: "wdth 88"
  headline:
    fontFamily: "Archivo, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.75rem, 3.1vw, 2.7rem)"
    fontWeight: 800
    lineHeight: 1.03
    letterSpacing: "-0.03em"
    fontVariation: "wdth 90"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "DM Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.15em"
  hand:
    fontFamily: "Caveat, 'Bradley Hand', cursive"
    fontSize: "clamp(1.05rem, 1.7vw, 1.5rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "normal"
  lede:
    fontFamily: "Archivo, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.02rem, 1.35vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  callout:
    fontFamily: "Archivo, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.16rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  table:
    fontFamily: "Archivo, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  list-body:
    fontFamily: "Archivo, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  button-lg:
    fontFamily: "DM Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.13em"
  label-md:
    fontFamily: "DM Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.13em"
  label-sm:
    fontFamily: "DM Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.15em"
  wordmark:
    fontFamily: "Archivo, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.24rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.03em"
    fontVariation: "wdth 96"
  stamp:
    fontFamily: "Archivo, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.16em"
    fontVariation: "wdth 88"
  form-title:
    fontFamily: "Archivo, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(0.95rem, 1.5vw, 1.3rem)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.02em"
    fontVariation: "wdth 88"
rounded:
  none: "0"
  oval: "50%"
spacing:
  page-pad: "clamp(20px, 4vw, 52px)"
  sheet-gap: "26px"
  section-gap: "clamp(26px, 4vw, 46px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "13px 22px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.rule-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "13px 22px"
    typography: "{typography.label}"
  section-head:
    backgroundColor: "transparent"
    textColor: "{colors.rule-red}"
    rounded: "{rounded.none}"
    padding: "10px 0 9px"
    typography: "{typography.label}"
  bubble:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.oval}"
    width: "17px"
    height: "12.5px"
  next-card:
    backgroundColor: "rgba(26,70,208,.04)"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "20px 22px"
---

## Overview

One surface, two acts. An **opening animation** plays on load — a blank OMR answer
sheet prints itself, a marking wave writes the ADMITIQ wordmark into a 37-column
oval grid, a scan head reads it, the logo stamps, a hand writes "marked by
AdmitIQ", and the sheet is pulled up off the desk to reveal the landing page that
was underneath the whole time. The landing page is the durable surface: a dark
desk holding paper-white sheets with red form printing.

The world is **OMR answer sheet** (chosen in `.impeccable/decision-direction.json`
from seed `b0c93ac5`). Everything derives from that object: bubble grids, red form
rules, mono form codes, timing marks, scan readouts, a rubber stamp, pencil-mark
fills, paper grain. There is no logo asset yet — the wordmark and the two-oval
mark are generated in the browser (canvas dot-matrix type + inline SVG), which is
why they may be treated as the brand until a real asset exists.

Mode: **Persuade**. The whole page must earn attention without inventing proof —
no fabricated stats, testimonials, or pricing (see PRODUCT.md).

## Colors

| Token | Value | Role |
|---|---|---|
| `desk` | `#14120F` | Page background — the dark desk the paper sits on |
| `paper` | `#F3EFE4` | Sheet surface, text on ink, debris flecks |
| `paper-shade` | `#E9E2D1` | Second paper tone for stacked/secondary sheets |
| `ink` | `#1A1A18` | Primary text on paper, filled ovals, primary button |
| `ink-soft` | `#4A4740` | Secondary text on paper (lede, table cells, captions) |
| `rule-red` | `#C22D1E` | Form rules, section heads, form codes, hover accent |
| `signal-blue` | `#1A46D0` | Answers, "IQ" in the logotype, stamp, hand note, `.next` |
| `rule` | `rgba(26,26,24,.24)` | 1px separators on paper |
| `rule-soft` | `rgba(26,26,24,.13)` | Table row rules |

Red on paper measures 4.96:1 and blue on paper 7.4:1 — both clear AA at body
sizes, so red is safe for labels, not just decoration. **Never** reduce these
with `opacity` (a `.85` alpha on red drops to 4.03:1 and fails). Canvas-drawn
text uses the same hex values at full strength.

Depth on the desk comes from a fixed vignette on `body::before` (warm top glow,
deep falloff to the edges) plus a generated grain layer on `body::after` at
`mix-blend-mode:overlay`; paper repeats that grain at `multiply`/0.32. Selection
is blue on paper; focus is `2px currentColor` with `3px` offset.

## Typography

Three families, all self-hosted in `fonts/` (Google Fonts URLs are kept only as a
`src` fallback):

- **Archivo** variable (wght 400–900, wdth 62–125) — display and body. Condensed
  widths are used deliberately: `font-stretch:88%` on `h1`, `90%` on `h2`,
  `96%` on the compact type wordmark. Keep those settings; the type is tuned to
  them.
- **DM Mono** 400/500 — every uppercase, letterspaced label: form codes, section
  heads, table headers, instructions, buttons, footer. This is the "printed form"
  voice and it carries most of the personality.
- **Caveat** — handwritten margin notes only (`.hand`, `.hand-note`). One voice,
  used twice: the hero's promise and the splash's signature.

Scale: `h1` `clamp(2.7rem,6vw,6rem)` / 0.93; `h2` `clamp(1.75rem,3.1vw,2.7rem)` /
1.03; body 17px/1.6; labels 11px/0.15em; mono micro-labels 10px/0.14em (10px is
the hard floor — do not go smaller). Headings are `text-wrap:balance` with tight
negative tracking; body copy maxes at 60–68ch.

The splash logotype `ADMITIQ` is **not** a font: it is a 5×7 dot-matrix rendered
to canvas (37 columns, `I` and `Q` in blue, everything else graphite), so it can
be marked cell-by-cell. If you need the wordmark elsewhere, use the inline SVG
two-oval mark + `Admit`/`IQ` type lockup, not a system font approximation.

Row numbers on the splash grid are canvas-drawn and may compress to ~6.5px on
small viewports — they are texture there, not readable type (legible 7–11px on
desktop). The 10px floor applies to all DOM text, not to canvas renderings.

## Layout

- Page frame: `main` is `max-width:1200px`, centered, padded by
  `page-pad = clamp(20px,4vw,52px)`. Content lives in `.sheet-stack` — stacked
  `paper-sheet` blocks with `26px` gaps floating on the desk.
- Masthead is `sticky`, 64px, paper on ink text, closed by a 1.5px red rule.
- `.read-grid` is a two-column `1.5fr .95fr` document grid (table + `.next`
  card), collapsing to one column at ≤900px.
- The hero is asymmetric: headline (max 16ch) left, logotype canvas grid right,
  actions row under a red band rule.
- Splash sheet: fixed, `93vw × 88vh`, centered, red-bordered, with red timing
  marks (`#tmL`/`#tmR`) pinned inside the left/right edges, instructions strip
  top, bubble grid center, legend + form code footer.
- Responsive: ≤900px hides nav text links (the CTA button stays) and re-stacks
  grids; ≤640px converts the read table into stacked rows (labels kept by
  `thead` being hidden and `.item` staying inline) and hides the legend. Row
  numbers on the splash grid and the hand note shrink/reposition rather than
  disappear.
- Horizontal overflow is checked at 1440 and 390; the canvas grids re-layout on
  resize (debounced 160ms) and ignore detached/collapsed wrappers.

## Elevation & Depth

Flat by intention — this is printed paper, not cards. The only elevation:

1. `.paper-sheet`: `0 26px 60px -28px rgba(0,0,0,.9)` — the sheet lifting off the
   desk, plus a 1px white top highlight.
2. Vignette + grain overlays (above) do the atmospheric work.
3. The scan bar uses a **neutral** `0 7px 16px -9px rgba(26,26,24,.45)` shadow;
   colored glow shadows are banned (they read as generated UI).

No glows, no glass, no gradients on components.

## Shapes

**Square, except ovals.** Every box — buttons, cards, sheets, tables — has
`border-radius:0`. The only curves in the system are ellipses: `.bub` /
`.h1-oval` at `50%`, 17×12.5px, 1.5–2.5px stroke. That contrast *is* the identity
(paper form vs. pencil mark), so never round a corner to "soften" a component.

Rules are the other structural element: 1.5px ink for section ends, 1px
`rule-soft` for rows, 1.5px red for form headers, 2.5px red on the splash sheet
border. Borders are always literal hairlines — no dashed styles except where a
form would print them.

## Components

- **Primary button** (`.btn`): ink fill, paper text, mono label, square; hover
  turns red with a 2px lift on the shared ease
  `cubic-bezier(.16,1,.3,1)`. Small variant only changes padding/size. Nav
  context must not recolor it — nav links use `:not(.btn)`.
- **Ghost/inline link** (`.link-under`): mono uppercase with a 1.5px bottom rule
  that turns red on hover. Inline links keep ≥24px hit height.
- **Section head** (`.sec-head`): mono red, uppercase, flanked by a 1.5px red
  rule above and 1px rule below; optional right-side context in `ink-soft`.
- **`.next` card**: blue hairline border on 4% blue wash — the "what to do next"
  surface. It is the only tinted block on paper; do not tint anything else.
- **Bubbles** (`.bub`): outlined oval, fills `ink` in 300ms on `.on`; hover
  previews an unfilled oval at 16% ink. This is the core interaction metaphor —
  reveal by marking, never by fading in from nowhere.
- **Splash sheet** (`.paper-sheet` + timing marks + stamp + hand note): stamp is
  blue, rotated −6.5°, `mix-blend-mode:multiply`, lands with a single ease-out
  settle (`cubic-bezier(.22,1,.36,1)` — no elastic overshoot).
- **Exit debris** (`#fx`): 16 paper-colored flecks (every 7th blue) thrown upward
  as the sheet leaves; cleared after ~2.3s.

**Motion (splash timeline, ~4.2s total, all hand-tuned in JS):** ring 420–1180 ·
marking wave 880–2010 · erase 1580–2130 · scan 2050–2670 · stamp 2740 · hand note
2840 · jolt 3300 · sheet exit 3550 (+650ms handoff). Landing reveals are gated on
`html.intro-live` so the hero stagger and the hero canvas wave never play
underneath the covering sheet — the hero grid animates only once the sheet is
gone. Skip button, Escape, and a 9s failsafe all end the intro safely; focus is
constrained to the splash with `inert` on the header/main/footer and released
(with focus moved into `main`) on end; `prefers-reduced-motion` draws the final
frame, holds ~1s, fades, and zeroes all delays. Debug: `?t=NNNN` freezes the
timeline, `?nosplash=1` skips it (the 9s failsafe is suspended in freeze mode).

## Do's and Don'ts

- **Do** build hierarchy with hairline rules, mono labels, and paper-vs-desk
  contrast. **Don't** add cards, glows, rounded corners, or drop shadows beyond
  the sheet lift.
- **Do** keep red for structure and blue for answers/decisions. **Don't** use
  either as a large fill, and never lower their alpha on paper.
- **Do** let new sections be sheets in the stack with a `.sec-head` and real
  content. **Don't** invent metrics, testimonials, acceptance rates, or pricing —
  PRODUCT.md marks all proof as absent.
- **Do** mark, scan, stamp, or write things in. **Don't** fade/slide generic
  blocks in; every entrance should belong to the answer-sheet world, and every
  entrance must respect reduced motion.
- **Do** keep the 10px mono floor and the 60–68ch measure. **Don't** ship 8–9px
  microtype or full-width paragraphs.
- **Do** verify contrast with alpha compositing and after canvas rendering.
  **Don't** trust declared color alone — that is how the 4.03:1 label shipped in
  the first pass.
