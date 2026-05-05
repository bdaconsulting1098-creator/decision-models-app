const fetch = require('node-fetch');
const fs = require('fs');

// Load token
const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/NOTION_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

async function searchNotion() {
  console.log('=== Searching Notion Workspace ===\n');

  // 1. Search for databases
  console.log('--- Searching databases ---');
  const searchRes = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter: { property: 'object', value: 'database' },
      page_size: 50
    })
  });
  const searchData = await searchRes.json();
  console.log('Databases found:', searchData.results?.length || 0);
  for (const db of (searchData.results || [])) {
    const title = db.title?.plain_text || '(untitled)';
    console.log('  DB:', title, '| ID:', db.id);
  }

  // 2. Also search pages
  console.log('\n--- Searching pages ---');
  const pageRes = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter: { property: 'object', value: 'page' },
      page_size: 50
    })
  });
  const pageData = await pageRes.json();
  console.log('Pages found:', pageData.results?.length || 0);
  for (const page of (pageData.results || [])) {
    const title = page.properties?.title?.title?.[0]?.plain_text || '(no title)';
    console.log('  Page:', title, '| ID:', page.id);
  }
}

searchNotion().catch(e => console.error('Error:', e.message));