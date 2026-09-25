/* 阅读训练 · 仔细阅读补充篇（篇幅接近四级真题，每篇 5 题） */
window.READING_EXTRA = [
  {
    type: "仔细阅读 · Careful Reading",
    title: "主题：社交媒体与年轻人的孤独感",
    intro: "做主旨题时先抓首段的转折词（如 in fact、yet）和末段的建议句；细节题按题干人名、数字、段落号回原文定位，比对同义替换。",
    passage:
      "Social media was supposed to bring people closer. In fact, a growing body of research suggests that heavy use of these platforms can leave young adults feeling more lonely, not less. A study that followed 1,200 students for two years found that those who spent more than three hours a day on social apps reported lower life satisfaction than those who spent less than an hour. The gap appeared even after researchers took income, family background and personality into account.\n" +
      "Researchers offer several explanations. First, much of what people see online is a carefully chosen version of other people's lives: holidays, parties and success. Users compare their own ordinary days with these bright images and conclude that they are falling behind. Second, online contact is a poor replacement for real conversation. A short message cannot carry the tone of voice or the silence that makes a friend feel understood, and it is easy to mistake a slow reply for a lack of care.\n" +
      "The effect is not the same for everyone. People who already feel anxious tend to use social media to check whether they are accepted, and this habit makes the anxiety worse. Those who use the platforms to arrange real meetings, on the other hand, often report stronger friendships. Experts therefore say that the amount of time online matters less than the way it is spent. Passive scrolling through endless pictures is far more harmful than sending a message to one close friend.\n" +
      "Some schools have begun to act. They ask students to record how they feel after an hour online and to notice which activities leave them tired. A few universities hold phone-free evenings, during which students talk, cook or play games together. Psychologists welcome such steps but warn that banning phones altogether rarely works. The aim, they say, is not to give up technology but to use it in a way that supports real relationships rather than replaces them.",
    questions: [
      { kind: "choice", q: "What is the main idea of the passage?", opts: ["Social media has failed to attract young users", "Heavy social media use can increase loneliness, and how people use it matters", "Schools should ban mobile phones on campus completely", "Online communication is always better than face-to-face talk"], ans: 1,
        exp: "文章首段用 In fact 转折指出重度使用社交平台反而让人更孤独，第三、四段强调使用方式比时长更重要，末段给出建议，B 项概括最完整。A 项与原文年轻人大量使用的事实相反；C 项过度，原文说 banning phones altogether rarely works；D 项与 online contact is a poor replacement 矛盾。" },
      { kind: "choice", q: "What did the study of 1,200 students find?", opts: ["Heavy users reported lower life satisfaction", "Heavy users earned more money than others", "Heavy users made more close friends offline", "Heavy users visited doctors far more often"], ans: 0,
        exp: "第一段明确说 those who spent more than three hours a day on social apps reported lower life satisfaction，与 A 项一致。B、C、D 在文中均无依据，且 C 项与全文结论相反。" },
      { kind: "choice", q: "Why is online contact a poor replacement for real conversation?", opts: ["Because most young people check messages only at night", "Because social platforms often break down in the evening", "Because it cannot carry the tone of voice or the silence that helps a friend feel understood", "Because friends prefer to look at pictures instead of reading"], ans: 2,
        exp: "第二段原句 A short message cannot carry the tone of voice or the silence that makes a friend feel understood 正是 C 项的同义替换。A、B、D 都是凭常识编造的细节，文中并未提到查看时间、平台故障或图片偏好。" },
      { kind: "choice", q: "What do experts say about the amount of time spent online?", opts: ["It is the only factor that really matters", "It matters less than the way the time is spent", "It should be limited to one hour every week", "It has nothing to do with people's loneliness"], ans: 1,
        exp: "第三段说 the amount of time online matters less than the way it is spent，与 B 项完全对应。A 项 only 太绝对；C 项的一小时是研究中对照组的用法，并非专家建议；D 项与研究发现相冲突。" },
      { kind: "choice", q: "The word isolation in the last paragraph is closest in meaning to ______.", opts: ["being separated from other people", "being praised by other people", "being busy with one's work", "being fond of new technology"], ans: 0,
        exp: "末段把 connection（连接）与 isolation 对举，且全文反复出现 lonely、feel left out 等语义，可知 isolation 指「孤立、与他人隔绝」，选 A。B、C、D 都无法与 connection 构成反义，也不符合孤独这一语境。" }
    ]
  },
  {
    type: "仔细阅读 · Careful Reading",
    title: "主题：快时尚的代价与旧衣处理",
    intro: "议论文常按「现象—危害—政府对策—个人行动」展开。细节题注意数字与因果词 because、since；词义题回到所在句找并列或解释成分。",
    passage:
      "Every year, people around the world buy about 100 billion new pieces of clothing, and a large share of them are worn only a handful of times before being thrown away. Cheap prices and rapid changes in style have turned clothes into something close to a disposable product. In many countries, a family now sends more textiles to the rubbish than it did twenty years ago, and charity shops say they receive far more donations than they can ever sell.\n" +
      "The environmental cost is heavy. Making a single cotton shirt can require thousands of litres of water, and dyeing fabric produces wastewater that is often released into rivers without treatment. When clothes are buried, they break down slowly and release gases that warm the planet; when they are burned, they pollute the air. Workers in some factories also face long hours and low pay, which makes the true price of a cheap shirt much higher than the number on its label.\n" +
      "Some governments are stepping in. A few European countries have introduced rules that require large brands to take back old clothes and either repair them or recycle the material. Others tax companies according to how much waste their products create. Supporters argue that such rules push designers to make stronger clothes in the first place, because a company that must pay for the waste it produces will think twice before selling a shirt that lasts one season. The idea is simple: make the producer responsible.\n" +
      "Ordinary buyers can help too. Washing clothes less often and at a lower temperature saves energy and keeps fabric in good condition for longer. Learning a few basic repair skills, or using a local tailor, can add years to a coat that would otherwise be thrown away. Buying second-hand is another simple step, since every reused garment means one less new item to produce. None of these actions will solve the problem alone, but together they can change what the fashion industry considers normal.",
    questions: [
      { kind: "choice", q: "What is the passage mainly about?", opts: ["The long history of the fashion industry in Europe", "How to choose clothes that match the latest styles", "The environmental cost of fast fashion and ways to reduce it", "Why cheap clothes are always better than expensive ones"], ans: 2,
        exp: "文章先写衣服被快速丢弃的现象，再写耗水、排污与劳工代价，最后给出政府立法与个人行动两类办法，C 项概括全面。A、B 均偏离环保主题；D 项与作者立场完全相反。" },
      { kind: "choice", q: "What happens to a large share of new clothes before they are thrown away?", opts: ["They are worn only a handful of times", "They are kept carefully for more than ten years", "They are returned to the factory for repair", "They are given directly to school children"], ans: 0,
        exp: "首段说 a large share of them are worn only a handful of times before being thrown away，即只穿了极少几次，选 A。B 与快速丢弃矛盾；C 的返厂修理是第三段法规要求以后的事；D 的捐赠对象文中只提到 charity shops，未提学校。" },
      { kind: "choice", q: "Why does the author say the true price of a cheap shirt is much higher than the label?", opts: ["Because clothing factories pay very high taxes", "Because water, pollution and low-paid labour are also part of the cost", "Because the price labels in shops are usually wrong", "Because shipping clothes abroad has become expensive"], ans: 1,
        exp: "第二段列举了耗水、废水排放、填埋焚烧污染以及工人 long hours and low pay，随后总结 true price ... much higher，B 项涵盖这些隐藏成本。A、C、D 均为无关常识，文中没有提及税收、标价错误或运费。" },
      { kind: "choice", q: "What do some European countries require large brands to do?", opts: ["To close factories that use too much water", "To sell only clothes made of pure cotton", "To lower the price of their new clothes", "To take back old clothes and repair or recycle them"], ans: 3,
        exp: "第三段原句 require large brands to take back old clothes and either repair them or recycle the material，与 D 项一致。A、B、C 都是对 rules 内容的随意想象，文中没有关闭工厂、限定面料或降价的要求。" },
      { kind: "choice", q: "It can be inferred from the last paragraph that the author believes ______.", opts: ["repairing clothes is far too difficult for most people", "buying second-hand clothes is no longer popular", "small everyday actions together can change the industry", "governments should stop making new rules for brands"], ans: 2,
        exp: "末句 together they can change what the fashion industry considers normal 说明个人微小行动累积起来能改变行业，选 C。A 与 Learning a few basic repair skills 矛盾；B 与 Buying second-hand is another simple step 矛盾；D 与第三段肯定政府立法的态度相反。" }
    ]
  },
  {
    type: "仔细阅读 · Careful Reading",
    title: "主题：在线课程为何难以坚持",
    intro: "遇到研究结论类文章，先分清「研究说了什么」与「作者观点是什么」；推理题答案必须能在原文找到依据，不能凭常识推断。",
    passage:
      "Online courses were once praised as a way to open education to everyone. Anyone with a connection could listen to a famous professor for free, and universities hurried to record their lectures. Ten years later, the results are mixed. Studies show that only about one in ten students who sign up for a free online course finishes it, and learners in poor districts, who were supposed to benefit most, often give up in the first two weeks.\n" +
      "Researchers say the problem is not the technology but the design. A video lecture of forty minutes asks for a kind of patience that few people have at home, where the phone rings and children shout. Courses built from short units of six to ten minutes, each followed by a quick test, keep far more students to the end. Learners also need a reason to return, so courses that set clear weekly goals and send gentle reminders do noticeably better than those that simply post a list of videos.\n" +
      "Human contact matters just as much. Students who join a small online group and discuss each week's task are three times more likely to finish than those who study alone. When a teacher comments on their work, even briefly, they feel that someone is watching their progress. Some universities now pay older students to act as guides, answering simple questions and encouraging those who fall behind. The cost is low; the effect on completion is large. In other words, a screen can deliver a lesson, but people deliver motivation.\n" +
      "None of this means that classrooms are out of date. The most successful programmes combine the two: students watch short videos at home and use class time for discussion, experiment and problem solving. Teachers report that this arrangement leaves them freer to help the students who struggle most. If online learning is to keep its promise, it will not be by replacing teachers, but by giving them better tools and more time with the learners who need them.",
    questions: [
      { kind: "choice", q: "What is the main idea of the passage?", opts: ["Online courses will soon replace traditional classrooms", "Free videos are the only way to study at home", "Universities should stop recording their lectures", "Online learning works better when courses are well designed and supported by people"], ans: 3,
        exp: "文章先指出在线课程完成率低，再从课程设计（短单元、提醒）和人际支持（小组讨论、教师反馈）两方面给出原因，末段提出线上线下结合，D 项最全面。A、B 过于绝对；C 与全文改进而非放弃的立场相反。" },
      { kind: "choice", q: "What do studies show about free online courses?", opts: ["They cost far less than classroom teaching", "Most learners finish them within two weeks", "Only about ten percent of those who sign up complete them", "They are mainly designed for famous professors"], ans: 2,
        exp: "第一段说 only about one in ten students who sign up ... finishes it，即约十分之一完成课程，C 项同义替换。A 项文中未比较成本；B 项把 give up in the first two weeks 偷换成完成；D 项曲解了 famous professor 的身份。" },
      { kind: "choice", q: "Why do courses built from short units work better?", opts: ["Because short units followed by a quick test keep learners' attention", "Because they need no Internet connection at all", "Because they are always recorded in a professional studio", "Because students must watch them inside a classroom"], ans: 0,
        exp: "第二段说 Courses built from short units of six to ten minutes, each followed by a quick test, keep far more students to the end，A 项是其概括。B、C、D 都添加了原文没有的条件：断网、专业录播室、必须在教室观看。" },
      { kind: "choice", q: "The word completion in Paragraph 3 is closest in meaning to ______.", opts: ["the act of beginning something", "the act of finishing something", "the act of recording something", "the act of remembering something"], ans: 1,
        exp: "该段反复出现 finish、are three times more likely to finish，可见 completion 指「完成（课程）」，选 B。A 与 finish 相反；C、D 与上文鼓励学生坚持下去的语境无关。" },
      { kind: "choice", q: "It can be inferred from the last paragraph that successful programmes ______.", opts: ["ask students to study completely on their own", "use class time for discussion and problem solving", "give up the use of video lessons at home", "require teachers to work much longer hours"], ans: 1,
        exp: "末段说 students watch short videos at home and use class time for discussion, experiment and problem solving，B 项直接对应。A 与 combine the two 矛盾；C 与仍在家看视频矛盾；D 的更长工时文中未提，原文只说教师有更多时间帮助困难学生。" }
    ]
  },
  {
    type: "仔细阅读 · Careful Reading",
    title: "主题：年轻人的职业选择与跳槽",
    intro: "对比类文章常出现 used to / no longer、some ... others ...，注意分清不同群体的态度；态度题要抓褒贬形容词和转折连词。",
    passage:
      "For most of the twentieth century, a sensible career looked like a ladder: join a good company, work hard, and climb steadily until retirement. That picture no longer fits. Surveys in several countries show that young workers now change jobs every three years on average, and many expect to hold more than ten positions before they turn forty. Some observers call this instability; others see it as a reasonable answer to a labour market that itself refuses to stand still.\n" +
      "Several forces are at work. Whole industries can shrink within a decade, so the skills that were valuable when a person graduated may be worth much less five years later. At the same time, technology has made it possible to work for clients in other cities or even other countries, which frees many people from a single employer. Young workers also say they care less about title and more about whether a job leaves time for family, health and learning. Money, though important, is rarely the only measure.\n" +
      "Employers have mixed feelings. Frequent moves bring fresh ideas and a wider view of an industry, and a candidate who has worked in three companies often solves problems faster than one who has never left. But managers also complain that training new staff takes months, and that a worker who leaves early takes valuable knowledge with them. Some firms now offer short internal projects and clear paths for promotion in the hope of keeping talented people a little longer.\n" +
      "Career advisers suggest a middle way. Instead of betting everything on one employer or jumping at every offer, workers should build skills that travel well: clear writing, basic data handling, and the ability to work with people from different backgrounds. They should also keep a small fund for the months between jobs and take time to study a new field before entering it. In a market that changes quickly, the safest plan is not a single job for life but the capacity to learn quickly.",
    questions: [
      { kind: "choice", q: "What is the passage mainly about?", opts: ["Why young people should stay with one company", "How career patterns are changing and how workers should respond", "The history of retirement in the twentieth century", "Why employers refuse to train their new staff"], ans: 1,
        exp: "全文先对比过去的阶梯式职业与现在频繁跳槽，再分析原因、雇主的两难态度，末段给出顾问建议，B 项涵盖变化与应对。A 与末段 middle way 不符；C 只涉及首段背景；D 与文中 managers complain that training takes months 的语义不合。" },
      { kind: "choice", q: "According to the surveys, how often do young workers change jobs?", opts: ["Every three years on average", "Every ten years on average", "Twice during a whole lifetime", "Only when they are forced to leave"], ans: 0,
        exp: "第一段说 young workers now change jobs every three years on average，A 项直接对应。B 的十年与 C 的两次均无依据；D 与文中多数人主动期待多段经历的表述不符。" },
      { kind: "choice", q: "Why do some managers dislike frequent job changes?", opts: ["Because young workers always ask for higher titles", "Because they believe modern offices are too quiet", "Because experienced workers refuse to share ideas", "Because training new staff takes months and leavers take knowledge away"], ans: 3,
        exp: "第三段 complain that training new staff takes months, and that a worker who leaves early takes valuable knowledge with them，与 D 项一致。A 与第二段 care less about title 矛盾；B 无中生有；C 与第三段频繁跳槽者 solve problems faster 的正面评价矛盾。" },
      { kind: "choice", q: "What do career advisers suggest workers should do?", opts: ["To build skills that travel well and keep some savings", "To accept the very first offer they receive", "To avoid learning anything outside their own field", "To change jobs as often as possible"], ans: 0,
        exp: "末段说 build skills that travel well 并 keep a small fund for the months between jobs，A 项概括这两点。B 与 Instead of ... jumping at every offer 不符；C 与建议 study a new field 相反；D 正是作者反对的极端做法。" },
      { kind: "choice", q: "The word capacity in the last sentence is closest in meaning to ______.", opts: ["a fixed plan for the future", "a large and comfortable office", "a much higher salary", "the ability to do something"], ans: 3,
        exp: "原句把 the safest plan 与 the capacity to learn quickly 并列，且前文强调 build skills、study a new field，可知 capacity 指「能力」，选 D。A、B、C 都是具体名词，无法与 to learn quickly 搭配成合理语义。" }
    ]
  },
  {
    type: "仔细阅读 · Careful Reading",
    title: "主题：智能家居的便利与隐忧",
    intro: "科技类说明文常用「优点—代价—补充问题—专家建议」结构。做题时留意 yet、however 后的内容往往是重点与出题处。",
    passage:
      "Smart devices are moving into ordinary homes at a remarkable speed. A recent survey found that nearly half of the families in big cities own at least one connected product, such as a speaker that answers questions, a thermostat that learns when residents are away, or a camera that sends pictures to a phone. Makers promise that these tools will save time and energy, and in some ways they do: a heating system that lowers itself at night can cut a winter bill by ten percent.\n" +
      "Yet convenience has a price that is not printed on the box. To work well, a smart device must collect information about the people who use it: when they sleep, when they leave the house, what they say aloud. Much of this data is stored on company servers, and reports of leaks appear almost every year. Experts warn that a speaker in the kitchen is, in effect, a microphone that never sleeps, and that families often agree to long lists of rules without reading a single line.\n" +
      "There are smaller problems as well. Devices from different companies often refuse to talk to each other, so a family may need three applications to control one living room. When a company closes a service, the product it sold can become useless overnight. Repair is another headache: a broken screen on a smart fridge may cost more than the food inside it, and spare parts are frequently hard to find. In such cases, a simple machine that lasts ten years may be the wiser purchase.\n" +
      "None of this means that people should throw their devices away. Specialists suggest a few simple habits: buy from companies with clear privacy policies, turn off microphones when they are not needed, and keep devices on a separate network from the computer that holds important files. Above all, they advise buyers to ask what a product really adds to daily life before bringing it home. A machine that saves five minutes a day may not be worth the information it quietly collects.",
    questions: [
      { kind: "choice", q: "What is the passage mainly about?", opts: ["How to repair a smart fridge at home", "Why every family should buy a smart speaker", "The convenience of smart home devices and the problems that come with them", "The development of the Internet in big cities"], ans: 2,
        exp: "首段讲普及与省时省钱的好处，第二段用 Yet 转向隐私代价，第三段补充兼容与维修问题，末段给出使用建议，C 项兼顾正反两面。A 只是第三段的一个例子；B 与作者审慎态度不符；D 的互联网发展并非本文内容。" },
      { kind: "choice", q: "How much can a smart heating system cut a winter bill?", opts: ["By about ten percent", "By about fifty percent", "By exactly one hundred percent", "It cannot cut the bill at all"], ans: 0,
        exp: "第一段末句说 a heating system that lowers itself at night can cut a winter bill by ten percent，选 A。B、C 夸大了数字；D 与 can cut 直接矛盾。" },
      { kind: "choice", q: "What do experts compare a smart speaker in the kitchen to?", opts: ["A radio that plays music", "A microphone that never sleeps", "A teacher in the classroom", "A clock on the wall"], ans: 1,
        exp: "第二段明确说 a speaker in the kitchen is, in effect, a microphone that never sleeps，B 项为原文复现。A、C、D 都是凭日常印象设置的干扰项，文中未作此类比较。" },
      { kind: "choice", q: "It can be inferred from Paragraph 3 that a smart product may become useless overnight when ______.", opts: ["its screen is broken by accident", "the food stored inside it goes bad", "the family moves to a new house", "the company closes the service it depends on"], ans: 3,
        exp: "第三段原句 When a company closes a service, the product it sold can become useless overnight，D 项是其改写。A 属于维修贵的问题，不会让产品 overnight 失效；B、C 文中均未提及。" },
      { kind: "choice", q: "What is the author's attitude toward smart home devices?", opts: ["Completely negative and distrustful", "Cautious but not rejecting them", "Strongly supportive and enthusiastic", "Totally uninterested and indifferent"], ans: 1,
        exp: "作者既承认设备 save time and energy、能省电费，又反复提醒隐私与维修风险，末段还给出安全使用建议而非要求弃用，态度是审慎但不排斥，选 B。A、C 各执一端，D 与全文详细讨论的态度不符。" }
    ]
  },
  {
    type: "仔细阅读 · Careful Reading",
    title: "主题：在外就餐与在家做饭",
    intro: "健康类文章常以研究对比开篇，注意比较级（more than、twice）和因果连接词 because、since；末段的 however 往往引出作者真正想强调的观点。",
    passage:
      "In many countries, food bought from a shop or a delivery app now provides more than half of the calories people eat. Such meals are quick and cheap, and for families working long hours they can feel like the only possible choice. Yet doctors have noticed a clear pattern: people who eat most of their meals away from home weigh more, sleep worse and report more stomach problems than those who cook at least four dinners a week themselves.\n" +
      "The reason is not mysterious. Ready-made meals usually contain more salt, sugar and fat than the same dish prepared at home, because these ingredients make food taste strong and last longer. Portions are also larger, and a restaurant plate often holds twice the amount a person actually needs. Fibre, which keeps the body satisfied and helps the stomach work well, is the element most often missing. Over months, these small differences accumulate into real changes in weight and blood pressure.\n" +
      "Cooking at home does not have to mean long hours in the kitchen. Studies of busy families show that most of their dinners take less than thirty minutes to prepare, and that simple methods work as well as complicated ones. Preparing vegetables on a Sunday and storing them in the fridge removes the hardest step on a weekday evening. Cooking together also changes how children think about food: those who help wash or stir are more willing to taste what they have made. In this way, a daily chore quietly becomes a lesson.\n" +
      "Public health officials, however, warn against blaming individuals alone. Fresh food costs more in poor neighbourhoods, and shops there often sell mostly packaged goods. Time matters too: a parent on the late shift cannot easily stand over a stove at six. For this reason, several cities now support cooking classes in schools and offer discounts on vegetables in local markets. Better health, they argue, comes less from willpower than from conditions that make the easier choice the healthier one.",
    questions: [
      { kind: "choice", q: "What is the passage mainly about?", opts: ["The health effects of eating out often and how to make home cooking easier", "The best restaurants in large modern cities", "Why school children refuse to eat vegetables", "How to lose weight within a single week"], ans: 0,
        exp: "文章先讲在外就餐比例上升及其健康代价，再讲在家做饭并不费时，末段强调应改善外部环境，A 项概括准确。B、D 均未在文中讨论；C 只是第三段关于孩子参与烹饪的局部细节。" },
      { kind: "choice", q: "What have doctors noticed about people who eat most meals away from home?", opts: ["They spend much less money on food", "They cook far more often at weekends", "They prefer fresh vegetables to meat", "They weigh more, sleep worse and report more stomach problems"], ans: 3,
        exp: "第一段末句列出 weigh more, sleep worse and report more stomach problems，D 项为原文复现。A、B、C 都是与原文无关甚至相反的描述，文中说这类人恰恰很少自己做饭。" },
      { kind: "choice", q: "Which element is most often missing from ready-made meals?", opts: ["Salt and sugar", "Fat and cooking oil", "Fibre", "Clean drinking water"], ans: 2,
        exp: "第二段说 Fibre, which keeps the body satisfied ... is the element most often missing，选 C。A、B 恰恰是成品餐含量过多的成分（more salt, sugar and fat）；D 文中未提及。" },
      { kind: "choice", q: "The word accumulate in Paragraph 2 is closest in meaning to ______.", opts: ["disappear slowly over time", "build up gradually over time", "break down suddenly", "stay exactly the same"], ans: 1,
        exp: "原句 these small differences accumulate into real changes in weight and blood pressure 表示小差异逐渐累积成真实变化，B 项 build up gradually 与之同义。A、C、D 都无法解释「小差异最终变成明显变化」这一因果。" },
      { kind: "choice", q: "It can be inferred from the last paragraph that the author believes ______.", opts: ["people should depend only on their own willpower", "poor neighbourhoods already have plenty of fresh food", "better health depends on conditions that make healthy choices easier", "cooking classes in schools are a waste of public money"], ans: 2,
        exp: "末句 comes less from willpower than from conditions that make the easier choice the healthier one 直接支持 C 项。A 与 less from willpower 相反；B 与 Fresh food costs more in poor neighbourhoods 矛盾；D 与作者肯定城市支持烹饪课的态度相反。" }
    ]
  }
];
