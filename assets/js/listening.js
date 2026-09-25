/* 听力训练逻辑：浏览器语音合成朗读（长材料分段播放）+ 题目 + 解析 */
(function () {
  const DATA = window.LISTENING || [];
  const done = new Set(Store.get('listeningDone', []));
  let current = -1;

  /* ---------- 语音合成播放器 ---------- */
  const synth = window.speechSynthesis;
  let chunks = [], ci = 0, playing = false, paused = false, loop = false, rate = 0.9;

  function toSpeechText(t) {
    return String(t || '')
      .replace(/^\s*M:/gm, 'Man:')
      .replace(/^\s*W:/gm, 'Woman:')
      .replace(/\n+/g, ' ');
  }
  function buildChunks(text) {
    const sents = text.match(/[^.!?]+[.!?]*/g) || [text];
    const out = [];
    let buf = '';
    sents.forEach(s => {
      s = s.trim();
      if (!s) return;
      if ((buf + ' ' + s).length > 180 && buf) { out.push(buf); buf = s; }
      else buf = buf ? buf + ' ' + s : s;
    });
    if (buf) out.push(buf);
    return out;
  }
  function pickVoice() {
    if (!synth) return null;
    const vs = synth.getVoices() || [];
    return vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /en[-_]GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
  }
  function ui() {
    const p = document.getElementById('pInfo');
    if (p) p.textContent = playing ? (paused ? `已暂停（第 ${ci + 1}/${chunks.length} 段）` : `播放中 ${ci + 1}/${chunks.length}`)
      : (chunks.length ? `共 ${chunks.length} 段 · 未播放` : '');
    const b = document.getElementById('playBtn');
    if (b) b.textContent = playing ? (paused ? '▶️ 继续' : '⏸️ 暂停') : '▶️ 播放音频';
  }
  function speakFrom(i) {
    if (!synth) return;
    if (i >= chunks.length) {
      if (loop) { ci = 0; speakFrom(0); return; }
      playing = false; ui(); return;
    }
    ci = i;
    const u = new SpeechSynthesisUtterance(chunks[i]);
    u.lang = 'en-US';
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = rate;
    u.onend = () => { if (playing) speakFrom(ci + 1); };
    u.onerror = () => { playing = false; ui(); };
    synth.speak(u);
    ui();
  }
  function stopAll() {
    if (synth) synth.cancel();
    playing = false; paused = false; ci = 0; ui();
  }

  /* ---------- 列表与详情 ---------- */
  function renderCards() {
    document.getElementById('matCards').innerHTML = DATA.map((m, i) => {
      const isDone = done.has(i);
      const wc = (m.transcript || '').split(/\s+/).length;
      return `<div class="card link" data-i="${i}" style="${isDone ? 'border-color:rgba(46,125,87,.5)' : ''}">
        <div class="c-ico">${isDone ? '✅' : '🎧'}</div>
        <div class="c-title">${m.title}</div>
        <div class="c-desc">${m.type}</div>
        <div style="margin-top:8px">
          <span class="tag">约 ${wc} 词</span>
          <span class="tag">${m.questions.length} 题</span>
          ${isDone ? '<span class="pill">已完成</span>' : '<span class="tag">待练</span>'}
        </div>
      </div>`;
    }).join('');
    document.querySelectorAll('#matCards .card').forEach(c => {
      c.onclick = () => { stopAll(); current = +c.dataset.i; renderDetail(); };
    });
  }

  function renderDetail() {
    const box = document.getElementById('detail');
    if (current < 0) { box.innerHTML = ''; return; }
    const m = DATA[current];
    chunks = buildChunks(toSpeechText(m.transcript));
    ci = 0; playing = false; paused = false;

    const qs = m.questions.map((q, qi) => `
      <div class="q" id="lq-${qi}">
        <div class="q-top"><span class="badge">Q${qi + 1}</span><span>${q.q}</span></div>
        <div class="opts">
          ${q.opts.map((o, oi) => `<label class="opt" data-q="${qi}" data-o="${oi}"><input type="radio" name="lq${qi}" value="${oi}"> ${String.fromCharCode(65 + oi)}. ${o}</label>`).join('')}
        </div>
        <div class="exp" id="lex-${qi}"></div>
      </div>`).join('');

    const supported = !!synth;
    box.innerHTML = `
      <div class="card" style="margin-top:18px">
        <div class="row"><span class="c-ico">🎧</span><strong>${m.title}</strong><span class="spacer"></span>
          <span class="tag">${m.type}</span></div>
        <div class="note" style="margin-top:10px">💡 ${m.tip}</div>

        <div style="margin-top:12px;background:rgba(31,42,68,.04);border-radius:12px;padding:14px">
          <div class="row">
            <strong>🔊 音频播放</strong>
            <span class="spacer"></span>
            <span class="muted" id="pInfo" style="font-size:13px"></span>
          </div>
          <div class="row" style="margin-top:10px">
            <button class="btn" id="playBtn">▶️ 播放音频</button>
            <button class="btn sm ghost" id="stopBtn">⏹️ 停止</button>
            <label class="row" style="gap:6px;font-size:14px">语速
              <select id="rateSel">
                <option value="0.7">0.7× 慢</option>
                <option value="0.8">0.8×</option>
                <option value="0.9" selected>0.9×</option>
                <option value="1">1.0× 常速</option>
              </select>
            </label>
            <label class="row" style="gap:6px;font-size:14px"><input type="checkbox" id="loopChk"> 循环</label>
          </div>
          <div class="muted" style="font-size:12.5px;margin-top:8px">${supported
            ? '音频由本机浏览器的英文语音合成实时朗读（无需下载音频文件）；建议先不看文稿盲听 1 遍，再开着文稿跟读。'
            : '当前浏览器不支持语音合成，请改用 Chrome / Edge / Safari，或直接阅读文稿练习。'}</div>
        </div>

        <div class="row" style="margin-top:12px">
          <button class="btn sm ghost" id="toggleTrans">📜 显示文稿</button>
        </div>
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

    if (supported) {
      document.getElementById('playBtn').onclick = () => {
        if (playing && !paused) { synth.pause(); paused = true; ui(); return; }
        if (playing && paused) { synth.resume(); paused = false; ui(); return; }
        playing = true; paused = false;
        if (ci >= chunks.length) ci = 0;
        speakFrom(ci);
      };
      document.getElementById('stopBtn').onclick = () => { stopAll(); toast('已停止'); };
      document.getElementById('rateSel').onchange = (e) => {
        rate = parseFloat(e.target.value);
        if (playing) { const at = ci; synth.cancel(); paused = false; speakFrom(at); }
      };
      document.getElementById('loopChk').onchange = (e) => { loop = e.target.checked; };
      if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = () => {};
      ui();
    } else {
      document.getElementById('playBtn').disabled = true;
    }

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
    document.getElementById('backBtn').onclick = () => { stopAll(); current = -1; renderDetail(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  }

  document.addEventListener('DOMContentLoaded', renderCards);
})();
