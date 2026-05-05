const fetch = require('node-fetch');
const fs = require('fs');

const envPath = 'C:\\Users\\bdademo\\.qclaw\\workspace\\decision-models-app\\.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const tokenMatch = envContent.match(/NOTION_TOKEN=(.+)/);
const token = tokenMatch ? tokenMatch[1].trim() : '';

const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

async function updateSchema() {
  const schemaUpdates = {
    properties: {
      'English Name': { rich_text: {} },
      'Core Concept': { rich_text: {} },
      'When to Use': { rich_text: {} },
      'Example': { rich_text: {} },
      'Category': {
        select: {
          options: [
            { name: 'Cognitive Biases', color: 'red' },
            { name: 'Human Cognition', color: 'orange' },
            { name: 'Statistical Laws', color: 'yellow' },
            { name: 'Prospect Theory', color: 'green' },
            { name: 'Experience Evaluation', color: 'blue' },
            { name: 'Prediction and Uncertainty', color: 'purple' },
            { name: 'General Thinking Tools', color: 'default' },
            { name: 'Physics Chemistry and Biology', color: 'default' },
            { name: 'Systems', color: 'default' },
            { name: 'Numeracy', color: 'default' },
            { name: 'Microeconomics', color: 'default' },
            { name: 'Military and War', color: 'default' },
            { name: 'Human Nature and Judgment', color: 'default' }
          ]
        }
      },
      'Source': {
        select: {
          options: [
            { name: 'kahneman', color: 'blue' },
            { name: 'munger', color: 'green' }
          ]
        }
      },
      'Model ID': { rich_text: {} },
      'Tags': {
        multi_select: {
          options: [
            { name: 'Heuristics', color: 'red' },
            { name: 'Cognitive Bias', color: 'red' },
            { name: 'Probability', color: 'orange' },
            { name: 'Cognitive Psychology', color: 'yellow' },
            { name: 'Decision Mechanism', color: 'green' },
            { name: 'Nobel Prize', color: 'blue' },
            { name: 'Statistics', color: 'purple' },
            { name: 'Regression to Mean', color: 'pink' },
            { name: 'Performance Evaluation', color: 'gray' },
            { name: 'Planning', color: 'brown' },
            { name: 'Project Management', color: 'red' },
            { name: 'Overconfidence', color: 'orange' },
            { name: 'Forecasting', color: 'yellow' },
            { name: 'Risk Assessment', color: 'green' },
            { name: 'Behavioral Economics', color: 'blue' },
            { name: 'Loss Aversion', color: 'purple' },
            { name: 'Investment Psychology', color: 'pink' },
            { name: 'Decision Framework', color: 'gray' },
            { name: 'Optimism Bias', color: 'brown' },
            { name: 'Framing Effect', color: 'red' },
            { name: 'Communication', color: 'orange' },
            { name: 'Negotiation', color: 'yellow' },
            { name: 'Price Judgment', color: 'green' },
            { name: 'Cognitive Mechanism', color: 'blue' },
            { name: 'Decision Analysis', color: 'purple' },
            { name: 'Intuition Trap', color: 'pink' },
            { name: 'Metacognition', color: 'gray' },
            { name: 'Decision Optimization', color: 'brown' },
            { name: 'Experience Design', color: 'red' },
            { name: 'Peak-End Rule', color: 'orange' },
            { name: 'Expert', color: 'yellow' },
            { name: 'Uncertainty', color: 'green' },
            { name: 'Narrative', color: 'blue' },
            { name: 'Story Thinking', color: 'purple' },
            { name: 'Hindsight Bias', color: 'pink' },
            { name: 'Post-mortem', color: 'gray' },
            { name: 'Evaluation', color: 'brown' },
            { name: 'Information Processing', color: 'red' },
            { name: 'Value Assessment', color: 'orange' },
            { name: 'Ownership Psychology', color: 'yellow' }
          ]
        }
      },
      'Related Munger Model': { rich_text: {} }
    }
  };

  console.log('Updating schema for database:', DB_ID);
  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(schemaUpdates)
  });

  const data = await res.json();
  if (res.ok) {
    console.log('Schema updated successfully!');
    console.log('Properties:', Object.keys(data.properties || {}));
  } else {
    console.error('Error:', data.message || JSON.stringify(data));
  }
}

updateSchema().catch(e => console.error('Error:', e.message));