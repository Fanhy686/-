/* 听力训练材料（原创文本，模拟四级题型；无音频时提供文稿与题目） */
window.LISTENING = [
  {
    title: "短对话：约图书馆自习",
    type: "短对话 / Short Conversation",
    tip: "四级短对话常考：地点、计划、态度、原因。听时抓关键词（如 library, borrow, return）。",
    transcript:
      "M: Hi Lisa, are you going to the library this afternoon?\n" +
      "W: Yes, I need to return two books and borrow a novel for the weekend.\n" +
      "M: Great. Could you help me find a book on Chinese history? I can't remember the title.\n" +
      "W: Sure. The history section is on the third floor. We can look together after I return mine.\n" +
      "M: Thanks! Shall we meet at the entrance at two?\n" +
      "W: Perfect. See you then.",
    questions: [
      { q: "What does the woman want to do at the library?", opts: ["Borrow a novel", "Buy a dictionary", "Meet the librarian", "Print some papers"], ans: 0,
        exp: "女士说 “I need to return two books and borrow a novel for the weekend”，核心动作是还书并借小说，故选 A（Borrow a novel）。" },
      { q: "Where is the history section?", opts: ["On the first floor", "On the third floor", "Near the entrance", "On the second floor"], ans: 1,
        exp: "女士明确说 “The history section is on the third floor”，故选 B。" }
    ]
  },
  {
    title: "长对话：暑期实习咨询",
    type: "长对话 / Long Conversation",
    tip: "长对话信息量大，建议边听边速记要点（who / what / when / where / why）。",
    transcript:
      "W: Good morning, Career Center. How can I help you?\n" +
      "M: Hi, I'm a sophomore majoring in marketing. I'd like to know about summer internships.\n" +
      "W: Sure. We have openings in three areas: sales, market research, and public relations.\n" +
      "M: I'm more interested in market research. What are the requirements?\n" +
      "W: You need a GPA above 3.0 and a letter of recommendation from a professor.\n" +
      "M: My GPA is 3.4, and I can get a letter from my economics teacher.\n" +
      "W: Excellent. The application deadline is May 15th. Interviews will be in early June.\n" +
      "M: Got it. One more thing—is the internship paid?\n" +
      "W: Yes, it pays 2,000 yuan a month, and you'll get course credit too.",
    questions: [
      { q: "What is the man's major?", opts: ["Economics", "Marketing", "Public relations", "Sales"], ans: 1,
        exp: "男士说 “I'm a sophomore majoring in marketing”，故选 B（Marketing）。" },
      { q: "What is required for the market research internship?", opts: ["A GPA above 3.0 and a recommendation letter", "Two years of experience", "A finished research paper", "Fluent French"], ans: 0,
        exp: "女士说明要求 “a GPA above 3.0 and a letter of recommendation from a professor”，对应 A。" },
      { q: "When is the application deadline?", opts: ["June 1st", "May 15th", "Early June", "April 30th"], ans: 1,
        exp: "原文 “The application deadline is May 15th”，故选 B。" }
    ]
  },
  {
    title: "短文：城市绿化益处",
    type: "短文理解 / Passage",
    tip: "短文理解首尾句常点题，注意转折词（but / however）后往往是考点。",
    transcript:
      "Cities around the world are planting more trees, and for good reasons. First, trees clean the air by taking in harmful gases and giving out oxygen. A single large tree can provide a day's oxygen for two people. Second, green areas help lower the temperature. On a hot summer day, a park can be several degrees cooler than the street nearby. Third, parks give people a place to relax and exercise, which is good for both body and mind. Studies show that people who live near green spaces feel less stressed. Finally, trees can save energy. Houses with trees around them need less air conditioning in summer and less heating in winter. For these reasons, many cities now include more green spaces in their plans.",
    questions: [
      { q: "According to the passage, what can a single large tree do?", opts: ["Cool a whole city", "Provide a day's oxygen for two people", "Replace an air conditioner", "Stop traffic noise"], ans: 1,
        exp: "原文 “A single large tree can provide a day's oxygen for two people”，选 B。" },
      { q: "Why are parks good for people?", opts: ["They are free to enter", "They help people relax and exercise", "They sell fresh food", "They are louder than streets"], ans: 1,
        exp: "短文提到 “parks give people a place to relax and exercise, which is good for both body and mind”，选 B。" },
      { q: "How can trees save energy for houses?", opts: ["By producing electricity", "By reducing the need for air conditioning and heating", "By blocking sunlight completely", "By storing water"], ans: 1,
        exp: "结尾说明 “Houses with trees around them need less air conditioning in summer and less heating in winter”，选 B。" }
    ]
  }
];
