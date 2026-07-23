(function () {
  'use strict';

  // ===== CSS 变量读取 =====
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();

  // ===== 数学常量 =====
  var PI = Math.PI;
  var LN10 = Math.LN10;

  // ===== 格式化数字 =====
  function fmt(v, d) {
    if (d === undefined) d = 2;
    if (Math.abs(v) < 1e-10) v = 0;
    var r = parseFloat(v.toFixed(d));
    return r.toString();
  }
  function fmtFrac(v) {
    // 尝试显示为常见分数
    if (Math.abs(v - Math.round(v)) < 0.001) return Math.round(v).toString();
    var denominators = [2, 3, 4, 5, 6, 8, 10];
    for (var i = 0; i < denominators.length; i++) {
      var den = denominators[i];
      var num = v * den;
      if (Math.abs(num - Math.round(num)) < 0.01) {
        var n = Math.round(num);
        var g = gcd(Math.abs(n), den);
        return (n / g) + '/' + (den / g);
      }
    }
    return fmt(v, 2);
  }
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

  // ===== 函数定义 =====
  // 每种函数包含: id, name, params(参数定义), expr(表达式生成), sample(采样), props(性质计算)
  var FUNCTIONS = {
    linear: {
      name: '一次函数',
      params: [
        { key: 'k', label: 'k', default: 1, min: -5, max: 5, step: 0.1 },
        { key: 'b', label: 'b', default: 0, min: -10, max: 10, step: 0.5 }
      ],
      xRange: [-10, 10],
      expr: function (p) {
        var s = 'y = ';
        if (p.k === 1) s += 'x';
        else if (p.k === -1) s += '-x';
        else s += fmt(p.k, 2) + 'x';
        if (p.b > 0) s += ' + ' + fmt(p.b, 2);
        else if (p.b < 0) s += ' − ' + fmt(Math.abs(p.b), 2);
        return s;
      },
      sample: function (p, x) { return p.k * x + p.b; },
      props: function (p) {
        var props = [];
        props.push({ key: '定义域', val: 'R' });
        props.push({ key: '值域', val: 'R' });
        if (p.k > 0) props.push({ key: '单调性', val: '在 R 上单调递增' });
        else if (p.k < 0) props.push({ key: '单调性', val: '在 R 上单调递减' });
        else props.push({ key: '单调性', val: '常函数,既不增也不减' });
        props.push({ key: '奇偶性', val: p.b === 0 ? '奇函数(关于原点对称)' : '非奇非偶' });
        if (p.k !== 0) props.push({ key: '零点', val: 'x = ' + fmt(-p.b / p.k, 2) });
        props.push({ key: 'y 截距', val: fmt(p.b, 2) });
        props.push({ key: '倾斜角', val: p.k >= 0 ? fmt(Math.atan(p.k) * 180 / PI, 1) + '°' : fmt(180 + Math.atan(p.k) * 180 / PI, 1) + '°' });
        return props;
      }
    },

    quadratic: {
      name: '二次函数',
      params: [
        { key: 'a', label: 'a', default: 1, min: -5, max: 5, step: 0.1 },
        { key: 'b', label: 'b', default: -5, min: -10, max: 10, step: 0.5 },
        { key: 'c', label: 'c', default: 6, min: -10, max: 10, step: 0.5 }
      ],
      xRange: [-8, 8],
      expr: function (p) {
        var s = 'y = ';
        if (p.a === 1) s += 'x²';
        else if (p.a === -1) s += '-x²';
        else s += fmt(p.a, 2) + 'x²';
        if (p.b > 0) s += ' + ' + fmt(p.b, 2) + 'x';
        else if (p.b < 0) s += ' − ' + fmt(Math.abs(p.b), 2) + 'x';
        if (p.c > 0) s += ' + ' + fmt(p.c, 2);
        else if (p.c < 0) s += ' − ' + fmt(Math.abs(p.c), 2);
        return s;
      },
      sample: function (p, x) { return p.a * x * x + p.b * x + p.c; },
      props: function (p) {
        var props = [];
        props.push({ key: '定义域', val: 'R' });
        var vx = -p.b / (2 * p.a);
        var vy = p.c - p.b * p.b / (4 * p.a);
        if (p.a !== 0) {
          if (p.a > 0) {
            props.push({ key: '值域', val: '[' + fmt(vy, 2) + ', +∞)' });
            props.push({ key: '开口方向', val: '向上' });
            props.push({ key: '单调性', val: '(-∞, ' + fmt(vx, 2) + '] 递减, [' + fmt(vx, 2) + ', +∞) 递增' });
          } else {
            props.push({ key: '值域', val: '(-∞, ' + fmt(vy, 2) + ']' });
            props.push({ key: '开口方向', val: '向下' });
            props.push({ key: '单调性', val: '(-∞, ' + fmt(vx, 2) + '] 递增, [' + fmt(vx, 2) + ', +∞) 递减' });
          }
          props.push({ key: '对称轴', val: 'x = ' + fmt(vx, 2) });
          props.push({ key: '顶点', val: '(' + fmt(vx, 2) + ', ' + fmt(vy, 2) + ')' });
          var delta = p.b * p.b - 4 * p.a * p.c;
          if (delta > 0.001) {
            var x1 = (-p.b - Math.sqrt(delta)) / (2 * p.a);
            var x2 = (-p.b + Math.sqrt(delta)) / (2 * p.a);
            props.push({ key: '零点', val: 'x₁ = ' + fmt(x1, 2) + ', x₂ = ' + fmt(x2, 2) });
          } else if (Math.abs(delta) <= 0.001) {
            props.push({ key: '零点', val: 'x = ' + fmt(vx, 2) + '(重根)' });
          } else {
            props.push({ key: '零点', val: '无实数零点' });
          }
        }
        props.push({ key: 'y 截距', val: fmt(p.c, 2) });
        props.push({ key: '奇偶性', val: p.b === 0 ? '偶函数(关于 y 轴对称)' : '非奇非偶' });
        return props;
      }
    },

    power: {
      name: '幂函数',
      params: [
        { key: 'a', label: 'a', default: 2, min: -5, max: 5, step: 0.1 }
      ],
      xRange: [-5, 5],
      expr: function (p) {
        return 'y = x' + supScript(fmtFrac(p.a));
      },
      sample: function (p, x) {
        // 处理负数底数的分数幂
        if (x < 0) {
          // 如果指数是整数或分母为奇数的分数,可以计算
          if (Math.abs(p.a - Math.round(p.a)) < 0.001) {
            return Math.pow(x, Math.round(p.a));
          }
          return NaN; // 其他情况在实数范围内无定义
        }
        if (x === 0 && p.a < 0) return NaN;
        return Math.pow(x, p.a);
      },
      props: function (p) {
        var props = [];
        var isInt = Math.abs(p.a - Math.round(p.a)) < 0.001;
        var a = isInt ? Math.round(p.a) : p.a;

        if (isInt && a > 0) {
          props.push({ key: '定义域', val: 'R' });
        } else if (isInt && a < 0) {
          props.push({ key: '定义域', val: '(-∞, 0) ∪ (0, +∞)' });
        } else {
          props.push({ key: '定义域', val: '[0, +∞)' + (a < 0 ? ' (x≠0)' : '') });
        }

        if (isInt && a > 0) {
          if (a % 2 === 0) {
            props.push({ key: '值域', val: '[0, +∞)' });
            props.push({ key: '奇偶性', val: '偶函数' });
            props.push({ key: '单调性', val: '在 [0, +∞) 递增,在 (-∞, 0] 递减' });
          } else {
            props.push({ key: '值域', val: 'R' });
            props.push({ key: '奇偶性', val: '奇函数' });
            props.push({ key: '单调性', val: '在 R 上单调递增' });
          }
        } else if (isInt && a < 0) {
          if (a % 2 === 0) {
            props.push({ key: '值域', val: '(0, +∞)' });
            props.push({ key: '奇偶性', val: '偶函数' });
            props.push({ key: '单调性', val: '在 (0, +∞) 和 (-∞, 0) 均递减' });
          } else {
            props.push({ key: '值域', val: '(-∞, 0) ∪ (0, +∞)' });
            props.push({ key: '奇偶性', val: '奇函数' });
            props.push({ key: '单调性', val: '在 (0, +∞) 和 (-∞, 0) 均递减' });
          }
        } else {
          props.push({ key: '值域', val: a > 0 ? '[0, +∞)' : '(0, +∞)' });
          props.push({ key: '奇偶性', val: '非奇非偶(定义域不对称)' });
          props.push({ key: '单调性', val: a > 0 ? '在 (0, +∞) 递增' : '在 (0, +∞) 递减' });
        }

        props.push({ key: '定点', val: '恒过 (1, 1)' });
        return props;
      }
    },

    exponential: {
      name: '指数函数',
      params: [
        { key: 'a', label: 'a (底数)', default: 2, min: 0.1, max: 5, step: 0.1 }
      ],
      xRange: [-5, 5],
      expr: function (p) {
        return 'y = ' + fmt(p.a, 2) + 'ˣ';
      },
      sample: function (p, x) { return Math.pow(p.a, x); },
      props: function (p) {
        var props = [];
        props.push({ key: '定义域', val: 'R' });
        props.push({ key: '值域', val: '(0, +∞)' });
        props.push({ key: '定点', val: '恒过 (0, 1)' });
        props.push({ key: 'y 截距', val: '1' });
        if (p.a > 1) {
          props.push({ key: '单调性', val: '在 R 上单调递增' });
          props.push({ key: '增长', val: 'a > 1,随 x 增大快速增长' });
        } else if (p.a < 1 && p.a > 0) {
          props.push({ key: '单调性', val: '在 R 上单调递减' });
          props.push({ key: '增长', val: '0 < a < 1,随 x 增大趋近 0' });
        } else {
          props.push({ key: '单调性', val: 'a = 1,常函数 y = 1' });
        }
        props.push({ key: '渐近线', val: 'y = 0 (x 轴)' });
        props.push({ key: '奇偶性', val: '非奇非偶' });
        return props;
      }
    },

    logarithmic: {
      name: '对数函数',
      params: [
        { key: 'a', label: 'a (底数)', default: 2, min: 0.1, max: 5, step: 0.1 }
      ],
      xRange: [-1, 10],
      expr: function (p) {
        return 'y = log' + subScript(fmt(p.a, 2)) + '(x)';
      },
      sample: function (p, x) {
        if (x <= 0) return NaN;
        return Math.log(x) / Math.log(p.a);
      },
      props: function (p) {
        var props = [];
        props.push({ key: '定义域', val: '(0, +∞)' });
        props.push({ key: '值域', val: 'R' });
        props.push({ key: '定点', val: '恒过 (1, 0)' });
        props.push({ key: 'x 截距', val: 'x = 1' });
        if (p.a > 1) {
          props.push({ key: '单调性', val: '在 (0, +∞) 单调递增' });
        } else if (p.a < 1 && p.a > 0) {
          props.push({ key: '单调性', val: '在 (0, +∞) 单调递减' });
        } else {
          props.push({ key: '单调性', val: 'a = 1 无意义' });
        }
        props.push({ key: '渐近线', val: 'x = 0 (y 轴)' });
        props.push({ key: '奇偶性', val: '非奇非偶' });
        props.push({ key: '反函数', val: 'y = ' + fmt(p.a, 2) + 'ˣ (指数函数)' });
        return props;
      }
    },

    sine: {
      name: '正弦函数',
      params: [
        { key: 'A', label: 'A (振幅)', default: 1, min: -3, max: 3, step: 0.1 },
        { key: 'w', label: 'ω (角频率)', default: 1, min: 0.1, max: 5, step: 0.1 },
        { key: 'phi', label: 'φ (初相)', default: 0, min: -PI, max: PI, step: 0.1 }
      ],
      xRange: [-2 * PI, 2 * PI],
      expr: function (p) {
        var s = 'y = ';
        if (p.A === 1) s += '';
        else if (p.A === -1) s += '-';
        else s += fmt(p.A, 2) + '·';
        s += 'sin(';
        if (p.w === 1) s += '';
        else s += fmt(p.w, 2);
        s += 'x';
        if (p.phi > 0) s += ' + ' + fmt(p.phi, 2);
        else if (p.phi < 0) s += ' − ' + fmt(Math.abs(p.phi), 2);
        s += ')';
        return s;
      },
      sample: function (p, x) { return p.A * Math.sin(p.w * x + p.phi); },
      props: function (p) {
        var props = [];
        props.push({ key: '定义域', val: 'R' });
        props.push({ key: '值域', val: '[' + fmt(-Math.abs(p.A), 2) + ', ' + fmt(Math.abs(p.A), 2) + ']' });
        var T = 2 * PI / Math.abs(p.w);
        props.push({ key: '周期', val: 'T = 2π/' + fmt(Math.abs(p.w), 2) + ' ≈ ' + fmt(T, 2) });
        props.push({ key: '频率', val: 'f = ' + fmt(1 / T, 4) });
        props.push({ key: '振幅', val: fmt(Math.abs(p.A), 2) });
        props.push({ key: '初相', val: fmt(p.phi, 2) + ' rad' });
        props.push({ key: '奇偶性', val: (p.phi === 0) ? (p.A > 0 ? '奇函数' : '奇函数') : '非奇非偶' });
        props.push({ key: '有界性', val: '有界函数' });
        return props;
      }
    },

    cosine: {
      name: '余弦函数',
      params: [
        { key: 'A', label: 'A (振幅)', default: 1, min: -3, max: 3, step: 0.1 },
        { key: 'w', label: 'ω (角频率)', default: 1, min: 0.1, max: 5, step: 0.1 },
        { key: 'phi', label: 'φ (初相)', default: 0, min: -PI, max: PI, step: 0.1 }
      ],
      xRange: [-2 * PI, 2 * PI],
      expr: function (p) {
        var s = 'y = ';
        if (p.A === 1) s += '';
        else if (p.A === -1) s += '-';
        else s += fmt(p.A, 2) + '·';
        s += 'cos(';
        if (p.w === 1) s += '';
        else s += fmt(p.w, 2);
        s += 'x';
        if (p.phi > 0) s += ' + ' + fmt(p.phi, 2);
        else if (p.phi < 0) s += ' − ' + fmt(Math.abs(p.phi), 2);
        s += ')';
        return s;
      },
      sample: function (p, x) { return p.A * Math.cos(p.w * x + p.phi); },
      props: function (p) {
        var props = [];
        props.push({ key: '定义域', val: 'R' });
        props.push({ key: '值域', val: '[' + fmt(-Math.abs(p.A), 2) + ', ' + fmt(Math.abs(p.A), 2) + ']' });
        var T = 2 * PI / Math.abs(p.w);
        props.push({ key: '周期', val: 'T = 2π/' + fmt(Math.abs(p.w), 2) + ' ≈ ' + fmt(T, 2) });
        props.push({ key: '频率', val: 'f = ' + fmt(1 / T, 4) });
        props.push({ key: '振幅', val: fmt(Math.abs(p.A), 2) });
        props.push({ key: '初相', val: fmt(p.phi, 2) + ' rad' });
        props.push({ key: '奇偶性', val: (p.phi === 0) ? '偶函数' : '非奇非偶' });
        props.push({ key: '有界性', val: '有界函数' });
        return props;
      }
    },

    tangent: {
      name: '正切函数',
      params: [
        { key: 'A', label: 'A (系数)', default: 1, min: -3, max: 3, step: 0.1 },
        { key: 'w', label: 'ω (角频率)', default: 1, min: 0.1, max: 5, step: 0.1 },
        { key: 'phi', label: 'φ (初相)', default: 0, min: -PI, max: PI, step: 0.1 }
      ],
      xRange: [-2 * PI, 2 * PI],
      expr: function (p) {
        var s = 'y = ';
        if (p.A === 1) s += '';
        else if (p.A === -1) s += '-';
        else s += fmt(p.A, 2) + '·';
        s += 'tan(';
        if (p.w === 1) s += '';
        else s += fmt(p.w, 2);
        s += 'x';
        if (p.phi > 0) s += ' + ' + fmt(p.phi, 2);
        else if (p.phi < 0) s += ' − ' + fmt(Math.abs(p.phi), 2);
        s += ')';
        return s;
      },
      sample: function (p, x) {
        var v = p.A * Math.tan(p.w * x + p.phi);
        if (Math.abs(v) > 100) return NaN; // 截断渐近线附近的大值
        return v;
      },
      props: function (p) {
        var props = [];
        props.push({ key: '定义域', val: '{x | x ≠ π/' + fmt(2 * Math.abs(p.w), 2) + ' + kπ/' + fmt(Math.abs(p.w), 2) + ', k∈Z}' });
        props.push({ key: '值域', val: 'R' });
        var T = PI / Math.abs(p.w);
        props.push({ key: '周期', val: 'T = π/' + fmt(Math.abs(p.w), 2) + ' ≈ ' + fmt(T, 2) });
        props.push({ key: '频率', val: 'f = ' + fmt(1 / T, 4) });
        props.push({ key: '奇偶性', val: (p.phi === 0) ? '奇函数' : '非奇非偶' });
        props.push({ key: '有界性', val: '无界函数' });
        props.push({ key: '渐近线', val: 'x = π/' + fmt(2 * Math.abs(p.w), 2) + ' + kπ/' + fmt(Math.abs(p.w), 2) });
        return props;
      }
    }
  };

  // ===== 上标/下标字符转换 =====
  var supMap = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '/': '⁄' };
  var subMap = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '.': '.' };
  function supScript(str) {
    var r = '';
    for (var i = 0; i < str.length; i++) r += supMap[str[i]] || str[i];
    return r;
  }
  function subScript(str) {
    var r = '';
    for (var i = 0; i < str.length; i++) r += subMap[str[i]] || str[i];
    return r;
  }

  // ===== 状态管理 =====
  var currentFuncId = 'quadratic';
  var currentParams = {};
  var defaultParams = {};
  var compareMode = false;
  var compareData = null; // { funcId, params, seriesData }
  var chart = null;

  // ===== 生成采样数据 =====
  function generateData(funcDef, params) {
    var range = funcDef.xRange;
    var data = [];
    var step = (range[1] - range[0]) / 500;
    var prevY = null;

    for (var x = range[0]; x <= range[1]; x += step) {
      var y = funcDef.sample(params, x);
      if (isFinite(y) && !isNaN(y)) {
        // 正切函数:检测渐近线跳变,插入断点
        if (prevY !== null && Math.abs(y - prevY) > 50) {
          data.push([x, NaN]); // 断点
        }
        data.push([parseFloat(x.toFixed(4)), y]);
        prevY = y;
      } else {
        data.push([parseFloat(x.toFixed(4)), NaN]);
        prevY = null;
      }
    }
    return data;
  }

  // ===== 构建 ECharts 配置 =====
  function buildOption(funcDef, params) {
    var data = generateData(funcDef, params);
    var series = [
      {
        name: funcDef.name,
        type: 'line',
        data: data,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: accent, width: 2.5 },
        z: 3,
        connectNulls: false
      }
    ];

    // 叠加对比曲线
    if (compareMode && compareData) {
      var compareFuncDef = FUNCTIONS[compareData.funcId];
      series.push({
        name: compareFuncDef.name + '(对比)',
        type: 'line',
        data: compareData.seriesData,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: accent2, width: 2, type: 'dashed' },
        z: 2,
        connectNulls: false
      });
    }

    // 自适应 y 轴范围
    var yMin = Infinity, yMax = -Infinity;
    for (var i = 0; i < data.length; i++) {
      if (!isNaN(data[i][1]) && isFinite(data[i][1])) {
        if (data[i][1] < yMin) yMin = data[i][1];
        if (data[i][1] > yMax) yMax = data[i][1];
      }
    }
    if (yMin === Infinity) { yMin = -5; yMax = 5; }
    var yPad = (yMax - yMin) * 0.15;
    if (yPad < 1) yPad = 1;

    return {
      animation: false,
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        formatter: function (ps) {
          var s = '';
          for (var i = 0; i < ps.length; i++) {
            var p = ps[i];
            if (!isNaN(p.data[1])) {
              s += p.seriesName + ': (' + fmt(p.data[0], 2) + ', ' + fmt(p.data[1], 2) + ')';
              if (i < ps.length - 1) s += '<br/>';
            }
          }
          return s || '无定义';
        }
      },
      legend: compareMode ? {
        show: true,
        bottom: 5,
        textStyle: { color: muted, fontSize: 11 }
      } : { show: false },
      grid: {
        left: '10%',
        right: '5%',
        top: 20,
        bottom: compareMode ? 50 : 40
      },
      xAxis: {
        type: 'value',
        min: funcDef.xRange[0],
        max: funcDef.xRange[1],
        axisLine: { lineStyle: { color: ink, width: 1.5 } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 11 },
        splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.5 } }
      },
      yAxis: {
        type: 'value',
        min: Math.floor(yMin - yPad),
        max: Math.ceil(yMax + yPad),
        axisLine: { lineStyle: { color: ink, width: 1.5 } },
        axisTick: { show: false },
        axisLabel: { color: muted, fontSize: 11 },
        splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.5 } }
      },
      dataZoom: [
        { type: 'inside', xAxisIndex: 0, filterMode: 'none' },
        { type: 'inside', yAxisIndex: 0, filterMode: 'none' }
      ],
      series: series
    };
  }

  // ===== 更新表达式显示 =====
  function updateExpr() {
    var funcDef = FUNCTIONS[currentFuncId];
    document.getElementById('exprDisplay').textContent = funcDef.expr(currentParams);
  }

  // ===== 更新性质面板 =====
  function updateProps() {
    var funcDef = FUNCTIONS[currentFuncId];
    var props = funcDef.props(currentParams);
    var html = '';
    for (var i = 0; i < props.length; i++) {
      html += '<div class="prop-item"><span class="prop-key">' + props[i].key + ':</span><span class="prop-val">' + props[i].val + '</span></div>';
    }
    document.getElementById('propsList').innerHTML = html;
  }

  // ===== 更新图表 =====
  var rafId = null;
  function updateChart() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function () {
      var funcDef = FUNCTIONS[currentFuncId];
      var option = buildOption(funcDef, currentParams);
      chart.setOption(option, true);
      // 更新 caption
      document.getElementById('chartCaption').textContent = funcDef.name + ' · 拖动滑块调节参数,滚轮缩放,拖拽平移';
    });
  }

  // ===== 总更新 =====
  function updateAll() {
    updateExpr();
    updateProps();
    updateChart();
  }

  // ===== 渲染参数控制 =====
  function renderParams() {
    var funcDef = FUNCTIONS[currentFuncId];
    var html = '';
    for (var i = 0; i < funcDef.params.length; i++) {
      var p = funcDef.params[i];
      var val = currentParams[p.key];
      html += '<div class="param-row">';
      html += '<span class="param-name">' + p.label + '</span>';
      html += '<input type="range" class="param-slider" data-key="' + p.key + '" ';
      html += 'min="' + p.min + '" max="' + p.max + '" step="' + p.step + '" value="' + val + '">';
      html += '<input type="number" class="param-input" data-key="' + p.key + '" ';
      html += 'min="' + p.min + '" max="' + p.max + '" step="' + p.step + '" value="' + val + '">';
      html += '</div>';
    }
    var container = document.getElementById('paramControls');
    container.innerHTML = html;

    // 绑定事件
    var sliders = container.querySelectorAll('.param-slider');
    var inputs = container.querySelectorAll('.param-input');

    for (var s = 0; s < sliders.length; s++) {
      (function (slider, input) {
        var key = slider.getAttribute('data-key');
        slider.addEventListener('input', function () {
          var v = parseFloat(slider.value);
          currentParams[key] = v;
          input.value = v;
          updateAll();
        });
        input.addEventListener('input', function () {
          var v = parseFloat(input.value);
          if (isNaN(v)) return;
          // clamp
          var pDef = getParamDef(currentFuncId, key);
          if (pDef) {
            v = Math.max(pDef.min, Math.min(pDef.max, v));
          }
          currentParams[key] = v;
          slider.value = v;
          updateAll();
        });
        input.addEventListener('blur', function () {
          if (isNaN(parseFloat(input.value))) {
            input.value = currentParams[key];
          }
        });
      })(sliders[s], inputs[s]);
    }
  }

  function getParamDef(funcId, key) {
    var params = FUNCTIONS[funcId].params;
    for (var i = 0; i < params.length; i++) {
      if (params[i].key === key) return params[i];
    }
    return null;
  }

  // ===== 渲染 Tab 栏 =====
  function renderTabs() {
    var tabBar = document.getElementById('tabBar');
    var html = '';
    var keys = Object.keys(FUNCTIONS);
    for (var i = 0; i < keys.length; i++) {
      var id = keys[i];
      var funcDef = FUNCTIONS[id];
      html += '<button class="tab-btn' + (id === currentFuncId ? ' active' : '') + '" data-id="' + id + '">' + funcDef.name + '</button>';
    }
    tabBar.innerHTML = html;

    var btns = tabBar.querySelectorAll('.tab-btn');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', function () {
        switchFunc(this.getAttribute('data-id'));
      });
    }
  }

  // ===== 切换函数 =====
  function switchFunc(funcId) {
    currentFuncId = funcId;
    var funcDef = FUNCTIONS[funcId];
    // 重置参数为默认值
    currentParams = {};
    for (var i = 0; i < funcDef.params.length; i++) {
      var p = funcDef.params[i];
      currentParams[p.key] = p.default;
    }
    defaultParams = JSON.parse(JSON.stringify(currentParams));

    // 更新 tab 高亮
    var btns = document.querySelectorAll('.tab-btn');
    for (var j = 0; j < btns.length; j++) {
      btns[j].classList.toggle('active', btns[j].getAttribute('data-id') === funcId);
    }

    // 清除对比模式
    if (compareMode) {
      compareMode = false;
      compareData = null;
      document.getElementById('btnCompare').classList.remove('active');
      document.getElementById('btnCompare').textContent = '叠加对比';
    }

    renderParams();
    updateAll();
  }

  // ===== 重置参数 =====
  function resetParams() {
    currentParams = JSON.parse(JSON.stringify(defaultParams));
    renderParams();
    updateAll();
  }

  // ===== 叠加对比 =====
  function toggleCompare() {
    var btn = document.getElementById('btnCompare');
    if (!compareMode) {
      // 保存当前曲线
      var funcDef = FUNCTIONS[currentFuncId];
      compareData = {
        funcId: currentFuncId,
        params: JSON.parse(JSON.stringify(currentParams)),
        seriesData: generateData(funcDef, currentParams)
      };
      compareMode = true;
      btn.classList.add('active');
      btn.textContent = '取消对比';
    } else {
      compareMode = false;
      compareData = null;
      btn.classList.remove('active');
      btn.textContent = '叠加对比';
    }
    updateChart();
  }

  // ===== 初始化 =====
  function init() {
    // 初始化 ECharts
    chart = echarts.init(document.getElementById('chart'), null, { renderer: 'svg' });

    // 设置默认函数
    var funcDef = FUNCTIONS[currentFuncId];
    currentParams = {};
    for (var i = 0; i < funcDef.params.length; i++) {
      var p = funcDef.params[i];
      currentParams[p.key] = p.default;
    }
    defaultParams = JSON.parse(JSON.stringify(currentParams));

    // 渲染 UI
    renderTabs();
    renderParams();
    updateAll();

    // 绑定按钮
    document.getElementById('btnReset').addEventListener('click', resetParams);
    document.getElementById('btnCompare').addEventListener('click', toggleCompare);

    // resize
    window.addEventListener('resize', function () { chart.resize(); });
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
