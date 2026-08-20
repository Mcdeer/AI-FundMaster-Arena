/**
 * 前端AI对手策略引擎
 * 浏览器端运行，生成7个对手
 */

import { runBacktest } from './backtest.js';

export function generateOpponents(stocksData, period) {
  const opponents = [];
  opponents.push(...generateBenchmarks(stocksData, period));
  opponents.push(...generateAIStrategies(stocksData, period));
  return opponents;
}

/**
 * 四舍五入到指定小数位，解决浮点数精度问题
 */
function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function generateBenchmarks(stocksData, period) {
  const allStocks = stocksData.stocks;

  const csi300 = allStocks.filter(s => s.market === 'a-share').sort((a, b) => b.marketCap - a.marketCap).slice(0, 20);
  const csi300H = csi300.map(s => ({ code: s.code, weight: roundTo(100 / csi300.length, 1) }));

  const gem = allStocks.filter(s => s.market === 'a-share' && (s.sector === '科技' || s.sector === '医药' || s.sector === '新能源')).filter(s => s.marketCap < 5000).slice(0, 15);
  const gemH = gem.map(s => ({ code: s.code, weight: roundTo(100 / gem.length, 1) }));

  const nasdaq = allStocks.filter(s => s.market === 'us' && s.sector === '科技').sort((a, b) => b.marketCap - a.marketCap).slice(0, 10);
  const nasdaqH = nasdaq.map(s => ({ code: s.code, weight: roundTo(100 / nasdaq.length, 1) }));

  return [
    makeOpponent('benchmark-csi300', '沪深300', 'A股大盘蓝筹基准', '🇨🇳', csi300H, stocksData, period),
    makeOpponent('benchmark-gem', '创业板指', 'A股成长创新基准', '🇨🇳', gemH, stocksData, period),
    makeOpponent('benchmark-nasdaq', '纳斯达克100', '美股科技龙头基准', '🇺🇸', nasdaqH, stocksData, period),
  ];
}

function generateAIStrategies(stocksData, period) {
  const allStocks = stocksData.stocks;

  const valueStocks = allStocks.filter(s => s.pe > 0 && s.pe < 25 && s.dividendYield > 2)
    .filter(s => s.sector === '消费' || s.sector === '金融').sort((a, b) => b.dividendYield - a.dividendYield).slice(0, 8);
  const valueH = valueStocks.map(s => ({ code: s.code, weight: roundTo(100 / valueStocks.length, 1) }));

  const growthStocks = allStocks.filter(s => s.revenueGrowth > 10)
    .filter(s => s.sector === '科技' || s.sector === '医药' || s.sector === '新能源').sort((a, b) => b.revenueGrowth - a.revenueGrowth).slice(0, 8);
  const growthH = growthStocks.map(s => ({ code: s.code, weight: roundTo(100 / growthStocks.length, 1) }));

  const momentumStocks = allStocks.map(s => {
    const prices = s.prices;
    const recent = prices[prices.length - 1];
    const ago = prices[Math.max(0, prices.length - 63)];
    return { ...s, momentum: roundTo(((recent - ago) / ago) * 100, 2) };
  }).sort((a, b) => b.momentum - a.momentum).slice(0, 8);
  const momentumH = momentumStocks.map(s => ({ code: s.code, weight: roundTo(100 / momentumStocks.length, 1) }));

  const reverseStocks = allStocks.filter(s => s.roe > 5).map(s => {
    const prices = s.prices;
    const recent = prices[prices.length - 1];
    const ago = prices[Math.max(0, prices.length - 63)];
    return { ...s, change: roundTo(((recent - ago) / ago) * 100, 2) };
  }).sort((a, b) => a.change - b.change).slice(0, 8);
  const reverseH = reverseStocks.map(s => ({ code: s.code, weight: roundTo(100 / reverseStocks.length, 1) }));

  return [
    makeOpponent('ai-value', '🐻 价值大师', '深度价值投资', '🐻', valueH, stocksData, period),
    makeOpponent('ai-growth', '🐂 成长猎手', '激进成长投资', '🐂', growthH, stocksData, period),
    makeOpponent('ai-momentum', '🐎 趋势追踪', '动量交易策略', '🐎', momentumH, stocksData, period),
    makeOpponent('ai-reverse', '🦉 逆向投资', '超跌反转策略', '🦉', reverseH, stocksData, period),
  ];
}

function makeOpponent(id, name, desc, icon, holdings, stocksData, period) {
  const result = runBacktest(stocksData, holdings, period);
  result.name = id;
  result.label = name;
  result.description = desc;
  result.icon = icon;
  result.isUser = false;
  result.isBenchmark = id.startsWith('benchmark-');
  // 保存持仓信息用于展示
  result.holdingsDetail = holdings.map(h => {
    const stock = stocksData.stocks.find(s => s.code === h.code);
    return {
      code: h.code,
      name: stock?.name || h.code,
      weight: h.weight,
      sector: stock?.sector || '未知',
      market: stock?.market || '未知',
    };
  });
  return result;
}