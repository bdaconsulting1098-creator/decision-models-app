const fetch = require('node-fetch');

fetch('https://decision-models-app.vercel.app/api/models')
  .then(r => r.json())
  .then(d => {
    console.log('Total models from /api/models:', d.count || d.models?.length || 0);
    const kahneman = (d.models||[]).filter(m => m.source === 'kahneman');
    const munger = (d.models||[]).filter(m => m.source === 'munger');
    console.log('  Kahneman:', kahneman.length, '| Munger:', munger.length);
    if (d.error) console.log('Error:', d.error);
    process.exit(0);
  })
  .catch(e => { console.error(e.message); process.exit(1); });

setTimeout(() => { console.log('Timeout'); process.exit(1); }, 20000);