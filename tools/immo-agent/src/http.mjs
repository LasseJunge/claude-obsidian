// Polite HTTP client built on Node's global fetch. Per-host throttling + timeout.
const lastHit = new Map();

function hostOf(url) {
  try { return new URL(url).host; } catch { return url; }
}

export class Http {
  constructor(cfg) {
    const h = cfg.http || {};
    this.delay = (h.delay_seconds ?? 2) * 1000;
    this.timeout = (h.timeout_seconds ?? 30) * 1000;
    this.ua = h.user_agent || "immo-agent/1.0";
  }

  async #throttle(url) {
    const host = hostOf(url);
    const wait = this.delay - (Date.now() - (lastHit.get(host) || 0));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastHit.set(host, Date.now());
  }

  async request(url, opts = {}) {
    await this.#throttle(url);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), this.timeout);
    try {
      const res = await fetch(url, {
        ...opts,
        signal: ctrl.signal,
        headers: {
          "User-Agent": this.ua,
          "Accept-Language": "de-DE,de;q=0.9",
          ...(opts.headers || {}),
        },
      });
      if (!res.ok) {
        console.warn(`  ! ${res.status} ${url}`);
        return null;
      }
      return res;
    } catch (e) {
      console.warn(`  ! fetch failed ${url}: ${e.message}`);
      return null;
    } finally {
      clearTimeout(t);
    }
  }

  // encoding: pass "latin1" for ISO-8859-1 sites (e.g. zvg-portal/justiz.de).
  async getText(url, opts = {}) {
    const { encoding, ...rest } = opts;
    const r = await this.request(url, rest);
    if (!r) return null;
    if (!encoding || encoding === "utf-8") return r.text();
    return new TextDecoder(encoding).decode(await r.arrayBuffer());
  }

  async getJson(url, opts) {
    const r = await this.request(url, opts);
    if (!r) return null;
    try { return await r.json(); } catch { return null; }
  }

  async postText(url, body, opts = {}) {
    const { encoding, headers, ...rest } = opts;
    return this.getText(url, {
      method: "POST",
      body: new URLSearchParams(body).toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded", ...(headers || {}) },
      encoding,
      ...rest,
    });
  }
}
