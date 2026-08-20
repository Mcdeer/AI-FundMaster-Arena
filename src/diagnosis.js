/**
 * 风格诊断页
 * 投资人格画像、雷达图、AI幽默点评
 */

import { renderRadarChart } from './charts.js';

/**
 * 渲染风格诊断页
 * @param {Object} analysis - API风格诊断结果
 * @param {Object} llmStatus - LLM加载状态 { results, errors, loading }
 */
export function renderDiagnosis(analysis, llmStatus = null) {
  const {
    styleTag,
    matchPerson,
    matchPersonDesc,
    matchPersonOrg,
    metrics,
    radarData,
    commentary,
  } = analysis;

  // 风格标签
  const tagContainer = document.getElementById('diagnosis-tag');
  if (tagContainer) {
    tagContainer.innerHTML = `
      <span class="diagnosis-badge text-xl md:text-2xl animate-fade-in">${styleTag}</span>
    `;
  }

  // 副标题（对标人物）
  const subtitle = document.getElementById('diagnosis-subtitle');
  if (subtitle) {
    subtitle.innerHTML = `
      <span class="text-gray-400">对标人物：</span>
      <span class="text-neon-blue font-bold">${matchPerson}</span>
      <span class="text-gray-500 text-sm"> — ${matchPersonDesc}</span>
      ${matchPersonOrg ? `<span class="text-gray-600 text-sm block">${matchPersonOrg}</span>` : ''}
    `;
  }

  // 雷达图
  renderRadarChart('chart-radar', radarData, '你的基金');

  // AI点评区域
  const commentaryText = document.getElementById('commentary-text');
  if (commentaryText) {
    // 优先使用 LLM 结果
    if (llmStatus?.results && llmStatus.results.length > 0) {
      renderLLMResults(commentaryText, llmStatus.results, llmStatus.errors);
    } else if (llmStatus?.loading) {
      renderLoading(commentaryText);
    } else if (llmStatus?.errors && llmStatus.errors.length > 0) {
      // 所有API失败，显示模板 + 诊断信息
      renderTemplateWithErrors(commentaryText, commentary, llmStatus.errors);
    } else {
      // 只有模板
      renderTemplate(commentaryText, commentary);
    }
  }

  // 附加指标
  addMetricsSummary(metrics);
}

/**
 * 更新评论区域（LLM结果到达后调用）
 */
export function updateCommentary(llmStatus) {
  const commentaryText = document.getElementById('commentary-text');
  if (!commentaryText) return;

  if (llmStatus.results && llmStatus.results.length > 0) {
    renderLLMResults(commentaryText, llmStatus.results, llmStatus.errors);
  } else if (llmStatus.errors && llmStatus.errors.length > 0) {
    // 尝试从模板恢复
    const existingContent = commentaryText.innerHTML;
    if (existingContent.includes('loading-dots')) {
      // 模板内容需要从外部传入，这里用简洁提示
      renderError(commentaryText, llmStatus.errors);
    }
  }
}

// ==================== 渲染函数 ====================

function renderLLMResults(container, results, errors) {
  let html = results.map((r, i) => {
    let textHtml = r.text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-neon-blue">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .split('\n\n')
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p style="margin-bottom:10px;line-height:1.8;">${p.replace(/\n/g, '<br>')}</p>`)
      .join('');
    return `<div class="llm-result mb-3">
      <div class="text-white leading-relaxed text-sm md:text-base">${textHtml}</div>
    </div>`;
  }).join('');

  html += `<div class="mt-3 text-right text-xs text-gray-500">🤖 AI 点评 · 仅供参考</div>`;

  // 如果有部分API失败，也显示
  if (errors && errors.length > 0) {
    html += `<div class="mt-2 text-right text-xs text-gray-600">
      ⚠️ ${errors.map(e => e.api + '：' + e.error).join('；')}
    </div>`;
  }

  container.innerHTML = html;
}

function renderLoading(container) {
  container.innerHTML = `
    <div class="flex items-center gap-3 py-4">
      <div class="loading-dots flex gap-1">
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay:0.2s"></span>
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay:0.4s"></span>
      </div>
      <span class="text-gray-400 text-sm">AI正在分析你的投资风格...</span>
    </div>
  `;
}

function renderTemplateWithErrors(container, commentary, errors) {
  let html = '';
  if (commentary) {
    const formatted = commentary.split('\n\n').map(p => p.trim()).filter(Boolean);
    html += formatted.map((p, i) =>
      '<p style="margin-bottom:' + (i < formatted.length - 1 ? '12px' : '0') + ';line-height:1.8;">' + p + '</p>'
    ).join('');
  } else {
    html += '<p class="text-gray-400 text-sm">暂无可用的点评内容。</p>';
  }

  html += '<div class="mt-3 text-right text-xs text-gray-500">📋 离线模板点评 · 仅供参考</div>';

  // 错误诊断面板
  html += `<div class="mt-4 p-3 bg-dark-600/30 rounded-lg border border-dark-500/30">
    <div class="text-xs text-gray-500 mb-2">🔧 API 诊断信息</div>
    <div class="space-y-1">
      ${errors.map(e => `
        <div class="flex items-start gap-2 text-xs">
          <span class="text-red-400 flex-shrink-0">✗</span>
          <div>
            <span class="text-gray-400 font-medium">${e.api}</span>
            <span class="text-gray-500 ml-1">— ${e.error}</span>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="mt-3 pt-2 border-t border-dark-500/20 text-xs text-gray-600">
      <p class="mb-1">💡 提示：</p>
      <ul class="list-disc list-inside space-y-0.5">
        <li>复制 <code class="text-gray-500 bg-dark-500/50 px-1 rounded">config.example.js</code> → <code class="text-gray-500 bg-dark-500/50 px-1 rounded">config.js</code></li>
        <li>填入你的 API 地址和 Key（支持 OpenAI 兼容接口）</li>
        <li>开发环境请将 <code class="text-gray-500 bg-dark-500/50 px-1 rounded">baseUrl</code> 设为空字符串（走 Vite 代理）</li>
      </ul>
    </div>
  </div>`;

  container.innerHTML = html;
}

function renderTemplate(container, commentary) {
  if (!commentary) {
    container.innerHTML = '<p class="text-gray-400 text-sm">暂无可用的点评内容。</p>';
    return;
  }
  const formatted = commentary.split('\n\n').map(p => p.trim()).filter(Boolean);
  container.innerHTML = formatted.map((p, i) =>
    '<p style="margin-bottom:' + (i < formatted.length - 1 ? '12px' : '0') + ';line-height:1.8;">' + p + '</p>'
  ).join('');
  container.innerHTML += '<div class="mt-3 text-right text-xs text-gray-500">📋 离线模板点评 · 仅供参考</div>';
}

function renderError(container, errors) {
  container.innerHTML = `
    <div class="py-2">
      <p class="text-gray-400 text-sm mb-3">AI点评生成失败，请检查API配置后重试。</p>
      <div class="p-3 bg-dark-600/30 rounded-lg border border-dark-500/30">
        <div class="text-xs text-gray-500 mb-2">🔧 错误详情</div>
        ${errors.map(e => `
          <div class="flex items-start gap-2 text-xs mb-1">
            <span class="text-red-400 flex-shrink-0">✗</span>
            <span class="text-gray-400">${e.api}：${e.error}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==================== 指标摘要 ====================
function addMetricsSummary(metrics) {
  const commentaryDiv = document.getElementById('ai-commentary');
  if (!commentaryDiv) return;

  // 检查是否已存在摘要
  let summaryDiv = document.getElementById('metrics-summary');
  if (summaryDiv) summaryDiv.remove();

  summaryDiv = document.createElement('div');
  summaryDiv.id = 'metrics-summary';
  
  // 四舍五入辅助函数
  const roundTo = (value, decimals) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  };

  // 基金评级星星
  const ratingStars = '★'.repeat(metrics.fundRating || 0) + '☆'.repeat(5 - (metrics.fundRating || 0));
  const ratingColor = metrics.fundRating >= 4 ? 'text-gold-400' : metrics.fundRating >= 3 ? 'text-neon-blue' : 'text-gray-400';

  summaryDiv.innerHTML = `
    <div class="mt-4 pt-4 border-t border-dark-600/30">
      <!-- 基金评级卡片 -->
      <div class="bg-dark-700/50 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-400">基金评级</span>
          <span class="text-2xl ${ratingColor}">${ratingStars}</span>
        </div>
        <div class="flex items-center gap-4 text-xs">
          <span class="text-gray-500">风险等级:</span>
          <span class="px-2 py-1 rounded ${metrics.riskLevel === '高' ? 'bg-red-500/20 text-red-400' : metrics.riskLevel === '低' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}">${metrics.riskLevel}风险</span>
          ${metrics.ratingReasons ? `<span class="text-gray-500">|</span><span class="text-gray-400">${metrics.ratingReasons.join('、')}</span>` : ''}
        </div>
      </div>
      
      <!-- 核心指标 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">年化收益</div>
          <div class="font-mono font-bold ${metrics.annualizedReturn >= 0 ? 'text-neon-red' : 'text-neon-green'}">${metrics.annualizedReturn >= 0 ? '+' : ''}${roundTo(metrics.annualizedReturn, 1)}%</div>
        </div>
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">最大回撤</div>
          <div class="font-mono font-bold text-neon-blue">${roundTo(metrics.maxDrawdown, 1)}%</div>
        </div>
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">夏普比率</div>
          <div class="font-mono font-bold ${metrics.sharpeRatio >= 1 ? 'text-neon-green' : 'text-gray-300'}">${roundTo(metrics.sharpeRatio, 2)}</div>
        </div>
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">胜率</div>
          <div class="font-mono font-bold text-gray-300">${roundTo(metrics.winRate, 1)}%</div>
        </div>
      </div>
      
      <!-- 专业指标 -->
      <div class="bg-dark-700/30 rounded-xl p-4">
        <div class="text-xs text-gray-500 mb-3">专业风险调整指标</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div class="text-xs text-gray-600 mb-1">索提诺比率</div>
            <div class="font-mono text-sm text-gray-300">${roundTo(metrics.sortinoRatio, 2)}</div>
            <div class="text-xs text-gray-600">只考虑下行风险</div>
          </div>
          <div>
            <div class="text-xs text-gray-600 mb-1">信息比率</div>
            <div class="font-mono text-sm ${metrics.informationRatio >= 0.5 ? 'text-neon-green' : 'text-gray-300'}">${roundTo(metrics.informationRatio, 2)}</div>
            <div class="text-xs text-gray-600">超额收益/跟踪误差</div>
          </div>
          <div>
            <div class="text-xs text-gray-600 mb-1">Calmar比率</div>
            <div class="font-mono text-sm text-gray-300">${roundTo(metrics.calmarRatio, 2)}</div>
            <div class="text-xs text-gray-600">年化收益/最大回撤</div>
          </div>
          <div>
            <div class="text-xs text-gray-600 mb-1">盈亏比</div>
            <div class="font-mono text-sm text-gray-300">${roundTo(metrics.profitLossRatio, 2)}</div>
            <div class="text-xs text-gray-600">平均盈利/平均亏损</div>
          </div>
        </div>
      </div>
    </div>
  `;

  commentaryDiv.appendChild(summaryDiv);
}