const fetch = require('node-fetch');
const fs = require('fs');

const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/NOTION_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

async function check() {
  console.log('Checking new Notion database...\n');

  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ page_size: 100 })
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Error:', data.message || JSON.stringify(data));
    return;
  }

  const models = data.results || [];
  const kahneman = models.filter(m => m.properties?.Source?.select?.name === 'kahneman');
  const munger = models.filter(m => m.properties?.Source?.select?.name === 'munger');

  console.log(`Total models: ${models.length}`);
  console.log(`  Kahneman: ${kahneman.length}`);
  console.log(`  Munger: ${munger.length}`);
  console.log('\nFirst 5:');
  models.slice(0, 5).forEach(m => {
    const p = m.properties;
    console.log(`  [${p.Source?.select?.name}] ${p.Name?.title?.[0]?.plain_text} — ${p.Category?.select?.name}`);
  });
}

check().catch(e => console.error(e.message));