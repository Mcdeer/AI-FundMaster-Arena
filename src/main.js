/**
 * AI基金经理挑战赛 - 主入口（纯前端版）
 * 三屏切换、粒子背景、全局状态管理
 */

import './style.css';
import { initBuilder, getHoldings, getPeriod } from './fund-builder.js';
import { renderArena } from './arena.js';
import { renderDiagnosis } from './diagnosis.js';
import { runBacktest } from './engine/backtest.js';
import { generateOpponents } from './engine/opponents.js';
import { analyzeStyle } from './engine/analyzer.js';
import { preloadCommentary, getCommentary, renderMarkdown } from './services/llm.js';
import { disposeAllCharts } from './charts.js';

// ==================== 全局状态 ====================
export const APP_STATE = {
  currentScreen: 'builder',
  fundName: '',
  holdings: [],
  period: '1y',
  customMonths: 18,
  backtestResults: null,
  stocksData: null,
  userResult: null,
  investAmount: 100000,
  leverage: 1,
};

// ==================== 粒子背景 ====================
let particleAnimId = null;
let particleResizeHandler = null;

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  // 清理之前的动画
  if (particleAnimId) {
    cancelAnimationFrame(particleAnimId);
    particleAnimId = null;
  }
  // 移除之前的resize监听器
  if (particleResizeHandler) {
    window.removeEventListener('resize', particleResizeHandler);
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  particleResizeHandler = resize;
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 195, 247, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79, 195, 247, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    particleAnimId = requestAnimationFrame(animate);
  }
  animate();
}

// ==================== 屏幕切换 ====================
export function switchScreen(screenId) {
  // 清理图表资源
  disposeAllCharts();

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active', 'hidden'));
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  APP_STATE.currentScreen = screenId;
  const header = document.getElementById('header');
  if (header) {
    header.style.display = screenId === 'builder' ? '' : 'none';
  }
}

// ==================== 数据加载 ====================
async function loadStocksData() {
  try {
    // 使用相对路径，兼容 GitHub Pages 子目录部署
    const base = import.meta.env.BASE_URL || '/';
    const resp = await fetch(base + 'stocks.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    // 为每只股票计算 latestPrice
    data.stocks.forEach(s => {
      s.latestPrice = s.prices[s.prices.length - 1];
    });
    APP_STATE.stocksData = data;
    return APP_STATE.stocksData;
  } catch (err) {
    console.error('Failed to load stocks:', err);
    return null;
  }
}

// ==================== 核心逻辑 ====================
async function handleStart() {
  const btn = document.getElementById('btn-start');
  btn.disabled = true;
  btn.textContent = '⏳ 回测计算中...';

  try {
    const holdings = getHoldings();
    const period = getPeriod();
    let amount = parseFloat(document.getElementById('invest-amount')?.value) || 100000;
    // 再次验证投资金额范围
    amount = Math.max(100, Math.min(100000000, amount));
    const leverage = parseFloat(document.getElementById('leverage')?.value) || 1;

    // 自动生成基金名称
    let fundName = APP_STATE.fundName || document.getElementById('fund-name')?.value?.trim();
    if (!fundName) {
      fundName = generateFundName(holdings, APP_STATE.stocksData);
    }

    // 确保数据已加载
    if (!APP_STATE.stocksData) {
      await loadStocksData();
    }

    // 前端回测
    const userResult = runBacktest(APP_STATE.stocksData, holdings, period);
    userResult.label = fundName;
    userResult.amount = amount;
    userResult.leverage = leverage;
    APP_STATE.userResult = userResult;
    APP_STATE.holdings = holdings;
    APP_STATE.investAmount = amount;
    APP_STATE.leverage = leverage;

    // 生成对手
    const opponents = generateOpponents(APP_STATE.stocksData, period);

    // 合并排序
    const allResults = [userResult, ...opponents];
    allResults.sort((a, b) => b.totalReturn - a.totalReturn);
    allResults.forEach((r, i) => { r.rank = i + 1; });

    APP_STATE.backtestResults = allResults;

    switchScreen('arena');
    renderArena({ fundName, period, results: allResults, amount, leverage });

    // 提前预加载 AI 点评
    const resultForPreload = { ...userResult, totalReturn: userResult.totalReturn * leverage, maxDrawdown: userResult.maxDrawdown * leverage };
    const analysis = analyzeStyle(APP_STATE.stocksData, holdings, resultForPreload);
    analysis.metrics.leverage = leverage;
    preloadCommentary(analysis);
  } catch (err) {
    showToast('回测失败：' + err.message, 'error');
    btn.disabled = false;
    btn.textContent = '⚡ 开始挑战';
  }
}

async function handleDiagnosis() {
  switchScreen('diagnosis');
  const resultForAnalysis = {
    ...APP_STATE.userResult,
    totalReturn: APP_STATE.userResult.totalReturn * APP_STATE.leverage,
    maxDrawdown: APP_STATE.userResult.maxDrawdown * APP_STATE.leverage,
  };
  const analysis = analyzeStyle(APP_STATE.stocksData, APP_STATE.holdings, resultForAnalysis);
  analysis.metrics.leverage = APP_STATE.leverage;

  // 获取预加载的 AI 点评（已经提前请求了）
  const aiResults = await getCommentary();
  if (aiResults && aiResults.length > 0) {
    // 渲染所有模型的结果
    analysis.aiResults = aiResults.map(r => ({
      model: r.model,
      html: renderMarkdown(r.text),
    }));
  }

  renderDiagnosis(analysis);
}

function handleRestart() {
  APP_STATE.fundName = '';
  APP_STATE.holdings = [];
  APP_STATE.backtestResults = null;
  APP_STATE.userResult = null;
  document.getElementById('fund-name').value = '';
  document.getElementById('btn-start').disabled = true;
  switchScreen('builder');
  initBuilder();
}

// ==================== 智能生成基金名称 ====================
function generateFundName(holdings, stocksData) {
  if (!holdings || holdings.length === 0) return '我的基金';

  const stockMap = {};
  if (stocksData && stocksData.stocks) {
    stocksData.stocks.forEach(s => { stockMap[s.code] = s; });
  }

  // 分析持仓特征
  const markets = {};
  const sectors = {};
  let hasTech = false, hasFinance = false, hasConsumer = false, hasMedical = false;

  holdings.forEach(h => {
    const stock = stockMap[h.code];
    if (stock) {
      markets[stock.market] = (markets[stock.market] || 0) + h.weight;
      sectors[stock.sector] = (sectors[stock.sector] || 0) + h.weight;
      if (stock.sector === '科技') hasTech = true;
      if (stock.sector === '金融') hasFinance = true;
      if (stock.sector === '消费') hasConsumer = true;
      if (stock.sector === '医药') hasMedical = true;
    }
  });

  // 确定市场特征
  const marketEntries = Object.entries(markets).sort((a, b) => b[1] - a[1]);
  const primaryMarket = marketEntries[0]?.[0] || 'a-share';
  const marketCount = marketEntries.length;

  // 市场前缀
  const marketPrefixMap = {
    'a-share': ['华夏', '国泰', '南方', '易方达', '嘉实', '博时', '广发', '富国'],
    'hk': ['港股', '香港', '恒生', '中港', '沪港深'],
    'us': ['纳斯达克', '标普', '美股', '全球', '海外'],
    'index': ['指数', 'ETF', '被动']
  };

  // 如果多市场，使用全球/国际前缀
  let prefixPool;
  if (marketCount >= 3) {
    prefixPool = ['全球', '国际', '环球', '世界', '跨市场'];
  } else if (marketCount === 2) {
    prefixPool = ['沪港深', '深港通', 'AH', '中美', '跨市场'];
  } else {
    prefixPool = marketPrefixMap[primaryMarket] || marketPrefixMap['a-share'];
  }

  // 根据持仓特征选择核心词
  let corePool = [];
  if (hasTech && holdings.length <= 3) {
    corePool = ['创新', '科技', '成长', '新兴', '前沿', '智能'];
  } else if (hasFinance && holdings.length <= 3) {
    corePool = ['金融', '价值', '蓝筹', '红利', '稳健', '精选'];
  } else if (hasConsumer && holdings.length <= 3) {
    corePool = ['消费', '品质', '生活', '品牌', '升级'];
  } else if (hasMedical && holdings.length <= 3) {
    corePool = ['健康', '医疗', '生命', '医药', '生物'];
  } else if (holdings.length >= 8) {
    corePool = ['优选', '精选', '配置', '均衡', '多元', '全能'];
  } else if (holdings.length <= 3) {
    corePool = ['聚焦', '集中', '核心', '龙头', '精选', '优势'];
  } else {
    corePool = ['成长', '价值', '均衡', '轮动', '趋势', '精选', '优选', '灵活'];
  }

  // 后缀
  const suffixPool = ['混合', '股票', '配置', '优选', '精选', '成长', '价值', '稳健', '进取', '灵活'];

  // 随机选择
  const prefix = prefixPool[Math.floor(Math.random() * prefixPool.length)];
  const core = corePool[Math.floor(Math.random() * corePool.length)];
  const suffix = suffixPool[Math.floor(Math.random() * suffixPool.length)];

  // 组合名称（2-4个字的核心）
  const patterns = [
    prefix + core + suffix,
    prefix + suffix + core,
    core + suffix,
    prefix + core
  ];

  // 确保名字够炫
  const name = patterns[Math.floor(Math.random() * patterns.length)];

  // 加炫酷前缀
  const grandPrefixes = ['超级', '至尊', '王者', '巅峰', '传奇', '无敌', '神级', '霸道'];
  const grandPrefix = grandPrefixes[Math.floor(Math.random() * grandPrefixes.length)];

  // 组合：超级华夏创新混合（您）
  return grandPrefix + name + '（您）';
}

// ==================== 初始化 ====================
async function init() {
  initParticles();

  // 预加载股票数据
  await loadStocksData();
  initBuilder();

  // 投资金额输入验证
  const investAmountInput = document.getElementById('invest-amount');
  if (investAmountInput) {
    investAmountInput.addEventListener('input', (e) => {
      let value = parseInt(e.target.value) || 100000;
      // 限制范围
      value = Math.max(100, Math.min(100000000, value));
      // 如果输入超出范围，自动修正
      if (e.target.value && parseInt(e.target.value) !== value) {
        e.target.value = value;
      }
    });
    investAmountInput.addEventListener('blur', (e) => {
      let value = parseInt(e.target.value) || 100000;
      value = Math.max(100, Math.min(100000000, value));
      e.target.value = value;
    });
  }

  document.getElementById('btn-start').addEventListener('click', handleStart);
  document.getElementById('btn-diagnosis').addEventListener('click', handleDiagnosis);
  document.getElementById('btn-restart').addEventListener('click', handleRestart);
  document.getElementById('fund-name').addEventListener('input', (e) => {
    APP_STATE.fundName = e.target.value.trim();
    updateStartButton();
  });

  // 杠杆滑块
  const leverageSlider = document.getElementById('leverage');
  if (leverageSlider) {
    leverageSlider.addEventListener('input', () => {
      document.getElementById('leverage-display').textContent = leverageSlider.value + 'x';
    });
  }
}

init();

/** Toast */
let _toastTimer = null;
export function showToast(msg, type = 'info') {
  const ex = document.getElementById('toast-msg'); if (ex) ex.remove();
  if (_toastTimer) clearTimeout(_toastTimer);
  const bg = type === 'error' ? 'bg-red-500/90' : 'bg-green-500/90';
  const el = document.createElement('div'); el.id = 'toast-msg';
  el.className = `fixed top-4 left-1/2 -translate-x-1/2 ${bg} text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm`;
  el.textContent = msg; document.body.appendChild(el);
  _toastTimer = setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3000);
}

/** 按钮状态 */
export function updateStartButton() {
  const btn = document.getElementById('btn-start');
  if (btn) btn.disabled = getHoldings().length < 1;
}