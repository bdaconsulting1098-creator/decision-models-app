const https = require('https');

const token = process.argv[2] || 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';
const pageId = process.argv[3] || '350157c6-daef-80cf-9e50-eb644e3a885e';

const options = {
  hostname: 'api.notion.com',
  path: '/v1/pages/' + pageId,
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Notion-Version': '2022-06-28'
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
        console.log('ERROR:', d.message);
      } else {
        // Extract title
        let title = '';
        if (d.properties?.title?.title?.[0]?.plain_text) title = d.properties.title.title[0].plain_text;
        else if (d.properties?.Name?.title?.[0]?.plain_text) title = d.properties.Name.title[0].plain_text;
        console.log('Title:', title);
        console.log('Object:', d.object);
        console.log('Parent type:', d.parent?.type);
        console.log('Parent ID:', d.parent?.[d.parent?.type]);
        // Check children
        if (d.children) console.log('Children count:', d.children.length);
        console.log('Has children:', d.has_children);
      }
    } catch(e) {
      console.log('Parse error:', e.message);
      console.log('Raw:', data.substring(0, 500));
    }
  });
});

req.on('error', e => console.log('Request error:', e.message));
req.setTimeout(15000, () => { console.log('TIMEOUT'); req.destroy(); });
req.end();
