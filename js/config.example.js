// Admit IQ — API keys configuration
// This file holds your Gemini API keys. It is GITIGNORED so keys never reach GitHub.
// On Vercel, set an environment variable GEMINI_API_KEYS="key1,key2,key3" and the
// build step (scripts/build.js) regenerates this file for you at deploy time.
//
// Failover order: the first key is always tried first; if its free quota runs out
// (HTTP 429/403), the app automatically shifts to the next key, then the next.
window.ADMIQ_KEYS = [
  'PASTE_YOUR_PRIMARY_GEMINI_KEY_HERE',
  'PASTE_YOUR_BACKUP_KEY_1_HERE',
  'PASTE_YOUR_BACKUP_KEY_2_HERE'
];
