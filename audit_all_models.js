const fetch = require('node-fetch');
const fs = require('fs');

const token = fs.readFileSync('C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env', 'utf-8')
  .match(/NOTION_TOKEN=(.+)/)[1].trim();
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

async function queryAll() {
  let results = [], cursor;
  do {
    const body = cursor ? { page_size: 100, start_cursor: cursor } : { page_size: 100 };
    const resp = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await resp.json();
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
    await new Promise(r => setTimeout(r, 200));
  } while (cursor);
  return results;
}

async function main() {
  const pages = await queryAll();
  console.log(`Total models: ${pages.length}\n`);

  const models = pages.map(p => {
    const props = p.properties;
    return {
      id: p.id,
      name: props['Name']?.title?.[0]?.plain_text || props['Name']?.rich_text?.[0]?.plain_text || '',
      modelId: props['Model ID']?.rich_text?.[0]?.plain_text || '',
      source: props['Source']?.select?.name || '',
      category: props['Category']?.select?.name || '',
      tags: (props['Tags']?.multi_select || []).map(t => t.name),
      coreConcept: (props['Core Concept']?.rich_text || []).map(t => t.plain_text).join(''),
      hasContent: !!(props['Core Concept']?.rich_text?.length > 10)
    };
  });

  // Group by name similarity for potential merges
  console.log('=== ALL MODELS BY SOURCE ===\n');
  const bySource = {};
  models.forEach(m => { (bySource[m.source] = bySource[m.source] || []).push(m); });
  for (const [src, ms] of Object.entries(bySource)) {
    console.log(`${src} (${ms.length}):`);
    ms.forEach(m => console.log(`  ${m.modelId} | ${m.name} | cat=${m.category} | content=${m.hasContent ? 'YES' : 'NO'}`));
    console.log();
  }

  // Find similar/overlapping models
  console.log('\n=== POTENTIAL MERGE CANDIDATES (similar names) ===\n');
  const nameGroups = {};
  models.forEach(m => {
    const key = m.name.toLowerCase().replace(/[^a-z]/g, '-');
    (nameGroups[key] = nameGroups[key] || []).push(m);
  });
  for (const [key, ms] of Object.entries(nameGroups)) {
    if (ms.length > 1) {
      console.log(`GROUP [${key}]:`);
      ms.forEach(m => console.log(`  ${m.source} | ${m.name} | ${m.id}`));
      console.log();
    }
  }

  // Models without meaningful content
  console.log('\n=== MODELS WITHOUT CONTENT ===\n');
  models.filter(m => !m.hasContent).forEach(m => {
    console.log(`${m.modelId} | ${m.source} | ${m.name}`);
  });

  // Save to file for analysis
  fs.writeFileSync('C:\\Users\\bdademo\\.qclaw\\workspace\\all_models_audit.json', JSON.stringify(models, null, 2));
  console.log('\nSaved to all_models_audit.json');
}

main().catch(e => console.error(e.message));
