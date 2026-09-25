/* 阅读训练（三题型：仔细阅读 / 长篇匹配 / 词汇理解），原创材料 */
window.READING = [
  {
    type: "仔细阅读 · Careful Reading",
    title: "主题：数字时代的阅读习惯",
    intro: "仔细阅读每篇约 300 词，后跟 3–5 道选择题。先读题干再回原文定位，答案多在关键词附近。",
    passage:
      "Reading habits have changed greatly in the digital age. A recent survey of 1,200 college students found that while 82% still read for study, the average time spent on long-form reading dropped from 2.5 hours to 1.1 hours per day. Instead, students spend nearly three hours on social media and short videos.\n" +
      "Experts warn that skipping from one short post to another hurts deep reading. Deep reading means focusing on a text for a long time, thinking about its meaning, and connecting it with what you already know. This skill is important for learning and for writing good essays.\n" +
      "The good news is that reading can be trained. Students who set a fixed reading time each day—even 20 minutes—improved their concentration after one month. Libraries also help: those who visit a library weekly read 40% more books than others. The key is not the device, but the habit.",
    questions: [
      { kind: "choice", q: "What did the survey find about college students?", opts: ["They read more than before", "Long-form reading time dropped sharply", "They visit libraries daily", "They avoid social media"], ans: 1,
        exp: "第一段指出“the average time spent on long-form reading dropped from 2.5 hours to 1.1 hours per day”，长文阅读时间明显下降，选 B。" },
      { kind: "choice", q: "What does “deep reading” require according to the passage?", opts: ["A fast device", "Long focus and reflection", "Watching short videos", "Reading only news"], ans: 1,
        exp: "第二段解释 deep reading 是“focusing on a text for a long time, thinking about its meaning”，即长时间专注与思考，选 B。" },
      { kind: "choice", q: "What is the key to reading more, in the author's view?", opts: ["Using an e-reader", "The reading habit, not the device", "Reading on social media", "Reading only in libraries"], ans: 1,
        exp: "末句点明“The key is not the device, but the habit”，关键在习惯而非设备，选 B。" }
    ]
  },
  {
    type: "长篇匹配 · Matching",
    title: "主题：健康生活的四个方面",
    intro: "长篇匹配考查信息定位。先读题干（陈述），再快速扫读各段找对应信息。下列每段讲一个方面，请把陈述匹配到段落。",
    passage:
      "A. Sleep: Most adults need seven to eight hours of sleep. Lack of sleep weakens memory and lowers mood. Keeping a regular bedtime helps the body recover.\n" +
      "B. Diet: A balanced diet means more vegetables, fruit, and whole grains, and less sugar and fried food. Drinking enough water is also important.\n" +
      "C. Exercise: Thirty minutes of activity a day, such as walking or cycling, strengthens the heart and reduces stress. You need not go to a gym.\n" +
      "D. Social life: Friends and family give emotional support. People with close relationships tend to be happier and live longer.",
    questions: [
      { kind: "match", q: "Eating more vegetables and less sugar is discussed in which paragraph?", opts: ["A", "B", "C", "D"], ans: 1,
        exp: "B 段讲饮食（Diet），提到“more vegetables, fruit... less sugar”，选 B。" },
      { kind: "match", q: "Which paragraph says close relationships help people live longer?", opts: ["A", "B", "C", "D"], ans: 3,
        exp: "D 段 Social life 提到“people with close relationships tend to be happier and live longer”，选 D。" },
      { kind: "match", q: "Regular bedtime and enough sleep are the topic of which paragraph?", opts: ["A", "B", "C", "D"], ans: 0,
        exp: "A 段 Sleep 讨论规律作息与睡眠时长，选 A。" },
      { kind: "match", q: "Thirty minutes of daily walking is mentioned in which paragraph?", opts: ["A", "B", "C", "D"], ans: 2,
        exp: "C 段 Exercise 提到“Thirty minutes of activity a day, such as walking”，选 C。" }
    ]
  },
  {
    type: "词汇理解 · Banked Cloze",
    title: "主题：志愿服务（选词填空）",
    intro: "从词库中选词填入空白处，注意词性与语法（单复数、时态）。",
    passage:
      "Volunteering is a good way to [1]_____ something back to society. Last summer, I [2]_____ at a local hospital, where I [3]_____ old magazines to patients and chatted with them. The work was tiring but [4]_____. I learned that a small act of kindness can make a big [5]_____ in someone's day.",
    bank: ["difference", "handed", "volunteered", "give", "meaningful"],
    questions: [
      { kind: "cloze", q: "Blank [1]", opts: ["difference", "handed", "volunteered", "give", "meaningful"], ans: 3,
        exp: "固定搭配 give something back to society（回馈社会），to 后接动词原形，选 give。" },
      { kind: "cloze", q: "Blank [2]", opts: ["difference", "handed", "volunteered", "give", "meaningful"], ans: 2,
        exp: "Last summer 用过去时，在本地医院“做志愿”用 volunteered，选 volunteered。" },
      { kind: "cloze", q: "Blank [3]", opts: ["difference", "handed", "volunteered", "give", "meaningful"], ans: 1,
        exp: "把杂志“递给”病人，过去时 handed，选 handed。" },
      { kind: "cloze", q: "Blank [4]", opts: ["difference", "handed", "volunteered", "give", "meaningful"], ans: 4,
        exp: "but 转折，工作累却“有意义”，形容词 meaningful，选 meaningful。" },
      { kind: "cloze", q: "Blank [5]", opts: ["difference", "handed", "volunteered", "give", "meaningful"], ans: 0,
        exp: "make a difference 为固定短语“起作用／有影响”，选 difference。" }
    ]
  }
];
