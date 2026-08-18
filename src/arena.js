/**
 * 竞技场页
 * 排名榜、收益曲线图、关键指标对比表
 */

import { renderReturnChart, toggleChartMode } from './charts.js';

// 事件监听器状态跟踪
let chartModeListenersBound = false;

/**
 * 渲染竞技场
 * @param {Object} result - API回测结果 {fundName, period, results:[...]}
 */
export function renderArena(result) {
  const { results, amount, leverage } = result;
  const investAmount = amount || 100000;
  const lev = leverage || 1;

  // 按排名排序
  const sorted = [...results].sort((a, b) => a.rank - b.rank);

  renderRanking(sorted, investAmount, lev);
  renderReturnChart('chart-returns', sorted, investAmount, lev);
  renderMetrics(sorted, investAmount, lev);

  // 图表模式切换（只绑定一次）
  if (!chartModeListenersBound) {
    document.getElementById('chart-mode-pct')?.addEventListener('click', () => toggleChartMode('pct'));
    document.getElementById('chart-mode-value')?.addEventListener('click', () => toggleChartMode('value'));
    chartModeListenersBound = true;
  }
}

// ==================== 排行榜 ====================
function renderRanking(results, investAmount, leverage) {
  const container = document.getElementById('ranking-table');
  if (!container) return;

  const medals = ['🥇', '🥈', '🥉'];

  container.innerHTML = results.map((r, i) => {
    const isUser = r.isUser;
    const rankBadge = i < 3 ? medals[i] : r.rank;
    const returnColor = r.totalReturn >= 0 ? 'text-neon-red' : 'text-neon-green';
    const bgClass = isUser ? 'user-highlight' : '';
    const rawLevReturn = r.totalReturn * leverage;
    const levReturn = parseFloat(Math.max(-100, rawLevReturn).toFixed(1));
    const absPnL = Math.round(investAmount * levReturn / 100);
    const absPnLStr = (levReturn >= 0 ? '+' : '') + Number(absPnL).toLocaleString();
    const maxDD = parseFloat((r.maxDrawdown * leverage).toFixed(1));
    
    // 生成持仓详情HTML（仅AI对手）
    let holdingsHtml = '';
    if (!isUser && r.holdingsDetail && r.holdingsDetail.length > 0) {
      const holdingsList = r.holdingsDetail.map(h => 
        `<div class="flex justify-between text-xs py-1">
          <span class="text-gray-400">${h.name}</span>
          <span class="text-neon-blue font-mono">${h.weight}%</span>
        </div>`
      ).join('');
      holdingsHtml = `
        <div class="mt-2 pt-2 border-t border-dark-600/30 holdings-detail hidden" id="holdings-${i}">
          <div class="text-xs text-gray-500 mb-1">持仓成分</div>
          ${holdingsList}
        </div>
      `;
    }

    return `
      <div class="rank-row ${bgClass} animate-slide-up" style="animation-delay: ${i * 0.08}s">
        <span class="rank-badge">${rankBadge}</span>
        <span class="text-2xl flex-shrink-0">${r.icon || ''}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-white font-medium text-sm truncate">
              ${isUser ? '⭐ ' : ''}${r.label}
            </span>
            ${r.isBenchmark ? '<span class="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-dark-500/50">基准</span>' : ''}
            ${!r.isUser && !r.isBenchmark ? '<span class="text-xs text-neon-purple px-2 py-0.5 rounded-full bg-dark-500/50">AI</span>' : ''}
          </div>
          <div class="text-xs text-gray-500">${r.description || ''}</div>
          ${!isUser && r.holdingsDetail ? `<button class="text-xs text-neon-blue mt-1 hover:underline" onclick="toggleHoldings(${i})">查看持仓</button>` : ''}
          ${holdingsHtml}
        </div>
        <div class="text-right flex-shrink-0">
          <div class="font-mono font-bold ${returnColor} text-base">
            ${levReturn >= 0 ? '+' : ''}${levReturn.toFixed(1)}%
          </div>
          <div class="text-xs ${returnColor} font-mono">
            ${absPnLStr}元
          </div>
          <div class="text-xs text-gray-500">
            最大回撤 ${maxDD}%
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // 添加切换持仓显示的函数
  if (!window.toggleHoldings) {
    window.toggleHoldings = function(index) {
      const el = document.getElementById(`holdings-${index}`);
      if (el) {
        el.classList.toggle('hidden');
      }
    };
  }
}

// ==================== 指标对比表 ====================
function renderMetrics(results, investAmount, leverage) {
  const container = document.getElementById('metrics-table');
  if (!container) return;

  // 基础指标
  const basicHeaders = ['基金', '累计收益', '年化收益', '最大回撤', '夏普比率', '胜率'];
  
  // 专业指标（可展开）
  const proHeaders = ['索提诺', '信息比率', 'Calmar', '盈亏比', '评级', '风险等级'];

  const rows = results.map(r => {
    const returnCls = r.totalReturn >= 0 ? 'metric-up' : 'metric-down';
    const rawLevReturn = r.totalReturn * leverage;
    const levReturn = parseFloat(Math.max(-100, rawLevReturn).toFixed(1));
    
    // 基金评级星星
    const ratingStars = '★'.repeat(r.fundRating || 0) + '☆'.repeat(5 - (r.fundRating || 0));
    
    return `
      <tr class="border-b border-dark-600/30 hover:bg-dark-700/30 transition-colors">
        <td class="px-3 py-2.5 text-sm text-white font-medium whitespace-nowrap">
          ${r.isUser ? '⭐ ' : r.icon + ' '}${r.label}
        </td>
        <td class="px-3 py-2.5 font-mono text-sm ${returnCls}">${levReturn >= 0 ? '+' : ''}${levReturn.toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${r.annualizedReturn >= 0 ? '+' : ''}${r.annualizedReturn}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${(r.maxDrawdown * leverage).toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm ${r.sharpeRatio >= 1 ? 'text-neon-green' : r.sharpeRatio >= 0.5 ? 'text-gray-300' : 'text-neon-red'}">${r.sharpeRatio}</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${r.winRate}%</td>
      </tr>
      ${r.isUser ? `
      <tr class="border-b border-dark-600/30 bg-dark-700/20">
        <td class="px-3 py-2 text-xs text-gray-500">专业指标</td>
        <td class="px-3 py-2 font-mono text-xs text-gray-400">${r.sortinoRatio || '-'}</td>
        <td class="px-3 py-2 font-mono text-xs ${r.informationRatio >= 0.5 ? 'text-neon-green' : 'text-gray-400'}">${r.informationRatio || '-'}</td>
        <td class="px-3 py-2 font-mono text-xs text-gray-400">${r.calmarRatio || '-'}</td>
        <td class="px-3 py-2 font-mono text-xs text-gray-400">${r.profitLossRatio || '-'}</td>
        <td class="px-3 py-2 font-mono text-xs text-gold-400">${ratingStars}</td>
        <td class="px-3 py-2 font-mono text-xs ${r.riskLevel === '高' ? 'text-neon-red' : r.riskLevel === '低' ? 'text-neon-green' : 'text-gray-400'}">${r.riskLevel}风险</td>
      </tr>
      ` : ''}
    `;
  }).join('');

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="metrics-table w-full text-xs">
        <thead>
          <tr class="border-b border-dark-500/30">
            ${basicHeaders.map(h => `<th class="px-3 py-2 text-left font-medium whitespace-nowrap">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <div class="mt-3 p-3 bg-dark-700/30 rounded-lg text-xs text-gray-400">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-neon-blue">ℹ️</span>
          <span class="font-medium">专业指标说明：</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div><span class="text-neon-purple">夏普比率</span> - 风险调整后收益，>1优秀</div>
          <div><span class="text-neon-purple">索提诺比率</span> - 只考虑下行风险</div>
          <div><span class="text-neon-purple">信息比率</span> - 超额收益/跟踪误差</div>
          <div><span class="text-neon-purple">Calmar比率</span> - 年化收益/最大回撤</div>
          <div><span class="text-neon-purple">盈亏比</span> - 平均盈利/平均亏损</div>
          <div><span class="text-gold-400">★评级</span> - 五星基金评级体系</div>
        </div>
      </div>
    </div>
  `;
}