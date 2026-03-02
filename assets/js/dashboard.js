// dashboard.js — Brian's Portfolio Dashboard
(function () {
  'use strict';

  /* ================================================================
     PORTFOLIO DATA
  ================================================================ */
  var HOLDINGS = [
    { ticker: 'CDNS',  name: 'Cadence Design Systems', shares: 46,  bucket: 'growth',  fallback: 280.00 },
    { ticker: 'CRWV',  name: 'CrowdStrike / CRWV',     shares: 33,  bucket: 'growth',  fallback: 18.00 },
    { ticker: 'GLD',   name: 'SPDR Gold Trust',         shares: 16,  bucket: 'metals',  fallback: 265.00 },
    { ticker: 'HIVE',  name: 'HIVE Digital Tech',       shares: 187, bucket: 'crypto',  fallback: 3.50 },
    { ticker: 'NVDA',  name: 'NVIDIA',                  shares: 40,  bucket: 'growth',  fallback: 130.00 },
    { ticker: 'PLTR',  name: 'Palantir Technologies',   shares: 41,  bucket: 'growth',  fallback: 95.00 },
    { ticker: 'RCAT',  name: 'Red Cat Holdings',        shares: 86,  bucket: 'growth',  fallback: 8.00 },
    { ticker: 'RKLB',  name: 'Rocket Lab USA',          shares: 95,  bucket: 'growth',  fallback: 25.00 },
    { ticker: 'SLV',   name: 'iShares Silver Trust',    shares: 21,  bucket: 'metals',  fallback: 30.00 },
    { ticker: 'SNOW',  name: 'Snowflake',               shares: 79,  bucket: 'growth',  fallback: 170.00 }
  ];

  var BUCKET_META = {
    growth: { label: 'U.S. Growth / Tech',  color: '#60a5fa', tagClass: 'tag-growth' },
    metals: { label: 'Precious Metals',      color: '#f5c842', tagClass: 'tag-metals' },
    crypto: { label: 'Crypto-Linked Equity', color: '#a78bfa', tagClass: 'tag-crypto' }
  };

  var BUCKET_TARGETS = {
    growth: { min: 25, max: 35, dalioTarget: '~30%' },
    metals: { min: 10, max: 20, dalioTarget: '~15%' },
    bonds:  { min: 40, max: 60, dalioTarget: '~55%' },
    crypto: { min: 0,  max: 5,  dalioTarget: '~0%' }
  };

  var SCENARIOS = [
    {
      icon: '📈',
      title: 'Rising Growth, Falling Inflation',
      grade: 'strong',
      gradeLabel: 'Strong',
      body: '<strong>This is the environment the portfolio is optimized for.</strong> High-multiple tech and speculative growth (NVDA, SNOW, PLTR, CDNS, RKLB, RCAT) thrive when growth is strong and rates stay favorable. Gold and silver may underperform here but do not harm.'
    },
    {
      icon: '🔥',
      title: 'Rising Growth, Rising Inflation',
      grade: 'moderate',
      gradeLabel: 'Moderate',
      body: 'Gold and silver (GLD, SLV) help here but represent a <strong>small slice</strong> of the overall risk budget. Tech names can still do well if nominal growth is strong, but margin compression is a risk. Missing: <strong>broad commodities, energy, resource equities</strong>.'
    },
    {
      icon: '📉',
      title: 'Falling Growth, Falling Inflation',
      grade: 'weak',
      gradeLabel: 'Weak',
      body: '<strong>No Treasuries or high-quality bonds</strong> to rally when growth slows and markets de-risk. Speculative tech and crypto-sensitive names can be hit hard when liquidity dries up. This is the biggest gap in the portfolio.'
    },
    {
      icon: '⚠️',
      title: 'Falling Growth, Rising Inflation (Stagflation)',
      grade: 'weak',
      gradeLabel: 'Weak',
      body: 'The worst scenario for this portfolio. Real earnings get squeezed, multiples compress, and speculative names can lose 50%+. Gold/silver help but are <strong>not enough</strong>. Missing: broad commodities, real assets, international diversification.'
    }
  ];

  var RATIONALE_ITEMS = [
    {
      tag: 'CONC',
      tagBg: 'rgba(248,113,113,0.12)',
      tagColor: '#f87171',
      title: 'Concentration Risk',
      meta: 'High',
      metaColor: '#f87171',
      content: '<p>Almost all risk is in equities — and very growthy ones at that. The metals allocation is relatively small and concentrated in just gold/silver ETFs. There is <strong>no fixed income ballast, no inflation-linked bonds, no broad commodities</strong>.</p><p>From a Dalio perspective, <strong>risk is concentrated in one theme (U.S. growth/innovation)</strong>. The portfolio is not built from multiple, uncorrelated building blocks designed to survive a range of macro outcomes.</p>'
    },
    {
      tag: 'GEO',
      tagBg: 'rgba(251,146,60,0.12)',
      tagColor: '#fb923c',
      title: 'Geographic Diversification',
      meta: 'Weak',
      metaColor: '#fb923c',
      content: '<p>The portfolio is <strong>primarily U.S.-centric</strong> tech and growth. There is very little systematic exposure to non-U.S. equity markets or currencies.</p><p>Dalio emphasizes the importance of geographic diversification across the big cycle, noting that different countries are at different phases of their long-term debt, currency, and political cycles.</p>'
    },
    {
      tag: 'BOND',
      tagBg: 'rgba(96,165,250,0.12)',
      tagColor: '#60a5fa',
      title: 'Missing Bond Allocation',
      meta: 'Critical Gap',
      metaColor: '#f87171',
      content: '<p>Dalio\'s All-Weather concepts lean heavily on bonds to offset equity risk in slow-growth or deflationary environments. The commonly cited approximation allocates <strong>~55% to bonds</strong>.</p><p>Brian\'s portfolio has <strong>zero bond exposure</strong>. This means there are no assets that typically rally when growth slows and risk assets sell off — no ballast to smooth the ride during recessions.</p>'
    },
    {
      tag: 'ILLUSION',
      tagBg: 'rgba(167,139,250,0.12)',
      tagColor: '#a78bfa',
      title: 'Illusion of Wealth',
      meta: 'Late-Cycle Risk',
      metaColor: '#a78bfa',
      content: '<p>Dalio warns that during the upwave of the cycle, financial assets can soar because of falling rates, expanding multiples, and abundant liquidity. This creates an <strong>"illusion of wealth"</strong> that later vanishes when the cycle turns.</p><p>Positions like NVDA, SNOW, PLTR, and other speculative names have benefitted from strong AI narratives, supportive liquidity, and investor willingness to pay very high multiples. Because there is no large counter-balancing sleeve of bonds or diversified real assets, <strong>Brian\'s real purchasing power is heavily tied to continued optimism about a narrow set of tech equities</strong>.</p>'
    },
    {
      tag: 'SPEC',
      tagBg: 'rgba(245,200,66,0.12)',
      tagColor: '#f5c842',
      title: 'Speculative Satellite Sizing',
      meta: 'Overweight',
      metaColor: '#fb923c',
      content: '<p>A Dalio-style approach would treat speculative and thematic plays as <strong>small satellites</strong>, not core building blocks. RCAT, RKLB, and HIVE are speculative names that carry outsized idiosyncratic risk.</p><p>The goal is not to eliminate conviction or high-growth upside, but to contain the damage if the speculative side of the market experiences a long winter and make sure no single story can derail long-term compounding.</p>'
    }
  ];

  var RECOMMENDATIONS = [
    {
      icon: '🏛️',
      title: 'Add High-Quality Bonds',
      body: 'Introduce U.S. Treasury funds (short, intermediate, and/or long duration) and high-quality aggregate bond ETFs. These provide assets that typically <strong>rally when growth slows and risk assets sell off</strong>.',
      examples: ['TLT', 'IEF', 'AGG', 'SGOV']
    },
    {
      icon: '🛢️',
      title: 'Broaden Inflation Hedges',
      body: 'Gold and silver are useful but Dalio emphasizes a <strong>diversified set of inflation hedges</strong>: broad commodities ETFs (energy, industrial metals, agriculture) and resource-oriented equities.',
      examples: ['BCI', 'DJP', 'GSG', 'XLE']
    },
    {
      icon: '🌍',
      title: 'Add Broad Equity Indices',
      body: 'Instead of relying on a handful of growth stocks, add <strong>broad U.S. market ETFs</strong> plus international developed and emerging market ETFs to reduce single-name and sector risk.',
      examples: ['VTI', 'VXUS', 'VTV', 'VWO']
    },
    {
      icon: '📏',
      title: 'Reduce Speculative Concentration',
      body: 'Shrink RCAT, RKLB, and HIVE to a <strong>modest percentage</strong> of total portfolio value. Keep core names (NVDA, CDNS) at reasonable risk weights rather than letting them dominate volatility.',
      examples: ['RCAT ~2%', 'RKLB ~5%', 'HIVE ~2%']
    },
    {
      icon: '🧭',
      title: 'Think in Scenarios',
      body: 'Dalio\'s key mindset shift: <strong>prepare for multiple plausible futures</strong> instead of betting on one. Stress-test the portfolio against recession, inflation, monetary reset, and continued boom scenarios.',
      examples: ['All 4 environments']
    },
    {
      icon: '⚖️',
      title: 'Balance Risk, Not Capital',
      body: 'Risk parity means allocating so each asset class contributes <strong>equal risk</strong>, not equal dollars. Bonds need more capital because they are less volatile. Equities need less because they are more volatile.',
      examples: ['~30% stocks', '~55% bonds', '~15% real assets']
    }
  ];

  var COMPARISON_ROWS = [
    { asset: 'U.S. Growth Equities',  current: 'Heavy (~85%)',        dalio: '~25-30%',     status: 'over' },
    { asset: 'Value / Broad Equities', current: 'None',               dalio: '~5-10%',      status: 'missing' },
    { asset: 'International Equities', current: 'None',               dalio: '~5-10%',      status: 'missing' },
    { asset: 'Long-Term Treasuries',   current: 'None',               dalio: '~40%',        status: 'missing' },
    { asset: 'Short-Term Treasuries',  current: 'None',               dalio: '~15%',        status: 'missing' },
    { asset: 'Gold',                   current: 'Small (~5-8%)',      dalio: '~7.5%',       status: 'close' },
    { asset: 'Silver',                 current: 'Small (~1-2%)',      dalio: 'Part of 15%', status: 'close' },
    { asset: 'Broad Commodities',      current: 'None',               dalio: '~7.5%',       status: 'missing' },
    { asset: 'Crypto-Linked',          current: 'Small (~2-3%)',      dalio: 'Not included', status: 'neutral' }
  ];

  var REFERENCES = [
    'Ray Dalio, "Principles for Dealing with the Changing World Order" (2021)',
    'Ray Dalio, "Investing in Light of the Big Cycle" — Chapter from Changing World Order',
    'Bridgewater Associates, "The All Weather Story" (2012)',
    'Ray Dalio, "How the Economic Machine Works" (2013)',
    'Bridgewater Associates, Risk Parity methodology papers'
  ];

  /* ================================================================
     PRICE FETCHING
  ================================================================ */
  var CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
  ];

  var CACHE_KEY = 'bd_portfolio_prices';
  var CACHE_MAX_AGE = 5 * 60 * 1000; // 5 minutes

  function getCachedPrices() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (Date.now() - data.ts > CACHE_MAX_AGE) return null;
      return data.prices;
    } catch (e) { return null; }
  }

  function setCachedPrices(prices) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), prices: prices }));
    } catch (e) { /* ignore */ }
  }

  async function fetchPrices() {
    var tickers = HOLDINGS.map(function (h) { return h.ticker; });
    var symbols = tickers.join(',');

    for (var i = 0; i < CORS_PROXIES.length; i++) {
      try {
        var url = CORS_PROXIES[i] + encodeURIComponent(
          'https://query1.finance.yahoo.com/v7/finance/quote?symbols=' + symbols +
          '&fields=regularMarketPrice,regularMarketChangePercent'
        );
        var resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!resp.ok) continue;
        var json = await resp.json();
        var quotes = json.quoteResponse && json.quoteResponse.result;
        if (!quotes || quotes.length === 0) continue;

        var prices = {};
        quotes.forEach(function (q) {
          prices[q.symbol] = {
            price: q.regularMarketPrice,
            changePct: q.regularMarketChangePercent
          };
        });
        setCachedPrices(prices);
        return prices;
      } catch (e) { /* try next proxy */ }
    }

    // Fallback: try individual tickers
    var prices = {};
    for (var t = 0; t < tickers.length; t++) {
      for (var p = 0; p < CORS_PROXIES.length; p++) {
        try {
          var singleUrl = CORS_PROXIES[p] + encodeURIComponent(
            'https://query1.finance.yahoo.com/v7/finance/quote?symbols=' + tickers[t] +
            '&fields=regularMarketPrice,regularMarketChangePercent'
          );
          var sResp = await fetch(singleUrl, { signal: AbortSignal.timeout(6000) });
          if (!sResp.ok) continue;
          var sJson = await sResp.json();
          var sQuotes = sJson.quoteResponse && sJson.quoteResponse.result;
          if (sQuotes && sQuotes.length > 0) {
            prices[sQuotes[0].symbol] = {
              price: sQuotes[0].regularMarketPrice,
              changePct: sQuotes[0].regularMarketChangePercent
            };
          }
          break;
        } catch (e) { /* try next proxy */ }
      }
    }

    if (Object.keys(prices).length > 0) {
      setCachedPrices(prices);
      return prices;
    }

    return null;
  }

  /* ================================================================
     COMPUTE PORTFOLIO
  ================================================================ */
  function computePortfolio(livePrices) {
    var total = 0;
    HOLDINGS.forEach(function (h) {
      var p = (livePrices && livePrices[h.ticker]) ? livePrices[h.ticker].price : h.fallback;
      h.currentPrice = p;
      h.changePct = (livePrices && livePrices[h.ticker]) ? livePrices[h.ticker].changePct : null;
      h.value = h.shares * p;
      total += h.value;
    });

    HOLDINGS.forEach(function (h) {
      h.weight = (h.value / total) * 100;
    });

    // Sort by value descending
    HOLDINGS.sort(function (a, b) { return b.value - a.value; });

    // Compute bucket totals
    var buckets = {};
    HOLDINGS.forEach(function (h) {
      if (!buckets[h.bucket]) buckets[h.bucket] = 0;
      buckets[h.bucket] += h.weight;
    });

    return { total: total, buckets: buckets };
  }

  /* ================================================================
     RENDER FUNCTIONS
  ================================================================ */
  function fmt(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
  function fmtDec(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function fmtPct(n) { return n.toFixed(1) + '%'; }

  var chartInstance = null;

  function renderHeader(portfolio) {
    var el = document.getElementById('headerTotalValue');
    if (el) el.textContent = fmt(portfolio.total);
    var el2 = document.getElementById('headerPositions');
    if (el2) el2.textContent = HOLDINGS.length;

    var growthPct = portfolio.buckets.growth || 0;
    var metalsPct = portfolio.buckets.metals || 0;
    var el3 = document.getElementById('headerGrowthPct');
    if (el3) el3.textContent = fmtPct(growthPct);
    var el4 = document.getElementById('headerMetalsPct');
    if (el4) el4.textContent = fmtPct(metalsPct);
  }

  function renderChart(portfolio) {
    var canvas = document.getElementById('currentChart');
    if (!canvas) return;

    var labels = HOLDINGS.map(function (h) { return h.ticker; });
    var data = HOLDINGS.map(function (h) { return h.value; });

    var colorMap = {};
    var palette = [
      '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#818cf8',
      '#f5c842', '#a78bfa', '#22c55e', '#fb923c', '#f87171'
    ];
    HOLDINGS.forEach(function (h, i) {
      colorMap[h.ticker] = BUCKET_META[h.bucket] ? BUCKET_META[h.bucket].color : palette[i % palette.length];
    });
    // Give each holding a slightly different shade
    var colors = HOLDINGS.map(function (h, i) {
      if (h.bucket === 'growth') {
        var shades = ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#818cf8', '#6366f1', '#4f46e5'];
        return shades[i % shades.length];
      }
      return BUCKET_META[h.bucket] ? BUCKET_META[h.bucket].color : palette[i % palette.length];
    });

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        cutout: '68%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                var h = HOLDINGS[ctx.dataIndex];
                return h.ticker + ': ' + fmtDec(h.value) + ' (' + fmtPct(h.weight) + ')';
              }
            }
          }
        }
      }
    });

    // Update center label
    var centerVal = document.querySelector('.chart-center-value');
    if (centerVal) centerVal.textContent = fmt(portfolio.total);

    // Build legend
    var legendEl = document.getElementById('currentLegend');
    if (legendEl) {
      legendEl.innerHTML = HOLDINGS.map(function (h, i) {
        return '<div class="legend-item">' +
          '<div class="legend-left">' +
            '<span class="legend-dot" style="background:' + colors[i] + '"></span>' +
            '<span class="legend-ticker">' + h.ticker + '</span>' +
          '</div>' +
          '<span class="legend-pct">' + fmtPct(h.weight) + '</span>' +
          '<span class="legend-dollar">' + fmt(h.value) + '</span>' +
        '</div>';
      }).join('');
    }
  }

  function renderSleeveBars(portfolio) {
    var el = document.getElementById('sleeveBars');
    if (!el) return;

    var sleeves = [
      { key: 'growth', label: 'U.S. Growth / Tech Equities', color: '#60a5fa', rangeBg: '#60a5fa', target: BUCKET_TARGETS.growth, purpose: 'High-beta growth stocks. Thrives in strong growth / low inflation.' },
      { key: 'metals', label: 'Precious Metals (Gold + Silver)', color: '#f5c842', rangeBg: '#f5c842', target: BUCKET_TARGETS.metals, purpose: 'Inflation hedge and store of value during currency debasement.' },
      { key: 'bonds',  label: 'Bonds / Fixed Income',    color: '#22c55e', rangeBg: '#22c55e', target: BUCKET_TARGETS.bonds, purpose: 'Ballast during recessions. Rally when growth slows and rates fall.' },
      { key: 'crypto', label: 'Crypto-Linked Equity',    color: '#a78bfa', rangeBg: '#a78bfa', target: BUCKET_TARGETS.crypto, purpose: 'Speculative hard-money thesis. High volatility satellite.' }
    ];

    el.innerHTML = sleeves.map(function (s) {
      var currentPct = portfolio.buckets[s.key] || 0;
      var targetMin = s.target.min;
      var targetMax = s.target.max;
      var inTarget = currentPct >= targetMin && currentPct <= targetMax;
      var statusClass = inTarget ? 'in-target' : (currentPct > targetMax ? 'over-target' : 'under-target');
      var statusIcon = inTarget ? '✓' : (currentPct > targetMax ? '↑' : '↓');
      var maxBar = Math.max(currentPct, targetMax, 70);

      return '<div class="sleeve-row">' +
        '<div class="sleeve-row-header">' +
          '<span class="sleeve-name">' + s.label + '</span>' +
          '<div class="sleeve-meta">' +
            '<span class="sleeve-target-label">Target: ' + s.target.dalioTarget + '</span>' +
            '<span class="sleeve-status ' + statusClass + '">' + statusIcon + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="sleeve-bar-track">' +
          '<div class="sleeve-range-band" style="left:' + (targetMin / maxBar * 100) + '%;width:' + ((targetMax - targetMin) / maxBar * 100) + '%;background:' + s.rangeBg + '"></div>' +
          '<div class="sleeve-bar-current" style="width:' + (currentPct / maxBar * 100) + '%;background:' + s.color + '">' +
            '<span class="sleeve-bar-label">' + fmtPct(currentPct) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="sleeve-purpose">' + s.purpose + '</div>' +
      '</div>';
    }).join('');
  }

  function renderTable(portfolio, isLive) {
    var tbody = document.getElementById('holdingsTbody');
    if (!tbody) return;

    tbody.innerHTML = HOLDINGS.map(function (h) {
      var tagClass = BUCKET_META[h.bucket] ? BUCKET_META[h.bucket].tagClass : '';
      var tagLabel = BUCKET_META[h.bucket] ? BUCKET_META[h.bucket].label : h.bucket;
      var changeClass = '';
      var changeText = '—';
      if (h.changePct !== null && h.changePct !== undefined) {
        changeClass = h.changePct >= 0 ? 'positive' : 'negative';
        changeText = (h.changePct >= 0 ? '+' : '') + h.changePct.toFixed(2) + '%';
      }

      return '<tr>' +
        '<td class="ticker-cell">' + h.ticker + '</td>' +
        '<td><span class="sleeve-tag ' + tagClass + '">' + tagLabel + '</span></td>' +
        '<td class="dollar-cell">' + fmtDec(h.value) + '</td>' +
        '<td class="pct-cell">' + fmtPct(h.weight) + '</td>' +
        '<td class="price-cell">' + fmtDec(h.currentPrice) + '</td>' +
        '<td class="change-cell ' + changeClass + '">' + changeText + '</td>' +
      '</tr>';
    }).join('');

    // Total row
    var totalEl = document.getElementById('tableTotalValue');
    if (totalEl) totalEl.innerHTML = '<strong>' + fmt(portfolio.total) + '</strong>';

    var statusEl = document.getElementById('tablePriceStatus');
    if (statusEl) {
      if (isLive) {
        statusEl.innerHTML = '<span class="price-status live"><span class="price-status-dot"></span>Live prices</span>';
      } else {
        statusEl.innerHTML = '<span class="price-status error"><span class="price-status-dot"></span>Fallback prices</span>';
      }
    }
  }

  function renderScenarios() {
    var el = document.getElementById('scenariosGrid');
    if (!el) return;

    el.innerHTML = SCENARIOS.map(function (s) {
      return '<div class="scenario-card">' +
        '<div class="scenario-card-header">' +
          '<span class="scenario-icon">' + s.icon + '</span>' +
          '<span class="scenario-grade grade-' + s.grade + '">' + s.gradeLabel + '</span>' +
        '</div>' +
        '<div class="scenario-title">' + s.title + '</div>' +
        '<div class="scenario-body">' + s.body + '</div>' +
      '</div>';
    }).join('');
  }

  function renderRationale() {
    var el = document.getElementById('rationaleAccordion');
    if (!el) return;

    el.innerHTML = RATIONALE_ITEMS.map(function (item, i) {
      return '<div class="accordion-item' + (i === 0 ? ' open' : '') + '">' +
        '<div class="accordion-header" data-index="' + i + '">' +
          '<div class="accordion-title-row">' +
            '<span class="accordion-tag" style="background:' + item.tagBg + ';color:' + item.tagColor + '">' + item.tag + '</span>' +
            '<span class="accordion-title">' + item.title + '</span>' +
          '</div>' +
          '<span class="accordion-meta" style="color:' + item.metaColor + '">' + item.meta + '</span>' +
          '<span class="accordion-chevron">▼</span>' +
        '</div>' +
        '<div class="accordion-body">' +
          '<div class="accordion-content">' + item.content + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // Bind accordion clicks
    el.querySelectorAll('.accordion-header').forEach(function (header) {
      header.addEventListener('click', function () {
        var parent = this.parentElement;
        var wasOpen = parent.classList.contains('open');
        // Close all
        el.querySelectorAll('.accordion-item').forEach(function (item) {
          item.classList.remove('open');
        });
        // Toggle clicked
        if (!wasOpen) parent.classList.add('open');
      });
    });
  }

  function renderRecommendations() {
    var el = document.getElementById('recGrid');
    if (!el) return;

    el.innerHTML = RECOMMENDATIONS.map(function (r) {
      var examplesHtml = r.examples.map(function (ex) {
        return '<span class="rec-example-tag">' + ex + '</span>';
      }).join('');

      return '<div class="rec-card">' +
        '<div class="rec-icon">' + r.icon + '</div>' +
        '<div class="rec-title">' + r.title + '</div>' +
        '<div class="rec-body">' + r.body + '</div>' +
        '<div class="rec-examples">' + examplesHtml + '</div>' +
      '</div>';
    }).join('');
  }

  function renderComparison() {
    var tbody = document.getElementById('comparisonTbody');
    if (!tbody) return;

    tbody.innerHTML = COMPARISON_ROWS.map(function (row) {
      var statusClass = '';
      var statusIcon = '';
      if (row.status === 'over') { statusClass = 'check-no'; statusIcon = 'Over'; }
      else if (row.status === 'missing') { statusClass = 'check-no'; statusIcon = 'Missing'; }
      else if (row.status === 'close') { statusClass = 'check-partial'; statusIcon = 'Close'; }
      else { statusClass = 'check-yes'; statusIcon = 'N/A'; }

      return '<tr>' +
        '<td>' + row.asset + '</td>' +
        '<td>' + row.current + '</td>' +
        '<td>' + row.dalio + '</td>' +
        '<td class="' + statusClass + '">' + statusIcon + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderConversation() {
    var el = document.getElementById('conversationCard');
    if (!el) return;

    el.innerHTML =
      '<div class="quote"><strong>"Dalio\'s big point is that we don\'t know which macro environment is coming, so we should build a portfolio that can survive all of them."</strong></div>' +
      '<div class="quote">"Right now, your portfolio is brilliantly set up for one scenario — <strong>continued U.S. tech and innovation boom</strong> — but not for recessions, inflation shocks, or monetary resets."</div>' +
      '<div class="quote">"If we add some bonds, broader commodities, and diversified equity funds, while trimming a bit of the speculative edge, <strong>we can keep your upside but greatly improve your resilience</strong>."</div>';
  }

  function renderReferences() {
    var el = document.getElementById('refsList');
    if (!el) return;

    el.innerHTML = REFERENCES.map(function (ref, i) {
      return '<div class="ref-item">' +
        '<span class="ref-num">[' + (i + 1) + ']</span>' +
        '<span class="ref-text">' + ref + '</span>' +
      '</div>';
    }).join('');
  }

  /* ================================================================
     INIT
  ================================================================ */
  async function init() {
    // First render with fallback prices
    var portfolio = computePortfolio(null);
    renderAll(portfolio, false);

    // Try cached prices
    var cached = getCachedPrices();
    if (cached) {
      portfolio = computePortfolio(cached);
      renderAll(portfolio, true);
    }

    // Fetch live prices
    var live = await fetchPrices();
    if (live) {
      portfolio = computePortfolio(live);
      renderAll(portfolio, true);
    }
  }

  function renderAll(portfolio, isLive) {
    renderHeader(portfolio);
    renderChart(portfolio);
    renderSleeveBars(portfolio);
    renderTable(portfolio, isLive);
    renderScenarios();
    renderRationale();
    renderRecommendations();
    renderComparison();
    renderConversation();
    renderReferences();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
