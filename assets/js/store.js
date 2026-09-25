/* ===== 本地存储封装（纯前端、本机保存） ===== */
const Store = (() => {
  const PREFIX = 'cet4_';
  function get(key, fallback) {
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  }
  function set(key, val) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch (e) {}
  }
  function del(key) { try { localStorage.removeItem(PREFIX + key); } catch (e) {} }
  return { get, set, del };
})();

/* 考试日期（默认 2026-12-12 12月场） */
const EXAM_DATE = Store.get('examDate', '2026-12-12');
function daysUntil(dateStr) {
  const t = new Date(dateStr + 'T09:00:00').getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((t - now) / 86400000));
}

/* 日期工具 */
function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function dateKeyOffset(offset) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/* 简易吐司 */
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg; el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 1800);
}

/* 格式化连续天数显示 */
function streakCount(checkinDates) {
  // checkinDates: 已打卡日期数组(yyyy-mm-dd)
  const set = new Set(checkinDates);
  let n = 0;
  let d = new Date();
  // 若今天没打卡，从昨天起算（避免今天未打卡就清零）
  if (!set.has(fmt(d))) { d.setDate(d.getDate() - 1); }
  while (set.has(fmt(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function fmt(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
