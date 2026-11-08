// The ONLY place the game talks to analytics. Everything else calls track().
//
// Privacy defaults (see README):
//   - No personal data, no names/emails/location.
//   - A random per-page-load session ID, held in memory only.
//   - A persistent player ID (needed for day-1/day-7 retention) is OFF by
//     default. Flip ENABLE_PERSISTENT_ID only after updating the privacy
//     policy and deciding whether you need a consent prompt.

const ENABLE_PERSISTENT_ID = false;
const ENDPOINT = null; // set to your analytics ingest URL when you pick a tool
const BUILD_VERSION = '0.1.0';

const sessionId =
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.random()).slice(2);

function getPersistentId() {
  if (!ENABLE_PERSISTENT_ID) return null;
  try {
    let id = localStorage.getItem('pid');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('pid', id);
    }
    return id;
  } catch {
    // Storage can be blocked (e.g. inside some iframes). Fail quietly.
    return null;
  }
}

export function track(event, props = {}) {
  const payload = {
    event,
    props,
    build: BUILD_VERSION,
    sessionId,
    playerId: getPersistentId(),
    ts: Date.now(),
  };

  if (!ENDPOINT) {
    // No backend wired up yet: log locally so you can see what would be sent.
    console.debug('[track]', payload);
    return;
  }

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, body);
    } else {
      fetch(ENDPOINT, { method: 'POST', body, keepalive: true });
    }
  } catch {
    // Analytics must never break the game.
  }
}
