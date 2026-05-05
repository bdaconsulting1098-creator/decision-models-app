const fetch = require('node-fetch');
const fs = require('fs');

const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/NOTION_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

// All 42 Munger models with their categories
const mungerModels = [
  { name: 'The Map is Not the Territory', category: 'General Thinking Tools' },
  { name: 'Circle of Competence', category: 'General Thinking Tools' },
  { name: 'First Principles Thinking', category: 'General Thinking Tools' },
  { name: 'Thought Experiment', category: 'General Thinking Tools' },
  { name: 'Second-Order Thinking', category: 'General Thinking Tools' },
  { name: 'Probabilistic Thinking', category: 'General Thinking Tools' },
  { name: 'Inversion', category: 'General Thinking Tools' },
  { name: "Occam's Razor", category: 'General Thinking Tools' },
  { name: "Hanlon's Razor", category: 'General Thinking Tools' },
  { name: 'Relativity', category: 'Physics Chemistry and Biology' },
  { name: 'Reciprocity', category: 'Physics Chemistry and Biology' },
  { name: 'Thermodynamics', category: 'Physics Chemistry and Biology' },
  { name: 'Inertia', category: 'Physics Chemistry and Biology' },
  { name: 'Friction and Viscosity', category: 'Physics Chemistry and Biology' },
  { name: 'Velocity', category: 'Physics Chemistry and Biology' },
  { name: 'Leverage', category: 'Physics Chemistry and Biology' },
  { name: 'Activation Energy', category: 'Physics Chemistry and Biology' },
  { name: 'Catalysts', category: 'Physics Chemistry and Biology' },
  { name: 'Alloying', category: 'Physics Chemistry and Biology' },
  { name: 'Natural Selection and Extinction', category: 'Physics Chemistry and Biology' },
  { name: 'The Red Queen Effect', category: 'Physics Chemistry and Biology' },
  { name: 'Ecosystems', category: 'Physics Chemistry and Biology' },
  { name: 'Niches', category: 'Physics Chemistry and Biology' },
  { name: 'Self-Preservation', category: 'Physics Chemistry and Biology' },
  { name: 'Replication', category: 'Physics Chemistry and Biology' },
  { name: 'Feedback Loops', category: 'Systems' },
  { name: 'Bottlenecks', category: 'Systems' },
  { name: 'Margin of Safety', category: 'Systems' },
  { name: 'Churn', category: 'Systems' },
  { name: 'Algorithms', category: 'Systems' },
  { name: 'Critical Mass', category: 'Systems' },
  { name: 'Emergence', category: 'Systems' },
  { name: 'Irreducibility', category: 'Systems' },
  { name: 'The Law of Diminishing Returns', category: 'Systems' },
  { name: 'Pareto Principle (', category: 'Systems' },
  { name: 'Tragedy of the Commons', category: 'Systems' },
  { name: "Gresham's Law", category: 'Systems' },
  { name: 'Permutations and Combinations', category: 'Numeracy' },
  { name: 'Compounding', category: 'Numeracy' },
  { name: 'Averages (Mean, Median, Mode)', category: 'Numeracy' },
  { name: 'Mathematically Inevitable', category: 'Numeracy' },
  { name: 'Probability Distributions', category: 'Numeracy' },
];

// LLM config
function getLLMConfig() {
  if (process.env.OPENROUTER_API_KEY) {
    return {
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      model: process.env.LLM_MODEL || 'google/gemini-2.0-flash-001',
      provider: 'openrouter'
    };
  }
  return {
    baseURL: 'http://127.0.0.1:28789/v1',
    apiKey: 'local-no-key',
    model: 'default',
    provider: 'local'
  };
}

async function callLLM(prompt) {
  const config = getLLMConfig();
  const resp = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      ...(config.provider === 'openrouter' ? {
        'HTTP-Referer': 'https://mental-models-app.vercel.app',
        'X-Title': 'Mental Models Decision Advisor'
      } : {})
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: 'You are an expert on Charlie Munger\'s mental models. Respond in English with concise, insightful content. Do NOT use markdown headers or bullet points - just plain text paragraphs.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.5,
    })
  });
  const data = await resp.json();
  return data.choices?.[0]?.message?.content || '';
}

async function generateContent(model) {
  const prompt = `Generate content for the mental model "${model.name}" (Category: ${model.category}) from Charlie Munger's framework.

Return EXACTLY this JSON format (no markdown, no code fences):
{"coreConcept":"<2-3 sentence explanation of the core concept>","whenToUse":"<1-2 sentences on when to apply this model>","example":"<1 concrete real-world example>"}`;

  const raw = await callLLM(prompt);
  // Try to parse JSON from the response
  try {
    // Remove code fences if present
    let cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const json = JSON.parse(cleaned);
    return {
      coreConcept: (json.coreConcept || '').substring(0, 2000),
      whenToUse: (json.whenToUse || '').substring(0, 2000),
      example: (json.example || '').substring(0, 2000)
    };
  } catch (e) {
    console.log(`  ⚠️ Parse failed for ${model.name}, raw: ${raw.substring(0, 100)}`);
    return null;
  }
}

async function updatePage(pageId, content) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        'Core Concept': { rich_text: [{ text: { content: content.coreConcept } }] },
        'When to Use': { rich_text: [{ text: { content: content.whenToUse } }] },
        'Example': { rich_text: [{ text: { content: content.example } }] },
      }
    })
  });
  return res.ok;
}

async function main() {
  console.log('=== Generating content for 42 Munger models ===\n');

  // First, get page IDs from Notion
  const dbRes = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ page_size: 100 })
  });
  const dbData = await dbRes.json();

  // Build map of name -> pageId for munger models
  const pageMap = {};
  for (const page of (dbData.results || [])) {
    const source = page.properties?.Source?.select?.name;
    const name = (page.properties?.Name?.title || [{}])[0]?.plain_text || '';
    const core = (page.properties?.['Core Concept']?.rich_text || [{}])[0]?.plain_text || '';
    if (source === 'munger' && !core.trim()) {
      pageMap[name] = page.id;
    }
  }

  console.log(`Found ${Object.keys(pageMap).length} Munger models needing content\n`);

  let success = 0, failed = 0;
  for (const model of mungerModels) {
    const pageId = pageMap[model.name];
    if (!pageId) {
      console.log(`  ⏭️ Skip ${model.name} (not found in Notion)`);
      continue;
    }

    console.log(`Generating: ${model.name}...`);
    const content = await generateContent(model);
    if (!content) {
      console.log(`  ❌ Failed to generate content`);
      failed++;
      continue;
    }

    const ok = await updatePage(pageId, content);
    if (ok) {
      console.log(`  ✅ Updated: ${model.name}`);
      success++;
    } else {
      console.log(`  ❌ Notion update failed: ${model.name}`);
      failed++;
    }

    // Rate limit: Notion 3/sec + LLM cooldown
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== Complete: ✅ ${success} | ❌ ${failed} ===`);
}

main().catch(e => console.error('Error:', e.message));
