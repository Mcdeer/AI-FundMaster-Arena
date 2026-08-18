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
  jiucai: ['你这收益曲线……我直接好家伙！建议先开个模拟盘练练手，别急着真金白银往市场里砸，不然分分钟变"关灯吃面"的主角。不过别灰心，每个大佬都是从韭菜走过来的，巴菲特也亏过呢！关键是学会复盘，下次别在山顶站岗了。🌱', '看到你这持仓，我仿佛看到了2015年的自己——那个在5178点满仓加杠杆的少年。追涨杀跌是每个股民的成人礼，记住巴菲特老爷子的话："别人恐惧我贪婪，别人贪婪我更恐惧"，虽然他说这话的时候自己也在买苹果😅'],
  jiuxiang: ['酱香科技含量过高！左手茅台右手五粮液，妥妥的张坤分坤。消费占比{消费}%，葛兰看了都直呼"你这医药仓位还不如我一个零头"。不过你这属于"别人关灯吃面，你淡定加仓"的狠人，建议格局再打开点，别整天在白酒里醉生梦死，万一再来个"限酒令"，天台可能要排队🍶', '这持仓一打开，满屏都是酱香味，我都闻到了！张坤看了连夜打call，但斌看了直呼内行。不过说实话，白酒虽好可不要贪杯，{消费}%的消费仓位，万一再来一次塑化剂风波，你可能就是下一个"醉酒的蝴蝶"🦋'],
  buffett: ['好家伙，这是把巴菲特的作业抄明白了！消费+金融双轮驱动，低换手长持有，老爷子看了都想收你当关门弟子。{最大回撤}%的回撤控制也相当体面，属于"市场大跌我喝茶，别人割肉我加仓"的类型。唯一的小建议：适当配点美股科技，毕竟巴菲特自己都买了苹果，虽然买得有点晚🍎', '价值投资的信仰在你这里得到了完美体现！消费和金融的黄金组合，加上{夏普比率}的夏普比率，说明你赚的不是运气的钱。记住巴菲特的名言："别人贪婪我恐惧"，虽然他说这话的时候自己也在贪婪😏'],
  ark: ['ARK中国分K实锤了！科技占比{科技}%，这波"颠覆性创新"的信仰我respect。不过Cathie Wood的ARKK从高点回撤了快80%，你这{最大回撤}%的波动要做好心理准备。格局很大，但建议配点消费蓝筹当压舱石，别让净值像过山车一样刺激，毕竟心脏只有一个🎢', '重仓科技，信仰创新，Cathie Wood见了你都要说一句"我后继有人"。{科技}%的科技仓位，涨起来是火箭，跌起来是跳楼机。不过年轻人就是要格局大，毕竟"风险越大，收益越大"——虽然这句话坑了不少人，但你不试试怎么知道呢🚀'],
  national: ['{金融}%的金融仓位，稳得像个养老基金，社保基金看了你的持仓都要抄作业。不过"稳"的另一面是"慢"，隔壁成长猎手收益都翻倍了，你还在这慢悠悠地吃股息。建议适当配点科技成长，别让"稳健"变成"躺平"，毕竟你还年轻💤', '工农中建看了流泪，招行平安看了欣慰。你这哪是个人投资者的持仓，分明是国家队的配置方案！{年化收益}%的年化收益虽然不算惊艳，但{最大回撤}%的回撤控制绝对是专业水准。汇金公司HR看了想给你发offer，考虑下考公务员吗🏛️'],
  foxi: ['佛系躺平派实锤！你这换手率{换手率}%，基金经理看了都自愧不如。属于"买了就当忘了"的类型，账户密码可能都忘了。不过这也是一种策略，毕竟"时间的玫瑰"需要耐心浇灌，只要你不看账户，亏损就不存在🧘', '你这持仓稳如老狗，波动比国债还小。但斌看了直呼内行，"时间的玫瑰"说得就是你。建议偶尔也看看账户，确认一下股票还在，毕竟公司退市了你也可能不知道😴'],
  yaoyao: ['医药葛兰分兰来了！{医药}%的医药仓位，这是要复刻中欧医疗健康的节奏啊。葛兰看了都慌，"这仓位比我还激进"。不过医药确实是好赛道，毕竟人都会生病，只要你不怕集采的暴击💊', '重仓医药，信仰健康，葛兰见了你都要叫一声"前辈"。{医药}%的医药仓位，涨起来是救命良药，跌起来是慢性毒药。建议配点其他行业对冲一下，别让净值变成心电图💉'],
  wolf: ['华尔街之狼实锤！{换手率}%的换手率，这是要把券商佣金刷爆的节奏啊。高频交易，主打一个刺激，属于"要么会所嫩模，要么下海干活"的类型。建议算一下交易成本，别让券商赚了你亏🐺', '你这换手率，券商看了都流泪，"终于来了个活雷锋"。龙虎榜常客，涨停板敢死队队长。不过频繁交易容易手滑，建议设置个止损线，别让"割韭菜"变成"割自己"📈'],
  diamond: ['钻石手实锤！{最大回撤}%的回撤都能拿住，这是把"Diamond Hands"刻进DNA了啊。WSB散户大军看了都佩服，"这才是真· hodl"。不过回撤太大也容易心态爆炸，建议设置个止盈止损线💎', '持仓回撤{最大回撤}%都不割肉，你这是把"别人恐惧我贪婪"执行到了极致。属于"要么财富自由，要么天台见"的狠人。建议偶尔也看看基本面，别让"钻石手"变成"接盘手"🙌'],
  global: ['全球宏观玩家来了！覆盖{市场数}个市场，这是要复制桥水全天候策略的节奏啊。Ray Dalio看了都想收徒，"这才是真正的风险平价"。不过跨市场配置需要更多研究，别让"东方不亮西方亮"变成"东方不亮西方也不亮"🌍', '全球化配置，视野开阔，属于"日出东方，唯我不败"的类型。A股港股美股通吃，真正的国际投资者。建议关注一下汇率风险，别让汇率波动吃掉你的收益💱'],
  growth: ['成长股猎人实锤！{科技}%的科技仓位+{营收增长}%的营收增长，这是要复制朱少醒15年20倍的节奏啊。属于"买在分歧，卖在一致"的类型。不过成长股波动大，做好心理准备🌱', '重仓成长，信仰未来，属于"今天很残酷，明天更残酷，后天很美好"的类型。朱少醒看了都点赞，"这才是成长股投资的精髓"。建议配点价值股对冲，别让净值坐过山车🎢'],
  balanced: ['均衡配置达人来了！{最大行业}%的最大行业占比，分散得比指数基金还均匀。谢治宇看了都欣慰，"这才是真正的均衡配置"。属于"不偏科的好学生"，攻守兼备⚖️', '行业分布均衡，风险控制得当，属于"不把鸡蛋放在一个篮子里"的稳健派。虽然短期爆发力不足，但长期复利效应惊人。建议保持这个节奏，时间会给你答案⏰'],
  default: ['你的持仓风格挺有意思的，行业分布{行业分布}，风险控制在合理范围内。虽然没有特别激进的操作，但稳扎稳打也是一种智慧。毕竟投资是马拉松，不是百米冲刺🏃', '整体来看，你的投资框架比较清晰，选股逻辑也有自己的思考。{年化收益}%的年化收益和{夏普比率}的夏普比率说明你的策略是有效的。下一步可以尝试增加跨市场配置，引入一些港股和美股标的，分散单一市场风险🌐'],
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

  // 第四段：持仓特征（更有梗的版本）
  parts.push(`💼 持仓画像：${metrics.stockCount}只标的，`);
  if (metrics.stockCount <= 2) {
    parts.push(`集中度拉满，属于"一把梭"风格——赢了会所嫩模，输了下海干活。建议下次别满仓单调，毕竟黑天鹅来的时候，连巴菲特都扛不住😅`);
  } else if (metrics.stockCount <= 5) {
    parts.push(`集中度适中，属于"精选龙头"派。既不会因为太分散而平庸，也不会因为太集中而暴雷。保持这个节奏，复利效应会帮你实现财富自由🎯`);
  } else {
    parts.push(`分散得比沪深300还均匀，属于"不把鸡蛋放在一个篮子里"的稳健派。虽然短期爆发力不足，但长期下来，时间会成为你的朋友⏰`);
  }

  // PE分析（更有梗）
  if (maxPeStock && minPeStock) {
    const peAnalysis = metrics.pe < 15 
      ? `整体估值偏低，属于"捡烟蒂"型投资者——格雷厄姆看了都想收你为徒。不过要小心价值陷阱，便宜的不一定好，好的不一定便宜🚬`
      : metrics.pe > 35 
      ? `整体估值偏高，属于"为梦想窒息"型——费雪看了都点赞。但高估值需要高成长来消化，一旦业绩不及预期，杀估值的时候会很疼💸`
      : `估值水平合理，既不贪便宜也不追泡沫，属于"性价比"选手。这种理性在A股难能可贵，继续保持🧘`;
    parts.push(`📊 PE跨度从${minPeStock.name}(${minPe.toFixed(0)})到${maxPeStock.name}(${maxPe.toFixed(0)})，${peAnalysis}`);
  }

  // 第五段：杠杆警告（更有梗）
  const leverage = metrics.leverage || 1;
  if (leverage > 3) {
    const leverageWarning = metrics.totalReturn >= 0 
      ? `${leverage}x杠杆！这次确实赚麻了，但别忘了杠杆是把双刃剑——${(metrics.maxDrawdown * leverage).toFixed(0)}%的最大回撤意味着${metrics.maxDrawdown > 20 ? '一个不小心就是"天台见"的节奏。建议赶紧把杠杆降下来，别让到手的鸭子飞了🦆' : '风控稍有闪失就会放大亏损。建议见好就收，别被胜利冲昏头脑😵'}`
      : `${leverage}x杠杆！${(metrics.maxDrawdown * leverage).toFixed(0)}%的回撤已经让你的本金腰斩，再不减仓就要归零了。赶紧降杠杆，活着最重要！🆘`;
    parts.push(`⚠️ ${leverageWarning}`);
  } else if (leverage > 1) {
    parts.push(`⚡ ${leverage}x杠杆，属于"小赌怡情"的范畴。适度放大收益和风险，但记得设置止损线，别让"怡情"变成"伤身"🎰`);
  }

  // 第六段：具体建议（更有梗）
  parts.push(`💡 老炮的几条忠告（建议截图保存）：`);
  let adviceCount = 1;
  if (topSector[1] > 50) {
    parts.push(`${adviceCount++}. 「${topSector[0]}」占比过高，建议适当减仓。单一行业就像单恋一枝花，虽然深情但风险太大，分散配置才能"万花丛中过，片叶不沾身"🌸`);
  }
  if (markets.length < 2) {
    parts.push(`${adviceCount++}. 只玩A股？格局小了！建议配置纳指ETF或标普500ETF，享受全球龙头成长红利。毕竟"东方不亮西方亮"，分散投资才能睡得香🌍`);
  }
  if (metrics.maxDrawdown > 25) {
    parts.push(`${adviceCount++}. 回撤超过25%，心脏还好吗？建议加入黄金ETF或国债ETF作为"压舱石"，平滑净值曲线。毕竟投资是为了更好的生活，不是为了体验过山车🎢`);
  }
  if (metrics.sharpeRatio < 0.3) {
    parts.push(`${adviceCount++}. 夏普比率偏低，说明冒了较大风险却未获得对应回报。建议优化选股，或者考虑买指数基金，毕竟"打不过就加入"也是一种智慧📈`);
  }
  if (metrics.totalReturn < 0) {
    parts.push(`${adviceCount++}. 这次亏了别灰心，投资是一场马拉松。复盘一下选股逻辑，总结经验教训。记住："亏钱不可怕，可怕的是不知道为什么亏"💪`);
  }
  parts.push(`${adviceCount++}. 定期复盘、动态再平衡是长期盈利的关键。不要买入后就"躺平"，市场变化比你想象的快。记住："投资有风险，入市需谨慎"⚠️`);

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