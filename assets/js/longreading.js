/* 长篇阅读（段落信息匹配）逻辑：列表只显示标题 → 子界面做题 → 核对 + 解析 + 段落定位 */
(function () {
  const DATA = [].concat(
    window.LR1 || [], window.LR2 || [], window.LR3 || [], window.LR4 || [], window.LR5 || []
  );
  let done = new Set((Store.get('lrDone', []) || []).filter(x => typeof x === 'string'));
  let current = -1;

  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function letterOf(passage, i) { return String.fromCharCode(65 + i); }
  function wordCount(p) { return (p.paras || []).join(' ').split(/\s+/).filter(Boolean).length; }

  /* ---------- 列表 ---------- */
  function renderList() {
    const listSec = document.getElementById('listSec');
    if (listSec) listSec.style.display = '';
    document.getElementById('matCards').innerHTML = DATA.map((m, i) => {
      const isDone = done.has(m.title);
      return `<div class="card link" data-i="${i}" style="${isDone ? 'border-color:rgba(46,125,87,.5)' : ''}">
        <div class="row" style="align-items:flex-start">
          <span class="c-ico">${isDone ? '✅' : '🗞️'}</span>
          <div style="flex:1;min-width:0">
            <div class="c-title" style="margin:0">${esc(m.title)}</div>
            <div class="c-desc">${esc(m.topic || '')}</div>
            <div style="margin-top:8px">
              <span class="tag">约 ${wordCount(m)} 词</span>
              <span class="tag">${(m.paras || []).length} 段</span>
              <span class="tag">${(m.questions || []).length} 题</span>
              ${isDone ? '<span class="pill">已完成</span>' : '<span class="tag">待练</span>'}
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
    document.querySelectorAll('#matCards .card').forEach(c => {
      c.onclick = () => { current = +c.dataset.i; renderDetail(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    });
  }

  /* ---------- 子界面 ---------- */
  function renderDetail() {
    const box = document.getElementById('detail');
    const listSec = document.getElementById('listSec');
    if (current < 0) { box.innerHTML = ''; if (listSec) listSec.style.display = ''; return; }
    if (listSec) listSec.style.display = 'none';

    const m = DATA[current];
    const n = (m.paras || []).length;
    const letters = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
    const opts = letters.map(l => `<option value="${l}">${l}</option>`).join('');

    const paras = (m.paras || []).map((p, i) => `
      <p class="lr-para" id="lrp-${i}"><span class="lr-tag">${letters[i]}</span>${esc(p)}</p>`).join('');

    const qs = (m.questions || []).map((q, qi) => `
      <div class="lr-q" id="lrq-${qi}">
        <div class="lr-q-top">
          <span class="badge">Q${qi + 1}</span>
          <span class="lr-q-txt">${esc(q.q)}</span>
          <select class="lr-sel" id="lrs-${qi}" aria-label="第 ${qi + 1} 题选择段落">
            <option value="">选段</option>${opts}
          </select>
        </div>
        <div class="lr-exp" id="lre-${qi}"></div>
      </div>`).join('');

    box.innerHTML = `
      <div class="sub-bar">
        <button class="btn sm ghost" id="backBtn">↩️ 返回列表</button>
        <span class="spacer"></span>
        <span class="pill">第 ${current + 1} / ${DATA.length} 篇</span>
      </div>

      <div class="card">
        <div class="row"><span class="c-ico">🗞️</span><strong>${esc(m.title)}</strong>
          <span class="spacer"></span><span class="tag">约 ${wordCount(m)} 词</span></div>
        <div class="note" style="margin-top:10px">💡 ${esc(m.intro || '先看题目再扫读原文，答案多为同义替换。')}</div>
        <div class="lr-passage">${paras}</div>
      </div>

      <h2 class="section-title"><span class="ico">❓</span>段落信息匹配（10 题 · 建议 15 分钟）</h2>
      <div class="note" style="margin-top:0">🔎 每个陈述句只对应一个段落，一段最多用一次；有 5 个段落不会被用到。选好后点底部「✅ 核对答案」。</div>
      ${qs}

      <div class="row" style="margin-top:8px">
        <button class="btn" id="checkBtn">✅ 核对答案</button>
        <button class="btn ghost" id="retryBtn">🔄 重做本篇</button>
        <button class="btn ghost" id="backBtn2">↩️ 返回列表</button>
        <span class="spacer"></span><span class="muted" id="lrScore"></span>
      </div>`;

    const back = () => { current = -1; renderDetail(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    document.getElementById('backBtn').onclick = back;
    document.getElementById('backBtn2').onclick = back;

    document.getElementById('checkBtn').onclick = () => {
      let correct = 0;
      (m.questions || []).forEach((q, qi) => {
        const sel = document.getElementById('lrs-' + qi);
        const wrap = document.getElementById('lrq-' + qi);
        const exp = document.getElementById('lre-' + qi);
        const chosen = (sel.value || '').toUpperCase();
        const right = String(q.ans || '').toUpperCase();
        wrap.classList.remove('ok', 'no');
        if (chosen === right) { correct++; wrap.classList.add('ok'); }
        else wrap.classList.add('no');
        const pi = right.charCodeAt(0) - 65;
        exp.innerHTML = `<b>答案：${right}</b>${chosen && chosen !== right ? `（你选 ${chosen}）` : ''} ｜ ${esc(q.exp || '')}
          <button class="btn sm ghost lr-loc" data-p="${pi}">📍 定位 ${right} 段</button>`;
        exp.classList.add('show');
      });
      document.getElementById('lrScore').textContent = `正确 ${correct}/${(m.questions || []).length}`;
      done.add(m.title); Store.set('lrDone', [...done]);
      document.querySelectorAll('.lr-loc').forEach(b => b.onclick = () => {
        const p = document.getElementById('lrp-' + b.dataset.p);
        if (!p) return;
        try { p.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
        p.classList.add('flash');
        setTimeout(() => p.classList.remove('flash'), 1600);
      });
      toast(`核对完成：${correct}/${(m.questions || []).length}`);
      renderList();
    };

    document.getElementById('retryBtn').onclick = () => {
      document.querySelectorAll('.lr-sel').forEach(s => { s.value = ''; });
      document.querySelectorAll('.lr-q').forEach(w => w.classList.remove('ok', 'no'));
      document.querySelectorAll('.lr-exp').forEach(e => { e.classList.remove('show'); e.innerHTML = ''; });
      document.getElementById('lrScore').textContent = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!DATA.length) {
      document.getElementById('matCards').innerHTML = '<div class="note">篇目加载中…如长期空白，请刷新页面。</div>';
      return;
    }
    renderList();
  });
})();
