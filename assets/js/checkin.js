/* 每日打卡逻辑 */
(function () {
  const TASKS = [
    "📚 背 20 个新词 + 复习旧词",
    "🎧 精听 / 影子跟读 1 篇",
    "📖 仔细阅读 1 篇",
    "✍️ 写作练习 15 分钟",
    "🃏 自测 10 题",
    "🌐 翻译 1 段并背重点表达",
    "🔁 复习错题 / 笔记"
  ];

  function loadTasks() {
    const all = Store.get('checkinTasks', {});
    return all[todayKey()] || [];
  }
  function saveTasks(arr) {
    const all = Store.get('checkinTasks', {});
    all[todayKey()] = arr;
    Store.set('checkinTasks', all);
  }
  function datesSet() { return new Set(Store.get('checkinDates', [])); }

  function render() {
    const doneIdx = loadTasks();
    const today = todayKey();
    document.getElementById('today').textContent = today.slice(5);
    document.getElementById('tasks').innerHTML = TASKS.map((t, i) => {
      const done = doneIdx.includes(i);
      return `<div class="task ${done ? 'done' : ''}" data-i="${i}">
        <span class="check">${done ? '✓' : ''}</span><span class="t-name">${t}</span></div>`;
    }).join('');
    document.querySelectorAll('#tasks .task').forEach(el => el.onclick = () => {
      const i = +el.dataset.i;
      let arr = loadTasks();
      if (arr.includes(i)) arr = arr.filter(x => x !== i); else arr.push(i);
      saveTasks(arr); render();
    });

    const ds = datesSet();
    document.getElementById('streak').textContent = streakCount([...ds]);
    document.getElementById('totalDays').textContent = ds.size;
    const done = loadTasks().length;
    document.getElementById('doneHint').textContent = done > 0 ? `今日已完成 ${done}/${TASKS.length} 项` : '还没有勾选任务';
    document.getElementById('checkinBtn').disabled = done === 0;

    // 最近7天
    const strip = document.getElementById('weekStrip');
    let html = '';
    for (let off = -6; off <= 0; off++) {
      const dk = dateKeyOffset(off);
      const marked = ds.has(dk);
      const dow = ['日','一','二','三','四','五','六'][new Date(dk).getDay()];
      html += `<div class="card" style="text-align:center;padding:12px 6px;border-color:${marked ? 'rgba(46,125,87,.5)' : 'var(--line)'}">
        <div class="c-ico">${marked ? '✅' : '⬜'}</div>
        <div class="muted" style="font-size:13px;margin-top:4px">周${dow}</div>
        <div class="muted" style="font-size:12px">${dk.slice(5)}</div></div>`;
    }
    strip.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('checkinBtn').onclick = () => {
      const ds = datesSet();
      ds.add(todayKey());
      Store.set('checkinDates', [...ds]);
      toast('✅ 今日打卡成功，连续 ' + streakCount([...ds]) + ' 天');
      render();
    };
    document.getElementById('resetToday').onclick = () => {
      saveTasks([]);
      toast('已重置今天任务');
      render();
    };
    render();
  });
})();
