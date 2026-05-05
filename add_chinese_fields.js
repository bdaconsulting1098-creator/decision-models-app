// Add Chinese fields to Notion database schema
// Usage: node add_chinese_fields.js

const fetch = require('node-fetch');

const NOTION_TOKEN = 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';
const DB_ID = '350157c6-daef-80dd-a321-e6ff0c601530';

const headers = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

async function addChineseFields() {
  // First, get current database schema
  const dbResponse = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, {
    method: 'GET',
    headers
  });
  
  const db = await dbResponse.json();
  console.log('Current properties:', Object.keys(db.properties));

  // Add Chinese text fields
  const propertiesToAdd = {
    'Core Concept (CN)': { rich_text: {} },
    'When to Use (CN)': { rich_text: {} },
    'Example (CN)': { rich_text: {} }
  };

  // Check if fields already exist
  const existingProps = Object.keys(db.properties);
  const newProps = {};
  
  for (const [name, type] of Object.entries(propertiesToAdd)) {
    if (!existingProps.includes(name)) {
      newProps[name] = type;
      console.log(`Will add: ${name}`);
    } else {
      console.log(`Already exists: ${name}`);
    }
  }

  if (Object.keys(newProps).length === 0) {
    console.log('All Chinese fields already exist!');
    return;
  }

  // Update database schema
  const updateResponse = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ properties: newProps })
  });

  if (updateResponse.ok) {
    console.log('✅ Successfully added Chinese fields to database!');
  } else {
    const error = await updateResponse.text();
    console.error('❌ Failed to update database:', error);
  }
}

addChineseFields().catch(console.error);
