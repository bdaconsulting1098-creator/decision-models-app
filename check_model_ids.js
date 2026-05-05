const fetch = require('node-fetch');
const fs = require('fs');
const token = fs.readFileSync('C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env', 'utf-8').match(/NOTION_TOKEN=(.+)/)[1].trim();
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

async function main() {
  const resp = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ page_size: 10 })
  });
  const data = await resp.json();
  for (const page of data.results.slice(0, 10)) {
    const p = page.properties;
    const name = (p.Name?.title || [{}])[0]?.plain_text || '';
    const modelId = (p['Model ID']?.rich_text || [{}])[0]?.plain_text || '';
    const source = p.Source?.select?.name || '';
    console.log(`[${source}] "${name}" -> modelId: "${modelId}"`);
  }
}
main().catch(e => console.error(e.message));
