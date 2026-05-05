const fetch = require('node-fetch');
const fs = require('fs');

// Read new token
const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/NOTION_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

const databases = [
  '350157c6-daef-80dd-a321-e6ff0c601530',
  '350157c6-daef-804e-83f0-ca60efd5b750'
];

async function inspectDb(dbId) {
  console.log('\n=== Database:', dbId, '===');
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28'
    }
  });
  const data = await res.json();
  const title = data.title?.plain_text || '(untitled)';
  console.log('Title:', title);
  console.log('Properties:');
  for (const [key, prop] of Object.entries(data.properties || {})) {
    console.log(`  ${key}: ${prop.type}`);
  }

  // Try to query to see sample entries
  const queryRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ page_size: 3 })
  });
  const queryData = await queryRes.json();
  console.log('Sample entries:', queryData.results?.length || 0);
  if (queryData.results?.length > 0) {
    for (const page of queryData.results.slice(0, 2)) {
      const p = page.properties || {};
      const name = p.Name?.title?.[0]?.plain_text || p.name?.title?.[0]?.plain_text || '(no name)';
      console.log('  -', name);
    }
  }
}

async function main() {
  for (const dbId of databases) {
    await inspectDb(dbId);
  }
}

main().catch(e => console.error('Error:', e.message));