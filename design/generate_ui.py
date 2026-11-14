#!/usr/bin/env python3
"""Generate the SiGEMAS high-fidelity UI/UX system in FigCraft.

Run:
    py design/generate_ui.py

The script writes design/SIGEMAS-UI.figcraft and page renders under
design/renders/. It is intentionally deterministic so the design can be
regenerated after content or token changes.
"""
from __future__ import annotations

import json
import math
import os
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
CLI = r"C:\Program Files\ArtCraft\FigCraft\figcraft-cli.exe"
OUT = ROOT / "SIGEMAS-UI.figcraft"
RENDERS = ROOT / "renders"
TMP = Path(r"C:\Users\USER\AppData\Local\Temp\opencode\sigemas_build")
TMP.mkdir(parents=True, exist_ok=True)
RENDERS.mkdir(parents=True, exist_ok=True)

with open(ROOT / "lucide_paths.json", encoding="utf-8") as fh:
    ICONS = json.load(fh)

# ---------------------------------------------------------------- tokens
INK = "#0B1B33"
INK_2 = "#142846"
MUTED = "#66758A"
MUTED_2 = "#8A98AA"
LINE = "#E5EBF4"
CANVAS = "#F4F7FB"
SURFACE = "#FFFFFF"
BLUE_900 = "#082A52"
BLUE_800 = "#0D47A1"
BLUE_700 = "#1565C0"
BLUE_600 = "#1E88E5"
BLUE_500 = "#42A5F5"
BLUE_100 = "#E7F1FD"
BLUE_50 = "#F3F8FF"
AMBER_800 = "#B45309"
AMBER_700 = "#E65100"
AMBER_600 = "#FF8F00"
AMBER_500 = "#FFB300"
AMBER_100 = "#FFF3DD"
TEAL_700 = "#0F766E"
TEAL_500 = "#14B8A6"
TEAL_100 = "#E6FFFB"
VIOLET_700 = "#5B21B6"
VIOLET_500 = "#8B5CF6"
VIOLET_100 = "#F1ECFF"
RED_600 = "#DC2626"
RED_100 = "#FEE2E2"
GREEN_600 = "#16A34A"
GREEN_100 = "#E8F8EF"
CYAN_600 = "#0891B2"
CYAN_100 = "#E6F9FD"
WHITE = "#FFFFFF"

ROLE = {
    "student": {"accent": BLUE_600, "deep": BLUE_800, "soft": BLUE_100, "soft2": BLUE_50},
    "teacher": {"accent": AMBER_600, "deep": AMBER_800, "soft": AMBER_100, "soft2": "#FFF9EE"},
    "parent": {"accent": TEAL_500, "deep": TEAL_700, "soft": TEAL_100, "soft2": "#F1FFFC"},
    "admin": {"accent": VIOLET_500, "deep": VIOLET_700, "soft": VIOLET_100, "soft2": "#FAF7FF"},
}

FONT = "Inter"
DISPLAY = "Poppins"

SHADOW_SM = [{"type": "dropShadow", "color": "#0B1B3310", "offset": [0, 6], "radius": 18, "spread": 0}]
SHADOW_MD = [{"type": "dropShadow", "color": "#0B1B3318", "offset": [0, 14], "radius": 36, "spread": 0}]
SHADOW_LG = [{"type": "dropShadow", "color": "#06152D33", "offset": [0, 28], "radius": 70, "spread": 0}]

# ---------------------------------------------------------------- FigCraft runner


class Builder:
    def __init__(self) -> None:
        self.current: Path | None = None
        self.counter = 0
        self.out_path: Path = OUT

    def run(self, commands: list[dict]) -> list[dict]:
        self.counter += 1
        script = TMP / f"script_{self.counter:03d}.json"
        script.write_text(json.dumps(commands, ensure_ascii=False), encoding="utf-8")
        out = TMP / f"step_{self.counter:03d}.figcraft"
        args = [CLI, "run", str(script)]
        if self.current is not None:
            args += ["--in", str(self.current)]
        args += ["--out", str(out)]
        proc = subprocess.run(args, capture_output=True, text=True, encoding="utf-8")
        if proc.returncode != 0:
            raise RuntimeError(f"FigCraft failed: {proc.stderr or proc.stdout}")
        results = []
        for line in proc.stdout.splitlines():
            line = line.strip()
            if line.startswith("{"):
                try:
                    results.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
        for item in results:
            if item.get("ok") is False:
                raise RuntimeError(f"FigCraft step failed: {item}")
        self.current = out
        return results

    def finish(self) -> Path:
        if self.current is None:
            raise RuntimeError("No document built")
        import shutil

        shutil.copyfile(self.current, self.out_path)
        return self.out_path


B = Builder()


def run(cmds: list[dict]) -> list[dict]:
    return B.run(cmds)


def new_page(name: str, first: bool = False, background: str = CANVAS) -> None:
    cmds: list[dict] = []
    if first:
        cmds.append({"command": "page.rename", "params": {"name": name}})
    else:
        cmds.append({"command": "page.add", "params": {"name": name}})
    cmds.append({"command": "page.setBackground", "params": {"color": background}})
    run(cmds)


def add_screen(name: str, w: int, h: int, x: int = 0, y: int = 0, fill=SURFACE, radius: int = 0, clip: bool = True) -> int:
    params = {
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "name": name,
        "props": {
            "fill": fill,
            "cornerRadius": radius,
            "clip": clip,
        },
        "select": False,
    }
    res = run([{"command": "frame.create", "params": params}])
    return int(res[0]["result"]["id"])


# ---------------------------------------------------------------- primitives


def _icon_path(nodes: list) -> str:
    parts: list[str] = []
    for kind, p in nodes:
        if kind == "path":
            parts.append(p["d"])
        elif kind == "line":
            parts.append(f"M{p['x1']} {p['y1']}L{p['x2']} {p['y2']}")
        elif kind == "circle":
            cx, cy, r = float(p["cx"]), float(p["cy"]), float(p["r"])
            parts.append(f"M{cx-r} {cy}a{r} {r} 0 1 0 {2*r} 0a{r} {r} 0 1 0 {-2*r} 0")
        elif kind == "ellipse":
            cx, cy = float(p["cx"]), float(p["cy"])
            rx, ry = float(p["rx"]), float(p["ry"])
            parts.append(f"M{cx-rx} {cy}a{rx} {ry} 0 1 0 {2*rx} 0a{rx} {ry} 0 1 0 {-2*rx} 0")
        elif kind == "rect":
            x, y = float(p["x"]), float(p["y"])
            w, h = float(p["width"]), float(p["height"])
            rx = float(p.get("rx", 0) or 0)
            if rx <= 0:
                parts.append(f"M{x} {y}h{w}v{h}h{-w}Z")
            else:
                parts.append(
                    f"M{x+rx} {y}h{w-2*rx}a{rx} {rx} 0 0 1 {rx} {rx}v{h-2*rx}"
                    f"a{rx} {rx} 0 0 1 {-rx} {rx}h{-(w-2*rx)}"
                    f"a{rx} {rx} 0 0 1 {-rx} {-rx}v{-(h-2*rx)}a{rx} {rx} 0 0 1 {rx} {-rx}Z"
                )
        elif kind in ("polyline", "polygon"):
            pts = p["points"].strip().split()
            if pts:
                d = "M" + "L".join(pts)
                if kind == "polygon":
                    d += "Z"
                parts.append(d)
    return " ".join(parts)


ICON_PATHS = {k: _icon_path(v) for k, v in ICONS.items()}
ICON_PATHS.setdefault("filter", "M22 3H2l8 9.46V19l4 2v-8.54L22 3z")
ICON_PATHS.setdefault("bookMarked", ICON_PATHS.get("bookOpen", "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"))
ICON_PATHS.setdefault("circle", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z")
ICON_PATHS.setdefault("battery", "M3 7h15a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z M23 10v4")


def rect(x, y, w, h, fill=SURFACE, radius=0, stroke=None, sw=1, parent=0,
         name="Rectangle", effects=None, opacity=None, gradient=None, select=False):
    props = {"fill": fill, "cornerRadius": radius}
    if gradient:
        props.pop("fill", None)
        props["fills"] = [{"type": "linearGradient", "stops": gradient, "from": [0, 0], "to": [1, 1]}]
    if stroke:
        props["stroke"] = stroke
        props["strokeWeight"] = sw
    if effects:
        props["effects"] = effects
    if opacity is not None:
        props["opacity"] = opacity
    return {"command": "shape.rectangle", "params": {
        "x": x, "y": y, "width": w, "height": h, "parent": parent,
        "name": name, "props": props, "select": select,
    }}


def ellipse(x, y, w, h, fill=None, parent=0, name="Ellipse", stroke=None, sw=1,
            effects=None, opacity=None, gradient=None, select=False):
    props = {"fill": fill}
    if gradient:
        props.pop("fill", None)
        props["fills"] = [{"type": "radialGradient", "stops": gradient, "from": [0, 0], "to": [1, 1]}]
    if stroke:
        props["stroke"] = stroke
        props["strokeWeight"] = sw
    if effects:
        props["effects"] = effects
    if opacity is not None:
        props["opacity"] = opacity
    return {"command": "shape.ellipse", "params": {
        "x": x, "y": y, "width": w, "height": h, "parent": parent,
        "name": name, "props": props, "select": select,
    }}


def text(x, y, value, size=14, color=INK, weight=400, family=FONT, width=None,
         align="left", parent=0, name=None, line_height=None, tracking=None,
         opacity=None, select=False):
    props = {
        "fontFamily": family,
        "fontSize": size,
        "fontWeight": weight,
        "fill": color,
        "textAlign": align,
        "textAutoResize": "height" if width else "widthAndHeight",
    }
    if line_height is not None:
        props["lineHeight"] = line_height
    if tracking is not None:
        props["letterSpacing"] = tracking
    if opacity is not None:
        props["opacity"] = opacity
    params = {
        "text": value, "x": x, "y": y, "parent": parent,
        "name": name or value[:32], "props": props, "select": select,
    }
    if width:
        params["width"] = width
    return {"command": "text.create", "params": params}


def icon(name, x, y, size=20, color=INK, sw=1.8, parent=0, opacity=None, select=False):
    props = {
        "fill": "none",
        "stroke": color,
        "strokeWeight": sw,
        "strokeCap": "round",
        "strokeJoin": "round",
    }
    if opacity is not None:
        props["opacity"] = opacity
    return {"command": "vector.create", "params": {
        "path": ICON_PATHS.get(name, ICON_PATHS["circle"]), "x": x, "y": y, "width": size, "height": size,
        "parent": parent, "name": f"Icon / {name}", "props": props, "select": select,
    }}


def vector_path(path, x, y, w, h, fill="none", stroke=None, sw=1, parent=0,
                name="Vector", opacity=None, cap="round", join="round", select=False):
    props = {"fill": fill, "stroke": stroke or "none", "strokeWeight": sw,
             "strokeCap": cap, "strokeJoin": join}
    if opacity is not None:
        props["opacity"] = opacity
    params = {"path": path, "x": x, "y": y, "parent": parent,
              "name": name, "props": props, "select": select}
    if not (w == 1 and h == 1):
        params["width"] = w
        params["height"] = h
    return {"command": "vector.create", "params": params}


def pill(x, y, label, bg, fg, parent=0, h=24, pad=10, size=10, weight=600,
         dot=False, icon_name=None, border=None, name=None):
    width = pad * 2 + len(label) * size * 0.58
    if dot:
        width += 10
    if icon_name:
        width += size + 6
    cmds = [rect(x, y, width, h, bg, h / 2, stroke=border, parent=parent, name=name or f"Badge / {label}")]
    tx = x + pad
    if dot:
        cmds.append(ellipse(x + pad, y + h / 2 - 3, 6, 6, fg, parent=parent))
        tx += 10
    if icon_name:
        cmds.append(icon(icon_name, x + pad, y + (h - size + 2) / 2, size - 2, fg, 2, parent=parent))
        tx += size + 2
    cmds.append(text(tx, y + (h - size) / 2 - 1, label, size, fg, weight, width=None, parent=parent))
    return cmds, width


def avatar(x, y, size, initials, bg=BLUE_600, fg=WHITE, parent=0, ring=None):
    cmds = []
    if ring:
        cmds.append(ellipse(x - 3, y - 3, size + 6, size + 6, ring, parent=parent))
    cmds.append(ellipse(x, y, size, size, bg, parent=parent))
    cmds.append(text(x, y + size * 0.27, initials, size * 0.34, fg, 700, family=DISPLAY,
                     width=size, align="center", parent=parent))
    return cmds


def progress_bar(x, y, w, pct, color=BLUE_600, bg=LINE, h=8, parent=0):
    return [
        rect(x, y, w, h, bg, h / 2, parent=parent, name="Progress track"),
        rect(x, y, max(2, w * pct / 100), h, color, h / 2, parent=parent, name="Progress fill"),
    ]


def button(x, y, label, variant="primary", parent=0, w=None, h=42, icon_name=None,
           role="student", size=12):
    r = ROLE[role]
    if w is None:
        w = 24 + len(label) * size * 0.58 + (22 if icon_name else 0) + 8
    styles = {
        "primary": (r["accent"], WHITE, None),
        "accent": (AMBER_500, INK, None),
        "secondary": (r["soft"], r["deep"], None),
        "ghost": ("#FFFFFF00", r["deep"], None),
        "outline": (SURFACE, INK, r["accent"]),
        "dark": (INK, WHITE, None),
        "danger": (RED_600, WHITE, None),
        "white": (WHITE, INK, None),
    }
    bg, fg, stroke = styles[variant]
    cmds = [rect(x, y, w, h, bg, h / 2, stroke=stroke, sw=1, parent=parent, name=f"Button / {label}")]
    tx = x + 18
    if icon_name:
        cmds.append(icon(icon_name, x + 16, y + (h - 16) / 2, 16, fg, 2, parent=parent))
        tx += 22
    cmds.append(text(tx, y + (h - size) / 2 - 2, label, size, fg, 600, parent=parent))
    return cmds, w


def search_box(x, y, w, placeholder="Cari buku, materi, atau kelas...", parent=0, h=40, bg=SURFACE):
    return [
        rect(x, y, w, h, bg, h / 2, stroke=LINE, parent=parent, name="Search field"),
        icon("search", x + 14, y + (h - 16) / 2, 16, MUTED, 1.9, parent=parent),
        text(x + 40, y + (h - 11) / 2 - 1, placeholder, 11, MUTED_2, 400, parent=parent),
    ]


def section_heading(x, y, title, subtitle=None, parent=0, accent=BLUE_600, action=None):
    cmds = [text(x, y, title, 16, INK, 700, family=DISPLAY, parent=parent)]
    if subtitle:
        cmds.append(text(x, y + 24, subtitle, 10, MUTED, 400, parent=parent))
    if action:
        cmds.append(text(x, y + 4, action, 10, accent, 600, parent=parent))
    return cmds


def card(x, y, w, h, parent=0, radius=18, fill=SURFACE, stroke=LINE, shadow=SHADOW_SM, name="Card", clip=True):
    cmd = rect(x, y, w, h, fill, radius, stroke=stroke, sw=1, parent=parent,
               name=name, effects=shadow, select=False)
    cmd["params"]["props"]["clip"] = clip
    return cmd


# ---------------------------------------------------------------- complex components


def line_chart(x, y, w, h, values, color=BLUE_600, labels=None, secondary=None,
               secondary_color=AMBER_500, parent=0, fill_area=True, dots=True,
               grid=True, end_value=None, thickness=2.4):
    cmds = []
    if grid:
        for i in range(1, 4):
            gy = y + h * i / 4
            cmds.append(rect(x, gy, w, 1, "#EDF1F7", 0, parent=parent, name="Grid line"))
    lo = min(values + (secondary or [])) - 5
    hi = max(values + (secondary or [])) + 5
    if hi == lo:
        hi = lo + 1

    def points(vals):
        pts = []
        for i, v in enumerate(vals):
            px = x + (w * i / max(1, len(vals) - 1))
            py = y + h - ((v - lo) / (hi - lo)) * h
            pts.append((px, py))
        return pts

    if secondary:
        sp = points(secondary)
        d = "M" + "L".join(f"{px:.2f} {py:.2f}" for px, py in sp)
        cmds.append(vector_path(d, 0, 0, 1, 1, fill="none", stroke=secondary_color,
                                sw=2, parent=parent, name="Secondary trend", opacity=0.55))
        if dots:
            for px, py in sp:
                cmds.append(ellipse(px - 3, py - 3, 6, 6, SURFACE, parent=parent,
                                    stroke=secondary_color, sw=1.5))
    p = points(values)
    d = "M" + "L".join(f"{px:.2f} {py:.2f}" for px, py in p)
    if fill_area:
        area = d + f"L{x+w:.2f} {y+h:.2f}L{x:.2f} {y+h:.2f}Z"
        cmds.append(vector_path(area, 0, 0, 1, 1, fill=color, stroke=None, sw=0,
                                parent=parent, name="Area fill", opacity=0.10))
    cmds.append(vector_path(d, 0, 0, 1, 1, fill="none", stroke=color, sw=thickness,
                            parent=parent, name="Trend line"))
    if dots:
        for px, py in p:
            cmds.append(ellipse(px - 4, py - 4, 8, 8, SURFACE, parent=parent,
                                stroke=color, sw=2))
    if labels:
        for i, lab in enumerate(labels):
            px = x + (w * i / max(1, len(labels) - 1))
            cmds.append(text(px - 22, y + h + 12, lab, 9, MUTED_2, 500, width=44, align="center", parent=parent))
    if end_value is not None:
        px, py = p[-1]
        cmds.append(rect(px + 8, py - 14, 44, 26, INK, 8, parent=parent, name="Value tooltip"))
        cmds.append(text(px + 8, py - 8, end_value, 10, WHITE, 700, width=44, align="center", parent=parent))
    return cmds


def bars(x, y, w, h, values, labels, color=BLUE_600, accent=AMBER_500, parent=0,
         target=None, max_value=None, bar_radius=5):
    cmds = []
    n = len(values)
    gap = 10
    bw = (w - gap * (n - 1)) / n
    mx = max_value or max(values) * 1.15
    for i, v in enumerate(values):
        bh = max(4, (v / mx) * h)
        bx = x + i * (bw + gap)
        by = y + h - bh
        c = accent if target and v >= target else color
        cmds.append(rect(bx, by, bw, bh, c, bar_radius, parent=parent, name=f"Bar {labels[i] if labels else i}"))
        if labels:
            cmds.append(text(bx - 4, y + h + 8, labels[i], 8.5, MUTED_2, 500, width=bw + 8, align="center", parent=parent))
    if target:
        ty = y + h - (target / mx) * h
        cmds.append(rect(x, ty, w, 1, "#C9D4E4", 0, parent=parent, name="Target line"))
    return cmds


def donut_chart(cx, cy, radius, segments, parent=0, thickness=16, center_value="", center_label=""):
    cmds = []
    cmds.append(ellipse(cx - radius, cy - radius, radius * 2, radius * 2, "#FFFFFF00",
                        parent=parent, name="Donut track", stroke="#EEF2F7", sw=thickness))
    total = sum(s["value"] for s in segments) or 1
    a = -math.pi / 2
    for s in segments:
        da = 2 * math.pi * s["value"] / total
        a2 = a + da
        large = 1 if da > math.pi else 0
        p0 = (cx + radius * math.cos(a), cy + radius * math.sin(a))
        p1 = (cx + radius * math.cos(a2), cy + radius * math.sin(a2))
        d = f"M{p0[0]:.2f} {p0[1]:.2f}A{radius} {radius} 0 {large} 1 {p1[0]:.2f} {p1[1]:.2f}"
        cmds.append(vector_path(d, 0, 0, 1, 1, fill="none", stroke=s["color"], sw=thickness,
                                parent=parent, name=f"Donut / {s['label']}"))
        a = a2
    if center_value:
        cmds.append(text(cx - radius, cy - 13, center_value, 26, INK, 700, family=DISPLAY,
                         width=radius * 2, align="center", parent=parent))
    if center_label:
        cmds.append(text(cx - radius, cy + 16, center_label, 9, MUTED, 500,
                         width=radius * 2, align="center", parent=parent))
    return cmds


def logo_mark(x, y, size=36, bg=None, fg=WHITE, parent=0, radius=None, dark=False):
    cmds = []
    bg = bg or (AMBER_500 if dark else BLUE_600)
    r = radius if radius is not None else size * 0.28
    cmds.append(rect(x, y, size, size, bg, r, parent=parent, name="SiGEMAS mark"))
    cmds.append(icon("bookOpen", x + size * 0.22, y + size * 0.22, size * 0.56, fg, 2, parent=parent))
    return cmds


def sidebar(W, H, role, active_index, nav_items, parent, name="Sidebar"):
    r = ROLE[role]
    cmds = [
        rect(0, 0, 248, H, SURFACE, 0, parent=parent, name="Sidebar background"),
        rect(247, 0, 1, H, LINE, 0, parent=parent, name="Sidebar divider"),
    ]
    cmds += logo_mark(24, 24, 34, bg=r["accent"], fg=WHITE, parent=parent)
    cmds.append(text(68, 30, "SiGEMAS", 17, INK, 700, family=DISPLAY, parent=parent))
    cmds.append(text(68, 49, "LEARNING OS", 7.5, MUTED_2, 700, tracking=0.8, parent=parent))
    cmds.append(text(24, 92, "RUANG " + ("BELAJAR" if role == "student" else "MENGAJAR" if role == "teacher" else "PENDAMPINGAN" if role == "parent" else "ADMINISTRASI"), 8.5, MUTED_2, 700, tracking=1.0, parent=parent))
    yy = 118
    for i, (ic, label) in enumerate(nav_items):
        active = i == active_index
        if active:
            cmds.append(rect(14, yy - 6, 220, 42, r["soft"], 13, parent=parent, name=f"Nav active / {label}"))
            cmds.append(rect(14, yy + 6, 3, 18, r["accent"], 2, parent=parent, name="Active indicator"))
        cmds.append(icon(ic, 30, yy + 4, 17, r["deep"] if active else MUTED, 1.9, parent=parent))
        cmds.append(text(58, yy + 5, label, 11.5, r["deep"] if active else MUTED, 700 if active else 500, parent=parent))
        yy += 46
    # mini plan card
    cmds.append(rect(16, H - 152, 216, 68, r["soft2"], 16, stroke=LINE, parent=parent, name="Plan card"))
    cmds.append(icon("sparkles", 30, H - 136, 16, r["accent"], 2, parent=parent))
    cmds.append(text(52, H - 139, "Pilot school", 10.5, INK, 700, parent=parent))
    cmds.append(text(30, H - 116, "Kurikulum Merdeka · 2025/2026", 8.5, MUTED, 500, parent=parent))
    # profile
    cmds.append(rect(16, H - 72, 216, 56, SURFACE, 15, stroke=LINE, parent=parent, name="Profile"))
    cmds += avatar(28, H - 62, 34, "AP" if role == "student" else "RP" if role == "teacher" else "SW" if role == "parent" else "AD",
                   bg=r["accent"], parent=parent)
    cmds.append(text(72, H - 58, "Aisyah Putri" if role == "student" else "Raka Pradana" if role == "teacher" else "Sari Wulandari" if role == "parent" else "Admin SIBI", 10.5, INK, 700, parent=parent))
    cmds.append(text(72, H - 42, "X IPA 2" if role == "student" else "Guru Matematika" if role == "teacher" else "Orang tua" if role == "parent" else "Administrator", 8.5, MUTED, 400, parent=parent))
    cmds.append(icon("more", 198, H - 54, 15, MUTED, 2, parent=parent))
    return cmds


def topbar(W, role, title, parent, subtitle=None, search=True, avatar_text="AP"):
    r = ROLE[role]
    cmds = [
        rect(248, 0, W - 248, 72, SURFACE, 0, parent=parent, name="Topbar background"),
        rect(248, 71, W - 248, 1, LINE, 0, parent=parent, name="Topbar divider"),
        text(280, 19, title, 17, INK, 700, family=DISPLAY, parent=parent),
    ]
    if subtitle:
        cmds.append(text(280, 43, subtitle, 9, MUTED, 400, parent=parent))
    if search:
        cmds += search_box(W - 556, 16, 254, "Cari materi, kelas, atau siswa...", parent=parent, h=40)
    cmds.append(rect(W - 278, 18, 36, 36, SURFACE, 18, stroke=LINE, parent=parent, name="Notifications"))
    cmds.append(icon("bell", W - 268, 27, 16, MUTED, 1.9, parent=parent))
    cmds.append(ellipse(W - 274, 20, 7, 7, RED_600, parent=parent))
    cmds += avatar(W - 226, 18, 36, avatar_text, bg=r["accent"], parent=parent)
    cmds.append(icon("chevronDown", W - 180, 31, 12, MUTED, 2, parent=parent))
    return cmds


def page_canvas(name, role, title, nav_items, active_index, parent):
    W, H = 1440, 1024
    cmds = [rect(0, 0, W, H, CANVAS, 0, parent=parent, name="Canvas background")]
    cmds += sidebar(W, H, role, active_index, nav_items, parent)
    cmds += topbar(W, role, title, parent)
    return cmds


STUDENT_NAV = [
    ("home", "Beranda"), ("library", "Katalog SIBI"), ("radio", "Kelas Live"),
    ("trophy", "Arena Kuis"), ("brain", "Flashcards AI"), ("pieChart", "Mindmap"),
    ("star", "Study Quest"), ("calendarDays", "Jadwal Belajar"), ("chartColumn", "Nilai & Presensi"),
]
TEACHER_NAV = [
    ("home", "Beranda"), ("fileScan", "Ekstraktor PDF"), ("video", "Studio Live"),
    ("clipboardList", "Buku Nilai"), ("userCheck", "Presensi"), ("notebookPen", "RPP Digital"),
    ("library", "Katalog SIBI"),
]
PARENT_NAV = [("home", "Beranda"), ("activity", "Perkembangan"), ("fileText", "Nilai & Laporan")]
ADMIN_NAV = [
    ("home", "Beranda"), ("users", "Manajemen Akun"), ("bookOpen", "Katalog SIBI"),
    ("school", "Kelas & Rombel"), ("pieChart", "Analitik Sistem"), ("scrollText", "Log Aktivitas"),
]


def book_cover(x, y, w, h, title, subject, gradient, parent, radius=10, dark_text=False):
    cmds = [rect(x, y, w, h, gradient=gradient, radius=radius, parent=parent, name=f"Book cover / {title}")]
    cmds.append(rect(x + w * 0.12, y, max(2, w * 0.018), h, "#FFFFFF33", 0, parent=parent, name="Spine"))
    cmds.append(ellipse(x + w * 0.58, y - h * 0.16, w * 0.68, w * 0.68, "#FFFFFF12", parent=parent, name="Cover orbit"))
    cmds.append(ellipse(x - w * 0.12, y + h * 0.68, w * 0.55, w * 0.55, "#FFFFFF10", parent=parent, name="Cover orbit"))
    fg = INK if dark_text else WHITE
    cmds.append(text(x + w * 0.18, y + h * 0.13, subject.upper(), 7.5, fg, 700, width=w * 0.68, parent=parent, tracking=0.6))
    # split title lines roughly
    words = title.split()
    lines = []
    cur = ""
    for word in words:
        if len(cur + " " + word) > 14 and cur:
            lines.append(cur)
            cur = word
        else:
            cur = (cur + " " + word).strip()
    if cur:
        lines.append(cur)
    ty = y + h * 0.42
    for line in lines[:4]:
        cmds.append(text(x + w * 0.16, ty, line, max(8, w * 0.082), fg, 700, family=DISPLAY, width=w * 0.7, parent=parent))
        ty += max(11, w * 0.10)
    cmds.append(text(x + w * 0.18, y + h - 17, "Kurikulum Merdeka", 6.5, fg, 500, width=w * 0.65, parent=parent, opacity=0.75))
    return cmds


def book_card(x, y, w, h, title, subject, percent, gradient, parent, role="student", badge=None):
    cmds = [rect(x, y, w, h, SURFACE, 18, stroke=LINE, parent=parent, name=f"Book card / {title}", effects=SHADOW_SM)]
    cmds += book_cover(x + 14, y + 16, 80, h - 32, title, subject, gradient, parent, radius=8)
    tx = x + 108
    tw = w - 122
    cmds.append(text(tx, y + 18, title, 12.5, INK, 700, family=DISPLAY, width=tw, parent=parent, line_height="120%"))
    cmds.append(text(tx, y + 58, subject, 9.5, MUTED, 500, parent=parent))
    if badge:
        cmds.append(text(tx, y + 76, badge, 8.5, ROLE[role]["deep"], 600, parent=parent))
    cmds.append(text(tx, y + h - 54, "Progres", 8.5, MUTED, 500, parent=parent))
    cmds.append(text(x + w - 48, y + h - 55, f"{percent}%", 10.5, ROLE[role]["deep"], 700, width=36, align="right", parent=parent))
    cmds += progress_bar(tx, y + h - 34, tw, percent, ROLE[role]["accent"], parent=parent, h=6)
    return cmds


def catalog_card(x, y, w, h, title, subject, rating, gradient, parent, role="student", locked=False):
    cmds = [rect(x, y, w, h, SURFACE, 18, stroke=LINE, parent=parent, name=f"Catalog / {title}", effects=SHADOW_SM)]
    cw, ch = w - 32, h - 104
    cmds += book_cover(x + 16, y + 16, cw, ch, title, subject, gradient, parent, radius=10)
    if locked:
        cmds.append(rect(x + w - 52, y + 28, 30, 30, "#FFFFFFE8", 15, parent=parent, name="Locked"))
        cmds.append(icon("lock", x + w - 44, y + 35, 14, AMBER_700, 2, parent=parent))
    cmds.append(text(x + 16, y + h - 78, title, 11.5, INK, 700, family=DISPLAY, width=w - 32, parent=parent, line_height="120%"))
    cmds.append(text(x + 16, y + h - 38, subject, 9, MUTED, 500, parent=parent))
    cmds.append(icon("star", x + w - 72, y + h - 39, 11, AMBER_500, 0, parent=parent))
    cmds.append(text(x + w - 56, y + h - 39, str(rating), 9.5, INK, 700, parent=parent))
    return cmds


# ---------------------------------------------------------------- pages


def page_cover():
    new_page("00 — Cover", first=True, background=BLUE_900)
    fid = add_screen("Cover / SiGEMAS UI system", 1920, 1080, fill=BLUE_900)
    c = [rect(0, 0, 1920, 1080, gradient=["#06162E", "#0A2A52", "#0D47A1"], parent=fid, name="Cover gradient")]
    # restrained grid
    for gx in range(0, 1920, 96):
        c.append(rect(gx, 0, 1, 1080, "#FFFFFF08", 0, parent=fid, name="Grid line"))
    for gy in range(0, 1080, 96):
        c.append(rect(0, gy, 1920, 1, "#FFFFFF08", 0, parent=fid, name="Grid line"))
    # ambient shapes
    c.append(ellipse(1280, -300, 900, 900, gradient=["#1E88E530", "#1E88E500"], parent=fid, name="Ambient glow"))
    c.append(ellipse(-260, 650, 760, 760, gradient=["#FFB30022", "#FFB30000"], parent=fid, name="Amber glow"))
    c.append(ellipse(1420, 260, 560, 560, "#FFFFFF06", parent=fid, name="Orbit ring", stroke="#FFFFFF13", sw=1))
    c.append(ellipse(1510, 350, 380, 380, "#FFFFFF04", parent=fid, name="Orbit ring", stroke="#FFFFFF0D", sw=1))
    # brand
    c += logo_mark(100, 68, 46, bg=AMBER_500, fg=INK, parent=fid, radius=14)
    c.append(text(160, 72, "SiGEMAS", 25, WHITE, 700, family=DISPLAY, parent=fid))
    c.append(text(161, 104, "SISTEM GERBANG MATERI SEKOLAH", 8.5, "#D8E8FF", 700, tracking=1.1, parent=fid, opacity=0.7))
    c.append(text(1500, 76, "UI/UX SYSTEM", 9, "#D8E8FF", 700, tracking=1.3, parent=fid, opacity=0.7))
    c.append(text(1500, 96, "v1.0 / Prototype 2026", 9, "#D8E8FF", 500, parent=fid, opacity=0.55))
    # headline
    c.append(text(100, 262, "Belajar terasa", 72, WHITE, 600, family=DISPLAY, parent=fid, line_height="108%", tracking=-1.6))
    c.append(text(100, 348, "lebih hidup.", 72, AMBER_500, 600, family=DISPLAY, parent=fid, line_height="108%", tracking=-1.6))
    c.append(text(104, 468, "Satu ruang untuk belajar, mengajar, dan mendampingi. Dirancang untuk siswa, guru, orang tua, dan pengelola sekolah di Indonesia.", 16, "#C9DCF5", 400, width=600, parent=fid, line_height="155%"))
    # proof chips
    for i, label in enumerate(["Siswa", "Guru", "Orang tua", "Admin"]):
        bx = 104 + i * 126
        c.append(rect(bx, 580, 112, 38, "#FFFFFF10", 19, stroke="#FFFFFF22", parent=fid, name=f"Role / {label}"))
        c.append(ellipse(bx + 16, 593, 10, 10, [BLUE_500, AMBER_500, TEAL_500, VIOLET_500][i], parent=fid))
        c.append(text(bx + 33, 593, label, 10.5, WHITE, 600, parent=fid))
    c.append(text(104, 664, "Empati dulu. Baru antarmuka.", 13, "#9FC2EC", 600, family=DISPLAY, parent=fid))
    # role cards
    cards = [
        (1132, 192, 346, 192, "graduationCap", "student", "Ruang belajar", "Lanjutkan bab 3, kejar streak 12 hari, dan ikut kelas live.", BLUE_600),
        (1502, 140, 322, 184, "presentation", "teacher", "Ruang mengajar", "Kelola kelas, nilai, presensi, dan bahan ajar dari satu studio.", AMBER_500),
        (1148, 474, 320, 184, "users", "parent", "Pendampingan", "Pantau perkembangan anak dengan sinyal yang jernih, bukan kebisingan.", TEAL_500),
        (1490, 438, 342, 196, "shieldCheck", "admin", "Administrasi", "Kendalikan akun, kelas, katalog, dan kesehatan sistem sekolah.", VIOLET_500),
    ]
    for x, y, w, h, ic, role, title, desc, col in cards:
        c.append(rect(x, y, w, h, "#FFFFFF12", 26, stroke="#FFFFFF24", parent=fid, name=f"Glass / {title}", effects=SHADOW_LG))
        c.append(rect(x + 22, y + 22, 44, 44, col, 14, parent=fid, name=f"Role icon / {title}"))
        c.append(icon(ic, x + 33, y + 32, 22, WHITE if role != "teacher" else INK, 1.8, parent=fid))
        c.append(text(x + 80, y + 26, title, 15, WHITE, 700, family=DISPLAY, parent=fid))
        c.append(text(x + 80, y + 48, "SIAP DIGUNAKAN", 7.5, "#BBD5F2", 700, tracking=0.8, parent=fid, opacity=0.7))
        c.append(text(x + 22, y + 88, desc, 10.5, "#D6E6F8", 400, width=w - 44, parent=fid, line_height="145%"))
        c.append(text(x + 22, y + h - 28, "Lihat alur  →", 9.5, col, 700, parent=fid))
    # floating live pill
    c.append(rect(1310, 684, 292, 50, "#FFFFFFEA", 25, parent=fid, name="Live status", effects=SHADOW_MD))
    c.append(rect(1324, 699, 20, 20, RED_600, 10, parent=fid))
    c.append(ellipse(1330, 705, 8, 8, WHITE, parent=fid))
    c.append(text(1354, 700, "Kelas live sedang berlangsung", 10.5, INK, 700, parent=fid))
    c.append(text(1354, 715, "Matematika · 27 siswa bergabung", 8.5, MUTED, 500, parent=fid))
    # footer
    c.append(rect(100, 980, 1720, 1, "#FFFFFF20", 0, parent=fid, name="Footer rule"))
    c.append(text(100, 1000, "SiGEMAS · Design direction 01 / Calm confidence", 9, "#A9C8EA", 600, parent=fid, opacity=0.7))
    c.append(text(1470, 1000, "Made for Indonesian schools", 9, "#A9C8EA", 500, parent=fid, opacity=0.7))
    run(c)


def page_foundations():
    new_page("01 — Foundations", background="#F7F9FC")
    fid = add_screen("Foundations / Design system", 1920, 1240, fill="#F7F9FC")
    c = [rect(0, 0, 1920, 1240, "#F7F9FC", 0, parent=fid, name="Canvas")]
    c += logo_mark(80, 58, 38, bg=BLUE_600, fg=WHITE, parent=fid)
    c.append(text(130, 62, "SiGEMAS", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(80, 126, "01 / Foundations", 44, INK, 700, family=DISPLAY, parent=fid, tracking=-0.8))
    c.append(text(82, 184, "The shared language behind every screen: colour, type, spacing, controls, and moments of delight.", 13, MUTED, 400, width=980, parent=fid))
    c.append(rect(1650, 76, 190, 40, BLUE_100, 20, parent=fid, name="Version badge"))
    c.append(text(1672, 88, "DESIGN TOKENS / v1.0", 9, BLUE_800, 700, tracking=0.6, parent=fid))

    # colour card
    c.append(card(80, 228, 1760, 246, parent=fid, name="Colour card"))
    c.append(text(112, 254, "Colour", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(112, 278, "A calm blue foundation, lifted by amber for energy and role colours for orientation.", 10, MUTED, 400, parent=fid))
    swatches = [
        ("Ink", INK, "Primary text"), ("Ocean 900", BLUE_900, "Dark surfaces"), ("Ocean 800", BLUE_800, "Brand deep"),
        ("Signal Blue", BLUE_600, "Primary action"), ("Sky 100", BLUE_100, "Soft highlight"), ("Amber", AMBER_500, "Energy accent"),
        ("Amber 100", AMBER_100, "Warm surface"), ("Teal", TEAL_500, "Parent role"), ("Violet", VIOLET_500, "Admin role"),
        ("Green", GREEN_600, "Success"), ("Red", RED_600, "Danger"), ("Cloud", CANVAS, "App canvas"),
    ]
    for i, (nm, col, use) in enumerate(swatches):
        sx = 112 + i * 142
        c.append(rect(sx, 312, 124, 80, col, 14, stroke=LINE if col in (WHITE, CANVAS, BLUE_100, AMBER_100, TEAL_100) else None, parent=fid, name=f"Swatch / {nm}"))
        c.append(text(sx, 402, nm, 10, INK, 700, parent=fid))
        c.append(text(sx, 417, use, 8.5, MUTED, 400, parent=fid))

    # typography card
    c.append(card(80, 498, 840, 324, parent=fid, name="Typography card"))
    c.append(text(112, 524, "Typography", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(112, 548, "Poppins carries confidence in headings. Inter keeps long reading effortless.", 10, MUTED, 400, parent=fid))
    c.append(text(112, 584, "Aa", 88, BLUE_800, 600, family=DISPLAY, parent=fid, line_height="100%"))
    c.append(text(112, 696, "Poppins / Display", 10, BLUE_800, 700, parent=fid))
    c.append(text(112, 714, "Headings, numbers, brand moments", 8.5, MUTED, 400, parent=fid))
    type_rows = [
        ("Display / 56", "Belajar lebih hidup", 32, DISPLAY, 600),
        ("Heading / 28", "Selamat pagi, Aisyah", 22, DISPLAY, 600),
        ("Title / 18", "Lanjutkan belajar", 15, DISPLAY, 600),
        ("Body / 14", "Materi yang terasa dekat dengan kehidupan sehari-hari.", 12, FONT, 400),
        ("Label / 10", "KELAS LIVE · 27 SISWA", 9, FONT, 700),
    ]
    yy = 584
    for label, sample, sz, fam, wt in type_rows:
        c.append(text(500, yy, label, 8.5, MUTED_2, 600, parent=fid))
        c.append(text(500, yy + 15, sample, sz, INK, wt, family=fam, width=380, parent=fid))
        yy += 45 if sz > 20 else 41

    # controls card
    c.append(card(940, 498, 900, 324, parent=fid, name="Controls card"))
    c.append(text(972, 524, "Controls", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(972, 548, "A friendly geometry: 12–14 px radii, strong labels, generous hit areas.", 10, MUTED, 400, parent=fid))
    btn_specs = [("Mulai belajar", "primary", "arrowRight"), ("Lihat katalog", "outline", "library"), ("Mulai live", "accent", "video"), ("Simpan", "secondary", "check")]
    bx = 972
    for label, variant, ic in btn_specs:
        bs, bw = button(bx, 586, label, variant=variant, parent=fid, icon_name=ic, role="student", w=150)
        c += bs
        bx += 166
    c.append(text(972, 654, "Input", 9, MUTED_2, 700, tracking=0.6, parent=fid))
    c.append(rect(972, 672, 300, 42, SURFACE, 12, stroke=LINE, parent=fid, name="Input / default"))
    c.append(text(990, 686, "Email sekolah", 11, MUTED_2, 400, parent=fid))
    c.append(rect(1292, 672, 300, 42, SURFACE, 12, stroke=BLUE_600, sw=1.5, parent=fid, name="Input / focus"))
    c.append(text(1310, 686, "aisyah@sigemas.id", 11, INK, 500, parent=fid))
    c.append(rect(1612, 672, 196, 42, RED_100, 12, stroke=RED_600, sw=1, parent=fid, name="Input / error"))
    c.append(text(1630, 686, "Periksa kembali", 10.5, RED_600, 600, parent=fid))
    c.append(text(972, 736, "Status", 9, MUTED_2, 700, tracking=0.6, parent=fid))
    for i, (lab, bg, fg) in enumerate([("Aktif", GREEN_100, GREEN_600), ("Menunggu", AMBER_100, AMBER_700), ("Perlu tindakan", RED_100, RED_600), ("AI insight", BLUE_100, BLUE_800)]):
        ps, pw = pill(972 + i * 118, 756, lab, bg, fg, parent=fid)
        c += ps

    # bottom cards
    c.append(card(80, 854, 560, 318, parent=fid, name="Badge & avatar card"))
    c.append(text(112, 880, "Badges & people", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(112, 904, "Soft status chips and warm avatars make progress feel human.", 9.5, MUTED, 400, width=460, parent=fid))
    for i, (lab, bg, fg, col) in enumerate([("Hadir", GREEN_100, GREEN_600, GREEN_600), ("Terlambat", AMBER_100, AMBER_700, AMBER_500), ("Izin", CYAN_100, CYAN_600, CYAN_600), ("Alfa", RED_100, RED_600, RED_600)]):
        ps, _ = pill(112 + i * 98, 938, lab, bg, fg, dot=True, parent=fid)
        c += ps
    for i, (nm, bg, ini) in enumerate([("Aisyah", BLUE_600, "AP"), ("Raka", AMBER_500, "RP"), ("Sari", TEAL_500, "SW"), ("Admin", VIOLET_500, "AD")]):
        c += avatar(112 + i * 58, 994, 42, ini, bg=bg, parent=fid)
    c.append(text(112, 1050, "Avatar initials · 4 role colours · online ring available", 8.5, MUTED, 400, parent=fid))
    c.append(rect(112, 1090, 464, 54, BLUE_50, 14, stroke=BLUE_100, parent=fid, name="Note"))
    c.append(icon("lightbulb", 128, 1107, 18, BLUE_700, 1.8, parent=fid))
    c.append(text(156, 1103, "Gunakan bahasa manusia: “3 tugas menunggu”, bukan “pending: 3”.", 9.5, BLUE_800, 600, width=400, parent=fid))

    c.append(card(660, 854, 560, 318, parent=fid, name="Elevation card"))
    c.append(text(692, 880, "Elevation & radius", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(692, 904, "Three quiet levels. No heavy borders. Shadows only to separate layers.", 9.5, MUTED, 400, width=470, parent=fid))
    for i, (label, rad, shadow) in enumerate([("sm / 12", 12, SHADOW_SM), ("md / 18", 18, SHADOW_MD), ("lg / 26", 26, SHADOW_LG)]):
        ex = 692 + i * 168
        c.append(rect(ex, 944, 140, 92, SURFACE, rad, parent=fid, name=f"Elevation / {label}", effects=shadow))
        c.append(text(ex + 16, 968, label, 9, INK, 700, parent=fid))
        c.append(text(ex + 16, 988, "card / surface", 8, MUTED, 400, parent=fid))
        c.append(rect(ex + 16, 1012, 70, 6, LINE, 3, parent=fid))
    c.append(text(692, 1060, "Radius scale", 9, MUTED_2, 700, tracking=0.6, parent=fid))
    for i, r in enumerate([4, 8, 12, 16, 20, 28]):
        rx = 692 + i * 72
        c.append(rect(rx, 1082, 52, 52, BLUE_100, r, parent=fid, name=f"Radius / {r}"))
        c.append(text(rx, 1140, str(r), 8, MUTED, 500, width=52, align="center", parent=fid))

    c.append(card(1240, 854, 600, 318, parent=fid, name="Icons & spacing card"))
    c.append(text(1272, 880, "Icons & spacing", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(1272, 904, "Lucide-style line icons, 1.8 px stroke, always matched to the role colour.", 9.5, MUTED, 400, width=500, parent=fid))
    icon_names = ["home", "bookOpen", "video", "trophy", "calendarDays", "chartColumn", "users", "shieldCheck", "sparkles", "search"]
    for i, ic in enumerate(icon_names):
        ix = 1272 + (i % 5) * 88
        iy = 940 + (i // 5) * 70
        c.append(rect(ix, iy, 48, 48, BLUE_50, 14, parent=fid, name=f"Icon tile / {ic}"))
        c.append(icon(ic, ix + 14, iy + 14, 20, BLUE_700, 1.9, parent=fid))
    c.append(text(1272, 1090, "Spacing scale · 4 / 8 / 12 / 16 / 24 / 32 / 48", 9, MUTED_2, 700, tracking=0.4, parent=fid))
    spx = 1272
    for i, s in enumerate([4, 8, 12, 16, 24, 32]):
        w = s * 1.8
        c.append(rect(spx, 1116, w, 18, BLUE_600, 4, parent=fid, name=f"Spacing / {s}"))
        c.append(text(spx, 1140, str(s), 8, MUTED, 500, parent=fid))
        spx += w + 18
    c.append(text(1272, 1168, "8-point rhythm · 24 px page gutters · 48 px section air", 8.5, MUTED, 400, parent=fid))
    run(c)


def build_cover_and_foundations():
    page_cover()
    page_foundations()


if __name__ == "__main__":
    build_cover_and_foundations()
    out = B.finish()
    print(f"Wrote {out}")
    for page in ["00 — Cover", "01 — Foundations"]:
        png = RENDERS / (page.replace(" — ", "_").replace(" ", "_") + ".png")
        subprocess.run([CLI, "render", str(out), "--page", page, "--out", str(png), "--scale", "1"], check=True)
        print("Rendered", png)

