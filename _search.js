const https = require('https');

const token = process.argv[2] || 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';

const body = JSON.stringify({ page_size: 20 });
const options = {
  hostname: 'api.notion.com',
  path: '/v1/search',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const d = JSON.parse(data);
      if (d.object === 'error') {
        console.log('ERROR:', d.message, '| Code:', d.code);
      } else {
        console.log('Total results:', d.results?.length);
        for (const r of d.results || []) {
          let title = '(no title)';
          if (r.properties?.title?.title?.[0]?.plain_text) title = r.properties.title.title[0].plain_text;
          else if (r.properties?.Name?.title?.[0]?.plain_text) title = r.properties.Name.title[0].plain_text;
          console.log(' [' + r.object + ']', r.id, title.substring(0, 70));
        }
      }
    } catch(e) {
      console.log('Parse error:', e.message);
      console.log('Raw:', data.substring(0, 300));
    }
  });
});

req.on('error', e => console.log('Request error:', e.message));
req.setTimeout(15000, () => { console.log('TIMEOUT'); req.destroy(); });
req.write(body);
req.end();
