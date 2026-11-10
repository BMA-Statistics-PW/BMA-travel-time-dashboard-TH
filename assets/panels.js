/* ═══════════════════════════════════════════════════════
   BMA Travel Time Dashboard — Tabbed work panels
   แบ่งรายงานเป็นหน้าต่าง (tab) ตามรายละเอียดงาน · WAI-ARIA Tabs pattern
   © Prapawadee_W.
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (window.BMA_I18N && window.BMA_I18N.extend) {
    window.BMA_I18N.extend({
      th: {
        tabListLabel: 'เลือกหน้าต่างเนื้อหาตามงาน',
        tabOverview: 'ภาพรวม',
        tabRoute: 'เส้นทางสำรวจ',
        tabTomtom: 'TomTom & เปรียบเทียบ',
        tabZones: 'โซน & แนวโน้ม',
        tabRoads: 'ตาราง 51 สาย',
        tabForecast: 'คาดการณ์ & ข้อเสนอแนะ',
        tabAbout: 'ผู้จัดทำ'
      },
      en: {
        tabListLabel: 'Choose a content window by task',
        tabOverview: 'Overview',
        tabRoute: 'Survey routes',
        tabTomtom: 'TomTom & comparison',
        tabZones: 'Zones & trends',
        tabRoads: '51-road table',
        tabForecast: 'Forecast & findings',
        tabAbout: 'About'
      }
    });
  }

  // กลุ่มเนื้อหา: ตัวเลือก CSS ของ section เดิม (เรียงตามลำดับใน DOM)
  const PANELS = [
    { id: 'overview', key: 'tabOverview', icon: '🏠', sel: ['.intro-box', '.method-card'] },
    { id: 'route',    key: 'tabRoute',    icon: '🗺️', sel: ['#survey-route-section'] },
    { id: 'tomtom',   key: 'tabTomtom',   icon: '🌐', sel: ['#tomtom-index', '#compare-sjs-tomtom'] },
    { id: 'zones',    key: 'tabZones',    icon: '📈', sel: ['#zone-details-card', 'section[aria-labelledby="ctrlHead"]', '.cards-grid', '#trend-line'] },
    { id: 'roads',    key: 'tabRoads',    icon: '🛣️', sel: ['#road-table-section'] },
    { id: 'forecast', key: 'tabForecast', icon: '🔮', sel: ['#scenario-bau', 'section[aria-labelledby="cmpYearsHead"]', '.bottom-grid'] },
    { id: 'about',    key: 'tabAbout',    icon: '👤', sel: ['section[aria-labelledby="aboutHead"]'] }
  ];

  function setup() {
    const main = document.getElementById('main');
    if (!main) return;
    const nav = main.querySelector('.std-nav');

    const tablist = document.createElement('div');
    tablist.className = 'tab-bar';
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-orientation', 'horizontal');
    tablist.setAttribute('data-i18n-attr', 'aria-label:tabListLabel');

    const tabs = [];
    const panels = [];

    PANELS.forEach((p) => {
      const els = p.sel.map((s) => main.querySelector(s)).filter(Boolean);
      if (!els.length) return;

      const panel = document.createElement('div');
      panel.className = 'tab-panel';
      panel.id = 'panel-' + p.id;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', 'tab-' + p.id);
      panel.tabIndex = 0;
      panel.hidden = true;
      els.forEach((el) => panel.appendChild(el));

      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab-btn';
      tab.id = 'tab-' + p.id;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      tab.setAttribute('aria-selected', 'false');
      tab.tabIndex = -1;
      tab.dataset.panel = p.id;
      tab.innerHTML = '<span aria-hidden="true">' + p.icon + '</span> <span data-i18n="' + p.key + '">' + p.id + '</span>';

      tablist.appendChild(tab);
      tabs.push(tab);
      panels.push(panel);
    });

    if (!tabs.length) return;

    // วาง tab bar แทนตำแหน่ง quick-nav เดิม แล้วเรียง panel ต่อท้าย
    if (nav) { nav.parentNode.insertBefore(tablist, nav); nav.classList.add('is-secondary'); }
    else main.insertBefore(tablist, main.firstChild);
    let anchor = nav || tablist;
    panels.forEach((pn) => { anchor.after(pn); anchor = pn; });
    document.body.classList.add('has-tabs');

    function activate(id, opts) {
      opts = opts || {};
      let idx = tabs.findIndex((t) => t.dataset.panel === id);
      if (idx < 0) idx = 0;
      tabs.forEach((t, i) => {
        const on = i === idx;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      const panelId = tabs[idx].dataset.panel;
      if (opts.focus) tabs[idx].focus();
      if (opts.updateHash !== false) {
        try { history.replaceState(null, '', '#panel-' + panelId); } catch (e) { /* file:// */ }
      }
      // ให้ reveal animation และแผนที่รู้ว่าแสดงแล้ว
      panels[idx].querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
      document.dispatchEvent(new CustomEvent('panel:show', { detail: { id: panelId } }));
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab.dataset.panel));
      tab.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = tabs.length - 1;
        if (n != null) { e.preventDefault(); activate(tabs[n].dataset.panel, { focus: true }); }
      });
    });

    // รองรับลิงก์ภายในหน้า (#trend-line ฯลฯ) → สลับไปหน้าต่างที่มี element นั้น
    function routeHash(scroll) {
      const h = decodeURIComponent((location.hash || '').slice(1));
      if (!h) return false;
      if (h.indexOf('panel-') === 0) { activate(h.slice(6), { updateHash: false }); return true; }
      const target = document.getElementById(h);
      const pn = target && target.closest('.tab-panel');
      if (pn) {
        activate(pn.id.slice(6), { updateHash: false });
        if (scroll) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
        return true;
      }
      return false;
    }
    window.addEventListener('hashchange', () => routeHash(true));
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.closest('.tab-bar')) return;
      const id = a.getAttribute('href').slice(1);
      const target = id && document.getElementById(id);
      const pn = target && target.closest('.tab-panel');
      if (pn && pn.hidden) { e.preventDefault(); activate(pn.id.slice(6)); setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30); }
    });

    if (!routeHash(true)) activate(tabs[0].dataset.panel, { updateHash: false });

    // แปลป้ายชื่อแท็บที่เพิ่งสร้าง
    if (window.BMA_I18N && window.BMA_I18N.apply) window.BMA_I18N.apply(window.BMA_I18N.current());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
