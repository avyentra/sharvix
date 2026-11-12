/* Testimonials: reviews change on their own, and clicking a photo jumps to that review */
(function () {
  var data = window.AVY_TESTIMONIALS || [];
  var rail = document.getElementById('testiRail');
  if (!rail || !data.length) return;
  var section = document.getElementById('testimonials');
  var photo = document.getElementById('testiPhoto');
  var name = document.getElementById('testiName');
  var role = document.getElementById('testiRole');
  var quote = document.getElementById('testiQuote');
  var link = document.getElementById('testiLink');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var current = Math.max(0, data.findIndex(function (t) { return t.active; }));

  var picks = Array.prototype.slice.call(rail.querySelectorAll('.testi__pick'));

  function fill(t) {
    photo.src = t.photo;
    photo.alt = t.name;
    name.textContent = t.name;
    role.textContent = t.role;
    quote.textContent = t.quote;
    link.href = t.video || '#';
  }

  var timer;
  function show(i) {
    if (i === current) return;
    new Image().src = data[i].photo;
    current = i;
    picks.forEach(function (p, j) { p.setAttribute('aria-pressed', j === i); });
    clearTimeout(timer);
    if (calm) { fill(data[i]); return; }
    section.classList.add('is-swapping');
    timer = setTimeout(function () {
      fill(data[i]);
      section.classList.remove('is-swapping');
    }, 250);
  }
  /* Auto-play: pauses on hover or keyboard focus, and while off screen */
  var DELAY = 5000, auto = null, hovering = false, visible = false;
  function stop() { clearInterval(auto); auto = null; }
  function start() {
    stop();
    if (calm || hovering || !visible || data.length < 2) return;
    auto = setInterval(function () { show((current + 1) % data.length); }, DELAY);
  }
  picks.forEach(function (p, i) {
    p.addEventListener('click', function () { show(i); start(); });
  });
  var row = rail.closest('.testi__row');
  row.addEventListener('pointerenter', function () { hovering = true; stop(); });
  row.addEventListener('pointerleave', function () { hovering = false; start(); });
  row.addEventListener('focusin', function () { hovering = true; stop(); });
  row.addEventListener('focusout', function () { hovering = false; start(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: .3 }).observe(row);
  } else { visible = true; start(); }
})();
