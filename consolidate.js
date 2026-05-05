const fetch = require('node-fetch');
const fs = require('fs');

const token = fs.readFileSync('C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env', 'utf-8')
  .match(/NOTION_TOKEN=(.+)/)[1].trim();
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

// Models to DELETE from Notion (consolidate/remove)
const TO_DELETE = [
  'Inconsistency-Avoidance Tendency',       // 太细分，合并到心理学
  'Doubt-Avoidance Tendency',               // 类似 Uncertainty Aversion
  'Reward Superresponse Tendency',           // 太细分，合并到 Incentives
  'Influence-from-Mere-Association Tendency',// 与 Social Proof 重叠
  'Drug-Misinfluence Tendency',              // 太狭窄
  'Senescence-Misinfluence Tendency',        // 太狭窄
  'Twaddle Tendency',                       // 太狭窄
  'Kantian Fairness Tendency',              // 太细分
  'The Lollapalooza Effect',                // 与 Tendency 重复
  'The Tower of Morphen',                   // 太学术
  'Cartesian Materialism',                   // 太学术
  'Heterophenomenology',                    // 太学术
  'The Other Minds Problem',                // 太哲学
  'The Riddle of Consciousness',            // 与 Cartesian Theatre 重叠
  'Consciousness in AI',                    // 与当前生活关系不大
  'The Edge of Organization',              // 太学术
  'The User Illusion',                      // 合并到 Multiple Drafts Model
  'The Fame in the Brain',                  // 合并到 Multiple Drafts Model
  'Occam\'s Razor',                          // 已有 First Principles
  'Hanlon\'s Razor',                         // 已有 First Principles
  'Gresham\'s Law',                         // 已有其他经济模型
  'Mr. Market',                            // 与 Circle of Competence 重叠
  'The Red Queen Effect',                   // 与 Evolution/Competition 重叠
  'Activation Energy',                     // 太字面
  'Friction and Viscosity',                // 太字面
  'Velocity',                              // 太字面
  'Reciprocity',                           // 与 Reciprocation Tendency 重叠
  'Permutations and Combinations',         // 与 Math 相关
  'Mathematically Inevitable',             // 与 Math 相关
  'Churn',                                 // 太具体业务
  'Alloying',                              // 太字面
  'Thermodynamics',                        // 太学术
  'Relativity',                            // 太学术
  'Replication',                           // 太字面
  'Self-Preservation',                     // 太字面
  'Inertia',                               // 与 Momentum 重叠
  'Leverage',                              // 太具体业务
  'Niches',                                // 太生态学
  'Ecosystems',                            // 太生态学
  'Natural Selection and Extinction',       // 太生态学
  'Algorithms',                            // 太计算机
  'Irreducibility',                        // 太学术
  'Catalysts',                             // 与 Bypass/Activation Energy 重叠
  'Compounding',                           // 与 Probabilistic Thinking/Numeracy 重叠
  'The Law of Diminishing Returns',        // 与 Diminishing Returns 重叠
  'Averages (Mean, Median, Mode)',          // 与 Numeracy 重叠
  'Probability Distributions',             // 与 Numeracy 重叠
  'Pareto Principle (',                   // 截断名
  'Feedback Loops',                        // 与 Systems Thinking 重叠
  'Bottlenecks',                           // 与 Systems Thinking 重叠
  'Critical Mass',                         // 与 Systems Thinking 重叠
  'Margin of Safety',                     // 与 Systems Thinking 重叠
  'Tragedy of the Commons',               // 与 Systems Thinking 重叠
  'Gresham\'s Law',                       // 已有
  'Occam\'s Razor',                       // 已有
  'Hanlon\'s Razor',                      // 已有
];

// Also find by Model ID for CE models
const CE_TO_DELETE = [
  'CE-011', // Tower of Morphen
  'CE-007', // Cartesian Materialism
  'CE-006', // Heterophenomenology
  'CE-014', // Other Minds Problem
  'CE-015', // Riddle of Consciousness
  'CE-016', // Consciousness in AI
  'CE-017', // Edge of Organization
  'CE-019', // User Illusion
  'CE-008', // Fame in the Brain
];

async function queryByName(name) {
  const resp = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filter: { property: 'Name', title: { equals: name } }
    })
  });
  const data = await resp.json();
  return data.results || [];
}

async function queryByModelId(modelId) {
  const resp = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filter: { property: 'Model ID', rich_text: { equals: modelId } }
    })
  });
  const data = await resp.json();
  return data.results || [];
}

async function archivePage(pageId) {
  const resp = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ archived: true })
  });
  return resp.ok;
}

async function main() {
  console.log('=== CONSOLIDATION PLAN ===\n');
  console.log('Deleting by Name:');
  for (const name of TO_DELETE) {
    const pages = await queryByName(name);
    if (pages.length > 0) {
      console.log(`  ARCHIVE: "${name}" (${pages.length} found)`);
    } else {
      console.log(`  SKIP (not found): "${name}"`);
    }
  }
  console.log('\nDeleting by Model ID:');
  for (const mid of CE_TO_DELETE) {
    const pages = await queryByModelId(mid);
    if (pages.length > 0) {
      console.log(`  ARCHIVE: Model ID=${mid} (${pages.length} found)`);
    }
  }

  console.log('\n=== EXECUTING DELETES ===\n');
  
  let archived = 0, skipped = 0;
  
  for (const name of TO_DELETE) {
    const pages = await queryByName(name);
    for (const page of pages) {
      const ok = await archivePage(page.id);
      if (ok) { archived++; process.stdout.write('✅'); }
      else { skipped++; process.stdout.write('❌'); }
      await new Promise(r => setTimeout(r, 350));
    }
  }
  
  for (const mid of CE_TO_DELETE) {
    const pages = await queryByModelId(mid);
    for (const page of pages) {
      const ok = await archivePage(page.id);
      if (ok) { archived++; process.stdout.write('✅'); }
      else { skipped++; process.stdout.write('❌'); }
      await new Promise(r => setTimeout(r, 350));
    }
  }
  
  console.log(`\n\nDone: ${archived} archived, ${skipped} failed/skipped`);
}

main().catch(e => console.error('Fatal:', e.message));
