export default async function handler(req, res) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { username } = body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  const cleanUser = username.replace('@', '').trim();

  try {
    const tweets = [];
    const sources = [`twitter.com/${cleanUser}/status/*`, `x.com/${cleanUser}/status/*`];
    for (const src of sources) {
      try {
        const r = await fetch(`https://web.archive.org/cdx/search/cdx?url=${src}&output=json&limit=500&fl=timestamp,original,statuscode&collapse=urlkey`, { signal: AbortSignal.timeout(15000) });
        const data = await r.json();
        const [, ...rows] = data;
        rows.forEach(row => {
          if (row[2] === '200') {
            const tweetId = row[1].match(/\/status\/(\d+)/)?.[1];
            if (tweetId && !tweets.find(t => t.id === tweetId)) {
              tweets.push({ id: tweetId, url: row[1], archiveUrl: `https://web.archive.org/web/${row[0]}/${row[1]}`, date: `${row[0].slice(0,4)}-${row[0].slice(4,6)}-${row[0].slice(6,8)}` });
            }
          }
        });
      } catch {}
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.json({ username: cleanUser, tweets, total: tweets.length });
  } catch (e) {
    return res.status(500).json({ error: e.message, tweets: [] });
  }
}
