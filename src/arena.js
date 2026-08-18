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

  const headers = ['基金', '累计收益', '绝对盈亏', '年化收益', '杠杆回撤', '夏普比率', '胜率'];

  const rows = results.map(r => {
    const returnCls = r.totalReturn >= 0 ? 'metric-up' : 'metric-down';
    const rawLevReturn = r.totalReturn * leverage;
    const levReturn = parseFloat(Math.max(-100, rawLevReturn).toFixed(1));
    const absPnL = Math.round(investAmount * levReturn / 100);
    const absPnLStr = (levReturn >= 0 ? '+' : '') + Number(absPnL).toLocaleString();
    return `
      <tr class="border-b border-dark-600/30 hover:bg-dark-700/30 transition-colors">
        <td class="px-3 py-2.5 text-sm text-white font-medium whitespace-nowrap">
          ${r.isUser ? '⭐ ' : r.icon + ' '}${r.label}
        </td>
        <td class="px-3 py-2.5 font-mono text-sm ${returnCls}">${levReturn >= 0 ? '+' : ''}${levReturn.toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm ${returnCls}">${absPnLStr}元</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${r.annualizedReturn >= 0 ? '+' : ''}${r.annualizedReturn}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${(r.maxDrawdown * leverage).toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${r.sharpeRatio}</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${r.winRate}%</td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="metrics-table w-full">
        <thead>
          <tr class="border-b border-dark-500/30">
            ${headers.map(h => `<th class="px-3 py-3 text-xs text-left font-medium whitespace-nowrap">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}