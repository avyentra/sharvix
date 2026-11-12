/* Service tabs: the content is in index.html, this only switches panels */
(function () {
  var rail = document.getElementById('serviceRail');
  if (!rail) return;
  var tabs = Array.prototype.slice.call(rail.querySelectorAll('.rail__tab'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

  function select(i, focus) {
    tabs.forEach(function (t, j) {
      t.setAttribute('aria-selected', j === i);
      t.tabIndex = j === i ? 0 : -1;
      panels[j].hidden = j !== i;
      panels[j].classList.remove('is-changing');
    });
    void panels[i].offsetWidth;
    panels[i].classList.add('is-changing');
    if (focus) tabs[i].focus();
    if (rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: tabs[i].offsetLeft - 16, behavior: 'smooth' });
  }
  tabs.forEach(function (t, i) { t.addEventListener('click', function () { select(i); }); });
  rail.addEventListener('keydown', function (e) {
    var i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (map[e.key]) { e.preventDefault(); select((i + map[e.key] + tabs.length) % tabs.length, true); }
    if (e.key === 'Home') { e.preventDefault(); select(0, true); }
    if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
  });

  /* AI illustration: layers follow the pointer */
  var st = document.getElementById('aiStage');
  if (st && window.matchMedia('(hover:hover)').matches) {
    st.addEventListener('pointermove', function (e) {
      var r = st.getBoundingClientRect();
      st.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3));
      st.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3));
    });
    st.addEventListener('pointerleave', function () {
      st.style.setProperty('--px', 0);
      st.style.setProperty('--py', 0);
    });
  }
})();
