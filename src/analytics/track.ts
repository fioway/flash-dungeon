// The ONLY place the game talks to analytics. Everything else calls track().
//
// Privacy defaults (see AGENTS.md):
//   - No personal data, no names/emails/location.
//   - A random per-page-load session ID, held in memory only.
//   - A persistent player ID (needed for day-1/day-7 retention) is OFF by
//     default. Flip ENABLE_PERSISTENT_ID only after updating the privacy
//     policy and deciding whether you need a consent prompt.

const ENABLE_PERSISTENT_ID = false as boolean;
const ENDPOINT = null as string | null; // set to your analytics ingest URL when you pick a tool

export type EventProps = Record<string, string | number | boolean>;

export interface TrackPayload {
  event: string;
  props: EventProps;
  build: string;
  sessionId: string;
  playerId: string | null;
  ts: number;
}

const sessionId: string =
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.random()).slice(2);

function getPersistentId(): string | null {
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

export function track(event: string, props: EventProps = {}): void {
  const payload: TrackPayload = {
    event,
    props,
    build: __BUILD_VERSION__,
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
      void fetch(ENDPOINT, { method: 'POST', body, keepalive: true });
    }
  } catch {
    // Analytics must never break the game.
  }
}
