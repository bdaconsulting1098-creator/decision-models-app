// models.js - Serve models from local JSON by default, optional Notion sync
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';
const LOCAL_MODEL_PATH = path.join(__dirname, '..', 'data', 'models.json');

function getHeaders() {
  return {
    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  };
}

// Read models from local JSON file
function readLocalModels() {
  try {
    const raw = fs.readFileSync(LOCAL_MODEL_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return { models: data.models || [], count: data.models?.length || 0, updatedAt: data.updatedAt || null };
  } catch (e) {
    console.error('[models.js] Failed to read local models.json:', e.message);
    return null;
  }
}

// Save models to local JSON file
function saveLocalModels(models) {
  try {
    const dir = path.dirname(LOCAL_MODEL_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const data = { models, count: models.length, updatedAt: new Date().toISOString() };
    fs.writeFileSync(LOCAL_MODEL_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log('[models.js] Saved', models.length, 'models to local JSON');
  } catch (e) {
    console.error('[models.js] Failed to save local models.json:', e.message);
  }
}

// Fetch all models from Notion
async function fetchFromNotion() {
  const models = [];
  let cursor;

  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    const resp = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data.message || JSON.stringify(data));

    for (const page of (data.results || [])) {
      const p = page.properties || {};
      models.push({
        id: page.id,
        name: (p.Name?.title || [{}])[0]?.plain_text || '',
        englishName: (p['English Name']?.rich_text || [{}])[0]?.plain_text || '',
        coreConcept: (p['Core Concept']?.rich_text || [{}])[0]?.plain_text || '',
        coreConceptCN: (p['Core Concept (CN)']?.rich_text || [{}])[0]?.plain_text || '',
        whenToUse: (p['When to Use']?.rich_text || [{}])[0]?.plain_text || '',
        whenToUseCN: (p['When to Use (CN)']?.rich_text || [{}])[0]?.plain_text || '',
        example: (p['Example']?.rich_text || [{}])[0]?.plain_text || '',
        exampleCN: (p['Example (CN)']?.rich_text || [{}])[0]?.plain_text || '',
        category: (p.Category?.select?.name) || '',
        source: (p.Source?.select?.name) || '',
        relatedMunger: (p['Related Munger Model']?.rich_text || [{}])[0]?.plain_text || '',
        modelId: (p['Model ID']?.rich_text || [{}])[0]?.plain_text || '',
        tags: (p.Tags?.multi_select || []).map(t => t.name)
      });
    }

    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return models;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const shouldSync = req.query.sync === 'true';

  // Default: read from local JSON
  if (!shouldSync) {
    const local = readLocalModels();
    if (local && local.count > 0) {
      return res.status(200).json({ models: local.models, count: local.count, source: 'local', updatedAt: local.updatedAt });
    }
    // Fallback: no local file, try Notion
    console.log('[models.js] No local models found, falling back to Notion...');
  }

  // Sync from Notion
  try {
    const models = await fetchFromNotion();
    saveLocalModels(models);
    res.status(200).json({ models, count: models.length, source: 'notion', updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[models.js] Notion fetch failed:', err);
    // If Notion fails but we have local data, return that
    const local = readLocalModels();
    if (local && local.count > 0) {
      return res.status(200).json({ models: local.models, count: local.count, source: 'local-fallback', updatedAt: local.updatedAt, warning: 'Notion sync failed, using cached data' });
    }
    res.status(500).json({ error: err.message });
  }
};
