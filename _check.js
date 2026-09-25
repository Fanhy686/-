global.window={};const fs=require('fs');eval(fs.readFileSync('d:/英语学习工作台/assets/js/translation-data.js','utf8'));
const T=window.TRANSLATION;console.log('count',T.length);
console.log('cnChars',T.map(t=>t.cn.replace(/[^一-龥]/g,'').length).join(','));
console.log('enWords',T.map(t=>t.en.split(/\s+/).length).join(','));
console.log('keysInEn',T.map(t=>t.keys.filter(k=>{const e=k.split(/\s{1,}(?=[一-龥])/)[0];return t.en.toLowerCase().includes(e.toLowerCase());}).length+'/'+t.keys.length).join(','));
T.forEach((t,i)=>{const c=t.cn.replace(/[^一-龥]/g,'').length;const w=t.en.split(/\s+/).length;const bad=t.keys.filter(k=>{const e=k.split(/\s{1,}(?=[一-龥])/)[0];return !t.en.toLowerCase().includes(e.toLowerCase());});
if(c<140||c>180||w<80||w>130||bad.length)console.log('FAIL',i,t.title,'cn',c,'en',w,'miss',JSON.stringify(bad));});
