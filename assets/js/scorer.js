/* ===== 本机启发式估分引擎（写作 / 翻译，均按四级 15 分制） =====
   说明：纯前端离线估算，依据内容覆盖、要点命中、结构、语言规范等可量化指标打分，
   用于自查定位问题，非官方阅卷结果。 */
(function () {
  const STOP = new Set(('a an the and or but if of to in on at for with as by is are was were be been being am do does did ' +
    'this that these those it its it\'s he she they we you i his her their our your my from not no so than then there here ' +
    'can could will would should may might must have has had about into over under after before also very more most some any').split(' '));

  function words(t) {
    return (t || '').toLowerCase().replace(/[^a-z'\s-]/g, ' ').split(/\s+/).filter(Boolean);
  }
  function contentWords(t) {
    return words(t).filter(w => w.length > 2 && !STOP.has(w));
  }
  function uniq(a) { return Array.from(new Set(a)); }
  function sentences(t) {
    return (t || '').split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  /* ---------- 翻译估分 ---------- */
  function scoreTranslation(user, item) {
    const ref = item.en || '';
    const u = (user || '').trim();
    const uw = words(u);
    const rw = contentWords(ref);
    const ucw = new Set(contentWords(u));

    // 1) 内容覆盖（参考译文实词被命中比例）
    const refUniq = uniq(rw);
    const hitWords = refUniq.filter(w => ucw.has(w));
    const coverage = refUniq.length ? hitWords.length / refUniq.length : 0;

    // 2) 要点短语命中（keys 中 "english 中文" 取英文部分）
    const keys = (item.keys || []).map(k => {
      const parts = String(k).split(/\s{1,}(?=[\u4e00-\u9fa5])/);
      return (parts[0] || k).trim().toLowerCase();
    });
    const low = u.toLowerCase();
    const hit = [], miss = [];
    keys.forEach((k, i) => {
      const stem = k.replace(/[^a-z0-9 ]/g, '').trim();
      const ok = stem && low.includes(stem);
      (ok ? hit : miss).push(item.keys[i]);
    });
    const keyRate = keys.length ? hit.length / keys.length : 0;

    // 3) 篇幅匹配
    const refLen = words(ref).length || 1;
    const lenRatio = uw.length ? Math.min(uw.length, refLen) / Math.max(uw.length, refLen) : 0;

    // 4) 语言规范
    const sents = sentences(u);
    let formPts = 0, formNotes = [];
    if (uw.length >= 8) formPts += 0.4;
    if (/^[A-Z]/.test(u)) formPts += 0.2; else formNotes.push('首句首字母未大写');
    if (/[.!?]["')\]]?\s*$/.test(u)) formPts += 0.2; else formNotes.push('结尾缺少句号');
    if (!/[\u4e00-\u9fa5]/.test(u)) formPts += 0.2; else formNotes.push('译文中仍残留中文');
    formPts = clamp(formPts, 0, 1);

    const raw = 0.40 * coverage + 0.30 * keyRate + 0.15 * lenRatio + 0.15 * formPts;
    const score = clamp(Math.round(raw * 15), 0, 15);

    const tips = [];
    if (coverage < 0.5) tips.push('参考译文的核心词覆盖不足一半，先对照补上漏译的信息点。');
    if (miss.length) tips.push('未命中的重点表达：' + miss.join('、') + '，这些是翻译得分点。');
    if (lenRatio < 0.6) tips.push('篇幅与参考译文差距较大，检查是否漏译整句。');
    if (lenRatio > 0.99 && uw.length > refLen * 1.6) tips.push('译文偏长，四级翻译以准确简洁为先，删掉重复表达。');
    if (formNotes.length) tips.push('书写规范：' + formNotes.join('；') + '。');

    return {
      score, band: band(score),
      report: Math.round(score / 15 * 106.5),
      myWords: uw.length, refWords: words(ref).length,
      items: [
        { label: '内容覆盖', rate: coverage, text: `参考译文实词命中 ${hitWords.length}/${refUniq.length}` },
        { label: '要点短语', rate: keyRate, text: `重点表达命中 ${hit.length}/${keys.length}` },
        { label: '篇幅匹配', rate: lenRatio, text: `你的 ${uw.length} 词 / 参考 ${words(ref).length} 词` },
        { label: '语言规范', rate: formPts, text: formNotes.length ? formNotes.join('；') : '大小写、标点、无中文残留' }
      ],
      hit, miss, tips,
      note: '本机启发式估分（离线规则）：按内容覆盖、要点命中、篇幅与书写规范计算，用于自查，非官方阅卷。'
    };
  }

  /* ---------- 写作估分 ---------- */
  const LINK = ['however', 'therefore', 'moreover', 'furthermore', 'in addition', 'as a result', 'for example',
    'for instance', 'on the contrary', 'in other words', 'to sum up', 'what\'s more', 'besides', 'meanwhile',
    'on one hand', 'on the other hand', 'in my opinion', 'all in all', 'first', 'second', 'finally', 'because', 'so'];
  const COMPLEX = ['because', 'although', 'though', 'while', 'whereas', 'which', 'who', 'whose', 'that', 'if', 'unless',
    'since', 'when', 'whenever', 'in order that', 'so that', 'as long as', 'even if', 'provided that'];

  function scoreWriting(user, topic) {
    const u = (user || '').trim();
    const uw = words(u);
    const n = uw.length;
    const low = u.toLowerCase();
    const paras = u.split(/\n\s*\n/).map(s => s.trim()).filter(s => s.length > 0);
    const sents = sentences(u);

    // 字数（四级 120–180 词）
    let wRate;
    if (n === 0) wRate = 0;
    else if (n < 120) wRate = n / 120 * 0.9;
    else if (n <= 180) wRate = 1;
    else wRate = clamp(1 - (n - 180) / 180, 0.5, 1);

    // 段落结构
    const pRate = paras.length >= 3 ? 1 : (paras.length === 2 ? 0.6 : (paras.length === 1 ? 0.3 : 0));

    // 衔接词
    const linkHit = uniq(LINK.filter(w => low.includes(w)));
    const lRate = clamp(linkHit.length / 3, 0, 1);

    // 句型复杂度
    const cplxHit = uniq(COMPLEX.filter(w => low.includes(w)));
    const cRate = clamp(cplxHit.length / 3, 0, 1);

    // 主题关键词
    const keys = (topic && topic.keywords) || [];
    const keyHit = keys.filter(k => low.includes(k.toLowerCase()));
    const kRate = keys.length ? clamp(keyHit.length / Math.max(2, Math.ceil(keys.length * 0.6)), 0, 1) : 0.6;

    // 语言规范
    let fPts = 0, fNotes = [];
    const capOk = sents.length ? sents.filter(s => /^[A-Z]/.test(s)).length / sents.length : 0;
    fPts += capOk * 0.4;
    if (capOk < 0.8 && sents.length) fNotes.push('有句子首字母未大写');
    if (!/[\u4e00-\u9fa5]/.test(u) && n > 0) fPts += 0.2; else if (n > 0) fNotes.push('正文里出现中文');
    if (!/\s{2,}/.test(u.replace(/\n/g, ' '))) fPts += 0.1;
    const avgLen = sents.length ? n / sents.length : 0;
    if (avgLen >= 10 && avgLen <= 25) fPts += 0.3; else fNotes.push(avgLen < 10 ? '句子偏短，可适当合并为复合句' : '句子偏长，注意拆分避免语法失控');
    fPts = clamp(fPts, 0, 1);

    const raw = 0.25 * wRate + 0.15 * pRate + 0.15 * lRate + 0.15 * cRate + 0.20 * kRate + 0.10 * fPts;
    const score = clamp(Math.round(raw * 15), 0, 15);

    const tips = [];
    if (n < 120) tips.push(`字数 ${n} 词，四级建议 120–180 词，再补 ${120 - n} 词左右。`);
    if (n > 200) tips.push(`字数 ${n} 词偏多，控制在 180 词内更容易写完且少错。`);
    if (paras.length < 3) tips.push('建议严格三段式：开头亮观点 + 主体 2 个理由 + 结尾总结。');
    if (linkHit.length < 3) tips.push('衔接词偏少（当前 ' + linkHit.length + ' 个），至少用 3 个：however / moreover / in my opinion 等。');
    if (cplxHit.length < 3) tips.push('从句类型偏少，尝试加入 because / although / which 引导的复合句。');
    if (keyHit.length < Math.min(2, keys.length)) tips.push('主题关键词命中不足，注意紧扣题目中的核心词。');
    if (fNotes.length) tips.push('语言规范：' + fNotes.join('；') + '。');
    if (!tips.length) tips.push('结构、衔接、句型都达标了，接着重点打磨用词与细节例子。');

    return {
      score, band: band(score),
      report: Math.round(score / 15 * 106.5),
      myWords: n, paras: paras.length,
      items: [
        { label: '字数篇幅', rate: wRate, text: `${n} 词（建议 120–180）` },
        { label: '段落结构', rate: pRate, text: `${paras.length} 段（建议 3 段）` },
        { label: '衔接词', rate: lRate, text: `命中 ${linkHit.length} 个：${linkHit.slice(0, 6).join(', ') || '—'}` },
        { label: '句型多样', rate: cRate, text: `从句/复合标记 ${cplxHit.length} 类：${cplxHit.slice(0, 6).join(', ') || '—'}` },
        { label: '切题程度', rate: kRate, text: `主题词命中 ${keyHit.length}/${keys.length}` },
        { label: '语言规范', rate: fPts, text: fNotes.length ? fNotes.join('；') : `平均句长 ${avgLen.toFixed(1)} 词，标点与大小写正常` }
      ],
      tips,
      note: '本机启发式估分（离线规则）：按篇幅、结构、衔接、句型、切题与语言规范计算，用于自查，非官方阅卷。'
    };
  }

  function band(score) {
    if (score >= 13) return '14 分档（优秀）';
    if (score >= 10) return '11 分档（良好）';
    if (score >= 7) return '8 分档（及格）';
    if (score >= 4) return '5 分档（偏弱）';
    return '2 分档（需重写）';
  }

  window.Scorer = { scoreTranslation, scoreWriting, band };
})();
