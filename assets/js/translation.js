/* 翻译模块逻辑：先自己译 → 本机估分 → 再看参考答案 */
(function () {
  const DATA = window.TRANSLATION || [];
  const done = new Set(Store.get('transDone', []));
  const drafts = Store.get('transDrafts', {}) || {};

  function pct(r) { return Math.round(r * 100); }

  function reportHTML(r) { return window.Scorer.reportHTML(r); }

  function render() {
    document.getElementById('transCards').innerHTML = DATA.map((m, i) => {
      const isDone = done.has(i);
      return `<div class="card" data-i="${i}" style="margin-bottom:18px">
        <div class="row"><span class="c-ico">${isDone ? '✅' : '🌐'}</span><strong>${m.title}</strong>
          <span class="spacer"></span>
          <button class="btn sm ghost" data-act="done" data-i="${i}">${isDone ? '↺ 取消完成' : '✅ 标记完成'}</button>
        </div>
        <div style="margin-top:10px;background:rgba(31,42,68,.04);border-radius:10px;padding:14px;font-size:15px;line-height:1.85">${m.cn}</div>

        <div style="margin-top:12px">
          <textarea id="tin-${i}" placeholder="先自己译成英文，再点「AI 估分」…" style="min-height:130px">${(drafts[i] || '').replace(/</g, '&lt;')}</textarea>
        </div>
        <div class="row" style="margin-top:10px">
          <button class="btn" data-act="score" data-i="${i}">🤖 AI 估分</button>
          <button class="btn sm ghost" data-act="show" data-i="${i}">🔍 显示参考答案</button>
          <button class="btn sm ghost" data-act="clear" data-i="${i}">🧹 清空</button>
          <span class="spacer"></span>
          <span class="muted" id="tcount-${i}">0 词</span>
        </div>

        <div id="trep-${i}"></div>

        <div class="ref" id="ref-${i}" style="display:none;margin-top:12px">
          <div style="white-space:pre-wrap;background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px;font-size:14.5px;line-height:1.85">${m.en}</div>
          <div style="margin-top:10px"><b>🔑 重点表达：</b>${m.keys.map(k => `<span class="tag">${k}</span>`).join('')}</div>
        </div>
      </div>`;
    }).join('');

    document.querySelectorAll('#transCards textarea').forEach(ta => {
      const i = ta.dataset.i || ta.id.replace('tin-', '');
      ta.addEventListener('input', () => {
        const n = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
        document.getElementById('tcount-' + i).textContent = n + ' 词';
      });
    });

    document.querySelectorAll('[data-act="score"]').forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      const ta = document.getElementById('tin-' + i);
      const val = ta.value.trim();
      if (val.length < 5) { toast('先写点内容再估分哦'); return; }
      drafts[i] = ta.value; Store.set('transDrafts', drafts);
      const r = window.Scorer.scoreTranslation(val, DATA[i]);
      document.getElementById('trep-' + i).innerHTML = reportHTML(r);
      const ref = document.getElementById('ref-' + i);
      ref.style.display = 'block';
      const sb = document.querySelector(`[data-act="show"][data-i="${i}"]`);
      if (sb) sb.textContent = '🙈 隐藏参考答案';
      done.add(i); Store.set('transDone', [...done]);
      toast(`估分完成：${r.score}/15 · ${r.band}`);
      window.scrollTo({ top: document.getElementById('trep-' + i).offsetTop - 80, behavior: 'smooth' });
    });

    document.querySelectorAll('[data-act="show"]').forEach(b => b.onclick = () => {
      const ref = document.getElementById('ref-' + b.dataset.i);
      const show = ref.style.display === 'none';
      ref.style.display = show ? 'block' : 'none';
      b.textContent = show ? '🙈 隐藏参考答案' : '🔍 显示参考答案';
    });

    document.querySelectorAll('[data-act="clear"]').forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      document.getElementById('tin-' + i).value = '';
      document.getElementById('trep-' + i).innerHTML = '';
      document.getElementById('tcount-' + i).textContent = '0 词';
      delete drafts[i]; Store.set('transDrafts', drafts);
    });

    document.querySelectorAll('[data-act="done"]').forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (done.has(i)) done.delete(i); else done.add(i);
      Store.set('transDone', [...done]); render(); toast(done.has(i) ? '已标记完成' : '已取消');
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
