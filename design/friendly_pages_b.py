"""Friendly v2: live class, teacher studio, teacher home, parent."""
from friendly_ui import *


def page_live_student_v2():
    new_page("V2 05 — Live class", background="#20303F")
    fid = add_screen("Student / Live friendly", 1440, 1024, fill="#20303F")
    c = [frect(0, 0, 1440, 1024, fill="#20303F", parent=fid, name="Background")]
    # topbar
    c.append(frect(0, 0, 1440, 80, fill="#263747", parent=fid, name="Topbar"))
    c += flogo(28, 22, 36, bg=BLUE, parent=fid)
    c.append(ftext(76, 24, "Matematika · Fungsi Kuadrat", 15, PAPER, 700, family=DISPLAY, parent=fid))
    c.append(ftext(76, 48, "X IPA 2 · Pak Raka", 9.5, "#A9BCCB", 400, parent=fid))
    c.append(frect(340, 24, 76, 30, fill=CORAL, radius=15, parent=fid, name="Live badge"))
    c.append(ellipse(352, 34, 7, 7, PAPER, parent=fid, name="Live dot"))
    c.append(ftext(364, 31, "LIVE", 9, PAPER, 700, parent=fid))
    c.append(ftext(436, 30, "42 menit", 10, "#C7D6E2", 500, parent=fid))
    c.append(ftext(520, 30, "· 27 siswa", 10, "#C7D6E2", 500, parent=fid))
    c.append(frect(1256, 22, 140, 36, fill="#FFFFFF12", radius=18, parent=fid, name="Leave"))
    c.append(ficon("logOut", 1270, 32, 15, "#D7E4EE", 2, parent=fid))
    c.append(ftext(1292, 32, "Keluar kelas", 9.5, "#D7E4EE", 600, parent=fid))

    # stage
    sx, sy, sw, sh = 28, 104, 900, 540
    c.append(frect(sx, sy, sw, sh, fill="#2C4256", radius=28, parent=fid, name="Stage"))
    c.append(ellipse(sx + 300, sy + 10, 300, 300, "#FFFFFF08", parent=fid, name="Stage blob"))
    c.append(frect(sx + 80, sy + 52, 470, 396, fill="#375369", radius=24, parent=fid, name="Teacher video"))
    c.append(ellipse(sx + 250, sy + 134, 130, 130, AMBER, parent=fid, name="Teacher avatar"))
    c.append(ftext(sx + 250, sy + 166, "RP", 34, PAPER, 700, family=DISPLAY, width=130, align="center", parent=fid))
    c.append(ftext(sx + 220, sy + 290, "Pak Raka Pradana", 17, PAPER, 700, family=DISPLAY, width=190, align="center", parent=fid))
    c.append(ftext(sx + 210, sy + 316, "sedang menjelaskan dengan tenang", 9.5, "#C2D5E3", 400, width=210, align="center", parent=fid))
    c.append(frect(sx + 98, sy + 404, 166, 32, fill="#20303FCC", radius=12, parent=fid, name="Camera label"))
    c.append(ellipse(sx + 110, sy + 416, 8, 8, CORAL, parent=fid, name="Rec dot"))
    c.append(ftext(sx + 124, sy + 412, "Kamera guru", 9, "#D7E4EE", 600, parent=fid))
    # lesson card
    c.append(frect(sx + 580, sy + 52, 290, 230, fill=PAPER, radius=20, parent=fid, name="Lesson card", effects=SH_MD))
    c.append(ftext(sx + 602, sy + 74, "Hari ini", 10, AMBER_DEEP, 700, parent=fid))
    c.append(ftext(sx + 602, sy + 94, "Fungsi Kuadrat", 22, INK, 600, family=DISPLAY, parent=fid))
    c.append(ftext(sx + 602, sy + 130, "Kita akan belajar:", 9.5, MUTED, 400, parent=fid))
    for i, item in enumerate(["mengenali bentuk parabola", "menemukan titik puncak", "membaca contoh di sekitar"]):
        y = sy + 152 + i * 30
        c.append(ellipse(sx + 604, y + 4, 6, 6, BLUE, parent=fid, name="Bullet"))
        c.append(ftext(sx + 620, y, item, 9.5, INK_2, 500, parent=fid))
    c.append(frect(sx + 580, sy + 302, 290, 146, fill="#FFFFFF10", radius=20, parent=fid, name="Ask note"))
    c.append(ficon("messageCircle", sx + 602, sy + 322, 20, AMBER, 1.9, parent=fid))
    c.append(ftext(sx + 632, sy + 322, "Tanya kapan saja", 10.5, PAPER, 700, parent=fid))
    c.append(ftext(sx + 602, sy + 354, "Tidak ada pertanyaan yang\nterlalu kecil di kelas ini.", 9.5, "#C2D5E3", 400, width=240, parent=fid, line_height="145%"))

    # chat panel
    px, py, pw, ph = 956, 104, 456, 540
    c.append(frect(px, py, pw, ph, fill="#263747", radius=28, parent=fid, name="Chat panel"))
    c.append(ftext(px + 26, py + 22, "Obrolan kelas", 15, PAPER, 700, family=DISPLAY, parent=fid))
    c.append(ftext(px + 26, py + 48, "27 siswa · jangan ragu bertanya", 9.5, "#A9BCCB", 400, parent=fid))
    messages = [("AP", "Aisyah", "Pak, kalau a negatif, parabola membuka ke bawah ya?", BLUE), ("RP", "Pak Raka", "Betul. Titik puncaknya jadi nilai maksimum.", AMBER), ("BA", "Bagas", "Berarti contoh bola basket itu a negatif, Pak?", GREEN)]
    for i, (ini, nm, msg, col) in enumerate(messages):
        y = py + 90 + i * 100
        c += favatar(px + 26, y, 32, ini, bg=col, parent=fid)
        c.append(ftext(px + 68, y + 2, nm, 9.5, "#D7E4EE", 600, parent=fid))
        c.append(frect(px + 68, y + 20, pw - 100, 58, fill="#FFFFFF0D", radius=16, parent=fid, name=f"Chat bubble / {nm}"))
        c.append(ftext(px + 82, y + 30, msg, 9.5, "#E6EEF4", 400, width=pw - 128, parent=fid, line_height="145%"))
    c.append(frect(px + 26, py + ph - 58, pw - 52, 44, fill="#FFFFFF0D", radius=22, stroke="#FFFFFF14", parent=fid, name="Chat input"))
    c.append(ftext(px + 44, py + ph - 44, "Tulis pertanyaan...", 9.5, "#91A7B8", 400, parent=fid))
    c.append(ficon("send", px + pw - 58, py + ph - 45, 16, BLUE, 2, parent=fid))

    # whiteboard
    wx, wy, ww, wh = 28, 672, 900, 292
    c.append(frect(wx, wy, ww, wh, fill=PAPER, radius=28, parent=fid, name="Whiteboard", effects=SH_MD))
    c.append(ftext(wx + 28, wy + 22, "Papan tulis", 14, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(wx + ww - 190, wy + 26, "Papan pribadimu · tersimpan", 9, GREEN_DEEP, 600, parent=fid))
    c.append(frect(wx + 28, wy + 56, ww - 56, wh - 84, fill="#FCFBF8", radius=16, stroke=LINE, parent=fid, name="Board canvas"))
    for i in range(1, 8):
        c.append(frect(wx + 28 + (ww - 56) * i / 8, wy + 56, 1, wh - 84, fill="#F1EEE8", parent=fid, name="Grid"))
    for i in range(1, 5):
        c.append(frect(wx + 28, wy + 56 + (wh - 84) * i / 5, ww - 56, 1, fill="#F1EEE8", parent=fid, name="Grid"))
    c.append(ftext(wx + 58, wy + 82, "y = x² − 4x + 3", 27, INK, 600, family=DISPLAY, parent=fid))
    c.append(ftext(wx + 58, wy + 126, "Titik puncak:", 12, MUTED, 500, parent=fid))
    c.append(ftext(wx + 58, wy + 148, "x = 2,  y = −1", 17, BLUE_DEEP, 600, family=DISPLAY, parent=fid))
    c.append(ftext(wx + 58, wy + 184, "Vertex (2, −1)", 11, INK_2, 500, parent=fid))
    # tiny parabola
    pts = []
    for i in range(31):
        t = i / 30
        pxp = wx + 520 + t * 300
        xx = (t - 0.5) * 4
        yy = xx * xx - 1
        pyp = wy + 170 - yy * 18
        pts.append(f"{pxp:.1f} {pyp:.1f}")
    c.append(vector_path("M" + "L".join(pts), 0, 0, 1, 1, fill="none", stroke=CORAL, sw=2.8, parent=fid, name="Board parabola"))

    # book panel
    bx, by, bw, bh = 956, 672, 456, 292
    c.append(frect(bx, by, bw, bh, fill=PAPER, radius=28, parent=fid, name="Book panel", effects=SH_MD))
    c.append(ftext(bx + 26, by + 22, "Buku halaman 78", 13, INK, 700, family=DISPLAY, parent=fid))
    c.append(frect(bx + 26, by + 54, 132, bh - 78, fill=PAPER, radius=8, stroke=LINE, parent=fid, name="Page mini", effects=SH_SM))
    c.append(ftext(bx + 40, by + 68, "BAB 3", 7.5, AMBER_DEEP, 700, parent=fid))
    c.append(ftext(bx + 40, by + 80, "Fungsi Kuadrat", 11, INK, 700, family=DISPLAY, parent=fid))
    for i in range(4):
        c.append(frect(bx + 40, by + 104 + i * 22, 102, 5, fill="#E3DED4", radius=2, parent=fid, name="Text line"))
    c.append(frect(bx + 40, by + 194, 102, 32, fill=BLUE_PALE, radius=4, parent=fid, name="Formula mini"))
    c.append(ftext(bx + 48, by + 202, "f(x)=ax²+bx+c", 7.5, BLUE_DEEP, 600, parent=fid))
    c.append(ftext(bx + 176, by + 58, "Catatan halaman", 9.5, BLUE_DEEP, 700, parent=fid))
    c.append(ftext(bx + 176, by + 80, "Parabola membuka ke atas\njika a > 0. Titik puncak\nmemberi nilai minimum.", 9.5, MUTED, 400, width=250, parent=fid, line_height="150%"))
    bs, _ = fbutton(bx + 176, by + 154, "Buka buku penuh", "soft", parent=fid, w=250, h=40, icon_name="bookOpen", role="student", size=9.5)
    c += bs
    c.append(ftext(bx + 176, by + 214, "Halaman ini tersinkron dengan guru", 8.5, GREEN_DEEP, 600, parent=fid))
    # controls
    c.append(frect(400, 978, 640, 34, fill="#20303F", radius=17, parent=fid, name="Controls"))
    for i, (ic, lab, danger) in enumerate([("mic", "Mikrofon", False), ("camera", "Kamera", False), ("hand", "Angkat tangan", False), ("messageSquare", "Chat", False), ("logOut", "Keluar", True)]):
        x = 420 + i * 118
        c.append(ficon(ic, x, 986, 18, CORAL if danger else "#C7D6E2", 1.9, parent=fid))
        c.append(ftext(x - 14, 1006, lab, 7.5, "#91A7B8", 500, width=60, align="center", parent=fid))
    run(c)


def page_teacher_studio_v2():
    new_page("V2 06 — Teacher studio", background="#2B241C")
    fid = add_screen("Teacher / Studio friendly", 1440, 1024, fill="#2B241C")
    c = [frect(0, 0, 1440, 1024, fill="#2B241C", parent=fid, name="Background")]
    c.append(frect(0, 0, 1440, 80, fill="#352C22", parent=fid, name="Topbar"))
    c += flogo(28, 22, 36, bg=AMBER, fg=INK, parent=fid)
    c.append(ftext(76, 24, "Studio Live · Matematika", 15, PAPER, 700, family=DISPLAY, parent=fid))
    c.append(ftext(76, 48, "X IPA 2 · 32 siswa terdaftar", 9.5, "#C9BAA6", 400, parent=fid))
    c.append(frect(340, 24, 78, 30, fill=CORAL, radius=15, parent=fid, name="Live badge"))
    c.append(ellipse(352, 34, 7, 7, PAPER, parent=fid, name="Live dot"))
    c.append(ftext(364, 31, "LIVE", 9, PAPER, 700, parent=fid))
    c.append(ftext(436, 30, "42 menit", 10, "#C9BAA6", 500, parent=fid))
    c.append(frect(1246, 20, 166, 40, fill=CORAL, radius=20, parent=fid, name="End class"))
    c.append(ficon("circleX", 1260, 32, 16, PAPER, 2, parent=fid))
    c.append(ftext(1284, 32, "Akhiri kelas", 10, PAPER, 700, parent=fid))

    # stage
    sx, sy, sw, sh = 28, 104, 900, 540
    c.append(frect(sx, sy, sw, sh, fill="#3A2F22", radius=28, parent=fid, name="Stage"))
    c.append(ellipse(sx + 300, sy - 20, 320, 320, "#F5A62310", parent=fid, name="Glow"))
    c.append(frect(sx + 80, sy + 52, 470, 396, fill="#55432E", radius=24, parent=fid, name="Teacher video"))
    c.append(ellipse(sx + 250, sy + 128, 140, 140, AMBER, parent=fid, name="Teacher avatar"))
    c.append(ftext(sx + 250, sy + 162, "RP", 36, INK, 700, family=DISPLAY, width=140, align="center", parent=fid))
    c.append(ftext(sx + 220, sy + 292, "Kamera Anda", 17, PAPER, 700, family=DISPLAY, width=190, align="center", parent=fid))
    c.append(ftext(sx + 200, sy + 318, "Raka Pradana · Guru Matematika", 9.5, "#D8C7B1", 400, width=230, align="center", parent=fid))
    c.append(frect(sx + 98, sy + 404, 170, 32, fill="#2B241CCC", radius=12, parent=fid, name="Rec label"))
    c.append(ellipse(sx + 110, sy + 416, 8, 8, CORAL, parent=fid, name="Rec dot"))
    c.append(ftext(sx + 124, sy + 412, "REC · 00:42:18", 9, "#D7E4EE", 600, parent=fid))
    # shared screen
    c.append(frect(sx + 580, sy + 52, 290, 236, fill=PAPER, radius=20, parent=fid, name="Share preview", effects=SH_MD))
    c.append(ftext(sx + 602, sy + 74, "SEDANG DIBAGIKAN", 8, AMBER_DEEP, 700, tracking=0.7, parent=fid))
    c.append(ftext(sx + 602, sy + 96, "Fungsi Kuadrat", 22, INK, 600, family=DISPLAY, parent=fid))
    c.append(ftext(sx + 602, sy + 132, "f(x) = ax² + bx + c", 15, BLUE_DEEP, 600, family=DISPLAY, parent=fid))
    c.append(ftext(sx + 602, sy + 164, "Vertex  (−b/2a, f(−b/2a))", 9.5, MUTED, 400, parent=fid))
    c.append(frect(sx + 602, sy + 194, 246, 66, fill=BLUE_PALE, radius=10, parent=fid, name="Share note"))
    c.append(ftext(sx + 616, sy + 206, "Contoh: y = x² − 4x + 3", 9.5, BLUE_DEEP, 600, parent=fid))
    c.append(ftext(sx + 616, sy + 226, "Vertex (2, −1)", 9.5, INK, 500, parent=fid))
    # engagement strip
    c.append(frect(sx + 580, sy + 308, 290, 140, fill="#FFFFFF0F", radius=20, parent=fid, name="Engagement"))
    c.append(ftext(sx + 602, sy + 326, "Keterlibatan", 10, PAPER, 700, parent=fid))
    for i, (lab, val, pct) in enumerate([("Hadir", "27/32", 84), ("Bertanya", "11 siswa", 42), ("Polling", "78% paham", 78)]):
        y = sy + 350 + i * 30
        c.append(ftext(sx + 602, y, lab, 8.5, "#C9BAA6", 500, parent=fid))
        c.append(ftext(sx + 780, y, val, 8.5, PAPER, 600, width=64, align="right", parent=fid))
        c += fprogress(sx + 602, y + 13, 242, pct, AMBER, "#FFFFFF14", parent=fid, h=4)

    # participant panel
    px, py, pw, ph = 956, 104, 456, 540
    c.append(frect(px, py, pw, ph, fill="#352C22", radius=28, parent=fid, name="Panel"))
    c.append(ftext(px + 26, py + 22, "Siswa di kelas", 15, PAPER, 700, family=DISPLAY, parent=fid))
    c.append(ftext(px + 26, py + 48, "Presensi otomatis · 27 hadir", 9.5, "#C9BAA6", 400, parent=fid))
    for i, (ini, nm, status, col) in enumerate([("AP", "Aisyah Putri", "Hadir", GREEN), ("BA", "Bagas Aditya", "Hadir", GREEN), ("CL", "Citra Lestari", "Hadir", GREEN), ("DS", "Dimas Saputra", "Izin", AMBER), ("EP", "Elang Pratama", "Hadir", GREEN), ("FN", "Fitri Nurhaliza", "Hadir", GREEN), ("GR", "Gilang Ramadhan", "Terlambat", AMBER)]):
        y = py + 86 + i * 46
        c += favatar(px + 26, y, 32, ini, bg=col, parent=fid)
        c.append(ftext(px + 68, y + 1, nm, 9.5, PAPER, 600, parent=fid))
        c.append(ftext(px + 68, y + 18, status, 8, "#C9BAA6", 400, parent=fid))
    c.append(frect(px + 26, py + 416, pw - 52, 96, fill="#F5A62314", radius=18, parent=fid, name="Poll"))
    c.append(ftext(px + 44, py + 432, "Polling cepat", 10, PAPER, 700, parent=fid))
    c.append(ftext(px + 44, py + 452, "Sudah paham titik puncak?", 9, "#C9BAA6", 400, parent=fid))
    c += fprogress(px + 44, py + 474, 280, 78, AMBER, "#FFFFFF14", parent=fid, h=8)
    c.append(ftext(px + 336, py + 470, "78%", 9.5, AMBER, 700, parent=fid))
    c.append(ftext(px + 44, py + 492, "21 paham · 6 masih ragu", 8, "#C9BAA6", 400, parent=fid))

    # whiteboard
    wx, wy, ww, wh = 28, 672, 900, 292
    c.append(frect(wx, wy, ww, wh, fill=PAPER, radius=28, parent=fid, name="Whiteboard", effects=SH_MD))
    c.append(ftext(wx + 28, wy + 22, "Papan tulis bersama", 14, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(wx + ww - 210, wy + 26, "Papan pribadi · tersimpan", 9, GREEN_DEEP, 600, parent=fid))
    c.append(frect(wx + 28, wy + 56, ww - 56, wh - 84, fill="#FCFBF8", radius=16, stroke=LINE, parent=fid, name="Board canvas"))
    for i in range(1, 8):
        c.append(frect(wx + 28 + (ww - 56) * i / 8, wy + 56, 1, wh - 84, fill="#F1EEE8", parent=fid, name="Grid"))
    for i in range(1, 5):
        c.append(frect(wx + 28, wy + 56 + (wh - 84) * i / 5, ww - 56, 1, fill="#F1EEE8", parent=fid, name="Grid"))
    c.append(ftext(wx + 58, wy + 82, "y = x² − 4x + 3", 27, INK, 600, family=DISPLAY, parent=fid))
    c.append(ftext(wx + 58, wy + 126, "x = 4 / 2 = 2", 14, BLUE_DEEP, 600, parent=fid))
    c.append(ftext(wx + 58, wy + 154, "y = 2² − 8 + 3 = −1", 14, INK, 500, parent=fid))
    c.append(ftext(wx + 58, wy + 188, "Vertex (2, −1)", 11, MUTED, 500, parent=fid))

    # book panel
    bx, by, bw, bh = 956, 672, 456, 292
    c.append(frect(bx, by, bw, bh, fill=PAPER, radius=28, parent=fid, name="Book panel", effects=SH_MD))
    c.append(ftext(bx + 26, by + 22, "Buku SIBI · halaman 78", 12, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(bx + 26, by + 54, "Halaman ini sedang ditampilkan ke siswa.", 9.5, MUTED, 400, parent=fid))
    c.append(frect(bx + 26, by + 82, 132, 174, fill=PAPER, radius=8, stroke=LINE, parent=fid, name="Page mini", effects=SH_SM))
    c.append(ftext(bx + 40, by + 96, "BAB 3", 7.5, AMBER_DEEP, 700, parent=fid))
    c.append(ftext(bx + 40, by + 108, "Fungsi Kuadrat", 10.5, INK, 700, family=DISPLAY, parent=fid))
    for i in range(4):
        c.append(frect(bx + 40, by + 132 + i * 20, 102, 5, fill="#E3DED4", radius=2, parent=fid, name="Text line"))
    c.append(ftext(bx + 176, by + 88, "Aksi guru", 9.5, BLUE_DEEP, 700, parent=fid))
    bs, _ = fbutton(bx + 176, by + 112, "Jadikan bahan ajar", "soft", parent=fid, w=250, h=40, icon_name="wand", role="teacher", size=9.5)
    c += bs
    bs, _ = fbutton(bx + 176, by + 160, "Buka halaman 79", "outline", parent=fid, w=250, h=40, icon_name="bookOpen", role="teacher", size=9.5)
    c += bs
    c.append(ftext(bx + 176, by + 216, "Siswa juga melihat halaman ini.", 8.5, GREEN_DEEP, 600, parent=fid))
    # controls
    c.append(frect(430, 978, 580, 34, fill="#2B241C", radius=17, parent=fid, name="Controls"))
    for i, (ic, lab, danger) in enumerate([("mic", "Mikrofon", False), ("camera", "Kamera", False), ("screenShare", "Bagikan", False), ("circlePlay", "Rekam", False), ("logOut", "Akhiri", True)]):
        x = 450 + i * 110
        c.append(ficon(ic, x, 986, 18, CORAL if danger else "#C9BAA6", 1.9, parent=fid))
        c.append(ftext(x - 14, 1006, lab, 7.5, "#A99884", 500, width=60, align="center", parent=fid))
    run(c)


def page_teacher_home_v2():
    new_page("V2 07 — Teacher home", background=CREAM)
    fid = add_screen("Teacher / Home friendly", 1440, 1024, fill=CREAM)
    c = fpage("teacher", "Halo, Pak Raka", 0, TEACHER_NAV2, fid, subtitle="Senin, 10 November · Semester Ganjil", search="Cari siswa atau kelas...", avatar_text="RP")

    hx, hy, hw, hh = 252, 112, 756, 250
    c.append(frect(hx, hy, hw, hh, fill=AMBER, radius=30, parent=fid, name="Hero / teacher"))
    c.append(ellipse(hx + 520, hy - 80, 330, 330, "#FFFFFF14", parent=fid, name="Hero blob"))
    c.append(ftext(hx + 34, hy + 30, "Selamat pagi, Pak Raka", 12, "#5C3A06", 500, parent=fid))
    c.append(ftext(hx + 34, hy + 50, "Kelas hari ini siap dimulai.", 31, INK, 600, family=DISPLAY, parent=fid, tracking=-0.5))
    c.append(ftext(hx + 34, hy + 100, "3 kelas, 2 tugas menunggu dinilai. Tidak perlu semuanya sekaligus.", 11.5, "#6B4710", 400, width=470, parent=fid, line_height="155%"))
    bs, _ = fbutton(hx + 34, hy + 150, "Masuk studio live", "dark", parent=fid, w=178, h=44, icon_name="video", role="teacher", size=11)
    c += bs
    bs, _ = fbutton(hx + 226, hy + 150, "Lihat agenda", "ghost", parent=fid, w=150, h=44, icon_name="calendarDays", role="teacher", size=11)
    c += bs
    for i, (lab, val) in enumerate([("Siswa diampu", "32"), ("Kelas aktif", "3"), ("Rata-rata", "84")]):
        x = hx + 34 + i * 150
        c.append(ftext(x, hy + 212, lab, 9, "#6B4710", 500, parent=fid))
        c.append(ftext(x, hy + 228, val, 16, INK, 700, family=DISPLAY, parent=fid))
    # simple illustration
    c.append(ellipse(hx + 596, hy + 70, 130, 130, "#FFFFFF20", parent=fid, name="Art halo"))
    c.append(frect(hx + 616, hy + 90, 92, 104, fill="#FFFFFF2E", radius=18, parent=fid, name="Art card"))
    c.append(ficon("presentation", hx + 640, hy + 114, 44, INK, 1.4, parent=fid))
    c.append(frect(hx + 632, hy + 166, 60, 22, fill=INK, radius=11, parent=fid, name="Art chip"))
    c.append(ftext(hx + 644, hy + 171, "LIVE", 7, AMBER, 700, parent=fid))

    # today's focus
    nx, ny, nw, nh = 1032, 112, 376, 250
    c.append(fcard(nx, ny, nw, nh, parent=fid, radius=30, name="Focus teacher"))
    c.append(ficon("sun", nx + 26, ny + 24, 22, AMBER, 1.9, parent=fid))
    c.append(ftext(nx + 56, ny + 24, "Fokus hari ini", 17, INK, 700, family=DISPLAY, parent=fid))
    for i, (label, desc) in enumerate([("Mulai kelas tepat waktu", "Studio sudah siap"), ("Nilai 2 tugas", "Siswa menunggu"), ("Istirahat cukup", "Jangan lupa makan")]):
        y = ny + 72 + i * 54
        c.append(frect(nx + 26, y, 324, 44, fill="#FAF9F6", radius=14, parent=fid, name=f"Focus / {label}"))
        c.append(ficon("checkCircle" if i == 0 else "clock" if i == 1 else "heart", nx + 40, y + 13, 17, GREEN_DEEP if i == 0 else AMBER_DEEP if i == 1 else CORAL, 1.9, parent=fid))
        c.append(ftext(nx + 68, y + 9, label, 9.5, INK, 600, parent=fid))
        c.append(ftext(nx + 68, y + 25, desc, 8, MUTED, 400, parent=fid))

    # performance
    c.append(fcard(252, 396, 756, 286, parent=fid, radius=28, name="Performance teacher"))
    c.append(ftext(282, 422, "Performa kelas", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(282, 450, "Rata-rata 8 pekan terakhir", 10.5, MUTED, 400, parent=fid))
    c.append(ftext(920, 428, "+6 poin", 10, GREEN_DEEP, 700, width=60, align="right", parent=fid))
    c += soft_line(300, 506, 660, 120, [78, 82, 80, 86, 84, 89, 91, 88], color=AMBER, labels=[f"P{i+1}" for i in range(8)], parent=fid)
    c.append(ftext(282, 650, "Kelas stabil di atas target. Pertahankan ritme, bukan menambah beban.", 9.5, MUTED, 400, parent=fid))

    # quick actions
    c.append(fcard(1032, 396, 376, 286, parent=fid, radius=28, name="Quick actions"))
    c.append(ftext(1058, 422, "Aksi cepat", 18, INK, 700, family=DISPLAY, parent=fid))
    actions = [("Mulai kelas", "video", BLUE_SOFT, BLUE_DEEP), ("Nilai tugas", "clipboardList", GREEN_SOFT, GREEN_DEEP), ("Ekstrak PDF", "fileScan", AMBER_SOFT, AMBER_DEEP), ("Susun RPP", "notebookPen", LAVENDER_SOFT, LAVENDER_DEEP)]
    for i, (label, ic, bg, fg) in enumerate(actions):
        x = 1058 + (i % 2) * 166
        y = 458 + (i // 2) * 96
        c.append(frect(x, y, 150, 82, fill="#FAF9F6", radius=18, parent=fid, name=f"Quick / {label}"))
        c.append(frect(x + 14, y + 14, 34, 34, fill=bg, radius=11, parent=fid, name="Quick icon"))
        c.append(ficon(ic, x + 23, y + 23, 16, fg, 1.9, parent=fid))
        c.append(ftext(x + 14, y + 56, label, 9.5, INK, 600, parent=fid))

    # agenda
    c.append(fcard(252, 706, 548, 266, parent=fid, radius=28, name="Agenda"))
    c.append(ftext(282, 732, "Agenda hari ini", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(282, 760, "Tiga kelas, semuanya di ruang yang sama.", 10, MUTED, 400, parent=fid))
    agenda = [("07.30", "Matematika", "X IPA 2 · R-204"), ("09.15", "Matematika", "X IPS 1 · R-208"), ("12.45", "Informatika", "X IPA 2 · Lab")]
    for i, (time, subj, cls) in enumerate(agenda):
        y = 794 + i * 52
        c.append(ftext(282, y + 8, time, 10, MUTED, 600, parent=fid))
        c.append(frect(334, y + 4, 3, 32, fill=AMBER, radius=2, parent=fid, name="Agenda bar"))
        c.append(ftext(352, y + 6, subj, 10.5, INK, 600, parent=fid))
        c.append(ftext(352, y + 24, cls, 8.5, MUTED, 400, parent=fid))

    # grading
    c.append(fcard(824, 706, 584, 266, parent=fid, radius=28, name="Grading"))
    c.append(ftext(854, 732, "Menunggu dinilai", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(854, 760, "Dua pengumpulan, tidak perlu buru-buru.", 10, MUTED, 400, parent=fid))
    for i, (nm, task, time, ini, bg) in enumerate([("Bagas Aditya", "Latihan Bab 3", "07.12", "BA", BLUE), ("Citra Lestari", "Latihan Bab 3", "06.45", "CL", GREEN)]):
        y = 794 + i * 66
        c += favatar(854, y, 36, ini, bg=bg, parent=fid)
        c.append(ftext(902, y + 2, nm, 10, INK, 600, parent=fid))
        c.append(ftext(902, y + 20, f"{task} · {time}", 8.5, MUTED, 400, parent=fid))
        bs, _ = fbutton(1284, y + 6, "Nilai", "soft", parent=fid, w=82, h=34, role="teacher", size=9)
        c += bs
    run(c)


def page_parent_v2():
    new_page("V2 08 — Parent", background=CREAM)
    fid = add_screen("Parent / Home friendly", 1440, 1024, fill=CREAM)
    c = fpage("parent", "Halo, Bu Sari", 0, PARENT_NAV2, fid, subtitle="Pendampingan Aisyah · X IPA 2", search="Cari laporan...", avatar_text="SW")

    hx, hy, hw, hh = 252, 112, 1128, 244
    c.append(frect(hx, hy, hw, hh, fill=GREEN, radius=30, parent=fid, name="Hero / parent"))
    c.append(ellipse(hx + 840, hy - 110, 380, 380, "#FFFFFF14", parent=fid, name="Hero blob"))
    c.append(ftext(hx + 34, hy + 30, "Laporan mingguan · 10 November", 10.5, "#D8F7E9", 600, parent=fid))
    c.append(ftext(hx + 34, hy + 54, "Aisyah tumbuh dengan ritme yang sehat.", 30, PAPER, 600, family=DISPLAY, parent=fid, tracking=-0.4))
    c.append(ftext(hx + 34, hy + 104, "Nilai stabil, kehadiran baik, dan dia aktif bertanya. Tidak ada yang perlu dikhawatirkan.", 11.5, "#E3FFF2", 400, width=650, parent=fid, line_height="155%"))
    for i, lab in enumerate(["Nilai aman", "Kehadiran baik", "Partisipasi aktif"]):
        ps, _ = fpill(hx + 34 + i * 146, hy + 162, lab, "#FFFFFF1E", PAPER, parent=fid, dot=True, size=9)
        c += ps
    # child mini
    c.append(frect(hx + 838, hy + 28, 258, 186, fill="#FFFFFFE8", radius=22, parent=fid, name="Child card"))
    c += favatar(hx + 858, hy + 48, 50, "AP", bg=GREEN_DEEP, parent=fid)
    c.append(ftext(hx + 920, hy + 48, "Aisyah Putri", 13, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(hx + 920, hy + 70, "X IPA 2", 9, MUTED, 400, parent=fid))
    c.append(ftext(hx + 920, hy + 86, "Wali: Pak Raka", 9, MUTED, 400, parent=fid))
    c.append(ftext(hx + 858, hy + 126, "Rata-rata", 8.5, MUTED, 500, parent=fid))
    c.append(ftext(hx + 858, hy + 142, "88", 24, GREEN_DEEP, 700, family=DISPLAY, parent=fid))
    c.append(ftext(hx + 958, hy + 126, "Peringkat", 8.5, MUTED, 500, parent=fid))
    c.append(ftext(hx + 958, hy + 142, "#3", 24, GREEN_DEEP, 700, family=DISPLAY, parent=fid))
    c.append(ftext(hx + 858, hy + 178, "Unduh ringkasan  →", 9, GREEN_DEEP, 700, parent=fid))

    # numbers inline no cards
    c.append(ftext(252, 400, "Ringkasan minggu ini", 17, INK, 700, family=DISPLAY, parent=fid))
    metrics = [("Rata-rata nilai", "88", "+4 dari bulan lalu"), ("Kehadiran", "96%", "48 sesi tercatat"), ("Jam belajar", "6,4 jam", "7 hari terakhir")]
    for i, (lab, val, hint) in enumerate(metrics):
        x = 252 + i * 280
        c.append(ftext(x, 436, lab, 10, MUTED, 500, parent=fid))
        c.append(ftext(x, 454, val, 28, INK, 700, family=DISPLAY, parent=fid))
        c.append(ftext(x, 490, hint, 9, MUTED, 400, parent=fid))
        if i < 2:
            c.append(frect(x + 250, 440, 1, 56, fill=LINE, parent=fid, name="Metric divider"))

    # performance
    c.append(fcard(252, 528, 728, 266, parent=fid, radius=28, name="Performance parent"))
    c.append(ftext(282, 554, "Perkembangan nilai", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(282, 582, "Dibandingkan rata-rata kelas", 10.5, MUTED, 400, parent=fid))
    c.append(ftext(894, 560, "Di atas rata-rata", 9.5, GREEN_DEEP, 700, width=60, align="right", parent=fid))
    c += soft_line(300, 630, 632, 112, [78, 82, 80, 86, 84, 89, 91, 88], color=GREEN, labels=[f"P{i+1}" for i in range(8)], parent=fid)
    c.append(ftext(282, 762, "Aisyah konsisten 6–9 poin di atas rata-rata kelas.", 9.5, MUTED, 400, parent=fid))

    # attendance
    c.append(fcard(1004, 528, 376, 266, parent=fid, radius=28, name="Attendance"))
    c.append(ftext(1030, 554, "Kehadiran", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(1030, 582, "48 sesi semester ini", 10, MUTED, 400, parent=fid))
    c += soft_donut(1192, 668, 62, [{"label": "Hadir", "value": 42, "color": GREEN}, {"label": "Terlambat", "value": 3, "color": AMBER}, {"label": "Izin", "value": 2, "color": BLUE}, {"label": "Alfa", "value": 1, "color": CORAL}], parent=fid, thickness=18, center_value="96%", center_label="hadir")
    for i, (lab, val, col) in enumerate([("Hadir", "42", GREEN), ("Terlambat", "3", AMBER), ("Izin", "2", BLUE), ("Alfa", "1", CORAL)]):
        x = 1030 + (i % 2) * 150
        y = 740 + (i // 2) * 24
        c.append(ellipse(x, y + 3, 7, 7, col, parent=fid, name="Legend dot"))
        c.append(ftext(x + 14, y, f"{lab} {val}", 9, MUTED, 500, parent=fid))

    # teacher note
    c.append(fcard(252, 814, 728, 158, parent=fid, radius=28, name="Teacher note"))
    c += favatar(282, 840, 42, "RP", bg=AMBER, parent=fid)
    c.append(ftext(336, 840, "Catatan Pak Raka", 11, INK, 700, parent=fid))
    c.append(ftext(336, 858, "Matematika · 2 hari lalu", 8.5, MUTED, 400, parent=fid))
    c.append(ftext(336, 884, "“Aisyah sangat aktif saat diskusi fungsi kuadrat. Pertahankan rasa ingin tahunya.”", 11, INK_2, 400, width=600, parent=fid, line_height="145%"))
    c.append(ftext(336, 936, "Balas catatan  →", 9, GREEN_DEEP, 700, parent=fid))

    # tasks simple
    c.append(fcard(1004, 814, 376, 158, parent=fid, radius=28, name="Tasks"))
    c.append(ftext(1030, 840, "Tugas terdekat", 16, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(1030, 872, "Latihan Bab 3", 10, INK, 600, parent=fid))
    c.append(ftext(1030, 888, "Matematika · besok", 8.5, MUTED, 400, parent=fid))
    c.append(ftext(1030, 916, "Proyek Statistika", 10, INK, 600, parent=fid))
    c.append(ftext(1030, 932, "Matematika · 9 hari lagi", 8.5, MUTED, 400, parent=fid))
    run(c)
