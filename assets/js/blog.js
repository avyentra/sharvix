(function(){
  var calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* Hub: card deck */
  var dks=document.querySelector('.dks');
  if(dks&&!calm){
    var ds=[].slice.call(dks.children),hold=false;
    dks.addEventListener('mouseenter',function(){hold=true});dks.addEventListener('mouseleave',function(){hold=false});
    dks.addEventListener('focusin',function(){hold=true});dks.addEventListener('focusout',function(){hold=false});
    setInterval(function(){
      if(hold||document.hidden)return;
      ds.push(ds.shift());
      ds.forEach(function(d,i){d.className='dk p'+i;d.tabIndex=i?-1:0});
    },3800);
  }
  /* Hub: search and filter */
  var g=document.querySelector('.bg');
  if(g){
    var cs=[].slice.call(g.querySelectorAll('.bc-c')),q=document.getElementById('q'),no=document.getElementById('none'),bt=[].slice.call(document.querySelectorAll('.flt button')),f='All';
    function run(){
      var w=q.value.trim().toLowerCase(),n=0;
      cs.forEach(function(c){var on=(f==='All'||c.dataset.c===f)&&(!w||c.dataset.q.indexOf(w)>-1);c.hidden=!on;if(on)n++});
      g.classList.toggle('fl',f!=='All'||!!w);no.hidden=n>0;
    }
    q.addEventListener('input',run);
    q.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();document.getElementById('articles').scrollIntoView({behavior:calm?'auto':'smooth'})}});
    bt.forEach(function(b){b.addEventListener('click',function(){f=b.dataset.f;bt.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});run()})});
  }
  /* Article: reading progress and contents */
  var pr=document.querySelector('.pr');
  if(pr){
    var bar=document.createElement('div');bar.className='rp';document.body.appendChild(bar);
    var links=[].slice.call(document.querySelectorAll('.toc a')),hs=links.map(function(a){return document.querySelector(a.getAttribute('href'))}),busy=false;
    function sc(){
      busy=false;
      var r=pr.getBoundingClientRect(),h=innerHeight;
      bar.style.setProperty('--p',Math.min(1,Math.max(0,(h*.5-r.top)/r.height)));
      var c=0;hs.forEach(function(x,i){if(x.getBoundingClientRect().top<h*.35)c=i});
      links.forEach(function(a,i){a.classList.toggle('on',i===c)});
    }
    addEventListener('scroll',function(){if(!busy){busy=true;requestAnimationFrame(sc)}},{passive:true});sc();
  }
})();
