const https = require('https');

const token = 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';
const pageId = '350157c6-daef-8146-a836-e239419718cb';

function getBlockChildren(blockId) {
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
          if (d.object === 'error') { console.log('ERROR:', d.message); resolve([]); return; }
          resolve(d.results || []);
        } catch(e) { console.log('Parse error:', e.message); resolve([]); }
      });
    });
    req.on('error', e => { console.log('Request error:', e.message); resolve([]); });
    req.setTimeout(15000, () => { console.log('TIMEOUT'); req.destroy(); resolve([]); });
    req.end();
  });
}

async function main() {
  console.log('=== 芒格思维模型框架 page blocks ===');
  const blocks = await getBlockChildren(pageId);
  console.log('Total blocks:', blocks.length);
  let childPages = [];
  for (const b of blocks) {
    if (b.type === 'child_page') {
      console.log('[child_page]', b.id, b.child_page?.title || '');
      childPages.push(b);
    } else if (b.type === 'heading_1') {
      const txt = b.heading_1?.rich_text?.map(r=>r.plain_text).join('');
      console.log('[H1]', txt);
    } else if (b.type === 'heading_2') {
      const txt = b.heading_2?.rich_text?.map(r=>r.plain_text).join('');
      console.log('[H2]', txt);
    } else if (b.type === 'heading_3') {
      const txt = b.heading_3?.rich_text?.map(r=>r.plain_text).join('');
      console.log('[H3]', txt);
    } else if (b.type === 'paragraph') {
      const txt = b.paragraph?.rich_text?.map(r=>r.plain_text).join('');
      if (txt && txt.trim()) console.log('[p]', txt.substring(0, 100));
    } else if (b.type === 'bulleted_list_item') {
      const txt = b.bulleted_list_item?.rich_text?.map(r=>r.plain_text).join('');
      console.log('[•]', txt.substring(0, 100));
    } else if (b.type === 'numbered_list_item') {
      const txt = b.numbered_list_item?.rich_text?.map(r=>r.plain_text).join('');
      console.log('[#]', txt.substring(0, 100));
    } else if (b.type === 'callout') {
      const txt = b.callout?.rich_text?.map(r=>r.plain_text).join('');
      const icon = b.callout?.icon?.emoji || '';
      console.log('[callout ' + icon + ']', txt.substring(0, 100));
    } else if (b.type === 'toggle') {
      const txt = b.toggle?.rich_text?.map(r=>r.plain_text).join('');
      console.log('[toggle]', txt.substring(0, 100));
    } else if (b.type === 'quote') {
      const txt = b.quote?.rich_text?.map(r=>r.plain_text).join('');
      console.log('[quote]', txt.substring(0, 100));
    } else if (b.type === 'embed' || b.type === 'link_preview') {
      console.log('[' + b.type + ']', b[b.type]?.url || '');
    } else {
      console.log('[' + b.type + ']');
    }
  }
  console.log('\nChild pages found:', childPages.length);
  for (const c of childPages) {
    console.log(' - ID:', c.id, '|', c.child_page?.title || '');
  }
}
main();
