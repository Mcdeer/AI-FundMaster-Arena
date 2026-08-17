/**
 * 前端风格诊断引擎
 * 浏览器端运行，分析用户投资风格
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
 * 四舍五入到指定小数位，解决浮点数精度问题
 */
function roundTo(value, decimals) {
  if (value === null || value === undefined || isNaN(value)) return value;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

const FALLBACK_COMMENTARIES = {
  jiucai: ['你这持仓……建议先开个模拟盘再练练，真金白银下去可就变成"关灯吃面"了。不过别灰心，每个大佬都是从韭菜走过来的，关键是要学会复盘！', '看到这个收益曲线，我想起了2015年的自己。追涨杀跌是每个股民的成人礼，下次记得"别人恐惧我贪婪，别人贪婪我更恐惧"——巴菲特老爷子说的。'],
  jiuxiang: ['酱香科技含量过高！左手茅台右手五粮液，妥妥张坤分坤。消费占比{消费}%，葛兰看了都直呼"你这医药仓位还不如我一个零头"。不过蓝筹底仓很扎实，属于"别人关灯吃面，你淡定加仓"的狠人。建议格局再打开点，纳指科技配一些，别整天在白酒里醉生梦死🍶', '这持仓一打开，满屏都是酱香味。张坤看了连夜打call，但斌看了直呼内行。不过说实话，白酒虽好可不要贪杯，{消费}%的消费仓位，万一再来一次"限酒令"，天台可能要排队。建议加点科技对冲一下。'],
  buffett: ['好家伙，这是把巴菲特的作业抄明白了！消费+金融双轮驱动，低换手长持有，老爷子看了都想收你当关门弟子。{最大回撤}%的回撤控制也相当体面，属于"市场大跌我喝茶"的类型。唯一的小建议：适当配点美股科技，巴菲特自己都买了苹果🍎', '价值投资的信仰在你这里得到了完美体现。消费和金融的黄金组合，加上{夏普比率}的夏普比率，说明你赚的不是运气的钱。巴菲特说过"别人贪婪我恐惧"，你这持仓确实有几分老爷子的风采。'],
  ark: ['ARK中国分K实锤了！科技占比{科技}%，这波"颠覆性创新"的信仰我respect。不过Cathie Wood的ARKK从高点回撤了快80%，你这{最大回撤}%的波动要做好心理准备。格局很大，但建议配点消费蓝筹当压舱石，别让净值像过山车一样刺激🎢', '重仓科技，信仰创新，Cathie Wood见了你都要说一句"我后继有人"。{科技}%的科技仓位，涨起来是火箭，跌起来是跳楼机。不过年轻人就是要格局大，毕竟"风险越大，收益越大"——虽然这句话坑了不少人。'],
  national: ['{金融}%的金融仓位，稳得像个养老基金。社保基金看了你的持仓都要抄作业。不过"稳"的另一面是"慢"，隔壁成长猎手收益都翻倍了，你还在这慢悠悠地吃股息。建议适当配点科技成长，别让"稳健"变成"躺平"💤', '工农中建看了流泪，招行平安看了欣慰。你这哪是个人投资者的持仓，分明是国家队的配置方案。{年化收益}%的年化收益虽然不算惊艳，但{最大回撤}%的回撤控制绝对是专业水准。汇金公司HR看了想给你发offer。'],
  default: ['你的持仓风格挺有意思的，行业分布比较均衡，风险控制在合理范围内。虽然没有特别激进的操作，但稳扎稳打也是一种智慧。建议持续关注行业轮动机会，适当提升科技和消费的配置比例，让组合更有进攻性。', '整体来看，你的投资框架比较清晰，选股逻辑也有自己的思考。{年化收益}%的年化收益和{夏普比率}的夏普比率说明你的策略是有效的。下一步可以尝试增加跨市场配置，引入一些港股和美股标的，分散单一市场风险。'],
};

/**
 * 生成深度个性化点评
 */
function generateDetailedCommentary(bestTag, metrics, holdings, stockMap) {
  const sectors = Object.entries(metrics.sectorWeights || {}).sort((a, b) => b[1] - a[1]);
  const topSector = sectors[0] || ['未知', 0];
  const secondSector = sectors[1] || ['无', 0];
  const markets = Object.entries(metrics.marketWeights || {}).sort((a, b) => b[1] - a[1]);
  const marketNames = { 'a-share': '🇨🇳A股', 'hk': '🇭🇰港股', 'us': '🇺🇸美股', 'index': '📊指数ETF' };

  let maxPeStock = null, minPeStock = null, maxPe = -Infinity, minPe = Infinity;
  holdings.forEach(h => {
    const s = stockMap[h.code];
    if (!s || s.pe <= 0) return;
    if (s.pe > maxPe) { maxPe = s.pe; maxPeStock = s; }
    if (s.pe < minPe) { minPe = s.pe; minPeStock = s; }
  });

  const parts = [];

  // 第一段：风格定性
  parts.push(`🔍 你的投资风格是「${bestTag.emoji} ${bestTag.name}」，最接近的偶像是${bestTag.matchPerson}——${bestTag.personDesc}。${bestTag.matchPersonOrg ? '现任' + bestTag.matchPersonOrg + '。' : ''}`);

  // 第二段：行业与市场
  parts.push(`📊 你重仓「${topSector[0]}」(${topSector[1].toFixed(0)}%)，其次是「${secondSector[0]}」(${secondSector[1].toFixed(0)}%)。${topSector[1] > 50 ? '单一行业集中度偏高，涨跌都容易放大，建议适当分散。' : topSector[1] < 30 ? '行业分布均衡，分散化做得不错。' : '行业集中度适中，攻守兼备。'}`);

  if (markets.length >= 2) {
    parts.push(`🌍 覆盖${markets.length}个市场：${markets.map(m => marketNames[m[0]] || m[0]).join('、')}。${markets.length >= 3 ? '全球化视野开阔，真正做到了「东方不亮西方亮」！' : '跨市场配置不错，可考虑进一步拓宽到更多海外市场。'}`);
  } else {
    parts.push(`🌍 目前仅配置${marketNames[markets[0]?.[0]] || '单一'}市场，建议加入纳指ETF或标普500ETF分散系统性风险。`);
  }

  // 第三段：收益与风险
  const retLabel = metrics.totalReturn >= 0 ? '盈利' : '亏损';
  parts.push(`💰 回测期内${retLabel}${metrics.totalReturn >= 0 ? '+' : ''}${metrics.totalReturn.toFixed(1)}%（年化${metrics.annualizedReturn >= 0 ? '+' : ''}${metrics.annualizedReturn.toFixed(1)}%），最大回撤${metrics.maxDrawdown.toFixed(1)}%，夏普比率${metrics.sharpeRatio.toFixed(2)}。`);

  if (metrics.totalReturn > 50) {
    parts.push(`收益炸裂！但${metrics.maxDrawdown.toFixed(1)}%的回撤也说明「富贵险中求」。记住：凭运气赚的钱，别凭实力亏回去。`);
  } else if (metrics.totalReturn > 10) {
    parts.push(`收益稳健可期，回撤控制得当，属于「稳稳幸福」型选手。`);
  } else if (metrics.totalReturn > 0) {
    parts.push(`勉强跑赢存款，但距离「财富自由」还有差距。优化行业配置，提升夏普比率是下一步关键。`);
  } else {
    parts.push(`亏钱不可怕，可怕的是不知道为什么亏。复盘这段时期的选股逻辑，总结经验教训。`);
  }

  // 第四段：持仓特征
  parts.push(`💼 持有${metrics.stockCount}只标的，`);
  if (metrics.stockCount <= 2) parts.push(`持仓极为集中，属于「一把梭」风格——要么会所嫩模，要么下海干活。`);
  else if (metrics.stockCount <= 5) parts.push(`持仓集中度适中，兼顾了进攻性和防御性。`);
  else parts.push(`持仓分散稳健，鸡蛋不放在一个篮子里，风控意识点赞。`);

  if (maxPeStock && minPeStock) {
    parts.push(`PE跨度从${minPeStock.name}的${minPe.toFixed(0)}到${maxPeStock.name}的${maxPe.toFixed(0)}，${metrics.pe < 15 ? '整体偏价值，喜欢捡「便宜货」——格雷厄姆精神继承者。' : metrics.pe > 35 ? '整体偏成长，愿意为高增长故事买单——费雪信徒。' : '估值水平合理，不贪便宜也不追泡沫。'}`);
  }

  // 第五段：杠杆警告
  const leverage = metrics.leverage || 1;
  if (leverage > 3) {
    parts.push(`⚠️ ${leverage}x杠杆！${metrics.totalReturn >= 0 ? `虽然这次赚了，但别忘了杠杆是把双刃剑——${(metrics.maxDrawdown * leverage).toFixed(0)}%的最大杠杆回撤意味着${metrics.maxDrawdown > 20 ? '一个不小心就是「天台见」的节奏。' : '风控稍有闪失就会放大亏损。'}` : `${(metrics.maxDrawdown * leverage).toFixed(0)}%的杠杆回撤已经让你的本金大幅缩水，降杠杆、控风险是当务之急！`}`);
  } else if (leverage > 1) {
    parts.push(`⚡ ${leverage}x杠杆适度放大了收益和风险，属于「小赌怡情」的范畴。`);
  }

  // 第六段：具体建议
  parts.push(`💡 几条干货建议：`);
  if (topSector[1] > 50) parts.push(`① 降低「${topSector[0]}」配置，加入其他行业分散风险；`);
  if (markets.length < 2) parts.push(`② 配置纳指ETF或标普500ETF，享受全球龙头成长红利；`);
  if (metrics.maxDrawdown > 25) parts.push(`③ 加入黄金ETF或国债ETF作为「压舱石」，平滑净值曲线；`);
  if (metrics.sharpeRatio < 0.3) parts.push(`④ 夏普比率偏低，说明冒了较大风险却未获得对应回报，需要优化选股；`);
  parts.push(`⑤ 定期复盘、动态再平衡是长期盈利的关键——不要买入后就「躺平」。`);

  return parts.join('\n\n');
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