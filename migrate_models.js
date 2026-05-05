const fetch = require('node-fetch');
const fs = require('fs');

const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/NOTION_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

// Load old models
const oldModels = JSON.parse(fs.readFileSync('C:\\Users\\bdademo\\.qclaw\\workspace\\old_models.json', 'utf-8'));

// Category translation map
const categoryMap = {
  '认知偏差': 'Cognitive Biases',
  '人类认知机制': 'Human Cognition',
  '统计规律': 'Statistical Laws',
  '前景理论': 'Prospect Theory',
  '体验评估': 'Experience Evaluation',
  '预测与不确定性': 'Prediction and Uncertainty',
  '认知机制': 'Cognitive Mechanism',
  '行为经济学核心理论': 'Prospect Theory'
};

// Tag translation map
const tagMap = {
  '启发式': 'Heuristics',
  '认知偏差': 'Cognitive Bias',
  '概率判断': 'Probability Judgment',
  '认知心理学': 'Cognitive Psychology',
  '决策机制': 'Decision Mechanism',
  '诺贝尔奖': 'Nobel Prize',
  '统计': 'Statistics',
  '回归均值': 'Regression to Mean',
  '表现评估': 'Performance Evaluation',
  '规划': 'Planning',
  '项目管理': 'Project Management',
  '预测': 'Forecasting',
  '风险评估': 'Risk Assessment',
  '行为经济学': 'Behavioral Economics',
  '损失厌恶': 'Loss Aversion',
  '投资心理': 'Investment Psychology',
  '决策框架': 'Decision Framework',
  '乐观偏见': 'Optimism Bias',
  '框架效应': 'Framing Effect',
  '沟通': 'Communication',
  '谈判': 'Negotiation',
  '价格判断': 'Price Judgment',
  '认知机制': 'Cognitive Mechanism',
  '决策分析': 'Decision Analysis',
  '直觉陷阱': 'Intuition Trap',
  '元认知': 'Metacognition',
  '决策优化': 'Decision Optimization',
  '体验设计': 'Experience Design',
  '峰终定律': 'Peak-End Rule',
  '专家': 'Expert',
  '不确定性': 'Uncertainty',
  '叙事': 'Narrative',
  '故事思维': 'Story Thinking',
  '复盘': 'Post-mortem',
  '评估': 'Evaluation',
  '信息处理': 'Information Processing',
  '价值评估': 'Value Assessment',
  '所有权心理': 'Ownership Psychology',
  '心理': 'Psychology'
};

function translateCategory(cat) {
  return categoryMap[cat] || cat;
}

function translateTags(tags) {
  return tags.map(t => tagMap[t] || t).filter(t => t);
}

function translateModel(model) {
  const cat = translateCategory(model.category || '');
  // Munger categories - already English
  const mungerCats = ['General Thinking Tools', 'Physics Chemistry and Biology', 'Systems', 'Numeracy', 'Microeconomics', 'Military and War', 'Human Nature and Judgment'];
  const finalCat = mungerCats.includes(cat) ? cat : (categoryMap[model.category] || model.category);

  return {
    name: model.name,
    englishName: model.englishName,
    coreConcept: model.coreConcept || '',
    whenToUse: model.whenToUse || '',
    example: model.example || '',
    category: finalCat,
    source: model.source,
    modelId: model.modelId || '',
    tags: translateTags(Array.isArray(model.tags) ? model.tags : []),
    relatedMunger: model.relatedMunger || ''
  };
}

const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

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
    console.log(`  ✅ Created: ${model.name} (${model.source})`);
    return true;
  } else {
    console.error(`  ❌ Failed: ${model.name} - ${data.message || JSON.stringify(data)}`);
    return false;
  }
}

async function main() {
  const translated = oldModels.map(m => translateModel(m));

  console.log('=== Migration Summary ===');
  console.log('Kahneman models:', translated.filter(m => m.source === 'kahneman').length);
  console.log('Munger models:', translated.filter(m => m.source === 'munger').length);
  console.log('Total:', translated.length);
  console.log('\n=== Sample (first 3) ===');
  translated.slice(0, 3).forEach(m => {
    console.log(`[${m.source}] ${m.name}`);
    console.log(`  Category: ${m.category}`);
    console.log(`  Tags: ${m.tags.join(', ')}`);
    console.log(`  Core: ${m.coreConcept.substring(0, 80)}...`);
  });

  console.log('\n=== Starting Migration (rate limited - 3 per second) ===\n');

  let success = 0, failed = 0;
  for (let i = 0; i < translated.length; i++) {
    const model = translated[i];
    const ok = await createPage(model);
    if (ok) success++; else failed++;
    if ((i + 1) % 10 === 0) console.log(`Progress: ${i + 1}/${translated.length} | ✅ ${success} | ❌ ${failed}`);
    // Rate limit: Notion allows 3 requests/second
    await new Promise(r => setTimeout(r, 350));
  }

  console.log('\n=== Migration Complete ===');
  console.log(`✅ ${success} created`);
  console.log(`❌ ${failed} failed`);
}

main().catch(e => console.error('Error:', e.message));