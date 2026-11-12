/* ════════════════════════════════════════════════════════════════════
   BMA Travel Time Dashboard — i18n (TH/EN)
   © Prapawadee_W.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const STORAGE_KEY = 'bma-dashboard-lang';
  let initialized = false;   // true หลัง applyLang ครั้งแรกตอน DOMContentLoaded

  const TRANSLATIONS = {
    th: {
      // utility bar
      utilOrg: 'Bangkok Metropolitan Administration',
      utilDept: 'Traffic and Transportation Department',
      skip: 'ข้ามไปยังเนื้อหาหลัก',

      // hero
      heroEyebrow: 'รายงานการจราจร · กรุงเทพมหานคร',
      heroTitle1: 'รายงานสรุปผลการวิเคราะห์',
      heroTitle2: 'เวลาและอัตราเร็วเฉลี่ยในการเดินทาง',
      heroTitle3: 'ในพื้นที่กรุงเทพมหานคร',
      heroMeta: 'ช่วงเวลาเร่งด่วน (Peak Hours) · พ.ศ. 2560–2568 · 51 สายถนน · 3 โซนพื้นที่',
      heroMethod: 'วิธีการสำรวจ: <strong>วิธีรถสำรวจตามกระแสจราจร (Floating Car Method)</strong>',
      heroOrg: 'กลุ่มงานสถิติและวิจัย · กองนโยบายและแผนงาน · สำนักการจราจรและขนส่ง · กรุงเทพมหานคร',

      // intro & method
      introHead: 'บทนำ',
      introText: '<strong>สำนักการจราจรและขนส่ง (สจส.) กรุงเทพมหานคร</strong> ได้ดำเนินการสำรวจข้อมูลเวลาในการเดินทางด้วย <strong>วิธีรถสำรวจตามกระแสจราจร (Floating Car Method)</strong> เพื่อวิเคราะห์แนวโน้มอัตราเร็วเฉลี่ย (Average Speed) บนโครงข่ายถนนสายหลัก <strong>51 สาย</strong> ในช่วงเวลาเร่งด่วน (Peak Hours) โดยจำแนกตามลักษณะทางกายภาพของพื้นที่ออกเป็น 3 โซน ได้แก่ พื้นที่ชั้นใน (Inner Zone) พื้นที่ชั้นกลาง (Middle Zone) และพื้นที่ชั้นนอก (Outer Zone) เพื่อประกอบการกำหนดทิศทางนโยบายการจราจรและการพัฒนาระบบขนส่งสาธารณะ',
      methodTitle: 'วิธีรถสำรวจตามกระแสจราจร (Floating Car Method)',
      methodDesc: 'เก็บข้อมูลโดยให้รถสำรวจวิ่งตามกระแสจราจรบนเส้นทางที่กำหนด บันทึกเวลาและระยะทางตั้งแต่จุดเริ่มต้นถึงจุดสิ้นสุดของเส้นทางในแต่ละเที่ยว แล้วคำนวณอัตราเร็วเฉลี่ย (Average Speed) โดยดำเนินการซ้ำหลายเที่ยวในช่วงเร่งด่วนเช้า (07:00–09:00) และช่วงเร่งด่วนเย็น (16:00–18:00) แยกทิศทางขาเข้า (Inbound) และขาออก (Outbound) เพื่อให้ได้ค่าที่สะท้อนสภาพการจราจรจริงบนถนนสายหลัก',
      mp1: '51 สายถนน',
      mp2: 'ช่วงเร่งด่วนเช้า (AM Peak) 07:00–09:00',
      mp3: 'ช่วงเร่งด่วนเย็น (PM Peak) 16:00–18:00',
      mp4: 'ขาเข้า/ขาออก (Inbound/Outbound)',

      // nav
      navTomtom: 'ดัชนี TomTom',
      navCompare: 'เปรียบเทียบ',
      navZones: 'รายละเอียดพื้นที่',
      navTrend: 'กราฟแนวโน้ม',
      navTable: 'ตาราง 51 สาย',
      navBau: 'คาดการณ์ (BAU)',

      // tomtom
      tomtomEyebrow: 'TomTom Traffic Index 2025',
      tomtomHeading: 'มุมมองระดับโลก: กรุงเทพมหานครในดัชนีการจราจร TomTom (TomTom Traffic Index)',
      tomtomSub: 'ข้อมูลจากระบบกำหนดตำแหน่งบนพื้นโลก (GPS) ครอบคลุมระยะทางกว่า 3.65 ล้านล้านกิโลเมตรทั่วโลก ปี ค.ศ. 2025',
      tomtomCity: 'กรุงเทพมหานคร — ดัชนีการจราจร TomTom (TomTom Traffic Index) ปี ค.ศ. 2025',
      tt1l: 'อันดับโลก<br>ด้านความแออัดของการจราจร<br>(Congestion Rank)',
      tt2l: 'ระดับความแออัด<br>(Congestion Level)',
      tt2s: 'สูงขึ้น 1.3 จุดร้อยละ (pp) จากปี ค.ศ. 2024',
      tt3l: 'นาทีต่อ 10 กม. (เฉลี่ย)',
      tt3s: 'เพิ่มขึ้น 36 วินาที จากปี ค.ศ. 2024',
      tt4l: 'นาทีต่อ 10 กม.<br>ช่วงเร่งด่วนเช้า · ความแออัด 88.4%',
      tt5l: 'นาทีต่อ 10 กม.<br>ช่วงเร่งด่วนเย็น · ความแออัด 126.5%',
      tt6l: 'ชั่วโมงต่อปี',
      tt6s: 'เวลาที่สูญเสียในช่วงเร่งด่วน (ประมาณ 4 วัน 19 ชั่วโมง)',
      tomtomNote: '<strong>กรุงเทพมหานครอยู่ในอันดับ 10 ของโลกด้านความแออัดของการจราจร (Congestion)</strong> โดยใช้เวลาเดินทางมากกว่าสภาพการจราจรคล่องตัว (Free-flow) ถึง <strong>67.9%</strong> ข้อมูลของ TomTom มาจากข้อมูล GPS ขนาดใหญ่ (Big Data) ครอบคลุมถนนทุกสายรวมทางด่วน ตลอด 24 ชั่วโมง 365 วัน จึงไม่ควรเปรียบเทียบโดยตรงกับข้อมูลของ สจส. ซึ่งสำรวจเฉพาะถนนสายหลัก 51 สายในช่วงเร่งด่วนด้วยวิธีรถสำรวจตามกระแสจราจร (Floating Car Method)',

      // comparison
      cmpTitle: 'เปรียบเทียบเชิงตัวเลข: สจส. ปี พ.ศ. 2568 และ TomTom Traffic Index ปี ค.ศ. 2025',
      cmpCaption: 'เปรียบเทียบตัวเลขระหว่าง สจส. และ TomTom Traffic Index 2025',
      cmpThIndicator: 'ตัวชี้วัด',
      cmpThInner: 'สจส. ชั้นใน<br><small>27 ถนน</small>',
      cmpThMiddle: 'สจส. ชั้นกลาง<br><small>17 ถนน</small>',
      cmpThOuter: 'สจส. ชั้นนอก<br><small>7 ถนน</small>',
      cmpThTomTom: 'TomTom ค.ศ. 2025<br><small>พื้นที่เมือง (City Area)</small>',
      rMethod: 'วิธีการสำรวจ',
      rSpeedIn: 'อัตราเร็วเฉลี่ย (กม./ชม.)',
      rSpeedInSub: 'ช่วงเร่งด่วน · ขาเข้า (เฉลี่ยเช้าและเย็น)',
      rSpeedOut: 'อัตราเร็วเฉลี่ย (กม./ชม.)',
      rSpeedOutSub: 'ช่วงเร่งด่วน · ขาออก (เฉลี่ยเช้าและเย็น)',
      rTtIn: 'เวลาเดินทาง 10 กม.',
      rTtInSub: 'ช่วงเร่งด่วน · ขาเข้า',
      rTtOut: 'เวลาเดินทาง 10 กม.',
      rTtOutSub: 'ช่วงเร่งด่วน · ขาออก',
      rCongestion: 'ระดับความแออัด',
      rCongestionNa: 'ไม่มีการวัดค่าในรูปแบบนี้',
      rScope: 'ขอบเขตการสำรวจ',
      rScope1: '27 ถนน ช่วงเร่งด่วนเช้า–เย็น',
      rScope2: '17 ถนน ช่วงเร่งด่วนเช้า–เย็น',
      rScope3: '7 ถนน ช่วงเร่งด่วนเช้า–เย็น',
      rScope4: 'ทุกสายทางรวมทางด่วน ตลอด 24 ชั่วโมง',
      m393: '39.29 นาที', m287: '28.7 นาที', m231: '23.09 นาที',
      m350: '34.97 นาที', m221: '22.1 นาที', m170: '16.96 นาที',
      m270: '27.03 นาที', m211: '21.09 นาที',
      sourceNote: '<strong>* หมายเหตุ:</strong> ข้อมูล <strong>สจส.</strong> สำรวจเฉพาะถนนสายหลัก 51 สายด้วย <strong>Floating Car Method</strong> ในช่วงเร่งด่วนเช้าและเย็น แยกทิศทางขาเข้าและขาออก · ตัวเลขในตารางเป็นค่าเฉลี่ยช่วงเร่งด่วน (เฉลี่ยเช้าและเย็น) ตามแผ่นงาน Report sheet ของรายงานต้นฉบับ · เวลาเดินทางคำนวณจาก 10 ÷ อัตราเร็วเฉลี่ย × 60 นาที<br><strong>** ข้อมูล TomTom</strong> มาจากข้อมูล GPS ขนาดใหญ่ (Big Data) ครอบคลุมถนนทุกสายตลอด 24 ชั่วโมง · (*) อัตราเร็ว TomTom ช่วงเช้าคำนวณจากเวลาเดินทาง 10 กม. (25:45 นาที) · (**) อัตราเร็ว TomTom ช่วงเย็น 19.10 กม./ชม. เป็นค่าอัตราเร็วเฉลี่ย (Average Speed) ในช่วงเร่งด่วนเย็น (Evening Rush Hour) ที่รายงานโดยตรง',

      // zone-district
      zdHeader: 'รายละเอียดพื้นที่ชั้นใน · ชั้นกลาง · ชั้นนอก',
      zdBadge: '3 กลุ่ม · 50 เขต',
      zdInnerTitle: 'พื้นที่ชั้นใน <span class="zd-count inner">15 เขต</span>',
      zdInnerDesc: 'บริเวณรอบเกาะรัตนโกสินทร์',
      zdInnerList: 'คลองสาน, ดินแดง, ดุสิต, ธนบุรี, บางกอกน้อย, บางกอกใหญ่, บางพลัด, บางรัก, ปทุมวัน, ป้อมปราบศัตรูพ่าย, พญาไท, พระนคร, ราชเทวี, สาทร, สัมพันธวงศ์',
      zdMidTitle: 'พื้นที่ชั้นกลาง <span class="zd-count middle">20 เขต</span>',
      zdMidDesc: 'ตั้งแต่รอบเกาะรัตนโกสินทร์ถึงบริเวณถนนวงแหวน',
      zdMidList: 'คลองเตย, คันนายาว, จตุจักร, จอมทอง, บางกะปิ, บางเขน, บางคอแหลม, บางซื่อ, บึงกุ่ม, พระโขนง, ภาษีเจริญ, ยานนาวา, ราษฎร์บูรณะ, ลาดพร้าว, วังทองหลาง, วัฒนา, สะพานสูง, สวนหลวง, หลักสี่, ห้วยขวาง',
      zdOutTitle: 'พื้นที่ชั้นนอก <span class="zd-count outer">15 เขต</span>',
      zdOutDesc: 'รอบนอกถนนวงแหวน',
      zdOutList: 'คลองสามวา, ดอนเมือง, ตลิ่งชัน, ทวีวัฒนา, ทุ่งครุ, บางขุนเทียน, บางนา, บางบอน, บางแค, ประเวศ, มีนบุรี, ลาดกระบัง, สายไหม, หนองจอก, หนองแขม',

      // controls
      ctrlHead: 'ตัวเลือกการแสดงผลแบบโต้ตอบ (Interactive Controls)',
      ctrlZone: 'กรองข้อมูลตามโซนพื้นที่',
      ctrlTrend: 'กรองข้อมูลตามแนวโน้ม',
      ctrlSearch: 'ค้นหาในตาราง',
      ctrlSearchPh: 'พิมพ์คำค้น เช่น ชั้นกลาง, สุขุมวิท',
      ctrlReset: 'ล้างตัวกรอง (Reset)',
      ctrlPrint: 'พิมพ์รายงาน',
      filterStatus: 'กำลังแสดงข้อมูลทั้งหมด',
      optAllZones: 'ทุกโซนพื้นที่',
      optInner: 'พื้นที่ชั้นใน',
      optMiddle: 'พื้นที่ชั้นกลาง',
      optOuter: 'พื้นที่ชั้นนอก',
      optAllTrend: 'ทุกแนวโน้ม',
      optTrendDown: 'เฉพาะแนวโน้มลดลง',

      // KPI cards
      cardTitleInner: 'พื้นที่ชั้นใน',
      cardTitleMiddle: 'พื้นที่ชั้นกลาง',
      cardTitleOuter: 'พื้นที่ชั้นนอก',
      cardYearBadge: 'ข้อมูลปี พ.ศ. 2568 · ช่วงเร่งด่วน (เฉลี่ยเช้าและเย็น)',
      dirIn: '▲ ขาเข้า',
      dirOut: '▼ ขาออก',
      dirInShort: 'ขาเข้า',
      dirOutShort: 'ขาออก',
      unitKmh: 'กม./ชม.',
      unitMin: 'นาที',

      // trend chart
      trendTitle: 'กราฟเส้นเปรียบเทียบอัตราเร็วเฉลี่ย (Average Speed) ปี พ.ศ. 2560–2568',
      trendSub: 'หน่วย: กม./ชม. · ทิศทางขาเข้า · เลื่อนตัวชี้หรือแตะที่ปีเพื่อดูค่า · เปรียบเทียบ 3 โซนพื้นที่',
      legOuter: 'พื้นที่ชั้นนอก',
      legMiddle: 'พื้นที่ชั้นกลาง',
      legInner: 'พื้นที่ชั้นใน',

      // road table
      roadTableTitle: 'ตารางข้อมูลอัตราเร็วเฉลี่ยรายถนน 51 สาย ปี พ.ศ. 2568',
      rtIntro: 'เลือกที่ส่วนหัวของโซน <span class="rt-icon-hint">▼</span> เพื่อขยายดูรายละเอียดรายถนน · ตารางมีแผนภูมิขนาดย่อ (Mini-chart) แสดง 4 ช่วงเวลาและทิศทาง และแผนที่ความร้อน (Heatmap) แสดงระดับอัตราเร็ว',
  rtToggleShow: 'แสดงตาราง',
  rtToggleHide: 'ซ่อนตาราง',
      rtSearchPh: 'ค้นหาชื่อถนนหรือช่วงถนน...',
      rtExpandAll: 'ขยายทั้งหมด',
      rtCollapseAll: 'ย่อทั้งหมด',
      zaInner: 'พื้นที่ชั้นใน',
      zaMiddle: 'พื้นที่ชั้นกลาง',
      zaOuter: 'พื้นที่ชั้นนอก',
      zaAvgIn: 'เฉลี่ยขาเข้าเช้า',
      zaRange: 'ช่วง',
      thRoad: 'ชื่อถนน / ช่วงถนน',
      thLen: 'ระยะทาง<br><small>(กม.)</small>',
      thAmRush: 'ช่วงเร่งด่วนเช้า',
      thPmRush: 'ช่วงเร่งด่วนเย็น',
      thMini: 'แผนภูมิขนาดย่อ (Mini-chart)',
      thIn: 'ขาเข้า',
      thOut: 'ขาออก',
      legSpeedLevel: 'ระดับอัตราเร็ว:',
      legFast: '🟢 ≥ 30 กม./ชม.',
      legMid: '🔵 20–30',
      legSlow: '🟡 10–20',
      legJam: '🔴 < 10',
      legMiniLabel: 'แผนภูมิขนาดย่อ (Mini-chart):',
      legAmIn: 'เช้า · ขาเข้า',
      legAmOut: 'เช้า · ขาออก',
      legPmIn: 'เย็น · ขาเข้า',
      legPmOut: 'เย็น · ขาออก',

      // BAU
      bauTitle: 'การวิเคราะห์แนวโน้มกรณีไม่มีมาตรการแทรกแซง (Business as Usual: BAU)',
      bauSub: 'คาดการณ์ปีถัดไปจากแนวโน้ม 3 ปีล่าสุดของอัตราเร็วเฉลี่ยช่วงเร่งด่วน · ทิศทางขาเข้า',
      bauInner: 'พื้นที่ชั้นใน',
      bauMiddle: 'พื้นที่ชั้นกลาง',
      bauOuter: 'พื้นที่ชั้นนอก',
      bauProj: 'ค่าคาดการณ์ ปี พ.ศ. 2569',
      bauTime: 'เวลาเดินทาง 10 กม.',
      bauDelta: 'การเปลี่ยนแปลงต่อปี',
      bauNote: 'หมายเหตุ: เป็นการคาดการณ์เชิงแนวโน้ม (Trend Projection) เพื่อเตือนความเสี่ยงเท่านั้น มิใช่แบบจำลองการจราจรระดับโครงข่าย (Network-level Traffic Model)',

      // 2560 vs 2568
      cmpYearsTitle: 'ตารางเปรียบเทียบอัตราเร็วเฉลี่ย ปี พ.ศ. 2560 และ 2568 (ทิศทางขาเข้า)',
      thZoneGroup: 'กลุ่มพื้นที่',
      th2560: 'ปี 2560 (กม./ชม.)',
      th2568: 'ปี 2568 (กม./ชม.)',
      thDelta: 'ผลต่าง (กม./ชม.)',
      thPct: 'ร้อยละการเปลี่ยนแปลง',
      zaInnerShort: 'ชั้นใน',
      zaMidShort: 'ชั้นกลาง',
      zaOutShort: 'ชั้นนอก',

      // findings & policy
      findingsTitle: 'ข้อค้นพบเชิงสถิติที่สำคัญ (Key Findings)',
      finding1: '<strong>พื้นที่ชั้นใน:</strong> การจราจรหนาแน่นต่อเนื่อง — อัตราเร็วเฉลี่ยช่วงเร่งด่วนทิศทางขาเข้า (เฉลี่ยเช้าและเย็น) 15.27 กม./ชม. ใช้เวลาเดินทาง 39.29 นาทีต่อ 10 กม.',
      finding2: '<strong>พื้นที่ชั้นกลาง:</strong> เพิ่มขึ้นร้อยละ 4.18 จากปี 2560 แต่ลดลงต่อเนื่องตั้งแต่ปี 2566 (24.12 → 22.20 กม./ชม.) ทั้งนี้ ถนนเพชรเกษมช่วงราชพฤกษ์–วงเวียนใหญ่ มีอัตราเร็วไม่ลดลงรุนแรงดังที่เคยรายงานไว้',
      cmpFixNote: 'หมายเหตุ: ค่าพื้นที่ชั้นกลาง ปี 2567–2568 ปรับปรุงแล้ว (วันที่ 2 พฤศจิกายน พ.ศ. 2569) หลังพบว่าสูตรคำนวณอัตราเร็วช่วงเพชรเกษมชั้นกลาง (ราชพฤกษ์–วงเวียนใหญ่) ใช้เวลาของช่วงชั้นนอก ทำให้ค่าต่ำเกินจริง (ขาเข้า 2568: 20.90 → 22.20; ขาออก 27.14 → 28.45)',
      rtLenNote: '* ถนนที่มีช่วงเดินรถทางเดียว (One-way) หรือสำรวจเฉพาะบางทิศทาง จะมีความยาวขาเข้าและขาออกไม่เท่ากัน (เลื่อนตัวชี้หรือแตะที่ค่าเพื่อดูความยาวของแต่ละทิศทาง) อัตราเร็วคำนวณจากระยะทางที่รถสำรวจวิ่งจริงในแต่ละเที่ยว',
      finding3: '<strong>พื้นที่ชั้นนอก:</strong> ลดลงมากที่สุดร้อยละ <strong>11.08</strong> สะท้อนการขยายตัวของชุมชนรอบนอก',
      finding4: '<strong>ปี พ.ศ. 2564 (การระบาดของโรคโควิด-19):</strong> อัตราเร็วเฉลี่ยสูงสุดในรอบ 9 ปีในทุกโซน ซึ่งสอดคล้องกับปริมาณรถที่ลดลง',
      finding5: '<strong>ทิศทางขาออกมีอัตราเร็วสูงกว่าขาเข้าในทุกโซน:</strong> ชั้นใน +1.89 · ชั้นกลาง +6.25 · ชั้นนอก +9.38 กม./ชม. (ช่วงเร่งด่วน เฉลี่ยเช้าและเย็น)',
      policyTitle: 'ข้อเสนอแนะเชิงนโยบาย',
      policy1: 'เร่งรัดการพัฒนาโครงข่ายระบบขนส่งสาธารณะสายรอง (Feeder)',
      policy2: 'บูรณาการจุดเชื่อมต่อการเดินทางหลายรูปแบบ (Multi-modal)',
      policy3: 'ประยุกต์ใช้เทคโนโลยีการจราจรอัจฉริยะ (Smart Traffic) ปัญญาประดิษฐ์ (AI) และระบบควบคุมสัญญาณไฟจราจรแบบอัตโนมัติ (Area Traffic Control: ATC)',
      policy4: 'ส่งเสริมการพัฒนาพื้นที่จุดจอดแล้วจร (Park &amp; Ride)',
      policy5: 'มาตรการเฉพาะพื้นที่ชั้นนอก: เพิ่มความถี่ของบริการขนส่งสาธารณะในพื้นที่ชั้นนอก',

      // footer
      footerOrgL1: 'สำนักการจราจรและขนส่ง กรุงเทพมหานคร',
      footerOrgL2: 'กลุ่มงานสถิติและวิจัย กองนโยบายและแผนงาน',
      footerMethod: 'วิธีการสำรวจ: <strong>Floating Car Method</strong>',
      footerAsOf: 'ข้อมูล ณ วันที่ 31 ธันวาคม พ.ศ. 2568',
      footerAuthor: 'วิเคราะห์และจัดทำโดย <strong>© Prapawadee_W.</strong>',
      footerTomTom: 'TomTom Traffic Index 2025 ↗',
      navTomtomPage: 'TomTom (หน้าเต็ม) →',
      ttOpenPage: 'ดูรายงานสถานการณ์ TomTom ฉบับเต็ม →',
    },

    en: {
      utilOrg: 'Bangkok Metropolitan Administration',
      utilDept: 'Traffic and Transportation Department',
      skip: 'Skip to main content',

      heroEyebrow: 'Traffic Report · Bangkok Metropolitan',
      heroTitle1: 'Analysis Report on',
      heroTitle2: 'Travel Time and Average Speed',
      heroTitle3: 'in the Bangkok Metropolitan Area',
      heroMeta: 'Rush hour periods · 2017–2025 · 51 main roads · 3 zones',
      heroMethod: 'Method: <strong>Floating Car Method</strong> (probe vehicle survey along traffic flow)',
      heroOrg: 'Statistics and Research Group · Policy and Planning Division · Traffic and Transportation Department · BMA',

      introHead: 'Introduction',
      introText: 'The <strong>Traffic and Transportation Department, Bangkok Metropolitan Administration</strong> conducted travel-time surveys using the <strong>Floating Car Method</strong> to analyse trends in average vehicle speeds across <strong>51 main roads</strong> during rush hours. Roads are classified by physical location into three zones — inner, middle, and outer — to inform traffic-management policy and public-transport development.',
      methodTitle: 'Floating Car Method',
      methodDesc: 'Probe vehicles travel along designated routes following the prevailing traffic flow. Each trip records start/end time and distance, from which average speed is computed. Multiple trips are repeated during morning rush (07:00–09:00) and evening rush (16:00–18:00), separated by inbound/outbound directions, producing measurements that reflect actual driving conditions on main roads.',
      mp1: '51 main roads',
      mp2: 'AM rush 07:00–09:00',
      mp3: 'PM rush 16:00–18:00',
      mp4: 'Inbound/Outbound',

      navTomtom: 'TomTom Index',
      navCompare: 'Comparison',
      navZones: 'Zones',
      navTrend: 'Trend',
      navTable: '51 Roads',
      navBau: 'BAU forecast',

      tomtomEyebrow: 'TomTom Traffic Index 2025',
      tomtomHeading: 'Global perspective: Bangkok in TomTom Traffic Index',
      tomtomSub: 'GPS data covering over 3.65 trillion km worldwide, 2025',
      tomtomCity: 'Bangkok — TomTom Traffic Index 2025',
      tt1l: 'World Rank<br>Traffic Congestion',
      tt2l: 'Congestion Level',
      tt2s: 'Up +1.3 pp from 2024',
      tt3l: 'min / 10 km (avg)',
      tt3s: '+36 sec from 2024',
      tt4l: 'min / 10 km<br>AM rush · Congestion 88.4%',
      tt5l: 'min / 10 km<br>PM rush · Congestion 126.5%',
      tt6l: 'hours / year',
      tt6s: 'Time lost in rush hours (≈ 4 days 19 hr)',
      tomtomNote: '<strong>Bangkok ranks 10th globally for congestion</strong> — drivers spend <strong>67.9%</strong> more time travelling than under free-flow conditions. TomTom data covers all road types including expressways, 24/7, and is therefore not directly comparable to the BMA survey, which covers only 51 main roads using Floating Car Method during rush hours.',

      cmpTitle: 'Side-by-side: BMA 2025 vs. TomTom Traffic Index 2025',
      cmpCaption: 'Comparison of figures between BMA and TomTom Traffic Index 2025',
      cmpThIndicator: 'Indicator',
      cmpThInner: 'BMA Inner<br><small>27 roads</small>',
      cmpThMiddle: 'BMA Middle<br><small>17 roads</small>',
      cmpThOuter: 'BMA Outer<br><small>7 roads</small>',
      cmpThTomTom: 'TomTom 2025<br><small>City area</small>',
      rMethod: 'Survey method',
      rSpeedIn: 'Avg speed (km/h)',
      rSpeedInSub: 'Rush · Inbound (AM–PM avg)',
      rSpeedOut: 'Avg speed (km/h)',
      rSpeedOutSub: 'Rush · Outbound (AM–PM avg)',
      rTtIn: 'Travel time / 10 km',
      rTtInSub: 'Rush · Inbound',
      rTtOut: 'Travel time / 10 km',
      rTtOutSub: 'Rush · Outbound',
      rCongestion: 'Congestion level',
      rCongestionNa: 'Not measured this way',
      rScope: 'Scope',
      rScope1: '27 roads · AM/PM rush',
      rScope2: '17 roads · AM/PM rush',
      rScope3: '7 roads · AM/PM rush',
      rScope4: 'All roads + expressways · 24/7',
      m393: '39.29 min', m287: '28.7 min', m231: '23.09 min',
      m350: '34.97 min', m221: '22.1 min', m170: '16.96 min',
      m270: '27.03 min', m211: '21.09 min',
      sourceNote: '<strong>* Notes:</strong> <strong>BMA</strong> data covers only 51 main roads, surveyed by <strong>Floating Car Method</strong> during AM/PM rush hours, separated by direction. Rush-hour figures shown are the AM+PM average from the original Report sheet. Travel time = 10 ÷ avg speed × 60 (min).<br><strong>** TomTom</strong> data is from GPS Big Data covering all roads 24/7 · (*) AM speed derived from 25:45 min per 10 km · (**) PM 19.10 km/h is the direct evening-rush average from TomTom 2025.',

      zdHeader: 'Inner / Middle / Outer Zone Districts',
      zdBadge: '3 groups · 50 districts',
      zdInnerTitle: 'Inner Zone <span class="zd-count inner">15 districts</span>',
      zdInnerDesc: 'Around Rattanakosin Island',
      zdInnerList: 'Khlong San, Din Daeng, Dusit, Thon Buri, Bangkok Noi, Bangkok Yai, Bang Phlat, Bang Rak, Pathum Wan, Pom Prap Sattru Phai, Phaya Thai, Phra Nakhon, Ratchathewi, Sathon, Samphanthawong',
      zdMidTitle: 'Middle Zone <span class="zd-count middle">20 districts</span>',
      zdMidDesc: 'From Rattanakosin out to the inner ring road',
      zdMidList: 'Khlong Toei, Khan Na Yao, Chatuchak, Chom Thong, Bang Kapi, Bang Khen, Bang Kho Laem, Bang Sue, Bueng Kum, Phra Khanong, Phasi Charoen, Yan Nawa, Rat Burana, Lat Phrao, Wang Thonglang, Watthana, Saphan Sung, Suan Luang, Lak Si, Huai Khwang',
      zdOutTitle: 'Outer Zone <span class="zd-count outer">15 districts</span>',
      zdOutDesc: 'Beyond the inner ring road',
      zdOutList: 'Khlong Sam Wa, Don Mueang, Taling Chan, Thawi Watthana, Thung Khru, Bang Khun Thian, Bang Na, Bang Bon, Bang Khae, Prawet, Min Buri, Lat Krabang, Sai Mai, Nong Chok, Nong Khaem',

      ctrlHead: 'Interactive controls',
      ctrlZone: 'Filter by zone',
      ctrlTrend: 'Filter by trend',
      ctrlSearch: 'Search in table',
      ctrlSearchPh: 'Type to search, e.g. Middle, Sukhumvit',
      ctrlReset: 'Reset filters',
      ctrlPrint: 'Print report',
      filterStatus: 'Showing all data',
      optAllZones: 'All zones',
      optInner: 'Inner',
      optMiddle: 'Middle',
      optOuter: 'Outer',
      optAllTrend: 'All trends',
      optTrendDown: 'Declining only',

      cardTitleInner: 'Inner Zone',
      cardTitleMiddle: 'Middle Zone',
      cardTitleOuter: 'Outer Zone',
      cardYearBadge: '2025 data · Rush hours (AM+PM avg)',
      dirIn: '▲ Inbound',
      dirOut: '▼ Outbound',
      dirInShort: 'Inbound',
      dirOutShort: 'Outbound',
      unitKmh: 'km/h',
      unitMin: 'min',

      trendTitle: 'Average speed trend, 2017–2025',
      trendSub: 'Unit: km/h · Inbound · Hover over a year to see values · Compare 3 zones',
      legOuter: 'Outer Zone',
      legMiddle: 'Middle Zone',
      legInner: 'Inner Zone',

      roadTableTitle: 'Speed by road · 51 roads · 2025',
      rtIntro: 'Click a zone header <span class="rt-icon-hint">▼</span> to expand · Each row shows a 4-direction mini-chart and color-coded speed heatmap',
  rtToggleShow: 'Show Table',
  rtToggleHide: 'Hide Table',
      rtSearchPh: 'Search road name or segment...',
      rtExpandAll: 'Expand all',
      rtCollapseAll: 'Collapse all',
      zaInner: 'Inner Zone',
      zaMiddle: 'Middle Zone',
      zaOuter: 'Outer Zone',
      zaAvgIn: 'Avg AM inbound',
      zaRange: 'Range',
      thRoad: 'Road / Segment',
      thLen: 'Length<br><small>(km)</small>',
      thAmRush: 'AM rush',
      thPmRush: 'PM rush',
      thMini: 'Mini-chart',
      thIn: 'Inbound',
      thOut: 'Outbound',
      legSpeedLevel: 'Speed level:',
      legFast: '🟢 ≥ 30 km/h',
      legMid: '🔵 20–30',
      legSlow: '🟡 10–20',
      legJam: '🔴 < 10',
      legMiniLabel: 'Mini-chart:',
      legAmIn: 'AM-In',
      legAmOut: 'AM-Out',
      legPmIn: 'PM-In',
      legPmOut: 'PM-Out',

      bauTitle: 'Business-as-Usual Trend Projection',
      bauSub: 'Projection for the next year, based on the most recent 3-year trend of inbound rush-hour average speed',
      bauInner: 'Inner Zone',
      bauMiddle: 'Middle Zone',
      bauOuter: 'Outer Zone',
      bauProj: '2026 projection',
      bauTime: 'Travel time / 10 km',
      bauDelta: 'Annual change',
      bauNote: 'Note: This is a trend projection used as a risk indicator, not a full network traffic simulation.',

      cmpYearsTitle: 'Average speed comparison · 2017 vs. 2025 (Inbound)',
      thZoneGroup: 'Zone',
      th2560: '2017 (km/h)',
      th2568: '2025 (km/h)',
      thDelta: 'Change (km/h)',
      thPct: '% Change',
      zaInnerShort: 'Inner',
      zaMidShort: 'Middle',
      zaOutShort: 'Outer',

      findingsTitle: 'Key statistical findings',
      finding1: '<strong>Inner Zone:</strong> Continues to face severe congestion — peak-period inbound average (morning and evening) 15.27 km/h, requiring 39.29 min per 10 km.',
      finding2: '<strong>Middle Zone:</strong> Up 4.18% from 2017, but declining since 2023 (24.12 → 22.20 km/h) — Phetkasem (Ratchaphruek to Wong Wian Yai) did not decline sharply as previously reported.',
      cmpFixNote: 'Note: Middle-zone values for 2024–2025 were revised (2 Nov 2026) after a formula error was found in the Phetkasem middle-zone segment (Ratchaphruek–Wong Wian Yai), which used the outer-zone travel time (2025 inbound: 20.90 → 22.20; outbound: 27.14 → 28.45).',
      rtLenNote: '* Roads with one-way sections or segments skipped in one direction have different inbound/outbound lengths (hover for each direction); speeds are computed from the distance actually driven in each run.',
      finding3: '<strong>Outer Zone:</strong> Largest decline of <strong>11.08%</strong>, reflecting urban sprawl into the outer city.',
      finding4: '<strong>2021 (COVID-19):</strong> Highest speeds in 9 years across all zones due to reduced traffic volume.',
      finding5: '<strong>Outbound is faster than inbound</strong> across all zones: Inner +1.89 · Middle +6.25 · Outer +9.38 km/h (peak-hour AM+PM average).',
      policyTitle: 'Policy recommendations',
      policy1: 'Accelerate development of feeder public-transport networks',
      policy2: 'Integrate multi-modal public transport interchanges',
      policy3: 'Apply smart-traffic technology, AI, and adaptive traffic control',
      policy4: 'Promote Park &amp; Ride facilities',
      policy5: 'Outer-zone-specific measure: increase frequency of public transport',

      footerOrgL1: 'Traffic and Transportation Department, BMA',
      footerOrgL2: 'Statistics and Research Group, Policy and Planning Division',
      footerMethod: 'Method: <strong>Floating Car Method</strong>',
      footerAsOf: 'Data as of 31 December 2025',
      footerAuthor: 'Analysed and prepared by <strong>© Prapawadee_W.</strong>',
      footerTomTom: 'TomTom Traffic Index 2025 ↗',
      navTomtomPage: 'TomTom (full page) →',
      ttOpenPage: 'Open the full TomTom situation report →',
    }
  };

  function detectInitialLang() {
    // 1) URL param ?lang=en
    const url = new URLSearchParams(window.location.search);
    const fromUrl = url.get('lang');
    if (fromUrl && TRANSLATIONS[fromUrl]) return fromUrl;
    // 2) localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch (e) {}
    // 3) default Thai
    return 'th';
  }

  function applyLang(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.th;
    document.documentElement.lang = (lang === 'th') ? 'th' : 'en';
    document.documentElement.setAttribute('data-lang', lang);

    // text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });
    // innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    // attributes (data-i18n-attr="placeholder:keyName")
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        if (attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });

    // Update lang button states
    document.querySelectorAll('.lang-btn').forEach(b => {
      const isActive = b.dataset.lang === lang;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });

    // Persist
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    // Notify other modules (so app.js can re-render dynamic content)
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }));
  }

  // Public API
  window.BMA_I18N = {
    apply: applyLang,
    current: () => document.documentElement.getAttribute('data-lang') || 'th',
    dict: () => TRANSLATIONS[window.BMA_I18N.current()] || TRANSLATIONS.th,
    t: (key) => {
      const d = window.BMA_I18N.dict();
      return d[key] != null ? d[key] : key;
    },
    // เพิ่มคีย์แปลจากหน้าอื่น (เช่น tomtom-i18n.js): extend({ th:{...}, en:{...} })
    extend: (more) => {
      Object.keys(more || {}).forEach(l => { TRANSLATIONS[l] = Object.assign(TRANSLATIONS[l] || {}, more[l]); });
      // ถ้ายังไม่ initialize (โหลดก่อน DOMContentLoaded) ไม่ต้อง apply — ห้ามเรียก applyLang ที่นี่ เพราะจะเขียนทับภาษาที่ผู้ใช้เลือกไว้
      if (initialized) applyLang(window.BMA_I18N.current());
    },
  };

  // Wire toggle buttons
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.addEventListener('click', () => applyLang(b.dataset.lang));
    });
    // Theme toggle (light/dark)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const stored = (() => { try { return localStorage.getItem('bma-theme'); } catch (e) { return null; } })();
      if (stored === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('bma-theme', next); } catch (e) {}
      });
    }
    applyLang(detectInitialLang());
    initialized = true;
  });
})();
