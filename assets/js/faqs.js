(function(){
  var calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* Chat demo */
  var box=document.getElementById('ctB'),D=JSON.parse(document.getElementById('ctD').textContent),bs=[].slice.call(document.querySelectorAll('.ct__c button')),cur=-1,tm=[],auto;
  function add(c,t){var p=document.createElement('p');p.className=c;if(t)p.textContent=t;box.appendChild(p);return p}
  function say(i,user){
    tm.forEach(clearTimeout);tm=[];box.textContent='';cur=i;
    bs.forEach(function(b,j){b.classList.toggle('on',j===i);b.setAttribute('aria-pressed',j===i?'true':'false')});
    add('me',D[i].q);
    if(calm){add('ai',D[i].a);return}
    tm.push(setTimeout(function(){
      var t=add('ai ty');t.innerHTML='<i></i><i></i><i></i>';
      tm.push(setTimeout(function(){box.removeChild(t);add('ai',D[i].a)},900));
    },450));
    if(user)clearInterval(auto);
  }
  bs.forEach(function(b,i){b.addEventListener('click',function(){say(i,true)})});
  say(0);
  if(!calm)auto=setInterval(function(){if(!document.hidden)say((cur+1)%D.length)},6500);
  /* Search */
  var q=document.getElementById('fq'),gs=[].slice.call(document.querySelectorAll('.fg')),ds=[].slice.call(document.querySelectorAll('.fg details')),fr=document.getElementById('fr'),fx=document.getElementById('fx');
  ds.forEach(function(d){d._s=d.querySelector('summary').firstChild;d._t=d._s.nodeValue;d._o=d.open});
  function mark(d,w){
    var s=d.querySelector('summary'),n=s.querySelector('mark');
    if(n){s.replaceChild(document.createTextNode(d._t),s.firstChild===n?n:s.firstChild);while(s.childNodes.length>2)s.removeChild(s.childNodes[1])}
    var txt=s.firstChild,idx=w?d._t.toLowerCase().indexOf(w):-1;
    if(idx<0)return;
    var a=document.createTextNode(d._t.slice(0,idx)),m=document.createElement('mark'),b=document.createTextNode(d._t.slice(idx+w.length));
    m.textContent=d._t.slice(idx,idx+w.length);s.insertBefore(a,txt);s.insertBefore(m,txt);s.insertBefore(b,txt);s.removeChild(txt);
  }
  q.addEventListener('input',function(){
    var w=q.value.trim().toLowerCase(),n=0;
    ds.forEach(function(d){var on=!w||d.dataset.q.indexOf(w)>-1;d.hidden=!on;if(on)n++;d.open=w?on:d._o;mark(d,w)});
    gs.forEach(function(g){g.hidden=!g.querySelector('details:not([hidden])')});
    fr.textContent=w?n+(n===1?' question found':' questions found'):'';fx.hidden=n>0;
  });
  q.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();document.querySelector('.fm').scrollIntoView({behavior:calm?'auto':'smooth'})}});
  /* Topic highlight */
  var ls=[].slice.call(document.querySelectorAll('.fn a')),busy=false;
  function sc(){busy=false;var c=0;gs.forEach(function(g,i){if(!g.hidden&&g.getBoundingClientRect().top<innerHeight*.3)c=i});ls.forEach(function(a,i){a.classList.toggle('on',i===c);if(i===c&&a.parentNode.parentNode.scrollWidth>a.parentNode.parentNode.clientWidth)a.parentNode.parentNode.scrollLeft=a.offsetLeft-20})}
  addEventListener('scroll',function(){if(!busy){busy=true;requestAnimationFrame(sc)}},{passive:true});sc();
})();
