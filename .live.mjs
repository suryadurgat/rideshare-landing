import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
for (const vp of [{width:1440,height:900},{width:390,height:844}]) {
const p = await b.newPage({ viewport: vp });
const errs=[]; p.on('pageerror', e=>errs.push(e.message));
await p.goto('https://rideshare-landing-five.vercel.app/', { waitUntil: 'load' }); await p.waitForTimeout(3000);
const H = await p.evaluate(() => document.documentElement.scrollHeight); const bad=new Set();
for (let y=0;y<H;y+=vp.height*0.6){ await p.evaluate(yy=>scrollTo(0,yy),y); await p.waitForTimeout(900);
  (await p.evaluate(()=>[...document.images].filter(i=>{const b=i.getBoundingClientRect(); if(!(b.bottom>40&&b.top<innerHeight-40&&b.width>0&&b.left<innerWidth&&b.right>0))return false; const rv=i.closest('.will-change-transform.transition-\\[opacity\\,transform\\,filter\\]'); return !(i.complete&&i.naturalWidth>0)||(rv&&+getComputedStyle(rv).opacity<0.9);}).map(i=>`${i.getAttribute('src')} loaded=${i.complete&&i.naturalWidth>0}`))).forEach(s=>bad.add(s)); }
console.log(vp.width, 'hidden', [...bad], 'errors', errs); await p.close(); }
await b.close();
