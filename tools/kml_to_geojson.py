#!/usr/bin/env python3
"""แปลง KML/KMZ จาก Google My Maps -> data/survey-routes.geojson (stdlib เท่านั้น)

วิธีใช้:
  1) My Maps > เมนู ⋮ ของแผนที่ > Export to KML/KMZ (เลือกทุกเลเยอร์)
  2) python tools/kml_to_geojson.py route.kmz data/survey-routes.geojson
กำหนด zone จากชื่อโฟลเดอร์/เลเยอร์ (มีคำว่า ชั้นใน/inner, ชั้นกลาง/middle, ชั้นนอก/outer)
หรือจากชื่อถนนที่ตรงกับ data/dashboard-data.json
"""
import json, sys, zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {"k": "http://www.opengis.net/kml/2.2"}
ZONES = {"inner": ("ชั้นใน", "inner"), "middle": ("ชั้นกลาง", "middle"), "outer": ("ชั้นนอก", "outer")}


def coords(text):
    out = []
    for tok in (text or "").split():
        p = tok.split(",")
        if len(p) >= 2:
            out.append([round(float(p[0]), 6), round(float(p[1]), 6)])
    return out


def zone_from(label):
    low = (label or "").lower()
    for z, keys in ZONES.items():
        if any(k in low for k in keys):
            return z
    return None


def walk(node, folder, roads, feats):
    for ch in node:
        tag = ch.tag.split("}")[-1]
        if tag in ("Folder", "Document"):
            nm = ch.find("k:name", NS)
            walk(ch, nm.text if nm is not None else folder, roads, feats)
        elif tag == "Placemark":
            name = (ch.findtext("k:name", default="", namespaces=NS) or "").strip()
            desc = (ch.findtext("k:description", default="", namespaces=NS) or "").strip()
            geoms = []
            for ls in ch.iter("{http://www.opengis.net/kml/2.2}LineString"):
                c = coords(ls.findtext("k:coordinates", namespaces=NS))
                if len(c) >= 2:
                    geoms.append({"type": "LineString", "coordinates": c})
            for pt in ch.iter("{http://www.opengis.net/kml/2.2}Point"):
                c = coords(pt.findtext("k:coordinates", namespaces=NS))
                if c:
                    geoms.append({"type": "Point", "coordinates": c[0]})
            zone = zone_from(folder) or roads.get(name.replace(" ", ""))
            for g in geoms:
                feats.append({"type": "Feature", "geometry": g,
                              "properties": {"name": name, "segment": desc, "zone": zone, "layer": folder}})


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    raw = zipfile.ZipFile(src).read("doc.kml") if src.suffix.lower() == ".kmz" else src.read_bytes()
    root = ET.fromstring(raw)
    roads = {}
    dd = dst.parent / "dashboard-data.json"
    if dd.exists():
        for r in json.loads(dd.read_text(encoding="utf-8")).get("roads_2568", []):
            roads[r["name"].replace(" ", "")] = r["zone"]
    feats = []
    walk(root, None, roads, feats)
    out = {"type": "FeatureCollection",
           "_meta": {"source": "Google My Maps mid=1r2hqRnDKaiNyvCiBxvVlG5USW5VduWA", "count": len(feats)},
           "features": feats}
    dst.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {len(feats)} features -> {dst}")


if __name__ == "__main__":
    main()
