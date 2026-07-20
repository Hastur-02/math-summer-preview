(function () {
  // ===== Mermaid 初始化(第一天报告仅使用 Mermaid,无 ECharts) =====
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: '"PingFang SC", "Hiragino Sans GB", sans-serif'
    });
  }
})();
