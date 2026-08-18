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

  // 用户基金使用亮色，其他使用暗色
  const userColor = '#4fc3f7'; // 亮蓝色
  const otherColors = ['#69f0ae', '#f0c060', '#b388ff', '#ff80ab', '#18ffff', '#ffab40', '#ff5252'];

  const series = [];
  let maxLen = 0;
  let userDataLen = 0;

  // 先找到用户基金的数据长度
  const userResult = results.find(r => r.isUser);
  if (userResult) {
    userDataLen = userResult.chartData.length;
  }

  // 计算最大长度（包括预测）
  results.forEach((r, i) => {
    if (r.chartData.length > maxLen) maxLen = r.chartData.length;
  });

  // 为用户基金生成预测数据
  let userForecastData = [];
  let userLiquidationAt = -1;
  if (userResult) {
    // 检查是否爆仓
    const data = userResult.chartData;
    for (let d = 0; d < data.length; d++) {
      const checkValue = isValueMode ? (data[d] - 100) * lev : (data[d] - 100) * lev;
      if (checkValue <= -100) {
        userLiquidationAt = d;
        break;
      }
    }

    // 只有在未爆仓时才生成预测
    if (userLiquidationAt < 0) {
      const rawForecast = linearForecast(userResult.chartData, Math.max(1, Math.floor(maxLen * 0.05)));
      if (rawForecast.length > 0) {
        userForecastData = rawForecast;
        maxLen = Math.max(maxLen, userDataLen + userForecastData.length);
      }
    }
  }

  // 生成日期标签 - 使用回测数据返回的日期
  let xLabels = [];
  const userResultWithDates = results.find(r => r.isUser && r.dateLabels);
  if (userResultWithDates && userResultWithDates.dateLabels) {
    xLabels = [...userResultWithDates.dateLabels];
  } else {
    // 如果没有日期标签，使用默认生成
    const forecastExtraLen = Math.max(0, maxLen - userDataLen);
    xLabels = generateDateLabels(maxLen, forecastExtraLen);
  }
  
  // 添加预测部分的日期标签
  if (userForecastData.length > 0 && xLabels.length > 0) {
    const lastDateStr = xLabels[xLabels.length - 1];
    const [lastMonth, lastDay] = lastDateStr.split('/').map(Number);
    for (let i = 1; i <= userForecastData.length; i++) {
      const d = new Date(2026, lastMonth - 1, lastDay);
      d.setDate(d.getDate() + i);
      const label = (i === 1 || i === userForecastData.length || i % Math.max(1, Math.floor(userForecastData.length / 3)) === 0) 
        ? '🔮' + (d.getMonth() + 1) + '/' + d.getDate()
        : '';
      xLabels.push(label);
    }
  }

  // 生成系列数据
  results.forEach((r, i) => {
    const isUser = r.isUser;
    const isBenchmark = r.isBenchmark;
    const data = r.chartData;
    const color = isUser ? userColor : otherColors[(i - 1) % otherColors.length];

    // 转换数据（检测爆仓截断）
    let displayData = [];
    let liquidationAt = -1;

    if (isValueMode) {
      for (let d = 0; d < data.length; d++) {
        const levPct = (data[d] - 100) * lev;
        if (levPct <= -100) { liquidationAt = d; displayData.push(0); break; }
        displayData.push(roundTo(amount * lev * data[d] / 100, 0));
      }
    } else {
      for (let d = 0; d < data.length; d++) {
        const pct = roundTo((data[d] - 100) * lev, 1);
        if (pct <= -100) { liquidationAt = d; displayData.push(-100); break; }
        displayData.push(pct);
      }
    }

    // 填充null到最大长度（用于对齐x轴）
    while (displayData.length < maxLen) displayData.push(null);

    // 用户基金：添加预测数据
    let seriesData = [...displayData];
    if (isUser && userForecastData.length > 0 && !isValueMode) {
      // 在预测部分添加数据
      for (let j = 0; j < userForecastData.length; j++) {
        const forecastValue = roundTo((userForecastData[j] - 100) * lev, 1);
        if (userDataLen + j < seriesData.length) {
          seriesData[userDataLen + j] = forecastValue;
        } else {
          seriesData.push(forecastValue);
        }
      }
    } else if (isUser && userForecastData.length > 0 && isValueMode) {
      for (let j = 0; j < userForecastData.length; j++) {
        const forecastValue = roundTo(amount * lev * userForecastData[j] / 100, 0);
        if (userDataLen + j < seriesData.length) {
          seriesData[userDataLen + j] = forecastValue;
        } else {
          seriesData.push(forecastValue);
        }
      }
    }

    // 用户基金：分成历史数据和预测数据两个系列
    if (isUser && userForecastData.length > 0 && liquidationAt < 0) {
      // 历史数据（实线）
      const historyData = seriesData.slice(0, userDataLen);
      // 预测数据（虚线）- 前面填充null以对齐x轴
      const forecastData = new Array(userDataLen - 1).fill(null);
      const lastHistoryValue = historyData[historyData.length - 1];
      forecastData.push(lastHistoryValue); // 连接点
      for (let j = 0; j < userForecastData.length; j++) {
        const value = isValueMode
          ? roundTo(amount * lev * userForecastData[j] / 100, 0)
          : roundTo((userForecastData[j] - 100) * lev, 1);
        forecastData.push(value);
      }

      // 历史线条（实线）
      series.push({
        name: r.label,
        type: 'line',
        data: historyData,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 4, type: 'solid', color: color },
        itemStyle: { color: color },
        emphasis: { focus: 'series', lineStyle: { width: 6 } },
        z: 10,
        endLabel: { show: true, formatter: r.label, color: color, fontSize: 11, offset: [10, 0] },
      });

      // 预测线条（虚线）
      series.push({
        name: '预测走势',
        type: 'line',
        data: forecastData,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 3, type: 'dashed', color: color, opacity: 0.7 },
        itemStyle: { color: color },
        z: 9,
        silent: true,
      });
    } else {
      // 其他基金或没有预测的基金：使用单一系列
      series.push({
        name: r.label,
        type: 'line',
        data: seriesData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: isUser ? 4 : isBenchmark ? 1.5 : 2,
          type: 'solid',
          color: color,
          opacity: isBenchmark ? 0.5 : 1
        },
        itemStyle: { color: color },
        emphasis: {
          focus: 'series',
          lineStyle: { width: isUser ? 6 : 3 }
        },
        z: isUser ? 10 : 1,
        endLabel: isUser ? { show: true, formatter: r.label, color: color, fontSize: 11, offset: [10, 0] } : undefined,
        // 爆仓标记
        ...(liquidationAt >= 0 ? {
          markPoint: {
            data: [{ name: '💥', coord: [liquidationAt, isValueMode ? 0 : -100], symbol: 'pin', symbolSize: 35, itemStyle: { color: '#ff5252' }, label: { show: true, formatter: '💥爆仓', fontSize: 14, color: '#ff5252', fontWeight: 'bold', offset: [0, -15] } }],
            animation: false,
          },
        } : {}),
      });
    }
  });

  const yAxisName = isValueMode ? '总价值（元）' : '收益率（%）';

  // 计算Y轴范围
  let yMin = Infinity, yMax = -Infinity;
  series.forEach(s => {
    if (s.data) {
      s.data.forEach(v => {
        if (v !== null && !isNaN(v)) {
          yMin = Math.min(yMin, v);
          yMax = Math.max(yMax, v);
        }
      });
    }
  });

  // 添加一些边距
  const yRange = yMax - yMin;
  yMin = yMin - yRange * 0.1;
  yMax = yMax + yRange * 0.1;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17,24,39,0.95)',
      borderColor: 'rgba(79,195,247,0.3)',
      textStyle: { color: '#e5e7eb', fontSize: 12 },
      formatter: function (params) {
        // 过滤掉预测系列和null值
        const validParams = params.filter(p => p.value !== null && p.value !== undefined && !p.seriesName.includes('预测'));
        if (validParams.length === 0) return '';

        const date = params[0].axisValue.replace('🔮', '预测 ');
        let html = '<div style="font-weight:bold;margin-bottom:4px;">' + date + '</div>';

        // 按收益率排序
        const sorted = [...validParams].sort((a, b) => (b.value || 0) - (a.value || 0));

        for (const p of sorted) {
          const isUser = results.find(r => r.label === p.seriesName && r.isUser);
          const prefix = isUser ? '⭐ ' : '';
          const val = isValueMode ? '¥' + Number(p.value).toLocaleString() : (p.value >= 0 ? '+' : '') + p.value.toFixed(1) + '%';
          html += '<div style="display:flex;align-items:center;gap:6px;' + (isUser ? 'font-weight:bold;' : '') + '">' +
            '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + p.color + ';"></span>' +
            prefix + p.seriesName + ': ' + val + '</div>';
        }
        return html;
      },
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#9ca3af', fontSize: 10 },
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      // 只显示非预测系列
      data: results.map(r => r.label)
    },
    grid: { left: '12%', right: '8%', top: '10%', bottom: '15%' },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLine: { lineStyle: { color: '#2d3d54' } },
      axisTick: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 9, rotate: 30 },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: { color: '#9ca3af', fontSize: 12 },
      axisLine: { show: true, lineStyle: { color: '#2d3d54' } },
      axisTick: { show: true, lineStyle: { color: '#2d3d54' } },
      axisLabel: {
        color: '#6b7280',
        fontSize: 10,
        formatter: isValueMode
          ? (v) => (v >= 10000 ? (v / 10000).toFixed(1) + '万' : v.toLocaleString())
          : (v) => v.toFixed(0) + '%'
      },
      splitLine: { lineStyle: { color: 'rgba(45,61,84,0.3)' } },
      min: Math.floor(yMin),
      max: Math.ceil(yMax),
    },
    series,
  };

  returnChart.setOption(option, true);

  const forecastSection = document.getElementById('forecast-section');
  if (forecastSection) forecastSection.classList.toggle('hidden', userForecastData.length === 0);

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