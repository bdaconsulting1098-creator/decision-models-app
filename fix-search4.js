'use strict';
const fs = require('fs');
const path = 'C:/Users/bdademo/.qclaw/workspace/decision-models-app/api/decide.js';
let c = fs.readFileSync(path, 'utf8');

const marker = '// ─── Web Search (free, no API key) ────────────────────────────────────────────';
const markerIdx = c.indexOf(marker);
if (markerIdx === -1) { console.log('Marker not found'); process.exit(1); }

const nextFnMarker = '// Detect if scenario likely needs current/recent info';
const nextFnIdx = c.indexOf(nextFnMarker);
if (nextFnIdx === -1) { console.log('nextFnMarker not found'); process.exit(1); }

// Build new webSearch using string concatenation
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
'        // Parse Bing: split by </h3> and extract link text',
'        const parts = html.split(\'</h3>\');',
'        for (const part of parts.slice(0, 12)) {',
'          const aIdx = part.lastIndexOf(\'<a \');',
'          if (aIdx !== -1) {',
'            const chunk = part.substring(aIdx);',
'            const endIdx = chunk.indexOf(\'</a>\');',
'            if (endIdx > 0) {',
'              const linkText = chunk.substring(0, endIdx).replace(/<[^>]+>/g, \'\').trim();',
'              if (linkText && linkText.length > 5 && !linkText.includes(\'http\') && !linkText.startsWith(\'<\')) {',
'                results.push({ title: linkText.substring(0, 120), snippet: linkText.substring(0, 200) });',
'              }',
'            }',
'          }',
'        }',
'        if (results.length > 0) {',
'          console.log(\'[WebSearch] Bing found\', results.length, \'results\');',
'          return results.slice(0, 5);',
'        }',
'      } else {',
'        // DuckDuckGo: use string search instead of regex',
'        const ddgTitles = [];',
'        let pos = 0;',
'        while (pos < html.length) {',
'          const tIdx = html.indexOf(\'result__a\', pos);',
'          if (tIdx === -1) break;',
'          const gtIdx = html.indexOf(\'>\', tIdx + 10);',
'          const ltIdx = html.indexOf(\'<\', gtIdx);',
'          if (gtIdx !== -1 && ltIdx !== -1) {',
'            const t = html.substring(gtIdx + 1, ltIdx).trim();',
'            if (t && t.length > 5) ddgTitles.push(t);',
'          }',
'          pos = ltIdx + 1;',
'          if (ddgTitles.length >= 5) break;',
'        }',
'        if (ddgTitles.length > 0) {',
'          console.log(\'[WebSearch] DDG found\', ddgTitles.length, \'results\');',
'          return ddgTitles.map(t => ({ title: t.substring(0, 120), snippet: t.substring(0, 200) }));',
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
console.log('Done! Total chars:', newC.length);

// Verify syntax
try {
  require(path);
  console.log('Syntax OK!');
} catch(e) {
  console.log('Syntax error:', e.message.split('\n')[0]);
}
