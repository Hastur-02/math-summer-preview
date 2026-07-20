(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();

  // ===== 图 1: 基本不等式几何解释(半圆中半径 ≥ 半弦) =====
  var geoEl = document.getElementById('chart-geo');
  if (geoEl && window.echarts) {
    var geo = echarts.init(geoEl, null, { renderer: 'svg' });

    // 半圆:圆心(5,0),半径5,取上半圆。直径从(0,0)到(10,0)。
    // 分点取 a=2,b=8 处(即直径上距左端2的点),垂线高=√(2*8)=4,半径=5
    var R = 5, cx = 5, cy = 0;
    var a = 2, b = 8;
    var px = a; // 分点横坐标(从左端0量起a)
    var ph = Math.sqrt(a * b); // 垂线高=√(ab)

    // 生成半圆点
    var circle = [];
    for (var t = 0; t <= Math.PI; t += 0.02) {
      circle.push([cx + R * Math.cos(Math.PI - t), R * Math.sin(t)]);
    }
    // 分点垂线
    var perp = [[px, 0], [px, ph]];
    // 半径(圆心到分点垂线顶)
    var radiusLine = [[cx, cy], [px, ph]];

    geo.setOption({
      animation: false,
      tooltip: { show: false },
      grid: { left: '8%', right: '8%', top: 30, bottom: 40 },
      xAxis: {
        type: 'value', min: -1, max: 11, interval: 1,
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 10 },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value', min: -1, max: 6, interval: 1,
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 10 },
        splitLine: { show: false }
      },
      series: [
        {
          name: '半圆', type: 'line', data: circle, smooth: true,
          symbol: 'none',
          lineStyle: { color: accent, width: 2 },
          areaStyle: { color: 'rgba(44,95,124,0.06)' },
          z: 1
        },
        {
          name: '直径', type: 'line', data: [[0, 0], [10, 0]],
          symbol: 'none',
          lineStyle: { color: ink, width: 2 },
          markPoint: {
            symbol: 'circle', symbolSize: 6,
            data: [
              { coord: [0, 0], itemStyle: { color: ink }, label: { show: true, formatter: 'O', position: 'bottom', color: muted, fontSize: 10 } },
              { coord: [10, 0], itemStyle: { color: ink }, label: { show: true, formatter: '10', position: 'bottom', color: muted, fontSize: 10 } }
            ]
          },
          z: 2
        },
        {
          name: '垂线(半弦 √ab)', type: 'line', data: perp,
          symbol: 'none',
          lineStyle: { color: accent2, width: 2.5, type: 'dashed' },
          markPoint: {
            symbol: 'circle', symbolSize: 7,
            data: [{ coord: [px, ph], itemStyle: { color: accent2 } }]
          },
          markLine: {
            symbol: 'none',
            data: [{ yAxis: ph, lineStyle: { color: accent2, type: 'dotted', opacity: 0.4 }, label: { show: true, formatter: '√ab', color: accent2, fontSize: 11, position: 'start' } }]
          },
          z: 3
        },
        {
          name: '半径 (a+b)/2', type: 'line', data: radiusLine,
          symbol: 'none',
          lineStyle: { color: accent, width: 2.5 },
          markPoint: {
            symbol: 'circle', symbolSize: 7,
            data: [{ coord: [cx, cy], itemStyle: { color: accent } }]
          },
          z: 3
        }
      ],
      graphic: [
        { type: 'text', left: 'center', top: 4, style: { text: '半径 (a+b)/2 = 5  ≥  半弦 √(ab) = 4', fill: ink, font: '12px sans-serif' } },
        { type: 'text', left: '72%', top: '52%', style: { text: 'a=2', fill: muted, font: '11px sans-serif' } },
        { type: 'text', left: '82%', top: '52%', style: { text: 'b=8', fill: muted, font: '11px sans-serif' } }
      ]
    });
    window.addEventListener('resize', function () { geo.resize(); });
  }

  // ===== 图 2: 二次函数 y=x²-5x+6 图象与三个二次关系 =====
  var quadEl = document.getElementById('chart-quad');
  if (quadEl && window.echarts) {
    var quad = echarts.init(quadEl, null, { renderer: 'svg' });

    // 生成 y=x²-5x+6 的数据
    var parabola = [];
    for (var x = -0.5; x <= 5.5; x += 0.05) {
      parabola.push([x, x * x - 5 * x + 6]);
    }

    quad.setOption({
      animation: false,
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        formatter: function (ps) {
          var p = ps[0];
          return 'x = ' + p.data[0].toFixed(2) + '<br/>y = ' + p.data[1].toFixed(2);
        }
      },
      grid: { left: '10%', right: '8%', top: 30, bottom: 44 },
      xAxis: {
        type: 'value', min: -0.5, max: 5.5, interval: 1,
        name: 'x', nameLocation: 'middle', nameGap: 28,
        nameTextStyle: { color: muted, fontSize: 12 },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 10 },
        splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.4 } }
      },
      yAxis: {
        type: 'value', min: -1.5, max: 8, interval: 1,
        name: 'y', nameTextStyle: { color: muted, fontSize: 12 },
        axisLine: { lineStyle: { color: rule } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 10 },
        splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.4 } }
      },
      series: [
        {
          name: 'y=x²-5x+6', type: 'line', data: parabola, smooth: true,
          symbol: 'none',
          lineStyle: { color: accent, width: 2.5 },
          z: 2,
          markPoint: {
            symbol: 'circle', symbolSize: 9,
            data: [
              { coord: [2, 0], itemStyle: { color: accent2 }, label: { show: true, formatter: 'x=2(根)', position: 'top', color: accent2, fontSize: 11, distance: 8 } },
              { coord: [3, 0], itemStyle: { color: accent2 }, label: { show: true, formatter: 'x=3(根)', position: 'top', color: accent2, fontSize: 11, distance: 8 } },
              { coord: [2.5, -0.25], itemStyle: { color: accent }, label: { show: true, formatter: '顶点(2.5,-0.25)', position: 'bottom', color: accent, fontSize: 11, distance: 10 } }
            ]
          },
          markLine: {
            symbol: 'none',
            silent: true,
            data: [
              { yAxis: 0, lineStyle: { color: ink, width: 1.5 }, label: { show: false } }
            ]
          },
          markArea: {
            silent: true,
            itemStyle: { color: 'rgba(201,123,74,0.12)' },
            data: [
              [{ name: 'y<0 区间(2,3)', coord: [2, 0] }, { coord: [3, 8] }]
            ]
          }
        }
      ],
      graphic: [
        { type: 'text', left: 'center', top: 6, style: { text: '抛物线开口向上:两根 x=2,x=3;y>0 取两边(x<2 或 x>3),y<0 取中间(2<x<3)', fill: ink, font: '11.5px sans-serif' } }
      ]
    });
    window.addEventListener('resize', function () { quad.resize(); });
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
