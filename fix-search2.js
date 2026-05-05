const fs = require('fs');
const path = 'C:/Users/bdademo/.qclaw/workspace/decision-models-app/api/decide.js';
let c = fs.readFileSync(path, 'utf8');

// Find the webSearch function by its comment line and replace it
const marker = '// ─── Web Search (free, no API key) ────────────────────────────────────────────';
const markerIdx = c.indexOf(marker);
if (markerIdx === -1) { console.log('Marker not found'); process.exit(1); }

// Find the start of the function (skip the comment line)
let fnStart = markerIdx;
// Find the next function definition after webSearch (needsWebSearch)
const nextFnMarker = '// Detect if scenario likely needs current/recent info';
const nextFnIdx = c.indexOf(nextFnMarker);
if (nextFnIdx === -1) { console.log('nextFnMarker not found'); process.exit(1); }

console.log('webSearch block: lines', c.substring(0, markerIdx).split('\n').length, 'to', c.substring(0, nextFnIdx).split('\n').length);

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
        // Parse Bing organic results - look for h3 with result titles
        const h3s = html.match(/<h3[^>]*class="[^"]*result[^"]*"[^>]*>[\s\S]*?<\/h3>/g) || [];
        for (const h3 of h3s.slice(0, 6)) {
          const aMatch = h3.match(/href="([^"]+)"/);
          const titleMatch = h3.match(/>([^<]+)<\/a>/);
          if (titleMatch) {
            const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
            if (title && title.length > 5) {
              results.push({ title: title.substring(0, 120), snippet: title.substring(0, 200) });
            }
          }
        }
        // Also try h2 pattern
        if (results.length === 0) {
          const h2s = html.match(/<h2[^>]*>[\s\S]*?<\/h2>/g) || [];
          for (const h2 of h2s.slice(0, 6)) {
            const titleMatch = h2.match(/>([^<]+)<\/a>/);
            if (titleMatch) {
              const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
              if (title && title.length > 5) {
                results.push({ title: title.substring(0, 120), snippet: title.substring(0, 200) });
              }
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
}
`;

const before = c.substring(0, markerIdx);
const after = c.substring(nextFnIdx);
const newC = before + newFn + '\n\n' + after;

fs.writeFileSync(path, newC, 'utf8');
console.log('Done! webSearch replaced. Total chars:', newC.length);
