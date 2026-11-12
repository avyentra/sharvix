/* Photos: if Unsplash is blocked, load the same photo through a backup image server */
(function () {
  function useBackup(img) {
    if (img.dataset.backup) return;
    img.dataset.backup = '1';
    var w = img.getAttribute('src').match(/[?&](?:amp;)?w=(\d+)/);
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.src = 'https://wsrv.nl/?url=' + encodeURIComponent(img.getAttribute('src').split('?')[0]) + '&w=' + (w ? w[1] : 1000) + '&q=75&output=webp';
  }
  document.querySelectorAll('img[src*="images.unsplash.com"]').forEach(function (img) {
    img.loading = 'eager';
    img.addEventListener('error', function () { useBackup(img); });
    if (img.complete && !img.naturalWidth) useBackup(img);
  });
})();

/* Header, mobile menu, nav highlighting, quote form */
(function () {
  var header = document.querySelector('.site-header');
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Highlight the nav item for the section in view; Services shows at the top, as in the design */
  var links = Array.prototype.slice.call(nav.querySelectorAll('.nav__link:not([data-nospy])'));
  var spy = links.map(function (a) { return a.hash ? document.getElementById(a.hash.slice(1)) : null; });
  var onHome = spy.some(Boolean);
  function activate(i) { links.forEach(function (a, j) { a.classList.toggle('is-active', j === i); }); }
  function spyScroll() {
    var y = window.scrollY + innerHeight * .45, top = -1, pick = 0;
    spy.forEach(function (s, i) {
      if (s && s.offsetTop <= y && s.offsetTop > top) { top = s.offsetTop; pick = i; }
    });
    activate(pick);
  }
  if (onHome) {
    spyScroll();
    window.addEventListener('scroll', spyScroll, { passive: true });
  }

  /* Quote form: checks the fields, then emails the enquiry through send-enquiry.php. */
  var form = document.getElementById('quoteForm');
  if (!form) return;
  var note = document.getElementById('quoteNote');
  var details = document.getElementById('fDetails');
  var counter = document.getElementById('charCount');

  details.addEventListener('input', function () { counter.textContent = details.value.length + '/500'; });
  form.querySelectorAll('select').forEach(function (s) {
    var sync = function () { s.classList.toggle('is-empty', !s.value); };
    s.addEventListener('change', sync); sync();
  });

  var messages = {
    name: 'Enter your name.',
    phone: 'Enter a phone number with at least 7 digits.',
    email: 'Enter an email like you@company.com.',
    service: 'Select a service.',
    details: 'Tell us a little about your project.'
  };
  function check(el) {
    var ok = el.value.trim() !== '';
    if (el.name === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
    if (el.name === 'phone') ok = el.value.replace(/\D/g, '').length >= 7;
    var field = el.closest('.field');
    field.classList.toggle('is-bad', !ok);
    field.querySelector('.err').textContent = ok ? '' : messages[el.name];
    el.setAttribute('aria-invalid', !ok);
    return ok;
  }
  var required = Array.prototype.slice.call(form.querySelectorAll('[required]'));
  required.forEach(function (el) {
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-bad')) check(el); });
    el.addEventListener('change', function () { if (el.closest('.field').classList.contains('is-bad')) check(el); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = required.filter(function (el) { return !check(el); });
    if (bad.length) { bad[0].focus(); return; }
    window.sendEnquiryForm(form, note, 'Home page', function () {
      counter.textContent = '0/500';
      form.querySelectorAll('select').forEach(function (x) { x.classList.add('is-empty'); });
    });
  });
})();

/* Custom cursor for mouse users */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var root = document.documentElement, dot = document.createElement('i'), ring = document.createElement('i');
  dot.className = 'cc-d'; ring.className = 'cc-r';
  dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot); document.body.appendChild(ring);
  root.classList.add('cc');
  var x = 0, y = 0, rx = 0, ry = 0, run = false, seen = false;
  function tick() {
    rx += (x - rx) * .2; ry += (y - ry) * .2;
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    if (Math.abs(x - rx) + Math.abs(y - ry) > .2) requestAnimationFrame(tick); else run = false;
  }
  addEventListener('mousemove', function (e) {
    x = e.clientX; y = e.clientY;
    dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    if (!seen) { seen = true; rx = x; ry = y; root.classList.add('cc-on'); }
    if (!run) { run = true; requestAnimationFrame(tick); }
  }, { passive: true });
  document.addEventListener('mouseover', function (e) {
    var t = e.target, v = t.closest && t.closest('[data-cur]'),
      l = t.closest && t.closest('a,button,summary,label,select,[role=button],[tabindex="0"]');
    ring.textContent = v ? v.getAttribute('data-cur') : '';
    ring.classList.toggle('is-view', !!v);
    ring.classList.toggle('is-link', !!l && !v);
    root.classList.toggle('cc-view', !!v);
  });
  document.addEventListener('mouseleave', function () { root.classList.remove('cc-on'); seen = false; });
})();
