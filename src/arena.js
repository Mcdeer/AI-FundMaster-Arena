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

  const rows = results.map(r => {
    const returnCls = r.totalReturn >= 0 ? 'metric-up' : 'metric-down';
    const rawLevReturn = r.totalReturn * leverage;
    const levReturn = parseFloat(Math.max(-100, rawLevReturn).toFixed(1));
    
    // 基金评级星星
    const ratingStars = '★'.repeat(r.fundRating || 0) + '☆'.repeat(5 - (r.fundRating || 0));
    
    // 用户基金显示专业指标
    const proMetrics = r.isUser ? `
      <div class="mt-2 pt-2 border-t border-dark-600/30">
        <div class="grid grid-cols-6 gap-2 text-xs">
          <div class="text-center">
            <div class="text-gray-500">索提诺</div>
            <div class="font-mono ${r.sortinoRatio >= 1 ? 'text-neon-green' : 'text-gray-300'}">${r.sortinoRatio || '-'}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">信息比率</div>
            <div class="font-mono ${r.informationRatio >= 0.5 ? 'text-neon-green' : 'text-gray-300'}">${r.informationRatio || '-'}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">Calmar</div>
            <div class="font-mono text-gray-300">${r.calmarRatio || '-'}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">盈亏比</div>
            <div class="font-mono text-gray-300">${r.profitLossRatio || '-'}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">评级</div>
            <div class="font-mono text-gold-400">${ratingStars}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">风险等级</div>
            <div class="font-mono ${r.riskLevel === '高' ? 'text-neon-red' : r.riskLevel === '低' ? 'text-neon-green' : 'text-gray-300'}">${r.riskLevel || '中'}</div>
          </div>
        </div>
      </div>
    ` : '';
    
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
      ${r.isUser ? `<tr><td colspan="6" class="px-3 py-2 bg-dark-700/20">${proMetrics}</td></tr>` : ''}
    `;
  }).join('');

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="metrics-table w-full text-xs">
        <thead>
          <tr class="border-b border-dark-500/30">
            ${basicHeaders.map(h => `<th class="px-3 py-2 text-left font-medium whitespace-nowrap cursor-help" title="${getMetricTooltip(h)}">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      
      <!-- 专业指标说明 -->
      <div class="mt-4 p-4 bg-dark-700/30 rounded-lg text-xs text-gray-400">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-neon-blue text-lg">💡</span>
          <span class="font-medium text-white">专业指标说明（点击指标名称查看详情）</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('sharpe')">
            <div class="text-neon-purple font-medium mb-1">夏普比率 (Sharpe Ratio)</div>
            <div>衡量每承受一单位总风险，能获得多少超额收益。>1.0优秀，>2.0卓越。</div>
          </div>
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('sortino')">
            <div class="text-neon-purple font-medium mb-1">索提诺比率 (Sortino Ratio)</div>
            <div>只考虑下行波动的风险调整收益，比夏普比率更精准。</div>
          </div>
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('information')">
            <div class="text-neon-purple font-medium mb-1">信息比率 (Information Ratio)</div>
            <div>超额收益与跟踪误差的比值，衡量主动管理能力。>0.5良好。</div>
          </div>
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('calmar')">
            <div class="text-neon-purple font-medium mb-1">Calmar比率</div>
            <div>年化收益与最大回撤的比值，衡量长期风险调整收益。</div>
          </div>
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('profitloss')">
            <div class="text-neon-purple font-medium mb-1">盈亏比</div>
            <div>平均盈利与平均亏损的比值，>1说明盈利能力强。</div>
          </div>
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('rating')">
            <div class="text-gold-400 font-medium mb-1">★基金评级</div>
            <div>基于夏普比率、回撤控制、年化收益、胜率的综合五星评级。</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 获取指标提示文字
function getMetricTooltip(metric) {
  const tooltips = {
    '基金': '基金名称',
    '累计收益': '回测期内的总收益率',
    '年化收益': '按年计算的收益率',
    '最大回撤': '从高点到低点的最大亏损幅度',
    '夏普比率': '风险调整后收益，>1优秀',
    '胜率': '盈利交易日占比',
  };
  return tooltips[metric] || metric;
}

// 显示指标详情
if (!window.showMetricDetail) {
  window.showMetricDetail = function(metric) {
    const details = {
      sharpe: {
        title: '夏普比率 (Sharpe Ratio)',
        content: '夏普比率 = (年化收益率 - 无风险利率) / 年化波动率\n\n这是最著名的风险调整收益指标，由诺贝尔经济学奖得主威廉·夏普提出。\n\n解读标准：\n• > 2.0：卓越，顶级基金水平\n• 1.0-2.0：优秀，值得投资\n• 0.5-1.0：一般，勉强可接受\n• < 0.5：较差，风险收益比不佳\n\n注意：夏普比率惩罚所有波动（包括上涨），所以牛市中可能偏低。'
      },
      sortino: {
        title: '索提诺比率 (Sortino Ratio)',
        content: '索提诺比率 = (年化收益率 - 无风险利率) / 下行标准差\n\n夏普比率的改进版，只惩罚下行波动，不惩罚上涨波动。\n\n适用场景：\n• 更适合评估偏股型基金\n• 对非对称收益分布更准确\n• 更能反映投资者的真实感受\n\n一般来说，索提诺比率 > 夏普比率，因为排除了上涨波动。'
      },
      information: {
        title: '信息比率 (Information Ratio)',
        content: '信息比率 = 超额收益 / 跟踪误差\n\n衡量基金经理的主动管理能力，即相对于基准创造了多少超额收益。\n\n解读标准：\n• > 1.0：卓越的主动管理能力\n• 0.5-1.0：良好的主动管理能力\n• 0-0.5：一般的主动管理能力\n• < 0：不如买指数基金\n\n这是机构投资者评估基金经理的核心指标。'
      },
      calmar: {
        title: 'Calmar比率',
        content: 'Calmar比率 = 年化收益率 / 最大回撤\n\n用最大回撤代替波动率来衡量风险，更适合长期投资者。\n\n特点：\n• 关注最坏情况下的表现\n• 更适合评估稳健型基金\n• 对极端风险更敏感\n\n一般来说，Calmar比率 > 2 说明风险收益比良好。'
      },
      profitloss: {
        title: '盈亏比',
        content: '盈亏比 = 平均盈利 / 平均亏损\n\n衡量交易系统的质量，反映"赚的时候赚多少，亏的时候亏多少"。\n\n解读：\n• > 2.0：优秀，赚多亏少\n• 1.5-2.0：良好\n• 1.0-1.5：一般\n• < 1.0：危险，赚少亏多\n\n注意：盈亏比需要结合胜率一起看。高盈亏比+低胜率可能是"三年不开张，开张吃三年"的类型。'
      },
      rating: {
        title: '五星基金评级体系',
        content: '综合评分体系，基于以下维度：\n\n1. 夏普比率（权重30%）\n   - 衡量风险调整收益\n\n2. 最大回撤（权重25%）\n   - 衡量风险控制能力\n\n3. 年化收益（权重25%）\n   - 衡量绝对收益能力\n\n4. 胜率（权重20%）\n   - 衡量稳定性\n\n评级标准：\n• ★★★★★：4-5分，顶级基金\n• ★★★★☆：3-4分，优秀基金\n• ★★★☆☆：2-3分，良好基金\n• ★★☆☆☆：1-2分，一般基金\n• ★☆☆☆☆：<1分，需谨慎'
      }
    };
    
    const detail = details[metric];
    if (detail) {
      alert(`${detail.title}\n\n${detail.content}`);
    }
  };
}