"""Teacher, parent, admin, auth, and mobile screens."""
from generate_ui import *


def page_teacher_home():
    new_page("07 — Teacher home", background=CANVAS)
    fid = add_screen("Teacher / Home", 1440, 1024, fill=CANVAS)
    c = page_canvas("Teacher home", "teacher", "Beranda", TEACHER_NAV, 0, fid)

    # hero
    hx, hy, hw, hh = 280, 96, 720, 260
    c.append(rect(hx, hy, hw, hh, gradient=["#2B1A08", "#7A4409", "#B45309"], radius=24, parent=fid, name="Hero / teacher"))
    c.append(ellipse(hx + 450, hy - 80, 290, 290, "#FFB30015", parent=fid, name="Hero glow"))
    c.append(rect(hx + 28, hy + 24, 140, 24, "#FFFFFF16", 12, parent=fid, name="Date badge"))
    c.append(text(hx + 42, hy + 30, "Senin, 10 November 2025", 8.5, "#FFE9C8", 700, parent=fid))
    c.append(text(hx + 28, hy + 60, "Selamat pagi,", 11, "#F5D7AA", 500, parent=fid))
    c.append(text(hx + 28, hy + 78, "Pak Raka, kelas siap dimulai.", 27, WHITE, 600, family=DISPLAY, parent=fid, tracking=-0.3))
    c.append(text(hx + 28, hy + 122, "3 kelas hari ini, 2 tugas menunggu penilaian, dan 27 siswa sudah bergabung di studio live.", 11, "#F4DEC0", 400, width=490, parent=fid, line_height="150%"))
    bs, _ = button(hx + 28, hy + 176, "Masuk studio live", "accent", parent=fid, icon_name="video", role="teacher", w=166, h=42)
    c += bs
    bs, _ = button(hx + 206, hy + 176, "Ekstrak PDF SIBI", "outline", parent=fid, icon_name="fileScan", role="teacher", w=164, h=42)
    c += bs
    for i, (lab, val) in enumerate([("32 siswa diampu", "users"), ("3 kelas aktif", "school"), ("Rata-rata 84", "graduationCap")]):
        c.append(icon(val, hx + 30 + i * 168, hy + 238, 13, "#FFE9C8", 1.8, parent=fid))
        c.append(text(hx + 50 + i * 168, hy + 235, lab, 8.5, "#F4DEC0", 500, parent=fid))
    # teacher abstract
    c.append(ellipse(hx + 526, hy + 62, 130, 130, "#FFFFFF10", parent=fid, name="Teacher art halo", stroke="#FFFFFF22", sw=1))
    c.append(rect(hx + 548, hy + 80, 96, 120, "#FFFFFF16", 16, parent=fid, name="Teacher art card", stroke="#FFFFFF24", sw=1))
    c.append(icon("presentation", hx + 574, hy + 108, 44, WHITE, 1.3, parent=fid, opacity=0.9))
    c.append(rect(hx + 568, hy + 170, 58, 22, AMBER_500, 11, parent=fid, name="Teacher art chip"))
    c.append(text(hx + 578, hy + 175, "LIVE", 7, INK, 700, parent=fid))

    # live control
    lx, ly, lw, lh = 1016, 96, 392, 260
    c.append(card(lx, ly, lw, lh, parent=fid, name="Live control"))
    c.append(text(lx + 22, ly + 20, "Kontrol sesi live", 14, INK, 700, family=DISPLAY, parent=fid))
    c.append(rect(lx + lw - 104, ly + 18, 82, 24, RED_100, 12, parent=fid, name="Live badge"))
    c.append(ellipse(lx + lw - 94, ly + 27, 6, 6, RED_600, parent=fid))
    c.append(text(lx + lw - 84, ly + 24, "Sedang live", 8, RED_600, 700, parent=fid))
    c.append(text(lx + 22, ly + 52, "Matematika · Bab 3: Fungsi Kuadrat", 10.5, INK, 700, parent=fid))
    c.append(text(lx + 22, ly + 70, "X IPA 2 · dimulai 08.02", 8.5, MUTED, 400, parent=fid))
    for i, (lab, val, col) in enumerate([("Siswa aktif", "27", BLUE_700), ("Partisipasi", "92%", GREEN_600)]):
        x = lx + 22 + i * 168
        c.append(rect(x, ly + 92, 156, 58, "#F7F9FC", 12, parent=fid, name=f"Live stat / {lab}"))
        c.append(text(x + 14, ly + 102, lab, 8, MUTED, 500, parent=fid))
        c.append(text(x + 14, ly + 118, val, 22, col, 700, family=DISPLAY, parent=fid))
    bs, _ = button(lx + 22, ly + 166, "Buka studio", "primary", parent=fid, icon_name="play", role="teacher", w=348, h=40)
    c += bs
    c.append(text(lx + 22, ly + 220, "Presensi otomatis aktif", 8, MUTED, 500, parent=fid))
    c.append(icon("checkCircle", lx + 348, ly + 216, 13, GREEN_600, 2, parent=fid))

    # stats
    stats = [
        ("Siswa kelas live", "27", "bergabung saat ini", "users", BLUE_100, BLUE_700),
        ("Kelas hari ini", "3", "sesi terjadwal", "calendarClock", AMBER_100, AMBER_700),
        ("Menunggu nilai", "2", "perlu tindak lanjut", "fileCheck", RED_100, RED_600),
        ("Rata-rata kelas", "84", "skala 0–100", "graduationCap", GREEN_100, GREEN_600),
    ]
    for i, (label, value, hint, ic, bg, fg) in enumerate(stats):
        x = 280 + i * 286
        c.append(card(x, 372, 270, 100, parent=fid, name=f"Teacher stat / {label}"))
        c.append(rect(x + 16, 388, 38, 38, bg, 12, parent=fid, name="Stat icon"))
        c.append(icon(ic, x + 26, 398, 18, fg, 1.9, parent=fid))
        c.append(text(x + 66, 386, label, 9, MUTED, 500, parent=fid))
        c.append(text(x + 66, 402, value, 20, INK, 700, family=DISPLAY, parent=fid))
        c.append(text(x + 66, 432, hint, 8.5, MUTED, 400, parent=fid))

    # performance chart
    c.append(card(280, 492, 720, 300, parent=fid, name="Performance card"))
    c += section_heading(304, 516, "Tren performa kelas", "Rata-rata nilai 8 pekan terakhir", parent=fid, accent=AMBER_700, action="+6 poin")
    vals = [78, 82, 80, 86, 84, 89, 91, 88]
    c += line_chart(324, 590, 620, 128, vals, color=AMBER_600, labels=[f"P{i+1}" for i in range(8)], parent=fid, end_value="88")
    c.append(rect(304, 744, 360, 26, AMBER_100, 13, parent=fid, name="Chart note"))
    c.append(icon("trendingUp", 318, 750, 14, AMBER_700, 1.9, parent=fid))
    c.append(text(338, 751, "Kelas stabil di atas target 80 — pertahankan ritme.", 8.5, AMBER_800, 600, parent=fid))

    # quick actions
    c.append(card(1016, 372, 392, 420, parent=fid, name="Quick actions"))
    c.append(text(1040, 394, "Aksi cepat", 14, INK, 700, family=DISPLAY, parent=fid))
    actions = [
        ("Mulai kelas live", "Studio & whiteboard", "video", BLUE_100, BLUE_700),
        ("Ekstrak PDF SIBI", "Jadikan bahan ajar", "fileScan", AMBER_100, AMBER_700),
        ("Input nilai", "Buku nilai digital", "clipboardList", GREEN_100, GREEN_600),
        ("Susun RPP", "Rencana per minggu", "notebookPen", CYAN_100, CYAN_600),
    ]
    for i, (label, desc, ic, bg, fg) in enumerate(actions):
        x = 1040 + (i % 2) * 176
        y = 428 + (i // 2) * 88
        c.append(rect(x, y, 160, 78, "#F8FAFD", 14, stroke=LINE, parent=fid, name=f"Quick action / {label}"))
        c.append(rect(x + 12, y + 12, 32, 32, bg, 10, parent=fid, name="Quick icon"))
        c.append(icon(ic, x + 20, y + 20, 16, fg, 1.9, parent=fid))
        c.append(text(x + 12, y + 50, label, 9, INK, 700, parent=fid))
        c.append(text(x + 12, y + 64, desc, 7.5, MUTED, 400, parent=fid))
    c.append(rect(1040, 618, 344, 66, AMBER_100, 14, parent=fid, name="Tip"))
    c.append(icon("sparkles", 1054, 634, 16, AMBER_700, 1.8, parent=fid))
    c.append(text(1076, 632, "Gunakan polling di tengah sesi", 9, AMBER_800, 700, parent=fid))
    c.append(text(1076, 648, "untuk cek pemahaman siswa.", 8, AMBER_800, 500, parent=fid))
    c.append(rect(1040, 700, 344, 70, "#F8FAFD", 14, parent=fid, name="Material card"))
    c.append(rect(1054, 714, 36, 36, BLUE_100, 12, parent=fid, name="Material icon"))
    c.append(icon("bookOpen", 1064, 724, 17, BLUE_700, 1.8, parent=fid))
    c.append(text(1100, 714, "Materi siap diajar", 9.5, INK, 700, parent=fid))
    c.append(text(1100, 730, "67 buku SIBI tersinkron", 8, MUTED, 400, parent=fid))
    c.append(text(1100, 746, "Buka katalog  →", 8, BLUE_700, 700, parent=fid))

    # grading
    c.append(card(280, 812, 720, 180, parent=fid, name="Grading card"))
    c.append(rect(304, 832, 38, 38, RED_100, 12, parent=fid, name="Grading icon"))
    c.append(icon("fileCheck", 314, 842, 18, RED_600, 1.9, parent=fid))
    c.append(text(354, 832, "Perlu dinilai", 13.5, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(354, 852, "2 pengumpulan menunggu", 8.5, MUTED, 400, parent=fid))
    c.append(text(900, 842, "Buka buku nilai  →", 9, AMBER_700, 600, parent=fid))
    for i, (nm, task, time, score) in enumerate([("Bagas Aditya", "Latihan Bab 3", "07.12", "—"), ("Citra Lestari", "Latihan Bab 3", "06.45", "—")]):
        y = 880 + i * 48
        c += avatar(310, y, 30, "BA" if i == 0 else "CL", bg=BLUE_600 if i == 0 else TEAL_500, parent=fid)
        c.append(text(352, y + 1, nm, 9, INK, 700, parent=fid))
        c.append(text(352, y + 16, f"{task} · {time}", 8, MUTED, 400, parent=fid))
        c.append(rect(814, y + 4, 66, 24, AMBER_100, 12, parent=fid, name="Grade action"))
        c.append(text(824, y + 10, "Nilai", 8, AMBER_700, 700, parent=fid))

    # agenda
    c.append(card(1016, 812, 392, 180, parent=fid, name="Agenda card"))
    c.append(text(1040, 832, "Agenda hari ini", 13.5, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(1320, 834, "RPP  →", 8.5, AMBER_700, 600, parent=fid))
    agenda = [("07.30", "Matematika", "X IPA 2 · R-204"), ("09.15", "Matematika", "X IPS 1 · R-208"), ("12.45", "Informatika", "X IPA 2 · Lab")]
    for i, (time, subj, cls) in enumerate(agenda):
        y = 864 + i * 38
        c.append(text(1040, y, time, 8.5, INK, 700, parent=fid))
        c.append(rect(1078, y + 2, 3, 24, AMBER_500, 1.5, parent=fid, name="Agenda bar"))
        c.append(text(1092, y, subj, 9, INK, 600, parent=fid))
        c.append(text(1092, y + 14, cls, 7.5, MUTED, 400, parent=fid))
    run(c)


def page_parent():
    new_page("08 — Parent companion", background=CANVAS)
    fid = add_screen("Parent / Home", 1440, 1024, fill=CANVAS)
    c = page_canvas("Parent home", "parent", "Beranda", PARENT_NAV, 0, fid)

    hx, hy, hw, hh = 280, 96, 1128, 230
    c.append(rect(hx, hy, hw, hh, gradient=["#073F3B", "#0F766E", "#14B8A6"], radius=24, parent=fid, name="Hero / parent"))
    c.append(ellipse(hx + 820, hy - 100, 360, 360, "#FFFFFF0C", parent=fid, name="Hero orbit"))
    c.append(ellipse(hx + 700, hy + 80, 240, 240, "#FFFFFF0A", parent=fid, name="Hero glow"))
    c.append(rect(hx + 28, hy + 24, 120, 24, "#FFFFFF16", 12, parent=fid, name="Report badge"))
    c.append(text(hx + 42, hy + 30, "Laporan aktif · 10 Nov", 8.5, "#D9FFF9", 700, parent=fid))
    c.append(text(hx + 28, hy + 62, "Selamat pagi, Bapak/Ibu", 11, "#BDEFE8", 500, parent=fid))
    c.append(text(hx + 28, hy + 80, "Aisyah tumbuh dengan ritme yang sehat.", 27, WHITE, 600, family=DISPLAY, parent=fid, tracking=-0.3))
    c.append(text(hx + 28, hy + 122, "Nilai stabil di atas rata-rata kelas. Ada 3 catatan guru dan 2 tugas terdekat yang bisa Anda dampingi.", 11, "#D4F7F2", 400, width=660, parent=fid, line_height="150%"))
    for i, lab in enumerate(["Nilai rapor aman", "Kehadiran baik", "Partisipasi aktif"]):
        c.append(rect(hx + 28 + i * 148, hy + 180, 138, 26, "#FFFFFF14", 13, parent=fid, name=f"Tag / {lab}"))
        c.append(ellipse(hx + 40 + i * 148, hy + 190, 6, 6, "#8EF5E8", parent=fid))
        c.append(text(hx + 52 + i * 148, hy + 187, lab, 8, "#E6FFFC", 600, parent=fid))
    # child card
    c.append(rect(hx + 840, hy + 20, 260, 190, "#FFFFFFE8", 18, parent=fid, name="Child card", effects=SHADOW_MD))
    c += avatar(hx + 860, hy + 38, 48, "AP", bg=TEAL_500, parent=fid)
    c.append(text(hx + 920, hy + 38, "Aisyah Putri", 13, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(hx + 920, hy + 58, "NISN 0067123451", 8, MUTED, 400, parent=fid))
    c.append(text(hx + 920, hy + 74, "X IPA 2 · Wali: Pak Raka", 8, MUTED, 400, parent=fid))
    c.append(rect(hx + 860, hy + 106, 108, 50, "#F1FFFC", 10, parent=fid, name="Rank"))
    c.append(text(hx + 872, hy + 114, "Peringkat", 7.5, MUTED, 500, parent=fid))
    c.append(text(hx + 872, hy + 128, "#3", 16, TEAL_700, 700, family=DISPLAY, parent=fid))
    c.append(rect(hx + 980, hy + 106, 100, 50, "#F1FFFC", 10, parent=fid, name="Average"))
    c.append(text(hx + 992, hy + 114, "Rata-rata", 7.5, MUTED, 500, parent=fid))
    c.append(text(hx + 992, hy + 128, "88", 16, TEAL_700, 700, family=DISPLAY, parent=fid))
    c.append(text(hx + 860, hy + 168, "Unduh ringkasan  →", 8, TEAL_700, 700, parent=fid))

    # stats
    stats = [
        ("Rata-rata nilai", "88", "+4 poin bulan lalu", "award", TEAL_100, TEAL_700),
        ("Peringkat kelas", "#3", "dari 32 siswa", "graduationCap", BLUE_100, BLUE_700),
        ("Kehadiran", "96%", "48 sesi tercatat", "userCheck", GREEN_100, GREEN_600),
        ("Jam belajar", "6,4 jam", "7 hari terakhir", "clock", AMBER_100, AMBER_700),
    ]
    for i, (label, value, hint, ic, bg, fg) in enumerate(stats):
        x = 280 + i * 286
        c.append(card(x, 356, 270, 100, parent=fid, name=f"Parent stat / {label}"))
        c.append(rect(x + 16, 372, 38, 38, bg, 12, parent=fid, name="Stat icon"))
        c.append(icon(ic, x + 26, 382, 18, fg, 1.9, parent=fid))
        c.append(text(x + 66, 370, label, 9, MUTED, 500, parent=fid))
        c.append(text(x + 66, 386, value, 20, INK, 700, family=DISPLAY, parent=fid))
        c.append(text(x + 66, 416, hint, 8.5, MUTED, 400, parent=fid))

    # performance
    c.append(card(280, 480, 728, 300, parent=fid, name="Performance card"))
    c += section_heading(304, 504, "Perkembangan nilai", "Perbandingan dengan rata-rata kelas", parent=fid, accent=TEAL_700, action="Di atas rata-rata")
    c += line_chart(324, 574, 624, 128, [78, 82, 80, 86, 84, 89, 91, 88], color=TEAL_500, labels=[f"P{i+1}" for i in range(8)], secondary=[74, 76, 77, 78, 79, 80, 81, 82], secondary_color=AMBER_500, parent=fid, end_value="88")
    c.append(rect(304, 736, 420, 26, TEAL_100, 13, parent=fid, name="Chart note"))
    c.append(icon("trendingUp", 318, 742, 14, TEAL_700, 1.9, parent=fid))
    c.append(text(338, 743, "Aisyah konsisten 6–9 poin di atas rata-rata kelas.", 8.5, TEAL_700, 600, parent=fid))

    # attendance donut
    c.append(card(1032, 480, 376, 300, parent=fid, name="Attendance card"))
    c.append(text(1056, 504, "Presensi", 14, INK, 700, family=DISPLAY, parent=fid))
    c.append(rect(1280, 502, 104, 24, GREEN_100, 12, parent=fid, name="Attendance badge"))
    c.append(text(1292, 508, "96% hadir", 8, GREEN_600, 700, parent=fid))
    c += donut_chart(1220, 612, 70, [
        {"label": "Hadir", "value": 42, "color": TEAL_500},
        {"label": "Terlambat", "value": 3, "color": AMBER_500},
        {"label": "Izin", "value": 2, "color": CYAN_600},
        {"label": "Alfa", "value": 1, "color": RED_600},
    ], parent=fid, thickness=18, center_value="96%", center_label="kehadiran")
    for i, (lab, col, val) in enumerate([("Hadir", TEAL_500, "42"), ("Terlambat", AMBER_500, "3"), ("Izin", CYAN_600, "2"), ("Alfa", RED_600, "1")]):
        x = 1056 + (i % 2) * 160
        y = 696 + (i // 2) * 34
        c.append(rect(x, y, 10, 10, col, 3, parent=fid, name="Legend"))
        c.append(text(x + 18, y - 2, f"{lab} · {val}", 8.5, MUTED, 500, parent=fid))

    # teacher notes
    c.append(card(280, 804, 728, 188, parent=fid, name="Teacher notes"))
    c.append(rect(304, 824, 38, 38, TEAL_100, 12, parent=fid, name="Notes icon"))
    c.append(icon("messageSquare", 314, 834, 18, TEAL_700, 1.9, parent=fid))
    c.append(text(354, 824, "Catatan guru", 13.5, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(354, 844, "3 catatan terbaru · pembaruan 2 hari lalu", 8.5, MUTED, 400, parent=fid))
    c.append(text(920, 834, "Semua catatan  →", 8.5, TEAL_700, 600, parent=fid))
    notes = [
        ("Raka Pradana", "Matematika", "Aisyah sangat aktif saat diskusi fungsi kuadrat. Pertahankan rasa ingin tahunya.", "2 hari lalu", AMBER_500),
        ("Intan Maharani", "Bahasa Indonesia", "Resume teks eksposisi rapi dan argumentatif. Perlu latihan menyunting kalimat.", "4 hari lalu", BLUE_600),
    ]
    for i, (nm, subj, body, when, col) in enumerate(notes):
        y = 876 + i * 52
        c += avatar(304, y, 28, "RP" if i == 0 else "IM", bg=col, parent=fid)
        c.append(text(342, y + 1, nm, 8.5, INK, 700, parent=fid))
        c.append(text(430, y + 2, f"{subj} · {when}", 7.5, MUTED, 400, parent=fid))
        c.append(text(342, y + 17, body, 8.2, "#475569", 400, width=620, parent=fid))

    # tasks
    c.append(card(1032, 804, 376, 188, parent=fid, name="Parent tasks"))
    c.append(text(1056, 824, "Tugas terdekat", 13.5, INK, 700, family=DISPLAY, parent=fid))
    c.append(rect(1332, 824, 26, 24, AMBER_100, 12, parent=fid, name="Task count"))
    c.append(text(1341, 830, "2", 8, AMBER_700, 700, parent=fid))
    for i, (title, subj, due) in enumerate([("Latihan Bab 3: Fungsi Kuadrat", "Matematika · besok", "Prioritas"), ("Proyek Statistika", "Matematika · 9 hari", "Tenang")]):
        y = 860 + i * 58
        c.append(rect(1056, y, 328, 48, "#F8FAFD", 12, parent=fid, name=f"Task / {title}"))
        c.append(text(1070, y + 7, title, 8.5, INK, 700, parent=fid))
        c.append(text(1070, y + 22, subj, 7.5, MUTED, 400, parent=fid))
        c.append(rect(1306, y + 12, 62, 22, AMBER_100 if i == 0 else GREEN_100, 11, parent=fid, name="Due"))
        c.append(text(1316, y + 18, due, 7.5, AMBER_700 if i == 0 else GREEN_600, 700, parent=fid))
    run(c)


def page_admin():
    new_page("09 — Admin control", background=CANVAS)
    fid = add_screen("Admin / Home", 1440, 1024, fill=CANVAS)
    c = page_canvas("Admin home", "admin", "Beranda", ADMIN_NAV, 0, fid)

    hx, hy, hw, hh = 280, 96, 728, 240
    c.append(rect(hx, hy, hw, hh, gradient=["#1B1038", "#4C1D95", "#6D28D9"], radius=24, parent=fid, name="Hero / admin"))
    c.append(ellipse(hx + 480, hy - 90, 320, 320, "#FFFFFF0C", parent=fid, name="Hero orbit"))
    c.append(rect(hx + 28, hy + 24, 110, 24, "#FFFFFF16", 12, parent=fid, name="Health badge"))
    c.append(ellipse(hx + 42, hy + 33, 6, 6, GREEN_600, parent=fid))
    c.append(text(hx + 54, hy + 30, "Sistem sehat", 8.5, "#EDE4FF", 700, parent=fid))
    c.append(text(hx + 156, hy + 30, "Uptime 412 jam · 38 ms", 8, "#C9B8F5", 500, parent=fid))
    c.append(text(hx + 28, hy + 62, "Selamat pagi,", 11, "#D7C9FF", 500, parent=fid))
    c.append(text(hx + 28, hy + 80, "Admin, ekosistem terkendali.", 27, WHITE, 600, family=DISPLAY, parent=fid, tracking=-0.3))
    c.append(text(hx + 28, hy + 122, "1.284 akun aktif, 67 buku SIBI tersinkron, dan 3 sesi live berjalan. Pantau kesehatan sistem dan aktivitas pengguna dari sini.", 10.5, "#E2D8FF", 400, width=530, parent=fid, line_height="150%"))
    bs, _ = button(hx + 28, hy + 178, "Kelola pengguna", "white", parent=fid, icon_name="userPlus", role="admin", w=156, h=42)
    c += bs
    bs, _ = button(hx + 198, hy + 178, "Analitik sistem", "outline", parent=fid, icon_name="activity", role="admin", w=154, h=42)
    c += bs

    # sync
    sx, sy, sw, sh = 1032, 96, 376, 240
    c.append(card(sx, sy, sw, sh, parent=fid, name="Sync card"))
    c.append(rect(sx + 22, sy + 20, 40, 40, VIOLET_100, 12, parent=fid, name="Sync icon"))
    c.append(icon("cloudDownload", sx + 32, sy + 30, 20, VIOLET_700, 1.9, parent=fid))
    c.append(text(sx + 74, sy + 20, "Sinkronisasi SIBI", 12.5, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(sx + 74, sy + 40, "api.buku.kemendikdasmen.go.id", 7.5, MUTED, 400, parent=fid))
    c.append(rect(sx + 292, sy + 24, 62, 24, GREEN_100, 12, parent=fid, name="Sync badge"))
    c.append(text(sx + 302, sy + 30, "Sinkron", 8, GREEN_600, 700, parent=fid))
    for i, (lab, val, col) in enumerate([("Buku tersinkron", "67", INK), ("Konflik", "0", GREEN_600)]):
        c.append(rect(sx + 22 + i * 164, sy + 72, 152, 58, "#F7F9FC", 12, parent=fid, name=f"Sync stat / {lab}"))
        c.append(text(sx + 36 + i * 164, sy + 82, lab, 8, MUTED, 500, parent=fid))
        c.append(text(sx + 36 + i * 164, sy + 98, val, 22, col, 700, family=DISPLAY, parent=fid))
    c.append(icon("checkCircle", sx + 22, sy + 144, 13, GREEN_600, 2, parent=fid))
    c.append(text(sx + 42, sy + 142, "Terakhir: hari ini, 07.45", 8, MUTED, 500, parent=fid))
    bs, _ = button(sx + 22, sy + 172, "Sinkronkan sekarang", "primary", parent=fid, icon_name="refresh", role="admin", w=332, h=42)
    c += bs

    # stats
    stats = [
        ("Total pengguna", "1.284", "1.196 aktif", "users", VIOLET_100, VIOLET_700),
        ("Buku SIBI", "67", "katalog tersinkron", "bookOpen", BLUE_100, BLUE_700),
        ("Kelas & rombel", "36", "tahun ajaran 2025/2026", "school", GREEN_100, GREEN_600),
        ("Sesi live", "3", "sedang berlangsung", "video", AMBER_100, AMBER_700),
    ]
    for i, (label, value, hint, ic, bg, fg) in enumerate(stats):
        x = 280 + i * 286
        c.append(card(x, 356, 270, 100, parent=fid, name=f"Admin stat / {label}"))
        c.append(rect(x + 16, 372, 38, 38, bg, 12, parent=fid, name="Stat icon"))
        c.append(icon(ic, x + 26, 382, 18, fg, 1.9, parent=fid))
        c.append(text(x + 66, 370, label, 9, MUTED, 500, parent=fid))
        c.append(text(x + 66, 386, value, 20, INK, 700, family=DISPLAY, parent=fid))
        c.append(text(x + 66, 416, hint, 8.5, MUTED, 400, parent=fid))

    # growth chart
    c.append(card(280, 480, 728, 300, parent=fid, name="Growth chart"))
    c += section_heading(304, 504, "Pertumbuhan pengguna", "Enam bulan terakhir", parent=fid, accent=VIOLET_700, action="+195% siswa")
    c += line_chart(324, 574, 624, 128, [840, 1120, 1480, 1860, 2240, 2480], color=VIOLET_500, labels=["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"], secondary=[320, 410, 560, 720, 910, 1040], secondary_color=AMBER_500, parent=fid, end_value="2.480")
    c.append(rect(304, 736, 460, 26, VIOLET_100, 13, parent=fid, name="Chart note"))
    c.append(icon("trendingUp", 318, 742, 14, VIOLET_700, 1.9, parent=fid))
    c.append(text(338, 743, "Pertumbuhan siswa stabil; rasio orang tua ikut naik.", 8.5, VIOLET_700, 600, parent=fid))

    # roles donut
    c.append(card(1032, 480, 376, 300, parent=fid, name="Role distribution"))
    c.append(text(1056, 504, "Komposisi peran", 14, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(1056, 524, "Distribusi akun terdaftar", 8.5, MUTED, 400, parent=fid))
    c += donut_chart(1220, 612, 70, [
        {"label": "Siswa", "value": 980, "color": BLUE_600},
        {"label": "Guru", "value": 120, "color": AMBER_500},
        {"label": "Orang tua", "value": 160, "color": TEAL_500},
        {"label": "Admin", "value": 24, "color": VIOLET_500},
    ], parent=fid, thickness=18, center_value="1.284", center_label="akun")
    for i, (lab, col, val) in enumerate([("Siswa", BLUE_600, "980"), ("Guru", AMBER_500, "120"), ("Orang tua", TEAL_500, "160"), ("Admin", VIOLET_500, "24")]):
        x = 1056 + (i % 2) * 160
        y = 696 + (i // 2) * 34
        c.append(rect(x, y, 10, 10, col, 3, parent=fid, name="Legend"))
        c.append(text(x + 18, y - 2, f"{lab} · {val}", 8.5, MUTED, 500, parent=fid))

    # audit log
    c.append(card(280, 804, 728, 188, parent=fid, name="Audit log"))
    c.append(rect(304, 824, 38, 38, VIOLET_100, 12, parent=fid, name="Audit icon"))
    c.append(icon("activity", 314, 834, 18, VIOLET_700, 1.9, parent=fid))
    c.append(text(354, 824, "Aktivitas terbaru", 13.5, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(354, 844, "Audit log sistem", 8.5, MUTED, 400, parent=fid))
    c.append(text(920, 834, "Semua log  →", 8.5, VIOLET_700, 600, parent=fid))
    logs = [
        ("Aisyah Putri", "menyelesaikan kuis", "Kuis Bab 3 — Fungsi Kuadrat", "student", BLUE_600, "12 mnt lalu"),
        ("Raka Pradana", "memulai kelas live", "Matematika · Bab 3", "teacher", AMBER_500, "18 mnt lalu"),
        ("Admin SIBI", "menyinkronkan katalog", "67 buku SIBI", "admin", VIOLET_500, "1 jam lalu"),
    ]
    for i, (actor, action, target, role, col, when) in enumerate(logs):
        y = 872 + i * 38
        c += avatar(304, y, 26, actor.split()[0][0] + actor.split()[-1][0], bg=col, parent=fid)
        c.append(text(340, y + 1, actor, 8.5, INK, 700, parent=fid))
        c.append(text(482, y + 1, action, 8.2, MUTED, 400, parent=fid))
        c.append(text(560, y + 1, target, 8.2, "#475569", 500, parent=fid))
        c.append(rect(848, y, 60, 20, "#F2F5FA", 10, parent=fid, name="Role"))
        c.append(text(856, y + 5, role, 7, MUTED, 600, parent=fid))
        c.append(text(918, y + 1, when, 7.5, MUTED, 400, width=66, align="right", parent=fid))

    # health
    c.append(card(1032, 804, 376, 188, parent=fid, name="System health"))
    c.append(text(1056, 824, "Kesehatan sistem", 13.5, INK, 700, family=DISPLAY, parent=fid))
    health = [("API gateway", "Operasional", "gauge"), ("Realtime socket", "Terhubung", "layers"), ("Database", "PostgreSQL · sehat", "database"), ("Penyimpanan", "64 GB · 62%", "server")]
    for i, (lab, val, ic) in enumerate(health):
        y = 856 + i * 31
        c.append(rect(1056, y, 26, 26, "#F7F9FC", 8, parent=fid, name="Health icon"))
        c.append(icon(ic, 1061, y + 5, 15, MUTED, 1.9, parent=fid))
        c.append(text(1092, y + 3, lab, 8.5, MUTED, 500, parent=fid))
        c.append(text(1216, y + 3, val, 8, GREEN_600 if i < 3 else AMBER_700, 700, width=168, align="right", parent=fid))
    run(c)


def page_auth():
    new_page("10 — Sign in", background=SURFACE)
    fid = add_screen("Auth / Sign in", 1440, 1024, fill=SURFACE)
    c = [rect(0, 0, 1440, 1024, SURFACE, 0, parent=fid, name="Canvas")]
    # left brand panel
    c.append(rect(0, 0, 820, 1024, gradient=["#06162E", "#0A2A52", "#0D47A1"], parent=fid, name="Brand panel"))
    for gx in range(0, 820, 80):
        c.append(rect(gx, 0, 1, 1024, "#FFFFFF07", 0, parent=fid, name="Grid line"))
    for gy in range(0, 1024, 80):
        c.append(rect(0, gy, 820, 1, "#FFFFFF07", 0, parent=fid, name="Grid line"))
    c.append(ellipse(470, -200, 560, 560, "#1E88E520", parent=fid, name="Glow"))
    c.append(ellipse(-140, 640, 460, 460, "#FFB30018", parent=fid, name="Amber glow"))
    c += logo_mark(64, 60, 42, bg=AMBER_500, fg=INK, parent=fid, radius=13)
    c.append(text(118, 64, "SiGEMAS", 22, WHITE, 700, family=DISPLAY, parent=fid))
    c.append(text(118, 94, "SISTEM GERBANG MATERI SEKOLAH", 7.5, "#C9DCF5", 700, tracking=1.0, parent=fid, opacity=0.7))
    c.append(text(64, 258, "Belajar, mengajar,", 48, WHITE, 600, family=DISPLAY, parent=fid, tracking=-1.0))
    c.append(text(64, 316, "dan tumbuh", 48, AMBER_500, 600, family=DISPLAY, parent=fid, tracking=-1.0))
    c.append(text(64, 374, "dalam satu ruang.", 48, WHITE, 600, family=DISPLAY, parent=fid, tracking=-1.0))
    c.append(text(66, 456, "Satu ekosistem yang menghubungkan buku SIBI, kelas live, penilaian, dan pendampingan orang tua — tanpa membuat guru kehilangan fokus.", 13, "#C9DCF5", 400, width=560, parent=fid, line_height="160%"))
    # floating feature cards
    features = [
        (68, 556, 220, 128, "bookOpen", "Buku SIBI", "67 judul resmi, siap dibaca"),
        (306, 588, 220, 128, "video", "Kelas live", "Video guru + papan tulis"),
        (100, 714, 220, 128, "sparkles", "AI pendamping", "Ringkas, tanya, dan latihan"),
    ]
    for x, y, w, h, ic, title, desc in features:
        c.append(rect(x, y, w, h, "#FFFFFF0F", 20, stroke="#FFFFFF18", parent=fid, name=f"Feature / {title}", effects=SHADOW_MD))
        c.append(rect(x + 16, y + 16, 36, 36, "#FFFFFF14", 11, parent=fid, name="Feature icon"))
        c.append(icon(ic, x + 26, y + 26, 17, AMBER_500, 1.8, parent=fid))
        c.append(text(x + 16, y + 62, title, 12, WHITE, 700, family=DISPLAY, parent=fid))
        c.append(text(x + 16, y + 82, desc, 8.5, "#C9DCF5", 400, width=w - 32, parent=fid, line_height="135%"))
    c.append(text(64, 944, "“Teknologi seharusnya mengurangi beban, bukan menambahnya.”", 11, "#9FC2EC", 500, family=DISPLAY, parent=fid))
    c.append(text(64, 968, "Tim SiGEMAS · Prototype 2026", 8.5, "#7EA4D8", 500, parent=fid, opacity=0.7))
    # login card
    c.append(rect(916, 116, 428, 792, SURFACE, 26, stroke=LINE, parent=fid, name="Login card", effects=SHADOW_MD))
    c += logo_mark(948, 148, 34, bg=BLUE_600, fg=WHITE, parent=fid)
    c.append(text(992, 152, "SiGEMAS", 15, INK, 700, family=DISPLAY, parent=fid))
    c.append(text(948, 210, "Selamat datang kembali", 27, INK, 700, family=DISPLAY, parent=fid, tracking=-0.5))
    c.append(text(948, 248, "Masuk untuk melanjutkan ruang belajar Anda.", 10, MUTED, 400, parent=fid))
    c.append(text(948, 292, "Email sekolah", 9, INK, 700, parent=fid))
    c.append(rect(948, 310, 364, 46, "#F8FAFD", 12, stroke=LINE, parent=fid, name="Email input"))
    c.append(icon("messageSquare", 964, 325, 16, MUTED_2, 1.8, parent=fid))
    c.append(text(990, 324, "aisyah@sigemas.id", 10.5, INK, 500, parent=fid))
    c.append(text(948, 376, "Kata sandi", 9, INK, 700, parent=fid))
    c.append(text(1312, 376, "Lupa kata sandi?", 8, BLUE_700, 600, width=100, align="right", parent=fid))
    c.append(rect(948, 394, 364, 46, "#F8FAFD", 12, stroke=BLUE_600, sw=1.5, parent=fid, name="Password input"))
    c.append(icon("lock", 964, 409, 16, MUTED_2, 1.8, parent=fid))
    c.append(text(990, 408, "••••••••••", 12, INK, 500, parent=fid))
    c.append(icon("eye", 1276, 409, 16, MUTED_2, 1.8, parent=fid))
    c.append(rect(948, 458, 18, 18, BLUE_600, 5, parent=fid, name="Remember checkbox"))
    c.append(icon("check", 952, 462, 10, WHITE, 2.4, parent=fid))
    c.append(text(974, 460, "Ingat saya di perangkat ini", 9, MUTED, 500, parent=fid))
    bs, _ = button(948, 500, "Masuk ke SiGEMAS", "primary", parent=fid, w=364, h=46, icon_name="arrowRight", role="student", size=11)
    c += bs
    c.append(rect(948, 572, 364, 1, LINE, 0, parent=fid, name="Divider"))
    c.append(text(1084, 584, "atau coba akun demo", 8.5, MUTED, 500, parent=fid))
    demo = [("Siswa", "AP", BLUE_600), ("Guru", "RP", AMBER_500), ("Orang tua", "SW", TEAL_500), ("Admin", "AD", VIOLET_500)]
    for i, (lab, ini, col) in enumerate(demo):
        x = 948 + (i % 2) * 186
        y = 616 + (i // 2) * 56
        c.append(rect(x, y, 178, 46, "#F8FAFD", 12, stroke=LINE, parent=fid, name=f"Demo / {lab}"))
        c += avatar(x + 10, y + 8, 30, ini, bg=col, parent=fid)
        c.append(text(x + 50, y + 10, lab, 9, INK, 700, parent=fid))
        c.append(text(x + 50, y + 24, "demo1234", 7.5, MUTED, 400, parent=fid))
    c.append(rect(948, 744, 364, 58, BLUE_50, 14, parent=fid, name="Demo note"))
    c.append(icon("info", 962, 760, 16, BLUE_700, 1.8, parent=fid))
    c.append(text(984, 758, "Satu kata sandi untuk semua peran.", 8.5, BLUE_800, 700, parent=fid))
    c.append(text(984, 774, "Gunakan akun demo untuk menjelajah produk.", 8.5, MUTED, 400, parent=fid))
    c.append(text(948, 846, "Dengan masuk, Anda menyetujui kebijakan privasi dan ketentuan layanan SiGEMAS.", 7.2, MUTED_2, 400, width=364, align="center", parent=fid))
    c.append(text(948, 874, "Butuh bantuan? Hubungi admin sekolah", 8, BLUE_700, 600, width=364, align="center", parent=fid))
    run(c)
