const fetch = require('node-fetch');
const fs = require('fs');
const token = fs.readFileSync('C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env', 'utf-8').match(/NOTION_TOKEN=(.+)/)[1].trim();

const updates = [
  {
    id: '351157c6-daef-817f-a473-e610231658c1',
    core: "Occam's Razor states that among competing hypotheses, the one with the fewest assumptions should be selected. Simpler explanations are more likely to be correct than complex ones.",
    when: "Apply this model when diagnosing problems or choosing between multiple explanations that fit the facts equally well.",
    example: "A website goes down. Complex theory: sophisticated cyberattack. Simple theory: someone tripped over the power cord. Occam's Razor says check the cord first."
  },
  {
    id: '351157c6-daef-81c5-ba7e-cf61f4b6c253',
    core: "Hanlon's Razor: never attribute to malice that which is adequately explained by stupidity or incompetence. Most errors come from carelessness, not bad intent.",
    when: "Use this model when you feel wronged by someone's actions. Before assuming malice, consider whether incompetence could explain the behavior.",
    example: "A colleague forgot to include you on an important email. Hanlon's Razor suggests they simply forgot, not that they're trying to cut you out."
  },
  {
    id: '351157c6-daef-81d5-bc12-cc0055835262',
    core: "Gresham's Law: bad money drives out good. When good and bad options coexist, the bad tends to drive out the good because people exploit the system to their advantage.",
    when: "Apply this model when designing incentive systems. If bad behavior is rewarded, good behavior will eventually disappear from the system.",
    example: "A company promotes based on visibility rather than performance. High-performers who work quietly get passed over. Over time, high-performers leave."
  }
];

async function main() {
  for (const u of updates) {
    const res = await fetch(`https://api.notion.com/v1/pages/${u.id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: {
          'Core Concept': { rich_text: [{ text: { content: u.core } }] },
          'When to Use': { rich_text: [{ text: { content: u.when } }] },
          'Example': { rich_text: [{ text: { content: u.example } }] }
        }
      })
    });
    console.log((res.ok ? '✅' : '❌') + ' ' + u.id + ' (' + (res.ok ? 'updated' : await res.text().then(t => t.substring(0,100)) ) + ')');
    await new Promise(x => setTimeout(x, 400));
  }
  console.log('Done!');
}

main().catch(e => console.error(e.message));
