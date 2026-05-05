'use strict';
const fs = require('fs');
const path = 'C:/Users/bdademo/.qclaw/workspace/decision-models-app/api/decide.js';
let c = fs.readFileSync(path, 'utf8');

// Find the webSearch function by its marker comment
const marker = '// ─── Web Search (free, no API key) ────────────────────────────────────────────';
const markerIdx = c.indexOf(marker);
if (markerIdx === -1) { console.log('Marker not found'); process.exit(1); }

const nextFnMarker = '// Detect if scenario likely needs current/recent info';
const nextFnIdx = c.indexOf(nextFnMarker);
if (nextFnIdx === -1) { console.log('nextFnMarker not found'); process.exit(1); }

// Build new webSearch using string concatenation to avoid regex issues
const newFn = [
'// ─── Web Search (free, no API key) ────────────────────────────────────────────',
'async function webSearch(query) {',
'  const fetch = require(\'node-fetch\');',
'  const enc = encodeURIComponent(query);',
'',
'  // Try Bing first (most reliable), then DuckDuckGo',
'  const engines = [',
'    { name: \'Bing\', url: \'https://www.bing.com/search?q=\' + enc },',
'    { name: \'DuckDuckGo\', url: \'https://duckduckgo.com/html/?q=\' + enc }',
'  ];',
'',
'  for (const eng of engines) {',
'    try {',
'      console.log(\'[WebSearch] Trying\', eng.name, \'...\');',
'      const resp = await fetch(eng.url, {',
'        headers: { \'User-Agent\': \'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36\' }',
'      });',
'      const html = await resp.text();',
'      console.log(\'[WebSearch]\', eng.name, \'->\', html.length, \'chars\');',
'',
'      let results = [];',
'      if (eng.name === \'Bing\') {',
'        // Parse Bing h3 result titles',
'        const h3s = html.match(\/<h3[^>]*>[\\s\\S]*?<\/h3>\/g) || [];',
'        for (const h3 of h3s.slice(0, 8)) {',
'          const titleMatch = h3.match(\/>([^<]+)<\/a>\/);',
'          if (titleMatch) {',
'            const title = titleMatch[1].replace(\/<[^>]+\>\/g, \'\').trim();',
'            if (title && title.length > 5) {',
'              results.push({ title: title.substring(0, 120), snippet: title.substring(0, 200) });',
'            }',
'          }',
'        }',
'        if (results.length > 0) {',
'          console.log(\'[WebSearch] Bing found\', results.length, \'results\');',
'          return results;',
'        }',
'      } else {',
'        // DuckDuckGo',
'        const titles = [...html.matchAll(\/<a class="result__a"[^>]*>([^<]+)<\/a>\/g)];',
'        const snips = [...html.matchAll(\/<a class="result__snippet"[^>]*>([\\s\\S]*?)<\/a>\/g)];',
'        for (let i = 0; i < Math.min(titles.length, 5); i++) {',
'          const t = titles[i][1].replace(\/<[^>]+\>\/g, \'\').trim();',
'          const s = snips[i] ? snips[i][1].replace(\/<[^>]+\>\/g, \'\').trim() : \'\';',
'          if (t && t.length > 5) results.push({ title: t.substring(0, 120), snippet: s.substring(0, 200) });',
'        }',
'        if (results.length > 0) {',
'          console.log(\'[WebSearch] DDG found\', results.length, \'results\');',
'          return results;',
'        }',
'      }',
'    } catch(e) {',
'      console.error(\'[WebSearch]\', eng.name, \'error:\', e.message);',
'    }',
'  }',
'  console.log(\'[WebSearch] All engines failed\');',
'  return [];',
'}'
].join('\n');

const before = c.substring(0, markerIdx);
const after = c.substring(nextFnIdx);
const newC = before + newFn + '\n\n' + after;

fs.writeFileSync(path, newC, 'utf8');
console.log('Done! webSearch replaced. Total chars:', newC.length);

// Verify syntax
try {
  require(path);
  console.log('Syntax OK!');
} catch(e) {
  console.log('Syntax error:', e.message);
}
