/* 阅读训练逻辑（仔细阅读 · 支持每日更新自动追加） */
(function () {
  const DAILY = window.READING_DAILY || { updated: '', passages: [] };
  const dailyList = (DAILY.passages || []).map(p => Object.assign({}, p, { daily: true, date: p.date || DAILY.updated }));
  const baseList = [].concat(window.READING || [], window.READING_EXTRA || [])
    .map(p => Object.assign({}, p, { daily: false }));
  // 每日更新排在最前（最新优先），其后是常驻篇目
  const DATA = dailyList.slice().reverse().concat(baseList);

  // 存「标题|日期」，避免因每日追加导致顺序变化而错位；旧版本存的是数字下标，直接丢弃重来
  const done = new Set((Store.get('readingDone', []) || []).filter(x => typeof x === 'string'));
  let current = -1;

  function keyOf(m) { return m.title + '|' + (m.date || ''); }
  function isDone(m) { return done.has(keyOf(m)); }

  function renderBanner() {
    const box = document.getElementById('dailyBar');
    if (!box) return;
    const today = todayKey();
    const todayCount = dailyList.filter(p => p.date === today).length;
    const isToday = DAILY.updated === today;
    box.innerHTML = `
      <div class="row" style="flex-wrap:wrap">
        <span class="c-ico">🗞️</span>
        <div style="flex:1;min-width:180px">
          <strong>每日更新</strong>
          <span class="muted" style="font-size:13px"> · 最近更新 ${DAILY.updated || '—'}${isToday ? '（今天）' : ''} ｜ 今日新增 ${todayCount} 篇</span>
        </div>
        <span class="pill">累计 ${DATA.length} 篇</span>
      </div>
      <div class="muted" style="font-size:12.5px;margin-top:6px">每天自动追加 2–3 篇全新仔细阅读（真题篇幅 320–360 词，每篇 5 题）。带 🆕 的是最新批次，建议当天做完。</div>`;
  }

  function renderCards() {
    document.getElementById('matCards').innerHTML = DATA.map((m, i) => {
      const dn = isDone(m);
      return `<div class="card link" data-i="${i}" style="${dn ? 'border-color:rgba(46,125,87,.5)' : ''}">
        <div class="c-ico">${dn ? '✅' : (m.daily ? '🆕' : '📖')}</div>
        <div class="c-title" style="font-size:14px">${m.title.replace('主题：', '')}</div>
        <div class="c-desc" style="font-size:12.5px">${m.daily ? '🗓️ ' + (m.date || '') + ' · ' : ''}${Math.round(m.passage.split(/\s+/).length)} 词 · ${m.questions.length} 题</div>
        <div style="margin-top:8px">${dn ? '<span class="pill">已完成</span>' : '<span class="tag">待练</span>'}</div>
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
        <div class="q-top"><span class="badge">Q${qi + 1}</span><span>${q.q}</span></div>
        <div class="opts">
          ${q.opts.map((o, oi) => `<label class="opt" data-q="${qi}" data-o="${oi}"><input type="radio" name="rq${qi}" value="${oi}"> ${o}</label>`).join('')}
        </div>
        <div class="exp" id="rex-${qi}"></div>
      </div>`).join('');

    box.innerHTML = `
      <div class="card" style="margin-top:18px">
        <div class="row"><span class="c-ico">📄</span><strong>${m.title}</strong>
          ${m.daily ? `<span class="tag">🗓️ ${m.date || ''}</span>` : ''}</div>
        <div class="note" style="margin-top:10px">💡 ${m.intro}</div>
        <div style="white-space:pre-wrap;background:rgba(31,42,68,.04);border-radius:10px;padding:16px;font-size:15px;line-height:1.9">${m.passage}</div>
      </div>
      <h2 class="section-title"><span class="ico">❓</span>题目（${m.questions.length} 题）</h2>
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
      done.add(keyOf(m)); Store.set('readingDone', [...done]); renderCards();
      toast('已记录完成');
    };
    document.getElementById('backBtn').onclick = () => { current = -1; renderDetail(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  }

  document.addEventListener('DOMContentLoaded', () => { renderBanner(); renderCards(); });
})();
