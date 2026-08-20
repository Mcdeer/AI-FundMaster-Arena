// ============================================================
//  API 配置模板
//  1. 复制此文件为 config.js：  cp config.example.js config.js
//  2. 填入 API Key
//  3. config.js 已被 .gitignore 排除，不会提交到 Git
// ============================================================
//
// 📡 两种使用方式：
//
//   【本地开发】
//   baseUrl: ''         ← 空字符串，走 Vite 代理（vite.config.js）
//   apiKey:  'sk-...'   ← 你的 API Key
//
//   【GitHub Pages 生产部署】
//   需先部署 Cloudflare Worker 代理（见 worker.js），然后：
//   baseUrl: 'https://你的名字.workers.dev'  ← Worker 地址
//   不需要填 apiKey（Key 在 Worker 的环境变量里）
//   apiKey:  'skip'     ← 填任意值（Worker 不使用此字段）
//
//   没有 Worker？baseUrl 和 apiKey 都留空，自动降级为离线模板
// ============================================================

window.LLM_CONFIG = {
  // ── API 配置（OpenAI 兼容格式）──────────────────────────
  primary: {
    // 开发环境：留空 → 走 Vite 代理
    // 生产环境：填 Cloudflare Worker URL
    baseUrl: '',

    // API Key（生产环境走 Worker 时填任意非空值即可）
    apiKey:  '在此填入你的 API Key',

    // 模型名（DeepSeek: deepseek-chat，通义千问: qwen-plus）
    model:   'deepseek-chat',
  },
};

// ── 实时行情（可选）────────────────────────────────────────
window.DATA_CONFIG = {
  useRealData: false,
};