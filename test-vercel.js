const https = require('https');
const url = 'https://decision-models-app.vercel.app/api/models';
https.get(url, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    try {
      const j = JSON.parse(d);
      console.log('Vercel models:', j.count);
    } catch(e) {
      console.log('Parse error, raw:', d.slice(0, 200));
    }
  });
}).on('error', e => console.log('Error:', e.message));