"""Student-facing screens for the SiGEMAS FigCraft build."""
from generate_ui import *


def page_student_home():
    new_page("02 — Student home", background=CANVAS)
    fid = add_screen("Student / Home", 1440, 1024, fill=CANVAS)
    c = page_canvas("Student home", "student", "Beranda", STUDENT_NAV, 0, fid)

    hx, hy, hw, hh = 280, 96, 728, 276
    c.append(rect(hx, hy, hw, hh, gradient=["#082A52", "#0D47A1", "#1E88E5"], radius=24, parent=fid, name="Hero / student"))
    c.append(ellipse(hx + 500, hy - 70, 300, 300, "#FFFFFF0D", parent=fid, name="Hero orbit"))
    c.append(ellipse(hx + 560, hy + 80, 220, 220, "#FFB30018", parent=fid, name="Hero glow"))
    c.append(rect(hx + 28, hy + 24, 82, 24, "#FFFFFF16", 12, parent=fid, name="Class badge"))
    c.append(text(hx + 42, hy + 30, "X IPA 2", 9.5, "#EAF3FF", 700, parent=fid))
    c.append(rect(hx + 120, hy + 24, 132, 24, "#FFB300", 12, parent=fid, name="Streak badge"))
    c.append(icon("flame", hx + 133, hy + 29, 13, INK, 1.8, parent=fid))
    c.append(text(hx + 152, hy + 30, "12 hari beruntun", 9.5, INK, 700, parent=fid))
    c.append(text(hx + 28, hy + 64, "Selamat pagi,", 11, "#BDD7F5", 500, parent=fid))
    c.append(text(hx + 28, hy + 82, "Aisyah, siap lanjut belajar?", 29, WHITE, 600, family=DISPLAY, parent=fid, tracking=-0.4))
    c.append(text(hx + 28, hy + 128, "Kelas live sedang berlangsung. Gabung sekarang, catat poin penting, lalu lanjutkan bab Matematika-mu.", 11.5, "#D4E5F8", 400, width=450, parent=fid, line_height="150%"))
    bs, _ = button(hx + 28, hy + 188, "Lanjutkan membaca", "accent", parent=fid, icon_name="bookOpen", role="student", w=178, h=42)
    c += bs
    bs, _ = button(hx + 218, hy + 188, "Jelajahi katalog", "outline", parent=fid, icon_name="sparkles", role="student", w=162, h=42)
    c += bs
    c.append(rect(hx + 28, hy + 242, 426, 26, "#FFFFFF12", 13, parent=fid, name="Reading progress"))
    c.append(text(hx + 40, hy + 248, "Matematika Kelas X · Bab 3", 8.5, "#D8E8F8", 600, parent=fid))
    c.append(text(hx + 388, hy + 248, "68%", 8.5, WHITE, 700, parent=fid))
    c.append(rect(hx + 40, hy + 261, 376 * 0.68, 3, AMBER_500, 2, parent=fid, name="Reading progress fill"))
    c.append(ellipse(hx + 532, hy + 58, 150, 150, "#FFFFFF10", parent=fid, name="Art halo", stroke="#FFFFFF22", sw=1))
    c.append(rect(hx + 548, hy + 78, 132, 152, "#FFFFFF18", 18, parent=fid, name="Art book", stroke="#FFFFFF2E", sw=1))
    c.append(rect(hx + 566, hy + 96, 96, 10, "#FFFFFF38", 5, parent=fid))
    c.append(rect(hx + 566, hy + 114, 68, 7, "#FFFFFF22", 3.5, parent=fid))
    c.append(icon("bookOpen", hx + 580, hy + 142, 38, WHITE, 1.4, parent=fid, opacity=0.9))
    c.append(rect(hx + 594, hy + 196, 102, 30, AMBER_500, 15, parent=fid, name="Art chip"))
    c.append(text(hx + 608, hy + 203, "target 30 menit", 8, INK, 700, parent=fid))

    fx, fy, fw, fh = 1032, 96, 376, 276
    c.append(card(fx, fy, fw, fh, parent=fid, name="Focus card"))
    c.append(text(fx + 24, fy + 22, "Fokus hari ini", 15, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(fx + 24, fy + 44, "Satu langkah kecil, satu rasa selesai.", 9.5, MUTED, 400, parent=fid))
    c += donut_chart(fx + 92, fy + 134, 44, [
        {"label": "Selesai", "value": 68, "color": BLUE_600},
        {"label": "Sisa", "value": 32, "color": "#EEF2F7"},
    ], parent=fid, thickness=12, center_value="68%", center_label="target")
    items = [("Fungsi kuadrat", True), ("Kuis bab 3", False), ("Proyek statistika", False)]
    for i, (label, done) in enumerate(items):
        iy = fy + 76 + i * 47
        c.append(ellipse(fx + 176, iy, 18, 18, GREEN_100 if done else BLUE_50, parent=fid, name="Task check"))
        c.append(icon("check" if done else "clock", fx + 180, iy + 4, 10, GREEN_600 if done else BLUE_600, 2.2, parent=fid))
        c.append(text(fx + 206, iy + 2, label, 10, INK, 600 if done else 500, parent=fid))
        c.append(text(fx + 206, iy + 17, "Selesai" if done else "Menunggu", 8, MUTED, 400, parent=fid))

    stats = [
        ("Jam belajar", "7,5 jam", "+18% pekan ini", "clock", BLUE_100, BLUE_700),
        ("Rata-rata nilai", "88", "Peringkat #3 kelas", "trophy", AMBER_100, AMBER_700),
        ("Modul selesai", "7", "dari 58 buku siswa", "bookOpen", GREEN_100, GREEN_600),
        ("Kehadiran", "96%", "12 hari beruntun", "userCheck", CYAN_100, CYAN_600),
    ]
    for i, (label, value, hint, ic, bg, fg) in enumerate(stats):
        x = 280 + i * 286
        c.append(card(x, 396, 270, 100, parent=fid, name=f"Stat / {label}"))
        c.append(rect(x + 16, 412, 38, 38, bg, 12, parent=fid, name=f"Stat icon / {label}"))
        c.append(icon(ic, x + 26, 422, 18, fg, 1.9, parent=fid))
        c.append(text(x + 66, 410, label, 9, MUTED, 500, parent=fid))
        c.append(text(x + 66, 426, value, 20, INK, 700, family=DISPLAY, parent=fid))
        c.append(text(x + 66, 456, hint, 8.5, MUTED, 400, parent=fid))

    c += section_heading(280, 516, "Lanjutkan belajar", "Buku SIBI yang sedang kamu pelajari", parent=fid, action="Semua buku  →")
    books = [
        ("Matematika Kelas X", "Matematika", 68, ["#1565C0", "#0D47A1"]),
        ("Bahasa Indonesia Kelas X", "Bahasa Indonesia", 42, ["#FB8C00", "#E65100"]),
        ("Informatika Kelas X", "Informatika", 88, ["#3949AB", "#1A237E"]),
    ]
    for i, (title, subject, pct, grad) in enumerate(books):
        c += book_card(280 + i * 381, 550, 365, 196, title, subject, pct, grad, fid, role="student")

    c.append(card(280, 766, 728, 226, parent=fid, name="Tasks card"))
    c.append(rect(304, 786, 38, 38, AMBER_100, 12, parent=fid, name="Task icon"))
    c.append(icon("clipboardList", 314, 796, 18, AMBER_700, 1.9, parent=fid))
    c.append(text(354, 786, "Tugas mendatang", 13.5, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(354, 806, "2 tugas perlu perhatian minggu ini", 9, MUTED, 400, parent=fid))
    c.append(text(910, 796, "Lihat semua  →", 9, BLUE_700, 600, parent=fid))
    task_rows = [
        ("Latihan Bab 3: Fungsi Kuadrat", "Matematika · Tugas · 100 poin", "Besok, 23.59", RED_100, RED_600),
        ("Proyek Statistika: Data di Sekitarku", "Matematika · Proyek · 100 poin", "9 hari lagi", AMBER_100, AMBER_700),
    ]
    for i, (title, meta, due, dbg, dfg) in enumerate(task_rows):
        ty = 838 + i * 66
        c.append(rect(304, ty, 680, 58, "#F8FAFD", 12, parent=fid, name=f"Task row / {i}"))
        c.append(rect(318, ty + 11, 36, 36, BLUE_50, 10, parent=fid, name="Task type"))
        c.append(icon("listChecks", 328, ty + 21, 16, BLUE_700, 1.8, parent=fid))
        c.append(text(366, ty + 12, title, 10.5, INK, 700, parent=fid))
        c.append(text(366, ty + 30, meta, 8.5, MUTED, 400, parent=fid))
        c.append(rect(806, ty + 16, 78, 24, dbg, 12, parent=fid, name="Due badge"))
        c.append(text(822, ty + 23, due, 8, dfg, 700, parent=fid))
        c += button(900, ty + 14, "Kerjakan", "secondary", parent=fid, w=60, h=28, role="student", size=9)[0]

    lx, ly, lw, lh = 1032, 766, 376, 226
    c.append(rect(lx, ly, lw, lh, gradient=["#0D47A1", "#1565C0", "#1E88E5"], radius=22, parent=fid, name="Live promo"))
    c.append(rect(lx + 20, ly + 20, 66, 22, RED_600, 11, parent=fid, name="Live pill"))
    c.append(ellipse(lx + 30, ly + 27, 7, 7, WHITE, parent=fid))
    c.append(text(lx + 42, ly + 25, "LIVE", 8, WHITE, 700, tracking=0.5, parent=fid))
    c.append(text(lx + 20, ly + 56, "Matematika · Bab 3", 14, WHITE, 700, family=DISPLAY, parent=fid))
    c.append(text(lx + 20, ly + 78, "Fungsi Kuadrat bersama Pak Raka", 9.5, "#D4E5F8", 400, width=300, parent=fid))
    c += avatar(lx + 20, ly + 108, 60, "RP", bg=AMBER_500, parent=fid, ring="#FFFFFF33")
    c.append(text(lx + 76, ly + 114, "Pak Raka Pradana", 10, WHITE, 700, parent=fid))
    c.append(text(lx + 76, ly + 130, "27 siswa bergabung", 8.5, "#C9DBF2", 400, parent=fid))
    c.append(text(lx + 20, ly + 184, "Sedang berlangsung · 18 menit", 8.5, "#C9DBF2", 400, parent=fid))
    bs, _ = button(lx + 268, ly + 176, "Gabung", "accent", parent=fid, w=84, h=32, icon_name="play", role="student", size=10)
    c += bs
    run(c)


def page_catalog():
    new_page("03 — Library", background=CANVAS)
    fid = add_screen("Student / Library", 1440, 1024, fill=CANVAS)
    c = page_canvas("Library", "student", "Katalog SIBI", STUDENT_NAV, 1, fid)
    c.append(card(280, 96, 1128, 140, parent=fid, name="Catalog header"))
    c.append(rect(304, 118, 48, 48, BLUE_600, 15, parent=fid, name="Catalog icon"))
    c.append(icon("library", 316, 130, 24, WHITE, 1.7, parent=fid))
    c.append(text(366, 116, "Katalog SIBI", 26, INK, 700, family=DISPLAY, parent=fid, tracking=-0.4))
    c.append(text(366, 151, "67 buku resmi Kemendikdasmen. 58 tersedia untuk siswa, 9 panduan guru khusus guru & admin.", 10, MUTED, 400, parent=fid))
    c += search_box(898, 116, 486, "Cari judul, mata pelajaran, atau kelas...", parent=fid, h=44)
    c.append(rect(898, 176, 118, 26, GREEN_100, 13, parent=fid, name="Synced badge"))
    c.append(ellipse(910, 186, 6, 6, GREEN_600, parent=fid))
    c.append(text(922, 183, "Sinkron SIBI", 8.5, GREEN_600, 700, parent=fid))
    c.append(text(1024, 183, "61 SD/MI  ·  6 SMA/MA", 8.5, MUTED, 500, parent=fid))
    chips = [("Semua", True), ("Matematika", False), ("Bahasa Indonesia", False), ("IPA", False), ("Sejarah", False), ("Bahasa Inggris", False), ("Informatika", False), ("Panduan Guru", False)]
    cx = 280
    for label, active in chips:
        w = 32 + len(label) * 5.4
        c.append(rect(cx, 258, w, 32, BLUE_600 if active else SURFACE, 16, stroke=None if active else LINE, parent=fid, name=f"Chip / {label}"))
        c.append(text(cx, 268, label, 9.5, WHITE if active else MUTED, 700 if active else 500, parent=fid))
        cx += w + 10
    c.append(rect(1274, 258, 134, 32, SURFACE, 16, stroke=LINE, parent=fid, name="Filter action"))
    c.append(icon("filter", 1290, 267, 14, MUTED, 2, parent=fid))
    c.append(text(1310, 268, "Filter lanjutan", 9, MUTED, 600, parent=fid))
    books = [
        ("Matematika Kelas X", "Matematika", "4.9", ["#1565C0", "#0D47A1"], False),
        ("Bahasa Indonesia Kelas X", "Bahasa Indonesia", "4.8", ["#FB8C00", "#E65100"], False),
        ("Ilmu Pengetahuan Alam Kelas X", "IPA", "4.7", ["#2E7D32", "#1B5E20"], False),
        ("Sejarah Indonesia Kelas X", "Sejarah Indonesia", "4.6", ["#8E24AA", "#4A148C"], False),
        ("Bahasa Inggris Kelas X", "Bahasa Inggris", "4.7", ["#00838F", "#005662"], False),
        ("Informatika Kelas X", "Informatika", "4.8", ["#3949AB", "#1A237E"], False),
        ("Panduan Guru Matematika", "Buku Panduan Guru", "4.9", ["#6D4C41", "#3E2723"], True),
        ("Buku Audio Bahasa Indonesia", "Bahasa Indonesia", "4.7", ["#D84315", "#8A2B0A"], False),
    ]
    for i, (title, subject, rating, grad, locked) in enumerate(books):
        col = i % 4
        row = i // 4
        c += catalog_card(280 + col * 286, 306 + row * 330, 270, 314, title, subject, rating, grad, fid, role="student", locked=locked)
    c.append(text(280, 978, "Menampilkan 8 dari 67 buku · Data katalog tersinkron 8 Nov 2026", 9, MUTED, 400, parent=fid))
    run(c)


def page_reader():
    new_page("04 — Reader", background="#E9EFF7")
    fid = add_screen("Student / Reader", 1440, 1024, fill="#E9EFF7")
    c = [rect(0, 0, 1440, 1024, "#E9EFF7", 0, parent=fid, name="Canvas")]
    c.append(rect(0, 0, 76, 1024, SURFACE, 0, parent=fid, name="Reader rail"))
    c.append(rect(75, 0, 1, 1024, LINE, 0, parent=fid, name="Rail divider"))
    c += logo_mark(20, 20, 36, bg=BLUE_600, fg=WHITE, parent=fid)
    for i, (ic, active) in enumerate([("arrowLeft", False), ("bookMarked", True), ("highlighter", False), ("messageSquare", False), ("settings", False)]):
        y = 90 + i * 54
        if active:
            c.append(rect(14, y - 8, 48, 42, BLUE_100, 12, parent=fid, name="Rail active"))
        c.append(icon(ic, 30, y, 20, BLUE_700 if active else MUTED, 1.8, parent=fid))
    c += avatar(20, 944, 36, "AP", bg=BLUE_600, parent=fid)
    c.append(rect(76, 0, 1364, 64, SURFACE, 0, parent=fid, name="Reader topbar"))
    c.append(rect(76, 63, 1364, 1, LINE, 0, parent=fid, name="Topbar line"))
    c.append(text(104, 16, "Matematika Kelas X", 14, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(104, 37, "Bab 3 · Fungsi Kuadrat · halaman 78", 9, MUTED, 400, parent=fid))
    c.append(rect(420, 18, 84, 28, GREEN_100, 14, parent=fid, name="Progress badge"))
    c.append(ellipse(432, 27, 6, 6, GREEN_600, parent=fid))
    c.append(text(444, 25, "68% dibaca", 8.5, GREEN_600, 700, parent=fid))
    c.append(icon("bookmark", 1180, 22, 18, BLUE_700, 1.9, parent=fid))
    c.append(icon("highlighter", 1218, 22, 18, MUTED, 1.9, parent=fid))
    c.append(icon("share", 1256, 22, 18, MUTED, 1.9, parent=fid))
    c.append(rect(1290, 14, 122, 34, BLUE_600, 17, parent=fid, name="Focus mode"))
    c.append(icon("maximize", 1304, 23, 14, WHITE, 2, parent=fid))
    c.append(text(1324, 24, "Mode fokus", 9, WHITE, 600, parent=fid))
    c.append(card(96, 84, 248, 916, parent=fid, name="Table of contents"))
    c.append(text(120, 108, "Daftar isi", 14, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(120, 130, "6 bab · 18 halaman", 8.5, MUTED, 400, parent=fid))
    chapters = [
        ("01", "Bilangan Berpangkat", 0),
        ("02", "Persamaan Linear", 0),
        ("03", "Fungsi Kuadrat", 1),
        ("04", "Trigonometri Dasar", 0),
        ("05", "Sistem Persamaan", 0),
        ("06", "Statistika dan Peluang", 0),
    ]
    for i, (num, label, active) in enumerate(chapters):
        y = 158 + i * 72
        if active:
            c.append(rect(112, y - 8, 216, 58, BLUE_50, 12, parent=fid, name="Active chapter"))
            c.append(rect(112, y + 8, 3, 24, BLUE_600, 2, parent=fid, name="Chapter indicator"))
        c.append(text(128, y, num, 8.5, BLUE_700 if active else MUTED_2, 700, parent=fid))
        c.append(text(156, y - 1, label, 10.5, INK if active else MUTED, 700 if active else 500, width=156, parent=fid))
        c.append(text(156, y + 18, "3 halaman" if active else "Ringkas", 8, MUTED_2, 400, parent=fid))
        c.append(icon("chevronRight" if not active else "bookOpen", 306, y + 2, 12, BLUE_600 if active else MUTED_2, 2, parent=fid))
    c.append(rect(112, 764, 216, 1, LINE, 0, parent=fid))
    c.append(text(120, 790, "Progres baca", 10, MUTED, 600, parent=fid))
    c.append(text(120, 810, "68%", 26, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(174, 820, "dari bab 3", 8.5, MUTED, 400, parent=fid))
    c += progress_bar(120, 846, 208, 68, BLUE_600, parent=fid, h=7)
    c.append(rect(112, 880, 216, 88, BLUE_50, 14, parent=fid, name="AI helper mini"))
    c.append(icon("sparkles", 128, 896, 17, BLUE_700, 1.8, parent=fid))
    c.append(text(152, 895, "Tanya SiGEMAS AI", 9.5, BLUE_800, 700, parent=fid))
    c.append(text(128, 918, "Minta ringkasan, contoh soal,", 8.5, MUTED, 400, parent=fid))
    c.append(text(128, 932, "atau penjelasan sederhana.", 8.5, MUTED, 400, parent=fid))
    c.append(card(364, 84, 720, 916, parent=fid, radius=20, fill="#F8FAFD", shadow=SHADOW_MD, name="Document surface"))
    c.append(rect(396, 116, 656, 852, SURFACE, 8, parent=fid, name="PDF page", effects=SHADOW_SM))
    c.append(text(428, 146, "BAB 3", 10, AMBER_700, 700, tracking=1.0, parent=fid))
    c.append(text(428, 166, "Fungsi Kuadrat", 34, INK, 600, family=DISPLAY, tracking=-0.6, parent=fid))
    c.append(text(428, 218, "Mengenali pola, memilih representasi, dan menjelaskan alasan di balik setiap langkah.", 10.5, MUTED, 400, width=520, parent=fid))
    c.append(rect(428, 250, 94, 3, AMBER_500, 2, parent=fid, name="Section rule"))
    paragraphs = [
        "Fungsi kuadrat adalah fungsi yang dapat dituliskan dalam bentuk f(x) = ax² + bx + c, dengan a ≠ 0. Grafiknya berbentuk parabola yang membuka ke atas ketika a > 0 dan membuka ke bawah ketika a < 0.",
        "Titik puncak parabola disebut vertex. Letaknya menjadi kunci untuk memahami nilai maksimum atau minimum fungsi, serta membantu kita membaca lintasan bola, lengkung jembatan, dan desain antena.",
    ]
    py = 284
    for p in paragraphs:
        c.append(text(428, py, p, 11, "#334155", 400, width=592, parent=fid, line_height="170%"))
        py += 80
    c.append(rect(428, 454, 592, 92, BLUE_50, 14, stroke=BLUE_100, parent=fid, name="Formula callout"))
    c.append(rect(428, 454, 4, 92, BLUE_600, 2, parent=fid, name="Callout bar"))
    c.append(text(452, 470, "Bentuk umum", 8.5, BLUE_800, 700, tracking=0.4, parent=fid))
    c.append(text(452, 490, "f(x) = ax² + bx + c", 22, BLUE_800, 600, family=DISPLAY, parent=fid))
    c.append(text(666, 500, "a ≠ 0", 10, BLUE_700, 600, parent=fid))
    c.append(text(428, 572, "Contoh: grafik y = x² − 4x + 3", 11, INK, 700, parent=fid))
    c.append(rect(428, 602, 592, 198, "#F8FAFD", 14, stroke=LINE, parent=fid, name="Figure frame"))
    c.append(rect(484, 786, 480, 1, "#CBD5E1", 0, parent=fid, name="X axis"))
    c.append(rect(622, 626, 1, 170, "#CBD5E1", 0, parent=fid, name="Y axis"))
    pts = []
    for i in range(41):
        t = i / 40
        px = 484 + t * 480
        xx = (t - 0.5) * 6
        yy = xx * xx - 2.25
        pyy = 760 - yy * 23
        pts.append(f"{px:.1f} {pyy:.1f}")
    c.append(vector_path("M" + "L".join(pts), 0, 0, 1, 1, fill="none", stroke=BLUE_600, sw=2.5, parent=fid, name="Parabola"))
    for dx in [0.15, 0.5, 0.85]:
        px = 484 + dx * 480
        c.append(ellipse(px - 4, 760 - 4, 8, 8, AMBER_500, parent=fid, stroke=WHITE, sw=1.5))
    c.append(text(452, 818, "Gambar 3.1 · Parabola membuka ke atas dengan titik puncak di bawah sumbu X.", 8.5, MUTED, 400, parent=fid))
    c.append(text(428, 840, "Yang perlu diingat", 11, INK, 700, parent=fid))
    bullets = ["Nilai a menentukan arah bukaan parabola.", "Vertex memberi nilai optimum fungsi.", "Akar-akar fungsi adalah titik potong sumbu X."]
    for i, b in enumerate(bullets):
        by = 864 + i * 22
        c.append(ellipse(430, by + 5, 5, 5, AMBER_500, parent=fid))
        c.append(text(444, by, b, 9.5, "#475569", 400, parent=fid))
    c.append(text(724, 936, "78", 9, MUTED_2, 500, parent=fid))
    c.append(text(1004, 936, "Matematika · X", 8.5, MUTED_2, 500, parent=fid))
    c.append(rect(396, 984, 656, 1, LINE, 0, parent=fid))
    c.append(icon("chevronLeft", 412, 996, 14, MUTED, 2, parent=fid))
    c.append(text(436, 996, "Sebelumnya", 9, MUTED, 500, parent=fid))
    c.append(text(904, 996, "Berikutnya", 9, MUTED, 500, parent=fid))
    c.append(icon("chevronRight", 980, 996, 14, MUTED, 2, parent=fid))
    c.append(card(1104, 84, 312, 916, parent=fid, name="Study tools"))
    c.append(text(1128, 108, "Ruang belajar", 14, INK, 700, family=DISPLAY, parent=fid))
    for i, (lab, active) in enumerate([("Catatan", True), ("AI", False), ("Diskusi", False)]):
        x = 1128 + i * 78
        c.append(rect(x, 134, 70, 28, BLUE_600 if active else "#F2F5FA", 14, parent=fid, name=f"Tab / {lab}"))
        c.append(text(x, 142, lab, 8.5, WHITE if active else MUTED, 700 if active else 500, width=70, align="center", parent=fid))
    c.append(rect(1128, 180, 264, 154, gradient=["#0D47A1", "#1E88E5"], radius=18, parent=fid, name="AI card"))
    c.append(icon("sparkles", 1146, 198, 18, AMBER_500, 1.8, parent=fid))
    c.append(text(1172, 196, "SiGEMAS AI", 10.5, WHITE, 700, parent=fid))
    c.append(text(1146, 224, "Ringkas bab ini menjadi", 10, "#D4E5F8", 400, parent=fid))
    c.append(text(1146, 239, "3 poin yang mudah diingat.", 10, "#D4E5F8", 400, parent=fid))
    for i, lab in enumerate(["Buat ringkasan", "Buat 5 soal latihan"]):
        c.append(rect(1146, 262 + i * 30, 150, 24, "#FFFFFF1C", 12, parent=fid, name=f"AI action / {lab}"))
        c.append(text(1160, 268 + i * 30, lab, 8, WHITE, 600, parent=fid))
    c.append(text(1128, 356, "Catatan saya", 11, INK, 700, parent=fid))
    c.append(text(1330, 358, "3 catatan", 8, MUTED, 500, width=58, align="right", parent=fid))
    notes = [
        ("Rumus puncak", "x = −b/2a, lalu substitusi untuk mencari y.", AMBER_500),
        ("Koneksi nyata", "Lintasan bola basket adalah parabola.", BLUE_600),
        ("Pertanyaan", "Apa hubungan diskriminan dengan jumlah akar?", TEAL_500),
    ]
    for i, (title, body, col) in enumerate(notes):
        y = 382 + i * 82
        c.append(rect(1128, y, 264, 72, "#F8FAFD", 12, stroke=LINE, parent=fid, name=f"Note / {title}"))
        c.append(rect(1128, y, 3, 72, col, 1.5, parent=fid, name="Note bar"))
        c.append(text(1144, y + 12, title, 9.5, INK, 700, parent=fid))
        c.append(text(1144, y + 30, body, 8.5, MUTED, 400, width=230, parent=fid, line_height="135%"))
    c.append(rect(1128, 646, 264, 102, gradient=["#082A52", "#1565C0"], radius=16, parent=fid, name="Live now"))
    c.append(rect(1142, 660, 56, 20, RED_600, 10, parent=fid, name="Live badge"))
    c.append(ellipse(1150, 667, 6, 6, WHITE, parent=fid))
    c.append(text(1160, 664, "LIVE", 7, WHITE, 700, parent=fid))
    c.append(text(1142, 690, "Tanya langsung di kelas", 10.5, WHITE, 700, parent=fid))
    c.append(text(1142, 708, "Pak Raka · 27 siswa", 8, "#CBDCF2", 400, parent=fid))
    c.append(text(1142, 726, "Gabung  →", 8.5, AMBER_500, 700, parent=fid))
    c.append(text(1128, 780, "Sorotan", 10, MUTED, 700, parent=fid))
    for i, (lab, col) in enumerate([("Konsep kunci", AMBER_500), ("Contoh", BLUE_600), ("Pertanyaan", TEAL_500)]):
        y = 804 + i * 26
        c.append(rect(1128, y, 10, 10, col, 3, parent=fid, name="Legend"))
        c.append(text(1146, y - 1, lab, 8.5, MUTED, 500, parent=fid))
    c.append(rect(1128, 902, 264, 74, BLUE_50, 14, parent=fid, name="Reading tip"))
    c.append(icon("lightbulb", 1142, 918, 16, BLUE_700, 1.8, parent=fid))
    c.append(text(1164, 916, "Baca aktif", 9.5, BLUE_800, 700, parent=fid))
    c.append(text(1142, 936, "Tandai satu ide yang ingin kamu", 8.3, MUTED, 400, parent=fid))
    c.append(text(1142, 949, "diskusikan di kelas besok.", 8.3, MUTED, 400, parent=fid))
    run(c)
