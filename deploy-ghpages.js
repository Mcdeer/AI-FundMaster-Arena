#!/usr/bin/env node
/**
 * GitHub Pages 部署脚本
 * 将 dist/ + public/stocks.json 复制到 docs/ 目录
 */

import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 1. 构建前端
console.log('🔨 Building frontend...');
execSync('npx vite build', { stdio: 'inherit', cwd: __dirname });

// 2. 清理并重建 docs/
const docsDir = join(__dirname, 'docs');
if (existsSync(docsDir)) rmSync(docsDir, { recursive: true });
mkdirSync(docsDir, { recursive: true });

// 3. 复制 dist/ → docs/
console.log('📦 Copying dist/ → docs/...');
cpSync(join(__dirname, 'dist'), docsDir, { recursive: true });

// 4. 复制 stocks.json
const stocksSrc = join(__dirname, 'public', 'stocks.json');
const stocksDst = join(docsDir, 'stocks.json');
if (existsSync(stocksSrc)) {
  cpSync(stocksSrc, stocksDst);
  console.log('📊 stocks.json copied');
} else {
  console.error('❌ stocks.json not found in public/');
  process.exit(1);
}

// 5. 验证
const files = ['index.html', 'stocks.json'];
for (const f of files) {
  if (!existsSync(join(docsDir, f))) {
    console.error(`❌ Missing: docs/${f}`);
    process.exit(1);
  }
}

console.log('✅ docs/ ready for GitHub Pages deployment!');
console.log('');
console.log('Next steps:');
console.log('  git add docs/ .gitignore');
console.log('  git commit -m "Deploy to GitHub Pages"');
console.log('  git push origin main');
console.log('  Then: GitHub repo → Settings → Pages → Source: "Deploy from a branch" → Branch: main /docs');