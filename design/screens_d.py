"""Mobile flow screens."""
from generate_ui import *


def status_bar(fid, x=0, y=0, dark=False):
    fg = WHITE if dark else INK
    return [
        text(x + 22, y + 14, "09:41", 10, fg, 700, parent=fid),
        icon("signal", x + 284, y + 15, 12, fg, 2, parent=fid),
        icon("wifi", x + 300, y + 15, 12, fg, 2, parent=fid),
        icon("battery", x + 316, y + 14, 15, fg, 1.8, parent=fid),
    ]


def phone_shell(fid, x, y, w=393, h=852, dark=False):
    c = []
    c.append(rect(x, y, w, h, "#0B1B33", 46, parent=fid, name="Phone body", effects=SHADOW_LG))
    c.append(rect(x + 8, y + 8, w - 16, h - 16, "#0B1B33", 38, parent=fid, name="Phone inner"))
    c.append(rect(x + 12, y + 12, w - 24, h - 24, SURFACE if not dark else "#071426", 35, parent=fid, name="Phone screen"))
    # notch
    c.append(rect(x + w / 2 - 58, y + 20, 116, 26, "#071426", 13, parent=fid, name="Dynamic island"))
    return c


def mobile_bottom_nav(fid, x, y, w=369, active=0):
    c = [rect(x, y, w, 62, "#FFFFFFF2", 20, stroke=LINE, parent=fid, name="Mobile tab bar", effects=SHADOW_MD)]
    items = [("home", "Beranda"), ("library", "Katalog"), ("radio", "Live"), ("trophy", "Kuis"), ("userCheck", "Profil")]
    for i, (ic, lab) in enumerate(items):
        ix = x + 20 + i * 68
        col = BLUE_600 if i == active else MUTED_2
        c.append(icon(ic, ix + 8, y + 12, 18, col, 1.9, parent=fid))
        c.append(text(ix - 8, y + 36, lab, 7.5, col, 700 if i == active else 500, width=52, align="center", parent=fid))
    return c


def page_mobile():
    new_page("11 — Mobile flows", background="#E9EFF7")
    fid = add_screen("Mobile / Flows", 1347, 920, fill="#E9EFF7")
    c = [rect(0, 0, 1347, 920, "#E9EFF7", 0, parent=fid, name="Canvas")]
    # labels
    for i, lab in enumerate(["Student home", "Reader", "Quiz arena"]):
        x = 40 + i * 453
        c.append(text(x, 22, lab, 15, INK, 700, family=DISPLAY, parent=fid))
        c.append(text(x, 42, "iPhone 17 · 393 × 852", 8.5, MUTED, 500, parent=fid))

    # ---- phone 1: home
    px, py = 40, 68
    c += phone_shell(fid, px, py, dark=False)
    c += status_bar(fid, px + 12, py + 12)
    c.append(text(px + 28, py + 68, "Halo, Aisyah", 10, MUTED, 500, parent=fid))
    c.append(text(px + 28, py + 84, "Mau belajar apa hari ini?", 20, INK, 700, family=DISPLAY, parent=fid, tracking=-0.3))
    c += avatar(px + 326, py + 64, 34, "AP", bg=BLUE_600, parent=fid)
    # hero
    c.append(rect(px + 20, py + 124, 345, 130, gradient=["#0D47A1", "#1E88E5"], radius=20, parent=fid, name="Mobile hero"))
    c.append(ellipse(px + 252, py + 96, 130, 130, "#FFFFFF10", parent=fid, name="Hero orbit"))
    c.append(text(px + 38, py + 142, "KELAS LIVE · 27 SISWA", 7.5, "#D4E8FF", 700, tracking=0.7, parent=fid))
    c.append(text(px + 38, py + 158, "Matematika · Bab 3", 15, WHITE, 700, family=DISPLAY, parent=fid))
    c.append(text(px + 38, py + 180, "Fungsi Kuadrat bersama Pak Raka", 8.5, "#D4E8FF", 400, parent=fid))
    c.append(rect(px + 38, py + 202, 102, 30, AMBER_500, 15, parent=fid, name="Join CTA"))
    c.append(icon("play", px + 50, py + 210, 12, INK, 2.2, parent=fid))
    c.append(text(px + 68, py + 210, "Gabung sekarang", 7.5, INK, 700, parent=fid))
    # section
    c.append(text(px + 22, py + 276, "Lanjutkan belajar", 13, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(px + 310, py + 280, "Semua", 8, BLUE_700, 600, parent=fid))
    # book horizontal card
    c.append(rect(px + 20, py + 300, 345, 126, SURFACE, 16, stroke=LINE, parent=fid, name="Continue card", effects=SHADOW_SM))
    c += book_cover(px + 32, py + 312, 66, 102, "Matematika Kelas X", "Matematika", ["#1565C0", "#0D47A1"], fid, radius=7)
    c.append(text(px + 112, py + 316, "Matematika Kelas X", 10.5, INK, 700, parent=fid))
    c.append(text(px + 112, py + 334, "Bab 3 · Fungsi Kuadrat", 8, MUTED, 400, parent=fid))
    c += progress_bar(px + 112, py + 360, 220, 68, BLUE_600, parent=fid, h=6)
    c.append(text(px + 112, py + 374, "68% selesai", 7.5, BLUE_700, 600, parent=fid))
    c.append(text(px + 112, py + 394, "Lanjut baca  →", 8, BLUE_700, 700, parent=fid))
    # quick stats
    for i, (lab, val, bg, fg) in enumerate([("Jam belajar", "7,5", BLUE_50, BLUE_700), ("Streak", "12", AMBER_100, AMBER_700), ("Peringkat", "#3", GREEN_100, GREEN_600)]):
        x = px + 20 + i * 118
        c.append(rect(x, py + 442, 109, 70, bg, 14, parent=fid, name=f"Quick stat / {lab}"))
        c.append(text(x + 12, py + 452, lab, 7.5, MUTED, 500, parent=fid))
        c.append(text(x + 12, py + 466, val, 19, fg, 700, family=DISPLAY, parent=fid))
    # schedule
    c.append(text(px + 22, py + 540, "Jadwal hari ini", 13, INK, 700, family=DISPLAY, parent=fid))
    for i, (time, subj, room) in enumerate([("07.30", "Matematika", "R-204"), ("09.15", "Bahasa Indonesia", "R-204")]):
        y = py + 564 + i * 52
        c.append(rect(px + 20, y, 345, 44, SURFACE, 12, stroke=LINE, parent=fid, name="Schedule row"))
        c.append(rect(px + 32, y + 8, 48, 28, BLUE_50, 8, parent=fid, name="Time"))
        c.append(text(px + 36, y + 14, time, 8, BLUE_700, 700, parent=fid))
        c.append(text(px + 94, y + 8, subj, 9, INK, 700, parent=fid))
        c.append(text(px + 94, y + 23, room, 7.5, MUTED, 400, parent=fid))
        c.append(icon("chevronRight", px + 336, y + 15, 13, MUTED, 2, parent=fid))
    c += mobile_bottom_nav(fid, px + 12, py + 762, w=369)

    # ---- phone 2: reader
    px2 = 493
    c += phone_shell(fid, px2, py, dark=False)
    c += status_bar(fid, px2 + 12, py + 12)
    c.append(icon("arrowLeft", px2 + 24, py + 68, 20, INK, 2, parent=fid))
    c.append(text(px2 + 52, py + 66, "Fungsi Kuadrat", 14, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(px2 + 52, py + 84, "Bab 3 · halaman 78", 8, MUTED, 400, parent=fid))
    c.append(icon("bookmark", px2 + 338, py + 68, 17, BLUE_700, 1.9, parent=fid))
    # progress
    c.append(rect(px2 + 20, py + 112, 345, 6, LINE, 3, parent=fid, name="Read progress track"))
    c.append(rect(px2 + 20, py + 112, 345 * 0.68, 6, BLUE_600, 3, parent=fid, name="Read progress fill"))
    # page
    c.append(rect(px2 + 16, py + 132, 353, 626, SURFACE, 16, parent=fid, name="Mobile page", effects=SHADOW_SM))
    c.append(text(px2 + 36, py + 152, "BAB 3", 8, AMBER_700, 700, tracking=0.7, parent=fid))
    c.append(text(px2 + 36, py + 166, "Fungsi Kuadrat", 23, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(px2 + 36, py + 200, "Mengenali pola dan membaca parabola dari kehidupan sehari-hari.", 9.5, MUTED, 400, width=310, parent=fid, line_height="145%"))
    c.append(rect(px2 + 36, py + 230, 70, 3, AMBER_500, 2, parent=fid, name="Rule"))
    paras = [
        "Fungsi kuadrat adalah fungsi yang dapat dituliskan sebagai f(x) = ax² + bx + c dengan a ≠ 0.",
        "Grafiknya berbentuk parabola. Jika a > 0, parabola membuka ke atas. Jika a < 0, parabola membuka ke bawah.",
    ]
    yy = py + 254
    for p in paras:
        c.append(text(px2 + 36, yy, p, 10.5, "#334155", 400, width=306, parent=fid, line_height="170%"))
        yy += 62
    c.append(rect(px2 + 36, py + 378, 306, 78, BLUE_50, 12, stroke=BLUE_100, parent=fid, name="Formula"))
    c.append(text(px2 + 52, py + 392, "Bentuk umum", 7.5, BLUE_800, 700, tracking=0.4, parent=fid))
    c.append(text(px2 + 52, py + 408, "f(x) = ax² + bx + c", 17, BLUE_800, 600, family=DISPLAY, parent=fid))
    c.append(text(px2 + 52, py + 436, "a ≠ 0", 8, BLUE_700, 500, parent=fid))
    # mini figure
    c.append(rect(px2 + 36, py + 474, 306, 170, "#F8FAFD", 12, stroke=LINE, parent=fid, name="Figure"))
    c.append(rect(px2 + 70, py + 624, 236, 1, "#CBD5E1", 0, parent=fid, name="X axis"))
    c.append(rect(px2 + 180, py + 500, 1, 142, "#CBD5E1", 0, parent=fid, name="Y axis"))
    pts = []
    for i in range(31):
        t = i / 30
        pxp = px2 + 70 + t * 236
        xx = (t - 0.5) * 5
        yy2 = xx * xx - 2.25
        pyp = py + 600 - yy2 * 12
        pts.append(f"{pxp:.1f} {pyp:.1f}")
    c.append(vector_path("M" + "L".join(pts), 0, 0, 1, 1, fill="none", stroke=BLUE_600, sw=2.2, parent=fid, name="Mobile parabola"))
    c.append(ellipse(px2 + 176, py + 596, 8, 8, AMBER_500, parent=fid, stroke=WHITE, sw=1.5))
    c.append(text(px2 + 36, py + 662, "Gambar 3.1 · Parabola membuka ke atas.", 8, MUTED, 400, parent=fid))
    c.append(rect(px2 + 36, py + 688, 306, 42, AMBER_100, 10, parent=fid, name="Mobile highlight"))
    c.append(icon("highlighter", px2 + 48, py + 700, 14, AMBER_700, 1.9, parent=fid))
    c.append(text(px2 + 70, py + 700, "Tandai: vertex = titik puncak", 8, AMBER_800, 600, parent=fid))
    # bottom toolbar
    c.append(rect(px2 + 12, py + 770, 369, 54, "#FFFFFFF2", 18, stroke=LINE, parent=fid, name="Reader toolbar", effects=SHADOW_MD))
    for i, (ic, lab) in enumerate([("listChecks", "Daftar isi"), ("highlighter", "Sorot"), ("messageSquare", "Catatan"), ("sparkles", "AI")]):
        x = px2 + 28 + i * 86
        c.append(icon(ic, x + 8, py + 782, 17, BLUE_700 if i == 3 else MUTED, 1.9, parent=fid))
        c.append(text(x - 8, py + 804, lab, 6.8, MUTED, 500, width=50, align="center", parent=fid))

    # ---- phone 3: quiz
    px3 = 946
    c += phone_shell(fid, px3, py, dark=False)
    c += status_bar(fid, px3 + 12, py + 12)
    c.append(icon("x", px3 + 24, py + 68, 19, MUTED, 2, parent=fid))
    c.append(text(px3 + 150, py + 65, "Kuis Bab 3", 12, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(px3 + 310, py + 68, "08:42", 9, RED_600, 700, parent=fid))
    c.append(rect(px3 + 20, py + 102, 345, 6, LINE, 3, parent=fid, name="Quiz progress track"))
    c.append(rect(px3 + 20, py + 102, 345 * 0.4, 6, BLUE_600, 3, parent=fid, name="Quiz progress fill"))
    c.append(text(px3 + 20, py + 118, "Soal 4 dari 10", 8, MUTED, 500, parent=fid))
    c.append(text(px3 + 300, py + 118, "40%", 8, BLUE_700, 700, parent=fid))
    # question
    c.append(rect(px3 + 20, py + 148, 345, 134, gradient=["#0D47A1", "#1E88E5"], radius=20, parent=fid, name="Question card"))
    c.append(ellipse(px3 + 268, py + 100, 120, 120, "#FFFFFF10", parent=fid, name="Question glow"))
    c.append(text(px3 + 38, py + 166, "PILIHAN GANDA", 7.5, "#CFE5FF", 700, tracking=0.8, parent=fid))
    c.append(text(px3 + 38, py + 184, "Grafik y = x² − 4x + 3", 16, WHITE, 700, family=DISPLAY, parent=fid))
    c.append(text(px3 + 38, py + 208, "memotong sumbu X di titik …", 16, WHITE, 700, family=DISPLAY, parent=fid))
    c.append(text(px3 + 38, py + 242, "Pilih satu jawaban yang paling tepat.", 8.5, "#CFE5FF", 400, parent=fid))
    # options
    opts = [("A", "(1, 0) dan (3, 0)"), ("B", "(0, 1) dan (0, 3)"), ("C", "(−1, 0) dan (−3, 0)"), ("D", "(2, −1) dan (0, 3)")]
    for i, (letter, val) in enumerate(opts):
        y = py + 304 + i * 62
        selected = i == 0
        c.append(rect(px3 + 20, y, 345, 52, BLUE_50 if selected else SURFACE, 14, stroke=BLUE_600 if selected else LINE, sw=1.5 if selected else 1, parent=fid, name=f"Option / {letter}"))
        c.append(ellipse(px3 + 36, y + 10, 32, 32, BLUE_600 if selected else "#F2F5FA", parent=fid, name="Option letter"))
        c.append(text(px3 + 36, y + 18, letter, 10, WHITE if selected else MUTED, 700, width=32, align="center", parent=fid))
        c.append(text(px3 + 82, y + 18, val, 10, INK, 600, parent=fid))
        if selected:
            c.append(icon("checkCircle", px3 + 330, y + 18, 15, BLUE_600, 2, parent=fid))
    c.append(text(px3 + 20, py + 570, "Butuh bantuan?", 8.5, MUTED, 500, parent=fid))
    c.append(rect(px3 + 100, py + 562, 96, 26, BLUE_50, 13, parent=fid, name="Hint"))
    c.append(icon("lightbulb", px3 + 110, py + 568, 12, BLUE_700, 2, parent=fid))
    c.append(text(px3 + 128, py + 569, "Lihat petunjuk", 8, BLUE_700, 600, parent=fid))
    c.append(rect(px3 + 20, py + 744, 345, 48, BLUE_600, 24, parent=fid, name="Next button"))
    c.append(text(px3 + 20, py + 758, "Lanjut ke soal berikutnya", 10, WHITE, 700, width=345, align="center", parent=fid))
    c.append(icon("arrowRight", px3 + 324, py + 760, 14, WHITE, 2.2, parent=fid))
    run(c)
