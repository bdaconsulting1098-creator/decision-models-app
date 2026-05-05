const fetch = require('node-fetch');
const fs = require('fs');

const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const token = envContent.match(/NOTION_TOKEN=(.+)/)[1].trim();
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

async function findAndUpdate() {
  // Query all munger pages
  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ page_size: 100, filter: { property: 'Source', select: { equals: 'munger' } } })
  });
  const data = await res.json();
  const pages = data.results || [];

  // Find the 3 missing ones by checking which have no core concept
  const missing = pages.filter(p => {
    const core = (p.properties?.['Core Concept']?.rich_text || [{}])[0]?.plain_text || '';
    return !core.trim();
  });

  console.log(`Found ${missing.length} Munger models without content:`);
  missing.forEach(p => {
    const name = (p.properties?.Name?.title || [{}])[0]?.plain_text || '';
    console.log(`  - ${name} (id: ${p.id})`);
  });

  // Content for the 3 models
  const contents = {
    "Occam's Razor": {
      core: "Occam's Razor states that among competing hypotheses, the one with the fewest assumptions should be selected. Simpler explanations are more likely to be correct than complex ones. Adding unnecessary complexity increases the chance of error.",
      when: "Apply this model when diagnosing problems or choosing between multiple explanations. If two explanations fit the facts equally well, prefer the simpler one.",
      example: "A website goes down. Complex theory: sophisticated cyberattack. Simple theory: someone tripped over the power cord. Occam's Razor says check the power cord first."
    },
    "Hanlon's Razor": {
      core: "Hanlon's Razor states: never attribute to malice that which is adequately explained by stupidity or incompetence. Most errors come from carelessness or ignorance rather than bad intent.",
      when: "Use this when you feel wronged by someone's actions. Before assuming malice, consider whether incompetence or confusion could explain the behavior.",
      example: "A colleague forgot to include you on an important email. Hanlon's Razor suggests they simply forgot, not that they're trying to cut you out. A kind check-in resolves it without conflict."
    },
    "Gresham's Law": {
      core: "Gresham's Law states that bad money drives out good. When two currencies circulate at fixed rates, people hoard the undervalued good money and spend the overvalued bad money. Bad options tend to drive out good ones.",
      when: "Apply this model when designing incentive systems. If bad behavior is rewarded or good behavior is penalized, the good will be driven out over time.",
      example: "A company promotes based on visibility rather than performance. High-performers who work quietly get passed over for self-promoters. Over time, high-performers leave, leaving only those good at looking good."
    }
  };

  for (const p of missing) {
    const name = (p.properties?.Name?.title || [{}])[0]?.plain_text || '';
    const content = contents[name];
    if (!content) {
      console.log(`  ⚠️ No content defined for: ${name}`);
      continue;
    }

    const updateRes = await fetch(`https://api.notion.com/v1/pages/${p.id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: {
          'Core Concept': { rich_text: [{ text: { content: content.core } }] },
          'When to Use': { rich_text: [{ text: { content: content.when } }] },
          'Example': { rich_text: [{ text: { content: content.example } }] }
        }
      })
    });

    console.log(`  ${(updateRes.ok ? '✅' : '❌')} Updated: ${name}`);
    await new Promise(x => setTimeout(x, 400));
  }
}

findAndUpdate().catch(e => console.error('Error:', e.message));
