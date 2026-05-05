process.env.NOTION_TOKEN = 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6';
process.env.KAHNEMAN_PAGE_ID = '350157c6-daef-8146-a836-e239419718cb';
process.env.MODELS_PAGE_ID = '350157c6-daef-80cf-9e50-eb644e3a885e';

const handler = require('./api/models.js');
const mockReq = {};
const mockRes = {
  setHeader: () => {},
  status: (c) => { console.log('Status:', c); return mockRes; },
  json: (d) => {
    console.log('Count:', d.count);
    d.models.slice(0, 3).forEach((m, i) => {
      console.log(`\n--- Model ${i+1} ---`);
      console.log('Name:', m.name);
      console.log('English:', m.englishName);
      console.log('Concept:', (m.coreConcept || '').substring(0, 80));
      console.log('Example:', (m.example || '').substring(0, 80));
    });
  }
};
handler(mockReq, mockRes).catch(e => console.error(e));
