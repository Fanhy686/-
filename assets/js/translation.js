/* 翻译模块逻辑 */
(function () {
  const DATA = window.TRANSLATION || [];
  const done = new Set(Store.get('transDone', []));

  function render() {
    document.getElementById('transCards').innerHTML = DATA.map((m, i) => {
      const isDone = done.has(i);
      return `<div class="card" data-i="${i}" style="margin-bottom:16px">
        <div class="row"><span class="c-ico">${isDone ? '✅' : '🌐'}</span><strong>${m.title}</strong>
          <span class="spacer"></span>
          <button class="btn sm" data-act="show" data-i="${i}">🔍 显示参考</button>
          <button class="btn sm ghost" data-act="done" data-i="${i}">${isDone ? '↺ 取消完成' : '✅ 标记完成'}</button>
        </div>
        <div style="margin-top:10px;background:rgba(31,42,68,.04);border-radius:10px;padding:14px;font-size:15px;line-height:1.85">${m.cn}</div>
        <div class="ref" id="ref-${i}" style="display:none;margin-top:10px">
          <div style="white-space:pre-wrap;background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px;font-size:14.5px;line-height:1.85">${m.en}</div>
          <div style="margin-top:10px"><b>🔑 重点表达：</b>${m.keys.map(k => `<span class="tag">${k}</span>`).join('')}</div>
        </div>
      </div>`;
    }).join('');

    document.querySelectorAll('[data-act="show"]').forEach(b => b.onclick = () => {
      const ref = document.getElementById('ref-' + b.dataset.i);
      const show = ref.style.display === 'none';
      ref.style.display = show ? 'block' : 'none';
      b.textContent = show ? '🙈 隐藏参考' : '🔍 显示参考';
    });
    document.querySelectorAll('[data-act="done"]').forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (done.has(i)) done.delete(i); else done.add(i);
      Store.set('transDone', [...done]); render(); toast(done.has(i) ? '已标记完成' : '已取消');
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
