const fetch = require('node-fetch');
const fs = require('fs');

const token = fs.readFileSync('C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env', 'utf-8')
  .match(/NOTION_TOKEN=(.+)/)[1].trim();

// Get database schema to see actual field names
async function main() {
  const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';
  const resp = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28' }
  });
  const db = await resp.json();
  console.log('Database fields:');
  Object.entries(db.properties).forEach(([name, prop]) => {
    console.log(`  ${name}: type=${prop.type}, id=${prop.id}`);
  });

  // Also get one page to see its actual structure
  const q = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ page_size: 1 })
  });
  const qd = await q.json();
  if (qd.results.length > 0) {
    console.log('\nFirst page properties:');
    Object.entries(qd.results[0].properties).forEach(([name, prop]) => {
      let sample = '';
      if (prop.type === 'title') sample = prop.title?.map(t => t.plain_text).join('') || '(empty)';
      else if (prop.type === 'rich_text') sample = prop.rich_text?.map(t => t.plain_text).join('') || '(empty)';
      else if (prop.type === 'select') sample = prop.select?.name || '(empty)';
      else if (prop.type === 'multi_select') sample = prop.multi_select?.map(t => t.name).join(', ') || '(empty)';
      else sample = prop[prop.type] ? JSON.stringify(prop[prop.type]).substring(0,80) : '(empty)';
      console.log(`  ${name} (${prop.type}): "${sample}"`);
    });
  }
}

main().catch(e => console.error(e.message));
