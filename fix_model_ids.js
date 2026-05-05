const fetch = require('node-fetch');
const fs = require('fs');
const token = fs.readFileSync('C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env', 'utf-8').match(/NOTION_TOKEN=(.+)/)[1].trim();
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

// PCA model names and their correct IDs
const pcaModels = [
  { name: "Reward Superresponse Tendency", id: "PCA-001" },
  { name: "Liking/Loving Tendency", id: "PCA-002" },
  { name: "Disliking/Hating Tendency", id: "PCA-003" },
  { name: "Doubt-Avoidance Tendency", id: "PCA-004" },
  { name: "Inconsistency-Avoidance Tendency", id: "PCA-005" },
  { name: "Curiosity Tendency", id: "PCA-006" },
  { name: "Kantian Fairness Tendency", id: "PCA-007" },
  { name: "Envy/Jealousy Tendency", id: "PCA-008" },
  { name: "Reciprocation Tendency", id: "PCA-009" },
  { name: "Influence-from-Mere-Association Tendency", id: "PCA-010" },
  { name: "Pain-Avoiding Psychological Denial", id: "PCA-011" },
  { name: "Excessive Self-Regard Tendency", id: "PCA-012" },
  { name: "Overoptimism Tendency", id: "PCA-013" },
  { name: "Deprival-Superreaction Tendency", id: "PCA-014" },
  { name: "Social Proof Tendency", id: "PCA-015" },
  { name: "Contrast-Misreaction Tendency", id: "PCA-016" },
  { name: "Stress-Influence Tendency", id: "PCA-017" },
  { name: "Availability-Misweighing Tendency", id: "PCA-018" },
  { name: "Use-It-or-Lose-It Tendency", id: "PCA-019" },
  { name: "Drug-Misinfluence Tendency", id: "PCA-020" },
  { name: "Senescence-Misinfluence Tendency", id: "PCA-021" },
  { name: "Authority-Misinfluence Tendency", id: "PCA-022" },
  { name: "Twaddle Tendency", id: "PCA-023" },
  { name: "Reason-Respecting Tendency", id: "PCA-024" },
  { name: "Lollapalooza Tendency", id: "PCA-025" },
  { name: "The Lollapalooza Effect", id: "PCA-026" },
  { name: "Inversion Principle", id: "PCA-027" },
  { name: "Multidisciplinary Mental Latticework", id: "PCA-028" },
  { name: "Avoiding Stupidity", id: "PCA-029" },
  { name: "The Man With A Hammer Tendency", id: "PCA-030" },
  { name: "Wide Education Principle", id: "PCA-031" },
  { name: "Incentive-Caused Bias", id: "PCA-032" },
  { name: "The Value of a Simple Checklist", id: "PCA-033" },
  { name: "Simplicity as Power", id: "PCA-034" },
  { name: "Mr. Market", id: "PCA-035" },
];

async function getPageId(name) {
  const resp = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filter: { property: 'Name', title: { equals: name } },
      page_size: 1
    })
  });
  const data = await resp.json();
  return data.results?.[0]?.id || null;
}

async function updateModelId(pageId, newModelId) {
  const resp = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: {
        'Model ID': { rich_text: [{ type: 'text', text: { content: newModelId } }] }
      }
    })
  });
  return resp.ok;
}

async function main() {
  console.log('Fixing model IDs...\n');
  let done = 0, failed = 0;
  for (const m of pcaModels) {
    const pageId = await getPageId(m.name);
    if (pageId) {
      const ok = await updateModelId(pageId, m.id);
      if (ok) {
        console.log(`✅ ${m.id} -> "${m.name}"`);
        done++;
      } else {
        console.log(`❌ FAILED update: "${m.name}"`);
        failed++;
      }
    } else {
      console.log(`⚠️  Not found: "${m.name}"`);
      failed++;
    }
    await new Promise(x => setTimeout(x, 350));
  }
  console.log(`\nDone: ${done} fixed, ${failed} failed`);
}
main().catch(e => console.error(e.message));
