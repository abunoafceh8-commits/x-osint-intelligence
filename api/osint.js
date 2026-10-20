const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export default async function handler(req, res) {
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

    res.setHeader('Access-Control-Allow-Origin', '*');
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
