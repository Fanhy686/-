/* 阅读训练逻辑 */
(function () {
  const DATA = window.READING || [];
  const done = new Set(Store.get('readingDone', []));
  let current = -1;

  function renderCards() {
    document.getElementById('matCards').innerHTML = DATA.map((m, i) => {
      const isDone = done.has(i);
      return `<div class="card link" data-i="${i}" style="${isDone ? 'border-color:rgba(46,125,87,.5)' : ''}">
        <div class="c-ico">${isDone ? '✅' : '📖'}</div>
        <div class="c-title">${m.type.split(' · ')[0]}</div>
        <div class="c-desc">${m.title}</div>
        <div style="margin-top:8px">${isDone ? '<span class="pill">已完成</span>' : '<span class="tag">待练</span>'}</div>
      </div>`;
    }).join('');
    document.querySelectorAll('#matCards .card').forEach(c => c.onclick = () => { current = +c.dataset.i; renderDetail(); });
  }

  function renderDetail() {
    const box = document.getElementById('detail');
    if (current < 0) { box.innerHTML = ''; return; }
    const m = DATA[current];
    const qs = m.questions.map((q, qi) => `
      <div class="q" id="rq-${qi}">
        <div class="q-top"><span class="badge">${q.kind === 'cloze' ? '填空' : (q.kind === 'match' ? '匹配' : 'Q' + (qi + 1))}</span><span>${q.q}</span></div>
        <div class="opts">
          ${q.opts.map((o, oi) => `<label class="opt" data-q="${qi}" data-o="${oi}"><input type="radio" name="rq${qi}" value="${oi}"> ${o}</label>`).join('')}
        </div>
        <div class="exp" id="rex-${qi}"></div>
      </div>`).join('');

    box.innerHTML = `
      <div class="card" style="margin-top:18px">
        <div class="row"><span class="c-ico">📄</span><strong>${m.title}</strong></div>
        <div class="note" style="margin-top:10px">💡 ${m.intro}</div>
        <div style="white-space:pre-wrap;background:rgba(31,42,68,.04);border-radius:10px;padding:16px;font-size:15px;line-height:1.9">${m.passage}</div>
        ${m.bank ? `<div style="margin-top:10px"><b>🧱 词库：</b>${m.bank.map(b => `<span class="tag">${b}</span>`).join('')}</div>` : ''}
      </div>
      <h2 class="section-title"><span class="ico">❓</span>题目</h2>
      ${qs}
      <div class="row" style="margin-top:8px">
        <button class="btn" id="checkBtn">✅ 核对答案</button>
        <button class="btn ghost" id="backBtn">↩️ 返回列表</button>
        <span class="spacer"></span><span class="muted" id="rScore"></span>
      </div>`;

    document.getElementById('checkBtn').onclick = () => {
      let correct = 0;
      m.questions.forEach((q, qi) => {
        const sel = document.querySelector(`input[name=rq${qi}]:checked`);
        const opts = document.querySelectorAll(`#rq-${qi} .opt`);
        opts.forEach(o => o.classList.remove('correct', 'wrong'));
        if (sel) {
          const oi = +sel.value;
          if (oi === q.ans) { opts[oi].classList.add('correct'); correct++; }
          else { opts[oi].classList.add('wrong'); opts[q.ans].classList.add('correct'); }
        } else { opts[q.ans].classList.add('correct'); }
        const exp = document.getElementById('rex-' + qi);
        exp.innerHTML = `<b>答案：${q.opts[q.ans]}</b> ｜ ${q.exp}`;
        exp.classList.add('show');
      });
      document.getElementById('rScore').textContent = `正确 ${correct}/${m.questions.length}`;
      done.add(current); Store.set('readingDone', [...done]); renderCards();
      toast('已记录完成');
    };
    document.getElementById('backBtn').onclick = () => { current = -1; renderDetail(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  }

  document.addEventListener('DOMContentLoaded', renderCards);
})();
