(function(){
  var say=document.querySelector('.say'),fg=document.querySelector('.jr .fg');
  if(!say)return;
  var t=say.textContent.trim().split(/\s+/);
  say.innerHTML=t.map(function(w){return '<span>'+w+'</span>'}).join(' ');
  var w=say.children,ticking=false;
  function run(){
    ticking=false;
    var h=innerHeight,r=say.getBoundingClientRect();
    var p=Math.min(1,Math.max(0,(h*.82-r.top)/(r.height+h*.3)));
    var n=Math.round(p*w.length);
    for(var i=0;i<w.length;i++)w[i].classList.toggle('on',i<n);
    if(fg){var f=fg.getBoundingClientRect();var q=Math.min(1,Math.max(0,(h*.9-f.top)/(h*.6)));fg.style.setProperty('--o',1-q)}
  }
  function go(){if(!ticking){ticking=true;requestAnimationFrame(run)}}
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){for(var i=0;i<w.length;i++)w[i].classList.add('on');if(fg)fg.style.setProperty('--o',0);return}
  addEventListener('scroll',go,{passive:true});addEventListener('resize',go);run();
})();
(function(){
  var calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* Studio scene: idea to launch */
  var st=document.getElementById('studio'),btn=st?[].slice.call(st.querySelectorAll('[data-s]')):[],cs=1,wait=0,D=3800;
  function stage(n){
    st.className=st.className.replace(/\bs[1-4]\b/g,'').trim()+' s'+n;cs=n;
    btn.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.s==n?'true':'false')});
  }
  if(st){
    st.style.setProperty('--dur',D+'ms');
    btn.forEach(function(b){b.addEventListener('click',function(){wait=2;st.classList.add('hold');stage(+b.dataset.s)})});
    if(calm)stage(4);else{
      var inv=true;new IntersectionObserver(function(e){inv=e[0].isIntersecting}).observe(st);
      setInterval(function(){
        if(!inv||document.hidden)return;
        if(wait>0){wait--;if(!wait)st.classList.remove('hold');return}
        stage(cs%4+1);
      },D);
    }
  }

  /* Count up */
  var nums=document.querySelectorAll('.ab-bar [data-n]');
  if(!calm&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;io.unobserve(e.target);
      var el=e.target,n=+el.dataset.n,s=el.dataset.s||'',t0=performance.now();
      (function f(t){var p=Math.min(1,(t-t0)/1100),v=Math.round(n*(1-Math.pow(1-p,3)));el.textContent=v+s;if(p<1)requestAnimationFrame(f)})(t0);
    })},{threshold:.6});
    nums.forEach(function(n){io.observe(n)});
  }

  /* Layers follow the list */
  var stk=document.querySelector('.stk');
  document.querySelectorAll('.lay li').forEach(function(li){
    function on(v){stk.classList.toggle('has',v);stk.querySelectorAll('g').forEach(function(g){g.classList.toggle('hot',v&&g.dataset.l===li.dataset.l)})}
    li.addEventListener('mouseenter',function(){on(true)});li.addEventListener('mouseleave',function(){on(false)});
    li.addEventListener('focusin',function(){on(true)});li.addEventListener('focusout',function(){on(false)});
  });

  /* Principles rotate by themselves */
  var pan=document.querySelector('.pan'),ps=pan?[].slice.call(pan.children):[],cur=0,hold=false,tm;
  function show(i){ps.forEach(function(p,j){p.classList.toggle('on',j===i)});cur=i}
  ps.forEach(function(p,i){
    p.addEventListener('mouseenter',function(){hold=true;pan.classList.remove('auto');show(i)});
    p.addEventListener('focus',function(){hold=true;pan.classList.remove('auto');show(i)});
  });
  if(pan){pan.addEventListener('mouseleave',function(){hold=false});pan.addEventListener('focusout',function(){hold=false})}
  if(pan&&!calm&&innerWidth>1180){
    var po=new IntersectionObserver(function(es){
      clearInterval(tm);
      if(es[0].isIntersecting){pan.classList.add('auto');tm=setInterval(function(){if(!hold&&!document.hidden){pan.classList.add('auto');show((cur+1)%ps.length)}},4000)}
    },{threshold:.3});po.observe(pan);
  }

  /* Scroll progress, journey stops, hero parallax */
  var prog=document.createElement('div');prog.className='ab-prog';document.body.appendChild(prog);
  var stops=document.querySelectorAll('.jr li'),jr=document.querySelector('.jr'),busy=false;
  function sc(){
    busy=false;
    var d=document.documentElement,h=innerHeight;
    prog.style.setProperty('--p',scrollY/Math.max(1,d.scrollHeight-h));
    if(jr){var r=jr.getBoundingClientRect(),q=Math.min(1,Math.max(0,(h*.9-r.top)/(h*.6)));
      stops.forEach(function(s,i){s.classList.toggle('on',calm||q>=i/(stops.length-1)-.02)})}
  }
  addEventListener('scroll',function(){if(!busy){busy=true;requestAnimationFrame(sc)}},{passive:true});sc();
  var hero=document.querySelector('.ab-hero');
  var win=document.querySelector('.st__win');
  if(hero&&win&&!calm&&matchMedia('(pointer:fine)').matches){
    hero.addEventListener('mousemove',function(e){
      var r=hero.getBoundingClientRect();
      win.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*14+'deg');
      win.style.setProperty('--rx',((e.clientY-r.top)/r.height-.5)*-10+'deg');
    });
    hero.addEventListener('mouseleave',function(){win.style.removeProperty('--ry');win.style.removeProperty('--rx')});
  }

  /* Light particle network, started after the page settles */
  var cv=document.querySelector('.ab-pt');
  if(!cv||calm)return;
  function start(){
    var c=cv.getContext('2d'),dp=Math.min(devicePixelRatio||1,1.5),W,H,P=[],live=true;
    function size(){W=hero.clientWidth;H=hero.clientHeight;cv.width=W*dp;cv.height=H*dp;c.setTransform(dp,0,0,dp,0,0)}
    size();addEventListener('resize',size);
    var N=W<720?18:42;
    for(var i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,a:(Math.random()-.5)*.25,b:(Math.random()-.5)*.25,r:Math.random()*1.4+.6});
    new IntersectionObserver(function(e){live=e[0].isIntersecting;if(live)requestAnimationFrame(f)}).observe(hero);
    function f(){
      if(!live||document.hidden){if(live)setTimeout(function(){requestAnimationFrame(f)},500);return}
      c.clearRect(0,0,W,H);
      for(var i=0;i<N;i++){var p=P[i];p.x+=p.a;p.y+=p.b;
        if(p.x<0||p.x>W)p.a*=-1;if(p.y<0||p.y>H)p.b*=-1;
        c.fillStyle='rgba(70,80,220,.5)';c.beginPath();c.arc(p.x,p.y,p.r,0,6.3);c.fill();
        for(var j=i+1;j<N;j++){var q=P[j],dx=p.x-q.x,dy=p.y-q.y,d=dx*dx+dy*dy;
          if(d<14400){c.strokeStyle='rgba(70,80,220,'+(.16*(1-d/14400))+')';c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke()}}
      }
      requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }
  addEventListener('load',function(){setTimeout(start,1200)});
})();
