const https = require('https');

const token = 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';

// Get all pages and databases in workspace
function searchAll() {
  return new Promise((resolve) => {
    const body = JSON.stringify({ page_size: 100 });
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
        try {
          const d = JSON.parse(data);
          if (d.object === 'error') { console.log('ERROR:', d.message); resolve([]); return; }
          resolve(d.results || []);
        } catch(e) { console.log('Parse error:', e.message); resolve([]); }
      });
    });
    req.on('error', e => { console.log('Request error:', e.message); resolve([]); });
    req.setTimeout(15000, () => { console.log('TIMEOUT'); req.destroy(); resolve([]); });
    req.write(body);
    req.end();
  });
}

// Query a database
function queryDatabase(dbId) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ page_size: 100 });
    const options = {
      hostname: 'api.notion.com',
      path: '/v1/databases/' + dbId + '/query',
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
        try {
          const d = JSON.parse(data);
          if (d.object === 'error') { console.log('DB ERROR:', d.message); resolve({ error: d.message, results: [] }); return; }
          resolve(d);
        } catch(e) { console.log('Parse error:', e.message); resolve({ results: [] }); }
      });
    });
    req.on('error', e => { console.log('Request error:', e.message); resolve({ results: [] }); });
    req.setTimeout(15000, () => { console.log('TIMEOUT'); req.destroy(); resolve({ results: [] }); });
    req.write(body);
    req.end();
  });
}

// Get blocks of a page
function getBlocks(blockId) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.notion.com',
      path: '/v1/blocks/' + blockId + '/children?page_size=100',
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
        try {
          const d = JSON.parse(data);
          if (d.object === 'error') { resolve([]); return; }
          resolve(d.results || []);
        } catch(e) { resolve([]); }
      });
    });
    req.on('error', e => resolve([]));
    req.setTimeout(15000, () => { req.destroy(); resolve([]); });
    req.end();
  });
}

function getTitleFromProps(props) {
  if (props?.title?.title?.[0]?.plain_text) return props.title.title[0].plain_text;
  if (props?.Name?.title?.[0]?.plain_text) return props.Name.title[0].plain_text;
  return '(no title)';
}

async function main() {
  console.log('=== Full workspace scan ===\n');
  const all = await searchAll();
  console.log('Total items:', all.length);

  let databases = [];
  let pages = [];

  for (const r of all) {
    const title = r.object === 'database' ? getTitleFromProps(r.properties) : getTitleFromProps(r.properties);
    if (r.object === 'database') {
      databases.push({ id: r.id, title });
    } else {
      pages.push({ id: r.id, title });
    }
  }

  console.log('\n--- DATABASES ---');
  for (const d of databases) console.log('DB:', d.id, d.title);

  console.log('\n--- PAGES (top 30) ---');
  for (const p of pages.slice(0, 30)) console.log('PG:', p.id, p.title);

  // Try querying each database
  console.log('\n--- DATABASE CONTENTS ---');
  for (const db of databases) {
    const result = await queryDatabase(db.id);
    if (result.error) {
      console.log('DB "' + db.title + '" (' + db.id + '): ERROR - ' + result.error);
    } else {
      console.log('DB "' + db.title + '" (' + db.id + '): ' + result.results.length + ' items');
      for (const item of result.results.slice(0, 3)) {
        const name = getTitleFromProps(item.properties);
        console.log('  -', name);
      }
      if (result.results.length > 3) console.log('  ... and', result.results.length - 3, 'more');
    }
  }
}

main();