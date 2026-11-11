/* =========================================================
   SHARVIX STUDIO — site script (shared by all pages)
   ========================================================= */
(function(){
  "use strict";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Where enquiry / enrolment forms are delivered.
     Uses FormSubmit (formsubmit.co) — no server needed.
     The FIRST submission sends an activation email to this address: open it and click "Activate". */
  var FORM_EMAIL = 'manu.innn@gmail.com';
  var WHATSAPP   = '918360631515';

  /* ---------- Nav: scrolled style, active link, mobile menu ---------- */
  var nav = $('#nav'), toTop = $('#toTop'), burger = $('#burger');
  var links = $$('.nav-links a[href^="#"]');
  var sections = links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  function onScroll(){
    var y = window.scrollY;
    if(nav) nav.classList.toggle('scrolled', y > 60 || nav.classList.contains('solid'));
    if(toTop) toTop.classList.toggle('show', y > 700);
    var current = null;
    sections.forEach(function(s){ if(s.getBoundingClientRect().top < 150) current = s.id; });
    links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  if(burger && nav){
    var closeMenu = function(){ nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); };
    burger.addEventListener('click', function(){
      var o = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(o));
      burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    });
    $$('.nav-links a').forEach(function(a){ a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Hero typing: rotating words (home page) ----------
     Edit this list to change the words in the banner. */
  var typed = $('#typed');
  if(typed){
    var WORDS = ["remember", "talk about", "come back to", "love to share"];
    if(reduce){
      var r = 0; typed.textContent = WORDS[0];
      setInterval(function(){ r = (r + 1) % WORDS.length; typed.textContent = WORDS[r]; }, 2500);
    } else {
      var w = 0, c = 0, deleting = false;
      typed.textContent = '';
      (function loop(){
        var word = WORDS[w];
        if(!deleting){
          c++; typed.textContent = word.slice(0, c);
          if(c === word.length){ deleting = true; return setTimeout(loop, 1800); }
          return setTimeout(loop, 70 + Math.random()*50);
        }
        c--; typed.textContent = word.slice(0, c);
        if(c === 0){ deleting = false; w = (w + 1) % WORDS.length; return setTimeout(loop, 350); }
        setTimeout(loop, 35);
      })();
    }
  }

  /* ---------- Scroll reveal + counters ---------- */
  function countUp(el){
    var to = +el.dataset.to, start = null, dur = 1600;
    function f(ts){
      if(!start) start = ts;
      var p = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if(p < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        en.target.classList.add('in');
        $$('.count', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
    $$('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    $$('.reveal').forEach(function(el){ el.classList.add('in'); });
    $$('.count').forEach(function(el){ el.textContent = el.dataset.to; });
  }

  /* ---------- Testimonials slider (home page) ---------- */
  var avWrap = $('#avatars'), tBody = $('.t-body');
  if(avWrap && tBody){
    /* SAMPLE testimonials — replace with real client reviews */
    var T = [
      { name:"Jonathan Raabe", role:"Tech blogger", img:"assets/av-center.webp", color:"#040b1b",
        quote:"Working with Sharvix Studio was easy from day one. They understood exactly what we needed, kept us updated at every step and delivered a website we are genuinely proud of." },
      { name:"Sarah Mitchell", role:"Founder, Bloom Studio", color:"#5f00fc",
        quote:"Sharvix Studio turned our rough idea into a polished product in record time. Their designers and developers felt like an extension of our own team." },
      { name:"Arjun Mehta", role:"CTO, FinEdge", color:"#23e5bc",
        quote:"Clean code, clear communication and on-time delivery. Every launch with Sharvix Studio has been smoother than the last." },
      { name:"Emily Carter", role:"Product manager", color:"#7b2bff",
        quote:"From UX research to the final app store release, the process was transparent and collaborative. Our users love the new experience." },
      { name:"David Lee", role:"CEO, Ryde Mobility", color:"#3b10c9",
        quote:"They understood our business quickly and built a scalable platform that grew with us. Highly recommended for any growing business." }
    ];
    var qEl = $('#tQuote'), nEl = $('#tName'), rEl = $('#tRole'), cur = 0, timer = null;
    var initials = function(n){ return n.split(' ').map(function(x){ return x[0]; }).join('').slice(0,2); };
    var renderAvatars = function(){
      var html = '';
      for(var off = -2; off <= 2; off++){
        var i = (cur + off + T.length) % T.length, t = T[i];
        var inner = t.img ? '<img src="' + t.img + '" alt="">' : '<span style="font-size:' + (off === 0 ? 18 : 12) + 'px">' + initials(t.name) + '</span>';
        html += '<button class="av s' + Math.abs(off) + '" data-i="' + i + '" aria-label="' + t.name + '" style="background:' + (t.img ? '#ddd' : t.color) + '">' + inner + '</button>';
      }
      avWrap.innerHTML = html;
    };
    var show = function(i, instant){
      cur = (i + T.length) % T.length;
      var t = T[cur];
      var apply = function(){ qEl.textContent = t.quote; nEl.textContent = t.name; rEl.textContent = t.role; renderAvatars(); tBody.classList.remove('swap'); };
      if(instant){ apply(); return; }
      tBody.classList.add('swap'); setTimeout(apply, 380);
    };
    var restart = function(){ clearInterval(timer); if(!reduce) timer = setInterval(function(){ show(cur + 1); }, 6000); };
    $('#tPrev').addEventListener('click', function(){ show(cur - 1); restart(); });
    $('#tNext').addEventListener('click', function(){ show(cur + 1); restart(); });
    avWrap.addEventListener('click', function(e){ var b = e.target.closest('.av'); if(b){ show(+b.dataset.i); restart(); } });
    show(0, true); restart();
  }

  /* ---------- FAQ: only one answer open at a time ---------- */
  $$('.faq-list').forEach(function(list){
    var qas = $$('.qa', list);
    qas.forEach(function(d){
      d.addEventListener('toggle', function(){ if(d.open) qas.forEach(function(o){ if(o !== d) o.open = false; }); });
    });
  });

  /* ---------- Forms → email (FormSubmit) with WhatsApp fallback ----------
     Any <form data-form="Subject line"> is handled here. */
  var emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var phoneRx = /^[+\d][\d\s-]{8,15}$/;
  $$('form[data-form]').forEach(function(form){
    var status = $('.form-status', form);
    var btn = $('button[type="submit"]', form);
    var setStatus = function(msg, type){ if(!status) return; status.textContent = msg; status.className = 'form-status ' + (type || ''); };

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var honey = form.querySelector('[name="_honey"]');
      if(honey && honey.value) return; /* bot */

      /* validation */
      var bad = null;
      $$('[required]', form).forEach(function(f){
        f.classList.remove('invalid');
        var v = (f.type === 'checkbox') ? f.checked : f.value.trim();
        var ok = !!v;
        if(ok && f.type === 'email') ok = emailRx.test(v);
        if(ok && f.type === 'tel') ok = phoneRx.test(v);
        if(!ok){ f.classList.add('invalid'); if(!bad) bad = f; }
      });
      if(bad){ setStatus('Please fill in the highlighted fields correctly.', 'err'); bad.focus(); return; }

      /* collect data */
      var data = {};
      $$('input, select, textarea', form).forEach(function(f){
        if(!f.name || f.name === '_honey') return;
        if(f.type === 'checkbox'){ data[f.name] = f.checked ? 'Yes' : 'No'; return; }
        data[f.name] = f.value.trim();
      });
      data._subject = form.dataset.form + ' — Sharvix Studio website';
      data._template = 'table';
      data._captcha = 'false';
      data.page = location.href;

      var label = btn ? btn.innerHTML : '';
      if(btn){ btn.disabled = true; btn.innerHTML = 'Sending…'; }
      setStatus('', '');

      fetch('https://formsubmit.co/ajax/' + FORM_EMAIL, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(r){ if(!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function(res){
        /* FormSubmit answers 200 with success:"false" until the inbox is activated */
        if(String(res.success) !== 'true') throw new Error(res.message || 'Not delivered');
        form.reset();
        setStatus('Thank you! Your message has been sent. We will get back to you within 24 hours.', 'ok');
      })
      .catch(function(){
        /* Fallback: send the same details on WhatsApp */
        var lines = Object.keys(data).filter(function(k){ return k.charAt(0) !== '_' && k !== 'page' && data[k]; })
                      .map(function(k){ return k.replace(/_/g, ' ') + ': ' + data[k]; });
        var text = form.dataset.form + '\n' + lines.join('\n');
        var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);
        if(status){
          status.className = 'form-status err';
          status.textContent = 'Could not send right now. ';
          var link = document.createElement('a');
          link.href = url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'Send your details on WhatsApp';
          status.appendChild(link);
        }
      })
      .then(function(){ if(btn){ btn.disabled = false; btn.innerHTML = label; } });
    });

    $$('[required]', form).forEach(function(f){
      f.addEventListener('input', function(){ f.classList.remove('invalid'); });
      f.addEventListener('change', function(){ f.classList.remove('invalid'); });
    });
  });

  /* ---------- Portfolio images: graceful fallback if Behance image can't load ---------- */
  $$('.pf-img img').forEach(function(img){
    var fail = function(){ img.parentNode.classList.add('pf-fallback'); img.remove(); };
    if(img.complete && img.naturalWidth === 0 && img.src) fail(); else img.addEventListener('error', fail);
  });

  $$('.hx-shot img').forEach(function(img){
    var fail = function(){ img.parentNode.classList.add('fail'); img.remove(); };
    if(img.complete && img.naturalWidth === 0) fail(); else img.addEventListener('error', fail);
  });

  /* ---------- Portfolio filters ---------- */
  var fbtns = $$('.w2-filters button'), bcards = $$('.bento .bn-card');
  fbtns.forEach(function(b){
    b.addEventListener('click', function(){
      var f = b.dataset.f;
      fbtns.forEach(function(x){ var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
      bcards.forEach(function(c){
        var show = f === 'all' || c.dataset.cat === f || c.dataset.cat === 'all';
        c.classList.toggle('hide', !show);
        if(show){ c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); c.classList.add('in'); }
      });
    });
  });

  /* ---------- Plain "#" links shouldn't jump ---------- */
  $$('a[href="#"]').forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); }); });

  var yr = $('#yr'); if(yr) yr.textContent = new Date().getFullYear();
})();
