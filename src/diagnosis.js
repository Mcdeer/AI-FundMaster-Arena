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
  if (commentaryText) {
    if (analysis.aiResults && analysis.aiResults.length > 0) {
      let html = analysis.aiResults.map(r => r.html).join('<div style="margin:16px 0;border-top:1px dashed rgba(255,255,255,0.1);"></div>');
      const models = analysis.aiResults.map(r => r.model).join(' + ');
      html += '<div style="margin-top:12px;text-align:right;font-size:11px;color:#6b7280;">🤖 点评由 ' + models + ' 生成 · 仅供参考</div>';
      commentaryText.innerHTML = html;
    } else if (commentary) {
      const formatted = commentary.split('\n\n').map(p => p.trim()).filter(Boolean);
      commentaryText.innerHTML = formatted.map((p, i) =>
        '<p style="margin-bottom:' + (i < formatted.length - 1 ? '12px' : '0') + ';line-height:1.8;">' + p + '</p>'
      ).join('');
      commentaryText.innerHTML += '<div style="margin-top:12px;text-align:right;font-size:11px;color:#6b7280;">📋 离线模板点评 · 仅供参考</div>';
    }
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