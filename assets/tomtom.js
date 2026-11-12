/* ════════════════════════════════════════════════════════════════
   BMA Travel Time Dashboard — หน้า TomTom (tomtom.html)
   อ่านข้อมูลจาก data/tomtom-2025.json (+ data/dashboard-data.json เพื่อเทียบ สจส.)
   ตัวเลขทุกจุดมาจากไฟล์ข้อมูล ไม่พิมพ์ซ้ำใน HTML · สลับภาษาแล้ววาดใหม่
   © Prapawadee_W.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const t = k => (window.BMA_I18N ? window.BMA_I18N.t(k) : k);
  const lang = () => (window.BMA_I18N ? window.BMA_I18N.current() : 'th');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const f = (n, d = 1) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const mmss = s => { s = Math.round(s); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const f2 = n => f(n, 2);   // อัตราเร็ว (กม./ชม.) แสดงทศนิยม 2 ตำแหน่ง
  const sign = (n, d = 1) => (n > 0 ? '+' : n < 0 ? '−' : '') + f(Math.abs(n), d);
  const fill = (str, o) => str.replace(/\{(\w+)\}/g, (_, k) => (o[k] != null ? o[k] : '{' + k + '}'));
  const MONTH_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fdate = iso => { const [y, m, d] = iso.split('-').map(Number); return lang() === 'th' ? `${d} ${MONTH_TH[m - 1]} ${y + 543}` : `${d} ${MONTH_EN[m - 1]} ${y}`; };

  let T = null, S = null;
  // free-flow จากระดับความแออัด: เวลาจริง = free × (1 + CL/100)
  const split = (sec, cl) => { const free = sec / (1 + cl / 100); return { free, extra: sec - free }; };
  const chip = (txt, bad) => `<span class="tt-delta ${bad === true ? 'is-bad' : bad === false ? 'is-good' : ''}">${txt}</span>`;

  function summary() {
    const c = T.city, rank = c.world_rank;
    $('#ttSumSub').textContent = fill(t('ttSumSub'), { rank });
    const cards = [
      [t('ttK1'), `#${rank}`, '', ''],
      [t('ttK2'), `${f(c.congestion_pct)}%`, '', chip(`▲ ${f(c.congestion_change_pp)} ${t('ttUnitPp')} · ${t('ttVsPrev')}`, true)],
      [t('ttK3'), mmss(c.time_10km_s), t('ttUnitMin'), chip(`▲ ${c.time_10km_change_s} ${t('ttUnitSec')} · ${t('ttVsPrev')}`, true)],
      [t('ttK4'), f2(c.rush_speed_kmh), t('ttUnitKmh'), chip(`▼ ${f2(Math.abs(c.rush_speed_change_kmh))} · ${t('ttVsPrev')}`, true)],
      [t('ttK5'), f(c.rush_time_lost_h, 0), t('ttUnitH'), chip(`▲ ${f(c.rush_time_lost_change_h)} ${t('ttUnitHShort')} · ${t('ttVsPrev')}`, true)],
      [t('ttK6'), f2(c.avg_speed_kmh), t('ttUnitKmh'), '']
    ];
    $('#ttKpis').innerHTML = cards.map(([l, v, u, d]) => `<article class="tt-kpi"><div class="tt-kpi__label">${l}</div><div class="tt-kpi__value">${v}<small>${u}</small></div><div class="tt-kpi__foot">${d}</div></article>`).join('');
  }

  function yoy() {
    const c = T.city;
    const rows = [
      [t('ttM1'), f(c.congestion_pct - c.congestion_change_pp), f(c.congestion_pct), `${sign(c.congestion_change_pp)} ${t('ttUnitPp')}`, c.congestion_change_pp > 0],
      [t('ttM2'), mmss(c.time_10km_s - c.time_10km_change_s), mmss(c.time_10km_s), `${sign(c.time_10km_change_s, 0)} ${t('ttUnitSec')}`, c.time_10km_change_s > 0],
      [t('ttM3'), f2(c.rush_speed_kmh - c.rush_speed_change_kmh), f2(c.rush_speed_kmh), sign(c.rush_speed_change_kmh, 2), c.rush_speed_change_kmh < 0],
      [t('ttM4'), f2(c.highway_speed_kmh - c.highway_speed_change_kmh), f2(c.highway_speed_kmh), sign(c.highway_speed_change_kmh, 2), c.highway_speed_change_kmh < 0],
      [t('ttM5'), f(c.dist_15min_km - c.dist_15min_change_km), f(c.dist_15min_km), sign(c.dist_15min_change_km), c.dist_15min_change_km < 0],
      [t('ttM6'), f(c.highway_trip_ratio_pct - c.highway_trip_ratio_change_pp), f(c.highway_trip_ratio_pct), `${sign(c.highway_trip_ratio_change_pp)} ${t('ttUnitPp')}`, null],
      [t('ttM7'), f(c.rush_time_lost_h - c.rush_time_lost_change_h), f(c.rush_time_lost_h), `${sign(c.rush_time_lost_change_h)} ${t('ttUnitHShort')}`, c.rush_time_lost_change_h > 0]
    ];
    const head = `<tr><th scope="col" class="tt-left">${t('ttColMetric')}</th><th scope="col">${t('ttCol2567')}</th><th scope="col">${t('ttCol2568')}</th><th scope="col">${t('ttColChg')}</th><th scope="col">${t('ttColSt')}</th></tr>`;
    const body = rows.map(([m, a, b, d, bad]) => `<tr><td class="tt-left" data-label="${esc(t('ttColMetric'))}">${m}</td><td data-label="${esc(t('ttCol2567'))}">${a}</td><td data-label="${esc(t('ttCol2568'))}"><strong>${b}</strong></td><td data-label="${esc(t('ttColChg'))}">${d}</td><td data-label="${esc(t('ttColSt'))}">${chip(bad === null ? t('ttNeutral') : bad ? '▼ ' + t('ttWorse') : '▲ ' + t('ttBetter'), bad === null ? undefined : bad)}</td></tr>`).join('');
    $('#ttYoy').innerHTML = `<thead>${head}</thead><tbody>${body}</tbody>`;
  }

  function rush() {
    const c = T.city, am = T.rush.am, pm = T.rush.pm;
    const rows = [[t('ttBarAll'), c.time_10km_s, c.congestion_pct, c.rush_speed_kmh], [t('ttBarAm'), am.time_10km_s, am.congestion_pct, am.speed_kmh], [t('ttBarPm'), pm.time_10km_s, pm.congestion_pct, pm.speed_kmh]];
    const max = Math.max(...rows.map(r => r[1]));
    const sp = rows.map(r => ({ label: r[0], sec: r[1], cl: r[2], spd: r[3], ...split(r[1], r[2]) }));
    $('#ttRushHead').textContent = fill(t('ttRushHead'), { d: mmss(pm.time_10km_s - am.time_10km_s) });
    $('#ttBars').innerHTML = sp.map(r => `<li class="tt-bar"><span class="tt-bar__label">${r.label}</span>
      <span class="tt-bar__track" role="img" aria-label="${esc(r.label)}: ${mmss(r.sec)} (${esc(t('ttLegFree'))} ${mmss(r.free)} + ${esc(t('ttLegExtra'))} ${mmss(r.extra)})">
        <span class="tt-bar__seg is-free" style="width:${(r.free / max * 100).toFixed(1)}%"></span><span class="tt-bar__seg is-extra" style="width:${(r.extra / max * 100).toFixed(1)}%"></span></span>
      <span class="tt-bar__val">${mmss(r.sec)}</span></li>`).join('');
    const head = `<tr><th scope="col" class="tt-left">${t('ttColPeriod')}</th><th scope="col">${t('ttColTime')}</th><th scope="col">${t('ttColCong')}</th><th scope="col">${t('ttColSpeed')}</th><th scope="col">${t('ttColExtra')}</th></tr>`;
    $('#ttRushTable').innerHTML = `<thead>${head}</thead><tbody>` + sp.map(r => `<tr><td class="tt-left" data-label="${esc(t('ttColPeriod'))}">${r.label}</td><td data-label="${esc(t('ttColTime'))}">${mmss(r.sec)}</td><td data-label="${esc(t('ttColCong'))}">${f(r.cl)}%</td><td data-label="${esc(t('ttColSpeed'))}">${f2(r.spd)}</td><td data-label="${esc(t('ttColExtra'))}">+${mmss(r.extra)}</td></tr>`).join('') + '</tbody>';
    $('#ttRushIns').textContent = fill(t('ttRushIns'), { pm: f(pm.congestion_pct), am: f(am.congestion_pct) });
  }

  function worst() {
    const w = T.worst_day;
    $('#ttDayHead').textContent = fill(t('ttDayHead'), { date: fdate(w.date) });
    const cards = [[t('ttDay1'), `${w.congestion_pct}%`, ''], [t('ttDay2'), `${w.congestion_3pm_pct}%`, ''], [t('ttDay3'), `${f(w.dist_15min_3pm_km)}`, fill(t('ttDay3s'), { n: f(T.city.dist_15min_km) })]];
    $('#ttDayCards').innerHTML = cards.map(([l, v, s]) => `<article class="tt-kpi is-alert"><div class="tt-kpi__label">${l}</div><div class="tt-kpi__value">${v}${l === t('ttDay3') ? '<small>' + t('ttUnitKm') + '</small>' : ''}</div><div class="tt-kpi__foot">${s}</div></article>`).join('');
  }

  function thailand() {
    const max = Math.max(...T.thailand.map(x => x.congestion_pct));
    $('#ttThBars').innerHTML = T.thailand.map((x, i) => `<li class="tt-bar${i === 0 ? ' is-hi' : ''}"><span class="tt-bar__label">${t('ttCity.' + x.city)}</span>
      <span class="tt-bar__track" role="img" aria-label="${esc(t('ttCity.' + x.city))}: ${f(x.congestion_pct)}%"><span class="tt-bar__seg is-city" style="width:${(x.congestion_pct / max * 100).toFixed(1)}%"></span></span><span class="tt-bar__val">${f(x.congestion_pct)}%</span></li>`).join('');
    const head = `<tr><th scope="col" class="tt-left">${t('ttColCity')}</th><th scope="col">${t('ttColCongPct')}</th><th scope="col">${t('ttColChgPp')}</th><th scope="col">${t('ttColLost')}</th></tr>`;
    $('#ttThTable').innerHTML = `<thead>${head}</thead><tbody>` + T.thailand.map(x => `<tr><td class="tt-left" data-label="${esc(t('ttColCity'))}">${t('ttCity.' + x.city)}</td><td data-label="${esc(t('ttColCongPct'))}">${f(x.congestion_pct)}%</td><td data-label="${esc(t('ttColChgPp'))}">${chip(sign(x.change_pp), x.change_pp > 0)}</td><td data-label="${esc(t('ttColLost'))}">${x.time_lost_h}</td></tr>`).join('') + '</tbody>';
  }

  function vs() {
    const head = `<tr><th scope="col" class="tt-left">${t('ttColSrc')}</th><th scope="col">${t('ttColVal')}</th><th scope="col" class="tt-left">${t('ttColScope')}</th></tr>`;
    const zn = { inner: t('ttZoneInner'), middle: t('ttZoneMiddle'), outer: t('ttZoneOuter') };
    let rows = '';
    if (S) rows += ['inner', 'middle', 'outer'].map(z => `<tr><td class="tt-left" data-label="${esc(t('ttColSrc'))}">${fill(t('ttVsSjs'), { zone: zn[z] })}</td><td data-label="${esc(t('ttColVal'))}">${fill(t('ttVsInOut'), { i: f(S.zones[z].speed_2568_in, 2), o: f(S.zones[z].speed_2568_out, 2) })}</td><td class="tt-left" data-label="${esc(t('ttColScope'))}">${t('ttVsScopeSjs')}</td></tr>`).join('');
    const tom = [[t('ttVsTomAm'), T.rush.am.speed_kmh], [t('ttVsTomPm'), T.rush.pm.speed_kmh], [t('ttVsTomAvg'), T.city.rush_speed_kmh]];
    rows += tom.map(([l, v]) => `<tr class="is-tom"><td class="tt-left" data-label="${esc(t('ttColSrc'))}">${l}</td><td data-label="${esc(t('ttColVal'))}">${f2(v)}</td><td class="tt-left" data-label="${esc(t('ttColScope'))}">${t('ttVsScopeTom')}</td></tr>`).join('');
    $('#ttVs').innerHTML = `<thead>${head}</thead><tbody>${rows}</tbody>`;
  }

  function copyText() {
    const c = T.city, w = T.worst_day;
    const o = { cong: f(c.congestion_pct), congd: f(c.congestion_change_pp), rank: c.world_rank, t10: mmss(c.time_10km_s), t10d: c.time_10km_change_s, am: mmss(T.rush.am.time_10km_s), pm: mmss(T.rush.pm.time_10km_s),
      lost: c.rush_time_lost_h, lostd: f(c.rush_time_lost_change_h), date: fdate(w.date), wd: w.congestion_pct, w3: w.congestion_3pm_pct, ret: fdate(T.meta.retrieved) };
    $('#ttCopyText').innerText = ['ttCopyL0', 'ttCopyL1', 'ttCopyL2', 'ttCopyL3', 'ttCopyL4', 'ttCopyL5'].map(k => fill(t(k), o)).join('\n');
  }

  function sources() {
    $('#ttSources').innerHTML = T.meta.sources.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ↗</a></li>`).join('');
    $('#ttRetrieved').textContent = `${t('ttRetrieved')} ${fdate(T.meta.retrieved)}`;
  }


  /* ───────── อ่านตัวเลขอย่างไร (ภาษาง่าย) ───────── */
  let H = null, histMetric = 'cl', histMount = null;
  const hrow = (be, ed) => H && H.rows.find(r => r.year_be === be && r.edition === ed);
  const yearLabel = r => lang() === 'th' ? r.year_be : r.year_ce;

  function guide() {
    const el = $('#ttGuide'); if (!el) return;
    const c = T.city, mult = 1 + c.congestion_pct / 100, freeSec = c.time_10km_s / mult;
    const lostD = Math.floor(c.rush_time_lost_h / 24), lostH = Math.round(c.rush_time_lost_h - lostD * 24);
    const r14 = hrow(2567, 14), r15b = hrow(2567, 15);
    const cards = [
      ['ttG1T', 'ttG1B', { cong: f(c.congestion_pct), mult: f(mult, 2), free: mmss(freeSec), t10: mmss(c.time_10km_s) }],
      ['ttG2T', 'ttG2B', { lost: f(c.rush_time_lost_h, 0), d: lostD, h: lostH }],
      ['ttG3T', 'ttG3B', { r1: r14 ? r14.world_rank : '161', r2: c.world_rank }],
      ['ttG4T', 'ttG4B', { c1: r14 ? f(r14.congestion_pct) : '50.0', c2: r15b ? f(r15b.congestion_pct) : '66.6' }],
      ['ttG5T', 'ttG5B', {}]
    ];
    el.innerHTML = cards.map(([a, b, o], i) => `<article class="tt-gcard"><div class="tt-gcard__n" aria-hidden="true">${i + 1}</div><div><h3>${t(a)}</h3><p>${fill(t(b), o)}</p></div></article>`).join('');
  }

  /* ───────── ย้อนหลัง 2562–2568: กราฟ 2 ชุด + ตาราง ───────── */
  const METRICS = {
    cl:   { key: 'congestion_pct', apx: 'cl',   lab: 'ttHm1', full: 'ttHmFull1', min: 0,    max: 80,   ticks: [0, 20, 40, 60, 80],            fmt: v => f(v, 1) + '%',  tick: v => v + '%', zoom: false },
    t10:  { key: 'time_10km_s',    apx: 't10',  lab: 'ttHm2', full: 'ttHmFull2', min: 1200, max: 1440, ticks: [1200, 1260, 1320, 1380, 1440], fmt: v => mmss(v),       tick: v => mmss(v),  zoom: true },
    lost: { key: 'time_lost_h',    apx: 'lost', lab: 'ttHm3', full: 'ttHmFull3', min: 0,    max: 140,  ticks: [0, 35, 70, 105, 140],          fmt: v => f(v, 0),       tick: v => v,         zoom: false }
  };
  const COL_A = '#0A2E5C', COL_B = '#df1b12';
  const YEARS_BE = [2562, 2563, 2564, 2565, 2566, 2567, 2568];

  function seriesPoints(m, basis) {
    return H.rows.filter(r => r.basis === basis && r[m.key] != null && !(r.no_chart || []).includes(m.key))
      .map(r => ({ be: r.year_be, v: r[m.key], hollow: ['derived', 'unverified'].includes(r.grade) || (r.approx || []).includes(m.apx) }));
  }

  function drawHistChart() {
    const box = $('#ttHistBox'); if (!box || !H) return;
    const m = METRICS[histMetric], W = Math.max(280, Math.floor(box.clientWidth) || 320), small = W < 520, Hh = small ? 270 : 330;
    const ml = small ? 46 : 56, mr = 14, mt = 30, mb = 34, iw = W - ml - mr, ih = Hh - mt - mb;
    const X = be => ml + iw * (YEARS_BE.indexOf(be) + .5) / YEARS_BE.length;
    const Y = v => mt + ih - ih * (v - m.min) / (m.max - m.min);
    const A = seriesPoints(m, 'published'), B = seriesPoints(m, 'ed15');
    const fs = small ? 11 : 12;
    let g = '';
    // แถบโควิด 2563–2564
    const cx0 = ml + iw * 1 / YEARS_BE.length, cw = iw * 2 / YEARS_BE.length;
    g += `<rect x="${cx0}" y="${mt}" width="${cw}" height="${ih}" fill="var(--text-muted,#667)" opacity=".09"/><text x="${cx0 + cw / 2}" y="${mt + 14}" text-anchor="middle" font-size="${fs - 1}" fill="var(--text-muted,#667)">${esc(t('ttHcovid'))}</text>`;
    m.ticks.forEach(v => { g += `<line x1="${ml}" x2="${W - mr}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--border,#d6dbe3)" stroke-width="1"/><text x="${ml - 8}" y="${Y(v) + 4}" text-anchor="end" font-size="${fs}" fill="var(--text-muted,#667)">${esc(m.tick(v))}</text>`; });
    YEARS_BE.forEach(be => { g += `<text x="${X(be)}" y="${Hh - 10}" text-anchor="middle" font-size="${fs}" fill="var(--text-muted,#667)">${lang() === 'th' ? be : be - 543}</text>`; });
    const line = (pts, col) => {
      let d = ''; pts.forEach((p, i) => { const prev = pts[i - 1]; d += (prev && p.be - prev.be === 1 ? 'L' : 'M') + X(p.be).toFixed(1) + ' ' + Y(p.v).toFixed(1); });
      return `<path d="${d}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`;
    };
    g += line(A, COL_A) + line(B, COL_B);
    // ช่องว่างปี 2567 ระหว่างสองชุด
    const a67 = A.find(p => p.be === 2567), b67 = B.find(p => p.be === 2567);
    if (a67 && b67) {
      const xx = X(2567) + 12, d = Math.abs(b67.v - a67.v);
      const dtxt = histMetric === 'cl' ? `${f(d, 1)} ${t('ttUnitPp')}` : histMetric === 't10' ? `${Math.round(d)} ${t('ttUnitSec')}` : `${f(d, 1)} ${t('ttUnitHShort')}`;
      g += `<line x1="${xx}" x2="${xx}" y1="${Y(a67.v)}" y2="${Y(b67.v)}" stroke="var(--text-muted,#667)" stroke-width="1.4" stroke-dasharray="3 3"/>`;
      const lx = Math.min(xx + 6, W - mr - 4), anchor = lx > W - 150 ? 'end' : 'start';
      g += `<text x="${anchor === 'end' ? xx - 6 : lx}" y="${(Y(a67.v) + Y(b67.v)) / 2 + 4}" text-anchor="${anchor === 'end' ? 'end' : 'start'}" font-size="${fs}" font-weight="700" fill="var(--text-dark,#1b2330)">${esc(fill(t('ttHgap'), { d: dtxt }))}</text>`;
    }
    const dots = (pts, col, other, below) => pts.map(p => {
      const x = X(p.be), y = Y(p.v), clash = other.some(q => q.be === p.be);
      const up = clash ? !below : true, ly = up ? y - 11 : y + 20;
      return `<circle cx="${x}" cy="${y}" r="${small ? 5.5 : 6}" fill="${p.hollow ? 'var(--surface,#fff)' : col}" stroke="${col}" stroke-width="2.4"/><text x="${x}" y="${ly}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${col}">${esc(m.fmt(p.v))}</text>`;
    }).join('');
    g += dots(A, COL_A, B, true) + dots(B, COL_B, A, false);
    const axisNote = m.zoom ? `<text x="${W - mr}" y="${mt - 14}" text-anchor="end" font-size="${fs - 1}" fill="var(--text-muted,#667)">${esc(t('ttHaxis'))}</text>` : '';
    box.innerHTML = `<svg width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${esc(fill(t('ttHchartLabel'), { m: t(m.full) }))}">${g}${axisNote}</svg>`;
  }

  function history() {
    if (!H || !$('#ttHistBox')) return;
    $('#ttHistSeg').innerHTML = Object.keys(METRICS).map(k => `<button type="button" data-m="${k}" aria-pressed="${k === histMetric}">${t(METRICS[k].lab)}</button>`).join('');
    $$('#ttHistSeg button').forEach(b => b.onclick = () => { histMetric = b.dataset.m; $$('#ttHistSeg button').forEach(x => x.setAttribute('aria-pressed', x === b)); drawHistChart(); legend(); });
    legend(); drawHistChart();
    if (!histMount && window.ResizeObserver) { histMount = new ResizeObserver(() => drawHistChart()); histMount.observe($('#ttHistBox')); }
    // ข้อความสรุปที่อ่านอย่างปลอดภัย
    const r66 = hrow(2566, 13), r67 = hrow(2567, 14), r67b = hrow(2567, 15), r68 = hrow(2568, 15);
    if (r66 && r67 && r67b && r68) {
      const dt = r67b.time_10km_s - r67.time_10km_s;
      $('#ttHistTake').innerHTML = fill(t('ttHtake'), { t66: mmss(r66.time_10km_s), t67: mmss(r67.time_10km_s), t67b: mmss(r67b.time_10km_s), t68: mmss(r68.time_10km_s), dt, dtp: f(dt / r67.time_10km_s * 100, 1), dc: f(r67b.congestion_pct - r67.congestion_pct, 1) });
    }
    // ตาราง
    const approx = (r, k) => (r.approx || []).includes(k) ? '~' : '';
    const cell = (v, fm, r, k) => v == null ? '<span class="tt-na">–</span>' : approx(r, k) + fm(v);
    const head = `<tr><th scope="col" class="tt-left">${t('ttHcYear')}</th><th scope="col">${t('ttHcEd')}</th><th scope="col" class="tt-left">${t('ttHcSet')}</th><th scope="col">${t('ttHcRank')}</th><th scope="col">${t('ttHcCong')}</th><th scope="col">${t('ttHcT10')}</th><th scope="col">${t('ttHcLost')}</th><th scope="col" class="tt-left">${t('ttHcGrade')}</th><th scope="col" class="tt-left">${t('ttHcNote')}</th></tr>`;
    const gcls = { official: 'is-good', news: '', derived: 'is-warn', unverified: 'is-bad', none: '' };
    const body = H.rows.map(r => {
      const rank = r.world_rank == null ? '<span class="tt-na">–</span>' : `#${r.world_rank}`;
      const note = lang() === 'th' ? r.note_th : r.note_en;
      return `<tr class="${r.basis === 'ed15' ? 'is-tom' : ''}"><td class="tt-left" data-label="${esc(t('ttHcYear'))}"><strong>${lang() === 'th' ? r.year_be + ' (' + r.year_ce + ')' : r.year_ce + ' (' + r.year_be + ')'}</strong></td><td data-label="${esc(t('ttHcEd'))}">${r.edition}</td><td class="tt-left" data-label="${esc(t('ttHcSet'))}">${t(r.basis === 'ed15' ? 'ttSetEd15' : 'ttSetPub')}</td><td data-label="${esc(t('ttHcRank'))}">${rank}</td><td data-label="${esc(t('ttHcCong'))}">${cell(r.congestion_pct, v => f(v, 1) + '%', r, 'cl')}</td><td data-label="${esc(t('ttHcT10'))}">${cell(r.time_10km_s, mmss, r, 't10')}</td><td data-label="${esc(t('ttHcLost'))}">${cell(r.time_lost_h, v => f(v, v % 1 ? 1 : 0), r, 'lost')}</td><td class="tt-left" data-label="${esc(t('ttHcGrade'))}">${chip(t('ttGr' + r.grade.charAt(0).toUpperCase() + r.grade.slice(1)), gcls[r.grade] === 'is-good' ? false : gcls[r.grade] === 'is-bad' ? true : undefined)}</td><td class="tt-left tt-hnote" data-label="${esc(t('ttHcNote'))}">${esc(note)}</td></tr>`;
    }).join('');
    $('#ttHistTable').innerHTML = `<thead>${head}</thead><tbody>${body}</tbody>`;
  }
  function legend() {
    const m = METRICS[histMetric];
    $('#ttHistLegend').innerHTML = `<span><i class="tt-lg tt-lg--a"></i>${esc(t('ttHsA'))}</span><span><i class="tt-lg tt-lg--b"></i>${esc(t('ttHsB'))}</span><span><i class="tt-lg tt-lg--solid"></i>${esc(t('ttHsolid'))}</span><span><i class="tt-lg tt-lg--hollow"></i>${esc(t('ttHhollow'))}</span><span>${esc(t('ttHblank'))}</span>`;
    $('#ttHistSeg').setAttribute('aria-label', t(m.full));
  }

  function render() { if (!T) return; summary(); guide(); yoy(); history(); rush(); worst(); thailand(); vs(); copyText(); sources(); document.title = t('ttTitle'); }

  async function load() {
    try {
      const [a, b, hh] = await Promise.all([fetch('data/tomtom-2025.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
        fetch('data/dashboard-data.json').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('data/tomtom-history.json').then(r => r.ok ? r.json() : null).catch(() => null)]);
      T = a; S = b; H = hh;
      if (!H) { const sec = $('#tt-history'); if (sec) sec.hidden = true; }
      render();
    } catch (e) {
      console.error(e); const el = $('#ttError'); if (el) { el.hidden = false; el.textContent = t('ttLoadErr'); }
    }
  }

  // แสดงส่วนต่าง ๆ เมื่อเลื่อนถึง (.reveal เริ่มโปร่งใสใน styles.css — หน้านี้ไม่ได้โหลด app.js จึงต้องตั้งเอง)
  function setupReveal() {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in-view')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { threshold: 0.04, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  document.addEventListener('i18n:change', render);
  document.addEventListener('DOMContentLoaded', () => {
    setupReveal();
    load();
    const btn = $('#ttCopyBtn');
    if (btn) btn.addEventListener('click', async () => {
      const txt = $('#ttCopyText').innerText;
      try { await navigator.clipboard.writeText(txt); } catch (e) { const r = document.createRange(); r.selectNodeContents($('#ttCopyText')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('copy'); s.removeAllRanges(); }
      const old = btn.textContent; btn.textContent = t('ttCopyDone'); setTimeout(() => { btn.textContent = t('ttCopyBtn'); }, 1800);
    });
  });
})();
