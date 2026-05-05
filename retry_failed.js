const fetch = require('node-fetch');
const fs = require('fs');

const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/NOTION_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

// The 16 failed models - re-create with corrected category
const failedModels = [
  { name: 'Relativity', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Relativity' },
  { name: 'Reciprocity', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Reciprocity' },
  { name: 'Thermodynamics', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Thermodynamics' },
  { name: 'Inertia', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Inertia' },
  { name: 'Friction and Viscosity', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Friction and Viscosity' },
  { name: 'Velocity', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Velocity' },
  { name: 'Leverage', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Leverage' },
  { name: 'Activation Energy', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Activation Energy' },
  { name: 'Catalysts', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Catalysts' },
  { name: 'Alloying', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Alloying' },
  { name: 'Natural Selection and Extinction', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Natural Selection and Extinction' },
  { name: 'The Red Queen Effect', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'The Red Queen Effect' },
  { name: 'Ecosystems', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Ecosystems' },
  { name: 'Niches', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Niches' },
  { name: 'Self-Preservation', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Self-Preservation' },
  { name: 'Replication', source: 'munger', category: 'Physics Chemistry and Biology', modelId: '', tags: [], coreConcept: '', whenToUse: '', example: '', relatedMunger: '', englishName: 'Replication' }
];

async function createPage(model) {
  const body = {
    parent: { database_id: DB_ID },
    properties: {
      'Name': { title: [{ text: { content: model.name } }] },
      'English Name': { rich_text: [{ text: { content: model.englishName } }] },
      'Core Concept': { rich_text: [{ text: { content: model.coreConcept } }] },
      'When to Use': { rich_text: [{ text: { content: model.whenToUse } }] },
      'Example': { rich_text: [{ text: { content: model.example } }] },
      'Category': { select: { name: model.category } },
      'Source': { select: { name: model.source } },
      'Model ID': { rich_text: [{ text: { content: model.modelId } }] },
      'Related Munger Model': { rich_text: [{ text: { content: model.relatedMunger } }] },
      'Tags': { multi_select: model.tags.map(t => ({ name: t })) }
    }
  };

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (res.ok) {
    console.log(`  ✅ ${model.name}`);
    return true;
  } else {
    console.error(`  ❌ ${model.name}: ${data.message}`);
    return false;
  }
}

async function main() {
  console.log('Retrying 16 failed models...\n');
  let success = 0, failed = 0;
  for (let i = 0; i < failedModels.length; i++) {
    const model = failedModels[i];
    const ok = await createPage(model);
    if (ok) success++; else failed++;
    await new Promise(r => setTimeout(r, 350));
  }
  console.log(`\n=== Retry Complete: ✅ ${success} | ❌ ${failed} ===`);
}

main().catch(e => console.error('Error:', e.message));