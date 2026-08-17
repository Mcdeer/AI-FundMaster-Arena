/**
 * 基金创建页
 * 股票选择、权重调整、行业分布、回测周期选择
 */

import { APP_STATE, showToast, updateStartButton } from './state.js';
import { initPieChart, updatePieChart } from './charts.js';

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
    customInput.addEventListener('input', () => {
      APP_STATE.customMonths = parseInt(customInput.value) || 18;
    });
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
          ${isSelected ? '<span class="text-neon-blue text-xs ml-1">✓</span>' : ''}
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
    card.addEventListener('click', () => {
      toggleStock(card.dataset);
    });
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

export { selectedStocks };