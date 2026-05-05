const fetch = require('node-fetch');
const req = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenario: 'Should I invest in Tesla?' }),
  timeout: 15000
};

fetch('https://decision-models-app.vercel.app/api/decide', req)
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(d => {
    console.log('Models:', d.models?.length || 0);
    console.log('Error:', d.error || 'none');
    if (d.models) d.models.forEach(m => console.log(' -', m.name, '|', m.category));
    process.exit(0);
  })
  .catch(e => {
    console.error('Failed:', e.message);
    process.exit(1);
  });

setTimeout(() => { console.log('Timeout reached'); process.exit(1); }, 20000);