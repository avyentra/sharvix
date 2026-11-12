(function(){
  var calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* Hero wall loads after the page has settled */
  addEventListener('load',function(){setTimeout(function(){
    document.querySelectorAll('.wall img[data-src]').forEach(function(i){i.src=i.dataset.src});
  },600)});
  var hero=document.querySelector('.wk-hero'),wall=document.querySelector('.wall');
  if(!calm&&matchMedia('(pointer:fine)').matches&&hero){
    hero.addEventListener('mousemove',function(e){
      var r=hero.getBoundingClientRect();
      wall.style.setProperty('--wy',((e.clientX-r.left)/r.width-.5)*8+'deg');
      wall.style.setProperty('--wx',((e.clientY-r.top)/r.height-.5)*-6+'deg');
    });
  }
  /* Filter */
  var btn=[].slice.call(document.querySelectorAll('.flt button')),cards=[].slice.call(document.querySelectorAll('.wc')),live=document.querySelector('.wk-live');
  btn.forEach(function(b){
    var k=b.dataset.f;
    b.querySelector('span').textContent=cards.filter(function(c){return k==='all'||c.dataset.c.split(' ').indexOf(k)>-1}).length;
    b.addEventListener('click',function(){
      function run(){
        var n=0;
        btn.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
        cards.forEach(function(c){var on=k==='all'||c.dataset.c.split(' ').indexOf(k)>-1;c.hidden=!on;if(on)n++});
        live.textContent=n+' projects shown';
      }
      if(document.startViewTransition&&!calm)document.startViewTransition(run);else run();
    });
  });
})();
