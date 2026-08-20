/**
 * Cloudflare Worker — AI API CORS 代理
 * 
 * 部署到：https://aiproxy.mcy722801822.workers.dev
 * 环境变量：DEEPSEEK_API_KEY（Secret 类型）
 */

export default {
  async fetch(request, env) {
    // ── CORS 预检 ──────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // ── 只接受 POST /chat/completions ──────────────────
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat/completions') {
      return json({ error: 'Not found' }, 404);
    }

    // ── 从环境变量读取 Key（不信任客户端传来的）───────
    const apiKey = env.DEEPSEEK_API_KEY || env.DEEPSEEK_KEY;
    if (!apiKey) {
      return json({ error: 'Worker 未配置 API Key 环境变量' }, 500);
    }

    try {
      // 读取客户端请求体，忽略客户端发来的 Authorization
      const body = await request.json();

      // ── 转发到 DeepSeek，使用服务端 Key ──────────────
      const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      const data = await resp.json();

      return new Response(JSON.stringify(data), {
        status: resp.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (e) {
      return json({ error: '代理请求失败: ' + e.message }, 502);
    }
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}