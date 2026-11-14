"""Friendly-clean design primitives for SiGEMAS UI v2."""
from __future__ import annotations

import math

from generate_ui import (
    B,
    ICON_PATHS,
    add_screen,
    ellipse,
    icon,
    new_page,
    progress_bar,
    rect,
    run,
    text,
    vector_path,
)

# ---------------------------------------------------------------- v2 palette
CREAM = "#F8F6F1"
PAPER = "#FFFFFF"
INK = "#26323F"
INK_2 = "#3B4A5A"
MUTED = "#7C8896"
SOFT = "#9AA5B1"
LINE = "#ECE9E1"

BLUE = "#3D7BFA"
BLUE_DEEP = "#2451B7"
BLUE_SOFT = "#EAF1FF"
BLUE_PALE = "#F3F7FF"

AMBER = "#F5A623"
AMBER_DEEP = "#B96E0A"
AMBER_SOFT = "#FFF2DA"

GREEN = "#3FAE7A"
GREEN_DEEP = "#247A52"
GREEN_SOFT = "#E8F7EF"

LAVENDER = "#8B7CF6"
LAVENDER_DEEP = "#5B4CC4"
LAVENDER_SOFT = "#F0EDFF"

CORAL = "#F27C6B"
CORAL_SOFT = "#FFEDE9"

ROLE_F = {
    "student": {"accent": BLUE, "deep": BLUE_DEEP, "soft": BLUE_SOFT, "pale": BLUE_PALE},
    "teacher": {"accent": AMBER, "deep": AMBER_DEEP, "soft": AMBER_SOFT, "pale": "#FFF9F0"},
    "parent": {"accent": GREEN, "deep": GREEN_DEEP, "soft": GREEN_SOFT, "pale": "#F4FCF8"},
    "admin": {"accent": LAVENDER, "deep": LAVENDER_DEEP, "soft": LAVENDER_SOFT, "pale": "#F8F6FF"},
}

DISPLAY = "Poppins"
FONT = "Inter"

SH_SM = [{"type": "dropShadow", "color": "#1E2D3D0D", "offset": [0, 8], "radius": 26, "spread": 0}]
SH_MD = [{"type": "dropShadow", "color": "#1E2D3D16", "offset": [0, 16], "radius": 42, "spread": 0}]
SH_LG = [{"type": "dropShadow", "color": "#1E2D3D24", "offset": [0, 28], "radius": 70, "spread": 0}]


def frect(x, y, w, h, fill=PAPER, radius=0, stroke=None, sw=1, parent=0, name="Rectangle",
          effects=None, opacity=None, gradient=None):
    return rect(x, y, w, h, fill=fill, radius=radius, stroke=stroke, sw=sw, parent=parent,
                name=name, effects=effects, opacity=opacity, gradient=gradient)


def ftext(x, y, value, size=14, color=INK, weight=400, family=FONT, width=None, align="left",
          parent=0, line_height=None, tracking=None, opacity=None, name=None):
    return text(x, y, value, size=size, color=color, weight=weight, family=family, width=width,
                align=align, parent=parent, name=name, line_height=line_height,
                tracking=tracking, opacity=opacity)


def ficon(name, x, y, size=20, color=INK, sw=1.9, parent=0, opacity=None):
    return icon(name, x, y, size=size, color=color, sw=sw, parent=parent, opacity=opacity)


def fcard(x, y, w, h, parent=0, radius=24, fill=PAPER, stroke=None, shadow=SH_SM, name="Card"):
    return frect(x, y, w, h, fill=fill, radius=radius, stroke=stroke, parent=parent,
                 name=name, effects=shadow)


def favatar(x, y, size, initials, bg=BLUE, fg=PAPER, parent=0):
    cmds = [ellipse(x, y, size, size, bg, parent=parent, name="Avatar")]
    cmds.append(ftext(x, y + size * 0.28, initials, size * 0.33, fg, 700,
                      family=DISPLAY, width=size, align="center", parent=parent))
    return cmds


def fprogress(x, y, w, pct, color=BLUE, bg=LINE, h=8, parent=0):
    return progress_bar(x, y, w, pct, color=color, bg=bg, h=h, parent=parent)


def fpill(x, y, label, bg=BLUE_SOFT, fg=BLUE_DEEP, parent=0, dot=False, size=10, h=28, pad=14):
    width = pad * 2 + len(label) * size * 0.56 + (12 if dot else 0)
    cmds = [frect(x, y, width, h, fill=bg, radius=h / 2, parent=parent, name=f"Pill / {label}")]
    tx = x + pad
    if dot:
        cmds.append(ellipse(x + pad, y + h / 2 - 3.5, 7, 7, fg, parent=parent))
        tx += 12
    cmds.append(ftext(tx, y + (h - size) / 2 - 1, label, size, fg, 600, parent=parent))
    return cmds, width


def fbutton(x, y, label, variant="primary", role="student", parent=0, w=None, h=44,
            icon_name=None, size=11.5):
    r = ROLE_F[role]
    if w is None:
        w = 28 + len(label) * size * 0.56 + (22 if icon_name else 0)
    styles = {
        "primary": (r["accent"], PAPER, None),
        "soft": (r["soft"], r["deep"], None),
        "white": (PAPER, INK, None),
        "outline": (PAPER, INK, LINE),
        "ghost": ("#FFFFFF00", r["deep"], None),
        "danger": (CORAL, PAPER, None),
        "dark": (INK, PAPER, None),
    }
    bg, fg, stroke = styles[variant]
    cmds = [frect(x, y, w, h, fill=bg, radius=h / 2, stroke=stroke, parent=parent, name=f"Button / {label}")]
    tx = x + 22
    if icon_name:
        cmds.append(ficon(icon_name, x + 18, y + (h - 16) / 2, 16, fg, 2, parent=parent))
        tx += 22
    cmds.append(ftext(tx, y + (h - size) / 2 - 2, label, size, fg, 600, parent=parent))
    return cmds, w


def flogo(x, y, size=40, bg=BLUE, fg=PAPER, parent=0, radius=None):
    r = radius if radius is not None else size * 0.30
    return [
        frect(x, y, size, size, fill=bg, radius=r, parent=parent, name="SiGEMAS mark"),
        ficon("bookOpen", x + size * 0.23, y + size * 0.23, size * 0.54, fg, 1.9, parent=parent),
    ]


def fmascot(x, y, size=200, parent=0, accent=BLUE, soft=BLUE_SOFT):
    """A friendly little book character, drawn only with primitives."""
    c = []
    c.append(ellipse(x + size * 0.08, y + size * 0.86, size * 0.84, size * 0.16, "#1E2D3D12", parent=parent, name="Mascot shadow"))
    # body / book
    c.append(frect(x + size * 0.16, y + size * 0.10, size * 0.68, size * 0.78, fill=PAPER, radius=size * 0.17,
                   stroke=soft, parent=parent, name="Mascot book", effects=SH_MD))
    c.append(frect(x + size * 0.16, y + size * 0.10, size * 0.68, size * 0.20, fill=accent, radius=size * 0.16,
                   parent=parent, name="Mascot cover"))
    c.append(frect(x + size * 0.16, y + size * 0.24, size * 0.68, size * 0.08, fill=accent, parent=parent, name="Mascot cover fill"))
    # bookmark
    c.append(frect(x + size * 0.68, y + size * 0.08, size * 0.09, size * 0.28, fill=AMBER, radius=size * 0.02,
                   parent=parent, name="Mascot bookmark"))
    c.append(vector_path(f"M{x+size*0.68:.1f} {y+size*0.36:.1f}L{x+size*0.725:.1f} {y+size*0.30:.1f}L{x+size*0.77:.1f} {y+size*0.36:.1f}",
                         0, 0, 1, 1, fill="none", stroke=AMBER, sw=0, parent=parent, name="Bookmark notch"))
    # face
    c.append(ellipse(x + size * 0.32, y + size * 0.43, size * 0.08, size * 0.08, INK, parent=parent, name="Eye"))
    c.append(ellipse(x + size * 0.57, y + size * 0.43, size * 0.08, size * 0.08, INK, parent=parent, name="Eye"))
    c.append(vector_path(
        f"M{x+size*0.38:.1f} {y+size*0.59:.1f}Q{x+size*0.48:.1f} {y+size*0.66:.1f} {x+size*0.58:.1f} {y+size*0.59:.1f}",
        0, 0, 1, 1, fill="none", stroke=INK, sw=2.4, parent=parent, name="Smile"))
    # cheeks
    c.append(ellipse(x + size * 0.26, y + size * 0.54, size * 0.07, size * 0.045, CORAL_SOFT, parent=parent, name="Cheek"))
    c.append(ellipse(x + size * 0.64, y + size * 0.54, size * 0.07, size * 0.045, CORAL_SOFT, parent=parent, name="Cheek"))
    # page lines
    for i in range(2):
        c.append(frect(x + size * 0.28, y + size * 0.72 + i * size * 0.055, size * 0.40, size * 0.018,
                       fill=LINE, radius=2, parent=parent, name="Mascot page line"))
    # arms
    c.append(frect(x + size * 0.07, y + size * 0.46, size * 0.11, size * 0.08, fill=accent, radius=size * 0.04,
                   parent=parent, name="Mascot arm"))
    c.append(frect(x + size * 0.82, y + size * 0.46, size * 0.11, size * 0.08, fill=accent, radius=size * 0.04,
                   parent=parent, name="Mascot arm"))
    return c


def fbook_cover(x, y, w, h, title, subject, gradient, parent, radius=14):
    c = [frect(x, y, w, h, fill=gradient[0], radius=radius, parent=parent,
               gradient=gradient, name=f"Book cover / {title}")]
    c.append(ellipse(x + w * 0.62, y - h * 0.02, w * 0.68, w * 0.68, "#FFFFFF18", parent=parent, name="Cover orbit"))
    c.append(ellipse(x - w * 0.16, y + h * 0.68, w * 0.58, w * 0.58, "#FFFFFF10", parent=parent, name="Cover orbit"))
    c.append(ftext(x + w * 0.16, y + h * 0.14, subject.upper(), 7.5, PAPER, 700, width=w * 0.68,
                   parent=parent, tracking=0.6))
    words = title.split()
    lines, cur = [], ""
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
        c.append(ftext(x + w * 0.15, ty, line, max(9, w * 0.083), PAPER, 700, family=DISPLAY,
                       width=w * 0.7, parent=parent))
        ty += max(12, w * 0.10)
    c.append(ftext(x + w * 0.17, y + h - 18, "Kurikulum Merdeka", 6.5, PAPER, 500, parent=parent, opacity=0.75))
    return c


def fsection(x, y, title, subtitle=None, parent=0, action=None, accent=BLUE_DEEP):
    c = [ftext(x, y, title, 18, INK, 700, family=DISPLAY, parent=parent)]
    if subtitle:
        c.append(ftext(x, y + 28, subtitle, 11, MUTED, 400, parent=parent))
    if action:
        c.append(ftext(x, y + 4, action, 10.5, accent, 600, parent=parent))
    return c


# ---------------------------------------------------------------- shell
STUDENT_NAV2 = [
    ("home", "Beranda"), ("library", "Katalog"), ("radio", "Kelas Live"),
    ("trophy", "Kuis"), ("brain", "Latihan"), ("calendarDays", "Jadwal"), ("chartColumn", "Nilai"),
]
TEACHER_NAV2 = [
    ("home", "Beranda"), ("video", "Studio Live"), ("clipboardList", "Buku Nilai"),
    ("userCheck", "Presensi"), ("notebookPen", "RPP"), ("library", "Katalog"),
]
PARENT_NAV2 = [("home", "Beranda"), ("activity", "Perkembangan"), ("fileText", "Laporan")]
ADMIN_NAV2 = [("home", "Beranda"), ("users", "Pengguna"), ("bookOpen", "Katalog"),
              ("school", "Kelas"), ("pieChart", "Analitik"), ("scrollText", "Log")]


def fsidebar(H, role, active_index, nav, parent):
    r = ROLE_F[role]
    c = [frect(0, 0, 224, H, fill="#FBFAF6", parent=parent, name="Sidebar"),
         frect(223, 0, 1, H, fill=LINE, parent=parent, name="Sidebar divider")]
    c += flogo(28, 28, 36, bg=r["accent"], parent=parent)
    c.append(ftext(76, 32, "SiGEMAS", 18, INK, 700, family=DISPLAY, parent=parent))
    c.append(ftext(28, 92, "Menu", 9, SOFT, 700, tracking=1.0, parent=parent))
    y = 116
    for i, (ic, label) in enumerate(nav):
        active = i == active_index
        if active:
            c.append(frect(16, y - 2, 192, 44, fill=r["soft"], radius=14, parent=parent, name=f"Nav active / {label}"))
        c.append(ficon(ic, 34, y + 10, 19, r["deep"] if active else MUTED, 1.9, parent=parent))
        c.append(ftext(64, y + 12, label, 12.5, r["deep"] if active else INK_2, 600 if active else 500, parent=parent))
        y += 50
    # gentle note
    c.append(frect(20, H - 156, 184, 76, fill=r["pale"], radius=18, parent=parent, name="Sidebar note"))
    c.append(ficon("sun", 36, H - 138, 18, r["accent"], 1.9, parent=parent))
    c.append(ftext(62, H - 140, "Semangat hari ini", 10.5, INK, 700, parent=parent))
    c.append(ftext(36, H - 114, "Kecil tapi konsisten.", 9, MUTED, 400, parent=parent))
    return c


def ftopbar(W, role, title, parent, subtitle=None, avatar_text="AP", search=None):
    r = ROLE_F[role]
    c = [frect(224, 0, W - 224, 84, fill=CREAM, parent=parent, name="Topbar")]
    c.append(ftext(252, 26, title, 20, INK, 700, family=DISPLAY, parent=parent, tracking=-0.2))
    if subtitle:
        c.append(ftext(252, 52, subtitle, 10.5, MUTED, 400, parent=parent))
    if search:
        c.append(frect(W - 570, 22, 260, 42, fill=PAPER, radius=21, stroke=LINE, parent=parent, name="Search field"))
        c.append(ficon("search", W - 554, 33, 16, MUTED, 1.9, parent=parent))
        c.append(ftext(W - 528, 34, search, 10.5, SOFT, 400, parent=parent))
    c.append(frect(W - 276, 24, 36, 36, fill=PAPER, radius=18, parent=parent, name="Notifications"))
    c.append(ficon("bell", W - 266, 33, 16, MUTED, 1.9, parent=parent))
    c.append(ellipse(W - 272, 26, 7, 7, CORAL, parent=parent, name="Notification dot"))
    c += favatar(W - 226, 24, 36, avatar_text, bg=r["accent"], parent=parent)
    return c


def fpage(role, title, active_index, nav, parent, subtitle=None, search=None, avatar_text="AP"):
    W, H = 1440, 1024
    c = [frect(0, 0, W, H, fill=CREAM, parent=parent, name="Canvas")]
    c += fsidebar(H, role, active_index, nav, parent)
    c += ftopbar(W, role, title, parent, subtitle=subtitle, search=search, avatar_text=avatar_text)
    return c


def soft_line(x, y, w, h, values, color=BLUE, labels=None, parent=0, thickness=2.6):
    c = []
    lo, hi = min(values) - 4, max(values) + 4
    pts = []
    for i, v in enumerate(values):
        px = x + w * i / max(1, len(values) - 1)
        py = y + h - ((v - lo) / (hi - lo)) * h
        pts.append((px, py))
    if labels:
        for i, lab in enumerate(labels):
            px = x + w * i / max(1, len(labels) - 1)
            c.append(ftext(px - 22, y + h + 12, lab, 9, SOFT, 500, width=44, align="center", parent=parent))
    # area
    area = "M" + "L".join(f"{px:.1f} {py:.1f}" for px, py in pts)
    area += f"L{x+w:.1f} {y+h:.1f}L{x:.1f} {y+h:.1f}Z"
    c.append(vector_path(area, 0, 0, 1, 1, fill=color, stroke=None, sw=0, parent=parent,
                         name="Area fill", opacity=0.08))
    d = "M" + "L".join(f"{px:.1f} {py:.1f}" for px, py in pts)
    c.append(vector_path(d, 0, 0, 1, 1, fill="none", stroke=color, sw=thickness, parent=parent, name="Trend line"))
    for px, py in pts:
        c.append(ellipse(px - 3, py - 3, 6, 6, PAPER, parent=parent, stroke=color, sw=2))
    return c


def simple_bars(x, y, w, h, values, labels, color=BLUE, parent=0, max_value=None):
    c = []
    n = len(values)
    gap = 14
    bw = (w - gap * (n - 1)) / n
    mx = max_value or max(values) * 1.18
    for i, v in enumerate(values):
        bh = max(6, v / mx * h)
        bx = x + i * (bw + gap)
        c.append(frect(bx, y + h - bh, bw, bh, fill=color, radius=bw / 2, parent=parent, name=f"Bar {i}"))
        if labels:
            c.append(ftext(bx - 4, y + h + 10, labels[i], 9, SOFT, 500, width=bw + 8, align="center", parent=parent))
    return c


def soft_donut(cx, cy, radius, segments, parent=0, thickness=18, center_value="", center_label=""):
    c = [ellipse(cx - radius, cy - radius, radius * 2, radius * 2, "#FFFFFF00", parent=parent,
                 name="Donut track", stroke="#F1EEE7", sw=thickness)]
    total = sum(s["value"] for s in segments) or 1
    a = -math.pi / 2
    for s in segments:
        da = 2 * math.pi * s["value"] / total
        a2 = a + da
        large = 1 if da > math.pi else 0
        p0 = (cx + radius * math.cos(a), cy + radius * math.sin(a))
        p1 = (cx + radius * math.cos(a2), cy + radius * math.sin(a2))
        d = f"M{p0[0]:.2f} {p0[1]:.2f}A{radius} {radius} 0 {large} 1 {p1[0]:.2f} {p1[1]:.2f}"
        c.append(vector_path(d, 0, 0, 1, 1, fill="none", stroke=s["color"], sw=thickness,
                             parent=parent, name=f"Donut / {s['label']}"))
        a = a2
    if center_value:
        c.append(ftext(cx - radius, cy - 14, center_value, 27, INK, 700, family=DISPLAY,
                       width=radius * 2, align="center", parent=parent))
    if center_label:
        c.append(ftext(cx - radius, cy + 16, center_label, 9, MUTED, 500, width=radius * 2, align="center", parent=parent))
    return c
