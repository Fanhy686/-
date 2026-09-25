/* ===== 本机启发式估分引擎（写作 / 翻译，均按四级 15 分制） =====
   说明：纯前端离线估算。除给分外，还会输出——
   ① 每个维度的「怎么算的 / 现在什么水平」解释
   ② 明确的问题清单（问题 + 为什么扣分 + 怎么改 + 命中样例）
   ③ 做得好的地方
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
  function pct(n) { return Math.round(n * 100); }

  /* ---------------- 通用「语言体检」：找出明确可改的小毛病 ---------------- */
  function grammarCheck(text) {
    const out = [];
    const t = text || '';
    const sents = sentences(t);

    // 中文残留
    if (/[\u4e00-\u9fa5]/.test(t)) {
      const m = t.match(/[\u4e00-\u9fa5]+/g) || [];
      out.push({ level: 'high', title: '译文/作文里残留中文', why: '四级写作与翻译要求全英文作答，出现中文会被直接判为内容不完整。', fix: '把「' + uniq(m).slice(0, 5).join('、') + '」改成对应的英文表达。', samples: uniq(m).slice(0, 5) });
    }
    // 中文标点
    const cnPunc = (t.match(/[，。、；？！：「」（）]/g) || []);
    if (cnPunc.length) {
      out.push({ level: 'mid', title: '误用中文标点', why: '中文全角标点（，。；？！）在英文里不算合法标点，阅卷会记为书写不规范。', fix: '统一换成半角 , . ; ? ! 。', samples: uniq(cnPunc).slice(0, 4) });
    }
    // 句首未大写
    const lowerStart = sents.filter(s => /^[a-z]/.test(s));
    if (lowerStart.length) {
      out.push({ level: 'low', title: '有句子首字母未大写', why: '英文句子必须以大写字母开头，这是最基础的书写规范分。', fix: '把这些句子的首字母改成大写：' + lowerStart.slice(0, 3).map(s => '"' + s.slice(0, 18) + '…"').join('、'), samples: lowerStart.slice(0, 3) });
    }
    // 结尾无句号
    if (t.trim() && !/[.!?]["')\]]?\s*$/.test(t.trim())) {
      out.push({ level: 'low', title: '全文结尾缺句号', why: '段落/全文最后一个句子没有句号，会被认为句子不完整。', fix: '在结尾补上 . ', samples: [] });
    }
    // 逗号后无空格
    if (/,[^\s\d]/.test(t)) {
      const m = (t.match(/,\S+/g) || []).slice(0, 3);
      out.push({ level: 'low', title: '逗号后缺少空格', why: '英文标点后要空一格，属于排版错误，会影响卷面印象。', fix: '把 "' + m.join('"、"') + '" 改成逗号 + 空格。', samples: m });
    }
    // 冠词 a + 元音
    const aVowel = (t.match(/\ba\s+[aeiou][a-z]+/gi) || []).filter(x => !/^a\s+(uni|use|user|uniq|euro|one|once)/i.test(x));
    if (aVowel.length) {
      out.push({ level: 'mid', title: '冠词 a 用在元音前', why: '元音音素开头的单词前要用 an，这是四级高频扣分点。', fix: '"' + uniq(aVowel).slice(0, 3).join('"、"') + '" 应改为 an …（如 a important → an important）。', samples: uniq(aVowel).slice(0, 3) });
    }
    // 冠词 an + 辅音（排除 hour/honest 等）
    const anCons = (t.match(/\ban\s+[bcdfgjklmnpqrstvwxyz][a-z]+/gi) || []).filter(x => !/^an\s+(hour|honest|honour|honor|heir)/i.test(x));
    if (anCons.length) {
      out.push({ level: 'mid', title: '冠词 an 用在辅音前', why: '辅音音素开头的单词前要用 a。', fix: '"' + uniq(anCons).slice(0, 3).join('"、"') + '" 应改为 a …', samples: uniq(anCons).slice(0, 3) });
    }
    // 第三人称单主谓一致
    const sva = (t.match(/\b(he|she|it)\s+(go|do|have|make|take|say|get|think|want|need|like|work|study|play|know|read|write|come|see)\b/gi) || []);
    if (sva.length) {
      out.push({ level: 'high', title: '第三人称单数主谓不一致', why: 'he / she / it 作主语时，一般现在时动词要加 -s/-es，这是四级写作最常见的语法硬伤。', fix: '"' + uniq(sva).slice(0, 3).join('"、"') + '" 应改为 goes / does / has / makes 等。', samples: uniq(sva).slice(0, 3) });
    }
    // there / their 混淆（弱提示）
    if (/\bthere\s+(book|friend|life|family|study|work|time|home)\b/i.test(t)) {
      out.push({ level: 'low', title: '疑似 there / their 用混', why: 'their 是「他们的」，there 是「那里 / there be 句型」，混用会直接影响理解。', fix: '表示所属时用 their，表示存在时用 there is / there are。', samples: [] });
    }
    // 句长异常
    const sLens = sents.map(s => s.split(/\s+/).length);
    const tooLong = sLens.filter(n => n > 40).length;
    if (tooLong) {
      out.push({ level: 'mid', title: '存在超长句（>40 词）', why: '句子越长越容易失控（时态、成分、连词出错），四级阅卷对长句错误很敏感。', fix: '把超长句拆成两句，每句控制在 15–25 词。', samples: [] });
    }
    return out;
  }

  /* ---------------- 翻译估分 ---------------- */
  function scoreTranslation(user, item) {
    const ref = item.en || '';
    const u = (user || '').trim();
    const uw = words(u);
    const ucw = new Set(contentWords(u));
    const refUniq = uniq(contentWords(ref));

    // 1) 内容覆盖
    const hitWords = refUniq.filter(w => ucw.has(w));
    const missWords = refUniq.filter(w => !ucw.has(w));
    const coverage = refUniq.length ? hitWords.length / refUniq.length : 0;

    // 2) 要点短语命中
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

    // 4) 语言规范（含语法体检）
    const sents = sentences(u);
    let formPts = 0, formNotes = [];
    if (uw.length >= 8) formPts += 0.3;
    if (/^[A-Z]/.test(u)) formPts += 0.2; else formNotes.push('首句首字母未大写');
    if (/[.!?]["')\]]?\s*$/.test(u)) formPts += 0.2; else formNotes.push('结尾缺少句号');
    if (!/[\u4e00-\u9fa5]/.test(u)) formPts += 0.3; else formNotes.push('译文中残留中文');
    const gIssues = grammarCheck(u);
    const gPenalty = Math.min(0.4, gIssues.filter(g => g.level === 'high').length * 0.15 + gIssues.filter(g => g.level === 'mid').length * 0.08 + gIssues.filter(g => g.level === 'low').length * 0.03);
    formPts = clamp(formPts - gPenalty, 0, 1);

    const raw = 0.38 * coverage + 0.30 * keyRate + 0.14 * lenRatio + 0.18 * formPts;
    const score = clamp(Math.round(raw * 15), 0, 15);

    /* ---- 明确的问题清单 ---- */
    const issues = [];
    if (miss.length) {
      issues.push({
        level: 'high', title: '得分短语没译出来（' + miss.length + '/' + keys.length + '）',
        why: '四级翻译按「要点」给分，这些是预设得分点，漏一个就少一分。',
        fix: '照着下面未命中的表达，把对应中文回译一遍并记住译法。',
        samples: miss
      });
    }
    if (coverage < 0.55 && missWords.length) {
      issues.push({
        level: 'high', title: '漏译较多实词（缺 ' + missWords.length + ' 个）',
        why: '参考译文里的实词（名词/动词/形容词）你只覆盖到 ' + pct(coverage) + '%，说明有整块信息没译或译得太笼统。',
        fix: '对照下面这些词，检查是哪一句被你省掉了，中文里的每个分句都要落地成英文。',
        samples: missWords.slice(0, 14)
      });
    }
    if (lenRatio < 0.6) {
      issues.push({
        level: uw.length > refLen ? 'mid' : 'high',
        title: uw.length > refLen ? '译文明显偏长' : '译文明显偏短',
        why: '你的 ' + uw.length + ' 词 vs 参考 ' + words(ref).length + ' 词，偏离过大通常意味着' + (uw.length > refLen ? '加了原文没有的解释性内容' : '漏译了整句或只译了大意') + '。',
        fix: uw.length > refLen ? '四级翻译讲究「准确 + 简洁」，删掉重复表述和自行发挥的内容。' : '逐句核对中文，一个分句译一句，不要合并或省略。',
        samples: []
      });
    }
    // 自由发挥词（不在参考译文、也不在要点里的实词）
    const keyStems = new Set(keys.map(k => k.replace(/[^a-z0-9 ]/g, ' ').trim()).join(' ').split(/\s+/).filter(w => w.length > 2));
    const extraWords = uniq(contentWords(u)).filter(w => !ucw.has(w) === false && !new Set(refUniq).has(w) && !keyStems.has(w));
    if (extraWords.length >= 8 && extraWords.length > refUniq.length * 0.35) {
      issues.push({
        level: 'low', title: '出现较多参考译文之外的实词',
        why: '可能是自己发挥了原文没有的信息，翻译要求「不增不减」。',
        fix: '检查 "' + extraWords.slice(0, 6).join('、') + '" 这些词，是否原文里并没有对应内容。',
        samples: extraWords.slice(0, 8)
      });
    }
    gIssues.forEach(g => issues.push(g));

    /* ---- 做得好的地方 ---- */
    const good = [];
    if (coverage >= 0.7) good.push('核心词义覆盖到 ' + pct(coverage) + '%，主要信息都在。');
    if (keyRate >= 0.7) good.push('重点表达命中 ' + hit.length + '/' + keys.length + ' 个，得分点抓得准。');
    if (lenRatio >= 0.85) good.push('篇幅与参考译文接近，没有明显漏译或超译。');
    if (!gIssues.some(g => g.level === 'high')) good.push('没有发现严重语法硬伤（主谓一致、冠词等）。');
    if (!good.length) good.push('先把参考译文看一遍，再逐句重译一次——重点是把每个中文分句都落实成英文。');

    const tips = [];
    if (coverage < 0.5) tips.push('参考译文核心词覆盖不足一半，先补上漏译的信息点。');
    if (miss.length) tips.push('未命中的重点表达：' + miss.join('、') + '。');
    if (lenRatio < 0.6) tips.push('篇幅差距大，检查是否漏译整句。');
    if (formNotes.length) tips.push('书写规范：' + formNotes.join('；') + '。');

    const explain = `本次按四级翻译 15 分制估算：内容覆盖 ${pct(coverage)}% × 38% + 得分短语 ${pct(keyRate)}% × 30% + 篇幅匹配 ${pct(lenRatio)}% × 14% + 语言规范 ${pct(formPts)}% × 18%，合计 ${score} 分。`;

    return {
      score, band: band(score),
      report: Math.round(score / 15 * 106.5),
      myWords: uw.length, refWords: words(ref).length,
      explain,
      items: [
        { label: '内容覆盖', rate: coverage, text: `参考译文实词命中 ${hitWords.length}/${refUniq.length}`, explain: '把参考译文的名词/动词/形容词去重后，看你的译文里出现了多少；低于 60% 通常意味着有整句漏译。' },
        { label: '得分短语', rate: keyRate, text: `重点表达命中 ${hit.length}/${keys.length}`, explain: '每段素材预置 6–8 个「得分点」短语（文化词、固定搭配），这是阅卷最看重的部分。' },
        { label: '篇幅匹配', rate: lenRatio, text: `你的 ${uw.length} 词 / 参考 ${words(ref).length} 词`, explain: '你的词数与参考译文的接近程度；太短=漏译，太长=自行发挥。' },
        { label: '语言规范', rate: formPts, text: formNotes.length ? formNotes.join('；') : '大小写、标点、语法体检通过', explain: '检查大小写、句号、中文残留，以及主谓一致 / 冠词 / 标点等语法硬伤。' }
      ],
      hit, miss, missWords, issues, good, tips,
      note: '本机启发式估分（离线规则）：按内容覆盖、得分短语、篇幅与语言规范计算，用于自查定位问题，非官方阅卷。'
    };
  }

  /* ---------------- 写作估分 ---------------- */
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
    const keyMiss = keys.filter(k => !low.includes(k.toLowerCase()));
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
    const gIssues = grammarCheck(u);
    const gPenalty = Math.min(0.4, gIssues.filter(g => g.level === 'high').length * 0.15 + gIssues.filter(g => g.level === 'mid').length * 0.08 + gIssues.filter(g => g.level === 'low').length * 0.03);
    fPts = clamp(fPts - gPenalty, 0, 1);

    const raw = 0.25 * wRate + 0.15 * pRate + 0.15 * lRate + 0.15 * cRate + 0.20 * kRate + 0.10 * fPts;
    const score = clamp(Math.round(raw * 15), 0, 15);

    /* ---- 明确的问题清单 ---- */
    const issues = [];
    if (n < 120) {
      issues.push({
        level: 'high', title: `字数不足（${n} 词，差 ${120 - n} 词）`,
        why: '四级写作明确要求 120–180 词，字数不够会直接进入低分档，内容再好也上不去。',
        fix: '给主体段每个理由补 1–2 句展开（举例子 / 说结果 / 反面假设），最快补到 130 词。',
        samples: []
      });
    } else if (n > 200) {
      issues.push({
        level: 'mid', title: `字数偏多（${n} 词）`,
        why: '超过 180 词后，多写的句子出错概率更高，且考试时时间不够。',
        fix: '删掉重复表述，主体段每个理由控制在 2–3 句。',
        samples: []
      });
    }
    if (paras.length < 3) {
      issues.push({
        level: 'high', title: `段落结构不完整（当前 ${paras.length} 段）`,
        why: '四级阅卷第一眼看结构：没有清晰的三段式，会被归为「结构混乱」，直接掉档。',
        fix: '第一段亮观点（2–3 句）；第二段给 2 个理由，每个理由 2–3 句；第三段总结（2 句）。',
        samples: []
      });
    }
    if (linkHit.length < 3) {
      const suggest = LINK.filter(x => !low.includes(x)).slice(0, 5);
      issues.push({
        level: 'mid', title: `衔接词偏少（只用了 ${linkHit.length} 个）`,
        why: '缺少衔接词，句子之间是「硬拼」的，阅卷会认为连贯性差。',
        fix: '在段首、理由之间、结尾各放一个，例如：' + suggest.join(' / '),
        samples: linkHit
      });
    }
    if (cplxHit.length < 3) {
      const suggest = COMPLEX.filter(x => !low.includes(x)).slice(0, 5);
      issues.push({
        level: 'mid', title: `句型单一（从句标记只有 ${cplxHit.length} 类）`,
        why: '通篇简单句会被判为「语言单调」，难进 11 分以上档位。',
        fix: '每段至少加 1 个复合句，可用：' + suggest.join(' / '),
        samples: cplxHit
      });
    }
    if (keyMiss.length) {
      issues.push({
        level: 'high', title: `没有扣住主题关键词（缺 ${keyMiss.length} 个）`,
        why: '四级写作跑题是硬伤：题目核心词没出现，会被判为内容不切题。',
        fix: '把「' + keyMiss.join('、') + '」分别写进开头、主体和结尾，全文至少出现 3 次。',
        samples: keyMiss
      });
    }
    // 重复词
    const freq = {};
    contentWords(u).forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const repeated = Object.keys(freq).filter(w => freq[w] >= 4 && w.length > 4).sort((a, b) => freq[b] - freq[a]);
    if (repeated.length) {
      issues.push({
        level: 'low', title: '有词重复使用过多',
        why: '同一个词反复出现（如 ' + repeated.slice(0, 3).join('、') + '），会显得词汇量不足。',
        fix: '换用同义表达，或改成从句 / 代词指代。',
        samples: repeated.slice(0, 5).map(w => w + '×' + freq[w])
      });
    }
    gIssues.forEach(g => issues.push(g));
    if (avgLen < 10 && sents.length) {
      issues.push({ level: 'mid', title: '平均句长偏短（' + avgLen.toFixed(1) + ' 词/句）', why: '句子过短会让文章显得零碎，语言分上不去。', fix: '用 and / because / which 把相邻短句合并成一句。', samples: [] });
    } else if (avgLen > 28) {
      issues.push({ level: 'mid', title: '平均句长偏长（' + avgLen.toFixed(1) + ' 词/句）', why: '句子过长容易时态混乱、成分残缺。', fix: '拆句，保持每句 15–25 词。', samples: [] });
    }

    /* ---- 做得好的地方 ---- */
    const good = [];
    if (n >= 120 && n <= 180) good.push('字数 ' + n + ' 词，正好落在四级要求的 120–180 区间。');
    if (paras.length >= 3) good.push('三段式结构完整（' + paras.length + ' 段），阅卷第一印象好。');
    if (linkHit.length >= 3) good.push('衔接词用了 ' + linkHit.length + ' 个，段落之间连贯。');
    if (cplxHit.length >= 3) good.push('句型有变化，包含 ' + cplxHit.length + ' 类从句/复合标记。');
    if (keyHit.length >= Math.min(2, keys.length) && keys.length) good.push('主题关键词命中 ' + keyHit.length + '/' + keys.length + '，没有跑题。');
    if (!gIssues.some(g => g.level === 'high')) good.push('没有发现主谓一致、冠词等严重语法硬伤。');
    if (!good.length) good.push('先把三段式搭起来（开头观点 + 两个理由 + 结尾总结），再补衔接词和从句。');

    const tips = [];
    if (n < 120) tips.push(`字数 ${n} 词，再补 ${120 - n} 词左右。`);
    if (paras.length < 3) tips.push('建议严格三段式：开头亮观点 + 主体 2 个理由 + 结尾总结。');
    if (linkHit.length < 3) tips.push('衔接词至少用 3 个：however / moreover / in my opinion 等。');
    if (cplxHit.length < 3) tips.push('加入 because / although / which 引导的复合句。');
    if (keyMiss.length) tips.push('主题关键词要贯穿全文：' + keyMiss.join('、'));
    if (fNotes.length) tips.push('语言规范：' + fNotes.join('；') + '。');
    if (!tips.length) tips.push('结构、衔接、句型都达标了，接着重点打磨用词与细节例子。');

    const explain = `本次按四级写作 15 分制估算：字数 ${pct(wRate)}% × 25% + 结构 ${pct(pRate)}% × 15% + 衔接 ${pct(lRate)}% × 15% + 句型 ${pct(cRate)}% × 15% + 切题 ${pct(kRate)}% × 20% + 语言规范 ${pct(fPts)}% × 10%，合计 ${score} 分。`;

    return {
      score, band: band(score),
      report: Math.round(score / 15 * 106.5),
      myWords: n, paras: paras.length,
      explain,
      items: [
        { label: '字数篇幅', rate: wRate, text: `${n} 词（建议 120–180）`, explain: '四级写作要求 120–180 词；不足 120 会直接掉档，超过 200 容易出错。' },
        { label: '段落结构', rate: pRate, text: `${paras.length} 段（建议 3 段）`, explain: '按空行统计段落数；标准是「开头 + 主体 + 结尾」三段式。' },
        { label: '衔接词', rate: lRate, text: `命中 ${linkHit.length} 个：${linkHit.slice(0, 6).join(', ') || '—'}`, explain: '统计常见衔接词/过渡语出现几种，3 个以上算连贯达标。' },
        { label: '句型多样', rate: cRate, text: `从句/复合标记 ${cplxHit.length} 类：${cplxHit.slice(0, 6).join(', ') || '—'}`, explain: '统计 because / although / which / who 等从句引导词的类型数，反映句型是否单调。' },
        { label: '切题程度', rate: kRate, text: `主题词命中 ${keyHit.length}/${keys.length}`, explain: '题目核心词是否出现在你的文章里，跑题是四级写作最大硬伤。' },
        { label: '语言规范', rate: fPts, text: fNotes.length ? fNotes.join('；') : `平均句长 ${avgLen.toFixed(1)} 词，标点与大小写正常`, explain: '大小写、句号、中文残留，加上主谓一致 / 冠词 / 标点等语法体检。' }
      ],
      issues, good, tips,
      note: '本机启发式估分（离线规则）：按篇幅、结构、衔接、句型、切题与语言规范计算，用于自查定位问题，非官方阅卷。'
    };
  }

  function band(score) {
    if (score >= 13) return '14 分档（优秀）';
    if (score >= 10) return '11 分档（良好）';
    if (score >= 7) return '8 分档（及格）';
    if (score >= 4) return '5 分档（偏弱）';
    return '2 分档（需重写）';
  }

  /* ---------------- 报告渲染（写作 / 翻译共用） ---------------- */
  function reportHTML(r) {
    const lvColor = { high: 'var(--bad, #c0392b)', mid: '#d99a2b', low: '#7a869a' };
    const lvText = { high: '🔴 重点改', mid: '🟡 建议改', low: '🔵 细节' };
    return `<div class="card" style="margin-top:12px;border-color:var(--accent)">
      <div class="row" style="align-items:flex-start">
        <span class="c-ico">🤖</span>
        <div style="flex:1">
          <div class="row"><strong style="font-size:17px">估分 ${r.score} / 15</strong>
            <span class="pill">${r.band}</span>
            <span class="tag">≈ 报告分 ${r.report}</span></div>
          <div class="muted" style="font-size:13px;margin-top:4px">${r.explain || ''}</div>
        </div>
      </div>

      <div style="margin-top:12px">
        ${r.items.map(it => `
          <div style="margin-bottom:10px">
            <div class="row" style="justify-content:space-between;font-size:13.5px">
              <span>${it.label}</span><span class="muted">${pct(it.rate)}%</span>
            </div>
            <div class="bar" style="height:8px;margin-top:3px"><i style="width:${pct(it.rate)}%"></i></div>
            <div class="muted" style="font-size:12.5px;margin-top:2px">${it.text}</div>
            ${it.explain ? `<div class="muted" style="font-size:12px;margin-top:2px;opacity:.85">📎 ${it.explain}</div>` : ''}
          </div>`).join('')}
      </div>

      ${r.hit && r.hit.length ? `<div style="margin-top:8px"><b>✅ 已命中表达：</b>${r.hit.map(k => `<span class="tag">${k}</span>`).join('')}</div>` : ''}
      ${r.miss && r.miss.length ? `<div style="margin-top:6px"><b>⚠️ 未命中表达：</b>${r.miss.map(k => `<span class="tag">${k}</span>`).join('')}</div>` : ''}

      ${r.good && r.good.length ? `<div class="note" style="margin-top:10px;border-color:rgba(46,125,87,.4)"><b>👍 做得好的地方</b>${r.good.map(g => `<div>· ${g}</div>`).join('')}</div>` : ''}

      ${r.issues && r.issues.length ? `<div style="margin-top:12px"><b>🧭 不足清单（${r.issues.length} 项，按严重度排序）</b>
        ${r.issues.map(is => `<div style="margin-top:8px;border-left:3px solid ${lvColor[is.level]};padding:8px 10px;background:rgba(31,42,68,.03);border-radius:0 8px 8px 0">
          <div style="font-size:13.5px"><b>${is.title}</b> <span class="tag" style="color:${lvColor[is.level]}">${lvText[is.level]}</span></div>
          <div class="muted" style="font-size:12.5px;margin-top:3px"><b>为什么扣分：</b>${is.why}</div>
          <div class="muted" style="font-size:12.5px;margin-top:2px"><b>怎么改：</b>${is.fix}</div>
          ${is.samples && is.samples.length ? `<div style="margin-top:4px;font-size:12.5px">${is.samples.map(s => `<span class="tag">${s}</span>`).join('')}</div>` : ''}
        </div>`).join('')}</div>` : `<div class="note" style="margin-top:10px">🎉 没有检出明显问题，保持这个水平。</div>`}

      ${r.tips && r.tips.length ? `<div class="note" style="margin-top:10px">💡 改进建议：${r.tips.map(t => `<div>· ${t}</div>`).join('')}</div>` : ''}
      <div class="muted" style="font-size:12px;margin-top:8px">${r.note}</div>
    </div>`;
  }

  window.Scorer = { scoreTranslation, scoreWriting, band, reportHTML, grammarCheck };
})();
