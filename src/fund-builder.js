/**
 * 基金创建页
 * 股票选择、权重调整、行业分布、回测周期选择
 */

import { APP_STATE, updateStartButton } from './main.js';
import { initPieChart, updatePieChart } from './charts.js';
import { calcSMA, calcRSI } from './services/indicators.js';

// 状态
let allStocks = [];
let selectedStocks = []; // [{code, name, sector, market, weight}]
let currentMarket = 'a-share';
let currentSector = 'all';

// 四舍五入辅助函数
function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// 事件监听器状态跟踪
let marketTabListenersBound = false;
let periodBtnListenersBound = false;
let searchListenerBound = false;
let customInputListenerBound = false;
let randomBtnBound = false;

// 同步selectedStocks到APP_STATE.holdings
function syncHoldingsToAppState() {
  APP_STATE.holdings = selectedStocks.map(h => ({
    code: h.code,
    name: h.name,
    sector: h.sector,
    market: h.market,
    weight: h.weight,
  }));
}

// ==================== 初始化 ====================
export function initBuilder() {
  selectedStocks = [];
  syncHoldingsToAppState();
  currentMarket = 'a-share';
  currentSector = 'all';

  if (APP_STATE.stocksData) {
    setupBuilder(APP_STATE.stocksData);
  }

  // 绑定市场Tab（只绑定一次）
if (!marketTabListenersBound) {
    document.querySelectorAll('.market-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.market-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMarket = btn.dataset.market;
        document.getElementById('stock-search').value = '';
        renderStockGrid();
      });
    });
    marketTabListenersBound = true;
  }

  // 随机选股
  if (!randomBtnBound) {
    document.getElementById('btn-random')?.addEventListener('click', randomPick);
    randomBtnBound = true;
  }

  // 搜索框（延迟搜索，避免拼音输入闪烁）
  const searchBox = document.getElementById('stock-search');
  if (searchBox && !searchListenerBound) {
    let searchTimer = null;
    searchBox.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        const query = searchBox.value.trim().toLowerCase();
        if (query) {
          currentMarket = 'all';
          document.querySelectorAll('.market-tab').forEach(b => b.classList.remove('active'));
        }
        renderStockGrid(query);
      }, 250); // 250ms 防抖
    });
    searchListenerBound = true;
  }

  // 绑定周期按钮（只绑定一次）
  if (!periodBtnListenersBound) {
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const period = btn.dataset.period;
        if (period === 'custom') {
          document.getElementById('custom-period-wrap').classList.remove('hidden');
          APP_STATE.period = 'custom';
        } else {
          document.getElementById('custom-period-wrap').classList.add('hidden');
          APP_STATE.period = period;
        }
      });
    });
    periodBtnListenersBound = true;
  }

  // 自定义月份输入（只绑定一次）
  const customInput = document.getElementById('custom-months');
  if (customInput && !customInputListenerBound) {
    const validate = () => {
      let val = parseInt(customInput.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 120) val = 120;
      customInput.value = val;
      APP_STATE.customMonths = val;
    };
    customInput.addEventListener('input', validate);
    customInput.addEventListener('blur', validate);
    customInputListenerBound = true;
  }

  // 初始化环形图
  initPieChart();
  renderSelectedList();
}

function setupBuilder(data) {
  allStocks = data.stocks;
  renderSectorFilters(data.sectors);
  renderStockGrid();
  initPieChart();
}

// ==================== 行业筛选 ====================
function renderSectorFilters(sectors) {
  const container = document.getElementById('sector-filters');
  if (!container) return;

  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'sector-btn active';
  allBtn.textContent = '全部';
  allBtn.addEventListener('click', () => {
    currentSector = 'all';
    document.querySelectorAll('.sector-btn').forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
    renderStockGrid();
  });
  container.appendChild(allBtn);

  sectors.forEach(sec => {
    const btn = document.createElement('button');
    btn.className = 'sector-btn';
    btn.textContent = sec;
    btn.addEventListener('click', () => {
      currentSector = sec;
      document.querySelectorAll('.sector-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderStockGrid();
    });
    container.appendChild(btn);
  });
}

// ==================== 股票网格 ====================
function renderStockGrid(searchQuery) {
  const grid = document.getElementById('stock-grid');
  if (!grid) return;

  let filtered = allStocks;

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = allStocks.filter(s =>
      s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    ).slice(0, 50);
  } else {
    // 无搜索词时用当前 market 筛选
    if (currentMarket === 'all') currentMarket = 'a-share';
    filtered = allStocks.filter(s => {
      const marketMatch = s.market === currentMarket;
      const sectorMatch = currentSector === 'all' || s.sector === currentSector;
      return marketMatch && sectorMatch;
    });
  }

  // 按市值排序
  filtered.sort((a, b) => b.marketCap - a.marketCap);

  grid.innerHTML = filtered.map(s => {
    const isSelected = selectedStocks.find(h => h.code === s.code);
    const price = s.latestPrice;
    const cls = isSelected ? 'selected' : '';

    return `
      <div class="stock-card ${cls}" data-code="${s.code}" data-name="${s.name}"
           data-sector="${s.sector}" data-market="${s.market}">
        <div class="flex items-center justify-between mb-1">
          <span class="text-white font-medium text-sm truncate flex-1">${s.name}</span>
          <div class="flex items-center gap-1">
            <button class="stock-detail-btn text-xs text-gray-500 hover:text-neon-blue px-1.5 py-0.5 rounded bg-dark-600/50 transition-colors" data-code="${s.code}" title="查看详情">ℹ️</button>
            ${isSelected ? '<span class="text-neon-blue text-xs">✓</span>' : ''}
          </div>
        </div>
        <div class="text-xs text-gray-500 mb-1">${s.code} · ${s.sector}</div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-400">PE ${s.pe?.toFixed(1) || '--'}</span>
          <span class="font-mono text-gray-300">¥${price?.toFixed(2) || '--'}</span>
        </div>
      </div>
    `;
  }).join('');

  // 绑定点击事件
  grid.querySelectorAll('.stock-card').forEach(card => {
    // 左键点击选中/取消选中
    card.addEventListener('click', (e) => {
      // 如果点击的是详情按钮，不触发选中
      if (e.target.closest('.stock-detail-btn')) return;
      toggleStock(card.dataset);
    });
  });
  
  // 绑定详情按钮事件
  grid.querySelectorAll('.stock-detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = btn.dataset.code;
      showStockDetail(code);
    });
  });
}

// 显示股票详情弹窗
function showStockDetail(code) {
  const stock = allStocks.find(s => s.code === code);
  if (!stock) return;
  
  // 计算历史走势数据（取最近60个点）
  const priceHistory = stock.prices.slice(-60);
  const minPrice = Math.min(...priceHistory);
  const maxPrice = Math.max(...priceHistory);
  
  const marketNames = { 'a-share': 'A股', 'hk': '港股', 'us': '美股', 'index': '指数' };
  
  // 计算涨跌幅
  const startPrice = priceHistory[0];
  const endPrice = priceHistory[priceHistory.length - 1];
  const change = ((endPrice - startPrice) / startPrice * 100).toFixed(2);
  const changeColor = change >= 0 ? 'text-neon-red' : 'text-neon-green';
  const changeSymbol = change >= 0 ? '+' : '';
  const lineColor = change >= 0 ? '#ff5252' : '#69f0ae';
  
  // 生成日期标签
  const dateLabels = [];
  for (let i = 0; i < priceHistory.length; i += 10) {
    dateLabels.push(`${i + 1}日`);
  }
  
  // 创建弹窗
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="bg-dark-800 rounded-2xl p-6 max-w-lg w-full mx-4 border border-dark-500 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-xl font-bold text-white">${stock.name}</h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-gray-400">${stock.code}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-dark-600 text-gray-300">${marketNames[stock.market] || stock.market}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-dark-600 text-gray-300">${stock.sector}</span>
          </div>
        </div>
        <button class="text-gray-500 hover:text-white text-2xl" onclick="this.closest('.fixed').remove()">&times;</button>
      </div>
      
      <!-- 价格信息 -->
      <div class="bg-dark-700/50 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-gray-500 mb-1">最新价格</div>
            <div class="text-2xl font-mono font-bold text-white">¥${stock.latestPrice?.toFixed(2) || '--'}</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-500 mb-1">近60日涨跌</div>
            <div class="text-xl font-mono font-bold ${changeColor}">${changeSymbol}${change}%</div>
          </div>
        </div>
      </div>
      
      <!-- 走势图 -->
      <div class="bg-dark-700/30 rounded-xl p-4 mb-4">
        <div class="text-xs text-gray-500 mb-2">近60日价格走势</div>
        <div id="stock-price-chart" style="width: 100%; height: 200px;"></div>
        <div class="flex justify-between text-xs text-gray-500 mt-2">
          <span>最低: ¥${minPrice.toFixed(2)}</span>
          <span>最高: ¥${maxPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <!-- 关键指标 -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">市盈率 (PE)</div>
          <div class="text-lg font-mono text-white">${stock.pe?.toFixed(1) || '--'}</div>
          <div class="text-xs text-gray-600">${stock.pe > 30 ? '估值偏高' : stock.pe < 15 ? '估值偏低' : '估值合理'}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">市值</div>
          <div class="text-lg font-mono text-white">${(stock.marketCap / 10000).toFixed(0)}亿</div>
          <div class="text-xs text-gray-600">${stock.marketCap > 10000 ? '大盘股' : stock.marketCap > 1000 ? '中盘股' : '小盘股'}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">营收增长</div>
          <div class="text-lg font-mono ${stock.revenueGrowth > 0 ? 'text-neon-red' : 'text-neon-green'}">${stock.revenueGrowth?.toFixed(1) || '--'}%</div>
          <div class="text-xs text-gray-600">${stock.revenueGrowth > 20 ? '高增长' : stock.revenueGrowth > 0 ? '稳健增长' : '负增长'}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">ROE</div>
          <div class="text-lg font-mono text-white">${stock.roe?.toFixed(1) || '--'}%</div>
          <div class="text-xs text-gray-600">${stock.roe > 15 ? '优秀' : stock.roe > 10 ? '良好' : '一般'}</div>
        </div>
      </div>
      
      <!-- 技术指标 -->
      <div class="bg-dark-700/30 rounded-lg p-3 mb-4">
        <div class="text-xs text-gray-500 mb-2">📊 技术指标（基于历史模拟数据）</div>
        <div class="grid grid-cols-3 gap-2 text-center" id="tech-indicators-${stock.code}">
          <div class="text-xs text-gray-500">正在计算...</div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex gap-3">
        <button class="stock-modal-close flex-1 bg-dark-600/50 text-gray-400 border border-dark-500 rounded-lg py-2.5 text-sm font-medium hover:bg-dark-500 hover:text-white transition-colors">关闭</button>
        <button class="stock-modal-add flex-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg py-2.5 text-sm font-medium hover:shadow-lg hover:shadow-neon-blue/20 transition-all" data-code="${stock.code}" data-name="${stock.name}" data-sector="${stock.sector}" data-market="${stock.market}">＋ 加入组合</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 绑定弹窗按钮事件
  modal.querySelector('.stock-modal-close')?.addEventListener('click', () => modal.remove());
  modal.querySelector('.stock-modal-add')?.addEventListener('click', function() {
    const { code, name, sector, market } = this.dataset;
    toggleStock({ code, name, sector, market });
    modal.remove();
  });
  // 点击背景关闭
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  // 计算技术指标
  setTimeout(() => {
    const container = document.getElementById(`tech-indicators-${stock.code}`);
    if (!container) return;
    const prices = stock.prices.slice(-120); // 最近120个交易日
    const sma20 = calcSMA(prices, 20);
    const sma60 = calcSMA(prices, 60);
    const rsi = calcRSI(prices, 14);

    const lastPrice = prices[prices.length - 1];
    const ma20 = sma20[sma20.length - 1];
    const ma60 = sma60[sma60.length - 1];
    const lastRSI = rsi[rsi.length - 1];

    const trend = ma20 > ma60 ? '📈 多头排列' : '📉 空头排列';
    const rsiLabel = lastRSI > 70 ? '⚠️ 超买' : lastRSI < 30 ? '💡 超卖' : '➖ 中性';

    container.innerHTML = `
      <div><div class="text-xs text-gray-500">MA20</div><div class="font-mono text-sm ${ma20 > ma60 ? 'text-neon-red' : 'text-neon-green'}">${ma20?.toFixed(2) || '--'}</div></div>
      <div><div class="text-xs text-gray-500">RSI(14)</div><div class="font-mono text-sm ${lastRSI > 70 ? 'text-neon-red' : lastRSI < 30 ? 'text-neon-green' : 'text-gray-300'}">${lastRSI?.toFixed(1) || '--'}</div></div>
      <div><div class="text-xs text-gray-500">趋势</div><div class="text-xs">${trend}</div><div class="text-xs text-gray-500">${rsiLabel}</div></div>
    `;
  }, 100);
  
  // 渲染ECharts图表
  setTimeout(() => {
    const chartDom = document.getElementById('stock-price-chart');
    if (chartDom && typeof echarts !== 'undefined') {
      const chart = echarts.init(chartDom);
      const option = {
        backgroundColor: 'transparent',
        grid: { left: '3%', right: '3%', top: '5%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          data: priceHistory.map((_, i) => i + 1),
          axisLine: { lineStyle: { color: '#2d3d54' } },
          axisLabel: { 
            color: '#6b7280', 
            fontSize: 10,
            interval: 9,
            formatter: (value) => `${value}日`
          },
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          scale: true,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { 
            color: '#6b7280', 
            fontSize: 10,
            formatter: (value) => '¥' + value.toFixed(0)
          },
          splitLine: { lineStyle: { color: 'rgba(45,61,84,0.3)' } }
        },
        series: [{
          data: priceHistory,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 3, color: lineColor },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: lineColor + '40' },
              { offset: 1, color: lineColor + '00' }
            ])
          }
        }],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(17,24,39,0.95)',
          borderColor: lineColor,
          textStyle: { color: '#e5e7eb', fontSize: 12 },
          formatter: (params) => {
            const price = params[0].value;
            const day = params[0].axisValue;
            return `<div style="font-weight:bold">第${day}天</div><div>价格: ¥${price.toFixed(2)}</div>`;
          }
        }
      };
      chart.setOption(option);
      
      // 响应式
      window.addEventListener('resize', () => chart.resize());
    }
  }, 100);
  
  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function toggleStock({ code, name, sector, market }) {
  const idx = selectedStocks.findIndex(h => h.code === code);
  if (idx >= 0) {
    selectedStocks.splice(idx, 1);
  } else if (selectedStocks.length < 10) {
    selectedStocks.push({ code, name, sector, market, weight: 0 });
  } else {
    showToast('最多选择10只成分股', 'error');
    return;
  }

  equalizeWeights();
  // 同步到APP_STATE
  syncHoldingsToAppState();
  // 保持搜索状态，用当前搜索框的值重新渲染
  const searchQuery = document.getElementById('stock-search')?.value?.trim();
  renderStockGrid(searchQuery || undefined);
  renderSelectedList();
  updateSectorPie();
  updateStartButton();
}

// ==================== 等权分配 ====================
function equalizeWeights() {
  if (selectedStocks.length === 0) return;
  const each = Math.floor(100 / selectedStocks.length);
  const remainder = 100 - each * selectedStocks.length;
  selectedStocks.forEach((h, i) => {
    h.weight = each + (i < remainder ? 1 : 0);
  });
  // 确保权重总和为100
  const total = selectedStocks.reduce((sum, h) => sum + h.weight, 0);
  if (total !== 100 && selectedStocks.length > 0) {
    selectedStocks[0].weight += (100 - total);
  }
}

// ==================== 已选列表 ====================
function renderSelectedList() {
  const list = document.getElementById('selected-list');
  const sum = document.getElementById('weight-sum');

  if (selectedStocks.length === 0) {
    list.innerHTML = '<span class="text-gray-500">请从上方选择股票</span>';
    sum.textContent = '合计: 0%';
    return;
  }

  list.innerHTML = selectedStocks.map((h, i) => `
    <div class="selected-item w-full">
      <button class="text-gray-500 hover:text-red-400 text-lg flex-shrink-0"
              data-action="remove" data-index="${i}">✕</button>
      <div class="flex-1 min-w-0">
        <div class="text-white text-sm truncate">${h.name}</div>
        <div class="text-xs text-gray-500">${h.code} · ${h.sector}</div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <input type="range" min="1" max="95" value="${h.weight}"
               class="weight-slider w-16 md:w-24"
               data-action="weight" data-index="${i}" />
        <input type="number" min="1" max="95" value="${h.weight}"
               class="weight-input w-14 bg-dark-700 border border-dark-500 rounded-lg px-1.5 py-1 text-center text-neon-blue font-mono text-sm focus:outline-none focus:border-neon-blue"
               data-action="weight-input" data-index="${i}" />
        <span class="text-neon-blue font-mono text-sm w-8 text-right">%</span>
      </div>
    </div>
  `).join('');

  // 总权重
  const total = selectedStocks.reduce((a, h) => a + h.weight, 0);
  sum.textContent = `合计: ${total}%`;
  sum.className = total === 100
    ? 'text-sm font-mono text-neon-green'
    : 'text-sm font-mono text-neon-red';

  // 绑定滑块和手动输入事件
  const lockWeights = document.getElementById('lock-weights')?.checked || false;

  list.querySelectorAll('[data-action="weight"]').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const idx = parseInt(slider.dataset.index);
      selectedStocks[idx].weight = parseInt(e.target.value);
      // 同步数字输入
      const numInput = list.querySelector(`[data-action="weight-input"][data-index="${idx}"]`);
      if (numInput) numInput.value = e.target.value;
      if (!lockWeights) redistributeWeight(idx, parseInt(e.target.value));
      else {
        syncHoldingsToAppState();
        renderSelectedList();
        updateSectorPie();
        updateStartButton();
      }
    });
    slider.addEventListener('change', (e) => {
      if (!lockWeights) return; // 非锁定模式下在 input 已处理
      const idx = parseInt(slider.dataset.index);
      selectedStocks[idx].weight = parseInt(e.target.value);
      syncHoldingsToAppState();
      renderSelectedList();
      updateSectorPie();
      updateStartButton();
    });
  });

  list.querySelectorAll('[data-action="weight-input"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = parseInt(input.dataset.index);
      let val = parseInt(e.target.value) || 1;
      val = Math.max(1, Math.min(95, val));
      selectedStocks[idx].weight = val;
      // 同步滑块
      const slider = list.querySelector(`[data-action="weight"][data-index="${idx}"]`);
      if (slider) slider.value = val;
      if (!lockWeights) redistributeWeight(idx, val);
      else {
        syncHoldingsToAppState();
        renderSelectedList();
        updateSectorPie();
        updateStartButton();
      }
    });
  });

  list.querySelectorAll('[data-action="remove"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      selectedStocks.splice(idx, 1);
      equalizeWeights();
      syncHoldingsToAppState();
      renderStockGrid();
      renderSelectedList();
      updateSectorPie();
      updateStartButton();
    });
  });
}

function redistributeWeight(changedIdx, newWeight) {
  // 简单算法：调整其他股票的权重，按比例分配剩余
  const others = selectedStocks.filter((_, i) => i !== changedIdx);
  if (others.length === 0) return;

  // 设置当前股票的权重
  selectedStocks[changedIdx].weight = newWeight;

  const remaining = 100 - newWeight;
  const othersTotal = others.reduce((a, h) => a + h.weight, 0);

  if (othersTotal === 0) {
    // 如果其他股票权重都为0，均分
    const each = Math.floor(remaining / others.length);
    others.forEach(h => h.weight = each);
    // 余数给第一个
    const sum = others.reduce((a, h) => a + h.weight, 0);
    others[0].weight += (remaining - sum);
  } else {
    // 按比例缩放
    const scale = remaining / othersTotal;
    let sum = 0;
    others.forEach((h, i) => {
      h.weight = Math.max(1, Math.round(h.weight * scale));
      sum += h.weight;
    });

    // 修正舍入误差（最多循环20次防死循环）
    let diff = remaining - sum;
    let safety = 0;
    while (diff !== 0 && safety < 20) {
      safety++;
      for (const h of others) {
        if (diff > 0) { h.weight++; diff--; }
        else if (diff < 0 && h.weight > 1) { h.weight--; diff++; }
        if (diff === 0) break;
      }
    }
    // 如果还有残余，全给第一个
    if (diff !== 0 && others.length > 0) {
      others[0].weight = Math.max(1, others[0].weight + diff);
    }
  }

  // 最终验证权重总和
  const finalTotal = selectedStocks.reduce((a, h) => a + h.weight, 0);
  if (finalTotal !== 100 && selectedStocks.length > 0) {
    selectedStocks[0].weight += (100 - finalTotal);
  }

  syncHoldingsToAppState();
  renderSelectedList();
  updateSectorPie();
  updateStartButton();
}

// ==================== 行业分布环形图 ====================
function updateSectorPie() {
  const sectorMap = {};
  selectedStocks.forEach(h => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.weight;
  });

  const data = Object.entries(sectorMap).map(([name, value]) => ({
    name,
    value,
  }));

  updatePieChart(data);
}

// ==================== 随机选股 ====================
function randomPick() {
  // 清空现有选择
  selectedStocks = [];
  // 随机选 4-7 只
  const count = 4 + Math.floor(Math.random() * 4);
  const pool = [...allStocks].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const s = pool[i];
    selectedStocks.push({ code: s.code, name: s.name, sector: s.sector, market: s.market, weight: 0 });
  }
  equalizeWeights();
  document.getElementById('stock-search').value = '';
  currentMarket = 'a-share';
  document.querySelectorAll('.market-tab').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-market="a-share"]')?.classList.add('active');
  renderStockGrid();
  renderSelectedList();
  updateSectorPie();
  updateStartButton();
  showToast(`🎲 随机选中 ${selectedStocks.length} 只股票，看看运气如何？`);
}

// ==================== 导出 ====================
export function getHoldings() {
  return selectedStocks.map(h => ({
    code: h.code,
    weight: h.weight,
  }));
}

export function getPeriod() {
  if (APP_STATE.period === 'custom') {
    return 'custom' + (APP_STATE.customMonths || 18);
  }
  return APP_STATE.period;
}