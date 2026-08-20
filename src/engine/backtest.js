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
    const clamped = Math.max(1, Math.min(120, months)); // 1~120月兜底
    return Math.floor(TRADING_DAYS * clamped / 12);
  }
  return PERIOD_MAP[period] || TRADING_DAYS;
}

/**
 * 运行回测
 */
export function runBacktest(stocksData, holdings, period) {
  const stockMap = {};
  stocksData.stocks.forEach(s => { stockMap[s.code] = s; });

  // 计算可用数据长度（取所有持仓股票的最短价格序列）
  const maxAvailableDays = holdings.reduce((min, h) => {
    const stock = stockMap[h.code];
    return stock ? Math.min(min, stock.prices.length) : min;
  }, Infinity);
  const totalDays = isFinite(maxAvailableDays) ? maxAvailableDays : TRADING_DAYS * 5;

  // 回测天数不能超过实际数据长度
  const requestedDays = Math.min(getPeriodDays(period), TRADING_DAYS * 10);
  const days = Math.min(requestedDays, totalDays);

  // 构建每日组合净值
  const dailyValues = [];
  const initialValue = 100;

  for (let d = days; d > 0; d--) {
    const idx = totalDays - d;
    if (idx < 0) continue; // 安全兜底
    let portfolioValue = 0;

    for (const h of holdings) {
      const stock = stockMap[h.code];
      if (!stock || idx >= stock.prices.length) continue;
      const price = stock.prices[idx];
      const startPrice = stock.prices[totalDays - days];
      if (!price || !startPrice || startPrice === 0) continue;
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
  
  // 夏普比率（风险调整后收益）
  const sharpeRatio = annualizedVol > 0
    ? roundTo((annualizedReturn / 100 - riskFreeRate) / (annualizedVol / 100), 2)
    : 0;
  
  // 索提诺比率（只考虑下行波动）
  const downsideReturns = dailyReturns.filter(r => r < 0);
  const downsideDev = downsideReturns.length > 0 
    ? Math.sqrt(downsideReturns.reduce((a, r) => a + Math.pow(r - (downsideReturns.reduce((x, y) => x + y, 0) / downsideReturns.length), 2), 0) / downsideReturns.length)
    : 0;
  const sortinoRatio = downsideDev > 0
    ? roundTo((annualizedReturn / 100 - riskFreeRate) / (downsideDev * Math.sqrt(TRADING_DAYS)), 2)
    : 0;
  
  // 特雷诺比率（单位系统风险的超额收益）
  // 简化计算，假设市场beta为1
  const treynorRatio = roundTo((annualizedReturn / 100 - riskFreeRate) / 1, 2);
  
  // 信息比率（相对于基准的超额收益/跟踪误差）
  const activeReturns = dailyReturns.map(r => r - riskFreeRate / TRADING_DAYS);
  const trackingError = Math.sqrt(activeReturns.reduce((a, r) => a + r * r, 0) / activeReturns.length) * Math.sqrt(TRADING_DAYS);
  const informationRatio = trackingError > 0
    ? roundTo((annualizedReturn / 100 - riskFreeRate) / trackingError, 2)
    : 0;
  
  // Calmar比率（年化收益/最大回撤）
  const calmarRatio = maxDrawdown > 0
    ? roundTo(annualizedReturn / maxDrawdown, 2)
    : 0;

  const upDays = dailyReturns.filter(r => r > 0).length;
  const winRate = roundTo((upDays / dailyReturns.length) * 100, 1);
  
  // 盈亏比（平均盈利/平均亏损）
  const avgGain = dailyReturns.filter(r => r > 0).reduce((a, b) => a + b, 0) / dailyReturns.filter(r => r > 0).length || 0;
  const avgLoss = Math.abs(dailyReturns.filter(r => r < 0).reduce((a, b) => a + b, 0) / dailyReturns.filter(r => r < 0).length) || 0;
  const profitLossRatio = avgLoss > 0 ? roundTo(avgGain / avgLoss, 2) : 0;
  
  // 基金评级（五星制）
  let fundRating = 0;
  let ratingReasons = [];
  
  // 基于夏普比率评分
  if (sharpeRatio >= 1.5) { fundRating += 2; ratingReasons.push('夏普比率优秀'); }
  else if (sharpeRatio >= 1.0) { fundRating += 1.5; ratingReasons.push('夏普比率良好'); }
  else if (sharpeRatio >= 0.5) { fundRating += 1; ratingReasons.push('夏普比率一般'); }
  
  // 基于最大回撤评分
  if (maxDrawdown <= 10) { fundRating += 1.5; ratingReasons.push('回撤控制优秀'); }
  else if (maxDrawdown <= 20) { fundRating += 1; ratingReasons.push('回撤控制良好'); }
  else if (maxDrawdown <= 30) { fundRating += 0.5; }
  
  // 基于年化收益评分
  if (annualizedReturn >= 20) { fundRating += 1.5; ratingReasons.push('收益表现优秀'); }
  else if (annualizedReturn >= 10) { fundRating += 1; ratingReasons.push('收益表现良好'); }
  else if (annualizedReturn >= 5) { fundRating += 0.5; }
  
  // 基于胜率评分
  if (winRate >= 60) { fundRating += 0.5; ratingReasons.push('胜率较高'); }
  
  fundRating = Math.min(5, Math.max(1, Math.round(fundRating)));
  
  // 风险等级
  let riskLevel = '中';
  if (maxDrawdown <= 15 && annualizedVol <= 20) riskLevel = '低';
  else if (maxDrawdown >= 30 || annualizedVol >= 40) riskLevel = '高';

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
    sortinoRatio,
    treynorRatio,
    informationRatio,
    calmarRatio,
    profitLossRatio,
    winRate,
    fundRating,
    ratingReasons,
    riskLevel,
    initialValue,
    finalValue,
    chartData,
    dateLabels,
    days,
    holdings: holdings.map(h => {
      const s = stockMap[h.code];
      return { code: h.code, name: s?.name || h.code, weight: h.weight };
    }),
  };
}

export { TRADING_DAYS, PERIOD_MAP };