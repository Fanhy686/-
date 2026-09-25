/* 词汇本闪卡逻辑（四级 + 六级，支持分级切换） */
(function () {
  const CET4 = (window.VOCAB || []).map(w => Object.assign({}, w, { lv: 4 }));
  const CET6 = [].concat(window.VOCAB6A || [], window.VOCAB6B || []).map(w => Object.assign({}, w, { lv: 6 }));
  const ALL = CET4.concat(CET6);

  let level = Store.get('vocabLevel', 'all');
  let LIST = ALL;
  let mastered = new Set(Store.get('vocabMastered', []));
  let order = [];
  let onlyUnmastered = false;
  let idx = 0;
  let flipped = false;

  function setLevel(lv) {
    level = lv;
    Store.set('vocabLevel', lv);
    LIST = lv === '4' ? CET4 : (lv === '6' ? CET6 : ALL);
    order = LIST.map((_, i) => i);
    idx = 0; flipped = false;
    document.querySelectorAll('[data-lv]').forEach(b => {
      b.className = 'btn sm' + (b.dataset.lv === lv ? '' : ' ghost');
    });
    render();
  }

  function pool() {
    return onlyUnmastered ? order.filter(i => !mastered.has(LIST[i].w)) : order;
  }

  function render() {
    const masteredHere = LIST.filter(w => mastered.has(w.w)).length;
    document.getElementById('vTotal').textContent = LIST.length;
    document.getElementById('vMastered').textContent = masteredHere;
    document.getElementById('vRemain').textContent = LIST.length - masteredHere;
    document.getElementById('libInfo').textContent =
      `全库 ${ALL.length} 词（四级 ${CET4.length} · 六级 ${CET6.length}）｜ 当前：${level === '4' ? '四级' : level === '6' ? '六级' : '全部'}`;

    const p = pool();
    if (p.length === 0) {
      document.getElementById('fWord').textContent = onlyUnmastered ? '🎉 全部掌握！' : '词库为空';
      document.getElementById('fPh').textContent = '';
      document.getElementById('fPos').textContent = '';
      document.getElementById('fLv').textContent = '';
      document.getElementById('fCn').style.display = 'none';
      document.getElementById('fEx').style.display = 'none';
      document.getElementById('posInfo').textContent = '';
      return;
    }
    if (idx >= p.length) idx = 0;
    const item = LIST[p[idx]];
    document.getElementById('fWord').textContent = item.w;
    document.getElementById('fPh').textContent = item.ph;
    document.getElementById('fPos').textContent = item.pos;
    document.getElementById('fLv').textContent = item.lv === 6 ? 'CET-6' : 'CET-4';
    document.getElementById('fLv').className = 'tag' + (item.lv === 6 ? ' lv6' : '');
    const cn = document.getElementById('fCn');
    const ex = document.getElementById('fEx');
    if (flipped) {
      cn.style.display = 'block'; cn.textContent = item.cn;
      ex.style.display = 'block'; ex.innerHTML = item.ex;
    } else {
      cn.style.display = 'none'; ex.style.display = 'none';
    }
    document.getElementById('posInfo').textContent = `第 ${idx + 1} / ${p.length} 张`;
  }

  function save() { Store.set('vocabMastered', [...mastered]); }
  function flip() { flipped = !flipped; render(); }
  function next() { idx = idx + 1; flipped = false; render(); }
  function prev() { idx = (idx - 1 + Math.max(pool().length, 1)) % Math.max(pool().length, 1); flipped = false; render(); }
  function know() { const p = pool(); if (p.length) mastered.add(LIST[p[idx]].w); save(); next(); }
  function unknow() { next(); }

  document.addEventListener('DOMContentLoaded', () => {
    order = LIST.map((_, i) => i);
    setLevel(level);
    document.getElementById('flipBtn').onclick = flip;
    document.getElementById('knowBtn').onclick = know;
    document.getElementById('unknowBtn').onclick = unknow;
    document.getElementById('prevBtn').onclick = prev;
    document.getElementById('flash').onclick = flip;
    document.getElementById('shuffleBtn').onclick = () => {
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      idx = 0; flipped = false; toast('已打乱顺序'); render();
    };
    document.getElementById('modeBtn').onclick = (e) => {
      onlyUnmastered = !onlyUnmastered; idx = 0; flipped = false;
      e.target.textContent = '👁️ 只看未掌握：' + (onlyUnmastered ? '开' : '关');
      render();
    };
    document.getElementById('resetBtn').onclick = () => {
      if (confirm('确定清空已掌握标记？')) { mastered = new Set(); save(); idx = 0; flipped = false; toast('已重置'); render(); }
    };
    document.querySelectorAll('[data-lv]').forEach(b => {
      b.onclick = () => setLevel(b.dataset.lv);
    });
  });
})();
