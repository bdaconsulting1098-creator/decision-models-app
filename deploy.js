const { spawn } = require('child_process');
const path = require('path');
const vc = path.join(process.env.APPDATA, 'QClaw', 'npm-global', 'node_modules', 'vercel', 'dist', 'vc.js');

const env = {
  ...process.env,
  NOTION_TOKEN: 'ntn_b5767617263a5Jtnd8Of4bATiyrpzoZRHOYK9F3czjkfd6'
};

const p = spawn(process.execPath, [vc, '--yes', 'deploy', '--prod'], {
  cwd: 'C:/Users/bdademo/.qclaw/workspace/decision-models-app',
  env,
  stdio: 'inherit'
});
p.on('close', code => process.exit(code));