'use strict';
const https = require('https');

const data = JSON.stringify({
  scenario: "Should I take a job with higher pay but longer commute, or lower pay closer to home?",
  models: [],
  history: []
});

const options = {
  hostname: 'decision-models-app.vercel.app',
  port: 443,
  path: '/api/decide',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Raw:', body.substring(0, 500));
  });
});
req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
