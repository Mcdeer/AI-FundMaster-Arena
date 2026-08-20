/**
 * 技术指标服务
 * 纯JS实现，不依赖外部库
 */

/**
 * 简单移动平均线 (SMA)
 */
export function calcSMA(prices, period) {
  if (prices.length < period) return [];
  const result = new Array(prices.length).fill(null);
  let sum = 0;
  for (let i = 0; i < prices.length; i++) {
    sum += prices[i];
    if (i >= period) sum -= prices[i - period];
    if (i >= period - 1) result[i] = parseFloat((sum / period).toFixed(2));
  }
  return result;
}

/**
 * 指数移动平均线 (EMA)
 */
export function calcEMA(prices, period) {
  if (prices.length < period) return [];
  const result = new Array(prices.length).fill(null);
  const multiplier = 2 / (period + 1);

  // 初始值为SMA
  let sum = 0;
  for (let i = 0; i < period; i++) sum += prices[i];
  result[period - 1] = parseFloat((sum / period).toFixed(2));

  for (let i = period; i < prices.length; i++) {
    result[i] = parseFloat(((prices[i] - result[i - 1]) * multiplier + result[i - 1]).toFixed(2));
  }
  return result;
}

/**
 * RSI (相对强弱指数)
 */
export function calcRSI(prices, period = 14) {
  if (prices.length < period + 1) return [];
  const result = new Array(prices.length).fill(null);
  const gains = [], losses = [];

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < gains.length; i++) {
    if (avgLoss === 0) {
      result[i + 1] = 100;
    } else {
      const rs = avgGain / avgLoss;
      result[i + 1] = parseFloat((100 - 100 / (1 + rs)).toFixed(1));
    }
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }
  return result;
}

/**
 * MACD
 */
export function calcMACD(prices, fast = 12, slow = 26, signal = 9) {
  if (prices.length < slow + signal) return { macd: [], signal: [], histogram: [] };

  const emaFast = calcEMA(prices, fast);
  const emaSlow = calcEMA(prices, slow);

  const macdLine = [];
  for (let i = 0; i < prices.length; i++) {
    if (emaFast[i] != null && emaSlow[i] != null) {
      macdLine.push(parseFloat((emaFast[i] - emaSlow[i]).toFixed(4)));
    } else {
      macdLine.push(null);
    }
  }

  // Signal line = EMA of MACD line
  const validMacd = macdLine.filter(v => v != null);
  const signalLine = calcEMA(validMacd, signal);

  // Align signal with original array
  const signalAligned = new Array(prices.length).fill(null);
  const macdStartIdx = macdLine.findIndex(v => v != null);
  const signalStartIdx = macdStartIdx + slow + signal - 2;
  for (let i = 0; i < signalLine.length; i++) {
    const idx = signalStartIdx + i;
    if (idx < prices.length) signalAligned[idx] = signalLine[i];
  }

  // Histogram
  const histogram = [];
  for (let i = 0; i < prices.length; i++) {
    if (macdLine[i] != null && signalAligned[i] != null) {
      histogram.push(parseFloat((macdLine[i] - signalAligned[i]).toFixed(4)));
    } else {
      histogram.push(null);
    }
  }

  return { macd: macdLine, signal: signalAligned, histogram };
}

/**
 * 布林带 (Bollinger Bands)
 */
export function calcBollinger(prices, period = 20, stdDev = 2) {
  if (prices.length < period) return { middle: [], upper: [], lower: [] };

  const middle = calcSMA(prices, period);
  const upper = new Array(prices.length).fill(null);
  const lower = new Array(prices.length).fill(null);

  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = middle[i];
    const variance = slice.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / period;
    const std = Math.sqrt(variance);
    upper[i] = parseFloat((mean + stdDev * std).toFixed(2));
    lower[i] = parseFloat((mean - stdDev * std).toFixed(2));
  }

  return { middle, upper, lower };
}