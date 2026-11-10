#!/usr/bin/env python3
"""สร้าง GeoJSON สำหรับแผนที่ OpenStreetMap จาก CSV ที่ export จาก Google My Maps (stdlib เท่านั้น)

  python tools/build_map_data.py --road Road.csv --junction ทางแยก.csv --district Bangkok_maps.csv --data data

ผลลัพธ์ (เขียนลงโฟลเดอร์ --data):
  survey-routes.geojson         เส้นทางสำรวจ (LineString) ผูกกับชื่อถนนใน dashboard-data.json
  survey-intersections.geojson  ทางแยก/รหัสสัญญาณไฟ (Point)
  bkk-districts.geojson         ขอบเขต 50 เขต (Polygon, ลดจุดแล้ว) + โซน
"""
import argparse, csv, json, re
from pathlib import Path

csv.field_size_limit(10**9)
ALIAS = {"ประชาธิปก-ตากสิน-สุขสวัสดิ์": "ประชาธิปก", "อินทรพิทักษ์-เพชรเกษม": "เพชรเกษม"}
norm = lambda s: re.sub(r"\s+", "", re.sub(r"^ถนน", "", s or ""))


def wkt_coords(s):
    inner = s[s.index("(") :]
    nums = re.findall(r"-?\d+\.?\d*", inner)
    pts = [(float(nums[i]), float(nums[i + 1])) for i in range(0, len(nums) - 1, 2)]
    return pts


def wkt_rings(s):
    return [wkt_coords("(" + r) for r in re.findall(r"\(([^()]+)\)", s)]


def dp(pts, eps):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    L = (dx * dx + dy * dy) ** 0.5 or 1e-12
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return dp(pts[: idx + 1], eps)[:-1] + dp(pts[idx:], eps)
    return [pts[0], pts[-1]]


def r5(pts):
    return [[round(x, 5), round(y, 5)] for x, y in pts]


def nearest_idx(line, p):
    return min(range(len(line)), key=lambda i: (line[i][0] - p[0]) ** 2 + (line[i][1] - p[1]) ** 2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--road", required=True)
    ap.add_argument("--junction", required=True)
    ap.add_argument("--district", required=True)
    ap.add_argument("--data", default="data")
    a = ap.parse_args()
    data = Path(a.data)
    dash = json.loads((data / "dashboard-data.json").read_text(encoding="utf-8"))
    roads = {}
    for r in dash["roads_2568"]:
        roads[r["name"]] = r["zone"]
    key2dash = {norm(k): k for k in roads}

    def rows(f):
        return list(csv.reader(open(f, encoding="utf-8-sig")))[1:]

    # ---- ทางแยก (รวมจุดซ้ำพิกัดเดียวกัน) ----
    pts = {}
    for r in rows(a.junction):
        x, y = wkt_coords(r[0])[0]
        road = ALIAS.get(r[3], r[3])
        dname = key2dash.get(norm(road), road)
        f = pts.setdefault((x, y), {"name": r[1], "roads": [], "codes": []})
        if dname not in f["roads"]:
            f["roads"].append(dname)
        if r[2] and r[2] not in f["codes"]:
            f["codes"].append(r[2])
    jfeat = [{"type": "Feature", "geometry": {"type": "Point", "coordinates": [x, y]},
              "properties": {"name": v["name"], "signal_codes": v["codes"], "roads": v["roads"]}}
             for (x, y), v in pts.items()]

    # ---- เส้นทาง (ถนนที่แบ่งต้น/ปลาย ตัดเส้นที่ทางแยกตามชื่อ) ----
    junc_by_road = {}
    for r in rows(a.junction):
        junc_by_road.setdefault(ALIAS.get(r[3], r[3]), []).append(wkt_coords(r[0])[0])
    rfeat, used = [], set()
    for r in rows(a.road):
        line = wkt_coords(r[0])
        base = norm(r[1])
        parts = [k for k in roads if re.match(re.escape(base) + r"\s*\(ส่วน(ต้น|ปลาย)\)$", k.strip().replace("ถนน", ""))]
        if not parts:
            parts = [k for k in roads if norm(k) == base or norm(k).replace("-", "") == base.replace("-", "")]
        segs = []
        if len(parts) == 2:
            head = next(k for k in parts if "ส่วนต้น" in k)
            tail = next(k for k in parts if "ส่วนปลาย" in k)
            ih = [nearest_idx(line, p) for p in junc_by_road.get(head, [])]
            it = [nearest_idx(line, p) for p in junc_by_road.get(tail, [])]
            if ih and it:
                head_first = sum(ih) / len(ih) < sum(it) / len(it)
                cut = max(ih) if head_first else min(ih)
                first, second = (head, tail) if head_first else (tail, head)
                segs = [(first, line[: cut + 1]), (second, line[cut:])]
            else:
                segs = [(parts[0], line)]
        elif parts:
            segs = [(parts[0], line)]
        else:
            segs = [(r[1], line)]
        for dname, ln in segs:
            used.add(dname)
            rfeat.append({"type": "Feature", "geometry": {"type": "LineString", "coordinates": r5(ln)},
                          "properties": {"name": dname, "zone": roads.get(dname), "source_name": r[1]}})
    missing = [k for k in roads if k not in used]

    # ---- เขต ----
    zmap = {"inner area": "inner", "middle area": "middle", "outer area": "outer"}
    dfeat = []
    for r in rows(a.district):
        ring = wkt_rings(r[0])[0]
        # ring ปิด (จุดแรก=จุดสุดท้าย) → แบ่งครึ่งก่อนลดจุด ไม่งั้นเส้นอ้างอิงยาวเป็นศูนย์
        m = len(ring) // 2
        simp = dp(ring[: m + 1], 0.00004)[:-1] + dp(ring[m:], 0.00004)
        if simp[0] != simp[-1]:
            simp.append(simp[0])
        dfeat.append({"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [r5(simp)]},
                      "properties": {"name": r[1], "name_en": r[7], "dcode": r[5], "zone": zmap.get(r[2])}})

    def dump(fn, feats, src):
        (data / fn).write_text(json.dumps({"type": "FeatureCollection", "_meta": {"source": src, "count": len(feats)}, "features": feats},
                                          ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print(fn, len(feats), "features")

    src = "Google My Maps mid=1r2hqRnDKaiNyvCiBxvVlG5USW5VduWA"
    dump("survey-routes.geojson", rfeat, src)
    dump("survey-intersections.geojson", jfeat, src)
    dump("bkk-districts.geojson", dfeat, src)
    print("roads without route:", missing)


if __name__ == "__main__":
    main()
