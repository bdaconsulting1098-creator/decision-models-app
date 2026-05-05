const https = require('https');

const token = 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';
const pageId = '350157c6-daef-80cf-9e50-eb644e3a885e';

function getBlockChildren(blockId, depth = 0) {
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
          if (d.object === 'error') {
            console.log('  '.repeat(depth) + 'ERROR:', d.message);
            resolve([]);
            return;
          }
          const blocks = d.results || [];
          console.log('  '.repeat(depth) + 'Block count:', blocks.length, '| has_more:', d.has_more);
          for (const b of blocks) {
            const indent = '  '.repeat(depth);
            if (b.type === 'child_page') {
              console.log(indent + '[child_page]', b.id, b.child_page?.title || '');
            } else if (b.type === 'heading_1') {
              console.log(indent + '[h1]', b.heading_1?.rich_text?.map(r=>r.plain_text).join(''));
            } else if (b.type === 'heading_2') {
              console.log(indent + '[h2]', b.heading_2?.rich_text?.map(r=>r.plain_text).join(''));
            } else if (b.type === 'heading_3') {
              console.log(indent + '[h3]', b.heading_3?.rich_text?.map(r=>r.plain_text).join(''));
            } else if (b.type === 'paragraph') {
              const txt = b.paragraph?.rich_text?.map(r=>r.plain_text).join('');
              if (txt) console.log(indent + '[p]', txt.substring(0, 80));
            } else if (b.type === 'bulleted_list_item') {
              console.log(indent + '[bullet]', b.bulleted_list_item?.rich_text?.map(r=>r.plain_text).join('').substring(0, 80));
            } else if (b.type === 'numbered_list_item') {
              console.log(indent + '[numbered]', b.numbered_list_item?.rich_text?.map(r=>r.plain_text).join('').substring(0, 80));
            } else if (b.type === 'to_do') {
              const done = b.to_do?.checked ? '☑' : '☐';
              console.log(indent + '[todo ' + done + ']', b.to_do?.rich_text?.map(r=>r.plain_text).join('').substring(0, 80));
            } else if (b.type === 'embed' || b.type === 'link_preview') {
              console.log(indent + '[' + b.type + ']', b[b.type]?.url || '');
            } else {
              console.log(indent + '[' + b.type + ']');
            }
          }
          resolve(blocks.filter(b => b.has_children && (b.type === 'child_page' || b.type === 'database')));
        } catch(e) {
          console.log('Parse error:', e.message);
          resolve([]);
        }
      });
    });
    req.on('error', e => { console.log('Request error:', e.message); resolve([]); });
    req.setTimeout(15000, () => { console.log('TIMEOUT'); req.destroy(); resolve([]); });
    req.end();
  });
}

async function main() {
  console.log('=== models page blocks ===');
  const children = await getBlockChildren(pageId, 0);
  console.log('\nChild pages/databases found:', children.length);
  for (const c of children) {
    console.log(' -', c.type, c.id, c.child_page?.title || '');
  }
}
main();
