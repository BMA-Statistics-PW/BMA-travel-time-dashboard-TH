/* ═══════════════════════════════════════════════════════
   BMA Travel Time Dashboard — Survey route map (OpenStreetMap + Leaflet)
   อ่านเส้นทางจาก data/survey-routes.geojson (สร้างด้วย tools/kml_to_geojson.py)
   © Prapawadee_W.  ·  แผนที่พื้นฐาน © OpenStreetMap contributors (ODbL)
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const GEOJSON_URL = 'data/survey-routes.geojson';
  const JUNCTION_URL = 'data/survey-intersections.geojson';
  const DISTRICT_URL = 'data/bkk-districts.geojson';
  const DATA_URL = 'data/dashboard-data.json';
  const ZONE_COLOR = { inner: '#d63031', middle: '#e17055', outer: '#00b894' };
  const BKK = [13.7563, 100.5018];

  if (window.BMA_I18N && window.BMA_I18N.extend) {
    window.BMA_I18N.extend({
      th: {
        navRoute: 'เส้นทางสำรวจ',
        routeEyebrow: 'Survey Routes · OpenStreetMap',
        routeHeading: 'เส้นทางสำรวจเวลาในการเดินทาง',
        routeIntro: 'แสดงเส้นทางที่รถสำรวจ (Floating Car Method) วิ่งเก็บข้อมูลบนแผนที่ OpenStreetMap แยกสีตามโซนพื้นที่ — เลือกถนนจากรายการเพื่อซูมไปยังเส้นทาง',
        routeMapLabel: 'แผนที่เส้นทางสำรวจเวลาในการเดินทางบน OpenStreetMap',
        routeLegend: 'โซนพื้นที่',
        routeSearchPh: '🔍 ค้นหาชื่อถนน...',
        routeListHead: 'รายการถนน',
        routeStatus: 'มีเส้นทางบนแผนที่ {n} จาก {t} สายถนน',
        routeNoGeom: 'ยังไม่มีข้อมูลเส้นทางของถนนสายนี้บนแผนที่',
        routeNoData: 'ยังไม่มีข้อมูลเส้นทางในไฟล์ survey-routes.geojson — ส่งออกแผนที่จาก Google My Maps เป็น KML แล้วแปลงด้วย tools/kml_to_geojson.py',
        routeLibFail: 'ไม่สามารถโหลดไลบรารีแผนที่ (Leaflet) ได้ — ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        routeOpenMyMaps: 'เปิดแผนที่ต้นฉบับใน Google My Maps ↗',
        routeAttrib: 'แผนที่พื้นฐาน: © ผู้ร่วมสร้าง OpenStreetMap (สัญญาอนุญาต ODbL)',
        routeLen: 'ความยาว',
        routeKm: 'กม.',
        routeZoneInner: 'ชั้นใน',
        routeZoneMiddle: 'ชั้นกลาง',
        routeZoneOuter: 'ชั้นนอก',
        footerMap: 'แผนที่: © OpenStreetMap contributors (ODbL) · Leaflet · เส้นทาง/ทางแยก/ขอบเขตเขต: สำนักการจราจรและขนส่ง กทม.',
        routeNote: 'แหล่งข้อมูล: แผนที่เส้นทางสำรวจเวลาในการเดินทาง สำนักการจราจรและขนส่ง กทม. (ข้อมูล ณ ปี พ.ศ. 2568) · หมายเหตุ: พหลโยธินและรามคำแหงแบ่งเป็นสองท่อนตามโซนโดยประมาณจากตำแหน่งทางแยก · ต้องเชื่อมต่ออินเทอร์เน็ตเพื่อแสดงแผนที่พื้นหลัง',
        routeLayers: 'ชั้นข้อมูล',
        routeLayerDistricts: 'ขอบเขตเขต',
        routeLayerJunctions: 'ทางแยกสำรวจ',
        routeSignal: 'รหัสสัญญาณไฟ',
        routeOnRoads: 'ถนน',
        routeDistrictPrefix: 'เขต'
      },
      en: {
        navRoute: 'Survey routes',
        routeEyebrow: 'Survey Routes · OpenStreetMap',
        routeHeading: 'Travel-time survey routes',
        routeIntro: 'Routes driven by the probe vehicle (Floating Car Method) shown on OpenStreetMap, coloured by zone — pick a road from the list to zoom to its route.',
        routeMapLabel: 'Map of travel-time survey routes on OpenStreetMap',
        routeLegend: 'Zones',
        routeSearchPh: '🔍 Search road name...',
        routeListHead: 'Road list',
        routeStatus: '{n} of {t} roads have a route on the map',
        routeNoGeom: 'No route geometry for this road on the map yet',
        routeNoData: 'survey-routes.geojson has no routes yet — export the Google My Maps layer as KML and convert it with tools/kml_to_geojson.py',
        routeLibFail: 'Could not load the map library (Leaflet) — please check your connection.',
        routeOpenMyMaps: 'Open the source map in Google My Maps ↗',
        routeAttrib: 'Base map: © OpenStreetMap contributors (ODbL)',
        routeLen: 'Length',
        routeKm: 'km',
        routeZoneInner: 'Inner',
        routeZoneMiddle: 'Middle',
        routeZoneOuter: 'Outer',
        footerMap: 'Map: © OpenStreetMap contributors (ODbL) · Leaflet · Routes/intersections/district boundaries: Traffic and Transportation Department, BMA',
        routeNote: 'Source: travel-time survey route map, Traffic and Transportation Department, BMA (data as of B.E. 2568 / 2025). Note: Phahon Yothin and Ramkhamhaeng are split into two segments by zone, approximated from intersection positions. An internet connection is required for the base map.',
        routeLayers: 'Layers',
        routeLayerDistricts: 'District boundaries',
        routeLayerJunctions: 'Surveyed intersections',
        routeSignal: 'Signal code',
        routeOnRoads: 'Roads',
        routeDistrictPrefix: 'District'
      }
    });
  }

  const $ = (s, c = document) => c.querySelector(s);
  const t = (k) => (window.BMA_I18N ? window.BMA_I18N.t(k) : k);
  const label = (n) => (window.BMA_displayName ? window.BMA_displayName(n) : n);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s || '').replace(/^\s*(ถนน|ถ\.)\s*/, '').replace(/\s+/g, '').toLowerCase();

  let map = null, layerByRoad = {}, roads = [], geo = null, junc = null, dist = null;
  const extraOn = { districts: true, junctions: true };
  const extraLayer = {};
  const zoneOn = { inner: true, middle: true, outer: true };
  let query = '';

  function zoneLabel(z) { return t('routeZone' + z.charAt(0).toUpperCase() + z.slice(1)); }

  function buildLayers() {
    layerByRoad = {};
    if (map._routeGroup) map.removeLayer(map._routeGroup);
    const group = L.featureGroup();
    ((geo && geo.features) || []).forEach((f) => {
      const p = f.properties || {};
      const key = norm(p.name);
      const road = roads.find((r) => norm(r.name) === key);
      const zone = p.zone || (road && road.zone) || 'middle';
      if (!zoneOn[zone]) return;
      const lyr = L.geoJSON(f, {
        style: { color: ZONE_COLOR[zone] || '#0A2E5C', weight: 5, opacity: 0.85, lineCap: 'round' },
        pointToLayer: (ft, ll) => L.circleMarker(ll, { radius: 6, color: '#fff', weight: 2, fillColor: ZONE_COLOR[zone], fillOpacity: 1 })
      });
      const len = road && road.length_km != null ? '<br>' + t('routeLen') + ': ' + esc(road.length_km) + ' ' + t('routeKm') : '';
      lyr.bindPopup('<strong>' + esc(label(p.name || (road && road.name) || '')) + '</strong><br>' +
        esc(p.segment || (road && road.segment) || '') + '<br><span style="color:' + ZONE_COLOR[zone] + '">● ' + esc(zoneLabel(zone)) + '</span>' + len);
      lyr.addTo(group);
      (layerByRoad[key] = layerByRoad[key] || []).push(lyr);
    });
    group.addTo(map);
    map._routeGroup = group;
    if (group.getLayers().length) {
      try { map.fitBounds(group.getBounds(), { padding: [20, 20] }); } catch (e) { /* ignore */ }
    }
  }

  function buildExtras() {
    ['districts', 'junctions'].forEach((k) => { if (extraLayer[k]) { map.removeLayer(extraLayer[k]); extraLayer[k] = null; } });
    if (extraOn.districts && dist && dist.features) {
      extraLayer.districts = L.geoJSON(dist, {
        interactive: false,
        style: (f) => ({ color: ZONE_COLOR[f.properties.zone] || '#647687', weight: 1, opacity: 0.6, fillColor: ZONE_COLOR[f.properties.zone] || '#647687', fillOpacity: 0.08 })
      }).addTo(map);
      extraLayer.districts.bringToBack();
    }
    if (extraOn.junctions && junc && junc.features) {
      extraLayer.junctions = L.geoJSON(junc, {
        pointToLayer: (f, ll) => L.circleMarker(ll, { radius: 4, color: '#fff', weight: 1, fillColor: '#0A2E5C', fillOpacity: 0.9 }),
        onEachFeature: (f, lyr) => {
          const p = f.properties;
          lyr.bindPopup('<strong>' + esc(p.name) + '</strong><br>' + esc(t('routeOnRoads')) + ': ' + esc((p.roads || []).map(label).filter((v, i, a) => a.indexOf(v) === i).join(', ')) +
            ((p.signal_codes || []).length ? '<br>' + esc(t('routeSignal')) + ': ' + esc(p.signal_codes.join(', ')) : ''));
        }
      }).addTo(map);
      if (map._routeGroup) map._routeGroup.bringToFront();
    }
  }

  function renderList() {
    const ul = $('#routeRoadList');
    if (!ul) return;
    const q = query.trim().toLowerCase();
    const rows = roads.filter((r) => zoneOn[r.zone] && (!q || (r.name + ' ' + (r.segment || '')).toLowerCase().includes(q)));
    ul.innerHTML = rows.map((r) => {
      const has = !!layerByRoad[norm(r.name)];
      return '<li><button type="button" class="route-item' + (has ? '' : ' no-geom') + '" data-key="' + esc(norm(r.name)) + '" data-zone="' + esc(r.zone) + '"' +
        (has ? '' : ' aria-disabled="true" title="' + esc(t('routeNoGeom')) + '"') + '>' +
        '<span class="route-dot" style="background:' + ZONE_COLOR[r.zone] + '" aria-hidden="true"></span><span class="sr-only">' + esc(zoneLabel(r.zone)) + ' </span>' +
        '<span class="route-name">' + esc(r.seq) + '. ' + esc(label(r.name)) + '</span>' +
        '<span class="route-seg">' + esc(r.segment || '') + '</span></button></li>';
    }).join('');
    const withGeom = roads.filter((r) => layerByRoad[norm(r.name)]).length;
    const st = $('#routeStatus');
    if (st) {
      st.textContent = (geo && geo.features && geo.features.length)
        ? t('routeStatus').replace('{n}', withGeom).replace('{t}', roads.length)
        : t('routeNoData');
    }
  }

  function bindUI() {
    const ul = $('#routeRoadList');
    ul.addEventListener('click', (e) => {
      const b = e.target.closest('.route-item');
      if (!b) return;
      const lyrs = layerByRoad[b.dataset.key];
      if (!lyrs) { const st = $('#routeStatus'); if (st) st.textContent = t('routeNoGeom'); return; }
      const grp = L.featureGroup(lyrs);
      map.fitBounds(grp.getBounds(), { padding: [40, 40], maxZoom: 16 });
      lyrs[0].openPopup(grp.getBounds().getCenter());
      $('#routeMap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    document.querySelectorAll('.route-layer-toggle').forEach((cb) => {
      cb.addEventListener('change', () => { extraOn[cb.value] = cb.checked; buildExtras(); });
    });
    document.querySelectorAll('.route-zone-toggle').forEach((cb) => {
      cb.addEventListener('change', () => { zoneOn[cb.value] = cb.checked; buildLayers(); renderList(); });
    });
    const s = $('#routeSearch');
    if (s) s.addEventListener('input', () => { query = s.value; renderList(); });
    document.addEventListener('i18n:change', () => { if (map) { buildLayers(); renderList(); } });
  }

  function init() {
    const el = $('#routeMap');
    if (!el || map) return;
    if (!window.L) {
      el.classList.add('route-map-fail');
      el.textContent = t('routeLibFail');
      return;
    }
    map = L.map(el, { center: BKK, zoom: 11, minZoom: 9, scrollWheelZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);
    // กันเลื่อนหน้าโดยไม่ตั้งใจ: ซูมด้วยล้อเมาส์เมื่อโฟกัสแผนที่แล้วเท่านั้น
    map.on('focus', () => map.scrollWheelZoom.enable());
    map.on('blur', () => map.scrollWheelZoom.disable());

    Promise.all([
      fetch(DATA_URL).then((r) => r.json()).catch(() => ({})),
      fetch(GEOJSON_URL).then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch(JUNCTION_URL).then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch(DISTRICT_URL).then((r) => (r.ok ? r.json() : null)).catch(() => null)
    ]).then(([d, g, j, ds]) => {
      roads = (d && d.roads_2568) || [];
      geo = g; junc = j; dist = ds;
      bindUI();
      buildLayers();
      buildExtras();
      renderList();
    });
  }

  function lazyInit() {
    // เริ่มสร้างแผนที่เมื่อหน้าต่าง "เส้นทางสำรวจ" ถูกเปิด (ขนาดคอนเทนเนอร์ต้องไม่เป็น 0)
    document.addEventListener('panel:show', (e) => {
      if (e.detail.id !== 'route') return;
      if (!map) init();
      setTimeout(() => map && map.invalidateSize(), 50);
    });
    if (!document.body.classList.contains('has-tabs')) {
      // ไม่มี tab → สร้างทันที
      setTimeout(() => { if (!document.body.classList.contains('has-tabs')) init(); }, 0);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lazyInit);
  else lazyInit();
})();
