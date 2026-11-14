"""Live-class and teacher studio screens."""
from generate_ui import *


DARK = "#071426"
DARK_2 = "#0C1B33"
DARK_3 = "#0F213D"


def live_topbar(fid, title, subtitle, role="student", teacher=False):
    c = [rect(0, 0, 1440, 64, DARK_2, 0, parent=fid, name="Live topbar"),
         rect(0, 63, 1440, 1, "#FFFFFF12", 0, parent=fid, name="Topbar line")]
    c += logo_mark(20, 16, 32, bg=AMBER_500 if teacher else BLUE_600, fg=INK if teacher else WHITE, parent=fid, radius=10)
    c.append(icon("chevronLeft", 68, 22, 20, "#B8C8DF", 2, parent=fid))
    c.append(text(96, 10, title, 13, WHITE, 700, family=DISPLAY, parent=fid))
    c.append(text(96, 30, subtitle, 8.5, "#91A7C2", 400, parent=fid))
    c.append(rect(284, 18, 72, 28, RED_600, 14, parent=fid, name="Live badge"))
    c.append(ellipse(294, 27, 7, 7, WHITE, parent=fid))
    c.append(text(306, 25, "LIVE", 8.5, WHITE, 700, tracking=0.5, parent=fid))
    c.append(text(370, 24, "00:42:18", 10, WHITE, 600, parent=fid))
    c.append(text(470, 24, "·  27 siswa", 9.5, "#9FB2CA", 500, parent=fid))
    c.append(icon("wifi", 1230, 22, 17, GREEN_600, 1.9, parent=fid))
    c.append(text(1254, 24, "Stabil", 8.5, "#B8C8DF", 500, parent=fid))
    if teacher:
        c.append(rect(1300, 14, 118, 36, RED_600, 18, parent=fid, name="End class"))
        c.append(icon("circleX", 1314, 23, 15, WHITE, 2, parent=fid))
        c.append(text(1336, 24, "Akhiri kelas", 9, WHITE, 700, parent=fid))
    else:
        c.append(rect(1300, 14, 118, 36, "#FFFFFF12", 18, stroke="#FFFFFF22", parent=fid, name="Leave"))
        c.append(icon("logOut", 1314, 23, 15, "#D9E5F5", 2, parent=fid))
        c.append(text(1336, 24, "Keluar", 9, "#D9E5F5", 700, parent=fid))
    return c


def whiteboard(fid, x, y, w, h, teacher=False):
    c = [card(x, y, w, h, parent=fid, fill=WHITE, radius=20, name="Whiteboard card"),
         rect(x + 18, y + 18, 42, h - 36, "#F5F8FC", 12, parent=fid, name="Whiteboard toolbar")]
    tools = ["penLine", "highlighter", "eraser", "undo", "stickyNote"]
    if teacher:
        tools.append("more")
    for i, ic in enumerate(tools):
        ty = y + 28 + i * 42
        c.append(icon(ic, x + 29, ty, 19, BLUE_700 if i == 0 else MUTED, 1.8, parent=fid))
    c.append(text(x + 78, y + 20, "Papan tulis bersama", 11, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(x + w - 116, y + 22, "Pribadi · tersimpan", 8, GREEN_600, 600, parent=fid))
    # grid canvas
    gx, gy, gw, gh = x + 78, y + 50, w - 98, h - 68
    c.append(rect(gx, gy, gw, gh, "#FBFCFE", 10, stroke="#EDF1F7", parent=fid, name="Board canvas"))
    for i in range(1, 9):
        c.append(rect(gx + gw * i / 9, gy, 1, gh, "#EDF1F7", 0, parent=fid, name="Board grid"))
    for i in range(1, 6):
        c.append(rect(gx, gy + gh * i / 6, gw, 1, "#EDF1F7", 0, parent=fid, name="Board grid"))
    # hand-written math
    c.append(text(gx + 26, gy + 24, "y = x² − 4x + 3", 25, INK, 600, family=DISPLAY, parent=fid))
    c.append(text(gx + 26, gy + 64, "Titik puncak  →  x = −b / 2a", 14, BLUE_700, 600, parent=fid))
    c.append(text(gx + 26, gy + 92, "x = 4 / 2 = 2,  y = 2² − 8 + 3 = −1", 13, INK, 500, parent=fid))
    c.append(text(gx + 26, gy + 120, "Vertex (2, −1) · akar di x = 1 dan x = 3", 11, MUTED, 400, parent=fid))
    # small parabola
    pts = []
    for i in range(31):
        t = i / 30
        px = gx + gw * 0.57 + t * gw * 0.34
        xx = (t - 0.5) * 4
        yy = xx * xx - 1
        py = gy + gh * 0.64 - yy * 20
        pts.append(f"{px:.1f} {py:.1f}")
    c.append(vector_path("M" + "L".join(pts), 0, 0, 1, 1, fill="none", stroke=RED_600, sw=2.5, parent=fid, name="Board parabola"))
    # sticky note
    c.append(rect(gx + gw - 180, gy + 18, 152, 88, "#FFF1BD", 8, parent=fid, name="Sticky note", effects=SHADOW_SM))
    c.append(text(gx + gw - 166, gy + 32, "Catatan guru", 8.5, AMBER_700, 700, parent=fid))
    c.append(text(gx + gw - 166, gy + 50, "Ingat: a > 0 → grafik\nmembuka ke atas.", 10, "#5C4A18", 500, width=124, parent=fid, line_height="135%"))
    # pen cursor
    c.append(icon("mousePointer", gx + gw * 0.61, gy + gh * 0.56, 18, INK, 2, parent=fid))
    return c


def book_panel(fid, x, y, w, h, teacher=False):
    c = [card(x, y, w, h, parent=fid, fill=WHITE, radius=20, name="Book panel")]
    c.append(icon("bookOpen", x + 18, y + 18, 18, BLUE_700, 1.8, parent=fid))
    c.append(text(x + 44, y + 17, "Buku SIBI · halaman 78", 10.5, INK, 700, parent=fid))
    c.append(icon("maximize", x + w - 34, y + 20, 15, MUTED, 1.9, parent=fid))
    # page mini
    c.append(rect(x + 18, y + 52, 150, h - 70, SURFACE, 5, stroke=LINE, parent=fid, name="Book page mini", effects=SHADOW_SM))
    c.append(text(x + 32, y + 66, "BAB 3", 7.5, AMBER_700, 700, tracking=0.6, parent=fid))
    c.append(text(x + 32, y + 78, "Fungsi Kuadrat", 12, INK, 700, family=DISPLAY, parent=fid))
    for i in range(3):
        c.append(rect(x + 32, y + 102 + i * 34, 118, 5, "#D8E2EF", 2, parent=fid))
        c.append(rect(x + 32, y + 112 + i * 34, 90, 4, "#E7EDF5", 2, parent=fid))
    c.append(rect(x + 32, y + 214, 118, 54, BLUE_50, 5, parent=fid))
    c.append(text(x + 42, y + 224, "f(x) = ax² + bx + c", 9, BLUE_800, 600, parent=fid))
    # reader text
    c.append(text(x + 188, y + 56, "Halaman 78", 9.5, BLUE_700, 700, parent=fid))
    c.append(text(x + 188, y + 78, "Fungsi kuadrat membentuk parabola. Nilai a menentukan arah bukaan, sedangkan vertex memberi nilai optimum.", 9.5, MUTED, 400, width=w - 210, parent=fid, line_height="150%"))
    c.append(text(x + 188, y + 140, "Progres baca", 8, MUTED, 600, parent=fid))
    c += progress_bar(x + 188, y + 156, w - 210, 68, BLUE_600, parent=fid, h=6)
    c.append(text(x + 188, y + 176, "68% · 12 menit tersisa", 8, MUTED, 400, parent=fid))
    if teacher:
        c.append(rect(x + 188, y + 202, w - 210, 34, AMBER_100, 10, parent=fid, name="Teacher action"))
        c.append(icon("wand", x + 200, y + 211, 15, AMBER_700, 1.8, parent=fid))
        c.append(text(x + 222, y + 211, "Jadikan bahan ajar", 8.5, AMBER_700, 700, parent=fid))
    else:
        c.append(rect(x + 188, y + 202, 104, 32, BLUE_50, 10, parent=fid, name="Ask AI"))
        c.append(icon("sparkles", x + 200, y + 210, 14, BLUE_700, 1.8, parent=fid))
        c.append(text(x + 220, y + 211, "Tanya AI", 8.5, BLUE_800, 700, parent=fid))
    return c


def controls(fid, teacher=False):
    c = []
    if teacher:
        x0 = 500
        c.append(rect(x0, 962, 440, 48, "#0C1B33E8", 24, stroke="#FFFFFF18", parent=fid, name="Control bar", effects=SHADOW_MD))
        controls_list = [("mic", "Mute", False), ("camera", "Kamera", False), ("screenShare", "Bagikan", False), ("circlePlay", "Rekam", True), ("more", "Lainnya", False)]
        for i, (ic, lab, active) in enumerate(controls_list):
            x = x0 + 16 + i * 82
            c.append(rect(x, 972, 42, 28, RED_600 if active else "#FFFFFF12", 14, parent=fid, name=f"Control / {lab}"))
            c.append(icon(ic, x + 13, 978, 16, WHITE, 1.9, parent=fid))
            c.append(text(x - 6, 1000, lab, 7, "#AFC2DA", 500, width=54, align="center", parent=fid))
        return c
    x0 = 400
    c.append(rect(x0, 962, 520, 48, "#0C1B33E8", 24, stroke="#FFFFFF18", parent=fid, name="Control bar", effects=SHADOW_MD))
    controls_list = [("mic", "Mikrofon", False), ("camera", "Kamera", False), ("hand", "Angkat tangan", False), ("messageSquare", "Chat", False), ("logOut", "Keluar", True)]
    for i, (ic, lab, active) in enumerate(controls_list):
        x = x0 + 18 + i * 98
        c.append(rect(x, 972, 40, 28, RED_600 if active else "#FFFFFF12", 14, parent=fid, name=f"Control / {lab}"))
        c.append(icon(ic, x + 12, 978, 16, WHITE, 1.9, parent=fid))
        c.append(text(x - 12, 1000, lab, 7, "#AFC2DA", 500, width=64, align="center", parent=fid))
    return c


def page_live_student():
    new_page("05 — Live class", background=DARK)
    fid = add_screen("Student / Live class", 1440, 1024, fill=DARK)
    c = [rect(0, 0, 1440, 1024, DARK, 0, parent=fid, name="Live background")]
    c += live_topbar(fid, "Matematika · Bab 3: Fungsi Kuadrat", "X IPA 2 · Pak Raka Pradana", teacher=False)

    # stage
    sx, sy, sw, sh = 24, 80, 940, 560
    c.append(rect(sx, sy, sw, sh, gradient=["#101E35", "#123055", "#0D47A1"], radius=22, parent=fid, name="Stage"))
    c.append(ellipse(sx + 340, sy + 50, 280, 280, "#FFFFFF08", parent=fid, name="Stage orbit"))
    c.append(ellipse(sx + 620, sy + 210, 230, 230, "#FFB3000D", parent=fid, name="Stage glow"))
    # teacher video placeholder
    c.append(rect(sx + 80, sy + 42, 500, 430, gradient=["#1D3557", "#234D7D", "#153A66"], radius=20, parent=fid, name="Teacher video", stroke="#FFFFFF18", sw=1))
    c.append(ellipse(sx + 278, sy + 136, 126, 126, "#FFFFFF14", parent=fid, name="Teacher avatar ring", stroke="#FFFFFF28", sw=2))
    c.append(ellipse(sx + 294, sy + 152, 94, 94, AMBER_500, parent=fid, name="Teacher avatar"))
    c.append(text(sx + 294, sy + 178, "RP", 31, INK, 700, family=DISPLAY, width=94, align="center", parent=fid))
    c.append(text(sx + 250, sy + 278, "Pak Raka Pradana", 16, WHITE, 700, family=DISPLAY, width=160, align="center", parent=fid))
    c.append(text(sx + 240, sy + 302, "Guru Matematika · sedang mengajar", 9, "#C6D8EC", 400, width=180, align="center", parent=fid))
    # small stat pills
    for i, (lab, ic) in enumerate([("Video HD", "video"), ("Audio jernih", "volume"), ("27 siswa", "users")]):
        c.append(rect(sx + 96 + i * 126, sy + 336, 116, 28, "#FFFFFF12", 14, parent=fid, name=f"Video info / {lab}"))
        c.append(icon(ic, sx + 108 + i * 126, sy + 342, 13, "#D9E8F8", 1.8, parent=fid))
        c.append(text(sx + 128 + i * 126, sy + 343, lab, 8, "#D9E8F8", 500, parent=fid))
    # slide preview
    c.append(rect(sx + 620, sy + 42, 292, 192, "#FFFFFFF2", 16, parent=fid, name="Slide preview", effects=SHADOW_MD))
    c.append(text(sx + 640, sy + 60, "FUNGSI KUADRAT", 7.5, AMBER_700, 700, tracking=0.8, parent=fid))
    c.append(text(sx + 640, sy + 76, "y = ax² + bx + c", 22, INK, 600, family=DISPLAY, parent=fid))
    c.append(text(sx + 640, sy + 108, "a > 0  →  membuka ke atas", 9, MUTED, 500, parent=fid))
    c.append(text(sx + 640, sy + 126, "a < 0  →  membuka ke bawah", 9, MUTED, 500, parent=fid))
    # mini parabola in slide
    pts = []
    for i in range(25):
        t = i / 24
        px = sx + 650 + t * 230
        xx = (t - 0.5) * 5
        yy = xx * xx - 2.2
        py = sy + 200 - yy * 10
        pts.append(f"{px:.1f} {py:.1f}")
    c.append(vector_path("M" + "L".join(pts), 0, 0, 1, 1, fill="none", stroke=BLUE_600, sw=2, parent=fid, name="Slide parabola"))
    # teacher note card
    c.append(rect(sx + 620, sy + 254, 292, 148, "#FFFFFF0F", 16, stroke="#FFFFFF18", parent=fid, name="Lesson note"))
    c.append(icon("target", sx + 638, sy + 272, 17, AMBER_500, 1.8, parent=fid))
    c.append(text(sx + 664, sy + 270, "Target sesi ini", 9.5, WHITE, 700, parent=fid))
    c.append(text(sx + 638, sy + 296, "Siswa dapat menentukan vertex", 9, "#C9DAEE", 400, parent=fid))
    c.append(text(sx + 638, sy + 312, "dan menggambar sketsa parabola", 9, "#C9DAEE", 400, parent=fid))
    c.append(text(sx + 638, sy + 328, "dari bentuk umum fungsi kuadrat.", 9, "#C9DAEE", 400, parent=fid))
    # top overlay
    c.append(rect(sx + 100, sy + 444, 220, 36, "#071426C8", 12, parent=fid, name="Video label"))
    c.append(ellipse(sx + 112, sy + 456, 8, 8, RED_600, parent=fid))
    c.append(text(sx + 126, sy + 452, "Kamera guru · disiarkan", 8.5, "#D9E5F5", 600, parent=fid))
    # chat panel
    px, py, pw, ph = 980, 80, 436, 560
    c.append(rect(px, py, pw, ph, DARK_3, 22, stroke="#FFFFFF12", parent=fid, name="Chat panel"))
    c.append(text(px + 22, py + 18, "Diskusi kelas", 12.5, WHITE, 700, family=DISPLAY, parent=fid))
    c.append(text(px + 22, py + 39, "27 siswa · 4 pertanyaan baru", 8.5, "#91A7C2", 400, parent=fid))
    for i, (lab, active) in enumerate([("Chat", True), ("Peserta", False), ("Polling", False)]):
        x = px + 22 + i * 78
        c.append(rect(x, py + 60, 70, 28, "#FFFFFF14" if active else "#FFFFFF06", 14, parent=fid, name=f"Panel tab / {lab}"))
        c.append(text(x, py + 68, lab, 8.5, WHITE if active else "#91A7C2", 700 if active else 500, width=70, align="center", parent=fid))
    messages = [
        ("AP", "Aisyah", "Pak, kalau a negatif berarti parabola membuka ke bawah ya?", BLUE_600),
        ("RP", "Pak Raka", "Betul, Aisyah. Titik puncaknya jadi nilai maksimum.", AMBER_500),
        ("BA", "Bagas", "Grafik y = x² − 4x + 3 titik puncaknya di (2, −1)?", GREEN_600),
    ]
    for i, (ini, nm, msg, col) in enumerate(messages):
        my = py + 112 + i * 94
        c += avatar(px + 22, my, 30, ini, bg=col, parent=fid)
        c.append(text(px + 62, my - 2, nm, 8.5, "#C9DAEE", 700, parent=fid))
        bubble_w = pw - 92
        c.append(rect(px + 62, my + 14, bubble_w, 50, "#FFFFFF0D", 12, parent=fid, name=f"Chat / {nm}"))
        c.append(text(px + 74, my + 22, msg, 8.4, "#E3ECF8", 400, width=bubble_w - 24, parent=fid, line_height="135%"))
    c.append(rect(px + 22, py + ph - 52, pw - 44, 34, "#FFFFFF0C", 17, stroke="#FFFFFF12", parent=fid, name="Chat input"))
    c.append(text(px + 38, py + ph - 42, "Tulis pertanyaan...", 8.5, "#7F96B4", 400, parent=fid))
    c.append(icon("send", px + pw - 48, py + ph - 43, 15, BLUE_500, 1.9, parent=fid))
    # whiteboard and book
    c += whiteboard(fid, 24, 660, 940, 300, teacher=False)
    c += book_panel(fid, 980, 660, 436, 300, teacher=False)
    c += controls(fid, teacher=False)
    run(c)


def page_teacher_studio():
    new_page("06 — Teacher studio", background=DARK)
    fid = add_screen("Teacher / Studio", 1440, 1024, fill=DARK)
    c = [rect(0, 0, 1440, 1024, DARK, 0, parent=fid, name="Studio background")]
    c += live_topbar(fid, "Studio Live · Matematika Bab 3", "X IPA 2 · 32 siswa terdaftar", teacher=True)

    sx, sy, sw, sh = 24, 80, 940, 560
    c.append(rect(sx, sy, sw, sh, gradient=["#171B1A", "#2B2212", "#4A2E10"], radius=22, parent=fid, name="Stage"))
    c.append(ellipse(sx + 360, sy + 20, 320, 320, "#FFB30010", parent=fid, name="Stage glow"))
    c.append(rect(sx + 80, sy + 42, 500, 430, gradient=["#2A2115", "#5A3B16", "#3B2A12"], radius=20, parent=fid, name="Teacher video", stroke="#FFB30022", sw=1))
    c.append(ellipse(sx + 278, sy + 126, 140, 140, "#FFFFFF12", parent=fid, name="Teacher avatar ring", stroke="#FFB30033", sw=2))
    c.append(ellipse(sx + 296, sy + 144, 104, 104, AMBER_500, parent=fid, name="Teacher avatar"))
    c.append(text(sx + 296, sy + 174, "RP", 34, INK, 700, family=DISPLAY, width=104, align="center", parent=fid))
    c.append(text(sx + 246, sy + 278, "Kamera Anda", 15, WHITE, 700, family=DISPLAY, width=168, align="center", parent=fid))
    c.append(text(sx + 246, sy + 302, "Raka Pradana · Guru Matematika", 9, "#D7C8A9", 400, width=168, align="center", parent=fid))
    c.append(rect(sx + 100, sy + 444, 150, 34, "#071426CF", 12, parent=fid, name="Camera label"))
    c.append(ellipse(sx + 112, sy + 456, 8, 8, RED_600, parent=fid))
    c.append(text(sx + 126, sy + 452, "REC · 00:42:18", 8.5, "#D9E5F5", 600, parent=fid))
    # share preview
    c.append(rect(sx + 620, sy + 42, 292, 200, "#FFFFFFF5", 16, parent=fid, name="Share preview", effects=SHADOW_MD))
    c.append(text(sx + 640, sy + 58, "SEDANG DIBAGIKAN", 7.5, AMBER_700, 700, tracking=0.8, parent=fid))
    c.append(text(sx + 640, sy + 78, "Fungsi Kuadrat", 20, INK, 600, family=DISPLAY, parent=fid))
    c.append(text(sx + 640, sy + 106, "Pertemuan 3 · halaman 78", 9, MUTED, 500, parent=fid))
    c.append(rect(sx + 640, sy + 128, 252, 86, BLUE_50, 8, parent=fid, name="Slide formula"))
    c.append(text(sx + 656, sy + 146, "f(x) = ax² + bx + c", 17, BLUE_800, 600, family=DISPLAY, parent=fid))
    c.append(text(sx + 656, sy + 176, "Vertex  (−b/2a, f(−b/2a))", 9, BLUE_700, 500, parent=fid))
    # engagement metrics
    c.append(rect(sx + 620, sy + 262, 292, 140, "#FFFFFF0F", 16, stroke="#FFFFFF18", parent=fid, name="Engagement"))
    c.append(text(sx + 638, sy + 278, "Keterlibatan sesi", 9.5, WHITE, 700, parent=fid))
    metrics = [("Hadir", "27/32", 84), ("Bertanya", "11", 34), ("Polling", "9/10", 90)]
    for i, (lab, val, pct) in enumerate(metrics):
        yy = sy + 302 + i * 31
        c.append(text(sx + 638, yy, lab, 8, "#C9BFA9", 500, parent=fid))
        c.append(text(sx + 808, yy, val, 8, WHITE, 700, width=56, align="right", parent=fid))
        c += progress_bar(sx + 638, yy + 13, 250, pct, AMBER_500, "#FFFFFF14", parent=fid, h=4)
    # participant panel
    px, py, pw, ph = 980, 80, 436, 560
    c.append(rect(px, py, pw, ph, DARK_3, 22, stroke="#FFFFFF12", parent=fid, name="Studio panel"))
    c.append(text(px + 22, py + 18, "Kontrol kelas", 12.5, WHITE, 700, family=DISPLAY, parent=fid))
    c.append(text(px + 22, py + 39, "Presensi otomatis · 27 dari 32 hadir", 8.5, "#91A7C2", 400, parent=fid))
    for i, (lab, active) in enumerate([("Peserta", True), ("Chat", False), ("Polling", False)]):
        x = px + 22 + i * 78
        c.append(rect(x, py + 60, 70, 28, "#FFFFFF14" if active else "#FFFFFF06", 14, parent=fid, name=f"Studio tab / {lab}"))
        c.append(text(x, py + 68, lab, 8.5, WHITE if active else "#91A7C2", 700 if active else 500, width=70, align="center", parent=fid))
    people = [
        ("AP", "Aisyah Putri", "Hadir · 42 mnt", GREEN_600),
        ("BA", "Bagas Aditya", "Hadir · 39 mnt", GREEN_600),
        ("CL", "Citra Lestari", "Hadir · 40 mnt", GREEN_600),
        ("DS", "Dimas Saputra", "Izin", AMBER_500),
        ("EP", "Elang Pratama", "Hadir · 38 mnt", GREEN_600),
        ("FN", "Fitri Nurhaliza", "Hadir · 41 mnt", GREEN_600),
        ("GR", "Gilang Ramadhan", "Terlambat · 12 mnt", AMBER_500),
    ]
    for i, (ini, nm, status, col) in enumerate(people):
        yy = py + 108 + i * 48
        c += avatar(px + 22, yy, 30, ini, bg=col if col == GREEN_600 else AMBER_500, parent=fid)
        c.append(text(px + 62, yy + 1, nm, 9, WHITE, 700, parent=fid))
        c.append(text(px + 62, yy + 17, status, 7.5, "#91A7C2", 400, parent=fid))
        if col == GREEN_600:
            c.append(icon("checkCircle", px + pw - 50, yy + 8, 15, GREEN_600, 1.9, parent=fid))
        else:
            c.append(icon("clock", px + pw - 50, yy + 8, 15, AMBER_500, 1.9, parent=fid))
    # poll mini
    c.append(rect(px + 18, py + 446, pw - 36, 94, "#FFFFFF0B", 14, stroke="#FFFFFF14", parent=fid, name="Poll card"))
    c.append(text(px + 34, py + 460, "Polling cepat", 9.5, WHITE, 700, parent=fid))
    c.append(text(px + 34, py + 478, "Apakah kamu sudah paham vertex?", 8.5, "#C9DAEE", 400, parent=fid))
    c += progress_bar(px + 34, py + 498, 236, 78, AMBER_500, "#FFFFFF14", parent=fid, h=6)
    c.append(text(px + 280, py + 492, "78%", 9, AMBER_500, 700, parent=fid))
    c.append(text(px + 34, py + 514, "21 paham · 6 masih ragu", 7.5, "#91A7C2", 400, parent=fid))
    # whiteboard and book
    c += whiteboard(fid, 24, 660, 940, 300, teacher=True)
    c += book_panel(fid, 980, 660, 436, 300, teacher=True)
    c += controls(fid, teacher=True)
    run(c)
