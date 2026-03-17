const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const outputFile = path.join(projectRoot, 'expo-url.txt');
const expoCli = path.join(projectRoot, 'node_modules', 'expo', 'bin', 'cli');

if (!fs.existsSync(expoCli)) {
  process.stderr.write('Expo CLI file not found. Run npm install in frontend first.\n');
  process.exit(1);
}

const expoArgs = [expoCli, 'start', '--tunnel', '--clear'];

const child = spawn(process.execPath, expoArgs, {
  cwd: projectRoot,
  env: process.env,
  stdio: ['inherit', 'pipe', 'pipe'],
});

let latestExpoUrl = null;
let latestHttpUrl = null;

function writeOutput(chunk, stream) {
  const text = chunk.toString();
  stream.write(text);

  const matches = text.match(/(?:exp|https?):\/\/[^\s]+/g);
  if (!matches || matches.length === 0) {
    return;
  }

  const expMatch = matches.find((url) => url.startsWith('exp://'));
  const found = expMatch || matches[matches.length - 1];

  if (found.startsWith('http://') || found.startsWith('https://')) {
    latestHttpUrl = found;
  }

  if (found === latestExpoUrl) {
    return;
  }

  latestExpoUrl = found;
  const content = [
    `EXPO_URL=${found}`,
    `UPDATED_AT=${new Date().toISOString()}`,
    '',
  ].join('\n');

  fs.writeFileSync(outputFile, content, 'utf8');
  process.stdout.write(`\nSaved Expo URL to ${outputFile}\n`);
  process.stdout.write(`Current Expo URL: ${found}\n\n`);
}

child.stdout.on('data', (chunk) => writeOutput(chunk, process.stdout));
child.stderr.on('data', (chunk) => writeOutput(chunk, process.stderr));

child.on('close', (code) => {
  process.exit(code || 0);
});

function shutdown() {
  if (!child.killed) {
    child.kill('SIGINT');
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
