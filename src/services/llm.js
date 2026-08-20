/**
 * 统一LLM服务
 * 降级链：primary API → 离线模板
 * 所有配置从 config.js 读取，零硬编码默认值
 */

const CFG = window.LLM_CONFIG || {};
// 兼容旧版 eastmoney 字段 → 新版统一为 primary
const PRIMARY = CFG.primary || CFG.eastmoney || { baseUrl: '', apiKey: '', model: '' };

let preloadPromise = null;
let llmErrors = [];

const TIMEOUT_MS = 30000; // reasoning 模型需要较长时间

export function preloadCommentary(analysis) {
  llmErrors = [];
  preloadPromise = callPrimary(buildPrompt(analysis)).then(text => {
    return text ? [{ model: 'AI', text }] : null;
  });
  return preloadPromise;
}

export async function getCommentary() {
  if (!preloadPromise) {
    return { results: null, errors: [{ api: 'System', error: '未发起请求' }], loading: false };
  }
  let resolved = false;
  let result = null;
  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => { if (!resolved) resolve({ stillLoading: true }); }, 100);
  });
  const raceResult = await Promise.race([preloadPromise, timeoutPromise]);
  if (raceResult && raceResult.stillLoading) {
    result = await preloadPromise;
  } else {
    result = raceResult;
  }
  preloadPromise = null;
  if (!result || result.length === 0) {
    return { results: null, errors: [...llmErrors], loading: false };
  }
  return { results: result, errors: [...llmErrors], loading: false };
}

export function isLoading() {
  return preloadPromise !== null;
}

function buildPrompt(analysis) {
  const { styleTag, matchPerson, matchPersonDesc, matchPersonOrg, metrics } = analysis;
  const sectors = Object.entries(metrics.sectorWeights || {}).map(([k, v]) => `${k}${v.toFixed(0)}%`).join('、');
  const markets = Object.entries(metrics.marketWeights || {}).map(([k, v]) => {
    const names = { 'a-share': 'A股', 'hk': '港股', 'us': '美股', 'index': '指数ETF' };
    return `${names[k] || k}${v.toFixed(0)}%`;
  }).join('、');

  const returnRate = metrics.annualizedReturn || 0;
  const isProfit = returnRate >= 0;

  return `你是东方财富的资深基金经理，点评以下投资组合（中文，200-250字，分段，用Markdown但不用标题）：

- 风格标签：${styleTag}
- 对标人物：${matchPerson}（${matchPersonDesc}${matchPersonOrg ? '，' + matchPersonOrg : ''}）
- 行业分布：${sectors}
- 市场分布：${markets}
- 年化收益：${metrics.annualizedReturn}%
- 最大回撤：${metrics.maxDrawdown}%
- 夏普比率：${metrics.sharpeRatio}
- 杠杆：${metrics.leverage || 1}x
- 持仓：${metrics.stockCount}只

写作要求：
1. 幽默风趣，用股民梗，先夸后吐槽，对标人物调侃，给建议
2. 少用引号，不要给每个词加引号，直接说即可
3. 适度用emoji，不要每句都加
4. 最后一段必须自然地引导到东方财富产品：
${isProfit
    ? `- 用户赚了钱，邀请他去东方财富股吧分享经验，例如"赚了别藏着，去东方财富股吧晒晒操作，让韭菜们学学"或类似表达`
    : `- 用户亏了钱，推荐东方财富APP帮他扭亏，例如"亏了别慌，下载东方财富APP，权威专业及时，帮你找回场子"或类似表达`}
5. 引导要巧妙自然，像朋友聊天一样带出来，不要像广告`;
}

/**
 * 剥离 reasoning 模型的思考过程，只保留最终回复
 */
function stripReasoning(text) {
  if (!text) return '';

  const markers = [
    /最终回答[：:]\s*/,
    /最终点评[：:]\s*/,
    /以下是点评[：:]\s*/,
    /点评如下[：:]\s*/,
    /回复[：:]\s*\n/,
  ];
  for (const marker of markers) {
    const match = text.match(marker);
    if (match) {
      const after = text.slice(match.index + match[0].length).trim();
      if (after.length > 50) return after;
    }
  }

  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  if (paragraphs.length >= 3) {
    for (let i = paragraphs.length - 1; i >= 0; i--) {
      const p = paragraphs[i].trim();
      if (!/^(我们|首先|需要|用户|任务|好的|让我|我来|根据|这个|以上|下面|那么|所以|因此|总之|现在)/.test(p) && p.length > 30) {
        return paragraphs.slice(i).join('\n\n');
      }
    }
  }

  const cleaned = text.replace(/^.*?我们需要.*?\n/s, '').trim();
  if (cleaned.length > 50) return cleaned;

  return text.trim();
}

async function callPrimary(prompt) {
  if (!PRIMARY.apiKey) {
    llmErrors.push({ api: 'API', error: '未配置 apiKey（请创建 config.js 并填入 Key）' });
    return null;
  }

  const apiBase = PRIMARY.baseUrl || '/api';
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PRIMARY.apiKey}`,
      },
      body: JSON.stringify({
        model: PRIMARY.model,
        messages: [
          { role: 'system', content: '你是东方财富的资深基金经理。直接输出点评正文，禁止输出思考过程。少用引号，适度emoji，结尾自然引导到东方财富产品。' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
      signal: ctrl.signal,
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      llmErrors.push({ api: 'API', error: `HTTP ${resp.status}${errText ? ': ' + errText.slice(0, 200) : ''}` });
      return null;
    }

    const data = await resp.json();
    const message = data.choices?.[0]?.message;
    let text = (message?.content || '').trim();
    if (!text && message?.reasoning_content) {
      text = stripReasoning(message.reasoning_content);
    }
    if (!text) {
      llmErrors.push({ api: 'API', error: '返回内容为空（模型未输出有效回复）' });
    }
    return text || null;
  } catch (e) {
    const msg = e.name === 'AbortError'
      ? `请求超时（${TIMEOUT_MS / 1000}秒）。请检查：1) 是否在公司内网 2) Vite 代理是否正常 3) API 地址是否正确`
      : (e.message || '网络错误');
    llmErrors.push({ api: 'API', error: msg });
    console.warn('[LLM]', e.message);
    return null;
  } finally {
    clearTimeout(t);
  }
}

/**
 * 简单 Markdown 渲染（导出备用）
 */
export function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-neon-blue">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p style="margin-bottom:10px;line-height:1.8;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
}