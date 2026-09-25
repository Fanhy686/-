/* 翻译模块逻辑：标题列表 → 点开进入子界面（自己译 → 本机估分 → 参考答案） */
(function () {
  const DATA = window.TRANSLATION || [];
  const done = new Set(Store.get('transDone', []));
  const drafts = Store.get('transDrafts', {}) || {};
  let current = -1;

  function reportHTML(r) { return window.Scorer.reportHTML(r); }
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ---------- 列表：只显示标题 ---------- */
  function renderList() {
    const listSec = document.getElementById('listSec');
    if (listSec) listSec.style.display = '';
    document.getElementById('transCards').innerHTML = DATA.map((m, i) => {
      const isDone = done.has(i);
      const chars = (m.cn || '').length;
      return `<div class="card link" data-i="${i}" style="${isDone ? 'border-color:rgba(46,125,87,.5)' : ''}">
        <div class="row">
          <span class="c-ico">${isDone ? '✅' : '🌐'}</span>
          <div style="flex:1;min-width:0">
            <div class="c-title" style="margin:0">${m.title}</div>
            <div style="margin-top:4px">${(m.keys || []).slice(0, 3).map(k => `<span class="tag">${k}</span>`).join('')}</div>
          </div>
          <span class="tag">${chars} 汉字</span>
          ${isDone ? '<span class="pill">已完成</span>' : '<span class="tag">待练</span>'}
        </div>
      </div>`;
    }).join('');
    document.querySelectorAll('#transCards .card').forEach(c => {
      c.onclick = () => { current = +c.dataset.i; renderDetail(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    });
  }

  /* ---------- 子界面：做题 ---------- */
  function renderDetail() {
    const box = document.getElementById('detail');
    const listSec = document.getElementById('listSec');
    if (current < 0) { box.innerHTML = ''; if (listSec) listSec.style.display = ''; return; }
    if (listSec) listSec.style.display = 'none';

    const i = current;
    const m = DATA[i];
    const isDone = done.has(i);

    box.innerHTML = `
      <div class="sub-bar">
        <button class="btn sm ghost" id="backBtn">↩️ 返回列表</button>
        <span class="spacer"></span>
        <span class="pill">第 ${i + 1} / ${DATA.length} 段</span>
      </div>

      <div class="card">
        <div class="row"><span class="c-ico">🌐</span><strong>${m.title}</strong>
          <span class="spacer"></span>
          <button class="btn sm ghost" id="doneBtn">${isDone ? '↺ 取消完成' : '✅ 标记完成'}</button>
        </div>
        <div class="note" style="margin-top:10px">📌 先划出「文化专有词」，再整段译成英文；译完全文、不增不减。</div>
        <div style="margin-top:10px;background:rgba(31,42,68,.04);border-radius:10px;padding:14px;font-size:15px;line-height:1.85">${m.cn}</div>
      </div>

      <div class="card" style="margin-top:14px">
        <div class="row"><span class="c-ico">✏️</span><strong>你的译文</strong>
          <span class="spacer"></span><span class="muted" id="tcount">${(drafts[i] || '').trim() ? (drafts[i] || '').trim().split(/\s+/).length + ' 词' : '0 词'}</span></div>
        <textarea id="tin" placeholder="先自己译成英文，再点「🤖 AI 估分」…" style="min-height:150px;margin-top:10px">${esc(drafts[i] || '')}</textarea>
        <div class="row" style="margin-top:10px">
          <button class="btn" id="scoreBtn">🤖 AI 估分</button>
          <button class="btn sm ghost" id="showBtn">🔍 显示参考答案</button>
          <button class="btn sm ghost" id="clearBtn">🧹 清空</button>
          <span class="spacer"></span>
          <button class="btn sm ghost" id="prevBtn">⬅️ 上一段</button>
          <button class="btn sm ghost" id="nextBtn">下一段 ➡️</button>
        </div>
        <div id="trep"></div>
        <div class="ref" id="ref" style="display:none;margin-top:12px">
          <div style="white-space:pre-wrap;background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px;font-size:14.5px;line-height:1.85">${m.en}</div>
          <div style="margin-top:10px"><b>🔑 重点表达：</b>${(m.keys || []).map(k => `<span class="tag">${k}</span>`).join('')}</div>
        </div>
      </div>`;

    const ta = document.getElementById('tin');
    ta.addEventListener('input', () => {
      const v = ta.value.trim();
      document.getElementById('tcount').textContent = v ? v.split(/\s+/).length + ' 词' : '0 词';
    });

    const back = () => { current = -1; renderDetail(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    document.getElementById('backBtn').onclick = back;
    document.getElementById('doneBtn').onclick = (e) => {
      if (done.has(i)) done.delete(i); else done.add(i);
      Store.set('transDone', [...done]);
      e.target.textContent = done.has(i) ? '↺ 取消完成' : '✅ 标记完成';
      toast(done.has(i) ? '已标记完成' : '已取消');
    };
    document.getElementById('scoreBtn').onclick = () => {
      const val = ta.value.trim();
      if (val.length < 5) { toast('先写点内容再估分哦'); return; }
      drafts[i] = ta.value; Store.set('transDrafts', drafts);
      const r = window.Scorer.scoreTranslation(val, m);
      document.getElementById('trep').innerHTML = reportHTML(r);
      const ref = document.getElementById('ref');
      ref.style.display = 'block';
      document.getElementById('showBtn').textContent = '🙈 隐藏参考答案';
      done.add(i); Store.set('transDone', [...done]);
      toast(`估分完成：${r.score}/15 · ${r.band}`);
      window.scrollTo({ top: document.getElementById('trep').offsetTop - 80, behavior: 'smooth' });
    };
    document.getElementById('showBtn').onclick = (e) => {
      const ref = document.getElementById('ref');
      const show = ref.style.display === 'none';
      ref.style.display = show ? 'block' : 'none';
      e.target.textContent = show ? '🙈 隐藏参考答案' : '🔍 显示参考答案';
    };
    document.getElementById('clearBtn').onclick = () => {
      ta.value = '';
      document.getElementById('trep').innerHTML = '';
      document.getElementById('tcount').textContent = '0 词';
      delete drafts[i]; Store.set('transDrafts', drafts);
    };
    document.getElementById('prevBtn').onclick = () => { current = (i - 1 + DATA.length) % DATA.length; renderDetail(); window.scrollTo({ top: 0 }); };
    document.getElementById('nextBtn').onclick = () => { current = (i + 1) % DATA.length; renderDetail(); window.scrollTo({ top: 0 }); };
  }

  document.addEventListener('DOMContentLoaded', renderList);
})();
