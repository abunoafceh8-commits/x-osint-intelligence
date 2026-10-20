/* AbuNawaf hardened — © 2026 أبو نواف · MIT */
const __RL = new Map();
function __rate(req, res, max = 90, win = 60_000) {
  try {
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || (req.socket && req.socket.remoteAddress) || 'x';
    const key = ip + ':' + (req.url || '');
    const now = Date.now();
    const b = __RL.get(key);
    if (!b || now > b.r) { __RL.set(key, { n: 1, r: now + win }); if (__RL.size > 4000) __RL.clear(); return true; }
    b.n++;
    if (b.n > max) { res.setHeader('Retry-After', String(Math.ceil((b.r - now) / 1000))); res.status(429).json({ error: 'rate_limited', message: 'تم تجاوز الحد المسموح — أعد المحاولة بعد قليل' }); return false; }
    return true;
  } catch { return true; }
}
const __origin = (req) => {
  const o = req.headers.origin || '';
  if (!o) return '*';
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o)) return o;
  if (/^https?:\/\/[a-z0-9-]+\.(vercel|arcada)\.app$/.test(o)) return o;
  try { if (o === 'https://' + req.headers.host) return o; } catch {}
  return 'null';
};

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export default async function handler(req, res) {
  __ABUNAWAF_HARDENED__: if (!__rate(req, res)) return;
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { username } = body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  const cleanUser = username.replace('@', '').trim();

  try {
    const PLATFORMS = [
      { name: 'X (Twitter)', url: `https://x.com/${cleanUser}`, check: (s) => s === 200 },
      { name: 'Instagram', url: `https://www.instagram.com/${cleanUser}/`, check: (s, t) => s === 200 && !t.includes('Sorry') },
      { name: 'TikTok', url: `https://www.tiktok.com/@${cleanUser}`, check: (s) => s === 200 },
      { name: 'YouTube', url: `https://www.youtube.com/@${cleanUser}`, check: (s, t) => s === 200 && t.includes('channel') },
      { name: 'GitHub', url: `https://github.com/${cleanUser}`, check: (s) => s === 200 },
      { name: 'Reddit', url: `https://www.reddit.com/user/${cleanUser}/about.json`, check: (s) => s === 200 },
      { name: 'LinkedIn', url: `https://www.linkedin.com/in/${cleanUser}/`, check: (s, t) => s === 200 },
      { name: 'Facebook', url: `https://www.facebook.com/${cleanUser}`, check: (s) => s === 200 },
      { name: 'Threads', url: `https://www.threads.net/@${cleanUser}`, check: (s) => s === 200 },
      { name: 'Telegram', url: `https://t.me/${cleanUser}`, check: (s, t) => s === 200 && !t.includes('you can contact') },
      { name: 'Twitch', url: `https://www.twitch.tv/${cleanUser}`, check: (s, t) => s === 200 && !t.includes('Sorry') },
      { name: 'Pinterest', url: `https://www.pinterest.com/${cleanUser}/`, check: (s) => s === 200 },
      { name: 'Medium', url: `https://medium.com/@${cleanUser}`, check: (s) => s === 200 },
      { name: 'SoundCloud', url: `https://soundcloud.com/${cleanUser}`, check: (s) => s === 200 },
      { name: 'Steam', url: `https://steamcommunity.com/id/${cleanUser}`, check: (s, t) => s === 200 && !t.includes('could not be found') },
      { name: 'Spotify', url: `https://open.spotify.com/user/${cleanUser}`, check: (s) => s === 200 },
      { name: 'Kick', url: `https://kick.com/${cleanUser}`, check: (s) => s === 200 },
      { name: 'Mastodon', url: `https://mastodon.social/@${cleanUser}`, check: (s) => s === 200 },
    ];

    const results = await Promise.all(
      PLATFORMS.map(async p => {
        try {
          const r = await fetch(p.url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000), redirect: 'follow' });
          const text = await r.text().catch(() => '');
          return { platform: p.name, found: p.check(r.status, text), url: p.url };
        } catch {
          return { platform: p.name, found: false, url: p.url, error: true };
        }
      })
    );

    res.setHeader('Access-Control-Allow-Origin', __origin(req)); res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.json({
      username: cleanUser,
      accounts: results,
      foundCount: results.filter(r => r.found).length,
      totalChecked: results.length,
      exposureScore: Math.min(100, results.filter(r => r.found).length * 5)
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
