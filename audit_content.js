const fetch = require('node-fetch');
const fs = require('fs');

const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/NOTION_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

async function check() {
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
  const models = data.results || [];

  const empty = models.filter(m => {
    const core = (m.properties?.['Core Concept']?.rich_text || [{}])[0]?.plain_text || '';
    return !core.trim();
  });

  const hasContent = models.filter(m => {
    const core = (m.properties?.['Core Concept']?.rich_text || [{}])[0]?.plain_text || '';
    return core.trim();
  });

  console.log(`=== Content Audit ===`);
  console.log(`Total: ${models.length}`);
  console.log(`With content: ${hasContent.length}`);
  console.log(`Missing content: ${empty.length}\n`);

  console.log('--- Models WITH content ---');
  hasContent.forEach(m => {
    const name = (m.properties?.Name?.title || [{}])[0]?.plain_text;
    const source = m.properties?.Source?.select?.name;
    console.log(`  ✅ [${source}] ${name}`);
  });

  console.log('\n--- Models MISSING content ---');
  empty.forEach(m => {
    const name = (m.properties?.Name?.title || [{}])[0]?.plain_text;
    const source = m.properties?.Source?.select?.name;
    const cat = m.properties?.Category?.select?.name;
    console.log(`  ❌ [${source}] ${name} (${cat})`);
  });
}

check().catch(e => console.error(e.message));
