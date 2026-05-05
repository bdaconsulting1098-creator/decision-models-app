const fetch = require('node-fetch');
const fs = require('fs');

const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const token = envContent.match(/NOTION_TOKEN=(.+)/)[1].trim();
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

const targets = {
  "Occam's Razor": {
    coreConcept: "Occam's Razor states that among competing hypotheses, the one with the fewest assumptions should be selected. Simpler explanations are more likely to be correct than complex ones. Adding unnecessary complexity increases the chance of error.",
    whenToUse: "Apply this model when diagnosing problems, evaluating theories, or choosing between multiple explanations. If two explanations fit the facts equally well, prefer the simpler one.",
    example: "A website suddenly goes down. The complex explanation: a sophisticated cyberattack. The simple explanation: someone tripped over the power cord. Occam's Razor suggests checking the power cord first."
  },
  "Hanlon's Razor": {
    coreConcept: "Hanlon's Razor states: never attribute to malice that which is adequately explained by stupidity or incompetence. People often assume others are acting out of bad intent, when most errors come from carelessness, ignorance, or system failures.",
    whenToUse: "Use this model when you feel wronged or frustrated by someone's actions. Before assuming malice, consider whether incompetence or confusion could explain the behavior.",
    example: "A colleague fails to include you on an important email. Instead of assuming they are trying to cut you out, Hanlon's Razor suggests they simply forgot. A quick, kind check-in resolves the issue without conflict."
  },
  "Gresham's Law": {
    coreConcept: "Gresham's Law states that bad money drives out good. When two currencies are in circulation at a fixed exchange rate, people hoard the undervalued good money and spend the overvalued bad money. In broader terms, bad options tend to drive out good ones.",
    whenToUse: "Apply this model when designing incentive systems or analyzing organizational behavior. If bad behavior is rewarded or good behavior is penalized, the good will be driven out over time.",
    example: "In a company where promotions are based on visibility rather than performance, high-performing employees are passed over for those skilled at self-promotion. Over time, high performers leave, leaving the company with people good at looking good but not at doing good work."
  }
};

async function main() {
  const dbRes = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ page_size: 100 })
  });
  const data = await dbRes.json();

  for (const page of (data.results || [])) {
    const name = (page.properties?.Name?.title || [{}])[0]?.plain_text || '';
    if (targets[name]) {
      const c = targets[name];
      const res = await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            'Core Concept': { rich_text: [{ text: { content: c.coreConcept } }] },
            'When to Use': { rich_text: [{ text: { content: c.whenToUse } }] },
            'Example': { rich_text: [{ text: { content: c.example } }] }
          }
        })
      });
      console.log((res.ok ? '✅' : '❌') + ' ' + name);
      await new Promise(x => setTimeout(x, 300));
    }
  }
  console.log('Done!');
}

main().catch(e => console.error(e.message));
