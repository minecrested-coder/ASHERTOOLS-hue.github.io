/* ASHER — device ID generator. crypto.getRandomValues, no backend. */

(function () {
  'use strict';

  const $ = id => document.getElementById(id);

  const els = {
    format:      $('format'),
    count:       $('count'),
    chunk:       $('chunk'),
    gen:         $('gen'),
    clear:       $('clear'),
    output:      $('output'),
    outputWrap:  $('outputWrap'),
    outputLabel: $('outputLabel'),
    copyAll:     $('copyAll'),
    downloadAll: $('downloadAll'),
    downloadZip: $('downloadZip'),
    files:       $('files'),
    filesWrap:   $('filesWrap'),
    stTotal:     $('stTotal'),
    stFiles:     $('stFiles'),
    stPerFile:   $('stPerFile'),
    stFmt:       $('stFmt'),
    year:        $('year'),
  };

  if (els.year) els.year.textContent = new Date().getFullYear();

  /* ─── crypto random ───────────────────────────────────────────────── */
  const HEX = '0123456789abcdef';

  function randomBytes(n) {
    const buf = new Uint8Array(n);
    crypto.getRandomValues(buf);
    return buf;
  }

  function randomHex(n) {
    // n hex chars from crypto bytes — each byte → 2 hex chars, slice to n
    const bytes = randomBytes(Math.ceil(n / 2));
    let s = '';
    for (let i = 0; i < bytes.length; i++) s += HEX[bytes[i] >> 4] + HEX[bytes[i] & 0xf];
    return s.slice(0, n);
  }

  function uuid4() {
    const b = randomBytes(16);
    b[6] = (b[6] & 0x0f) | 0x40;  // version 4
    b[8] = (b[8] & 0x3f) | 0x80;  // variant
    const hex = [...b].map(x => x.toString(16).padStart(2, '0')).join('');
    return hex;
  }

  function uuid4Dashed() {
    const h = uuid4();
    return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
  }

  function genOne(fmt) {
    switch (fmt) {
      case 'hex32':  return uuid4();
      case 'hex32u': return uuid4().toUpperCase();
      case 'hex16':  return randomHex(16);
      case 'dashed': return uuid4Dashed();
      default:       return uuid4();
    }
  }

  /* ─── batch generate — chunked to keep the tab alive at 100k ─────── */
  function generateBatch(fmt, total, onProgress) {
    const out = new Array(total);
    const BATCH = 5000;
    let i = 0;

    return new Promise(resolve => {
      function step() {
        const end = Math.min(i + BATCH, total);
        for (; i < end; i++) out[i] = genOne(fmt);
        if (onProgress) onProgress(i, total);
        if (i < total) setTimeout(step, 0);
        else resolve(out);
      }
      step();
    });
  }

  /* ─── split into chunks ───────────────────────────────────────────── */
  function splitChunks(arr, size) {
    if (size <= 0 || size >= arr.length) return [arr];
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  /* ─── render ──────────────────────────────────────────────────────── */
  let lastIds = [];
  let lastChunks = [];
  let lastFmt = 'hex32';

  function renderPreview(ids) {
    const MAX = 500;
    const slice = ids.slice(0, MAX);
    const lines = slice.join('\n');
    els.output.textContent = ids.length > MAX
      ? lines + `\n\n… ${ids.length - MAX} more (download to view all)`
      : lines;
    els.outputWrap.hidden = false;
  }

  function renderFiles(chunks, fmt) {
    els.files.innerHTML = '';
    if (chunks.length <= 1) {
      els.filesWrap.hidden = true;
      return;
    }
    const stamp = new Date().toISOString().slice(0, 10);
    chunks.forEach((chunk, i) => {
      const name = `devices_${fmt}_${stamp}_part${String(i + 1).padStart(3, '0')}.txt`;
      const blob = new Blob([chunk.join('\n') + '\n'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const size = (blob.size / 1024).toFixed(1) + ' KB';

      const row = document.createElement('div');
      row.className = 'file-item';
      row.innerHTML = `
        <span class="file-name">${name}</span>
        <span class="file-size">${size}</span>
        <a href="${url}" download="${name}">↓</a>
      `;
      els.files.appendChild(row);
    });
    els.filesWrap.hidden = false;
  }

  function updateStats(total, files, perFile, fmt) {
    els.stTotal.textContent = total.toLocaleString();
    els.stFiles.textContent = files;
    els.stPerFile.textContent = perFile;
    els.stFmt.textContent = fmt;
  }

  /* ─── toast ───────────────────────────────────────────────────────── */
  let toastEl = null;
  let toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  /* ─── actions ─────────────────────────────────────────────────────── */
  async function doGenerate() {
    const fmt   = els.format.value;
    const total = Math.max(1, Math.min(100000, parseInt(els.count.value, 10) || 0));
    const chunk = Math.max(1, Math.min(10000, parseInt(els.chunk.value, 10) || 0));

    els.gen.disabled = true;
    els.gen.textContent = 'generating…';

    const t0 = performance.now();
    const ids = await generateBatch(fmt, total, (done, tot) => {
      if (tot >= 20000 && done % 10000 === 0) {
        els.gen.textContent = `generating ${done.toLocaleString()}/${tot.toLocaleString()}…`;
      }
    });
    const dt = performance.now() - t0;

    const chunks = splitChunks(ids, chunk);

    lastIds = ids;
    lastChunks = chunks;
    lastFmt = fmt;

    renderPreview(ids);
    renderFiles(chunks, fmt);
    updateStats(total, chunks.length, chunks[0].length, fmt);
    els.outputLabel.textContent = `output · ${total.toLocaleString()} ids · ${dt.toFixed(0)}ms`;

    els.gen.disabled = false;
    els.gen.textContent = 'Generate';
    toast(`${total.toLocaleString()} ids generated`);
  }

  function doClear() {
    lastIds = [];
    lastChunks = [];
    els.output.textContent = '';
    els.outputWrap.hidden = true;
    els.files.innerHTML = '';
    els.filesWrap.hidden = true;
    updateStats(0, 0, 0, els.format.value);
    toast('cleared');
  }

  async function doCopyAll() {
    if (!lastIds.length) return;
    const text = lastIds.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      els.copyAll.classList.add('ok');
      toast(`copied ${lastIds.length.toLocaleString()} ids`);
      setTimeout(() => els.copyAll.classList.remove('ok'), 1200);
    } catch {
      // fallback: select pre + execCommand
      const range = document.createRange();
      range.selectNodeContents(els.output);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('copy');
      toast('copied (fallback)');
    }
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function doDownloadAll() {
    if (!lastIds.length) return;
    const stamp = new Date().toISOString().slice(0, 10);
    const name = `devices_${lastFmt}_${stamp}_${lastIds.length}.txt`;
    downloadBlob(new Blob([lastIds.join('\n') + '\n'], { type: 'text/plain' }), name);
    toast('downloaded .txt');
  }

  /* tiny zip writer — store only, no compression (device ids don't compress much) */
  function buildZip(files) {
    // files: [{name, content}]  → Uint8Array
    const enc = new TextEncoder();
    const entries = [];
    const centralDir = [];
    let offset = 0;

    // CRC32
    const crcTable = (() => {
      const t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        t[i] = c >>> 0;
      }
      return t;
    })();
    function crc32(buf) {
      let c = 0xffffffff;
      for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
      return (c ^ 0xffffffff) >>> 0;
    }

    function u16(v) { return [v & 0xff, (v >>> 8) & 0xff]; }
    function u32(v) { return [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff]; }

    const parts = [];
    for (const f of files) {
      const nameBuf = enc.encode(f.name);
      const dataBuf = enc.encode(f.content);
      const crc = crc32(dataBuf);
      const local = [];
      local.push(...u32(0x04034b50));
      local.push(...u16(20));        // version needed
      local.push(...u16(0));         // flags
      local.push(...u16(0));         // method: store
      local.push(...u16(0));         // mod time
      local.push(...u16(0));         // mod date
      local.push(...u32(crc));
      local.push(...u32(dataBuf.length));
      local.push(...u32(dataBuf.length));
      local.push(...u16(nameBuf.length));
      local.push(...u16(0));
      const localHeader = new Uint8Array(local);
      parts.push(localHeader, nameBuf, dataBuf);

      const central = [];
      central.push(...u32(0x02014b50));
      central.push(...u16(20));      // version made by
      central.push(...u16(20));      // version needed
      central.push(...u16(0));
      central.push(...u16(0));
      central.push(...u16(0));
      central.push(...u16(0));
      central.push(...u32(crc));
      central.push(...u32(dataBuf.length));
      central.push(...u32(dataBuf.length));
      central.push(...u16(nameBuf.length));
      central.push(...u16(0));
      central.push(...u16(0));
      central.push(...u16(0));
      central.push(...u16(0));
      central.push(...u32(0));
      central.push(...u32(offset));
      centralDir.push({ header: new Uint8Array(central), nameBuf });

      offset += localHeader.length + nameBuf.length + dataBuf.length;
    }

    // central directory
    const cdOffset = offset;
    let cdSize = 0;
    for (const e of centralDir) {
      parts.push(e.header, e.nameBuf);
      cdSize += e.header.length + e.nameBuf.length;
    }

    const eocd = new Uint8Array([
      ...u32(0x06054b50),
      ...u16(0), ...u16(0),
      ...u16(files.length), ...u16(files.length),
      ...u32(cdSize), ...u32(cdOffset),
      ...u16(0),
    ]);
    parts.push(eocd);

    // concat
    const totalLen = parts.reduce((n, p) => n + p.length, 0);
    const out = new Uint8Array(totalLen);
    let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
  }

  function doDownloadZip() {
    if (!lastChunks.length) return;
    const stamp = new Date().toISOString().slice(0, 10);
    const files = lastChunks.map((chunk, i) => ({
      name: `devices_${lastFmt}_${stamp}_part${String(i + 1).padStart(3, '0')}.txt`,
      content: chunk.join('\n') + '\n',
    }));
    const zip = buildZip(files);
    downloadBlob(new Blob([zip], { type: 'application/zip' }),
                 `devices_${lastFmt}_${stamp}.zip`);
    toast(`zipped ${files.length} files`);
  }

  /* ─── wire ────────────────────────────────────────────────────────── */
  els.gen.addEventListener('click', doGenerate);
  els.clear.addEventListener('click', doClear);
  els.copyAll.addEventListener('click', doCopyAll);
  els.downloadAll.addEventListener('click', doDownloadAll);
  els.downloadZip.addEventListener('click', doDownloadZip);

  els.format.addEventListener('change', () => {
    els.stFmt.textContent = els.format.value;
  });

  els.count.addEventListener('keydown', e => { if (e.key === 'Enter') doGenerate(); });

  // Ctrl/Cmd+Enter from anywhere → generate
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') doGenerate();
  });

  // first paint
  updateStats(0, 0, 0, els.format.value);

  console.log(
    '%c ASHER %c device id generator ',
    'background:#7c5cff;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:700;',
    'background:#14141d;color:#9a9aab;padding:4px 8px;border-radius:0 4px 4px 0;'
  );
})();