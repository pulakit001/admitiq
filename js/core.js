// Admit IQ — app state, persistent localStorage layer, shared helpers
// Every piece of user data survives reloads: profile, matches, research,
// comparisons, essays, chats, theme, key rotation state. Namespaced "aiq:"
// with a one-time fallback read from the legacy "aiq2." namespace.

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const lkey = s => String(s || '').trim().toLowerCase();

const LS = 'aiq:';
const LEGACY = 'aiq2.';
const store = {
  get(k, fb) {
    try {
      let v = localStorage.getItem(LS + k);
      if (v == null) { v = localStorage.getItem(LEGACY + k); if (v == null) return fb; }
      return JSON.parse(v);
    } catch { return fb; }
  },
  set(k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(LS + k); localStorage.removeItem(LEGACY + k); } catch {} }
};

const DEFAULT_CW = { feesLakh: 2, placementLPA: 3, scholarshipPct: 2, internshipPct: 2 };
const state = {
  profile: store.get('profile', null),
  recs: store.get('recs', null),
  recsError: null,
  quizMode: false,
  qi: 0,
  research: store.get('research', {}),
  cmpList: store.get('cmpList', []),
  measures: store.get('measures', [{ k: 'feesLakh', l: 'Annual fees' }, { k: 'placementLPA', l: 'Median placement' }, { k: 'scholarshipPct', l: 'Scholarship share' }, { k: 'internshipPct', l: 'Internship rate' }]),
  CW: store.get('CW', DEFAULT_CW),
  cmpStory: store.get('cmpStory', null),
  cmpError: null,
  cmpStage: 'setup',
  cmpCtx: store.get('cmpCtx', ''),
  hobbies: store.get('hobbies', []),
  career: store.get('career', null),
  careerError: null,
  aiCount: store.get('aiCount', 0),
  view: 'dash',
  insTab: 'resp',
  freshSession: true,
  essays: store.get('essays', []),
  lastEssay: store.get('lastEssay', null),
  essayError: null,
  chats: store.get('chats', []),
  theme: store.get('theme', 'light'),
  keyIdx: store.get('keyIdx', 0),
  lastActivity: store.get('lastActivity', null)
};

const PERSISTED = ['profile', 'recs', 'research', 'cmpList', 'measures', 'CW', 'cmpStory', 'cmpCtx', 'hobbies', 'career', 'aiCount', 'essays', 'lastEssay', 'chats', 'theme', 'keyIdx', 'lastActivity'];
function persist(k) { if (PERSISTED.includes(k)) store.set(k, state[k]); }

// Count one AI research run and remember which tool was last used.
function countAI() { state.aiCount++; persist('aiCount'); }
function recordActivity(tool) { state.lastActivity = { tool, at: Date.now() }; persist('lastActivity'); }

// Render a minimal, safe subset of markdown (bold, italics, code, bullets,
// numbered lists, headings, paragraphs) for the Ask Anything chat.
function mdToHtml(text) {
  const inline = s => esc(s)
    .replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/(^|[\s(])\*(?!\s)([^*\n]+?)\*(?=[\s).,;:!?]|$)/g, '$1<i>$2</i>')
    .replace(/(^|[^\\])`([^`]+?)`/g, '$1<code>$2</code>');
  const lines = String(text || '').split('\n');
  let out = '', list = null;
  const closeList = () => { if (list) { out += `</${list}>`; list = null; } };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { closeList(); continue; }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)/))) {
      closeList();
      const lvl = Math.min(m[1].length + 2, 5);
      out += `<h${lvl}>${inline(m[2])}</h${lvl}>`;
    } else if ((m = line.match(/^\s*[-•]\s+(.*)/))) {
      if (list !== 'ul') { closeList(); out += '<ul>'; list = 'ul'; }
      out += `<li>${inline(m[1])}</li>`;
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)/))) {
      if (list !== 'ol') { closeList(); out += '<ol>'; list = 'ol'; }
      out += `<li>${inline(m[1])}</li>`;
    } else { closeList(); out += `<p>${inline(line)}</p>`; }
  }
  closeList();
  return out;
}

/* ---------- shared render helpers ---------- */
const busy = {};
const V = $('#v');
const head = (a, t) => `<div class="crumb"><span>Workspaces</span><span>/</span><span>${a}</span></div><h1>${t}</h1>`;
const ld = m => `<div class="ld"><span class="spin"></span>${esc(m)}</div>`;
function say(m) { const t = $('#toast'); t.hidden = false; t.innerHTML = `${m}<button aria-label="Close">×</button>`; t.querySelector('button').onclick = () => t.hidden = true; }
function bindGo() { $$('#v [data-go]').forEach(b => b.onclick = () => show(b.dataset.go)); }
