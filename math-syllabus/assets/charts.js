(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();

  // ===== 图 1: 20 天课时分配甘特图 =====
  var ganttEl = document.getElementById('chart-gantt');
  if (ganttEl && window.echarts) {
    var chart = echarts.init(ganttEl, null, { renderer: 'svg' });

    // 从下往上显示(提纲挈领在最上方),故 data 顺序为 第五章→提纲挈领
    var labels = ['提纲挈领', '第一章 集合', '第二章 一元二次', '第三章 函数', '第四章 指对数', '第五章 三角'];
    var offsets = [0, 1, 4, 7, 11, 15];
    var durations = [1, 3, 3, 4, 4, 5];
    var dayStart = [1, 2, 5, 8, 12, 16];
    var barColors = [muted, accent, accent2, accent, accent2, accent];

    chart.setOption({
      animation: false,
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        formatter: function (p) {
          if (p.seriesIndex === 0) return '';
          var idx = p.dataIndex;
          return '<b>' + labels[idx] + '</b><br/>Day ' + dayStart[idx] + ' – Day ' + (dayStart[idx] + durations[idx] - 1) + ' · ' + durations[idx] + ' 天';
        }
      },
      legend: { show: false },
      grid: { left: '26%', right: '8%', top: 24, bottom: 48 },
      xAxis: {
        type: 'value',
        max: 20,
        min: 0,
        interval: 1,
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: {
          color: muted,
          fontSize: 11,
          formatter: function (v) { return v === 0 ? '' : 'D' + v; }
        },
        splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.6 } },
        name: '天数进度',
        nameLocation: 'middle',
        nameGap: 28,
        nameTextStyle: { color: muted, fontSize: 12 }
      },
      yAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: ink, fontSize: 12 }
      },
      series: [
        {
          name: 'offset',
          type: 'bar',
          stack: 'gantt',
          data: offsets,
          itemStyle: { color: 'transparent' },
          barWidth: 24,
          silent: true,
          z: 1
        },
        {
          name: 'duration',
          type: 'bar',
          stack: 'gantt',
          data: durations.map(function (d, i) {
            return { value: d, itemStyle: { color: barColors[i], borderRadius: 4 } };
          }),
          barWidth: 24,
          label: {
            show: true,
            position: 'inside',
            formatter: function (p) { return p.value + '天'; },
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: 600
          },
          z: 2
        }
      ]
    });

    window.addEventListener('resize', function () { chart.resize(); });
  }

  // ===== Mermaid 初始化 =====
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: '"PingFang SC", "Hiragino Sans GB", sans-serif'
    });
  }
})();
