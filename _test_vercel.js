const https = require('https');
https.get('https://decision-models-app.vercel.app/api/models', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const r = JSON.parse(data);
    console.log('Status:', res.statusCode);
    console.log('Count:', r.count);
    r.models.slice(0, 5).forEach((m, i) => {
      console.log((i+1) + '. ' + m.name + ' | ' + m.englishName);
    });
  });
}).on('error', e => console.error(e));
