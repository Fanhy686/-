/* 写作模块逻辑 */
(function () {
  const D = window.WRITING || {};
  let count = Store.get('writingCount', 0);

  function render() {
    document.getElementById('structCards').innerHTML = (D.structure || []).map(s => `
      <div class="card"><div class="c-ico">📐</div><div class="c-title">${s.part}</div>
      <p class="c-desc">${s.tip}</p><div class="note" style="margin:0">${s.sample}</div></div>`).join('');

    document.getElementById('sentCards').innerHTML = (D.sentences || []).map(g => `
      <div class="card"><div class="c-ico">💬</div><div class="c-title">${g.label}</div>
      <div style="margin-top:6px">${g.items.map(t => `<div style="padding:5px 0;border-bottom:1px dashed var(--line)">${t}</div>`).join('')}</div></div>`).join('');

    document.getElementById('linkCard').innerHTML = (D.linking || []).map(w => `<span class="tag">${w}</span>`).join('');

    document.getElementById('critCards').innerHTML = (D.criteria || []).map(c => `
      <div class="card"><div class="c-ico">⭐</div><div class="c-title">${c.score}</div><p class="c-desc">${c.desc}</p></div>`).join('');

    document.getElementById('sampleCards').innerHTML = (D.samples || []).map(s => `
      <div class="card"><div class="c-ico">📝</div><div class="c-title">${s.title}</div>
      <div style="white-space:pre-wrap;margin-top:8px;font-size:14.5px;line-height:1.85">${s.en}</div></div>`).join('');

    const saved = Store.get('writingDraft', '');
    if (saved) document.getElementById('draft').value = saved;
    updateCount();
  }

  function updateCount() {
    const txt = document.getElementById('draft').value.trim();
    const words = txt ? txt.split(/\s+/).length : 0;
    const chars = document.getElementById('draft').value.length;
    document.getElementById('wcount').textContent = `词数：${words} ｜ 字符：${chars}`;
    const p = document.getElementById('pCheck');
    const paras = (txt.match(/\n\s*\n/g) || []).length + (txt ? 1 : 0);
    if (words >= 120 && words <= 180 && paras >= 3) p.textContent = '✅ 三段式 + 字数达标';
    else if (words === 0) p.textContent = '未检查三段式';
    else p.textContent = `⚠️ 词数 ${words}（建议 120–180），段落 ${paras}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    const ta = document.getElementById('draft');
    ta.addEventListener('input', updateCount);
    document.getElementById('countBtn').onclick = () => { updateCount(); toast('已统计'); };
    document.getElementById('saveBtn').onclick = () => {
      Store.set('writingDraft', ta.value);
      count++; Store.set('writingCount', count);
      toast('草稿已保存到本机');
    };
    document.getElementById('clearBtn').onclick = () => { if (confirm('清空当前练习区？')) { ta.value = ''; Store.del('writingDraft'); updateCount(); } };
  });
})();
