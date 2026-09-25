/* ===== 全站悬浮查词球 =====
   点击 🔍 小圆球 → 弹出迷你查词面板：输入英文（或中文意思）即时查释义。
   词库（5000+ 词）首次打开时才按需加载，不影响页面初始速度。 */
(function () {
  /* 词库文件 → 全局变量名 */
  const FILES = [
    ['assets/js/vocab-data.js', 'VOCAB'],
    ['assets/js/vocab-data-cet4b.js', 'VOCAB4B'],
    ['assets/js/vocab-data-cet6a.js', 'VOCAB6A'],
    ['assets/js/vocab-data-cet6b.js', 'VOCAB6B'],
    ['assets/js/vocab-data-cet6c.js', 'VOCAB6C'],
    ['assets/js/vocab-data-ext1.js', 'VOCABX1'],
    ['assets/js/vocab-data-ext2.js', 'VOCABX2'],
    ['assets/js/vocab-data-ext3.js', 'VOCABX3'],
    ['assets/js/vocab-data-ext4.js', 'VOCABX4'],
    ['assets/js/vocab-data-ext5.js', 'VOCABX5'],
    ['assets/js/vocab-data-ext6.js', 'VOCABX6'],
    ['assets/js/vocab-data-ext7.js', 'VOCABX7'],
    ['assets/js/vocab-data-ext8.js', 'VOCABX8'],
    ['assets/js/vocab-data-ext9.js', 'VOCABX9'],
  ];

  let INDEX = null;      // Map: word -> entry
  let WORDS = null;      // 排序后的词条数组
  let loading = false;

  function loadDict(cb) {
    if (INDEX) { cb(); return; }
    if (loading) { return; }
    loading = true;
    const pending = FILES.filter(f => !window[f[1]]);
    let left = pending.length;
    const done = () => {
      if (--left > 0) return;
      build(); loading = false;
      if (cb) cb();
    };
    if (!left) { build(); loading = false; if (cb) cb(); return; }
    pending.forEach(f => {
      const s = document.createElement('script');
      s.src = f[0];
      s.onload = done; s.onerror = done;
      document.head.appendChild(s);
    });
  }

  function build() {
    INDEX = new Map();
    FILES.forEach(f => {
      const arr = window[f[1]] || [];
      for (const e of arr) {
        const w = String(e.w || '').trim().toLowerCase();
        if (!w || INDEX.has(w)) continue;
        INDEX.set(w, e);
      }
    });
    WORDS = [...INDEX.keys()].sort();
  }

  /* ---------- 界面 ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  const hasCJK = s => /[\u4e00-\u9fa5]/.test(s);

  function search(q) {
    q = String(q || '').trim().toLowerCase();
    if (!q) return [];
    if (hasCJK(q)) {
      const out = [];
      for (const [w, e] of INDEX) {
        if ((e.cn || '').indexOf(q) >= 0) { out.push(e); if (out.length >= 40) break; }
      }
      return out;
    }
    const exact = [], prefix = [], sub = [];
    for (const w of WORDS) {
      if (w === q) exact.push(INDEX.get(w));
      else if (w.startsWith(q)) { if (prefix.length < 40) prefix.push(INDEX.get(w)); }
      else if (sub.length < 20 && w.indexOf(q) > 0) sub.push(INDEX.get(w));
      if (exact.length && prefix.length >= 40 && sub.length >= 20) break;
    }
    return exact.concat(prefix, sub).filter(Boolean);
  }

  function entryHTML(e) {
    const tagCls = e._lv === '6' ? ' lv6' : (e._lv === 'x' ? ' lvx' : '');
    const tagTxt = e._lv === '6' ? 'CET-6' : (e._lv === 'x' ? '进阶' : 'CET-4');
    return `<div class="db-entry">
      <div class="row" style="align-items:baseline;gap:8px">
        <b class="dbw">${esc(e.w)}</b>
        <span class="muted" style="font-size:13px">${esc(e.ph || '')}</span>
        <span class="tag${tagCls}">${tagTxt}</span>
      </div>
      <div style="margin-top:4px"><span class="pos">${esc(e.pos || '')}</span> <b>${esc(e.cn || '')}</b></div>
      ${e.ex ? `<div class="dbex">${e.ex}</div>` : ''}
      <div class="row" style="margin-top:8px">
        <button class="btn sm ghost" data-db="speak">🔊 发音</button>
        <button class="btn sm ghost" data-db="copy">📋 复制</button>
        <a class="btn sm ghost" target="_blank" rel="noopener"
           href="https://dict.youdao.com/result?word=${encodeURIComponent(e.w)}&lang=en">🌐 在线详查</a>
      </div>
    </div>`;
  }

  /* 给词条打上等级标记（只在构建时算一次） */
  function ensureLv() {
    if (!INDEX) return;
    FILES.forEach(f => {
      const lv = /VOCABX/.test(f[1]) ? 'x' : (/6/.test(f[1]) ? '6' : '4');
      (window[f[1]] || []).forEach(e => { const k = String(e.w || '').trim().toLowerCase(); const it = INDEX.get(k); if (it && !it._lv) it._lv = lv; });
    });
  }

  function boot() {
    const ball = document.createElement('button');
    ball.className = 'db-ball';
    ball.type = 'button';
    ball.title = '查单词（悬浮球）';
    ball.setAttribute('aria-label', '查单词');
    ball.innerHTML = '🔍';

    const panel = document.createElement('div');
    panel.className = 'db-panel';
    panel.innerHTML = `
      <div class="db-head">
        <span>🔍 随身查词</span>
        <span class="spacer"></span>
        <button class="db-x" type="button" aria-label="关闭">✕</button>
      </div>
      <div class="db-body">
        <input type="text" id="dbInput" placeholder="输入单词或中文意思…" autocomplete="off" autocapitalize="off" spellcheck="false">
        <div id="dbOut" class="db-out"></div>
      </div>`;
    document.body.appendChild(ball);
    document.body.appendChild(panel);

    const input = panel.querySelector('#dbInput');
    const out = panel.querySelector('#dbOut');

    function openPanel() {
      panel.classList.add('open');
      ball.classList.add('active');
      const sel = (window.getSelection() || '').toString().trim();
      const pre = /^[A-Za-z][A-Za-z\-']*$/.test(sel) ? sel : '';
      input.value = pre;
      renderOut(pre || '');
      setTimeout(() => input.focus(), 30);
      loadDict(() => { ensureLv(); renderOut(input.value); });
    }
    function closePanel() {
      panel.classList.remove('open');
      ball.classList.remove('active');
    }

    function pushRecent(w) {
      const r = Store.get('dictRecent', []) || [];
      const n = [w].concat(r.filter(x => x !== w)).slice(0, 12);
      Store.set('dictRecent', n);
    }

    function renderOut(q) {
      if (!INDEX) {
        out.innerHTML = `<div class="db-tip">正在加载词库（5000+ 词）…</div>`;
        return;
      }
      ensureLv();
      if (!q) {
        const r = Store.get('dictRecent', []) || [];
        out.innerHTML = r.length
          ? `<div class="db-tip">最近查过（点一下再看）</div>` + r.map(w => `<span class="db-chip" data-w="${esc(w)}">${esc(w)}</span>`).join('')
          : `<div class="db-tip">输入英文单词查释义；也可以输入中文反查（如「重要的」）。<br>选中页面上的单词后再点小球，会自动填入。</div>`;
        return;
      }
      const list = search(q);
      if (!list.length) {
        out.innerHTML = `<div class="db-tip">词库未收录「${esc(q)}」。</div>
          <a class="btn sm" target="_blank" rel="noopener"
             href="https://dict.youdao.com/result?word=${encodeURIComponent(q)}&lang=en">🌐 联网查这个词</a>`;
        return;
      }
      const head = list[0];
      pushRecent(head.w);
      const rest = list.slice(1, 12);
      out.innerHTML = entryHTML(head)
        + (rest.length ? `<div class="db-tip" style="margin-top:10px">相关词</div>` + rest.map(e => `<span class="db-chip" data-w="${esc(e.w)}">${esc(e.w)}</span>`).join('') : '');
    }

    panel.querySelector('.db-x').onclick = closePanel;
    ball.onclick = () => { panel.classList.contains('open') ? closePanel() : openPanel(); };
    input.addEventListener('input', () => renderOut(input.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { renderOut(input.value); }
      if (e.key === 'Escape') closePanel();
    });
    out.addEventListener('click', e => {
      const chip = e.target.closest('.db-chip');
      if (chip) { input.value = chip.dataset.w; renderOut(input.value); input.focus(); return; }
      const b = e.target.closest('[data-db]');
      if (!b) return;
      const word = out.querySelector('.dbw');
      const w = word ? word.textContent : input.value.trim();
      if (b.dataset.db === 'speak') {
        if (!window.speechSynthesis) { toast('当前浏览器不支持发音'); return; }
        const u = new SpeechSynthesisUtterance(w);
        u.lang = 'en-US';
        const v = (speechSynthesis.getVoices() || []).find(v => /^en/i.test(v.lang));
        if (v) u.voice = v;
        u.rate = 0.9;
        speechSynthesis.speak(u);
      } else if (b.dataset.db === 'copy') {
        const txt = (out.querySelector('.db-entry') || {}).innerText || w;
        if (navigator.clipboard) navigator.clipboard.writeText(String(txt).split('\n')[0] + ' ' + w).then(() => toast('已复制'), () => toast('复制失败'));
        else toast('当前浏览器不支持复制');
      }
    });
    document.addEventListener('click', e => {
      if (!panel.classList.contains('open')) return;
      if (panel.contains(e.target) || ball.contains(e.target)) return;
      closePanel();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
