/* 自测逻辑：逐题即时反馈 */
(function () {
  const DATA = window.QUIZ || [];
  let order = DATA.map((_, i) => i);
  let idx = 0;
  let answered = 0;
  let correct = 0;
  const best = Store.get('quizBest', 0);

  function start() {
    idx = 0; answered = 0; correct = 0; order = DATA.map((_, i) => i);
    document.getElementById('qTotal').textContent = DATA.length;
    document.getElementById('qBest').textContent = best;
    document.getElementById('qNow').textContent = '0/' + DATA.length;
    render();
  }
  function render() {
    const box = document.getElementById('quizBox');
    if (idx >= DATA.length) {
      const finalScore = correct;
      if (finalScore > Store.get('quizBest', 0)) Store.set('quizBest', finalScore);
      document.getElementById('qBest').textContent = Math.max(finalScore, best);
      box.innerHTML = `<div class="card" style="text-align:center;padding:30px">
        <div class="c-ico">🎉</div>
        <div class="c-title" style="justify-content:center">本次得分 ${finalScore} / ${DATA.length}</div>
        <p class="c-desc">${finalScore === DATA.length ? '全对，太稳了！' : '错的地方回去看解析，下次冲满分。'}</p>
        <button class="btn" id="againBtn">🔁 再来一轮</button>
      </div>`;
      document.getElementById('againBtn').onclick = start;
      return;
    }
    const q = DATA[order[idx]];
    document.getElementById('qNow').textContent = (idx + 1) + '/' + DATA.length;
    box.innerHTML = `
      <div class="q" id="curQ">
        <div class="q-top"><span class="badge">${q.type}</span><span>第 ${idx + 1} 题：${q.q}</span></div>
        <div class="opts" id="curOpts">
          ${q.opts.map((o, oi) => `<label class="opt" data-o="${oi}"><input type="radio" name="cur" value="${oi}"> ${String.fromCharCode(65 + oi)}. ${o}</label>`).join('')}
        </div>
        <div class="exp" id="curExp"></div>
        <div class="row" style="margin-top:12px"><button class="btn" id="nextBtn" disabled>➡️ 下一题</button></div>
      </div>`;
    const opts = document.querySelectorAll('#curOpts .opt');
    opts.forEach(o => o.onclick = () => {
      if (document.getElementById('nextBtn').disabled === false) return;
      const oi = +o.dataset.o;
      opts.forEach(x => x.classList.remove('correct', 'wrong'));
      if (oi === q.ans) { o.classList.add('correct'); correct++; }
      else { o.classList.add('wrong'); opts[q.ans].classList.add('correct'); }
      answered++;
      const exp = document.getElementById('curExp');
      exp.innerHTML = `<b>答案：${String.fromCharCode(65 + q.ans)}</b> ｜ ${q.exp}`;
      exp.classList.add('show');
      document.getElementById('nextBtn').disabled = false;
    });
    document.getElementById('nextBtn').onclick = () => { idx++; render(); };
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('shuffleBtn').onclick = () => {
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      idx = 0; answered = 0; correct = 0; toast('已打乱'); render();
      document.getElementById('qNow').textContent = '1/' + DATA.length;
    };
    document.getElementById('restartBtn').onclick = start;
    start();
  });
})();
