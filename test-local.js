'use strict';
// Load .env manually
const fs = require('fs');
const envPath = 'C:/Users/bdademo/.qclaw/workspace/decision-models-app/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
console.log('NOTION_TOKEN loaded:', !!process.env.NOTION_TOKEN);

const http = require('http');
const handler = require('./api/decide.js');

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/decide') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const mockReq = { method: 'POST', body: data };
        const mockRes = {
          statusCode: 200,
          _headers: {},
          setHeader: function(k, v) { this._headers[k] = v; },
          status: function(code) { this.statusCode = code; return this; },
          json: function(obj) {
            console.log('Status:', this.statusCode);
            console.log('Debug:', JSON.stringify(obj._debug));
            console.log('Models:', obj.models?.length);
            console.log('Analysis (first 500 chars):', (obj.analysis || '').substring(0, 500));
            console.log('Error:', obj.error);
            res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(obj));
            server.close();
          },
          end: function() { res.end(); server.close(); }
        };
        await handler(mockReq, mockRes);
      } catch(e) {
        console.error('CRASH:', e.message);
        res.writeHead(500);
        res.end(e.message);
        server.close();
      }
    });
  } else {
    res.writeHead(404);
    res.end('not found');
  }
});

server.listen(3457, () => {
  console.log('Test server on 3457\n');
  
  const data = JSON.stringify({
    scenario: "what's today's latest news?",
    models: [],
    history: []
  });

  const req = http.request({
    hostname: 'localhost', port: 3457, path: '/api/decide', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  }, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      console.log('\nResponse status:', res.statusCode);
      try {
        const p = JSON.parse(body);
        console.log('searchTriggered:', p._debug?.searchTriggered);
        console.log('webResultsCount:', p._debug?.webResultsCount);
      } catch(e) { console.log('Raw:', body.substring(0, 300)); }
    });
  });
  req.write(data);
  req.end();
});
