# BMA Travel Time Dashboard (TH) — 2560–2568

Dashboard เสนอผลการวิเคราะห์ **เวลาและความเร็วเฉลี่ยในการเดินทางในพื้นที่กรุงเทพมหานคร** ปี 2560–2568 ด้วยวิธี **Floating Car Method** (สำรวจตามกระแสจราจร) เปรียบเทียบกับ TomTom Traffic Index 2025

จัดทำโดย: © Prapawadee_W.
**กลุ่มงานสถิติและวิจัย กองนโยบายและแผนงาน สำนักการจราจรและขนส่ง กรุงเทพมหานคร**
---

## โครงสร้างไฟล์

```
.
├── index.html                  # หน้าหลัก dashboard
├── tomtom.html                 # หน้ารายงานสถานการณ์ TomTom Traffic Index 2025 (ดึงข้อมูลจาก data/tomtom-2025.json)
├── assets/
│   ├── styles.css              # CSS ทั้งหมด (responsive PC / tablet / mobile)
│   ├── app.js                  # JS — โหลดข้อมูล, สร้าง chart, ตาราง, filter
│   ├── tomtom.js / tomtom.css      # วาดหน้า TomTom (ตาราง แถบกราฟ ข้อความพร้อมคัดลอก) และสไตล์เฉพาะหน้า
│   ├── tomtom-i18n.js              # คำแปล TH/EN ของหน้า TomTom (เพิ่มเข้า BMA_I18N.extend)
│   └── data.js                 # (deprecated) — ใช้ data/dashboard-data.json แทน
├── data/
│   └── dashboard-data.json     # ข้อมูลทั้งหมด (สร้างจาก XLSX ต้นฉบับ)
│   └── tomtom-2025.json        # ตัวเลขหลักของ TomTom Traffic Index 2025 (กรุงเทพฯ, เมืองในไทย) + แหล่งที่มา
└── README.md
```


### ทดสอบในเครื่อง

```bash
# Python 3
cd /path/to/site
python3 -m http.server 8080
# เปิด http://localhost:8080
```

หรือใช้ VSCode Live Server, `npx serve`, ฯลฯ

---

## ฟีเจอร์

| ส่วน | คำอธิบาย |
|---|---|
| **Hero** | หัวข้อหลัก + ระบุวิธีสำรวจ (Floating Car Method) |
| **Method Card** | อธิบาย Floating Car Method พร้อม metadata |
| **TomTom Index** | สถิติระดับโลก (อันดับ 10, Congestion 67.9%) |
| **หน้า TomTom (tomtom.html)** | รายงานสถานการณ์: KPI · เทียบปีก่อน · เช้า–เย็น (เวลาปกติ vs เวลาที่เสียเพิ่ม) · วันที่ติดขัดสุด · เมืองในไทย · เทียบผลสำรวจ สจส. · ข้อความสรุปพร้อมคัดลอก (TH/EN) |
| **เปรียบเทียบ สจส. vs TomTom** | ตารางเทียบ 6 ตัวชี้วัด (รวมแถววิธีการสำรวจ) |
| **3 KPI Cards** | ความเร็ว ขาเข้า/ขาออก พร้อม min/max ของแต่ละโซน |
| **Trend Chart** | กราฟเส้น 9 ปี · สลับขาเข้า/ขาออก · COVID-19 marker · Tooltip |
| **ตารางถนน 51 สาย** | filter ตามโซน · ค้นหา · เรียงคอลัมน์ · color-coded ความเร็ว |
| **BAU Scenario** | คาดการณ์ปี 2569 จากแนวโน้ม 3 ปีล่าสุด |
| **เปรียบเทียบ 2560 vs 2568** | ตาราง delta + % เปลี่ยนแปลง |
| **Insights & Policy** | ข้อค้นพบเชิงสถิติ + ข้อเสนอแนะเชิงนโยบาย |

---

## Responsive

- **PC ≥ 1200px** — A4 layout 1320px max width, 3 columns
- **Tablet 768–1199px** — 2 columns, padding ลดลง
- **Mobile ≤ 767px** — 1 column, ปุ่มและ font ปรับขนาด, ตารางสามารถ scroll แนวนอน
- **Print** — สำหรับพิมพ์รายงาน (ซ่อนปุ่ม interactive)

---

## ข้อมูล

**แหล่งข้อมูลหลัก:** ไฟล์ Excel `รายงานสรุปผลการวิเคราะห์เวลาในการเดินทางในพื้นที่กรุงเทพมหานคร ปี 2560–2568.xlsx`

**Sheets ที่ใช้:**
- `Report` — สรุปอัตราเร็วเฉลี่ย 9 ปี รายโซน รายทิศทาง (เร่งด่วน เฉลี่ยเช้า+เย็น)
- `avr-speed_2568` — รายละเอียด 51 ถนน × เช้า/เย็น × ขาเข้า/ขาออก
- `traveltime_2568` — เวลาเดินทาง (นาที) 51 ถนน
- `urban_2560-2568` — 28 ถนนชั้นใน × 9 ปี
- `suburban_2560-2568` — 20 ถนนชั้นกลาง × 9 ปี
- `rural_2560-2568` — 7 ถนนชั้นนอก × 9 ปี

**Reference:** [TomTom Traffic Index 2025 — Bangkok](https://www.tomtom.com/traffic-index/bangkok-traffic/)

**หน้า TomTom:** ตัวเลขทั้งหมดเป็นของ TomTom (© TomTom International BV) สรุปเฉพาะตัวเลขหลักพร้อมอ้างอิง สืบค้นเมื่อ 2 พ.ย. 2569 — ดูข้อจำกัดในหน้า (ไม่รวมค่ารายเดือน/รายชั่วโมง) และตรวจเงื่อนไขการใช้งานของ TomTom ก่อนเผยแพร่ต่อ

---


---

## License

ข้อมูลและเนื้อหาของ dashboard นี้เผยแพร่เพื่อประโยชน์สาธารณะภายใต้ [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) — นำไปใช้ ดัดแปลง และเผยแพร่ต่อได้ รวมถึงเชิงพาณิชย์ โดยต้องให้เครดิต

© Prapawadee_W. · กลุ่มงานสถิติและวิจัย กองนโยบายและแผนงาน สำนักการจราจรและขนส่ง กรุงเทพมหานคร · ดูรายละเอียดใน [LICENSE](LICENSE) และวิธีอ้างอิงใน [CITATION.md](CITATION.md)
