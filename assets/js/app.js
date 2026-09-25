/* ===== 侧边栏导航 + 公共初始化 ===== */
const NAV = [
  { page: 'index',       href: 'index.html',       ico: '📊', label: '总览' },
  { page: 'vocab',       href: 'vocab.html',       ico: '📚', label: '词汇本' },
  { page: 'listening',   href: 'listening.html',   ico: '🎧', label: '听力' },
  { page: 'reading',     href: 'reading.html',     ico: '📖', label: '阅读' },
  { page: 'writing',     href: 'writing.html',     ico: '✍️', label: '写作' },
  { page: 'translation', href: 'translation.html', ico: '🌐', label: '翻译' },
  { page: 'quiz',        href: 'quiz.html',        ico: '🃏', label: '自测' },
  { page: 'checkin',     href: 'checkin.html',     ico: '✅', label: '打卡' },
];

function renderSidebar() {
  const cur = document.body.getAttribute('data-page');
  const nav = document.getElementById('sidebar');
  if (!nav) return;
  const links = NAV.map(n => `
    <a href="${n.href}" class="${n.page === cur ? 'active' : ''}">
      <span class="ico">${n.ico}</span><span class="label">${n.label}</span>
    </a>`).join('');
  nav.innerHTML = `
    <div class="brand"><span class="logo">📚</span><span class="name">四级备考工作台</span></div>
    <nav>${links}</nav>
    <div class="side-foot">保过 425 · ${daysUntil(EXAM_DATE)} 天倒计时</div>`;
}

/* 页面公共初始化：渲染侧边栏 + 注册 Service Worker */
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  // 更新全站倒计时角标
  const badges = document.querySelectorAll('[data-countdown]');
  badges.forEach(b => b.textContent = daysUntil(EXAM_DATE) + ' 天');
});
