// ============================================================
//  API 配置模板
//  1. 复制此文件为 config.js：  cp config.example.js config.js
//  2. 填入你的 API Key
//  3. config.js 已被 .gitignore 排除，不会提交到 Git
// ============================================================

window.LLM_CONFIG = {
  // ── 主 API（OpenAI 兼容格式）─────────────────────────────
  // 支持任意兼容 OpenAI Chat Completions 的服务：
  //   DeepSeek、通义千问、智谱 GLM、Moonshot、OpenAI 等
  primary: {
    baseUrl: 'https://your-api.example.com/v1',   // ← API 地址
    apiKey:  '在此填入你的 API Key',               // ← API Key
    model:   'gpt-4o-mini',                       // ← 模型名
  },

  // ── 备用 API：Google Gemini ───────────────────────────────
  // 申请地址：https://aistudio.google.com/apikey
  // 留空则跳过 Gemini
  geminiApiKey: '在此填入你的 Gemini API Key',

  // ── 调试模式 ─────────────────────────────────────────────
  // true = 同时调用 primary + gemini，对比两套点评
  debugMode: false,
};

// ── 实时行情（可选）────────────────────────────────────────
window.DATA_CONFIG = {
  useRealData: false,  // true = 尝试拉取东方财富实时行情
};