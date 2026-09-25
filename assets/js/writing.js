/* 写作模块逻辑：模板板块 + 练习板块（写 → 估分 → 范文） */
(function () {
  const D = window.WRITING || {};
  const topics = D.topics || [];
  let topicIdx = 0;
  let scored = false;

  /* ---------- 模板板块：列表（只显示标题）→ 子界面 ---------- */
  function openDetail(title, ico, html) {
    document.getElementById('tabTpl').style.display = 'none';
    const box = document.getElementById('tplDetail');
    box.style.display = 'block';
    box.innerHTML = `
      <div class="sub-bar">
        <button class="btn sm ghost" id="tplBack">↩️ 返回模板列表</button>
        <span class="spacer"></span><span class="pill">${ico} ${title}</span>
      </div>
      <div class="card">${html}</div>`;
    document.getElementById('tplBack').onclick = closeDetail;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function closeDetail() {
    const box = document.getElementById('tplDetail');
    box.style.display = 'none';
    box.innerHTML = '';
    document.getElementById('tabTpl').style.display = 'block';
  }

  function renderTpl() {
    document.getElementById('structCards').innerHTML = (D.structure || []).map((s, i) => `
      <div class="card link" data-s="${i}">
        <div class="row"><span class="c-ico">📐</span><div style="flex:1;min-width:0">
          <div class="c-title" style="margin:0">${s.part}</div>
          <div class="c-desc">点击看写法 + 示例</div>
        </div></div>
      </div>`).join('');
    document.querySelectorAll('#structCards .card').forEach(c => c.onclick = () => {
      const s = D.structure[+c.dataset.s];
      openDetail(s.part, '📐', `
        <div class="row"><span class="c-ico">📐</span><strong>${s.part}</strong></div>
        <p class="c-desc" style="margin-top:10px">${s.tip}</p>
        <div class="note">${s.sample}</div>`);
    });

    document.getElementById('sentCards').innerHTML = (D.sentences || []).map((g, i) => `
      <div class="card link" data-g="${i}">
        <div class="row"><span class="c-ico">💬</span><div style="flex:1;min-width:0">
          <div class="c-title" style="margin:0">${g.label}</div>
          <div class="c-desc">${g.items.length} 句 · 点击展开</div>
        </div></div>
      </div>`).join('');
    document.querySelectorAll('#sentCards .card').forEach(c => c.onclick = () => {
      const g = D.sentences[+c.dataset.g];
      openDetail(g.label, '💬', `
        <div class="row"><span class="c-ico">💬</span><strong>${g.label}</strong></div>
        <div style="margin-top:8px">${g.items.map(t => `<div style="padding:6px 0;border-bottom:1px dashed var(--line)">${t}</div>`).join('')}</div>`);
    });

    document.getElementById('linkCard').innerHTML = (D.linking || []).map(w => `<span class="tag">${w}</span>`).join('');

    document.getElementById('critCards').innerHTML = (D.criteria || []).map(c => `
      <div class="card"><div class="c-ico">⭐</div><div class="c-title">${c.score}</div><p class="c-desc">${c.desc}</p></div>`).join('');
  }

  /* ---------- 练习板块 ---------- */
  function renderTopics() {
    const sel = document.getElementById('topicSel');
    sel.innerHTML = topics.map((t, i) => `<option value="${i}">${t.title}</option>`).join('');
    sel.onchange = () => {
      topicIdx = +sel.value;
      scored = false;
      document.getElementById('wrep').innerHTML = '';
      document.getElementById('wsample').style.display = 'none';
      document.getElementById('sampleBtn').disabled = true;
      renderTopicBox();
    };
    renderTopicBox();
  }

  function renderTopicBox() {
    const t = topics[topicIdx] || {};
    document.getElementById('topicBox').innerHTML = `
      <div style="background:rgba(31,42,68,.04);border-radius:10px;padding:14px;font-size:14.5px;line-height:1.85">${t.dir || ''}</div>
      <div style="margin-top:10px"><b>🧩 要点提示：</b>${(t.points || []).map(p => `<span class="tag">${p}</span>`).join('')}</div>
      <div style="margin-top:8px"><b>🔑 主题关键词：</b>${(t.keywords || []).map(k => `<span class="tag">${k}</span>`).join('')}</div>`;
  }

  function updateCount() {
    const txt = document.getElementById('draft').value.trim();
    const words = txt ? txt.split(/\s+/).length : 0;
    const paras = txt ? txt.split(/\n\s*\n/).filter(s => s.trim()).length : 0;
    document.getElementById('wcount').textContent = `${words} 词 ｜ ${paras} 段`;
    const p = document.getElementById('pCheck');
    if (!words) p.textContent = '未检查';
    else if (words >= 120 && words <= 180 && paras >= 3) p.textContent = '✅ 三段式 + 字数达标';
    else p.textContent = `⚠️ 词数 ${words}（建议 120–180），段落 ${paras}`;
  }

  function reportHTML(r) { return window.Scorer.reportHTML(r); }

  document.addEventListener('DOMContentLoaded', () => {
    renderTpl();
    renderTopics();

    const ta = document.getElementById('draft');
    const saved = Store.get('writingDraft', '');
    if (saved) ta.value = saved;
    updateCount();
    ta.addEventListener('input', updateCount);

    document.getElementById('scoreBtn').onclick = () => {
      const val = ta.value.trim();
      if (val.split(/\s+/).length < 20) { toast('至少写 20 词再估分哦'); return; }
      const r = window.Scorer.scoreWriting(val, topics[topicIdx]);
      document.getElementById('wrep').innerHTML = reportHTML(r);
      scored = true;
      document.getElementById('sampleBtn').disabled = false;
      let n = Store.get('writingCount', 0) + 1;
      Store.set('writingCount', n);
      Store.set('writingDraft', ta.value);
      toast(`估分完成：${r.score}/15 · ${r.band}`);
      window.scrollTo({ top: document.getElementById('wrep').offsetTop - 80, behavior: 'smooth' });
    };

    document.getElementById('sampleBtn').onclick = () => {
      const t = topics[topicIdx] || {};
      const box = document.getElementById('wsample');
      box.style.display = 'block';
      box.innerHTML = `<div class="card" style="border-color:rgba(46,125,87,.45)">
        <div class="row"><span class="c-ico">📝</span><strong>参考范文 · ${t.title || ''}</strong></div>
        <div style="white-space:pre-wrap;margin-top:10px;font-size:14.5px;line-height:1.9">${t.sample || ''}</div>
        <div class="muted" style="font-size:12.5px;margin-top:10px">对照看：结构是否三段、衔接词用了几个、从句在哪、主题词是否贯穿全篇。</div>
      </div>`;
      window.scrollTo({ top: box.offsetTop - 80, behavior: 'smooth' });
    };

    document.getElementById('saveBtn').onclick = () => {
      Store.set('writingDraft', ta.value);
      toast('草稿已保存到本机');
    };
    document.getElementById('clearBtn').onclick = () => {
      if (confirm('清空当前练习区？')) {
        ta.value = ''; Store.del('writingDraft');
        document.getElementById('wrep').innerHTML = '';
        document.getElementById('wsample').style.display = 'none';
        document.getElementById('sampleBtn').disabled = true;
        updateCount();
      }
    };

    const tplBtn = document.getElementById('tabTplBtn');
    const pracBtn = document.getElementById('tabPracBtn');
    function showTpl() {
      closeDetail();
      document.getElementById('tabTpl').style.display = 'block';
      document.getElementById('tabPrac').style.display = 'none';
      tplBtn.className = 'btn'; pracBtn.className = 'btn ghost';
    }
    function showPrac() {
      closeDetail();
      document.getElementById('tabTpl').style.display = 'none';
      document.getElementById('tabPrac').style.display = 'block';
      pracBtn.className = 'btn'; tplBtn.className = 'btn ghost';
      updateCount();
    }
    tplBtn.onclick = showTpl;
    pracBtn.onclick = showPrac;
  });
})();
