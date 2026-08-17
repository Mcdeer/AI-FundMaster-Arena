/**
 * ECharts 图表封装
 * 收益曲线图（收益率/金额切换）、雷达图、行业分布环形图、预测曲线
 */

let returnChart = null;
let radarChart = null;
let pieChart = null;
let currentChartMode = 'pct'; // 'pct' or 'value'
let currentResults = [];
let currentAmount = 100000;
let currentLeverage = 1;

/**
 * 四舍五入到指定小数位，解决浮点数精度问题
 */
function roundTo(value, decimals) {
  if (value === null || value === undefined || isNaN(value)) return value;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * 简单线性回归预测（缩短为5%）
 */
function linearForecast(data, steps) {
  const n = data.length;
  if (n < 10) return [];
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (data[i] - yMean);
    den += (i - xMean) * (i - xMean);
  }
  const slope = den !== 0 ? num / den : 0;
  const lastY = data[n - 1];
  const forecast = [];
  for (let i = 1; i <= steps; i++) {
    const noise = (Math.random() - 0.5) * Math.abs(slope) * i * 0.5;
    forecast.push(roundTo(lastY + slope * i + noise, 2));
  }
  return forecast;
}

/**
 * 生成日期标签
 */
function generateDateLabels(totalDataLen, forecastLen) {
  const now = new Date();
  const labels = [];
  const historyLen = totalDataLen - forecastLen;
  // 历史部分倒推
  for (let i = 0; i < historyLen; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (historyLen - i));
    if (i === 0 || i === historyLen - 1 || i % Math.max(1, Math.floor(historyLen / 6)) === 0) {
      labels.push(d.getMonth() + 1 + '/' + d.getDate());
    } else {
      labels.push('');
    }
  }
  // 预测部分
  for (let i = 0; i < forecastLen; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i + 1);
    if (i === 0 || i === forecastLen - 1 || i % Math.max(1, Math.floor(forecastLen / 2)) === 0) {
      labels.push('🔮' + (d.getMonth() + 1) + '/' + d.getDate());
    } else {
      labels.push('');
    }
  }
  return labels;
}

/**
 * 渲染收益曲线图
 */
export function renderReturnChart(containerId, results, amount, leverage) {
  const container = document.getElementById(containerId);
  if (!container) return;

  currentResults = results;
  currentAmount = amount || 100000;
  currentLeverage = leverage || 1;

  if (returnChart) returnChart.dispose();
  returnChart = echarts.init(container);

  renderChartInternal();
}

function renderChartInternal() {
  const results = currentResults;
  const amount = currentAmount;
  const lev = currentLeverage;
  const isValueMode = currentChartMode === 'value';

  const colors = ['#4fc3f7', '#ff5252', '#69f0ae', '#f0c060', '#b388ff', '#ff80ab', '#18ffff', '#ffab40'];
  const lineStyles = ['solid', 'dashed', 'dashed', 'dashed', 'solid', 'solid', 'solid', 'solid'];

  const series = [];
  let maxLen = 0;

  results.forEach((r, i) => {
    const isUser = r.isUser;
    const isBenchmark = r.isBenchmark;
    let data = r.chartData;
    if (data.length > maxLen) maxLen = data.length;

    // 用户基金：生成预测
    let forecastData = [];
    if (isUser) {
      const rawForecast = linearForecast(r.chartData, Math.max(1, Math.floor(maxLen * 0.05)));
      if (rawForecast.length > 0 && liquidationAt < 0) { // 未爆仓才预测
        maxLen = Math.max(maxLen, data.length + rawForecast.length);
        forecastData = rawForecast;
      }
    }

    // 转换数据（检测爆仓截断）
    let displayData;
    let liquidationAt = -1;
    if (isValueMode) {
      displayData = [];
      for (let d = 0; d < data.length; d++) {
        const levPct = (data[d] - 100) * lev;
        if (levPct <= -100) { liquidationAt = d; displayData.push(0); break; }
        displayData.push(roundTo(amount * lev * data[d] / 100, 0));
      }
    } else {
      displayData = [];
      for (let d = 0; d < data.length; d++) {
        const pct = roundTo((data[d] - 100) * lev, 1);
        if (pct <= -100) { liquidationAt = d; displayData.push(-100); break; }
        displayData.push(pct);
      }
    }

    series.push({
      name: r.label,
      type: 'line',
      data: displayData,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: isUser ? 4 : isBenchmark ? 1.5 : 2, type: lineStyles[i] || 'solid', color: colors[i], opacity: isBenchmark ? 0.5 : 1 },
      itemStyle: { color: colors[i] },
      emphasis: { focus: 'series' },
      z: isUser ? 10 : 1,
      endLabel: isUser ? { show: true, formatter: r.label, color: colors[i], fontSize: 11, offset: [10, 0] } : undefined,
      // 爆仓标记
      ...(liquidationAt >= 0 ? {
        markPoint: {
          data: [{ name: '💥', coord: [liquidationAt, isValueMode ? 0 : -100], symbol: 'pin', symbolSize: 35, itemStyle: { color: '#ff5252' }, label: { show: true, formatter: '💥爆仓', fontSize: 14, color: '#ff5252', fontWeight: 'bold', offset: [0, -15] } }],
          animation: false,
        },
      } : {}),
    });

    // 预测虚线
    if (forecastData.length > 0) {
      const fData = isValueMode
        ? forecastData.map(v => roundTo(amount * lev * v / 100, 0))
        : forecastData.map(v => roundTo((v - 100) * lev, 1));
      const padData = new Array(data.length).fill(null).concat(fData);
      while (padData.length < maxLen) padData.push(null);
      series.push({
        name: r.label + '（预测）',
        type: 'line',
        data: padData,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, type: 'dashed', color: colors[i], opacity: 0.4 },
        itemStyle: { color: colors[i] },
        z: 1,
        silent: true,
      });
    }
  });

  // 日期横轴
  const forecastMainLen = results.find(r => r.isUser)?.chartData?.length || maxLen;
  const forecastExtraLen = Math.max(0, maxLen - forecastMainLen);
  const xLabels = generateDateLabels(maxLen, forecastExtraLen);

  const yAxisName = isValueMode ? '总价值（元）' : '收益率（%）';

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17,24,39,0.95)',
      borderColor: 'rgba(79,195,247,0.3)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
      formatter: function (params) {
        const date = params[0].axisValue.replace('🔮', '预测 ');
        let html = '<div style="font-weight:bold;margin-bottom:4px;">' + date + '</div>';
        const sorted = [...params].sort((a, b) => {
          if (a.seriesName.includes('预测')) return 1;
          if (b.seriesName.includes('预测')) return -1;
          return (b.value || 0) - (a.value || 0);
        });
        for (const p of sorted) {
          const isUser = results.find(r => r.label === p.seriesName.replace('（预测）', '') && r.isUser);
          const isForecast = p.seriesName.includes('预测');
          const prefix = isUser ? '⭐ ' : '';
          const suffix = isForecast ? ' 🔮' : '';
          const val = isValueMode ? '¥' + Number(p.value).toLocaleString() : (p.value >= 0 ? '+' : '') + p.value.toFixed(1) + '%';
          html += '<div style="display:flex;align-items:center;gap:6px;' + (isUser ? 'font-weight:bold;' : '') + '">' +
            '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + p.color + ';' + (isForecast ? 'opacity:0.4;border:dashed 1px ' + p.color : '') + '"></span>' +
            prefix + p.seriesName + suffix + ': ' + val + '</div>';
        }
        return html;
      },
    },
    legend: { bottom: 0, textStyle: { color: '#9ca3af', fontSize: 10 }, icon: 'roundRect', itemWidth: 12, itemHeight: 8 },
    grid: { left: '4%', right: '8%', top: '3%', bottom: '15%' },
    xAxis: { type: 'category', data: xLabels, axisLine: { lineStyle: { color: '#2d3d54' } }, axisTick: { show: false }, axisLabel: { color: '#6b7280', fontSize: 9, rotate: 30 }, splitLine: { show: false } },
    yAxis: {
      type: 'value', name: yAxisName,
      nameTextStyle: { color: '#6b7280', fontSize: 10, padding: [0, 40, 0, 0] },
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 10, formatter: isValueMode ? (v) => (v >= 10000 ? (v / 10000).toFixed(1) + '万' : v) : (v) => v + '%' },
      splitLine: { lineStyle: { color: 'rgba(45,61,84,0.3)' } },
      ...(isValueMode ? {} : { min: Math.min, max: Math.max }),
    },
    series,
  };

  returnChart.setOption(option, true);

  const forecastSection = document.getElementById('forecast-section');
  if (forecastSection) forecastSection.classList.toggle('hidden', forecastMainLen === maxLen);

  window.addEventListener('resize', () => returnChart?.resize());
}

/**
 * 切换图表模式
 */
export function toggleChartMode(mode) {
  currentChartMode = mode;
  if (returnChart) {
    returnChart.dispose();
    returnChart = echarts.init(document.getElementById('chart-returns'));
    renderChartInternal();
  }

  // 更新按钮状态
  document.getElementById('chart-mode-pct')?.classList.toggle('active', mode === 'pct');
  document.getElementById('chart-mode-pct')?.classList.toggle('bg-neon-blue/20', mode === 'pct');
  document.getElementById('chart-mode-pct')?.classList.toggle('text-neon-blue', mode === 'pct');
  document.getElementById('chart-mode-pct')?.classList.toggle('border-neon-blue/30', mode === 'pct');
  document.getElementById('chart-mode-pct')?.classList.toggle('bg-dark-500/30', mode !== 'pct');
  document.getElementById('chart-mode-pct')?.classList.toggle('text-gray-400', mode !== 'pct');
  document.getElementById('chart-mode-pct')?.classList.toggle('border-dark-500', mode !== 'pct');

  document.getElementById('chart-mode-value')?.classList.toggle('active', mode === 'value');
  document.getElementById('chart-mode-value')?.classList.toggle('bg-neon-blue/20', mode === 'value');
  document.getElementById('chart-mode-value')?.classList.toggle('text-neon-blue', mode === 'value');
  document.getElementById('chart-mode-value')?.classList.toggle('border-neon-blue/30', mode === 'value');
  document.getElementById('chart-mode-value')?.classList.toggle('bg-dark-500/30', mode !== 'value');
  document.getElementById('chart-mode-value')?.classList.toggle('text-gray-400', mode !== 'value');
  document.getElementById('chart-mode-value')?.classList.toggle('border-dark-500', mode !== 'value');
}

/**
 * 雷达图
 */
export function renderRadarChart(containerId, radarData, userLabel) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (radarChart) radarChart.dispose();
  radarChart = echarts.init(container);

  const option = {
    backgroundColor: 'transparent',
    tooltip: { backgroundColor: 'rgba(17,24,39,0.95)', borderColor: 'rgba(124,58,237,0.3)', textStyle: { color: '#e5e7eb' } },
    radar: {
      center: ['50%', '50%'], radius: '65%',
      indicator: radarData.dimensions.map(d => ({ name: d, max: 100 })),
      axisName: { color: '#9ca3af', fontSize: 11 },
      splitArea: { areaStyle: { color: ['rgba(79,195,247,0.02)', 'rgba(79,195,247,0.02)'] } },
      splitLine: { lineStyle: { color: 'rgba(45,61,84,0.3)' } },
      axisLine: { lineStyle: { color: 'rgba(45,61,84,0.5)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: radarData.values, name: userLabel || '你的基金',
        areaStyle: { color: 'rgba(124,58,237,0.15)' },
        lineStyle: { color: '#b388ff', width: 2 },
        itemStyle: { color: '#b388ff' }, symbol: 'circle', symbolSize: 5,
      }],
    }],
  };
  radarChart.setOption(option, true);
  window.addEventListener('resize', () => radarChart?.resize());
}

/**
 * 行业环形图
 */
export function initPieChart() {
  const container = document.getElementById('sector-pie');
  if (!container) return;
  if (pieChart) pieChart.dispose();
  pieChart = echarts.init(container);
}

export function updatePieChart(data) {
  if (!pieChart) return;
  const colors = ['#4fc3f7', '#69f0ae', '#f0c060', '#ff5252', '#b388ff', '#ff80ab', '#18ffff'];
  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: 'rgba(17,24,39,0.95)', borderColor: 'rgba(79,195,247,0.3)', textStyle: { color: '#e5e7eb' }, formatter: '{b}: {c}% ({d}%)' },
    series: [{
      type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
      emphasis: { label: { fontSize: 14, fontWeight: 'bold' }, scaleSize: 8 },
      label: { color: '#9ca3af', fontSize: 11, formatter: '{b}\n{c}%' },
      labelLine: { lineStyle: { color: '#4b5563' } },
      data: data.length > 0 ? data : [{ name: '未选择', value: 100, itemStyle: { color: '#1f2937' } }],
      itemStyle: { borderColor: '#0a0e17', borderWidth: 2, color: (p) => colors[p.dataIndex % colors.length] },
    }],
  };
  pieChart.setOption(option, true);
}

export function disposeAllCharts() {
  returnChart?.dispose(); returnChart = null;
  radarChart?.dispose(); radarChart = null;
  pieChart?.dispose(); pieChart = null;
}