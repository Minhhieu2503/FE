#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const input = (process.argv[2] || '').trim();

if (!input) {
  console.error('Usage: node scripts/apply-backend-tunnel-url.cjs <https://your-tunnel-domain>');
  process.exit(1);
}

let url;
try {
  url = new URL(input);
} catch {
  console.error('Invalid URL. Example: https://1015c48e80a412.lhr.life');
  process.exit(1);
}

const normalizedOrigin = `${url.protocol}//${url.host}`;
const frontendApiBase = `${normalizedOrigin}/auth`;
const backendRedirect = `${normalizedOrigin}/auth/google/oauth/callback`;

const repoRoot = path.resolve(__dirname, '..', '..');
const frontendEnvPath = path.resolve(repoRoot, 'frontend', '.env');
const backendEnvPath = path.resolve(repoRoot, 'backend', '.env');
const tunnelRecordPath = path.resolve(repoRoot, 'frontend', 'backend-tunnel-url.txt');

function upsertEnvVar(filePath, key, value) {
  const source = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  const hasKey = new RegExp(`^${key}=.*$`, 'm').test(source);
  let updated = source;

  if (hasKey) {
    updated = source.replace(new RegExp(`^${key}=.*$`, 'm'), `${key}=${value}`);
  } else {
    const suffix = source.endsWith('\n') || source.length === 0 ? '' : '\n';
    updated = `${source}${suffix}${key}=${value}\n`;
  }

  fs.writeFileSync(filePath, updated, 'utf8');
}

upsertEnvVar(frontendEnvPath, 'EXPO_PUBLIC_API_BASE_URL', frontendApiBase);
upsertEnvVar(backendEnvPath, 'GOOGLE_REDIRECT_URI', backendRedirect);

let tunnelRecordNotice = '- Recorded in frontend/backend-tunnel-url.txt';
try {
  fs.writeFileSync(tunnelRecordPath, `${normalizedOrigin}\n`, 'utf8');
} catch (error) {
  tunnelRecordNotice = '- Skipped writing frontend/backend-tunnel-url.txt (file is currently locked by an active tunnel process)';
}

console.log('Tunnel URL applied successfully.');
console.log(`- EXPO_PUBLIC_API_BASE_URL=${frontendApiBase}`);
console.log(`- GOOGLE_REDIRECT_URI=${backendRedirect}`);
console.log(tunnelRecordNotice);
