/* ASHER — device ID generator. crypto.getRandomValues, no network calls. */

(function () {
  'use strict';

  const $ = id => document.getElementById(id);

  const els = {
    format: $('format'), count: $('count'), chunk: $('chunk'),
    gen: $('gen'), clear: $('clear'),
    output: $('output'), outputWrap: $('outputWrap'), label: $('label'),
    copyAll: $('copyAll'), dlTxt: $('dlTxt'), dlZip: $('dlZip'),
    files: $('files'), filesWrap: $('filesWrap'),
    stTotal: $('stTotal'), stFiles: $('stFiles'), stPer: $('stPer'), stFmt: $('stFmt'),
    year: $('year'),
  };

  if (els.year) els.year.textContent = new Date().getFullYear();

  const HEX = '0123456789abcdef';

  function randomHex(n) {
    const bytes = new Uint8Array(Math.ceil(n / 2));
    crypto.getRandomValues(bytes);
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += HEX[bytes[i] >> 4] + HEX[bytes[i] & 0xf];
    return s.slice(0, n);
  }

  function uuid4() {
    const b = new Uint8Array(16);
    crypto.getRandomValues(b);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    return [...b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  function genOne(fmt) {
    switch (fmt) {
      case 'hex32':  return uuid4();
      case 'hex32u': return uuid4().toUpperCase();
      case 'hex16':  return randomHex(16);
      case 'dashed': {
        const h = uuid4();
        return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
      }
      default: return uuid4();
    }
  }

  function splitChunks(arr, size) {
    if (size <= 0 || size >= arr.length) return [arr];
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  let lastIds = [], lastChunks = [], lastFmt = 'hex32';

  async function run() {
    const fmt = els.format.value;
    const total = Math.max(1, Math.min(100000, parseInt(els.count.value, 10) || 0));
    const chunk = Math.max(1, Math.min(10000, parseInt(els.chunk.value, 10) || 0));

    els.gen.disabled = true;
    els.gen.textContent = 'generating…';
    const t0 = performance.now();

    const ids = new Array(total);
    const BATCH = 5000;
    for (let i = 0; i < total; i += BATCH) {
      const end = Math.min(i + BATCH, total);
      for (let j = i; j < end; j++) ids[j] = genOne(fmt);
      await new Promise(r => setTimeout(r, 0));
      if (total >= 20000) {
        els.gen.textContent = `generating ${end.toLocaleString()}/${total.toLocaleString()}…`;
      }
    }

    const chunks = splitChunks(ids, chunk);
    lastIds = ids; lastChunks = chunks; lastFmt = fmt;

    const MAX = 500;
    els.output.textContent = ids.length > MAX
      ? ids.slice(0, MAX).join('\n') + `\n\n… ${ids.length - MAX} more (download for full list)`
      : ids.join('\n');
    els.outputWrap.hidden = false;

    els.files.innerHTML = '';
    if (chunks.length > 1) {
      const stamp = new Date().toISOString().slice(0, 10);
      chunks.forEach((c, i) => {
        const name = `device_ids_${fmt}_${stamp}_part${String(i + 1).padStart(3, '0')}.txt`;
        const blob = new Blob([c.join('\n') + '\n'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const row = document.createElement('div');
        row.className = 'file-item';
        row.innerHTML = `<span class="file-name">${name}</span><span class="file-size">${(blob.size/1024).toFixed(1)} KB</span><a href="${url}" download="${name}">↓</a>`;
        els.files.appendChild(row);
      });
      els.filesWrap.hidden = false;
    } else {
      els.filesWrap.hidden = true;
    }

    const dt = (performance.now() - t0).toFixed(0);
    els.label.textContent = `output · ${total.toLocaleString()} ids · ${dt}ms`;
    els.stTotal.textContent = total.toLocaleString();
    els.stFiles.textContent = chunks.length;
    els.stPer.textContent = chunks[0].length;
    els.stFmt.textContent = fmt;

    els.gen.disabled = false;
    els.gen.textContent = 'Generate';
    toast(`${total.toLocaleString()} ids generated`);
  }

  /* store-only zip writer */
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
    for (const e of centralDir) {
      parts.push(e.header, e.nameBuf);
      cdSize += e.header.length + e.nameBuf.length;
    }
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

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

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
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000);
  }

  els.gen.addEventListener('click', run);
  els.clear.addEventListener('click', () => {
    lastIds = []; lastChunks = [];
    els.output.textContent = '';
    els.outputWrap.hidden = true;
    els.files.innerHTML = '';
    els.filesWrap.hidden = true;
    els.stTotal.textContent = '0';
    els.stFiles.textContent = '0';
    els.stPer.textContent = '0';
    toast('cleared');
  });
  els.format.addEventListener('change', () => els.stFmt.textContent = els.format.value);
  els.count.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });

  els.copyAll.addEventListener('click', async () => {
    if (!lastIds.length) return;
    try {
      await navigator.clipboard.writeText(lastIds.join('\n'));
      els.copyAll.classList.add('ok');
      toast(`copied ${lastIds.length.toLocaleString()}`);
      setTimeout(() => els.copyAll.classList.remove('ok'), 1200);
    } catch {
      const r = document.createRange();
      r.selectNodeContents(els.output);
      const s = window.getSelection();
      s.removeAllRanges(); s.addRange(r);
      document.execCommand('copy');
      toast('copied (fallback)');
    }
  });

  els.dlTxt.addEventListener('click', () => {
    if (!lastIds.length) return;
    const stamp = new Date().toISOString().slice(0, 10);
    downloadBlob(
      new Blob([lastIds.join('\n') + '\n'], { type: 'text/plain' }),
      `device_ids_${lastFmt}_${stamp}_${lastIds.length}.txt`
    );
    toast('downloaded .txt');
  });

  els.dlZip.addEventListener('click', () => {
    if (!lastChunks.length) return;
    const stamp = new Date().toISOString().slice(0, 10);
    const files = lastChunks.map((c, i) => ({
      name: `device_ids_${lastFmt}_${stamp}_part${String(i + 1).padStart(3, '0')}.txt`,
      content: c.join('\n') + '\n',
    }));
    downloadBlob(
      new Blob([buildZip(files)], { type: 'application/zip' }),
      `device_ids_${lastFmt}_${stamp}.zip`
    );
    toast(`zipped ${files.length} files`);
  });

  console.log(
    '%c ASHER %c generator ready — no network calls ',
    'background:#7c5cff;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:700;',
    'background:#14141d;color:#9a9aab;padding:4px 8px;border-radius:0 4px 4px 0;'
  );
})();