/* 词汇本闪卡逻辑 */
(function () {
  const LIST = window.VOCAB || [];
  let mastered = new Set(Store.get('vocabMastered', []));
  let order = LIST.map((_, i) => i);
  let onlyUnmastered = false;
  let idx = 0;
  let flipped = false;

  function pool() {
    return onlyUnmastered ? order.filter(i => !mastered.has(LIST[i].w)) : order;
  }
  function render() {
    const p = pool();
    document.getElementById('vTotal').textContent = LIST.length;
    document.getElementById('vMastered').textContent = mastered.size;
    document.getElementById('vRemain').textContent = LIST.length - mastered.size;

    if (p.length === 0) {
      document.getElementById('fWord').textContent = onlyUnmastered ? '🎉 全部掌握！' : '词库为空';
      document.getElementById('fPh').textContent = '';
      document.getElementById('fPos').textContent = '';
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
  function next() { idx = (idx + 1); flipped = false; render(); }
  function prev() { idx = (idx - 1 + Math.max(pool().length, 1)) % Math.max(pool().length, 1); flipped = false; render(); }
  function know() {
    const p = pool(); if (p.length) mastered.add(LIST[p[idx]].w);
    save(); next();
  }
  function unknow() { next(); }

  document.addEventListener('DOMContentLoaded', () => {
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
    render();
  });
})();
