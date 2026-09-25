/* 听力训练逻辑 */
(function () {
  const DATA = window.LISTENING || [];
  const done = new Set(Store.get('listeningDone', []));
  let current = -1;

  function renderCards() {
    document.getElementById('matCards').innerHTML = DATA.map((m, i) => {
      const isDone = done.has(i);
      return `<div class="card link" data-i="${i}" style="${isDone ? 'border-color:rgba(46,125,87,.5)' : ''}">
        <div class="c-ico">${isDone ? '✅' : '🎧'}</div>
        <div class="c-title">${m.title}</div>
        <div class="c-desc">${m.type}</div>
        <div style="margin-top:8px">${isDone ? '<span class="pill">已完成</span>' : '<span class="tag">待练</span>'}</div>
      </div>`;
    }).join('');
    document.querySelectorAll('#matCards .card').forEach(c => {
      c.onclick = () => { current = +c.dataset.i; renderDetail(); };
    });
  }

  function renderDetail() {
    const box = document.getElementById('detail');
    if (current < 0) { box.innerHTML = ''; return; }
    const m = DATA[current];
    const qs = m.questions.map((q, qi) => `
      <div class="q" id="lq-${qi}">
        <div class="q-top"><span class="badge">Q${qi + 1}</span><span>${q.q}</span></div>
        <div class="opts">
          ${q.opts.map((o, oi) => `<label class="opt" data-q="${qi}" data-o="${oi}"><input type="radio" name="lq${qi}" value="${oi}"> ${String.fromCharCode(65 + oi)}. ${o}</label>`).join('')}
        </div>
        <div class="exp" id="lex-${qi}"></div>
      </div>`).join('');

    box.innerHTML = `
      <div class="card" style="margin-top:18px">
        <div class="row"><span class="c-ico">🎧</span><strong>${m.title}</strong><span class="spacer"></span>
          <button class="btn sm ghost" id="toggleTrans">📜 显示文稿</button></div>
        <div class="note" style="margin-top:10px">💡 ${m.tip}</div>
        <pre id="transcript" style="display:none;white-space:pre-wrap;background:rgba(31,42,68,.04);border-radius:10px;padding:14px;font-size:14.5px;line-height:1.8">${m.transcript}</pre>
      </div>
      <h2 class="section-title"><span class="ico">❓</span>题目</h2>
      ${qs}
      <div class="row" style="margin-top:8px">
        <button class="btn" id="checkBtn">✅ 核对答案</button>
        <button class="btn ghost" id="backBtn">↩️ 返回列表</button>
        <span class="spacer"></span><span class="muted" id="lScore"></span>
      </div>`;

    const trans = document.getElementById('transcript');
    document.getElementById('toggleTrans').onclick = (e) => {
      const show = trans.style.display === 'none';
      trans.style.display = show ? 'block' : 'none';
      e.target.textContent = show ? '🙈 隐藏文稿' : '📜 显示文稿';
    };
    document.getElementById('checkBtn').onclick = () => {
      let correct = 0;
      m.questions.forEach((q, qi) => {
        const sel = document.querySelector(`input[name=lq${qi}]:checked`);
        const opts = document.querySelectorAll(`#lq-${qi} .opt`);
        opts.forEach(o => o.classList.remove('correct', 'wrong'));
        if (sel) {
          const oi = +sel.value;
          if (oi === q.ans) { opts[oi].classList.add('correct'); correct++; }
          else { opts[oi].classList.add('wrong'); opts[q.ans].classList.add('correct'); }
        } else {
          opts[q.ans].classList.add('correct');
        }
        const exp = document.getElementById('lex-' + qi);
        exp.innerHTML = `<b>答案：${String.fromCharCode(65 + q.ans)}</b> ｜ ${q.exp}`;
        exp.classList.add('show');
      });
      document.getElementById('lScore').textContent = `正确 ${correct}/${m.questions.length}`;
      done.add(current); Store.set('listeningDone', [...done]); renderCards();
      toast('已记录完成');
    };
    document.getElementById('backBtn').onclick = () => { current = -1; renderDetail(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  }

  document.addEventListener('DOMContentLoaded', renderCards);
})();
