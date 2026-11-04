import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const serverDir = path.resolve(rootDir, 'server');

console.log('🚀 Iniciando QuizzTIC (Backend en :3000 y Frontend en :5173)...');

// Iniciar Backend
const server = spawn('npm', ['run', 'dev'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

// Iniciar Frontend Vite
const client = spawn('npm', ['run', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n🛑 Deteniendo servidores...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

