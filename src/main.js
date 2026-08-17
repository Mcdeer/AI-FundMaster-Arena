/**
 * AI基金经理挑战赛 - 主入口（纯前端版）
 * 三屏切换、粒子背景、全局状态管理
 */

import './style.css';
import { APP_STATE, showToast, updateStartButton } from './state.js';
import { initBuilder, getHoldings, getPeriod } from './fund-builder.js';
import { renderArena } from './arena.js';
import { renderDiagnosis } from './diagnosis.js';
import { runBacktest } from './engine/backtest.js';
import { generateOpponents } from './engine/opponents.js';
import { analyzeStyle } from './engine/analyzer.js';
import { disposeAllCharts } from './charts.js';

// 导出APP_STATE和showToast以保持兼容性
export { APP_STATE, showToast, updateStartButton };

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

    // 自动生成牛逼的基金名称
    let fundName = APP_STATE.fundName || document.getElementById('fund-name')?.value?.trim();
    if (!fundName) {
      const prefixes = ['超级', '至尊', '全球', '无敌', '永恒', '巅峰', '王者', '传奇', '霸道', '神级'];
      const cores = ['永赢', '复兴', '伟业', '宏图', '盛世', '领航', '共赢', '鼎盛', '长虹', '聚富'];
      const suffixes = ['混合配置', '精选组合', '价值成长', '多因子策略', '全天候对冲', '阿尔法增强', '量化优选', '绝对收益', '宏观对冲', '灵活配置'];
      const names = holdings.map(h => h.name).slice(0, 2);
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const core = cores[Math.floor(Math.random() * cores.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      fundName = prefix + core + suffix;
      if (names.length > 0) fundName += '（重仓' + names.join('、') + '）';
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
  } catch (err) {
    showToast('回测失败：' + err.message, 'error');
    btn.disabled = false;
    btn.textContent = '⚡ 开始挑战';
  }
}

function handleDiagnosis() {
  switchScreen('diagnosis');
  // 注入杠杆信息（注意：这里不修改原始值，避免重复计算）
  const resultForAnalysis = {
    ...APP_STATE.userResult,
    totalReturn: APP_STATE.userResult.totalReturn * APP_STATE.leverage,
    maxDrawdown: APP_STATE.userResult.maxDrawdown * APP_STATE.leverage,
  };
  const analysis = analyzeStyle(APP_STATE.stocksData, APP_STATE.holdings, resultForAnalysis);
  analysis.metrics.leverage = APP_STATE.leverage;
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