/* ════════════════════════════════════════════════════════════════════
   BMA Travel Time Dashboard — Dashboard shell (หน้า "ภาพรวม" + แถบเมนู)
   - สร้างหน้าภาพรวมจาก data/dashboard-data.json (ชุดข้อมูลเดิม ไม่เพิ่มตัวเลขจากภายนอก)
   - เมนูด้านข้าง: ย่อ/ขยาย (desktop) · เปิด/ปิด drawer (mobile) · จำสถานะใน localStorage
   - ช่องค้นหาด้านบน: ส่งคำค้นไปยังตาราง 51 สาย
   © Prapawadee_W.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ───────── i18n ───────── */
  const DICT = {
    th: {
      sbLabel: 'เมนูหลัก', sbSub: 'แดชบอร์ดสถิติการจราจร', sbCollapse: 'ย่อเมนู', sbExpand: 'ขยายเมนู',
      sbOpen: 'เปิดเมนู', sbClose: 'ปิดเมนู', sbOrgShort: 'กลุ่มงานสถิติและวิจัย กองนโยบายและแผนงาน',
      dashSub: 'เวลาและอัตราเร็วเฉลี่ยในการเดินทาง กรุงเทพมหานคร พ.ศ. 2560–2568',
      tbSearchPh: 'ค้นหาชื่อถนน...', tbSearchAria: 'ค้นหาชื่อถนนในตาราง 51 สาย',
      heroH: 'ภาพรวมอัตราเร็วเฉลี่ยในการเดินทาง (Travel Speed Overview) กรุงเทพมหานคร',
      heroSub: 'ผลการสำรวจด้วยวิธีรถสำรวจตามกระแสจราจร (Floating Car Method) ช่วงเร่งด่วนเช้าและเย็น · พ.ศ. 2560–2568',
      btnPrint: 'พิมพ์รายงาน', btnRefresh: 'โหลดข้อมูลอีกครั้ง',
      ht1: 'ถนนที่สำรวจ', ht1s: 'ชั้นใน {a} · ชั้นกลาง {b} · ชั้นนอก {c}', ht1u: 'สาย',
      ht2: 'ช่วงเวลาที่มีข้อมูล', ht2s: 'สำรวจต่อเนื่องทุกปี', ht2u: 'ปี',
      ht3: 'อันดับโลก (TomTom)', ht3s: 'ความแออัด {a}% · {b} จุดร้อยละจากปีก่อน', ht3u: '',
      ht4: 'เวลาเดินทางต่อ 10 กม. (พื้นที่ชั้นใน)', ht4s: 'ขาเข้า · อัตราเร็วเฉลี่ย {a} กม./ชม.', ht4u: 'นาที',
      kpiYearIn: 'ขาเข้า · ปี {y}', kpiVs: 'เทียบปี {y}', kpiScale: 'มาตราส่วน 0–{m} กม./ชม.',
      kpiJam: 'จุดสำรวจที่การจราจรติดขัดรุนแรง', kpiJamSub: 'อัตราเร็ว < 10 กม./ชม. (ถนน × ช่วงเวลา × ทิศทาง)',
      kpiJamOf: 'จากทั้งหมด {n} จุด', kpiJamF: 'อัตราเร็ว < 10 กม./ชม.', kpiJamPct: '{p}% ของจุดสำรวจ',
      anTitle: 'แนวโน้มอัตราเร็วเฉลี่ยรายปี', anSub: 'กม./ชม. · ช่วงเร่งด่วน (เฉลี่ยเช้าและเย็น) · มาตราส่วน 0–{m}',
      dirLabel: 'ทิศทาง', zoneLabel: 'โซนพื้นที่', dirIn: 'ขาเข้า', dirOut: 'ขาออก',
      zInner: 'ชั้นใน', zMiddle: 'ชั้นกลาง', zOuter: 'ชั้นนอก',
      zLInner: 'พื้นที่ชั้นใน', zLMiddle: 'พื้นที่ชั้นกลาง', zLOuter: 'พื้นที่ชั้นนอก',
      covid: 'โควิด-19', yoy: 'เทียบปีก่อน',
      mt1: 'ปี {y}', mt2: 'ปี {y}', mt3: 'เปลี่ยนแปลง', mt4: 'สูงสุดในรอบ 9 ปี',
      unitKmh: 'กม./ชม.',
      insTitle: 'ข้อค้นพบสำคัญ', insSub: 'สรุปจากข้อมูลการสำรวจ ปี พ.ศ. 2568', insAll: 'ดูข้อเสนอแนะเชิงนโยบาย',
      qaTitle: 'เมนูลัด (Quick Actions)', qaSub: 'เข้าถึงส่วนที่ใช้งานบ่อย',
      qa1: 'เส้นทางสำรวจ', qa1s: 'แผนที่ 51 สายถนน',
      qa2: 'ดัชนี TomTom', qa2s: 'เปรียบเทียบกับ สจส.',
      qa3: 'ตาราง 51 สาย', qa3s: 'อัตราเร็วรายถนน',
      qa4: 'คาดการณ์ (BAU)', qa4s: 'แนวโน้มปี พ.ศ. 2569',
      topTitle: 'การจัดอันดับถนน ปี พ.ศ. 2568', topSub: 'อัตราเร็วเฉลี่ยรายถนน (เฉลี่ย 4 ช่วงเวลา/ทิศทาง)',
      topSlow: 'ช้าที่สุด', topFast: 'เร็วที่สุด', topAll: 'ดูทั้งหมด',
      topLen: 'ระยะทาง {l} กม.',
      pdTitle: 'ประเด็นที่ควรติดตาม', pdSub: 'จากผลการวิเคราะห์ชุดข้อมูลนี้', pdBadge: '{n} ประเด็น',
      pd1: 'ข้อเสนอแนะเชิงนโยบาย', pd1d: 'แนวทางลดความแออัดและส่งเสริมการใช้ระบบขนส่งสาธารณะ', pd1b: 'ดูข้อเสนอ',
      pd2: 'คาดการณ์กรณีไม่มีมาตรการ (BAU)', pd2d: 'แนวโน้มอัตราเร็วเฉลี่ยปี พ.ศ. 2569 ของ 3 โซนพื้นที่', pd2b: 'ดูคาดการณ์',
      pd3: 'บันทึกการแก้ไขข้อมูล', pd3d: 'ปรับปรุงล่าสุด {d} (ค่าพื้นที่ชั้นกลาง ปี 2567–2568)', pd3b: 'ดูโซนและแนวโน้ม',
      noData: 'ไม่สามารถโหลดข้อมูลได้ โปรดตรวจสอบไฟล์ data/dashboard-data.json',
      asOf: 'ข้อมูล ณ {d}'
    },
    en: {
      sbLabel: 'Main menu', sbSub: 'Traffic Statistics Panel', sbCollapse: 'Collapse menu', sbExpand: 'Expand menu',
      sbOpen: 'Open menu', sbClose: 'Close menu', sbOrgShort: 'Statistics & Research Group, TTD',
      dashSub: 'Travel time and average speed in Bangkok, 2017–2025',
      tbSearchPh: 'Search road name...', tbSearchAria: 'Search road name in the 51-road table',
      heroH: 'Bangkok average travel speed overview',
      heroSub: 'Floating Car Method survey · AM and PM peak · 2017–2025',
      btnPrint: 'Print report', btnRefresh: 'Reload data',
      ht1: 'Roads surveyed', ht1s: 'Inner {a} · Middle {b} · Outer {c}', ht1u: 'roads',
      ht2: 'Data coverage', ht2s: 'Surveyed every year', ht2u: 'years',
      ht3: 'TomTom world rank', ht3s: 'Congestion {a}% · {b} pp vs last year', ht3u: '',
      ht4: 'Time per 10 km (Inner)', ht4s: 'Inbound · speed {a} km/h', ht4u: 'min',
      kpiYearIn: 'Inbound · {y}', kpiVs: 'vs {y}', kpiScale: 'Scale 0–{m} km/h',
      kpiJam: 'Heavily congested survey points', kpiJamSub: 'Speed < 10 km/h (road × period × direction)',
      kpiJamOf: 'of {n} points', kpiJamF: 'Speed < 10 km/h', kpiJamPct: '{p}% of survey points',
      anTitle: 'Annual average speed trend', anSub: 'km/h · peak hours (AM+PM average) · scale 0–{m}',
      dirLabel: 'Direction', zoneLabel: 'Zone', dirIn: 'Inbound', dirOut: 'Outbound',
      zInner: 'Inner', zMiddle: 'Middle', zOuter: 'Outer',
      zLInner: 'Inner zone', zLMiddle: 'Middle zone', zLOuter: 'Outer zone',
      covid: 'COVID-19', yoy: 'vs previous year',
      mt1: '{y}', mt2: '{y}', mt3: 'Change', mt4: 'Peak in 9 years',
      unitKmh: 'km/h',
      insTitle: 'Key findings', insSub: 'Summary of the 2025 survey', insAll: 'View policy recommendations',
      qaTitle: 'Shortcuts', qaSub: 'Open frequently used sections',
      qa1: 'Survey routes', qa1s: 'Map of 51 roads',
      qa2: 'TomTom Index', qa2s: 'Compared with TTD',
      qa3: '51-road table', qa3s: 'Speed by road',
      qa4: 'BAU forecast', qa4s: '2026 trend',
      topTitle: 'Road ranking, 2025', topSub: 'Average speed per road (4 periods/directions)',
      topSlow: 'Slowest', topFast: 'Fastest', topAll: 'View all',
      topLen: '{l} km long',
      pdTitle: 'Items to watch', pdSub: 'From the analysis of this dataset', pdBadge: '{n} items',
      pd1: 'Policy recommendations', pd1d: 'Ways to reduce congestion and raise public-transport use', pd1b: 'View',
      pd2: 'Business-as-usual scenario', pd2d: '2026 speed trend for the 3 zones (BAU)', pd2b: 'View scenario',
      pd3: 'Data revision log', pd3d: 'Latest update {d} (Middle zone, 2024–2025)', pd3b: 'View zones & trends',
      noData: 'Could not load data/dashboard-data.json',
      asOf: 'Data as of {d}'
    }
  };
  if (window.BMA_I18N && window.BMA_I18N.extend) window.BMA_I18N.extend(DICT);

  const lang = () => (window.BMA_I18N && window.BMA_I18N.current) ? window.BMA_I18N.current() : 'th';
  function t(key, vars) {
    let s = (DICT[lang()] || DICT.th)[key];
    if (s == null) s = DICT.th[key] != null ? DICT.th[key] : key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  const yr = (y) => lang() === 'th' ? y : y - 543;       // พ.ศ. → ค.ศ. เมื่อสลับเป็นอังกฤษ (เหมือน i18n เดิม)
  const fmt = (n, d = 2) => (typeof n === 'number' && isFinite(n)) ? n.toFixed(d) : '—';
  const sign = (n, d = 2) => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(d);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const disp = (n) => (window.BMA_displayName ? window.BMA_displayName(n) : n);

  /* ───────── ไอคอน (line, currentColor) ───────── */
  const IC = {
    road: '<path d="M8 3L4 21M16 3l4 18M12 4v3M12 11v3M12 18v3"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    up: '<path d="M7 17L17 7M9 7h8v8"/>', down: '<path d="M7 7l10 10M17 9v8H9"/>',
    alert: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18v.01"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>',
    print: '<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z"/>',
    refresh: '<path d="M20 11a8 8 0 10-2.3 6M20 4v7h-7"/>',
    arrow: '<path d="M9 6l6 6-6 6"/>',
    check: '<path d="M5 12l4 4 10-10"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    doc: '<path d="M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6"/>',
    file: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'
  };
  const ico = (n, sz = 20) => `<svg class="ico" viewBox="0 0 24 24" width="${sz}" height="${sz}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

  /* ───────── state ───────── */
  const ZONES = ['inner', 'middle', 'outer'];
  const ZKEY = { inner: ['zInner', 'zLInner'], middle: ['zMiddle', 'zLMiddle'], outer: ['zOuter', 'zLOuter'] };
  let DATA = null;
  const S = { zone: 'inner', dir: 'in', top: 'slow' };

  /* ───────── คำนวณจากข้อมูลเดิม ───────── */
  function scaleMax() {
    let m = 0;
    ZONES.forEach(z => DATA.report_summary[z].forEach(r => { m = Math.max(m, r.in || 0, r.out || 0); }));
    return Math.ceil(m / 10) * 10;
  }
  // อัตราเร็วเฉลี่ยรายสาย = ความยาวรวม / เวลาเดินทางรวม (ถ่วงน้ำหนักด้วยเวลา · harmonic) ของช่องที่มีค่า
  function roadAvg(r) {
    let L = 0, T = 0;
    [['am_in', 'in'], ['am_out', 'out'], ['pm_in', 'in'], ['pm_out', 'out']].forEach(([k, d]) => {
      const tt = r['tt_' + k];
      const len = typeof r['length_' + d + '_km'] === 'number' ? r['length_' + d + '_km'] : r.length_km;
      if (typeof tt === 'number' && tt > 0 && typeof len === 'number') { L += len; T += tt; }
    });
    return T > 0 ? L / (T / 60) : null;
  }
  function jamStats() {
    let n = 0, tot = 0;
    DATA.roads_2568.forEach(r => ['speed_am_in', 'speed_am_out', 'speed_pm_in', 'speed_pm_out'].forEach(k => {
      if (typeof r[k] === 'number') { tot++; if (r[k] < 10) n++; }
    }));
    return { n, tot };
  }
  const pct = (a, b) => (typeof a === 'number' && typeof b === 'number' && b !== 0) ? (a - b) / b * 100 : null;

  /* ───────── ส่วนประกอบ UI ───────── */
  function badge(p) {
    if (p == null) return '<span class="badge neutral">—</span>';
    const up = p >= 0;
    return `<span class="badge ${up ? 'up' : 'down'}">${ico(up ? 'up' : 'down', 12)}${sign(p, 2)}%</span>`;
  }

  function renderHero() {
    const m = DATA.meta, tt = DATA.tomtom_2025, z = DATA.zones, rc = m.road_count_by_zone;
    const yrs = DATA.trend_inbound.length;
    const tiles = [
      { ic: 'road', k: 'ht1', v: m.road_count_total, u: t('ht1u'), s: t('ht1s', { a: rc.inner, b: rc.middle, c: rc.outer }) },
      { ic: 'cal', k: 'ht2', v: yrs, u: t('ht2u'), s: t('ht2s') },
      { ic: 'globe', k: 'ht3', v: '#' + tt.world_rank, u: '', s: t('ht3s', { a: fmt(tt.congestion_level_pct, 1), b: sign(tt.congestion_yoy_pp, 1) }) },
      { ic: 'clock', k: 'ht4', v: fmt(600 / z.inner.speed_2568_in), u: t('ht4u'), s: t('ht4s', { a: fmt(z.inner.speed_2568_in) }) }
    ];
    return `
    <section class="hero-banner" aria-labelledby="heroH">
      <div class="hb-top">
        <div class="hb-text">
          <div class="hb-line"><h2 id="heroH" class="hb-title">${t('heroH')}</h2>
            <span class="hb-chip">${ico('cal', 14)}${esc(window.BMA_I18N.t('footerAsOf'))}</span></div>
          <p class="hb-sub">${t('heroSub')}</p>
        </div>
        <div class="hb-actions">
          <button class="hb-btn" type="button" data-act="print">${ico('print', 16)}<span>${t('btnPrint')}</span></button>
          <button class="hb-btn hb-btn-icon" type="button" data-act="refresh" aria-label="${t('btnRefresh')}" title="${t('btnRefresh')}">${ico('refresh', 18)}</button>
        </div>
      </div>
      <ul class="hb-tiles">
        ${tiles.map(x => `<li class="hb-tile"><div class="hb-tile-h"><span class="hb-ico">${ico(x.ic, 18)}</span><span>${t(x.k)}</span></div>
          <div class="hb-tile-v">${x.v}${x.u ? `<span class="hb-unit"> ${x.u}</span>` : ''}</div>
          <div class="hb-tile-s">${x.s}</div></li>`).join('')}
      </ul>
    </section>`;
  }

  function renderKpis() {
    const mx = scaleMax(), z = DATA.zones;
    const cards = ZONES.map(k => {
      const zz = z[k];
      const v = zz.speed_2568_in, base = zz.speed_2560_in, p = zz.pct_in;
      return `<article class="kpi z-${k}">
        <div class="kpi-top"><span class="kpi-ico">${ico(k === 'inner' ? 'pin' : k === 'middle' ? 'road' : 'map', 22)}</span>${badge(p)}</div>
        <div class="kpi-v">${fmt(v)}<span class="kpi-u"> ${t('unitKmh')}</span></div>
        <h3 class="kpi-l">${t(ZKEY[k][1])}</h3>
        <p class="kpi-s">${t('kpiYearIn', { y: yr(DATA.meta.year_latest) })}</p>
        <div class="kpi-bar"><div class="kpi-bar-h"><span>${t('kpiScale', { m: mx })}</span><span>${fmt(v / mx * 100, 0)}%</span></div>
          <div class="track" role="img" aria-label="${fmt(v)} / ${mx}"><div class="fill" data-w="${(v / mx * 100).toFixed(1)}"></div></div></div>
        <div class="kpi-f"><span>${t('kpiVs', { y: yr(2560) })}</span><b>${fmt(base)}</b></div>
      </article>`;
    });
    const j = jamStats(), jp = j.tot ? j.n / j.tot * 100 : 0;
    cards.push(`<article class="kpi z-jam">
        <div class="kpi-top"><span class="kpi-ico">${ico('alert', 22)}</span><span class="badge down">${t('kpiJamPct', { p: fmt(jp, 1) })}</span></div>
        <div class="kpi-v">${j.n}<span class="kpi-u"> ${lang() === 'th' ? 'จุด' : 'points'}</span></div>
        <h3 class="kpi-l">${t('kpiJam')}</h3>
        <p class="kpi-s">${t('kpiJamSub')}</p>
        <div class="kpi-bar"><div class="kpi-bar-h"><span>${t('kpiJamOf', { n: j.tot })}</span><span>${fmt(jp, 0)}%</span></div>
          <div class="track" role="img" aria-label="${j.n} / ${j.tot}"><div class="fill" data-w="${jp.toFixed(1)}"></div></div></div>
        <div class="kpi-f"><span>${t('kpiJamF')}</span><b>${j.n}</b></div>
      </article>`);
    return `<section class="kpi-grid" aria-label="${t('insSub')}">${cards.join('')}</section>`;
  }

  function renderAnalytics() {
    const mx = scaleMax();
    const rows = DATA.report_summary[S.zone];
    const key = S.dir;
    const first = rows[0][key], last = rows[rows.length - 1][key];
    const peak = rows.reduce((a, r) => (r[key] > a[key] ? r : a), rows[0]);
    const chg = pct(last, first);
    const bars = rows.map((r, i) => {
      const prev = i ? rows[i - 1][key] : null, d = pct(r[key], prev);
      const covid = r.year === 2564;
      return `<li class="vbar-col">
        <b class="vbar-v">${fmt(r[key])}</b>
        <div class="vbar-track" role="img" aria-label="${yr(r.year)}: ${fmt(r[key])} ${t('unitKmh')}"><div class="vbar-fill z-${S.zone}" data-h="${(r[key] / mx * 100).toFixed(1)}"></div></div>
        <span class="vbar-y">${yr(r.year)}</span>
        <span class="vbar-d">${d == null ? '<span class="badge neutral">—</span>' : badge(d)}</span>
        ${covid ? `<span class="tag">${t('covid')}</span>` : ''}
      </li>`;
    }).join('');
    const seg = (arr, cur, attr) => arr.map(([v, l]) => `<button type="button" class="seg-btn" data-${attr}="${v}" aria-pressed="${v === cur}">${l}</button>`).join('');
    return `
    <section class="card analytics" aria-labelledby="anH">
      <div class="card-head">
        <div><h3 id="anH" class="card-title">${t('anTitle')}</h3><p class="card-sub">${t('anSub', { m: mx })}</p></div>
        <div class="seg" role="group" aria-label="${t('dirLabel')}">${seg([['in', t('dirIn')], ['out', t('dirOut')]], S.dir, 'dir')}</div>
      </div>
      <div class="seg seg-wide" role="group" aria-label="${t('zoneLabel')}">${seg(ZONES.map(z => [z, t(ZKEY[z][0])]), S.zone, 'zone')}</div>
      <ol class="bars vbars">${bars}</ol>
      <div class="mini-tiles">
        <div class="mt mt-blue"><span class="mt-ico">${ico('cal', 18)}</span><b>${fmt(first)}</b><small>${t('mt1', { y: yr(rows[0].year) })}</small></div>
        <div class="mt mt-green"><span class="mt-ico">${ico('check', 18)}</span><b>${fmt(last)}</b><small>${t('mt2', { y: yr(rows[rows.length - 1].year) })}</small></div>
        <div class="mt mt-purple"><span class="mt-ico">${ico(chg >= 0 ? 'up' : 'down', 18)}</span><b>${sign(chg, 2)}%</b><small>${t('mt3')}</small></div>
        <div class="mt mt-amber"><span class="mt-ico">${ico('bolt', 18)}</span><b>${fmt(peak[key])}</b><small>${t('mt4')} (${yr(peak.year)})</small></div>
      </div>
    </section>`;
  }

  function renderInsights() {
    const items = [1, 2, 3, 4, 5].map(n => `<li class="ins-item"><span class="ins-dot ins-${n}" aria-hidden="true">${n}</span><div class="ins-text" data-i18n-html="finding${n}"></div></li>`).join('');
    return `
    <section class="card insights" aria-labelledby="insH">
      <div class="card-head"><div><h3 id="insH" class="card-title">${t('insTitle')}</h3><p class="card-sub">${t('insSub')}</p></div>
        <span class="live-chip"><i aria-hidden="true"></i>${yr(DATA.meta.year_latest)}</span></div>
      <ul class="ins-list">${items}</ul>
      <a class="card-link center" href="#panel-forecast">${t('insAll')}</a>
    </section>`;
  }

  function renderQuick() {
    const q = [['qa1', 'qa1s', 'map', 'blue', '#panel-route'], ['qa2', 'qa2s', 'globe', 'green', '#panel-tomtom'], ['qa3', 'qa3s', 'table', 'orange', '#panel-roads'], ['qa4', 'qa4s', 'chart', 'purple', '#panel-forecast']];
    return `
    <section class="card quick" aria-labelledby="qaH">
      <div class="card-head"><div><h3 id="qaH" class="card-title">${t('qaTitle')}</h3><p class="card-sub">${t('qaSub')}</p></div></div>
      <div class="qa-grid">${q.map(([a, b, i, c, h]) => `<a class="qa qa-${c}" href="${h}"><span class="qa-ico">${ico(i, 22)}</span><span class="qa-t">${t(a)}</span><span class="qa-s">${t(b)}</span></a>`).join('')}</div>
    </section>`;
  }

  function topList() {
    const list = DATA.roads_2568.map(r => ({ r, v: roadAvg(r) })).filter(x => x.v != null);
    list.sort((a, b) => S.top === 'slow' ? a.v - b.v : b.v - a.v);
    return list.slice(0, 3).map((x, i) => `<li class="top-row">
        <span class="top-av z-${x.r.zone}"><span>${t(ZKEY[x.r.zone][0])}</span><i class="rank">${i + 1}</i></span>
        <div class="top-info"><b class="top-n">${esc(disp(x.r.name))}</b><small>${esc(x.r.segment || '')}</small>
          <small class="top-m"><span class="zdot z-${x.r.zone}" aria-hidden="true"></span>${t(ZKEY[x.r.zone][1])} · ${t('topLen', { l: fmt(x.r.length_km) })}</small></div>
        <div class="top-v"><b>${fmt(x.v)}</b><small>${t('unitKmh')}</small></div></li>`).join('');
  }
  function renderTop() {
    return `
    <section class="card top" aria-labelledby="topH">
      <div class="card-head"><div><h3 id="topH" class="card-title">${t('topTitle')}</h3><p class="card-sub">${t('topSub')}</p></div>
        <a class="card-link" href="#panel-roads">${t('topAll')} ${ico('arrow', 14)}</a></div>
      <div class="seg seg-wide" role="group" aria-label="${t('topTitle')}">
        <button type="button" class="seg-btn" data-top="slow" aria-pressed="${S.top === 'slow'}">${t('topSlow')}</button>
        <button type="button" class="seg-btn" data-top="fast" aria-pressed="${S.top === 'fast'}">${t('topFast')}</button></div>
      <ol class="top-list" id="topList">${topList()}</ol>
    </section>`;
  }

  function renderPending() {
    const rev = (DATA.meta.revisions && DATA.meta.revisions[0]) || null;
    let d = rev ? rev.date : '';
    try { if (rev) d = new Date(rev.date + 'T00:00:00').toLocaleDateString(lang() === 'th' ? 'th-TH-u-ca-buddhist-nu-latn' : 'en-GB-u-nu-latn', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { /* keep ISO */ }
    const nRev = (DATA.meta.revisions || []).length;
    const items = [
      { c: 'orange', n: 5, t: 'pd1', d: t('pd1d'), b: 'pd1b', h: '#panel-forecast' },
      { c: 'blue', n: ZONES.length, t: 'pd2', d: t('pd2d'), b: 'pd2b', h: '#panel-forecast' },
      { c: 'red', n: nRev, t: 'pd3', d: t('pd3d', { d }), b: 'pd3b', h: '#panel-zones' }
    ];
    const total = items.length;
    return `
    <section class="card pending" aria-labelledby="pdH">
      <div class="card-head"><div><h3 id="pdH" class="card-title">${t('pdTitle')}</h3><p class="card-sub">${t('pdSub')}</p></div>
        <span class="pill-red"><i aria-hidden="true"></i>${t('pdBadge', { n: total })}</span></div>
      <div class="pd-grid">${items.map(x => `<article class="pd pd-${x.c}"><span class="pd-n">${x.n}</span>
        <span class="pd-ico">${ico(x.c === 'orange' ? 'doc' : x.c === 'blue' ? 'chart' : 'file', 22)}</span>
        <h4 class="pd-t">${t(x.t)}</h4><p class="pd-d">${x.d}</p>
        <a class="pd-btn" href="${x.h}">${t(x.b)} ${ico('arrow', 14)}</a></article>`).join('')}</div>
    </section>`;
  }

  /* ───────── render ───────── */
  function paintBars(root) {
    $$('[data-w]', root).forEach(el => el.style.setProperty('--w', el.getAttribute('data-w') + '%'));
    $$('[data-h]', root).forEach(el => el.style.setProperty('--h', el.getAttribute('data-h') + '%'));
  }
  function render() {
    const host = $('#dash-home');
    if (!host || !DATA) return;
    host.innerHTML = renderHero() + renderKpis() +
      `<div class="grid-2">${renderAnalytics()}${renderInsights()}</div>` +
      `<div class="grid-2 g-rev">${renderQuick()}${renderTop()}</div>` + renderPending();
    paintBars(host);
    if (window.BMA_I18N && window.BMA_I18N.apply) {
      // เติมข้อความ finding1–5 จากพจนานุกรม i18n (th/en) โดยไม่ทำซ้ำข้อความไว้สองที่
      const dict = window.BMA_I18N.t;
      $$('[data-i18n-html]', host).forEach(el => { const v = dict(el.getAttribute('data-i18n-html')); if (v) el.innerHTML = v; });
    }
  }
  function rerenderKeepFocus(sel) {
    const had = document.activeElement && document.activeElement.matches && document.activeElement.matches(sel);
    const attr = had ? Array.from(document.activeElement.attributes).filter(a => a.name.startsWith('data-')).map(a => `[${a.name}="${a.value}"]`).join('') : '';
    const scrollY = window.scrollY;
    render();
    if (had && attr) { const n = $('#dash-home .seg-btn' + attr); if (n) n.focus({ preventScroll: true }); }
    window.scrollTo(0, scrollY);
  }

  function bindHome() {
    const host = $('#dash-home');
    host.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.act === 'print') { window.print(); return; }
      if (b.dataset.act === 'refresh') { load(true); return; }
      if (b.dataset.zone) { S.zone = b.dataset.zone; rerenderKeepFocus('.seg-btn'); }
      else if (b.dataset.dir) { S.dir = b.dataset.dir; rerenderKeepFocus('.seg-btn'); }
      else if (b.dataset.top) { S.top = b.dataset.top; rerenderKeepFocus('.seg-btn'); }
    });
  }

  function load(bust) {
    const host = $('#dash-home');
    return fetch('data/dashboard-data.json', bust ? { cache: 'reload' } : undefined)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(j => { DATA = j; render(); })
      .catch(err => { console.error('[BMA shell]', err); if (host) host.innerHTML = `<p class="load-error" role="alert">${t('noData')}</p>`; });
  }

  /* ───────── Sidebar / topbar ───────── */
  function setupShell() {
    const shell = $('#appShell'), sb = $('#sidebar'), tgl = $('#sbToggle'), menu = $('#menuBtn'), back = $('#sbBackdrop');
    if (!shell || !sb) return;
    // เกณฑ์อุปกรณ์ (ต้องตรงกับ dashboard-shell.css ข้อ 7): Mobile ≤767 · Tablet 768–1199 · PC ≥1200
    const mq = window.matchMedia('(max-width: 767px)');                          // Mobile
    const mqTab = window.matchMedia('(min-width: 768px) and (max-width: 1199px)'); // Tablet
    const device = () => mq.matches ? 'mobile' : (mqTab.matches ? 'tablet' : 'pc');
    const store = { get() { try { return localStorage.getItem('bma_sb') } catch (e) { return null } }, set(v) { try { localStorage.setItem('bma_sb', v) } catch (e) { /* ignore */ } } };

    function sync() {
      const dev = device(), tablet = dev === 'tablet';
      document.documentElement.setAttribute('data-device', dev);
      // Tablet = แถบไอคอนคงที่ (ไม่บันทึกสถานะ) · PC = ตามที่ผู้ใช้เลือกไว้
      if (tablet) shell.classList.add('sb-collapsed');
      else if (dev === 'pc') shell.classList.toggle('sb-collapsed', store.get() === '1');
      const mobile = mq.matches, open = shell.classList.contains('sb-open'), collapsed = shell.classList.contains('sb-collapsed');
      if (menu) menu.setAttribute('aria-expanded', String(mobile && open));
      if (tgl) {
        tgl.setAttribute('aria-expanded', String(mobile ? open : !collapsed));
        tgl.setAttribute('aria-label', t(mobile ? 'sbClose' : (collapsed ? 'sbExpand' : 'sbCollapse')));
        tgl.removeAttribute('data-i18n-attr');
      }
      if (back) back.hidden = !(mobile && open);
      $$('.tab-btn', sb).forEach(b => { if (collapsed && !mobile) b.title = b.textContent.trim(); else b.removeAttribute('title'); });
      // drawer ปิดอยู่บนมือถือ → ซ่อนจาก AT และ tab order
      if (mobile && !open) sb.setAttribute('inert', ''); else sb.removeAttribute('inert');
    }
    function closeMobile() { shell.classList.remove('sb-open'); sync(); }
    if (store.get() === '1') shell.classList.add('sb-collapsed');
    if (tgl) tgl.addEventListener('click', () => {
      if (mq.matches) { closeMobile(); if (menu) menu.focus(); return; }
      shell.classList.toggle('sb-collapsed'); store.set(shell.classList.contains('sb-collapsed') ? '1' : '0'); sync();
    });
    if (menu) menu.addEventListener('click', () => { shell.classList.add('sb-open'); sync(); const a = $('.tab-btn[aria-selected="true"]', sb) || $('.tab-btn', sb); if (a) a.focus(); });
    if (back) back.addEventListener('click', closeMobile);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && shell.classList.contains('sb-open')) { closeMobile(); if (menu) menu.focus(); } });
    document.addEventListener('click', (e) => { if (mq.matches && e.target.closest('.tab-btn')) closeMobile(); });
    [mq, mqTab].forEach(m => (m.addEventListener ? m.addEventListener('change', sync) : m.addListener(sync)));
    document.addEventListener('i18n:change', sync);
    sync();

    // ชื่อหน้าใน top bar (h1) ตามหน้าต่างที่เปิด
    function title() {
      const on = $('.tab-btn[aria-selected="true"] .sb-label', sb), h = $('#tbTitle');
      if (on && h) h.textContent = on.textContent;
    }
    document.addEventListener('panel:show', title);
    document.addEventListener('i18n:change', () => setTimeout(title, 0));
    setTimeout(title, 0);

    // ค้นหาถนน → ตาราง 51 สาย
    const form = $('#tbSearch'), inp = $('#tbSearchInput');
    if (form && inp) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = inp.value.trim();
      location.hash = '#panel-roads';
      setTimeout(() => {
        const body = $('#rtBody'), tg = $('#rtToggle'), s = $('#rtSearch');
        if (body && body.hidden && tg) tg.click();
        if (s) { s.value = q; s.dispatchEvent(new Event('input', { bubbles: true })); }
        if (body) body.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    });
  }

  function init() {
    setupShell();
    bindHome();
    load(false);
    document.addEventListener('i18n:change', () => { if (DATA) render(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
