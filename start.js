/**
 * AI基金经理挑战赛 — 一键启动脚本
 * 用法: node start.js [--dev]
 *   --dev: 开发模式，启动Vite开发服务器(端口3000) + Express API(端口21818)
 *   默认: 生产模式，仅启动Express(端口21818) + 托管静态文件
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.argv.includes('--dev');

console.log('🏆 AI基金经理挑战赛');
console.log('='.repeat(40));

if (isDev) {
  console.log('🔧 开发模式启动...');
  // 启动Vite dev server
  const vite = spawn('npx', ['vite', '--port', '3000'], {
    stdio: 'inherit',
    shell: true,
  });

  // 启动Express API
  const api = spawn('node', ['server/index.js'], {
    stdio: 'inherit',
    shell: true,
  });

  process.on('SIGINT', () => {
    vite.kill();
    api.kill();
    process.exit();
  });
} else {
  console.log('🚀 生产模式启动 (端口 21818)');
  // 检查前端是否已构建
  const distPath = join(__dirname, 'dist', 'index.html');
  if (!fs.existsSync(distPath)) {
    console.log('⚠️  前端未构建，正在构建...');
    const build = spawn('npx', ['vite', 'build'], {
      stdio: 'inherit',
      shell: true,
    });
    build.on('close', (code) => {
      if (code === 0) {
        startServer();
      } else {
        console.error('构建失败，退出');
        process.exit(1);
      }
    });
  } else {
    startServer();
  }
}

function startServer() {
  const server = spawn('node', ['server/index.js'], {
    stdio: 'inherit',
    shell: true,
  });

  server.on('error', (err) => {
    console.error('服务器启动失败:', err);
    process.exit(1);
  });
}