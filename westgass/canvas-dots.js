const c=document.getElementById('dotsCanvas'),ctx=c.getContext('2d',{alpha:false});
c.width=1300;c.height=1400;
let dots=[],pulseDots=[],animating=new Set();

// Load coordinate data
fetch('dots-data.json')
  .then(r=>r.json())
  .then(coords=>{
    for(let i=0;i<coords.length;i+=2)dots.push({x:coords[i],y:coords[i+1]});
    console.log(`Loaded ${dots.length} dots`);
    
    // Mark pulse dots (customize indices as needed)
    [100,500,1000,1500,2000].forEach(i=>pulseDots.push(dots[i]));
    console.log(`Pulse dots: ${pulseDots.length}`);
    
    drawDots();
    initPulse();
  })
  .catch(e=>console.error('Failed to load dots:',e));

function drawDots(){
  ctx.fillStyle='rgba(75,145,225,0.4)';
  dots.forEach(d=>{
    ctx.beginPath();
    ctx.arc(d.x,d.y,1.5,0,Math.PI*2);
    ctx.fill();
  });
  // Draw pulse dots
  ctx.fillStyle='#49C4D5';
  pulseDots.forEach(d=>{
    ctx.beginPath();
    ctx.arc(d.x,d.y,1.5,0,Math.PI*2);
    ctx.fill();
  });
}

function ripple(pd){
  const s=Date.now();
  animating.add(pd);
  
  function animate(){
    const t=(Date.now()-s)/1000;
    if(t>2){animating.delete(pd);return;}
    
    ctx.clearRect(0,0,c.width,c.height);
    drawDots();
    
    // Pulse center dot
    if(t<1.2){
      const sc=t<0.36?1+Math.sin(t*Math.PI/0.36)*0.2:1;
      const clr=t<0.72?lerpColor('#49C4D5','#632C8F',Math.sin(t*Math.PI/0.72)):'#49C4D5';
      ctx.fillStyle=clr;
      ctx.beginPath();
      ctx.arc(pd.x,pd.y,1.5*sc,0,Math.PI*2);
      ctx.fill();
    }
    
    // Ripple wave
    dots.forEach(d=>{
      if(d===pd)return;
      const dist=Math.sqrt((d.x-pd.x)**2+(d.y-pd.y)**2);
      if(dist>100)return;
      
      const delay=dist/0.15/1000;
      if(t<delay||t>delay+0.4)return;
      
      const wt=(t-delay)/0.4;
      const int=(1-dist/100)**2;
      const sc=wt<0.5?1+(1.02+int*0.18-1)*Math.sin(wt*Math.PI):1;
      const clr=wt<0.5?lerpColor('rgba(75,145,225,0.4)','#31AABB',Math.sin(wt*Math.PI)):'rgba(75,145,225,0.4)';
      
      ctx.fillStyle=clr;
      ctx.beginPath();
      ctx.arc(d.x,d.y,1.5*sc,0,Math.PI*2);
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  animate();
}

function lerpColor(c1,c2,t){
  const h2r=c=>parseInt(c.slice(1,3),16),h2g=c=>parseInt(c.slice(3,5),16),h2b=c=>parseInt(c.slice(5,7),16);
  const r=Math.round(h2r(c1)+(h2r(c2)-h2r(c1))*t);
  const g=Math.round(h2g(c1)+(h2g(c2)-h2g(c1))*t);
  const b=Math.round(h2b(c1)+(h2b(c2)-h2b(c1))*t);
  return `rgb(${r},${g},${b})`;
}

function initPulse(){
  pulseDots.forEach((pd,i)=>{
    setTimeout(()=>{
      ripple(pd);
      (function schedule(){
        setTimeout(()=>{ripple(pd);schedule();},(3+Math.random()*5)*1000);
      })();
    },Math.random()*3000);
  });
}
