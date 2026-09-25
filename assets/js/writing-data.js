/* 写作模块内容（模板 / 句型库 / 衔接词 / 评分标准 / 范文） */
window.WRITING = {
  structure: [
    { part: "开头段 · Introduction", tip: "1–2 句点题，表明观点或现象。可用“Nowadays… / With the development of… / When it comes to…”开篇。",
      sample: "Nowadays, the issue of online learning has aroused wide concern. Different people hold different views on it." },
    { part: "主体段 · Body", tip: "2–3 句展开，给出 2 个理由或对比，每个理由配 1 个例子。用“First… Besides… / On one hand… On the other hand…”。",
      sample: "On one hand, online learning saves time and allows students to study at their own pace. On the other hand, it lacks face-to-face communication, which may weaken learning effects." },
    { part: "结尾段 · Conclusion", tip: "1–2 句总结并重申观点，可提建议或展望。用“In my opinion… / Only by… can we…”。",
      sample: "In my opinion, online learning is a useful tool, but it should be combined with traditional classes for the best result." }
  ],
  sentences: [
    { label: "现象开篇", items: ["Nowadays, it is common to see that…", "With the rapid development of technology, …", "When it comes to this topic, opinions vary."] },
    { label: "亮明观点", items: ["As far as I am concerned, …", "From my point of view, …", "I am convinced that …"] },
    { label: "列举理由", items: ["The first reason is that …", "What's more, …", "A good case in point is that …"] },
    { label: "对比论证", items: ["Some people believe …, while others argue that …", "Compared with A, B has its own advantages."] },
    { label: "总结建议", items: ["Only by taking these steps can we …", "It is high time that we took action to …", "All in all, we should …"] }
  ],
  linking: ["however", "therefore", "moreover", "furthermore", "in addition", "as a result", "for example", "on the contrary", "in other words", "to sum up"],
  criteria: [
    { score: "14–15 分", desc: "切题；表达清晰连贯；句式多样；基本无语法错误。" },
    { score: "11–13 分", desc: "切题；思路清楚；有少量语法/用词错误但不影响理解。" },
    { score: "8–10 分", desc: "基本切题；内容较空；语法错误较多。" },
    { score: "5–7 分", desc: "偏题或内容不全；语言错误多；连贯性差。" },
    { score: "0–4 分", desc: "跑题、字数严重不足或抄袭，表达混乱。" }
  ],
  topics: [
    {
      title: "话题一 · 现象解释类：大学生阅读量下降",
      dir: "Directions: For this part, you are allowed 30 minutes to write an essay on the phenomenon that college students spend less time reading books. You should write at least 120 words but no more than 180 words.",
      keywords: ["reading", "students", "books", "phone", "habit", "time"],
      points: ["描述现象（阅读时间减少）", "分析 2 个原因（手机/短视频、学业压力）", "给出建议（制定阅读计划）"],
      sample:
        "Nowadays, many college students spend far less time reading books than before. As far as I am concerned, this trend is worrying but can be changed.\n" +
        "The first reason is that phones and short videos take up too much of students' spare time. What's more, heavy study loads leave them little energy for deep reading. A good case in point is my roommate, who finished only two books last year because he kept checking his phone.\n" +
        "In my opinion, we should set a daily reading plan and keep phones away while reading. Only by forming this habit can we enjoy the real joy of books again."
    },
    {
      title: "话题二 · 对比论证类：线上学习 vs 传统课堂",
      dir: "Directions: For this part, you are allowed 30 minutes to write an essay comparing online learning with traditional classroom learning. You should write at least 120 words but no more than 180 words.",
      keywords: ["online", "learning", "class", "traditional", "convenient", "communication"],
      points: ["说明两种学习方式并存", "各列 1 个优点（灵活 / 面对面交流）", "给出结论（二者结合最好）"],
      sample:
        "When it comes to learning, some people prefer online courses, while others argue that traditional classes are better. Both sides have their reasons.\n" +
        "On one hand, online learning is convenient and flexible, because students can study at their own pace and review the recorded lessons. On the other hand, traditional classes allow face-to-face communication, which helps students solve problems immediately. Compared with online courses, classroom learning also builds stronger study groups.\n" +
        "All in all, I believe a mix of both will bring the best result for students."
    },
    {
      title: "话题三 · 观点论证类：大学生是否该做兼职",
      dir: "Directions: For this part, you are allowed 30 minutes to write an essay on whether college students should take part-time jobs. You should write at least 120 words but no more than 180 words.",
      keywords: ["part-time", "job", "students", "experience", "study", "balance"],
      points: ["亮明观点（支持/反对/辩证）", "给出 2 个论据（社会经验 / 影响学业）", "总结：前提是平衡时间"],
      sample:
        "Nowadays, an increasing number of college students take part-time jobs. From my point of view, doing so is beneficial as long as study comes first.\n" +
        "To begin with, part-time jobs provide practical experience that classrooms cannot offer, which helps students understand society and find jobs more easily after graduation. In addition, earning some money on their own reduces the financial burden on their parents. However, if a student works too many hours, his grades will surely suffer.\n" +
        "Therefore, students should balance work and study. Only in this way can part-time jobs become a real advantage rather than a distraction."
    },
    {
      title: "话题四 · 书信类：给外教的邀请信",
      dir: "Directions: For this part, you are allowed 30 minutes to write a letter to your foreign teacher Mr. Smith, inviting him to attend the English Culture Festival of your university. You should write at least 120 words but no more than 180 words.",
      keywords: ["invite", "festival", "culture", "english", "Mr. Smith", "Friday"],
      points: ["说明写信目的与时间地点", "介绍活动内容（英语短剧、演讲、歌曲）", "表达期待回复"],
      sample:
        "Dear Mr. Smith,\n" +
        "I am writing to invite you to the English Culture Festival of our university, which will be held in the Student Center at 7 p.m. next Friday.\n" +
        "During the festival, students will perform English short plays, deliver speeches and sing English songs. Since you have helped us a lot with spoken English, we would be delighted if you could come and give us some comments after the performances.\n" +
        "We do hope you can accept this invitation. I am looking forward to your reply.\n" +
        "Yours sincerely,\nLi Hua"
    }
  ],
  samples: [
    { title: "范文一：现象解释类（话题：阅读习惯）", en:
      "Nowadays, many young people spend less time on reading books. As far as I am concerned, this trend is worrying but can be changed.\n" +
      "The first reason is that phones and short videos take up too much time. What's more, students face heavy study loads and rarely plan reading time. A good case in point is my classmate, who read only two books last year because of screen time.\n" +
      "In my opinion, we should set a daily reading plan and keep phones away while reading. Only by forming this habit can we enjoy the joy of books again." },
    { title: "范文二：对比论证类（话题：线上 vs 线下学习）", en:
      "When it comes to learning, some people prefer online classes, while others argue that traditional classes are better. Both sides have their points.\n" +
      "On one hand, online learning is convenient and flexible. On the other hand, offline classes allow direct discussion with teachers. Compared with online learning, offline classes build stronger study groups.\n" +
      "All in all, a mix of both will bring the best result for students." }
  ]
};
