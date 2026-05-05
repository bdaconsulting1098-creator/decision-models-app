const fs = require('fs');
const path = 'C:/Users/bdademo/.qclaw/workspace/decision-models-app/api/decide.js';
let c = fs.readFileSync(path, 'utf8');

const oldFn = `// ─── Web Search (free, no API key) ────────────────────────────────────────────
async function webSearch(query) {
  const fetch = require('node-fetch');
  try {
    const url = \`https://duckduckgo.com/html/?q=\${encodeURIComponent(query)}&kl=us-en\`;
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await resp.text();

    const results = [];
    // Extract result titles and snippets from DuckDuckGo HTML
    const titleMatches = [...html.matchAll(/<a class="result__a"[^>]*>([^<]+)<\/a>/g)];
    const snippetMatches = [...html.matchAll(/<a class="result__snippet"[^>]*>([^<]+)<\/a>/g)];

    for (let i = 0; i < Math.min(titleMatches.length, 5); i++) {
      results.push({
        title: titleMatches[i][1].replace(/<[^>]+>/g, '').trim(),
        snippet: snippetMatches[i]
          ? snippetMatches[i][1].replace(/<[^>]+>/g, '').trim()
          : ''
      });
    }
    return results;
  } catch (e) {
    console.error('Web search failed:', e.message);
    return [];
  }
}`;

const newFn = `// ─── Web Search (free, no API key) ────────────────────────────────────────────
async function webSearch(query) {
  const fetch = require('node-fetch');
  const enc = encodeURIComponent(query);

  // Try Bing first (most reliable), then DuckDuckGo
  const engines = [
    { name: 'Bing', url: 'https://www.bing.com/search?q=' + enc },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/html/?q=' + enc }
  ];

  for (const eng of engines) {
    try {
      console.log('[WebSearch] Trying', eng.name, '...');
      const resp = await fetch(eng.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36' }
      });
      const html = await resp.text();
      console.log('[WebSearch]', eng.name, '→', html.length, 'chars');

      let results = [];
      if (eng.name === 'Bing') {
        // Parse Bing organic results
        const h2s = html.match(/<h2[^>]*>[\s\S]*?<\/h2>/g) || [];
        for (const h2 of h2s.slice(0, 6)) {
          const aMatch = h2.match(/href="([^"]+)"/);
          const titleMatch = h2.match(/>([^<]+)<\/a>/);
          if (titleMatch) {
            const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
            if (title && title.length > 5) {
              results.push({ title: title.substring(0, 120), snippet: title.substring(0, 200) });
            }
          }
        }
        if (results.length > 0) {
          console.log('[WebSearch] Bing found', results.length, 'results');
          return results;
        }
      } else {
        // DuckDuckGo
        const titles = [...html.matchAll(/<a class="result__a"[^>]*>([^<]+)<\/a>/g)];
        const snips = [...html.matchAll(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)];
        for (let i = 0; i < Math.min(titles.length, 5); i++) {
          const t = titles[i][1].replace(/<[^>]+>/g, '').trim();
          const s = snips[i] ? snips[i][1].replace(/<[^>]+>/g, '').trim() : '';
          if (t && t.length > 5) results.push({ title: t.substring(0, 120), snippet: s.substring(0, 200) });
        }
        if (results.length > 0) {
          console.log('[WebSearch] DDG found', results.length, 'results');
          return results;
        }
      }
    } catch(e) {
      console.error('[WebSearch]', eng.name, 'error:', e.message);
    }
  }
  console.log('[WebSearch] All engines failed');
  return [];
}`;

if (!c.includes(oldFn)) {
  console.log('ERROR: Could not find the old webSearch function block.');
  console.log('Looking for oldFn start:', c.includes('async function webSearch') ? 'found' : 'NOT FOUND');
  process.exit(1);
}

const newC = c.replace(oldFn, newFn);
fs.writeFileSync(path, newC, 'utf8');
console.log('Done! Replaced webSearch. New version includes Bing + DDG fallback.');
