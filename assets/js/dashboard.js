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

  /* ================================================================
     REBALANCING RULES & SLEEVE GUIDE
  ================================================================ */
  var REBAL_RULES = [
    {
      icon: '📅',
      title: 'Calendar Rebalance',
      body: 'Dalio-aligned portfolios rebalance on a <strong>fixed schedule</strong> — typically quarterly or semi-annually. This removes emotion from the process. Pick a date (e.g., Jan 1, Apr 1, Jul 1, Oct 1) and check every sleeve against its target band.'
    },
    {
      icon: '📏',
      title: 'Band-Based Triggers',
      body: 'If any sleeve drifts <strong>more than 5 percentage points</strong> from its target midpoint between scheduled dates, rebalance immediately. This catches large market moves — like a tech crash or gold spike — before they distort the portfolio\'s risk balance.'
    },
    {
      icon: '🔄',
      title: 'Sell Winners, Buy Losers',
      body: 'Rebalancing is inherently <strong>contrarian</strong>. When equities surge, you trim them and buy bonds or commodities that have lagged. When bonds rally in a flight to safety, you trim and buy beaten-down equities. This is the mechanical edge of risk parity.'
    },
    {
      icon: '💰',
      title: 'New Cash Priority',
      body: 'When adding fresh capital, <strong>direct it to the most underweight sleeve first</strong>. This is the least disruptive way to rebalance — no selling required, no tax events triggered. Only sell to rebalance when new cash alone cannot close the gap.'
    },
    {
      icon: '🧱',
      title: 'Build Missing Sleeves First',
      body: 'Brian\'s portfolio currently has <strong>zero bonds and zero broad commodities</strong>. Before fine-tuning existing sleeves, priority #1 is establishing the missing building blocks — even a small starter position in TLT or AGG begins reducing concentrated risk.'
    },
    {
      icon: '🎯',
      title: 'Risk-Weight, Not Dollar-Weight',
      body: 'Dalio\'s key insight: bonds need <strong>more capital</strong> because they have lower volatility. Equities need less. A 55% bond / 30% equity / 15% real-asset split is designed so each sleeve contributes <strong>roughly equal risk</strong> to the portfolio.'
    }
  ];

  var REBAL_SLEEVES = [
    {
      tag: 'EQUITIES',
      tagBg: 'rgba(96,165,250,0.12)',
      tagColor: '#60a5fa',
      title: 'Equities Sleeve — Target ~30%',
      meta: '~30%',
      metaColor: '#60a5fa',
      content: '<p><strong>Current state:</strong> Brian is massively overweight equities at ~85%+, and the equity exposure is concentrated in high-beta U.S. growth/tech names.</p>' +
        '<p><strong>Rebalancing actions:</strong></p>' +
        '<ul>' +
          '<li><strong>Trim to target:</strong> Over time, reduce total equity weight toward 25-35% of portfolio value. The surplus funds the missing sleeves (bonds, commodities).</li>' +
          '<li><strong>Diversify within equities:</strong> Shift from 100% single-name growth stocks toward a mix of broad index (VTI), international (VXUS), and value (VTV). Keep high-conviction names (NVDA, CDNS) but cap them at reasonable individual weights (3-5% each).</li>' +
          '<li><strong>Satellites stay small:</strong> Speculative names (RCAT, RKLB, HIVE) should total no more than 5-8% of the equity sleeve. If they surge, trim profits and redeploy to underweight sleeves.</li>' +
          '<li><strong>When equities rally:</strong> This is when you trim — sell into strength and replenish bonds and real assets that have lagged. Dalio\'s discipline requires selling what has worked well.</li>' +
        '</ul>'
    },
    {
      tag: 'BONDS',
      tagBg: 'rgba(34,197,94,0.12)',
      tagColor: '#22c55e',
      title: 'Bonds Sleeve — Target ~55%',
      meta: '~55%',
      metaColor: '#22c55e',
      content: '<p><strong>Current state:</strong> Brian has <strong>zero bond exposure</strong>. This is the single largest gap in the portfolio from a Dalio perspective.</p>' +
        '<p><strong>Replenishment priority:</strong></p>' +
        '<ul>' +
          '<li><strong>Step 1 — Start with short-term Treasuries (SGOV/SHV):</strong> These earn yield (~4-5%) with minimal price risk. Park new cash here as a staging area while building the full bond position.</li>' +
          '<li><strong>Step 2 — Add intermediate Treasuries (IEF):</strong> 7-10 year Treasuries are the backbone of the All-Weather bond sleeve. They rally meaningfully when growth slows and the Fed cuts rates.</li>' +
          '<li><strong>Step 3 — Add long-term Treasuries (TLT):</strong> 20+ year bonds are the most powerful recession hedge. They can gain 30-40% in a deflationary crisis. This is the "ballast" that protects against equity crashes.</li>' +
          '<li><strong>Step 4 — Consider TIPS (TIP/SCHP):</strong> Inflation-linked bonds protect against the scenario where inflation erodes nominal bond returns. A small allocation adds another uncorrelated return stream.</li>' +
          '<li><strong>When bonds sell off:</strong> Buy more. Bond sell-offs (rising rates) are when this sleeve gets cheaper — and Dalio\'s rebalancing discipline says you add to what has fallen, not chase what has risen.</li>' +
        '</ul>'
    },
    {
      tag: 'GOLD',
      tagBg: 'rgba(245,200,66,0.12)',
      tagColor: '#f5c842',
      title: 'Precious Metals Sleeve — Target ~7.5%',
      meta: '~7.5%',
      metaColor: '#f5c842',
      content: '<p><strong>Current state:</strong> GLD and SLV provide some real-asset exposure but represent a small slice of the portfolio. Brian is near the right idea but undersized relative to All-Weather targets.</p>' +
        '<p><strong>Rebalancing actions:</strong></p>' +
        '<ul>' +
          '<li><strong>Size to target:</strong> Gold should be approximately 7.5% of the total portfolio. Silver can complement but is more volatile and industrial — keep it smaller than gold.</li>' +
          '<li><strong>When gold spikes (crisis/inflation):</strong> Trim. Gold often surges during exactly the moments when equities and bonds are cheap. Taking profits from gold to buy beaten-down stocks or bonds is classic All-Weather rebalancing.</li>' +
          '<li><strong>When gold drops (risk-on rallies):</strong> Add. Gold tends to underperform during euphoric bull markets — exactly when it becomes cheapest insurance for the next downturn.</li>' +
          '<li><strong>Role in the portfolio:</strong> Gold is Dalio\'s primary "store of value" hedge against currency debasement and monetary disorder. It\'s not about gold going up — it\'s about gold holding value when paper money loses it.</li>' +
        '</ul>'
    },
    {
      tag: 'CMDTY',
      tagBg: 'rgba(251,146,60,0.12)',
      tagColor: '#fb923c',
      title: 'Broad Commodities Sleeve — Target ~7.5%',
      meta: '~7.5%',
      metaColor: '#fb923c',
      content: '<p><strong>Current state:</strong> Brian has <strong>no broad commodity exposure</strong>. Gold and silver alone do not cover the full inflation-hedge spectrum.</p>' +
        '<p><strong>Replenishment priority:</strong></p>' +
        '<ul>' +
          '<li><strong>Add a diversified commodity ETF (BCI, DJP, GSG):</strong> These track baskets of energy, metals, and agriculture — the "stuff" economy that Dalio says you want to own when financial assets are being devalued.</li>' +
          '<li><strong>Consider energy exposure (XLE or energy commodity ETFs):</strong> Energy is a critical inflation hedge and often moves opposite to bonds and growth stocks, adding genuine diversification.</li>' +
          '<li><strong>When commodities spike:</strong> Trim and redeploy to bonds or equities. Commodity spikes typically coincide with inflation shocks that hammer other asset classes — rebalancing captures this divergence.</li>' +
          '<li><strong>When commodities drop:</strong> Add. Cheap commodities are cheap insurance against the next inflation cycle. Dalio\'s systematic approach means buying what\'s out of favor.</li>' +
          '<li><strong>Why this matters:</strong> In stagflation (falling growth + rising inflation), broad commodities are often the <strong>only sleeve that works</strong>. Without them, the portfolio has no defense against the worst macro environment.</li>' +
        '</ul>'
    },
    {
      tag: 'CRYPTO',
      tagBg: 'rgba(167,139,250,0.12)',
      tagColor: '#a78bfa',
      title: 'Crypto-Linked Satellite — Cap at ~2-3%',
      meta: '~2-3%',
      metaColor: '#a78bfa',
      content: '<p><strong>Current state:</strong> HIVE is a small position but carries outsized volatility as a crypto-mining equity. Dalio does not include crypto in the All-Weather framework, but it can exist as a small satellite.</p>' +
        '<p><strong>Rebalancing discipline:</strong></p>' +
        '<ul>' +
          '<li><strong>Hard cap at 3% of portfolio:</strong> If HIVE (or any crypto-linked position) surges past this cap, trim immediately. Crypto\'s extreme volatility means a 5% position can become 10% or drop to 1% in weeks.</li>' +
          '<li><strong>When crypto booms:</strong> Trim aggressively. Take profits and deploy into underweight sleeves. This is the most important rebalancing discipline for speculative satellites — let the system force you to sell high.</li>' +
          '<li><strong>When crypto crashes:</strong> Do not add beyond the 3% cap. The All-Weather framework does not require crypto. If it drops to zero within the cap, that\'s the accepted risk of a satellite position.</li>' +
          '<li><strong>Dalio\'s view:</strong> He sees Bitcoin as a potential "digital gold" but emphasizes that it is <strong>not a substitute for true diversification</strong>. It adds speculative optionality, not structural balance.</li>' +
        '</ul>'
    }
  ];

  var REFERENCES = [
    'Ray Dalio, "Principles for Dealing with the Changing World Order" (2021)',
    'Ray Dalio, "Investing in Light of the Big Cycle" — Chapter from Changing World Order',
    'Bridgewater Associates, "The All Weather Story" (2012)',
    'Ray Dalio, "How the Economic Machine Works" (2013)',
    'Bridgewater Associates, Risk Parity methodology papers'
  ];

  /* ================================================================
     PRICE FETCHING — Finnhub REST API
     Finnhub free tier: 60 calls/min, CORS-friendly, no proxy needed.
     https://finnhub.io/docs/api/quote

     HOW TO SET UP:
     1. Register free at https://finnhub.io/register (takes 30 seconds)
     2. Copy your API key from the dashboard
     3. Replace 'YOUR_FINNHUB_API_KEY' below with your key
        — OR pass it via URL: yoursite.com/?finnhub_key=YOUR_KEY

     Strategy:
     1. Show cached prices immediately if available
     2. Fetch all tickers via Finnhub /quote endpoint in parallel
     3. Retry failed tickers once after a short delay
     4. Cache results in localStorage (5 min TTL)
  ================================================================ */
  var FINNHUB_DEFAULT_KEY = 'd6j0l3pr01qleu95sbr0d6j0l3pr01qleu95sbrg';
  var FINNHUB_BASE = 'https://finnhub.io/api/v1';

  // Allow API key override via URL parameter: ?finnhub_key=xxx
  function getFinnhubKey() {
    try {
      var params = new URLSearchParams(window.location.search);
      var urlKey = params.get('finnhub_key');
      if (urlKey && urlKey.length > 10) return urlKey;
    } catch (e) { /* URLSearchParams not supported */ }
    // Check localStorage for a previously saved key
    try {
      var saved = localStorage.getItem('finnhub_api_key');
      if (saved && saved.length > 10) return saved;
    } catch (e) { /* ignore */ }
    return FINNHUB_DEFAULT_KEY;
  }

  var FINNHUB_KEY = getFinnhubKey();
  var CACHE_KEY = 'bd_portfolio_prices';
  var CACHE_MAX_AGE = 5 * 60 * 1000; // 5 minutes

  function fetchWithTimeout(url, timeoutMs) {
    timeoutMs = timeoutMs || 8000;
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, timeoutMs);
    return fetch(url, { signal: controller.signal }).finally(function () { clearTimeout(timer); });
  }

  // Fetch a single ticker quote from Finnhub
  async function fetchFinnhubQuote(ticker) {
    var url = FINNHUB_BASE + '/quote?symbol=' + encodeURIComponent(ticker) + '&token=' + FINNHUB_KEY;
    var res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    // Finnhub returns: c=current, pc=previous close, o=open, dp=percent change, d=change
    if (!data || data.c === 0 || data.c === undefined) return null;
    return {
      price: data.c,
      prevClose: data.pc || data.c,
      open: data.o || data.pc || data.c,
      changePct: data.dp || (data.pc ? ((data.c - data.pc) / data.pc) * 100 : 0)
    };
  }

  // Fetch all tickers in parallel with staggered starts to respect rate limits
  // Finnhub free tier: 60 calls/min — 10 tickers is well within limits
  async function fetchAllPrices() {
    var results = {};
    var fetches = HOLDINGS.map(function (h) {
      return fetchFinnhubQuote(h.ticker).then(function (data) {
        if (data) results[h.ticker] = data;
      }).catch(function () { /* skip failed ticker */ });
    });
    await Promise.all(fetches);
    return Object.keys(results).length > 0 ? results : null;
  }

  // Retry only the tickers that failed on first attempt
  async function retryMissingPrices(existingPrices) {
    var have = existingPrices || {};
    var missing = HOLDINGS.filter(function (h) { return !have[h.ticker]; });
    if (missing.length === 0) return null;

    var results = {};
    var fetches = missing.map(function (h) {
      return fetchFinnhubQuote(h.ticker).then(function (data) {
        if (data) results[h.ticker] = data;
      }).catch(function () { /* skip */ });
    });
    await Promise.all(fetches);
    return Object.keys(results).length > 0 ? results : null;
  }

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

  function mergePricesIntoCache(newPrices) {
    if (!newPrices) return null;
    var cached = getCachedPrices();
    var merged = cached ? Object.assign({}, cached, newPrices) : Object.assign({}, newPrices);
    setCachedPrices(merged);
    return merged;
  }

  function countPricedHoldings(prices) {
    if (!prices) return 0;
    return HOLDINGS.filter(function (h) { return !!prices[h.ticker]; }).length;
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

  function renderRebalRules() {
    var el = document.getElementById('rulesGrid');
    if (!el) return;

    el.innerHTML = REBAL_RULES.map(function (r) {
      return '<div class="rule-card">' +
        '<div class="rule-icon">' + r.icon + '</div>' +
        '<div class="rule-title">' + r.title + '</div>' +
        '<div class="rule-body">' + r.body + '</div>' +
      '</div>';
    }).join('');
  }

  function renderRebalSleeves() {
    var el = document.getElementById('rebalAccordion');
    if (!el) return;

    el.innerHTML = REBAL_SLEEVES.map(function (item, i) {
      return '<div class="accordion-item' + (i === 0 ? ' open' : '') + '">' +
        '<div class="accordion-header" data-rebal-index="' + i + '">' +
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
        el.querySelectorAll('.accordion-item').forEach(function (item) {
          item.classList.remove('open');
        });
        if (!wasOpen) parent.classList.add('open');
      });
    });
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
     PORTFOLIO PERFORMANCE CHART — Finnhub /stock/candle
  ================================================================ */
  var perfChartInstance = null;
  var perfCurrentRange = '1D';
  var PORTFOLIO_TOTAL = 0;
  var perfSeriesCache = {};

  /* ================================================================
     PERFORMANCE CHART
     ─────────────────────────────────────────────────────────────────
     1D  — Built entirely from Finnhub /quote data (prevClose → current).
           No extra API calls; matches the "Today" return in the table.
     7D / 1M — Uses Alpha Vantage TIME_SERIES_DAILY.
           Shows a note if any tickers could not be fetched.
  ================================================================ */

  // ── Alpha Vantage config ──
  var AV_KEY = 'FPC34YCBMQ39AULC';
  var AV_BASE = 'https://www.alphavantage.co/query';
  var AV_CACHE_KEY = 'bd_av_daily';
  var AV_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  var avDailyCandles = null;          // in-memory cache
  var avMissingTickers = [];          // tickers that failed AV fetch

  function avDelay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  // Fetch TIME_SERIES_DAILY for a single ticker from Alpha Vantage
  async function fetchAVDaily(ticker) {
    var url = AV_BASE + '?function=TIME_SERIES_DAILY&symbol=' + encodeURIComponent(ticker) +
      '&outputsize=compact&apikey=' + AV_KEY;
    var res = await fetchWithTimeout(url, 15000);
    if (!res.ok) throw new Error('AV HTTP ' + res.status);
    var data = await res.json();
    if (data['Note'] || data['Information']) throw new Error('AV rate limited');
    var ts = data['Time Series (Daily)'];
    if (!ts) return null;
    var timestamps = [];
    var closes = [];
    var dates = Object.keys(ts).sort();
    dates.forEach(function (d) {
      timestamps.push(Math.floor(new Date(d + 'T16:00:00-05:00').getTime() / 1000));
      closes.push(parseFloat(ts[d]['4. close']));
    });
    return { t: timestamps, c: closes };
  }

  function loadAVCache() {
    try {
      var raw = localStorage.getItem(AV_CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts > AV_CACHE_TTL) return null;
      avMissingTickers = parsed.missing || [];
      return parsed.candles;
    } catch (e) { return null; }
  }

  function saveAVCache(candles, missing) {
    try {
      localStorage.setItem(AV_CACHE_KEY, JSON.stringify({
        ts: Date.now(), candles: candles, missing: missing
      }));
    } catch (e) { /* quota exceeded */ }
  }

  // Fetch daily candles for all holdings (sequential, 400ms gaps)
  async function fetchAllDailyCandles() {
    if (avDailyCandles) return avDailyCandles;

    var cached = loadAVCache();
    if (cached) {
      avDailyCandles = cached;
      return cached;
    }

    var candles = {};
    var missing = [];
    for (var i = 0; i < HOLDINGS.length; i++) {
      var ticker = HOLDINGS[i].ticker;
      try {
        var d = await fetchAVDaily(ticker);
        if (d) { candles[ticker] = d; }
        else   { missing.push(ticker); }
      } catch (err) {
        console.warn('AV daily fetch failed for ' + ticker + ':', err.message || err);
        missing.push(ticker);
      }
      if (i < HOLDINGS.length - 1) await avDelay(400);
    }

    avMissingTickers = missing;
    if (Object.keys(candles).length > 0) {
      avDailyCandles = candles;
      saveAVCache(candles, missing);
    }
    return candles;
  }

  // ── Helpers ──
  function perfFmtValue(val) {
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function perfRangeLabel(range) {
    if (range === '1D') return 'Today';
    if (range === '7D') return 'Past week';
    return 'Past month';
  }

  function findNearestPrice(timestamps, values, target) {
    if (!timestamps || !timestamps.length) return null;
    var lo = 0, hi = timestamps.length - 1;
    while (lo < hi) {
      var mid = (lo + hi) >> 1;
      if (timestamps[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    if (lo > 0 && Math.abs(timestamps[lo - 1] - target) < Math.abs(timestamps[lo] - target)) {
      lo = lo - 1;
    }
    return values[lo];
  }

  // ── 1D series from Finnhub quote data (no extra API calls) ──
  function build1DSeries() {
    var prices = getCachedPrices();
    if (!prices) return null;

    var prevCloseTotal = 0;
    var openTotal = 0;
    var currentTotal = 0;
    var count = 0;

    HOLDINGS.forEach(function (h) {
      var q = prices[h.ticker];
      if (q && q.price) {
        prevCloseTotal += h.shares * (q.prevClose || q.price);
        openTotal      += h.shares * (q.open || q.prevClose || q.price);
        currentTotal   += h.shares * q.price;
        count++;
      } else {
        prevCloseTotal += h.shares * h.fallback;
        openTotal      += h.shares * h.fallback;
        currentTotal   += h.shares * h.fallback;
      }
    });

    if (count === 0) return null;

    // Build a smooth line: prevClose → open → current
    var now = Date.now();
    var today = new Date();

    // Previous close at ~4 PM yesterday
    var yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    // Skip weekends for previous close timestamp
    var dow = yesterday.getDay();
    if (dow === 0) yesterday.setDate(yesterday.getDate() - 2); // Sun → Fri
    if (dow === 6) yesterday.setDate(yesterday.getDate() - 1); // Sat → Fri
    yesterday.setHours(16, 0, 0, 0);
    var prevCloseTime = yesterday.getTime();

    // Market open at 9:30 AM today
    var marketOpen = new Date(today);
    marketOpen.setHours(9, 30, 0, 0);
    var openTime = marketOpen.getTime();

    // If before market open, shift to show yesterday's session
    if (now < openTime) {
      openTime -= 24 * 60 * 60 * 1000;
      prevCloseTime -= 24 * 60 * 60 * 1000;
    }

    var series = [];

    // Point 1: Previous close
    series.push({ time: prevCloseTime, value: prevCloseTotal });

    // Point 2: Market open
    series.push({ time: openTime, value: openTotal });

    // Points 3-N: Interpolated from open to current
    var steps = 18;
    for (var i = 1; i <= steps; i++) {
      var frac = i / steps;
      var t = openTime + (now - openTime) * frac;
      var v = openTotal + (currentTotal - openTotal) * frac;
      series.push({ time: t, value: v });
    }

    return series;
  }

  // ── 7D / 1M series from Alpha Vantage daily data ──
  async function buildAVSeries(range) {
    var candles = await fetchAllDailyCandles();

    var baseTimestamps = null;
    var maxLen = 0;
    HOLDINGS.forEach(function (h) {
      var d = candles[h.ticker];
      if (d && d.t && d.t.length > maxLen) {
        maxLen = d.t.length;
        baseTimestamps = d.t.slice();
      }
    });

    if (!baseTimestamps || baseTimestamps.length < 2) return null;

    var trimCount = (range === '7D') ? 7 : 22;
    if (baseTimestamps.length > trimCount) {
      baseTimestamps = baseTimestamps.slice(-trimCount);
    }

    var series = [];
    for (var i = 0; i < baseTimestamps.length; i++) {
      var t = baseTimestamps[i];
      var value = 0;
      HOLDINGS.forEach(function (h) {
        var cd = candles[h.ticker];
        if (cd) {
          var p = findNearestPrice(cd.t, cd.c, t);
          if (p != null) { value += h.shares * p; return; }
        }
        value += h.shares * h.fallback;
      });
      series.push({ time: t * 1000, value: value });
    }

    return series;
  }

  // ── Missing-ticker note ──
  function showMissingNote(tickers) {
    var noteEl = document.getElementById('perfMissingNote');
    if (!noteEl) return;
    if (!tickers || tickers.length === 0) {
      noteEl.style.display = 'none';
      return;
    }
    noteEl.textContent = 'Could not load data for: ' + tickers.join(', ') +
      ' \u2014 using fallback prices for ' + (tickers.length === 1 ? 'this stock' : 'these stocks') + '.';
    noteEl.style.display = 'block';
  }

  // ── Crosshair plugin ──
  var perfCrosshairPlugin = {
    id: 'perfCrosshair',
    afterDraw: function (chart) {
      if (chart._crosshairX == null) return;
      var ctx = chart.ctx;
      var yAxis = chart.scales.y;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(chart._crosshairX, yAxis.top);
      ctx.lineTo(chart._crosshairX, yAxis.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(128,128,128,0.35)';
      ctx.stroke();
      ctx.restore();
    }
  };

  // ── Header value + return display ──
  function updatePerfHeader(currentVal, startVal, range) {
    var valueEl = document.getElementById('perfValue');
    var returnEl = document.getElementById('perfReturn');
    if (!valueEl || !returnEl) return;

    valueEl.textContent = perfFmtValue(currentVal);

    var delta = currentVal - startVal;
    var pct = startVal ? (delta / startVal * 100) : 0;
    var sign = delta >= 0 ? '+' : '-';
    var colorClass = delta >= 0 ? 'perf-positive' : 'perf-negative';

    returnEl.className = 'perf-return ' + colorClass;
    returnEl.textContent = sign + '$' + Math.abs(delta).toFixed(2) +
      ' (' + sign + Math.abs(pct).toFixed(2) + '%)  ' + perfRangeLabel(range);
  }

  // ── Render the Chart.js line chart ──
  function renderPerfChart(series, range) {
    var canvas = document.getElementById('perfChart');
    if (!canvas || !series || series.length < 2) return;

    var ctx = canvas.getContext('2d');
    var startVal = series[0].value;
    var endVal = series[series.length - 1].value;
    var isPositive = endVal >= startVal;

    var lineColor = isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)';

    var gradient = ctx.createLinearGradient(0, 0, 0, canvas.parentElement.clientHeight || 240);
    gradient.addColorStop(0, isPositive ? 'rgba(34, 197, 94, 0.18)' : 'rgba(239, 68, 68, 0.18)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    var labels = series.map(function (p) { return p.time; });
    var data = series.map(function (p) { return p.value; });

    if (perfChartInstance) {
      perfChartInstance.destroy();
      perfChartInstance = null;
    }

    canvas._perfSeries = series;
    canvas._perfRange = range;

    perfChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          borderColor: lineColor,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: lineColor,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          borderWidth: 2
        }]
      },
      plugins: [perfCrosshairPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            external: function (context) {
              var chart = context.chart;
              if (!context.tooltip || context.tooltip.opacity === 0) {
                chart._crosshairX = null;
                chart.draw();
                updatePerfHeader(endVal, startVal, range);
                return;
              }
              var pts = context.tooltip.dataPoints;
              if (pts && pts.length) {
                chart._crosshairX = pts[0].element.x;
                chart.draw();
                updatePerfHeader(pts[0].raw, startVal, range);
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: { display: false },
            border: { display: false },
            ticks: {
              maxTicksLimit: 5,
              autoSkip: true,
              font: { size: 11, family: 'Inter, system-ui, sans-serif' },
              color: 'rgba(128,128,128,0.6)',
              callback: function (value, index) {
                var ts = labels[index];
                var d = new Date(ts);
                if (range === '1D') {
                  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                }
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }
            }
          },
          y: { display: false }
        }
      }
    });

    updatePerfHeader(endVal, startVal, range);
  }

  // Mouseleave restores the header to current values
  function setupPerfChartEvents() {
    var canvas = document.getElementById('perfChart');
    if (!canvas) return;
    canvas.addEventListener('mouseleave', function () {
      if (perfChartInstance) {
        perfChartInstance._crosshairX = null;
        perfChartInstance.draw();
      }
      var series = canvas._perfSeries;
      var range = canvas._perfRange;
      if (series && series.length >= 2) {
        updatePerfHeader(series[series.length - 1].value, series[0].value, range);
      }
    });
  }

  // ── Load a specific range ──
  async function loadPerfChart(range) {
    var returnEl = document.getElementById('perfReturn');

    // Check in-memory series cache
    if (perfSeriesCache[range]) {
      showMissingNote(range === '1D' ? [] : avMissingTickers);
      renderPerfChart(perfSeriesCache[range], range);
      return;
    }

    if (returnEl) {
      returnEl.className = 'perf-return';
      returnEl.textContent = 'Loading ' + perfRangeLabel(range).toLowerCase() + '\u2026';
    }

    var series = null;

    if (range === '1D') {
      // 1D: use Finnhub quote data already fetched — zero extra API calls
      series = build1DSeries();
      showMissingNote([]);
      if (series && series.length >= 2) {
        perfSeriesCache[range] = series;
        renderPerfChart(series, range);
        return;
      }
      // Prices not loaded yet; will be retried via retryPerfChartIfEmpty
      if (returnEl) returnEl.textContent = 'Waiting for price data\u2026';
    } else {
      // 7D / 1M: use Alpha Vantage daily data
      try {
        series = await buildAVSeries(range);
        showMissingNote(avMissingTickers);
        if (series && series.length >= 2) {
          perfSeriesCache[range] = series;
          renderPerfChart(series, range);
          return;
        }
      } catch (err) {
        console.warn('Chart load error for ' + range + ':', err);
      }
      if (returnEl) returnEl.textContent = 'Historical data unavailable';
      showMissingNote(avMissingTickers);
    }
  }

  // Called after live prices arrive — rebuild 1D chart if it hasn't rendered yet
  function retryPerfChartIfEmpty() {
    // Clear stale 1D cache so it picks up new prices
    delete perfSeriesCache['1D'];
    if (perfCurrentRange !== '1D') return;
    var series = build1DSeries();
    if (series && series.length >= 2) {
      perfSeriesCache['1D'] = series;
      showMissingNote([]);
      renderPerfChart(series, '1D');
    }
  }

  // ── Initialize chart + tab handlers ──
  async function initPerfChart() {
    var container = document.getElementById('perfChartSection');
    if (!container) return;

    var valueEl = document.getElementById('perfValue');
    if (valueEl) valueEl.textContent = perfFmtValue(PORTFOLIO_TOTAL);

    var tabs = document.querySelectorAll('#perfRangeTabs .perf-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        perfCurrentRange = tab.getAttribute('data-range');
        loadPerfChart(perfCurrentRange);
      });
    });

    setupPerfChartEvents();
    await loadPerfChart('1D');
  }

  /* ================================================================
     INIT
  ================================================================ */
  function showPriceStatus(state, detail) {
    var el = document.getElementById('tablePriceStatus');
    if (!el) return;
    if (state === 'loading') {
      el.innerHTML = '<span class="price-status loading"><span class="price-status-dot"></span>Loading prices\u2026</span>';
    } else if (state === 'live') {
      el.innerHTML = '<span class="price-status live"><span class="price-status-dot"></span>Live \u00b7 ' + (detail || 'just now') + '</span>';
    } else if (state === 'cached') {
      el.innerHTML = '<span class="price-status cached"><span class="price-status-dot"></span>Cached</span>';
    } else if (state === 'needkey') {
      el.innerHTML = '<span class="price-status error"><span class="price-status-dot"></span>API key needed</span>';
    } else if (state === 'error') {
      el.innerHTML = '<span class="price-status error"><span class="price-status-dot"></span>Using fallback prices</span>';
    }
  }

  // Show/hide API key setup banner
  function showApiKeyBanner(show) {
    var banner = document.getElementById('apiKeyBanner');
    if (banner) banner.style.display = show ? 'block' : 'none';
  }

  // Handle API key save from the inline form
  function initApiKeyForm() {
    var form = document.getElementById('apiKeyForm');
    var input = document.getElementById('apiKeyInput');
    if (!form || !input) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = input.value.trim();
      if (key.length > 10) {
        try { localStorage.setItem('finnhub_api_key', key); } catch (err) { /* ignore */ }
        FINNHUB_KEY = key;
        showApiKeyBanner(false);
        showPriceStatus('loading');
        // Re-fetch prices with the new key
        fetchAllPrices().then(function (live) {
          if (live) {
            mergePricesIntoCache(live);
            var portfolio = computePortfolio(live);
            renderAll(portfolio, true);
            showPriceStatus('live', priceStatusText(live));
          } else {
            showPriceStatus('error');
          }
        }).catch(function () { showPriceStatus('error'); });
      }
    });
  }

  function isKeyConfigured() {
    return FINNHUB_KEY && FINNHUB_KEY !== 'YOUR_FINNHUB_API_KEY' && FINNHUB_KEY.length > 10;
  }

  function priceStatusText(prices) {
    return countPricedHoldings(prices) + '/' + HOLDINGS.length + ' tickers';
  }

  async function init() {
    // Initialize the API key form handler
    initApiKeyForm();

    // Step 1: Render with fallback prices immediately
    var portfolio = computePortfolio(null);
    PORTFOLIO_TOTAL = portfolio.total;
    renderAll(portfolio, false);

    // Step 2: Check if API key is configured
    if (!isKeyConfigured()) {
      showApiKeyBanner(true);
      showPriceStatus('needkey');
      // Still check cache — user may have had prices from a previous session
      var cached = getCachedPrices();
      if (cached) {
        portfolio = computePortfolio(cached);
        PORTFOLIO_TOTAL = portfolio.total;
        renderAll(portfolio, true);
        showPriceStatus('cached');
      }
      return;
    }

    showPriceStatus('loading');
    var allPrices = {};

    // Step 3: Show cached data if available
    var cached = getCachedPrices();
    if (cached) {
      allPrices = Object.assign({}, cached);
      portfolio = computePortfolio(cached);
      PORTFOLIO_TOTAL = portfolio.total;
      renderAll(portfolio, true);
      showPriceStatus('cached');
    }

    // Step 4: Fetch fresh prices from Finnhub (all tickers in parallel)
    try {
      var live = await fetchAllPrices();
      if (live) {
        Object.assign(allPrices, live);
        mergePricesIntoCache(allPrices);
        portfolio = computePortfolio(allPrices);
        PORTFOLIO_TOTAL = portfolio.total;
        renderAll(portfolio, true);
        showPriceStatus('live', priceStatusText(allPrices));
        retryPerfChartIfEmpty();
      } else if (!cached) {
        showPriceStatus('error');
      }
    } catch (e) {
      if (!cached) showPriceStatus('error');
    }

    // Step 5: Retry any missing tickers after a short delay
    var missingCount = HOLDINGS.length - countPricedHoldings(allPrices);
    if (missingCount > 0) {
      setTimeout(async function () {
        try {
          var retryPrices = await retryMissingPrices(allPrices);
          if (retryPrices) {
            Object.assign(allPrices, retryPrices);
            mergePricesIntoCache(allPrices);
            portfolio = computePortfolio(allPrices);
            PORTFOLIO_TOTAL = portfolio.total;
            renderAll(portfolio, true);
            showPriceStatus('live', priceStatusText(allPrices));
            retryPerfChartIfEmpty();
          }
        } catch (e) { /* retry failed */ }
      }, 3000);
    }

    // Step 6: Initialize the performance chart (candle data)
    initPerfChart();
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
    renderRebalRules();
    renderRebalSleeves();
    renderConversation();
    renderReferences();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
