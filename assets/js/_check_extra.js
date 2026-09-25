global.window={};const fs=require('fs');eval(fs.readFileSync('d:/英语学习工作台/assets/js/reading-extra.js','utf8'));
const R=window.READING_EXTRA;
console.log('count',R.length);
console.log('q',R.map(p=>p.questions.length).join(','));
console.log('words',R.map(p=>p.passage.split(/\s+/).length).join(','));
console.log('ans',R.map(p=>p.questions.map(x=>x.ans).join('')).join('|'));
console.log('opts',R.map(p=>p.questions.map(x=>x.opts.length).join('')).join('|'));
