"""Friendly-clean pages: cover, foundations, student home, catalog, reader."""
from friendly_ui import *


def page_cover_v2():
    new_page("V2 00 — Cover", first=True, background=CREAM)
    fid = add_screen("Cover / Friendly clean", 1920, 1080, fill=CREAM)
    c = [frect(0, 0, 1920, 1080, fill=CREAM, parent=fid, name="Background")]
    # soft organic shapes
    c.append(ellipse(1290, -310, 860, 860, BLUE_PALE, parent=fid, name="Blue blob"))
    c.append(ellipse(-260, 690, 620, 620, AMBER_SOFT, parent=fid, name="Amber blob"))
    c.append(ellipse(1580, 700, 300, 300, GREEN_SOFT, parent=fid, name="Green blob"))
    # brand
    c += flogo(92, 66, 50, bg=BLUE, parent=fid, radius=16)
    c.append(ftext(158, 70, "SiGEMAS", 28, INK, 700, family=DISPLAY, parent=fid, tracking=-0.4))
    c.append(ftext(158, 106, "Ruang belajar yang terasa manusiawi", 11, MUTED, 500, parent=fid))
    c.append(ftext(1490, 72, "UI/UX REDESIGN", 9.5, BLUE_DEEP, 700, tracking=1.4, parent=fid))
    c.append(ftext(1490, 94, "Friendly clean · v2.0", 10, MUTED, 500, parent=fid))
    # headline
    c.append(ftext(92, 236, "Belajar tidak", 68, INK, 600, family=DISPLAY, parent=fid, tracking=-1.5))
    c.append(ftext(92, 316, "harus terasa berat.", 68, BLUE_DEEP, 600, family=DISPLAY, parent=fid, tracking=-1.5))
    c.append(ftext(96, 434, "Satu tempat yang tenang untuk membaca, bertanya, dan tumbuh — untuk siswa, guru, dan orang tua.", 17, MUTED, 400, width=560, parent=fid, line_height="160%"))
    # inline values
    for i, (ic, label) in enumerate([("heart", "Ramah"), ("bookOpen", "Fokus"), ("users", "Terhubung")]):
        x = 96 + i * 150
        c.append(frect(x, 548, 136, 44, fill=PAPER, radius=22, stroke=LINE, parent=fid, name=f"Value / {label}"))
        c.append(ficon(ic, x + 16, 559, 18, BLUE, 1.9, parent=fid))
        c.append(ftext(x + 42, 561, label, 10.5, INK, 600, parent=fid))
    # main art card
    c.append(frect(760, 176, 1030, 704, fill=PAPER, radius=40, parent=fid, name="Preview card", effects=SH_LG))
    # mini student dashboard inside
    c.append(frect(796, 212, 958, 632, fill=CREAM, radius=28, parent=fid, name="Preview screen"))
    c.append(frect(796, 212, 210, 632, fill="#FBFAF6", radius=28, parent=fid, name="Preview sidebar"))
    c += flogo(826, 240, 34, bg=BLUE, parent=fid)
    c.append(ftext(870, 246, "SiGEMAS", 16, INK, 700, family=DISPLAY, parent=fid))
    for i, label in enumerate(["Beranda", "Katalog", "Kelas Live", "Kuis", "Jadwal"]):
        y = 310 + i * 45
        if i == 0:
            c.append(frect(816, y - 4, 170, 38, fill=BLUE_SOFT, radius=12, parent=fid, name="Preview nav active"))
        c.append(ficon(["home", "library", "radio", "trophy", "calendarDays"][i], 832, y + 6, 16, BLUE_DEEP if i == 0 else MUTED, 1.9, parent=fid))
        c.append(ftext(858, y + 8, label, 10.5, BLUE_DEEP if i == 0 else INK_2, 600 if i == 0 else 500, parent=fid))
    # preview content
    c.append(ftext(1040, 244, "Halo, Aisyah", 12, MUTED, 500, parent=fid))
    c.append(ftext(1040, 264, "Mau lanjut belajar apa?", 24, INK, 600, family=DISPLAY, parent=fid))
    c.append(frect(1034, 314, 680, 184, fill=BLUE, radius=24, parent=fid, name="Preview hero"))
    c.append(ftext(1060, 338, "KELAS LIVE · MATEMATIKA", 8.5, "#D9E6FF", 700, tracking=0.8, parent=fid))
    c.append(ftext(1060, 360, "Fungsi Kuadrat", 27, PAPER, 600, family=DISPLAY, parent=fid))
    c.append(ftext(1060, 396, "Bersama Pak Raka · 27 siswa sudah bergabung", 10.5, "#D9E6FF", 400, parent=fid))
    bs, _ = fbutton(1060, 430, "Gabung kelas", "white", parent=fid, w=136, h=38, icon_name="play", role="student", size=10)
    c += bs
    # preview cards
    c.append(ftext(1040, 528, "Lanjutkan belajar", 13, INK, 700, family=DISPLAY, parent=fid))
    c.append(frect(1034, 558, 320, 150, fill=PAPER, radius=20, parent=fid, name="Preview book card", effects=SH_SM))
    c += fbook_cover(1050, 574, 54, 118, "Matematika X", "Matematika", ["#3D7BFA", "#2451B7"], fid, radius=8)
    c.append(ftext(1120, 582, "Matematika Kelas X", 11, INK, 700, parent=fid))
    c.append(ftext(1120, 600, "Bab 3 · Fungsi Kuadrat", 8.5, MUTED, 400, parent=fid))
    c += fprogress(1120, 630, 210, 68, BLUE, parent=fid, h=7)
    c.append(ftext(1120, 648, "68% selesai", 8, BLUE_DEEP, 600, parent=fid))
    c.append(ftext(1120, 672, "Lanjut baca  →", 8.5, BLUE_DEEP, 700, parent=fid))
    # preview side note
    c.append(frect(1374, 558, 340, 150, fill=AMBER_SOFT, radius=20, parent=fid, name="Preview note"))
    c.append(ficon("sun", 1394, 578, 22, AMBER_DEEP, 1.9, parent=fid))
    c.append(ftext(1424, 578, "Pelan-pelan saja", 12, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(1394, 608, "15 menit hari ini sudah cukup.\nKonsisten lebih penting\ndaripada cepat.", 10, INK_2, 400, width=280, parent=fid, line_height="150%"))
    # mascot sitting on card edge
    c += fmascot(1490, 840, 140, parent=fid, accent=BLUE, soft=BLUE_SOFT)
    # caption
    c.append(ftext(92, 944, "Lebih sedikit kartu. Lebih banyak ruang untuk berpikir.", 15, INK_2, 600, family=DISPLAY, parent=fid))
    c.append(ftext(92, 974, "Friendly clean · dirancang untuk mengurangi beban kognitif, bukan menambahnya.", 11, MUTED, 400, parent=fid))
    run(c)


def page_foundations_v2():
    new_page("V2 01 — Foundations", background=CREAM)
    fid = add_screen("Foundations / Friendly clean", 1920, 1200, fill=CREAM)
    c = [frect(0, 0, 1920, 1200, fill=CREAM, parent=fid, name="Canvas")]
    c += flogo(80, 58, 42, bg=BLUE, parent=fid, radius=14)
    c.append(ftext(134, 64, "SiGEMAS", 20, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(80, 132, "01 / Foundations", 48, INK, 700, family=DISPLAY, parent=fid, tracking=-0.8))
    c.append(ftext(82, 196, "Satu bahasa visual yang tenang: warna lembut, huruf besar, ruang lega, dan kontrol yang terasa ramah.", 14, MUTED, 400, width=1000, parent=fid))
    # palette
    c.append(fcard(80, 250, 1760, 260, parent=fid, radius=28, name="Colour card"))
    c.append(ftext(112, 278, "Warna", 20, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(112, 306, "Satu warna utama per peran. Warna lain hanya untuk status, bukan dekorasi.", 11, MUTED, 400, parent=fid))
    swatches = [
        ("Blue", BLUE, "Siswa · aksi utama"), ("Amber", AMBER, "Guru · energi"),
        ("Green", GREEN, "Orang tua · tumbuh"), ("Lavender", LAVENDER, "Admin · sistem"),
        ("Cream", CREAM, "Latar hangat"), ("Ink", INK, "Teks utama"),
        ("Line", LINE, "Garis lembut"), ("Coral", CORAL, "Perhatian"),
    ]
    for i, (nm, col, use) in enumerate(swatches):
        sx = 112 + i * 209
        c.append(frect(sx, 340, 188, 82, fill=col, radius=18, stroke=LINE if col in (CREAM, PAPER, LINE) else None, parent=fid, name=f"Swatch / {nm}"))
        c.append(ftext(sx, 434, nm, 11, INK, 700, parent=fid))
        c.append(ftext(sx, 452, use, 9, MUTED, 400, parent=fid))
    # typography
    c.append(fcard(80, 540, 850, 300, parent=fid, radius=28, name="Type card"))
    c.append(ftext(112, 568, "Tipografi", 20, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(112, 596, "Poppins untuk judul yang hangat. Inter untuk bacaan panjang.", 11, MUTED, 400, parent=fid))
    c.append(ftext(112, 632, "Aa", 74, BLUE_DEEP, 600, family=DISPLAY, parent=fid, line_height="100%"))
    c.append(ftext(112, 724, "Poppins / 600", 10, BLUE_DEEP, 700, parent=fid))
    c.append(ftext(112, 742, "Judul, angka besar, momen brand", 9, MUTED, 400, parent=fid))
    rows = [("Headline 40", "Belajar terasa ringan", 30, DISPLAY, 600), ("Title 20", "Lanjutkan belajar", 18, DISPLAY, 600), ("Body 14", "Materi yang dekat dengan kehidupan sehari-hari.", 13, FONT, 400), ("Label 10", "KELAS LIVE · 27 SISWA", 9, FONT, 700)]
    yy = 632
    for lab, sample, sz, fam, wt in rows:
        c.append(ftext(500, yy, lab, 9, SOFT, 600, parent=fid))
        c.append(ftext(500, yy + 18, sample, sz, INK, wt, family=fam, width=390, parent=fid))
        yy += 48
    # controls
    c.append(fcard(958, 540, 882, 300, parent=fid, radius=28, name="Controls card"))
    c.append(ftext(990, 568, "Kontrol", 20, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(990, 596, "Bentuk membulat, label jelas, target sentuh besar.", 11, MUTED, 400, parent=fid))
    bx = 990
    for label, variant in [("Mulai belajar", "primary"), ("Lihat jadwal", "outline"), ("Tanya guru", "soft")]:
        bs, bw = fbutton(bx, 632, label, variant=variant, parent=fid, role="student", w=160, h=46)
        c += bs
        bx += 176
    c.append(ftext(990, 704, "Input", 9, SOFT, 700, tracking=0.6, parent=fid))
    c.append(frect(990, 724, 386, 46, fill=PAPER, radius=14, stroke=LINE, parent=fid, name="Input default"))
    c.append(ftext(1008, 738, "Email sekolah", 11, SOFT, 400, parent=fid))
    c.append(frect(1400, 724, 386, 46, fill=PAPER, radius=14, stroke=BLUE, sw=1.5, parent=fid, name="Input focus"))
    c.append(ftext(1418, 738, "aisyah@sigemas.id", 11, INK, 500, parent=fid))
    c.append(ftext(990, 794, "Status yang ramah", 9, SOFT, 700, tracking=0.6, parent=fid))
    for i, (lab, bg, fg) in enumerate([("Hadir", GREEN_SOFT, GREEN_DEEP), ("Besok", AMBER_SOFT, AMBER_DEEP), ("Selesai", BLUE_SOFT, BLUE_DEEP)]):
        ps, _ = fpill(990 + i * 132, 816, lab, bg, fg, parent=fid, dot=True)
        c += ps
    # components bottom
    c.append(fcard(80, 870, 560, 260, parent=fid, radius=28, name="Space card"))
    c.append(ftext(112, 898, "Ruang & radius", 20, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(112, 926, "Lebih banyak ruang kosong adalah fitur, bukan sisa tempat.", 10, MUTED, 400, width=470, parent=fid))
    for i, r in enumerate([12, 18, 24, 32]):
        x = 112 + i * 122
        c.append(frect(x, 962, 104, 88, fill=BLUE_SOFT, radius=r, parent=fid, name=f"Radius / {r}"))
        c.append(ftext(x, 1062, f"r{r}", 9, MUTED, 600, width=104, align="center", parent=fid))
    c.append(fcard(668, 870, 560, 260, parent=fid, radius=28, name="Icon card"))
    c.append(ftext(700, 898, "Ikon", 20, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(700, 926, "Garis tipis, ukuran 18–22 px, tidak pernah ramai.", 10, MUTED, 400, parent=fid))
    for i, ic in enumerate(["home", "bookOpen", "radio", "trophy", "calendarDays", "sparkles", "heart", "sun"]):
        x = 700 + (i % 4) * 102
        y = 960 + (i // 4) * 70
        c.append(frect(x, y, 54, 54, fill=BLUE_PALE, radius=17, parent=fid, name=f"Icon tile / {ic}"))
        c.append(ficon(ic, x + 17, y + 17, 20, BLUE_DEEP, 1.9, parent=fid))
    c.append(fcard(1256, 870, 584, 260, parent=fid, radius=28, name="Mascot card"))
    c.append(ftext(1288, 898, "Sedikit karakter", 20, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(1288, 926, "Maskot hanya hadir di momen emosional, bukan di setiap layar.", 10, MUTED, 400, width=500, parent=fid))
    c += fmascot(1600, 944, 138, parent=fid, accent=BLUE, soft=BLUE_SOFT)
    c.append(ftext(1288, 1000, "Gunakan untuk:\n• sapaan pertama\n• perayaan progres\n• empty state", 10, INK_2, 500, width=250, parent=fid, line_height="160%"))
    run(c)


def page_student_home_v2():
    new_page("V2 02 — Student home", background=CREAM)
    fid = add_screen("Student / Home friendly", 1440, 1024, fill=CREAM)
    c = fpage("student", "Halo, Aisyah", 0, STUDENT_NAV2, fid, subtitle="Senin, 10 November · X IPA 2", search="Cari buku atau materi...", avatar_text="AP")

    # hero
    hx, hy, hw, hh = 252, 112, 756, 276
    c.append(frect(hx, hy, hw, hh, fill=BLUE, radius=30, parent=fid, name="Hero / student"))
    c.append(ellipse(hx + 520, hy - 80, 330, 330, "#FFFFFF12", parent=fid, name="Hero blob"))
    c.append(ellipse(hx + 600, hy + 120, 200, 200, "#FFFFFF0D", parent=fid, name="Hero blob"))
    c.append(ftext(hx + 34, hy + 32, "Selamat pagi, Aisyah", 12, "#D9E6FF", 500, parent=fid))
    c.append(ftext(hx + 34, hy + 52, "Siap belajar pelan-pelan hari ini?", 31, PAPER, 600, family=DISPLAY, parent=fid, tracking=-0.5))
    c.append(ftext(hx + 34, hy + 102, "Kamu sudah 12 hari konsisten. Lanjutkan satu bab saja, lalu istirahat.", 11.5, "#D9E6FF", 400, width=470, parent=fid, line_height="155%"))
    bs, _ = fbutton(hx + 34, hy + 154, "Lanjutkan membaca", "white", parent=fid, w=182, h=44, icon_name="bookOpen", role="student", size=11)
    c += bs
    bs, _ = fbutton(hx + 230, hy + 154, "Lihat jadwal", "ghost", parent=fid, w=142, h=44, icon_name="calendarDays", role="student", size=11)
    # soft stats inline
    for i, (lab, val) in enumerate([("Streak", "12 hari"), ("Jam belajar", "7,5 jam"), ("Peringkat", "#3")]):
        x = hx + 34 + i * 150
        c.append(ftext(x, hy + 224, lab, 9, "#C7DAFF", 500, parent=fid))
        c.append(ftext(x, hy + 240, val, 15, PAPER, 700, family=DISPLAY, parent=fid))
    # mascot corner
    c += fmascot(hx + 620, hy + 96, 150, parent=fid, accent=BLUE, soft="#DCE9FF")

    # today note
    nx, ny, nw, nh = 1032, 112, 376, 276
    c.append(fcard(nx, ny, nw, nh, parent=fid, radius=30, name="Today card"))
    c.append(ficon("sun", nx + 26, ny + 24, 22, AMBER, 1.9, parent=fid))
    c.append(ftext(nx + 56, ny + 24, "Hari ini", 17, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(nx + 26, ny + 62, "Cukup 20 menit.", 13, INK, 600, parent=fid))
    c.append(ftext(nx + 26, ny + 84, "Tidak perlu mengejar semua.", 10.5, MUTED, 400, parent=fid))
    for i, (label, done) in enumerate([("Baca 1 bab Matematika", False), ("Ulangi 5 kartu", True), ("Cek tugas besok", False)]):
        y = ny + 124 + i * 42
        c.append(frect(nx + 26, y, 324, 34, fill="#FAF9F6", radius=12, parent=fid, name=f"Today item / {label}"))
        c.append(ellipse(nx + 40, y + 9, 16, 16, GREEN if done else "#FFFFFF", parent=fid, name="Check", stroke=None if done else LINE, sw=1))
        if done:
            c.append(ficon("check", nx + 43, y + 12, 10, PAPER, 2.8, parent=fid))
        c.append(ftext(nx + 66, y + 9, label, 10, MUTED if done else INK, 600 if not done else 500, parent=fid))

    # continue learning
    c += fsection(252, 426, "Lanjutkan belajar", "Buku yang sedang kamu baca", parent=fid, action="Semua buku  →", accent=BLUE_DEEP)
    books = [
        ("Matematika Kelas X", "Matematika", 68, ["#3D7BFA", "#2451B7"]),
        ("Bahasa Indonesia", "Bahasa Indonesia", 42, ["#F5A623", "#C77A0A"]),
    ]
    for i, (title, subject, pct, grad) in enumerate(books):
        x = 252 + i * 572
        y = 464
        w, h = 548, 194
        c.append(fcard(x, y, w, h, parent=fid, radius=26, name=f"Book card / {title}"))
        c += fbook_cover(x + 24, y + 24, 92, 146, title, subject, grad, fid, radius=12)
        c.append(ftext(x + 140, y + 34, title, 16, INK, 700, family=DISPLAY, parent=fid))
        c.append(ftext(x + 140, y + 60, "Bab 3 · Fungsi Kuadrat" if i == 0 else "Bab 2 · Teks Eksposisi", 10, MUTED, 400, parent=fid))
        c += fprogress(x + 140, y + 100, 360, pct, BLUE if i == 0 else AMBER, parent=fid, h=8)
        c.append(ftext(x + 140, y + 120, f"{pct}% selesai", 9, BLUE_DEEP if i == 0 else AMBER_DEEP, 600, parent=fid))
        c.append(ftext(x + 140, y + 150, "Lanjut baca  →", 10, BLUE_DEEP if i == 0 else AMBER_DEEP, 700, parent=fid))

    # schedule
    c.append(fcard(252, 690, 756, 282, parent=fid, radius=28, name="Schedule card"))
    c.append(ftext(282, 716, "Jadwal hari ini", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(282, 744, "Tidak perlu buru-buru.", 10.5, MUTED, 400, parent=fid))
    items = [("07.30", "Matematika", "R-204 · Pak Raka", "Sekarang", BLUE_SOFT, BLUE_DEEP), ("09.15", "Bahasa Indonesia", "R-204 · Bu Intan", "Berikutnya", AMBER_SOFT, AMBER_DEEP), ("12.45", "Informatika", "Lab Komputer", "Siang", GREEN_SOFT, GREEN_DEEP)]
    for i, (time, subj, room, tag, bg, fg) in enumerate(items):
        y = 778 + i * 56
        c.append(frect(282, y, 696, 46, fill="#FAF9F6", radius=14, parent=fid, name=f"Schedule / {subj}"))
        c.append(ftext(298, y + 10, time, 10, MUTED, 600, parent=fid))
        c.append(frect(350, y + 8, 3, 30, fill=fg, radius=2, parent=fid, name="Schedule bar"))
        c.append(ftext(368, y + 9, subj, 11, INK, 600, parent=fid))
        c.append(ftext(368, y + 26, room, 8.5, MUTED, 400, parent=fid))
        ps, pw = fpill(850, y + 11, tag, bg, fg, parent=fid, size=8.5, h=24, pad=12)
        c += ps

    # live card
    c.append(frect(1032, 690, 376, 282, fill=GREEN_SOFT, radius=28, parent=fid, name="Live card"))
    c.append(frect(1058, 716, 76, 26, fill=CORAL, radius=13, parent=fid, name="Live badge"))
    c.append(ellipse(1070, 725, 7, 7, PAPER, parent=fid, name="Live dot"))
    c.append(ftext(1082, 722, "LIVE", 8.5, PAPER, 700, parent=fid))
    c.append(ftext(1058, 758, "Kelas Matematika", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(1058, 786, "Fungsi Kuadrat bersama Pak Raka", 10, INK_2, 400, width=310, parent=fid))
    c += favatar(1058, 824, 46, "RP", bg=AMBER, parent=fid)
    c.append(ftext(1118, 830, "Pak Raka Pradana", 10, INK, 600, parent=fid))
    c.append(ftext(1118, 846, "27 siswa sudah bergabung", 8.5, MUTED, 400, parent=fid))
    bs, _ = fbutton(1058, 894, "Gabung kelas", "primary", parent=fid, w=312, h=44, icon_name="play", role="student", size=11)
    c += bs
    run(c)


def page_catalog_v2():
    new_page("V2 03 — Library", background=CREAM)
    fid = add_screen("Student / Library friendly", 1440, 1024, fill=CREAM)
    c = fpage("student", "Katalog SIBI", 1, STUDENT_NAV2, fid, subtitle="67 buku resmi · 58 untuk siswa", search="Cari judul atau mapel...", avatar_text="AP")
    c.append(ftext(252, 122, "Pilih buku yang ingin kamu baca.", 30, INK, 600, family=DISPLAY, parent=fid, tracking=-0.5))
    c.append(ftext(252, 168, "Tidak perlu langsung selesai. Mulai dari satu halaman.", 12, MUTED, 400, parent=fid))
    chips = [("Semua", True), ("Matematika", False), ("Bahasa Indonesia", False), ("IPA", False), ("Sejarah", False), ("Informatika", False)]
    cx = 252
    for label, active in chips:
        w = 34 + len(label) * 6.2
        c.append(frect(cx, 212, w, 38, fill=BLUE if active else PAPER, radius=19, stroke=None if active else LINE, parent=fid, name=f"Chip / {label}"))
        c.append(ftext(cx, 223, label, 10, PAPER if active else MUTED, 600 if active else 500, parent=fid))
        cx += w + 12
    books = [
        ("Matematika Kelas X", "Matematika", "4.9", ["#3D7BFA", "#2451B7"], False),
        ("Bahasa Indonesia Kelas X", "Bahasa Indonesia", "4.8", ["#F5A623", "#C77A0A"], False),
        ("Ilmu Pengetahuan Alam", "IPA", "4.7", ["#3FAE7A", "#247A52"], False),
        ("Sejarah Indonesia", "Sejarah", "4.6", ["#8B7CF6", "#5B4CC4"], False),
        ("Bahasa Inggris", "Bahasa Inggris", "4.7", ["#37A6B8", "#1F6F7C"], False),
        ("Informatika Kelas X", "Informatika", "4.8", ["#5566D8", "#333F9E"], False),
    ]
    for i, (title, subject, rating, grad, locked) in enumerate(books):
        col, row = i % 3, i // 3
        x = 252 + col * 382
        y = 282 + row * 354
        w, h = 358, 328
        c.append(fcard(x, y, w, h, parent=fid, radius=26, name=f"Catalog / {title}"))
        c += fbook_cover(x + 24, y + 24, 145, 204, title, subject, grad, fid, radius=14)
        c.append(ftext(x + 188, y + 40, title, 15, INK, 700, family=DISPLAY, width=150, parent=fid, line_height="120%"))
        c.append(ftext(x + 188, y + 104, subject, 10, MUTED, 400, parent=fid))
        c.append(ficon("star", x + 188, y + 132, 13, AMBER, 0, parent=fid))
        c.append(ftext(x + 206, y + 130, rating, 10, INK, 600, parent=fid))
        c.append(ftext(x + 188, y + 162, "Buku siswa", 8.5, GREEN_DEEP, 600, parent=fid))
        c.append(ftext(x + 24, y + 258, "Baca sekarang  →", 10, BLUE_DEEP, 700, parent=fid))
    c.append(ftext(252, 1000, "Menampilkan 6 dari 58 buku siswa · data tersinkron", 9, MUTED, 400, parent=fid))
    run(c)


def page_reader_v2():
    new_page("V2 04 — Reader", background="#F3F1EA")
    fid = add_screen("Student / Reader friendly", 1440, 1024, fill="#F3F1EA")
    c = [frect(0, 0, 1440, 1024, fill="#F3F1EA", parent=fid, name="Canvas")]
    # topbar
    c.append(frect(0, 0, 1440, 84, fill=CREAM, parent=fid, name="Topbar"))
    c.append(ficon("arrowLeft", 28, 30, 22, INK, 2, parent=fid))
    c.append(ftext(66, 24, "Matematika Kelas X", 17, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(66, 50, "Bab 3 · Fungsi Kuadrat", 10, MUTED, 400, parent=fid))
    c.append(ftext(560, 32, "68% dibaca", 10, GREEN_DEEP, 600, parent=fid))
    c.append(frect(640, 38, 220, 8, fill=LINE, radius=4, parent=fid, name="Progress track"))
    c.append(frect(640, 38, 220 * 0.68, 8, fill=GREEN, radius=4, parent=fid, name="Progress fill"))
    c.append(ficon("bookmark", 1190, 30, 20, BLUE_DEEP, 1.9, parent=fid))
    c.append(ficon("highlighter", 1240, 30, 20, MUTED, 1.9, parent=fid))
    c.append(frect(1290, 20, 122, 44, fill=BLUE, radius=22, parent=fid, name="Focus button"))
    c.append(ficon("maximize", 1304, 33, 15, PAPER, 2, parent=fid))
    c.append(ftext(1326, 34, "Fokus", 10, PAPER, 600, parent=fid))
    # TOC simplified
    c.append(fcard(28, 108, 248, 888, parent=fid, radius=26, name="TOC"))
    c.append(ftext(52, 134, "Daftar isi", 16, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(52, 160, "6 bab", 9, MUTED, 400, parent=fid))
    chapters = [("01", "Bilangan Berpangkat", False), ("02", "Persamaan Linear", False), ("03", "Fungsi Kuadrat", True), ("04", "Trigonometri", False), ("05", "Sistem Persamaan", False), ("06", "Statistika", False)]
    for i, (num, label, active) in enumerate(chapters):
        y = 196 + i * 64
        if active:
            c.append(frect(44, y - 8, 216, 52, fill=BLUE_SOFT, radius=14, parent=fid, name="Active chapter"))
        c.append(ftext(60, y, num, 9, BLUE_DEEP if active else SOFT, 700, parent=fid))
        c.append(ftext(88, y, label, 11, INK if active else MUTED, 600 if active else 400, parent=fid))
    # gentle note
    c.append(frect(44, 846, 216, 116, fill=AMBER_SOFT, radius=18, parent=fid, name="Reading note"))
    c.append(ficon("sun", 60, 862, 18, AMBER_DEEP, 1.9, parent=fid))
    c.append(ftext(86, 862, "Tidak perlu cepat", 10, INK, 700, parent=fid))
    c.append(ftext(60, 892, "Baca satu bagian,\nlalu tarik napas.", 9.5, INK_2, 400, width=180, parent=fid, line_height="150%"))
    # page
    c.append(fcard(300, 108, 760, 888, parent=fid, radius=26, fill=PAPER, shadow=SH_MD, name="Page surface"))
    c.append(ftext(352, 156, "BAB 3", 10, AMBER_DEEP, 700, tracking=1.0, parent=fid))
    c.append(ftext(352, 176, "Fungsi Kuadrat", 38, INK, 600, family=DISPLAY, parent=fid, tracking=-0.8))
    c.append(ftext(352, 232, "Mengenali pola dan membaca parabola di sekitar kita.", 12, MUTED, 400, parent=fid))
    c.append(frect(352, 272, 90, 3, fill=AMBER, radius=2, parent=fid, name="Rule"))
    c.append(ftext(352, 310, "Fungsi kuadrat adalah fungsi yang dapat dituliskan sebagai f(x) = ax² + bx + c dengan a ≠ 0. Grafiknya berbentuk parabola yang membuka ke atas ketika a > 0 dan ke bawah ketika a < 0.", 12, "#45525F", 400, width=648, parent=fid, line_height="175%"))
    # formula block
    c.append(frect(352, 414, 648, 100, fill=BLUE_PALE, radius=18, parent=fid, name="Formula"))
    c.append(ftext(376, 432, "Bentuk umum", 9, BLUE_DEEP, 700, tracking=0.4, parent=fid))
    c.append(ftext(376, 452, "f(x) = ax² + bx + c", 25, BLUE_DEEP, 600, family=DISPLAY, parent=fid))
    c.append(ftext(376, 488, "a ≠ 0", 10, BLUE_DEEP, 500, parent=fid))
    c.append(ftext(352, 550, "Titik puncak disebut vertex. Letaknya membantu kita memahami nilai maksimum atau minimum — seperti lintasan bola atau lengkung jembatan.", 12, "#45525F", 400, width=648, parent=fid, line_height="175%"))
    # calm figure
    c.append(frect(352, 650, 648, 220, fill="#FBFAF6", radius=18, parent=fid, name="Figure"))
    c.append(frect(408, 836, 536, 1, fill="#D9D4CA", radius=0, parent=fid, name="X axis"))
    c.append(frect(560, 692, 1, 158, fill="#D9D4CA", radius=0, parent=fid, name="Y axis"))
    pts = []
    for i in range(41):
        t = i / 40
        px = 408 + t * 536
        xx = (t - 0.5) * 6
        yy = xx * xx - 2.25
        py = 812 - yy * 25
        pts.append(f"{px:.1f} {py:.1f}")
    c.append(vector_path("M" + "L".join(pts), 0, 0, 1, 1, fill="none", stroke=BLUE, sw=2.8, parent=fid, name="Parabola"))
    c.append(ellipse(556, 808, 10, 10, AMBER, parent=fid, stroke=PAPER, sw=2, name="Vertex"))
    c.append(ftext(376, 842, "Gambar 3.1 · Parabola dengan titik puncak.", 9, MUTED, 400, parent=fid))
    # page nav
    c.append(ftext(352, 960, "← Sebelumnya", 10, MUTED, 500, parent=fid))
    c.append(ftext(900, 960, "Berikutnya →", 10, MUTED, 500, width=100, align="right", parent=fid))
    # right study panel simplified
    c.append(fcard(1088, 108, 324, 888, parent=fid, radius=26, name="Study panel"))
    c.append(ftext(1114, 136, "Ruang belajar", 16, INK, 700, family=DISPLAY, parent=fid))
    c.append(frect(1114, 174, 272, 176, fill=BLUE, radius=22, parent=fid, name="AI card"))
    c.append(ficon("sparkles", 1134, 194, 20, AMBER, 1.9, parent=fid))
    c.append(ftext(1160, 192, "Tanya SiGEMAS", 11, PAPER, 700, parent=fid))
    c.append(ftext(1134, 226, "Bingung bagian ini?", 12, PAPER, 600, parent=fid))
    c.append(ftext(1134, 248, "Minta penjelasan yang lebih sederhana.", 9.5, "#D9E6FF", 400, width=220, parent=fid, line_height="140%"))
    bs, _ = fbutton(1134, 292, "Jelaskan pelan-pelan", "white", parent=fid, w=232, h=40, icon_name="messageCircle", role="student", size=9.5)
    c += bs
    c.append(ftext(1114, 384, "Catatan saya", 13, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(1360, 386, "3", 9, MUTED, 600, width=26, align="right", parent=fid))
    notes = [("Rumus puncak", "x = −b/2a"), ("Koneksi nyata", "Lintasan bola basket"), ("Pertanyaan", "Apa itu diskriminan?")]
    for i, (title, body) in enumerate(notes):
        y = 414 + i * 80
        c.append(frect(1114, y, 272, 66, fill="#FAF9F6", radius=16, parent=fid, name=f"Note / {title}"))
        c.append(frect(1114, y, 4, 66, fill=AMBER if i == 0 else BLUE if i == 1 else GREEN, radius=2, parent=fid, name="Note bar"))
        c.append(ftext(1132, y + 12, title, 10, INK, 700, parent=fid))
        c.append(ftext(1132, y + 30, body, 9.5, MUTED, 400, parent=fid))
    # next live
    c.append(frect(1114, 672, 272, 118, fill=GREEN_SOFT, radius=18, parent=fid, name="Live note"))
    c.append(ftext(1134, 690, "Kelas live nanti", 11, INK, 700, parent=fid))
    c.append(ftext(1134, 712, "Matematika · 09.15", 9.5, INK_2, 400, parent=fid))
    c.append(ftext(1134, 738, "Pak Raka akan membahas\ncontoh soal vertex.", 9, MUTED, 400, width=220, parent=fid, line_height="140%"))
    c.append(ftext(1114, 936, "Simpan catatan  →", 9.5, BLUE_DEEP, 700, parent=fid))
    run(c)
