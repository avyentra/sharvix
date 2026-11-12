/* Scroll reveals, stat counters, hero tilt, network canvas, marquee loop */
(function () {
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Marquee: duplicate each track so the -50% loop is seamless */
  document.querySelectorAll('[data-marquee]').forEach(function (t) {
    Array.prototype.slice.call(t.children).forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('img').forEach(function (i) { i.alt = ''; });
      t.appendChild(c);
    });
    // a second copy keeps wide screens filled
    Array.prototype.slice.call(t.children).forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('img').forEach(function (i) { i.alt = ''; });
      t.appendChild(c);
    });
  });

  /* Reveal on scroll */
  var items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || calm) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Stat counters */
  var fmt = function (n) { return n.toLocaleString('en-US'); };
  function count(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null, dur = 1800;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(Math.round(end * e)) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll('[data-count]');
  if (!calm && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { count(e.target); co.unobserve(e.target); }
      });
    }, { threshold: .6 });
    nums.forEach(function (n) { co.observe(n); });
  }

  if (calm) return;

  /* Hero: marquee text drifts on scroll */
  var mark = document.getElementById('watermark');
  if (mark) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < innerHeight * 1.2) mark.style.transform = 'translateY(' + y * .12 + 'px)';
    }, { passive: true });
  }

  /* About: drifting network of light points, runs only while on screen */
  var cv = document.getElementById('netCanvas');
  if (!cv || window.innerWidth < 821) return; // skipped on phones to keep them fast
  var ctx = cv.getContext('2d'), W = 0, H = 0, pts = [], on = false, dpr = Math.min(devicePixelRatio || 1, 2);
  function size() {
    W = cv.offsetWidth; H = cv.offsetHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(46, W / 34));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() * 1.4 + .5 });
  }
  function draw() {
    if (!on) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3);
      ctx.fillStyle = 'rgba(120,210,255,.65)'; ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) {
          ctx.strokeStyle = 'rgba(100,170,255,' + (1 - d / 130) * .16 + ')';
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  size();
  window.addEventListener('resize', size);
  new IntersectionObserver(function (es) {
    var v = es[0].isIntersecting;
    if (v && !on) { on = true; draw(); } else if (!v) on = false;
  }).observe(cv);
})();
