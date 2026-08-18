/**
 * 前端风格诊断引擎 - 智能分析版本
 * 根据实际收益、回撤、杠杆、持仓特征给出精准评价
 */

const STYLE_TAGS = [
  { id: 'jiucai', emoji: '🥬', name: '韭菜本菜', matchPerson: '每一个在市场里交过学费的人', personDesc: '初代股民集体回忆', personOrg: '', condition: (m) => m.totalReturn < 0 && m.concentration > 0.5 },
  { id: 'foxi', emoji: '🧘', name: '佛系躺平派', matchPerson: '但斌', personDesc: '「时间的玫瑰」——买了就当忘了', personOrg: '东方港湾董事长', condition: (m) => m.turnover < 0.3 && m.bluechipRatio > 0.6 },
  { id: 'jiuxiang', emoji: '🍶', name: '酱香科技研究员', matchPerson: '张坤', personDesc: '易方达蓝筹精选掌舵人', personOrg: '易方达基金', condition: (m) => (m.sectorWeights['消费'] || 0) > 30 },
  { id: 'yaoyao', emoji: '💊', name: '医药葛兰分兰', matchPerson: '葛兰', personDesc: '中欧医疗健康，医药赛道信仰者', personOrg: '中欧基金', condition: (m) => (m.sectorWeights['医药'] || 0) > 40 },
  { id: 'ark', emoji: '🚀', name: 'ARK中国分K', matchPerson: 'Cathie Wood', personDesc: 'ARK Invest创始人', personOrg: 'ARK Invest', condition: (m) => (m.sectorWeights['科技'] || 0) > 50 && m.turnover > 0.5 },
  { id: 'buffett', emoji: '👴', name: '巴菲特传人', matchPerson: 'Warren Buffett', personDesc: '价值投资灯塔', personOrg: '伯克希尔·哈撒韦', condition: (m) => { const c = (m.sectorWeights['消费'] || 0) + (m.sectorWeights['金融'] || 0); return c > 50 && m.turnover < 0.3 && m.roe > 15; } },
  { id: 'diamond', emoji: '🦍', name: '钻石手', matchPerson: 'WSB散户大军', personDesc: '「Diamond Hands」——回撤50%也绝不割肉', personOrg: 'Reddit r/wallstreetbets', condition: (m) => m.maxDrawdown > 25 && m.turnover < 0.3 },
  { id: 'wolf', emoji: '🐺', name: '华尔街之狼', matchPerson: '各路游资大佬', personDesc: '高频交易，主打一个刺激', personOrg: '龙虎榜常客', condition: (m) => m.turnover > 0.8 },
  { id: 'national', emoji: '🏛️', name: '国家队在逃成员', matchPerson: '社保基金/汇金', personDesc: '银行+央企+蓝筹，稳如泰山', personOrg: '全国社保基金理事会', condition: (m) => { const c = (m.sectorWeights['金融'] || 0); return c > 40 && m.annualizedVol < 20 && m.roe > 10; } },
  { id: 'global', emoji: '🌍', name: '全球宏观玩家', matchPerson: 'Ray Dalio', personDesc: '桥水基金创始人', personOrg: '桥水基金', condition: (m) => m.crossMarket && m.marketCount >= 3 },
  { id: 'growth', emoji: '🌱', name: '成长股猎人', matchPerson: '朱少醒', personDesc: '富国天惠，15年20倍的公募传奇', personOrg: '富国基金', condition: (m) => (m.sectorWeights['科技'] || 0) > 30 && m.revenueGrowth > 20 },
  { id: 'balanced', emoji: '⚖️', name: '均衡配置达人', matchPerson: '谢治宇', personDesc: '兴全合润，不偏科的均衡派代表', personOrg: '兴证全球基金', condition: (m) => m.maxSectorWeight < 35 && m.stockCount >= 6 },
];

/**
 * 四舍五入到指定小数位
 */
function roundTo(value, decimals) {
  if (value === null || value === undefined || isNaN(value)) return value;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * 生成深度个性化点评 - 智能分析版本
 */
function generateDetailedCommentary(bestTag, metrics, holdings, stockMap) {
  const sectors = Object.entries(metrics.sectorWeights || {}).sort((a, b) => b[1] - a[1]);
  const topSector = sectors[0] || ['未知', 0];
  const markets = Object.entries(metrics.marketWeights || {}).sort((a, b) => b[1] - a[1]);
  const marketNames = { 'a-share': 'A股', 'hk': '港股', 'us': '美股', 'index': '指数ETF' };

  const parts = [];

  // 分析实际持仓特征
  const actualMarkets = {};
  const actualSectors = {};
  holdings.forEach(h => {
    const s = stockMap[h.code];
    if (s) {
      actualMarkets[s.market] = (actualMarkets[s.market] || 0) + h.weight;
      actualSectors[s.sector] = (actualSectors[s.sector] || 0) + h.weight;
    }
  });
  
  const actualMarketList = Object.entries(actualMarkets).sort((a, b) => b[1] - a[1]);
  const actualSectorList = Object.entries(actualSectors).sort((a, b) => b[1] - a[1]);
  const primaryMarket = actualMarketList[0]?.[0];
  const marketCount = actualMarketList.length;

  // 关键判断
  const leverage = metrics.leverage || 1;
  const isLiquidated = metrics.maxDrawdown >= 100 || metrics.totalReturn <= -100;
  const isHighLeverage = leverage > 3;
  const isHugeLoss = metrics.totalReturn < -50;
  const isBigLoss = metrics.totalReturn < -20 && metrics.totalReturn >= -50;
  const isSmallLoss = metrics.totalReturn < 0 && metrics.totalReturn >= -20;
  const isSmallProfit = metrics.totalReturn >= 0 && metrics.totalReturn < 10;
  const isBigProfit = metrics.totalReturn >= 10 && metrics.totalReturn < 50;
  const isHugeProfit = metrics.totalReturn >= 50;

  // 第一段：总体评价
  let overallComment = '';
  
  if (isLiquidated) {
    if (isHighLeverage) {
      overallComment = `💥 **爆仓警告！** 你使用了${leverage}x杠杆，最终回撤${metrics.maxDrawdown.toFixed(1)}%，本金几乎归零。这不是投资，这是赌博！高杠杆+重仓=自杀式操作。`;
    } else {
      overallComment = `💥 **巨额亏损！** 最大回撤${metrics.maxDrawdown.toFixed(1)}%，几乎亏光所有本金。你的选股或择时出现了严重问题。`;
    }
  } else if (isHugeLoss) {
    if (isHighLeverage) {
      overallComment = `📉 **高杠杆惨案！** ${leverage}x杠杆放大了亏损，最终收益${metrics.totalReturn.toFixed(1)}%。杠杆是双刃剑，这次你被割伤了。`;
    } else {
      overallComment = `📉 **深度套牢！** 亏损${Math.abs(metrics.totalReturn).toFixed(1)}%，持仓体验极差。建议重新审视每只股票的基本面。`;
    }
  } else if (isBigLoss) {
    overallComment = `😰 **投资失利！** 亏损${Math.abs(metrics.totalReturn).toFixed(1)}%，虽然没到爆仓程度，但也足够肉疼。复盘一下原因？`;
  } else if (isSmallLoss) {
    overallComment = `🤔 **白忙一场！** 亏了${Math.abs(metrics.totalReturn).toFixed(1)}%，承担了风险却没得到回报。`;
  } else if (isSmallProfit) {
    overallComment = `🙂 **小赚一笔！** 盈利${metrics.totalReturn.toFixed(1)}%，虽然不多但好歹是正收益。`;
  } else if (isBigProfit) {
    overallComment = `😊 **稳健盈利！** 收益${metrics.totalReturn.toFixed(1)}%，回撤${metrics.maxDrawdown.toFixed(1)}%，这是真正的投资能力！`;
  } else if (isHugeProfit) {
    if (isHighLeverage) {
      overallComment = `🚀 **杠杆暴利！** ${leverage}x杠杆+${metrics.totalReturn.toFixed(1)}%收益=暴富神话！但别飘，见好就收。`;
    } else {
      overallComment = `🌟 **投资大师！** 收益${metrics.totalReturn.toFixed(1)}%，这是巴菲特级别的表现！`;
    }
  }

  parts.push(overallComment);

  // 第二段：持仓分析
  parts.push(`\n📊 **持仓诊断**：`);
  
  if (actualSectorList.length > 0) {
    const topSec = actualSectorList[0];
    const sectorComment = topSec[1] > 60 
      ? `重仓${topSec[0]}(${topSec[1].toFixed(0)}%)，集中度极高，风险集中。` 
      : topSec[1] > 40 
      ? `${topSec[0]}(${topSec[1].toFixed(0)}%)占比偏高。`
      : `行业分布较均衡。`;
    parts.push(`• ${sectorComment}`);
  }
  
  if (marketCount === 1) {
    parts.push(`• 全仓${marketNames[primaryMarket] || primaryMarket}，单一市场风险集中。`);
  } else {
    parts.push(`• 跨${marketCount}个市场配置，分散了风险。`);
  }
  
  if (metrics.stockCount <= 2) {
    parts.push(`• 仅${metrics.stockCount}只标的，集中度极高，押注式投资风险极大。`);
  } else if (metrics.stockCount >= 8) {
    parts.push(`• ${metrics.stockCount}只标的，可能过于分散。`);
  } else {
    parts.push(`• ${metrics.stockCount}只标的，集中度适中。`);
  }

  // 第三段：杠杆分析
  if (leverage > 1) {
    parts.push(`\n⚠️ **杠杆分析**（${leverage}x杠杆）：`);
    
    if (isLiquidated) {
      parts.push(`• **爆仓元凶！** ${leverage}x杠杆导致回撤放大。没有杠杆最多亏${(100 / leverage).toFixed(0)}%，有了杠杆亏了100%+。`);
    } else if (isHugeLoss) {
      parts.push(`• **杠杆放大亏损！** ${leverage}x杠杆让你的亏损速度加快了${leverage}倍。`);
    } else {
      parts.push(`• 使用了${leverage}x杠杆，放大了收益和风险。`);
    }
  }

  // 第四段：风险收益
  parts.push(`\n📈 **风险收益**：`);
  parts.push(`• 年化收益：${metrics.annualizedReturn >= 0 ? '+' : ''}${metrics.annualizedReturn.toFixed(1)}%`);
  parts.push(`• 最大回撤：${metrics.maxDrawdown.toFixed(1)}%${metrics.maxDrawdown > 30 ? '（极高风险）' : metrics.maxDrawdown > 20 ? '（高风险）' : metrics.maxDrawdown > 10 ? '（中等风险）' : '（低风险）'}`);
  parts.push(`• 夏普比率：${metrics.sharpeRatio.toFixed(2)}`);

  // 第五段：建议
  parts.push(`\n💡 **专属建议**：`);
  
  const suggestions = [];
  
  if (isLiquidated) {
    suggestions.push(`🚨 立即退出所有杠杆仓位，本金没了就什么都没了。`);
    suggestions.push(`📚 建议先学习《聪明的投资者》等经典书籍。`);
    suggestions.push(`🎮 先用模拟盘练习至少3个月。`);
  } else if (isHugeLoss || isBigLoss) {
    suggestions.push(`🛑 暂停加仓，不要继续摊低成本。`);
    suggestions.push(`🔍 仔细分析每只股票的买入逻辑。`);
    if (isHighLeverage) {
      suggestions.push(`📉 降低杠杆至1x或2x。`);
    }
  } else if (isSmallLoss) {
    suggestions.push(`🤔 微调策略，优化选股标准。`);
  } else if (isSmallProfit) {
    suggestions.push(`📊 加入债券ETF等低风险资产平滑曲线。`);
  } else if (isBigProfit || isHugeProfit) {
    suggestions.push(`💰 适当减仓，锁定部分利润。`);
  }
  
  if (topSector[1] > 60) {
    suggestions.push(`🔄 ${topSector[0]}占比过高，建议减仓分散。`);
  }
  
  if (marketCount === 1 && !isLiquidated) {
    suggestions.push(`🌍 建议配置其他市场分散风险。`);
  }
  
  if (metrics.maxDrawdown > 30 && !isLiquidated) {
    suggestions.push(`🛡️ 设置止损线（如-15%）并严格执行。`);
  }
  
  parts.push(...suggestions.map((s, i) => `${i + 1}. ${s}`));

  // 第六段：总结
  parts.push(`\n🎯 **总结**：`);
  if (isLiquidated) {
    parts.push(`这次投资以爆仓告终。记住这次教训，重建本金，重新出发。💪`);
  } else if (isHugeLoss || isBigLoss) {
    parts.push(`这次投资虽然亏损，但经验比金钱更重要。🌱`);
  } else if (isSmallLoss) {
    parts.push(`基本持平，小幅优化就能扭亏为盈。📚`);
  } else if (isSmallProfit) {
    parts.push(`小赚是不错的开始，继续优化。🐢`);
  } else if (isBigProfit) {
    parts.push(`不错的收益！保持并持续优化。🏆`);
  } else if (isHugeProfit) {
    parts.push(`卓越的表现！保持学习、控制风险。🌟`);
  }

  return parts.join('\n');
}

export function analyzeStyle(stocksData, holdings, backtestResult) {
  const stockMap = {};
  stocksData.stocks.forEach(s => { stockMap[s.code] = s; });

  const sectorWeights = {};
  const marketWeights = {};
  let totalRevenueGrowth = 0, totalRoe = 0, totalPe = 0, bluechipCount = 0;

  holdings.forEach(h => {
    const s = stockMap[h.code];
    if (!s) return;
    const w = h.weight / 100;
    sectorWeights[s.sector] = (sectorWeights[s.sector] || 0) + h.weight;
    marketWeights[s.market] = (marketWeights[s.market] || 0) + h.weight;
    totalRevenueGrowth += s.revenueGrowth * w;
    totalRoe += s.roe * w;
    totalPe += s.pe * w;
    if (s.marketCap > 3000) bluechipCount++;
  });

  const concentration = holdings.length <= 5 ? 0.7 : holdings.length <= 7 ? 0.4 : 0.25;
  const techWeight = sectorWeights['科技'] || 0;
  const turnover = techWeight > 40 ? 0.6 + Math.random() * 0.2 : 0.2 + Math.random() * 0.3;

  const metrics = {
    totalReturn: backtestResult.totalReturn,
    annualizedReturn: backtestResult.annualizedReturn,
    annualizedVol: backtestResult.annualizedVol,
    maxDrawdown: backtestResult.maxDrawdown,
    sharpeRatio: backtestResult.sharpeRatio,
    sortinoRatio: backtestResult.sortinoRatio,
    informationRatio: backtestResult.informationRatio,
    calmarRatio: backtestResult.calmarRatio,
    profitLossRatio: backtestResult.profitLossRatio,
    winRate: backtestResult.winRate,
    fundRating: backtestResult.fundRating,
    ratingReasons: backtestResult.ratingReasons,
    riskLevel: backtestResult.riskLevel,
    leverage: backtestResult.leverage,
    sectorWeights, marketWeights,
    concentration, turnover,
    revenueGrowth: parseFloat(totalRevenueGrowth.toFixed(1)),
    roe: parseFloat(totalRoe.toFixed(2)),
    pe: parseFloat(totalPe.toFixed(2)),
    bluechipRatio: parseFloat((bluechipCount / holdings.length).toFixed(2)),
    maxSectorWeight: parseFloat(Math.max(...Object.values(sectorWeights)).toFixed(1)),
    stockCount: holdings.length,
    crossMarket: Object.keys(marketWeights).length >= 2,
    marketCount: Object.keys(marketWeights).length,
  };

  let bestTag = null, bestScore = 0;
  for (const tag of STYLE_TAGS) {
    if (tag.condition(metrics)) {
      const score = tag.id === 'jiucai' ? 5 : tag.id === 'global' ? 3 : 1;
      if (score > bestScore) { bestScore = score; bestTag = tag; }
    }
  }
  if (!bestTag) bestTag = STYLE_TAGS.find(t => t.id === 'balanced') || STYLE_TAGS[STYLE_TAGS.length - 1];

  const commentary = generateDetailedCommentary(bestTag, metrics, holdings, stockMap);

  const radarData = {
    dimensions: ['年化收益', '风险控制', '行业集中度', '跨市场配置', '选股ROE'],
    values: [
      roundTo(Math.min(100, Math.max(0, metrics.annualizedReturn + 50)), 0),
      roundTo(Math.min(100, Math.max(0, 100 - metrics.annualizedVol)), 0),
      roundTo(Math.min(100, Math.max(0, metrics.maxSectorWeight)), 0),
      roundTo(Math.min(100, Math.max(0, Object.keys(marketWeights).length * 30)), 0),
      roundTo(Math.min(100, Math.max(0, metrics.roe * 1.5)), 0),
    ],
  };

  return {
    styleTag: `${bestTag.emoji} ${bestTag.name}`,
    matchPerson: bestTag.matchPerson,
    matchPersonDesc: bestTag.personDesc,
    matchPersonOrg: bestTag.personOrg || '',
    styleId: bestTag.id,
    metrics,
    radarData,
    commentary,
  };
}
