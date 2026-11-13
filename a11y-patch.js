/* a11y-patch.js — © Prapawadee_W. */
(function () {
  'use strict';
  var root = document.documentElement;

  function syncLang() {
    var l = root.getAttribute('data-lang');
    if (l && root.lang !== l) root.lang = l;
  }
  syncLang();
  new MutationObserver(syncLang).observe(root, { attributes: true, attributeFilter: ['data-lang'] });

  function prep() {
    document.querySelectorAll('th.sortable').forEach(function (th) {
      if (!th.hasAttribute('tabindex')) th.setAttribute('tabindex', '0');
    });
  }
  prep();
  document.addEventListener('keydown', function (e) {
    var th = e.target && e.target.closest ? e.target.closest('th.sortable') : null;
    if (th && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); th.click(); }
  });
})();

(function () {
  'use strict';
  var root = document.documentElement, st = null;
  window.addEventListener('beforeprint', function () {
    st = { theme: root.getAttribute('data-theme'), open: [], rt: false };
    if (st.theme === 'dark') root.removeAttribute('data-theme');
    document.querySelectorAll('details').forEach(function (d) { st.open.push(d.open); d.open = true; });
    var rt = document.getElementById('rtBody');
    if (rt && rt.hidden) { rt.hidden = false; st.rt = true; }
  });
  window.addEventListener('afterprint', function () {
    if (!st) return;
    if (st.theme) root.setAttribute('data-theme', st.theme);
    document.querySelectorAll('details').forEach(function (d, i) { d.open = !!st.open[i]; });
    var rt = document.getElementById('rtBody');
    if (rt && st.rt) rt.hidden = true;
    st = null;
  });
})();
