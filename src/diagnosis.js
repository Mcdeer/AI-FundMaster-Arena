/**
 * 风格诊断页
 * 投资人格画像、雷达图、AI幽默点评
 */

import { renderRadarChart } from './charts.js';

/**
 * 渲染风格诊断页
 * @param {Object} analysis - API风格诊断结果
 */
export function renderDiagnosis(analysis) {
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

  // AI点评
  const commentaryText = document.getElementById('commentary-text');
  if (commentaryText && commentary) {
    // 将 \n\n 转换为段落，保留格式
    const formatted = commentary.split('\n\n').map(p => p.trim()).filter(Boolean);
    commentaryText.innerHTML = formatted.map((p, i) =>
      '<p style="margin-bottom:' + (i < formatted.length - 1 ? '12px' : '0') + ';line-height:1.8;">' + p + '</p>'
    ).join('');
  }

  // 附加指标
  addMetricsSummary(metrics);
}

// ==================== 打字机效果 ====================
function typeWriter(element, text, speed = 30) {
  element.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
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
  summaryDiv.className = 'grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-dark-600/30';

  // 四舍五入辅助函数
  const roundTo = (value, decimals) => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  };

  const items = [
    { label: '年化收益', value: `${metrics.annualizedReturn >= 0 ? '+' : ''}${roundTo(metrics.annualizedReturn, 1)}%`, color: metrics.annualizedReturn >= 0 ? 'text-neon-red' : 'text-neon-green' },
    { label: '最大回撤', value: `${roundTo(metrics.maxDrawdown, 1)}%`, color: 'text-neon-blue' },
    { label: '夏普比率', value: roundTo(metrics.sharpeRatio, 2), color: 'text-gold-400' },
    { label: '选股ROE', value: `${roundTo(metrics.roe, 1)}%`, color: 'text-gray-300' },
  ];

  summaryDiv.innerHTML = items.map(item => `
    <div class="text-center">
      <div class="text-xs text-gray-500 mb-1">${item.label}</div>
      <div class="font-mono font-bold ${item.color}">${item.value}</div>
    </div>
  `).join('');

  commentaryDiv.appendChild(summaryDiv);
}