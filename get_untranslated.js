// Get untranslated models from Notion
const fetch = require('node-fetch');

const NOTION_TOKEN = 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

async function fetchAllModels() {
  const models = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const body = {
      page_size: 100,
      sorts: [{ property: 'Model ID', direction: 'ascending' }]
    };
    if (startCursor) body.start_cursor = startCursor;

    const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    models.push(...data.results);
    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }

  return models;
}

async function main() {
  const models = await fetchAllModels();
  
  const untranslated = [];
  
  for (const page of models) {
    const props = page.properties;
    const modelId = props['Model ID']?.rich_text?.[0]?.text?.content || '';
    const name = props.Name?.title?.[0]?.text?.content || '';
    const concept = props['Core Concept']?.rich_text?.[0]?.text?.content || '';
    const whenToUse = props['When to Use']?.rich_text?.[0]?.text?.content || '';
    const example = props['Example']?.rich_text?.[0]?.text?.content || '';
    const conceptCN = props['Core Concept (CN)']?.rich_text?.[0]?.text?.content || '';
    
    // If no Chinese translation, add to list
    if (!conceptCN || conceptCN.trim().length === 0) {
      untranslated.push({
        pageId: page.id,
        modelId,
        name,
        concept,
        whenToUse,
        example
      });
    }
  }
  
  console.log(JSON.stringify(untranslated, null, 2));
  console.error(`\n=== Total untranslated: ${untranslated.length} ===`);
}

main().catch(console.error);
