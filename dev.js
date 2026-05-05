// Local dev server — uses OpenClaw gateway at 127.0.0.1:28789 (no API key needed)
const http = require('http');
const fs = require('fs');
const path = require('path');

const modelsHandler = require('./api/models');
const decideHandler = require('./api/decide');

// Initialize token from .env file
function initToken() {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/NOTION_TOKEN=(\S+)/);
      if (match) {
        console.log('✓ Loaded Notion token from .env');
        return match[1];
      }
    }
  } catch (e) {
    console.error('Failed to load .env token:', e.message);
  }
  console.log('⚠ No Notion token found in .env');
  return '';
}

process.env.NOTION_TOKEN = initToken();

function wrapRes(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.setHeader('Content-Type','application/json'); res.end(JSON.stringify(data)); return res; };
  return res;
}

const server = http.createServer(async (req, res) => {
  wrapRes(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // Local mode: use OpenClaw gateway with its auth token
  process.env.OPENAI_API_KEY = 'be8614634fca8f0d23b33a62206a79c5ebb054c8a7e6dbe7';
  process.env.OPENAI_BASE_URL = 'http://127.0.0.1:28789/v1';
  process.env.LLM_MODEL = 'openclaw/modelroute';

  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/models' && req.method === 'GET') {
    await modelsHandler(req, res);
    return;
  }

  if (url.pathname === '/api/decide' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body);
        await decideHandler(req, res);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    });
    return;
  }

  // Serve static files from public/
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  const fullPath = path.join(__dirname, 'public', filePath);
  if (fs.existsSync(fullPath)) {
    const ext = path.extname(fullPath);
    const types = { '.html':'text/html; charset=utf-8', '.js':'application/javascript', '.css':'text/css', '.json':'application/json' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
    fs.createReadStream(fullPath).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(3456, () => console.log('🧠 Local dev server at http://localhost:3456 (using OpenClaw gateway, no API key needed)'));