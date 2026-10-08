// Admit IQ — Vercel build step
// Injects the GEMINI_API_KEYS environment variable (comma-separated) into
// js/config.js so the deployed app has the same 3-key failover chain as local
// development. Keys never appear in the repository — only in Vercel env vars.
const fs = require('fs');
const path = require('path');

const keys = (process.env.GEMINI_API_KEYS || '')
  .split(',').map(s => s.trim()).filter(Boolean);

const target = path.join(__dirname, '..', 'js', 'config.js');

if (keys.length) {
  const body = keys.map(k => `  '${k.replace(/'/g, "\\'")}'`).join(',\n');
  fs.writeFileSync(target,
    `// Auto-generated at deploy time from the GEMINI_API_KEYS environment variable.\n// Do not commit real keys — this file is gitignored.\nwindow.ADMIQ_KEYS = [\n${body}\n];\n`);
  console.log(`[build] injected ${keys.length} API key(s) into js/config.js`);
} else if (!fs.existsSync(target)) {
  // No env var and no local config: write a placeholder so the app still loads
  // (the AI layer reports "AI unreachable" instead of crashing).
  fs.writeFileSync(target, 'window.ADMIQ_KEYS = [];\n');
  console.warn('[build] no GEMINI_API_KEYS env var found — wrote empty key chain');
} else {
  console.log('[build] using existing js/config.js (local development keys)');
}
