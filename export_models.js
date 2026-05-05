const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Read .env file directly
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/NOTION_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : process.env.NOTION_TOKEN;

async function fetchAllModels() {
  const results = [];
  
  // 1. Kahneman database
  const dbId = '34e0164e-657d-81c6-883d-c6fd5cc3c693';
  let hasMore = true;
  let startCursor = undefined;
  
  while (hasMore) {
    const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 100, start_cursor: startCursor })
    });
    const data = await res.json();
    console.log('Fetched page:', data.results?.length || 0, 'items');
    
    for (const page of (data.results || [])) {
      const p = page.properties || {};
      results.push({
        source: 'kahneman',
        id: page.id,
        name: (p.Name?.title || [{}])[0]?.plain_text || '',
        englishName: (p['English Name']?.rich_text || [{}])[0]?.plain_text || '',
        coreConcept: (p['Core Concept']?.rich_text || [{}])[0]?.plain_text || '',
        whenToUse: (p['When to Use']?.rich_text || [{}])[0]?.plain_text || '',
        example: (p['Example']?.rich_text || [{}])[0]?.plain_text || '',
        category: (p.Category?.select?.name) || '',
        modelId: (p['Model ID']?.rich_text || [{}])[0]?.plain_text || '',
        tags: (p.Tags?.multi_select || []).map(t => t.name)
      });
    }
    
    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }
  
  console.log('Kahneman models:', results.filter(r => r.source === 'kahneman').length);
  
  // 2. Munger page blocks
  const mungerPageId = '34e0164e-657d-80cd-8621-dae99e31f6fa';
  const mungerRes = await fetch(`https://api.notion.com/v1/blocks/${mungerPageId}/children?page_size=100`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28'
    }
  });
  const mungerData = await mungerRes.json();
  
  let currentCat = '';
  for (const block of (mungerData.results || [])) {
    if (block.type === 'heading_2') {
      const text = (block.heading_2.rich_text || [{}])[0]?.plain_text || '';
      if (/^\d+\.\s+(General|Physics|Systems|Numeracy|Microeconomics|Military|Human)/i.test(text)) {
        currentCat = text.replace(/^\d+\.\s+/, '');
      } else {
        const nameMatch = text.match(/^\d+\.\s+(.+)/);
        if (nameMatch) {
          results.push({
            source: 'munger',
            id: block.id,
            name: nameMatch[1].trim(),
            englishName: nameMatch[1].trim(),
            coreConcept: '',
            whenToUse: '',
            example: '',
            category: currentCat,
            modelId: '',
            tags: []
          });
        }
      }
    }
  }
  
  console.log('Munger models:', results.filter(r => r.source === 'munger').length);
  console.log('Total models:', results.length);
  
  require('fs').writeFileSync('old_models.json', JSON.stringify(results, null, 2));
  console.log('\nSaved to old_models.json');
}

fetchAllModels().catch(e => console.error('Error:', e.message));
