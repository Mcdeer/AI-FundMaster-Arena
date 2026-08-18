/**
 * 前端回测引擎
 * 浏览器端运行的纯JavaScript回测计算
 */

const TRADING_DAYS = 252;

/**
 * 四舍五入到指定小数位，解决浮点数精度问题
 */
function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

const PERIOD_MAP = {
  '3m': Math.floor(TRADING_DAYS / 4),
  '6m': Math.floor(TRADING_DAYS / 2),
  '1y': TRADING_DAYS,
  '3y': TRADING_DAYS * 3,
  '5y': TRADING_DAYS * 5,
  '10y': TRADING_DAYS * 10,
};

/**
 * 解析周期为天数
 */
function getPeriodDays(period) {
  if (period.startsWith('custom')) {
    const months = parseInt(period.replace('custom', '')) || 18;
    return Math.floor(TRADING_DAYS * months / 12);
  }
  return PERIOD_MAP[period] || TRADING_DAYS;
}

/**
 * 运行回测
 */
export function runBacktest(stocksData, holdings, period) {
  const days = Math.min(getPeriodDays(period), TRADING_DAYS * 10);
  const stockMap = {};
  stocksData.stocks.forEach(s => { stockMap[s.code] = s; });

  // 构建每日组合净值
  const dailyValues = [];
  const initialValue = 100;
  const totalDays = stockMap[holdings[0].code]?.prices.length || TRADING_DAYS * 5;

  for (let d = days; d > 0; d--) {
    const idx = totalDays - d;
    let portfolioValue = 0;

    for (const h of holdings) {
      const stock = stockMap[h.code];
      if (!stock || idx >= stock.prices.length) continue;
      const price = stock.prices[idx];
      const startPrice = stock.prices[totalDays - days];
      const weightFraction = h.weight / 100;
      portfolioValue += weightFraction * (price / startPrice);
    }

    dailyValues.push(parseFloat((initialValue * portfolioValue).toFixed(4)));
  }

  // 计算指标（使用辅助函数处理浮点数精度）
  const finalValue = dailyValues[dailyValues.length - 1];
  const totalReturn = roundTo(((finalValue - initialValue) / initialValue) * 100, 2);

  let maxDrawdown = 0;
  let peak = dailyValues[0];
  for (const v of dailyValues) {
    if (v > peak) peak = v;
    const dd = (peak - v) / peak * 100;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }
  maxDrawdown = roundTo(maxDrawdown, 2);

  const years = days / TRADING_DAYS;
  const annualizedReturn = roundTo((Math.pow(finalValue / initialValue, 1 / years) - 1) * 100, 2);

  const dailyReturns = [];
  for (let i = 1; i < dailyValues.length; i++) {
    dailyReturns.push((dailyValues[i] - dailyValues[i - 1]) / dailyValues[i - 1]);
  }
  const meanReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / dailyReturns.length;
  const dailyVol = Math.sqrt(variance);
  const annualizedVol = roundTo(dailyVol * Math.sqrt(TRADING_DAYS) * 100, 2);

  const riskFreeRate = 0.02;
  const sharpeRatio = annualizedVol > 0
    ? roundTo((annualizedReturn / 100 - riskFreeRate) / (annualizedVol / 100), 2)
    : 0;

  const upDays = dailyReturns.filter(r => r > 0).length;
  const winRate = roundTo((upDays / dailyReturns.length) * 100, 1);

  // 采样净值曲线
  const sampleInterval = Math.max(1, Math.floor(dailyValues.length / 50));
  const chartData = [];
  const chartDataIndices = []; // 记录采样点的索引，用于生成日期
  for (let i = 0; i < dailyValues.length; i += sampleInterval) {
    chartData.push(dailyValues[i]);
    chartDataIndices.push(i);
  }
  if ((dailyValues.length - 1) % sampleInterval !== 0) {
    chartData.push(dailyValues[dailyValues.length - 1]);
    chartDataIndices.push(dailyValues.length - 1);
  }

  // 生成日期标签（基于回测周期）
  const endDate = new Date(); // 回测结束日期为今天
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);
  
  const dateLabels = chartDataIndices.map(idx => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + idx);
    return (d.getMonth() + 1) + '/' + d.getDate();
  });

  return {
    name: 'user',
    label: '你的基金',
    isUser: true,
    totalReturn,
    annualizedReturn,
    annualizedVol,
    maxDrawdown,
    sharpeRatio,
    winRate,
    initialValue,
    finalValue,
    chartData,
    dateLabels, // 添加日期标签
    days, // 添加回测天数
    holdings: holdings.map(h => {
      const s = stockMap[h.code];
      return { code: h.code, name: s?.name || h.code, weight: h.weight };
    }),
  };
}

export { TRADING_DAYS, PERIOD_MAP };