/* ============================================================
   四级备考工作台 · 交互逻辑
   全部进度存于浏览器 localStorage，关闭后仍保留。
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const today = () => new Date().toISOString().slice(0, 10);

  // ---------- 本地存储 ----------
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem("cet4_" + k)) ?? d; } catch { return d; } },
    set(k, v) { localStorage.setItem("cet4_" + k, JSON.stringify(v)); },
  };

  // ============================================================
  // 1. 考试倒计时
  // ============================================================
  let examDate = store.get("exam", "2026-12-12");
  function renderCountdown() {
    const el = $("#cd-days");
    const wrap = $(".countdown");
    const d = new Date(examDate + "T09:00:00");
    const diff = Math.ceil((d - new Date()) / 86400000);
    if (diff > 0) { el.textContent = diff; wrap.classList.remove("is-set"); }
    else if (diff === 0) { el.textContent = "今天"; }
    else { el.textContent = "已结束"; }
  }
  function enableDateEdit() {
    const wrap = $(".countdown");
    wrap.classList.add("is-set");
    wrap.innerHTML = '考试日期 <input type="date" id="cd-input" value="' + examDate + '">';
    $("#cd-input").addEventListener("change", (e) => {
      examDate = e.target.value || examDate;
      store.set("exam", examDate);
      renderCountdown();
    });
  }

  // ============================================================
  // 2. 词汇闪卡
  // ============================================================
  const VOCAB = window.CET4_VOCAB || [];
  let known = new Set(store.get("known", []));
  let vIdx = 0;
  let onlyUnknowns = false;
  let pool = [];

  function buildPool() {
    pool = VOCAB.map((_, i) => i).filter((i) => !(onlyUnknowns && known.has(i)));
    if (pool.length === 0) pool = VOCAB.map((_, i) => i);
  }
  function renderVocab() {
    buildPool();
    if (vIdx >= pool.length) vIdx = 0;
    const item = VOCAB[pool[vIdx]];
    const flip = $("#flip");
    const isKnown = known.has(pool[vIdx]);
    flip.classList.remove("flipped");
    flip.innerHTML = `
      <div class="inner">
        <div class="face front">
          ${isKnown ? '<span class="known-badge">已掌握</span>' : ""}
          <div class="word">${item.w}</div>
          <div class="ph">${item.ph}</div>
          <div class="tag">点击翻转看释义</div>
        </div>
        <div class="face back">
          <div class="pos">${item.pos}</div>
          <div class="zh">${item.zh}</div>
          <div class="ex">${item.ex}</div>
          <div class="exzh">${item.exzh}</div>
        </div>
      </div>`;
    $("#vocab-progress").innerHTML = `已掌握 <b>${known.size}</b> / ${VOCAB.length} 词`;
    $("#vocab-bar") && ($("#vocab-bar").style.width = (known.size / VOCAB.length * 100) + "%");
  }
  function bindVocab() {
    $("#flip").addEventListener("click", () => $("#flip").classList.toggle("flipped"));
    $("#v-known").addEventListener("click", () => { known.add(pool[vIdx]); persistKnown(); nextVocab(); });
    $("#v-unknown").addEventListener("click", () => { known.delete(pool[vIdx]); persistKnown(); nextVocab(); });
    $("#v-next").addEventListener("click", nextVocab);
    $("#v-prev").addEventListener("click", () => { vIdx = (vIdx - 1 + pool.length) % pool.length; renderVocab(); });
    $("#v-shuffle").addEventListener("click", () => { shuffle(pool); vIdx = 0; renderVocab(); });
    $("#v-filter").addEventListener("click", (e) => {
      onlyUnknowns = !onlyUnknowns; vIdx = 0;
      e.target.textContent = onlyUnknowns ? "显示全部" : "只看未掌握";
      renderVocab();
    });
  }
  function nextVocab() { vIdx = (vIdx + 1) % pool.length; renderVocab(); }
  function persistKnown() { store.set("known", Array.from(known)); }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } }

  // ============================================================
  // 3. 自测（grill-me 风格：逐个追问，即时反馈）
  // ============================================================
  const QUIZ = [
    { tag: "vocab", q: "Choose the word: The company tries to ___ its products to young people.", opts: ["promote", "eliminate", "occupy", "reveal"], ans: 0, exp: "promote = 推广/促进，符合「向年轻人推广产品」。" },
    { tag: "vocab", q: "Choose the word: Good sleep can ___ your memory and focus.", opts: ["dominate", "enhance", "survive", "assume"], ans: 1, exp: "enhance = 增强，符合语境。" },
    { tag: "vocab", q: "Choose the word: Trust is ___ to any real friendship.", opts: ["inevitable", "fundamental", "unique", "adequate"], ans: 1, exp: "fundamental = 根本的/基础的。" },
    { tag: "grammar", q: "By the time we arrived, the train ___.", opts: ["left", "has left", "had left", "leaves"], ans: 2, exp: "「到达」发生在过去，「离开」更早在过去之前，用过去完成时 had left。" },
    { tag: "grammar", q: "Neither the teacher nor the students ___ aware of the change.", opts: ["was", "were", "is", "be"], ans: 1, exp: "neither...nor 就近原则，靠近 students（复数），用 were。" },
    { tag: "grammar", q: "It is high time that we ___ action.", opts: ["take", "took", "will take", "have taken"], ans: 1, exp: "It is high time (that) + 过去式，表示「早该…」。" },
    { tag: "vocab", q: "Choose the word: The new law will ___ equal rights for all.", opts: ["guarantee", "occupy", "cultivate", "exceed"], ans: 0, exp: "guarantee = 保证。" },
    { tag: "vocab", q: "Choose the word: Hard work and luck ___ to his success.", opts: ["participate", "contribute", "dominate", "survive"], ans: 1, exp: "contribute to = 促成/贡献于。" },
    { tag: "grammar", q: "The book ___ on the desk belongs to me.", opts: ["laying", "lying", "lain", "lay"], ans: 1, exp: "lying 是 lie（平放）的现在分词作定语；lay/lain 是及物「放置」的变形，不符。" },
    { tag: "grammar", q: "She suggested ___ early to avoid traffic.", opts: ["to leave", "leave", "leaving", "left"], ans: 2, exp: "suggest + doing，用 leaving。" },
  ];
  let qOrder = [];
  let qPos = 0;
  let quiz = store.get("quiz", { correct: 0, total: 0 });

  function shuffleQuiz(cat) {
    qOrder = QUIZ.map((_, i) => i).filter((i) => cat === "all" || QUIZ[i].tag === cat);
    if (qOrder.length === 0) qOrder = QUIZ.map((_, i) => i);
    shuffle(qOrder); qPos = 0;
  }
  function renderQuiz() {
    const i = qOrder[qPos];
    const item = QUIZ[i];
    $("#quiz-q").textContent = `Q${qPos + 1}. ${item.q}`;
    const opts = $("#quiz-opts");
    opts.innerHTML = "";
    item.opts.forEach((o, idx) => {
      const b = document.createElement("button");
      b.className = "quiz-opt"; b.textContent = o;
      b.addEventListener("click", () => answerQuiz(idx, b));
      opts.appendChild(b);
    });
    $("#quiz-feedback").innerHTML = "";
    $("#quiz-meta").innerHTML = `<span class="pill">${item.tag === "vocab" ? "词汇" : "语法"}</span><span>进度 ${qPos + 1}/${qOrder.length}</span><span>正确率 ${quiz.total ? Math.round(quiz.correct / quiz.total * 100) : 0}%</span>`;
    $("#quiz-next").style.display = "none";
  }
  function answerQuiz(idx, btn) {
    const item = QUIZ[qOrder[qPos]];
    $$("#quiz-opts .quiz-opt").forEach((b) => (b.disabled = true));
    if (idx === item.ans) { btn.classList.add("correct"); quiz.correct++; }
    else { btn.classList.add("wrong"); $$("#quiz-opts .quiz-opt")[item.ans].classList.add("correct"); }
    quiz.total++; store.set("quiz", quiz);
    $("#quiz-feedback").innerHTML = `<b>${idx === item.ans ? "✓ 正确" : "✗ 答错"}</b>　${item.exp}`;
    $("#quiz-meta").innerHTML = `<span class="pill">${item.tag === "vocab" ? "词汇" : "语法"}</span><span>进度 ${qPos + 1}/${qOrder.length}</span><span>正确率 ${Math.round(quiz.correct / quiz.total * 100)}%</span>`;
    $("#quiz-next").style.display = "inline-block";
    renderStats();
  }
  function bindQuiz() {
    $("#quiz-cat").addEventListener("change", (e) => { shuffleQuiz(e.target.value); renderQuiz(); });
    $("#quiz-next").addEventListener("click", () => { qPos = (qPos + 1) % qOrder.length; renderQuiz(); });
    $("#quiz-restart").addEventListener("click", () => { shuffleQuiz($("#quiz-cat").value); renderQuiz(); });
  }

  // ============================================================
  // 4. 写作练习
  // ============================================================
  const PROMPTS = [
    "Directions: For this part, you are allowed 30 minutes to write an essay on the topic \"The Importance of Reading\". You should write at least 120 words but no more than 180 words.",
    "Directions: Write an essay on \"How to Balance Study and Relaxation\". Give reasons and examples. 120–180 words.",
    "Directions: Write an essay on \"The Impact of Smartphones on College Students\". 120–180 words.",
    "Directions: Write an essay on \"My View on Online Learning\". 120–180 words.",
  ];
  function bindWriting() {
    const ta = $("#essay");
    const wc = $("#word-count");
    const upd = () => { const n = (ta.value.trim().match(/\b[\w'-]+\b/g) || []).length; wc.textContent = n + " 词"; };
    ta.addEventListener("input", upd);
    $("#prompt-sel").addEventListener("change", (e) => { $("#prompt-text").textContent = PROMPTS[+e.target.value] || PROMPTS[0]; });
    $("#copy-essay").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(ta.value); $("#copy-essay").textContent = "已复制 ✓"; setTimeout(() => ($("#copy-essay").textContent = "复制全文"), 1500); }
      catch { alert("复制失败，请手动选择文本复制。"); }
    });
  }

  // ============================================================
  // 5. 每日打卡 & 连续天数
  // ============================================================
  const TASKS = [
    { t: "单词闪卡 30 个", s: "新词+复习" },
    { t: "听力精听 1 篇", s: "影子跟读" },
    { t: "仔细阅读 2 篇", s: "限时 18 分钟" },
    { t: "写作 / 翻译 1 段", s: "轮换进行" },
    { t: "复盘错题", s: "记到笔记本" },
  ];
  let plan = store.get("plan", { date: today(), done: TASKS.map(() => false), streak: 0, lastDone: "" });

  function refreshPlanIfNewDay() {
    if (plan.date !== today()) {
      const allDoneYesterday = plan.done.every(Boolean);
      let streak = plan.streak;
      if (allDoneYesterday && plan.date !== plan.lastDone) { streak = plan.streak; }
      plan = { date: today(), done: TASKS.map(() => false), streak: plan.streak, lastDone: plan.lastDone };
      store.set("plan", plan);
    }
  }
  function renderPlan() {
    const ul = $("#tasks"); ul.innerHTML = "";
    let doneCount = 0;
    TASKS.forEach((tk, i) => {
      const li = document.createElement("li");
      if (plan.done[i]) { li.classList.add("done"); doneCount++; }
      li.innerHTML = `<input type="checkbox" ${plan.done[i] ? "checked" : ""}><span class="t">${tk.t}<small>${tk.s}</small></span>`;
      li.querySelector("input").addEventListener("change", (e) => {
        plan.done[i] = e.target.checked;
        if (plan.done.every(Boolean)) {
          if (plan.lastDone !== today()) { plan.streak += 1; plan.lastDone = today(); }
        }
        store.set("plan", plan); renderPlan(); renderStats();
      });
      ul.appendChild(li);
    });
    $("#streak-big").textContent = plan.streak;
    $("#streak-today").textContent = doneCount === TASKS.length ? "今日任务已全部完成 🎉" : `今日已完成 ${doneCount}/${TASKS.length}`;
  }

  // ============================================================
  // 6. 顶部统计
  // ============================================================
  function renderStats() {
    $("#stat-vocab").textContent = known.size + "/" + VOCAB.length;
    $("#stat-vocab-bar").style.width = (known.size / VOCAB.length * 100) + "%";
    const rate = quiz.total ? Math.round(quiz.correct / quiz.total * 100) : 0;
    $("#stat-quiz").textContent = rate + "%";
    $("#stat-quiz-bar").style.width = rate + "%";
    $("#stat-streak").textContent = plan.streak;
    const doneToday = plan.date === today() ? plan.done.filter(Boolean).length : 0;
    $("#stat-task").textContent = doneToday + "/" + TASKS.length;
    $("#stat-task-bar").style.width = (doneToday / TASKS.length * 100) + "%";
  }

  // ============================================================
  // 初始化
  // ============================================================
  function init() {
    renderCountdown();
    $("#cd-edit").addEventListener("click", enableDateEdit);
    bindVocab(); renderVocab();
    bindQuiz(); shuffleQuiz("all"); renderQuiz();
    bindWriting();
    refreshPlanIfNewDay(); renderPlan();
    renderStats();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
