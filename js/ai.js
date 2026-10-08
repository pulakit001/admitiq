// Admit IQ — Gemini AI layer with 3-key failover
// Strategy: the PRIMARY key (js/config.js index 0) is always tried first.
// If a key's free quota is exhausted (HTTP 429) or it is rejected (403),
// the app permanently advances to the next key in the chain and persists
// that choice in localStorage, so every later call starts on the healthy key.
// The same model chain runs on whichever key is active.

const MODELS = ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest'];

function keyChain() {
  const k = (window.ADMIQ_KEYS || []).filter(x => typeof x === 'string' && x.length > 20 && !x.startsWith('PASTE_'));
  return k.length ? k : [null];
}

function markKeyExhausted() {
  state.keyIdx = (state.keyIdx + 1) % Math.max(keyChain().length, 1);
  persist('keyIdx');
}

function activeKey() {
  const chain = keyChain();
  return chain[state.keyIdx % chain.length] ?? null;
}

function jparse(t) {
  try { return JSON.parse(t); } catch (e) {
    const m = String(t || '').match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    try { return m ? JSON.parse(m[0]) : null; } catch (e2) { return null; }
  }
}

const SYSDEF = 'You are the engine inside Admit IQ, a college and career planner for Indian students. Be factual, concrete and current. When the question needs facts about real institutions, salaries or exams, use your most current knowledge and say how confident you are. Never invent named institutions. Return ONLY valid JSON when asked, no markdown fences, plain numbers without units.';
const CHATSYS = 'You are Admit IQ\u2019s friendly counsellor chatting with an Indian student. ALWAYS answer in warm, natural, readable English prose. NEVER output raw JSON, code fences, or key-value dumps — present structured information as short paragraphs and simple dash bullets. Use **bold** for key names and numbers. Explain jargon in plain words and give complete, specific answers. Keep answers under about 200 words unless the student asks for more. Name real institutions, exams and realistic numbers when you know them, and say plainly when you are unsure.';

async function callGemini(key, model, body) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    + (key ? `?key=${encodeURIComponent(key)}` : '');
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) {
    const e = new Error('HTTP ' + r.status);
    e.status = r.status;
    throw e;
  }
  const d = await r.json();
  const c = (d.candidates || [])[0];
  const t = ((c && c.content && c.content.parts) || []).map(p => p.text || '').join('').trim();
  if (!t) throw new Error('empty response');
  return t;
}

// aiAsk(q, opts) -> {text, live, keyIdx}
// opts: {grounded, json, temp, max, sys}
async function aiAsk(q, { grounded = true, json = false, temp = .5, max = 2048, sys = null } = {}) {
  const mkBody = tool => {
    const b = {
      systemInstruction: { parts: [{ text: sys || SYSDEF }] },
      contents: [{ role: 'user', parts: [{ text: q }] }],
      generationConfig: Object.assign({ temperature: temp, maxOutputTokens: max }, json ? { responseMimeType: 'application/json' } : {})
    };
    if (tool) b.tools = [{ google_search: {} }];
    return b;
  };
  const chain = keyChain();
  // Model variants in priority order; grounding tried first when allowed.
  const variants = grounded
    ? [[MODELS[0], true], [MODELS[0], false], [MODELS[1], false]]
    : [[MODELS[0], false], [MODELS[1], false]];
  let err = null;
  // Try every key in the chain, starting at the persisted active key and
  // wrapping around once, so a single call can use all available keys.
  for (let i = 0; i < chain.length; i++) {
    const idx = (state.keyIdx + i) % chain.length;
    const key = chain[idx];
    for (const [model, tool] of variants) {
      try {
        const t = await callGemini(key, model, mkBody(tool));
        if (idx !== state.keyIdx) { state.keyIdx = idx; persist('keyIdx'); }
        countAI();
        return { text: t, live: tool, keyIdx: idx };
      } catch (e) {
        err = e;
        if (e.status === 429 && tool) {
          // Grounding quota is separately limited — retry ungrounded on the
          // SAME key before considering the key exhausted.
          continue;
        }
        if (e.status === 429 || e.status === 403) {
          // Quota exhausted or key rejected — fail over to the next key
          // permanently and skip the remaining model variants on this key.
          markKeyExhausted();
          break;
        }
      }
    }
  }
  throw err || new Error('AI unreachable');
}

async function aiJSON(prompt, opt = {}) {
  for (let i = 0; i < 2; i++) {
    const r = await aiAsk(prompt, Object.assign({ json: true }, opt));
    const d = jparse(r.text);
    if (d) return Object.assign({ src: r.src || [], live: r.live }, Array.isArray(d) ? { list: d } : { data: d });
  }
  throw new Error('The AI reply was not valid data. Try again.');
}
