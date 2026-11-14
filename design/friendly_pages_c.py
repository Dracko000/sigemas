"""Friendly v2: admin, sign in, mobile."""
from friendly_ui import *


def page_admin_v2():
    new_page("V2 09 — Admin", background=CREAM)
    fid = add_screen("Admin / Home friendly", 1440, 1024, fill=CREAM)
    c = fpage("admin", "Halo, Admin", 0, ADMIN_NAV2, fid, subtitle="Sistem sehat · 10 November", search="Cari akun...", avatar_text="AD")

    hx, hy, hw, hh = 252, 112, 756, 244
    c.append(frect(hx, hy, hw, hh, fill=LAVENDER, radius=30, parent=fid, name="Hero admin"))
    c.append(ellipse(hx + 520, hy - 90, 330, 330, "#FFFFFF14", parent=fid, name="Hero blob"))
    c.append(ftext(hx + 34, hy + 30, "Sistem sehat · uptime 412 jam", 10, "#EDE9FF", 600, parent=fid))
    c.append(ftext(hx + 34, hy + 54, "Semua berjalan tenang.", 31, PAPER, 600, family=DISPLAY, parent=fid, tracking=-0.4))
    c.append(ftext(hx + 34, hy + 102, "1.284 akun aktif, 67 buku tersinkron, dan 3 kelas live berjalan.", 11.5, "#EFEBFF", 400, width=500, parent=fid, line_height="155%"))
    bs, _ = fbutton(hx + 34, hy + 156, "Kelola pengguna", "white", parent=fid, w=172, h=44, icon_name="users", role="admin", size=11)
    c += bs
    bs, _ = fbutton(hx + 220, hy + 156, "Lihat analitik", "ghost", parent=fid, w=150, h=44, icon_name="activity", role="admin", size=11)
    c += bs
    c.append(ftext(hx + 34, hy + 214, "Tidak ada antrean kritis", 9, "#EDE9FF", 500, parent=fid))
    c.append(ficon("checkCircle", hx + 190, hy + 210, 14, "#D9F7E9", 2.2, parent=fid))

    # sync card
    sx, sy, sw, sh = 1032, 112, 376, 244
    c.append(fcard(sx, sy, sw, sh, parent=fid, radius=30, name="Sync card"))
    c.append(frect(sx + 26, sy + 24, 44, 44, fill=GREEN_SOFT, radius=14, parent=fid, name="Sync icon"))
    c.append(ficon("cloudDownload", sx + 38, sy + 36, 20, GREEN_DEEP, 1.9, parent=fid))
    c.append(ftext(sx + 82, sy + 24, "Sinkronisasi SIBI", 13, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(sx + 82, sy + 46, "Terakhir hari ini, 07.45", 8.5, MUTED, 400, parent=fid))
    c.append(ftext(sx + 26, sy + 86, "67", 24, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(sx + 26, sy + 116, "buku tersinkron", 9, MUTED, 400, parent=fid))
    c.append(ftext(sx + 186, sy + 86, "0", 24, GREEN_DEEP, 700, family=DISPLAY, parent=fid))
    c.append(ftext(sx + 186, sy + 116, "konflik", 9, MUTED, 400, parent=fid))
    bs, _ = fbutton(sx + 26, sy + 150, "Sinkronkan sekarang", "primary", parent=fid, w=324, h=44, icon_name="refresh", role="admin", size=10.5)
    c += bs
    c.append(ftext(sx + 26, sy + 206, "Tidak perlu tindakan manual.", 8.5, GREEN_DEEP, 600, parent=fid))

    # stats inline
    stats = [("Total pengguna", "1.284", "1.196 aktif"), ("Buku SIBI", "67", "58 untuk siswa"), ("Kelas", "36", "rombel aktif"), ("Live", "3", "sedang berjalan")]
    for i, (lab, val, hint) in enumerate(stats):
        x = 252 + i * 286
        c.append(ftext(x, 400, lab, 10, MUTED, 500, parent=fid))
        c.append(ftext(x, 418, val, 28, INK, 700, family=DISPLAY, parent=fid))
        c.append(ftext(x, 454, hint, 9, MUTED, 400, parent=fid))

    # growth
    c.append(fcard(252, 504, 756, 278, parent=fid, radius=28, name="Growth"))
    c.append(ftext(282, 530, "Pertumbuhan pengguna", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(282, 558, "Enam bulan terakhir", 10.5, MUTED, 400, parent=fid))
    c.append(ftext(920, 536, "+195%", 10, GREEN_DEEP, 700, width=60, align="right", parent=fid))
    c += soft_line(300, 612, 660, 110, [840, 1120, 1480, 1860, 2240, 2480], color=LAVENDER, labels=["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"], parent=fid)
    c.append(ftext(282, 744, "Pertumbuhan stabil, tanpa lonjakan yang mengganggu layanan.", 9.5, MUTED, 400, parent=fid))

    # roles
    c.append(fcard(1032, 504, 376, 278, parent=fid, radius=28, name="Roles"))
    c.append(ftext(1058, 530, "Komposisi peran", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(1058, 558, "1.284 akun terdaftar", 10, MUTED, 400, parent=fid))
    c += soft_donut(1220, 650, 58, [{"label": "Siswa", "value": 980, "color": BLUE}, {"label": "Guru", "value": 120, "color": AMBER}, {"label": "Orang tua", "value": 160, "color": GREEN}, {"label": "Admin", "value": 24, "color": LAVENDER}], parent=fid, thickness=18, center_value="1.284", center_label="akun")
    for i, (lab, val, col) in enumerate([("Siswa", "980", BLUE), ("Guru", "120", AMBER), ("Orang tua", "160", GREEN), ("Admin", "24", LAVENDER)]):
        x = 1058 + (i % 2) * 152
        y = 724 + (i // 2) * 24
        c.append(ellipse(x, y + 3, 7, 7, col, parent=fid, name="Legend dot"))
        c.append(ftext(x + 14, y, f"{lab} {val}", 9, MUTED, 500, parent=fid))

    # activity
    c.append(fcard(252, 808, 756, 164, parent=fid, radius=28, name="Activity"))
    c.append(ftext(282, 834, "Aktivitas terbaru", 18, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(282, 862, "Yang terjadi di sekolah hari ini", 9.5, MUTED, 400, parent=fid))
    logs = [("Aisyah Putri", "menyelesaikan kuis", "12 menit lalu", BLUE), ("Raka Pradana", "memulai kelas live", "18 menit lalu", AMBER), ("Admin SIBI", "menyinkronkan katalog", "1 jam lalu", LAVENDER)]
    for i, (nm, act, when, col) in enumerate(logs):
        y = 894 + i * 26
        c.append(ellipse(286, y + 2, 7, 7, col, parent=fid, name="Log dot"))
        c.append(ftext(304, y - 2, nm, 9, INK, 600, parent=fid))
        c.append(ftext(438, y - 2, act, 9, MUTED, 400, parent=fid))
        c.append(ftext(936, y - 2, when, 8, MUTED, 400, width=60, align="right", parent=fid))

    # health
    c.append(fcard(1032, 808, 376, 164, parent=fid, radius=28, name="Health"))
    c.append(ftext(1058, 834, "Kesehatan sistem", 16, INK, 700, family=DISPLAY, parent=fid))
    health = [("API", "Normal", GREEN), ("Realtime", "Terhubung", GREEN), ("Database", "Sehat", GREEN), ("Storage", "62%", AMBER)]
    for i, (lab, val, col) in enumerate(health):
        y = 872 + i * 24
        c.append(ftext(1058, y, lab, 9, MUTED, 500, parent=fid))
        c.append(ftext(1310, y, val, 9, col, 700, width=72, align="right", parent=fid))
    run(c)


def page_auth_v2():
    new_page("V2 10 — Sign in", background=CREAM)
    fid = add_screen("Auth / Sign in friendly", 1440, 1024, fill=CREAM)
    c = [frect(0, 0, 1440, 1024, fill=CREAM, parent=fid, name="Canvas")]
    # left
    c.append(frect(0, 0, 760, 1024, fill=BLUE, radius=0, parent=fid, name="Brand panel"))
    c.append(ellipse(500, -220, 700, 700, "#FFFFFF12", parent=fid, name="Blob"))
    c.append(ellipse(-180, 640, 520, 520, "#FFFFFF0D", parent=fid, name="Blob"))
    c += flogo(72, 64, 48, bg=AMBER, fg=INK, parent=fid, radius=15)
    c.append(ftext(132, 68, "SiGEMAS", 24, PAPER, 700, family=DISPLAY, parent=fid))
    c.append(ftext(72, 238, "Belajar, mengajar,", 47, PAPER, 600, family=DISPLAY, parent=fid, tracking=-1.0))
    c.append(ftext(72, 292, "dan tumbuh", 47, AMBER, 600, family=DISPLAY, parent=fid, tracking=-1.0))
    c.append(ftext(72, 346, "dalam satu ruang.", 47, PAPER, 600, family=DISPLAY, parent=fid, tracking=-1.0))
    c.append(ftext(74, 430, "Satu ekosistem yang tenang untuk buku SIBI, kelas live, penilaian, dan pendampingan orang tua.", 14, "#D9E6FF", 400, width=560, parent=fid, line_height="160%"))
    # feature rows
    for i, (ic, title, desc) in enumerate([("bookOpen", "Buku SIBI", "67 judul resmi, siap dibaca"), ("video", "Kelas live", "Video guru + papan tulis"), ("sparkles", "AI pendamping", "Ringkas dan latihan")]):
        y = 530 + i * 94
        c.append(frect(72, y, 560, 74, fill="#FFFFFF12", radius=20, parent=fid, name=f"Feature / {title}"))
        c.append(frect(90, y + 14, 44, 44, fill="#FFFFFF1A", radius=13, parent=fid, name="Feature icon"))
        c.append(ficon(ic, 102, y + 26, 20, AMBER, 1.8, parent=fid))
        c.append(ftext(148, y + 16, title, 13, PAPER, 700, family=DISPLAY, parent=fid))
        c.append(ftext(148, y + 38, desc, 9.5, "#D9E6FF", 400, parent=fid))
    c += fmascot(560, 812, 130, parent=fid, accent=BLUE, soft="#DCE9FF")
    c.append(ftext(72, 930, "“Teknologi seharusnya mengurangi beban.”", 11, "#D9E6FF", 500, family=DISPLAY, parent=fid))
    # right login
    c.append(frect(856, 120, 504, 784, fill=PAPER, radius=34, parent=fid, name="Login card", effects=SH_MD))
    c.append(ftext(904, 168, "Selamat datang kembali", 29, INK, 600, family=DISPLAY, parent=fid, tracking=-0.5))
    c.append(ftext(904, 212, "Masuk untuk melanjutkan ruang belajar Anda.", 11, MUTED, 400, parent=fid))
    c.append(ftext(904, 266, "Email sekolah", 10, INK, 600, parent=fid))
    c.append(frect(904, 288, 408, 50, fill="#FAF9F6", radius=15, stroke=LINE, parent=fid, name="Email"))
    c.append(ficon("messageSquare", 922, 304, 16, SOFT, 1.8, parent=fid))
    c.append(ftext(948, 303, "aisyah@sigemas.id", 11, INK, 500, parent=fid))
    c.append(ftext(904, 360, "Kata sandi", 10, INK, 600, parent=fid))
    c.append(ftext(1258, 360, "Lupa?", 9, BLUE_DEEP, 600, width=54, align="right", parent=fid))
    c.append(frect(904, 382, 408, 50, fill="#FAF9F6", radius=15, stroke=BLUE, sw=1.5, parent=fid, name="Password"))
    c.append(ficon("lock", 922, 398, 16, SOFT, 1.8, parent=fid))
    c.append(ftext(948, 397, "••••••••••", 13, INK, 500, parent=fid))
    c.append(ficon("eye", 1280, 398, 16, SOFT, 1.8, parent=fid))
    c.append(frect(904, 452, 18, 18, fill=BLUE, radius=5, parent=fid, name="Remember"))
    c.append(ficon("check", 908, 456, 10, PAPER, 2.6, parent=fid))
    c.append(ftext(932, 454, "Ingat saya", 9.5, MUTED, 400, parent=fid))
    bs, _ = fbutton(904, 496, "Masuk ke SiGEMAS", "primary", parent=fid, w=408, h=50, icon_name="arrowRight", role="student", size=11.5)
    c += bs
    c.append(ftext(904, 580, "atau coba akun demo", 9, MUTED, 500, width=408, align="center", parent=fid))
    demo = [("Siswa", "AP", BLUE), ("Guru", "RP", AMBER), ("Orang tua", "SW", GREEN), ("Admin", "AD", LAVENDER)]
    for i, (lab, ini, col) in enumerate(demo):
        x = 904 + (i % 2) * 208
        y = 616 + (i // 2) * 62
        c.append(frect(x, y, 200, 50, fill="#FAF9F6", radius=15, stroke=LINE, parent=fid, name=f"Demo / {lab}"))
        c += favatar(x + 10, y + 9, 32, ini, bg=col, parent=fid)
        c.append(ftext(x + 52, y + 11, lab, 9.5, INK, 600, parent=fid))
        c.append(ftext(x + 52, y + 26, "demo1234", 8, MUTED, 400, parent=fid))
    c.append(frect(904, 758, 408, 78, fill=BLUE_PALE, radius=18, parent=fid, name="Demo note"))
    c.append(ficon("sun", 922, 778, 18, BLUE_DEEP, 1.9, parent=fid))
    c.append(ftext(948, 776, "Satu kata sandi untuk semua peran.", 9.5, BLUE_DEEP, 700, parent=fid))
    c.append(ftext(948, 796, "Cukup pilih akun demo di atas.", 9, MUTED, 400, parent=fid))
    c.append(ftext(904, 862, "Butuh bantuan? Hubungi admin sekolah", 8.5, BLUE_DEEP, 600, width=408, align="center", parent=fid))
    run(c)


def page_mobile_v2():
    new_page("V2 11 — Mobile", background="#E8ECE7")
    fid = add_screen("Mobile / Friendly flows", 1347, 920, fill="#E8ECE7")
    c = [frect(0, 0, 1347, 920, fill="#E8ECE7", parent=fid, name="Canvas")]
    for i, lab in enumerate(["Beranda siswa", "Membaca", "Kuis"]):
        c.append(ftext(40 + i * 453, 22, lab, 15, INK, 700, family=DISPLAY, parent=fid))
        c.append(ftext(40 + i * 453, 42, "iPhone 17 · 393 × 852", 8.5, MUTED, 500, parent=fid))

    def shell(x, y, dark=False):
        cc = []
        cc.append(frect(x, y, 393, 852, fill="#22313F", radius=48, parent=fid, name="Phone body", effects=SH_LG))
        cc.append(frect(x + 10, y + 10, 373, 832, fill=CREAM if not dark else "#20303F", radius=39, parent=fid, name="Phone screen"))
        cc.append(frect(x + 138, y + 20, 116, 26, fill="#22313F", radius=13, parent=fid, name="Dynamic island"))
        return cc

    def status(x, y, dark=False):
        fg = PAPER if dark else INK
        return [ftext(x + 26, y + 14, "09:41", 10, fg, 700, parent=fid),
                ficon("signal", x + 288, y + 15, 12, fg, 2, parent=fid),
                ficon("wifi", x + 304, y + 15, 12, fg, 2, parent=fid),
                ficon("battery", x + 320, y + 14, 15, fg, 1.8, parent=fid)]

    def bottom_nav(x, y, active=0):
        cc = [frect(x, y, 357, 62, fill=PAPER, radius=22, parent=fid, name="Tab bar", effects=SH_MD)]
        for i, (ic, lab) in enumerate([("home", "Beranda"), ("library", "Katalog"), ("radio", "Live"), ("trophy", "Kuis"), ("userCheck", "Profil")]):
            ix = x + 18 + i * 66
            col = BLUE if i == active else SOFT
            cc.append(ficon(ic, ix + 8, y + 12, 19, col, 1.9, parent=fid))
            cc.append(ftext(ix - 8, y + 36, lab, 7.5, col, 600 if i == active else 500, width=52, align="center", parent=fid))
        return cc

    # phone 1: home
    x, y = 40, 68
    c += shell(x, y)
    c += status(x, y)
    c.append(ftext(x + 28, y + 70, "Halo, Aisyah", 11, MUTED, 500, parent=fid))
    c.append(ftext(x + 28, y + 90, "Mau belajar apa?", 24, INK, 600, family=DISPLAY, parent=fid))
    c += favatar(x + 322, y + 68, 36, "AP", bg=BLUE, parent=fid)
    c.append(frect(x + 24, y + 134, 345, 154, fill=BLUE, radius=26, parent=fid, name="Mobile hero"))
    c.append(ellipse(x + 260, y + 112, 120, 120, "#FFFFFF12", parent=fid, name="Hero blob"))
    c.append(ftext(x + 44, y + 154, "KELAS LIVE · 27 SISWA", 7.5, "#D9E6FF", 700, tracking=0.7, parent=fid))
    c.append(ftext(x + 44, y + 174, "Matematika", 20, PAPER, 600, family=DISPLAY, parent=fid))
    c.append(ftext(x + 44, y + 200, "Fungsi Kuadrat bersama Pak Raka", 9, "#D9E6FF", 400, parent=fid))
    bs, _ = fbutton(x + 44, y + 226, "Gabung kelas", "white", parent=fid, w=132, h=38, icon_name="play", role="student", size=9.5)
    c += bs
    c += fmascot(x + 286, y + 196, 84, parent=fid, accent=BLUE, soft="#DCE9FF")
    c.append(ftext(x + 24, y + 318, "Lanjutkan belajar", 15, INK, 700, family=DISPLAY, parent=fid))
    c.append(frect(x + 24, y + 346, 345, 140, fill=PAPER, radius=22, parent=fid, name="Continue card", effects=SH_SM))
    c += fbook_cover(x + 38, y + 360, 66, 110, "Matematika X", "Matematika", ["#3D7BFA", "#2451B7"], fid, radius=8)
    c.append(ftext(x + 120, y + 366, "Matematika Kelas X", 11, INK, 700, parent=fid))
    c.append(ftext(x + 120, y + 386, "Bab 3 · Fungsi Kuadrat", 8.5, MUTED, 400, parent=fid))
    c += fprogress(x + 120, y + 414, 222, 68, BLUE, parent=fid, h=7)
    c.append(ftext(x + 120, y + 430, "68% selesai", 8, BLUE_DEEP, 600, parent=fid))
    c.append(ftext(x + 120, y + 452, "Lanjut baca  →", 9, BLUE_DEEP, 700, parent=fid))
    c.append(ftext(x + 24, y + 518, "Jadwal hari ini", 15, INK, 700, family=DISPLAY, parent=fid))
    for i, (time, subj, bg, fg) in enumerate([("07.30", "Matematika", BLUE_SOFT, BLUE_DEEP), ("09.15", "Bahasa Indonesia", AMBER_SOFT, AMBER_DEEP)]):
        yy = y + 548 + i * 58
        c.append(frect(x + 24, yy, 345, 48, fill=PAPER, radius=16, parent=fid, name="Schedule", effects=SH_SM))
        c.append(frect(x + 38, yy + 9, 54, 30, fill=bg, radius=9, parent=fid, name="Time chip"))
        c.append(ftext(x + 46, yy + 17, time, 8.5, fg, 700, parent=fid))
        c.append(ftext(x + 104, yy + 10, subj, 10, INK, 600, parent=fid))
        c.append(ftext(x + 104, yy + 27, "R-204", 8, MUTED, 400, parent=fid))
    c += bottom_nav(x + 18, y + 762)

    # phone 2: reader
    x2 = 493
    c += shell(x2, y)
    c += status(x2, y)
    c.append(ficon("arrowLeft", x2 + 28, y + 70, 20, INK, 2, parent=fid))
    c.append(ftext(x2 + 58, y + 68, "Fungsi Kuadrat", 14, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(x2 + 58, y + 88, "Bab 3 · halaman 78", 8.5, MUTED, 400, parent=fid))
    c.append(ficon("bookmark", x2 + 330, y + 70, 18, BLUE_DEEP, 1.9, parent=fid))
    c.append(frect(x2 + 24, y + 118, 345, 7, fill=LINE, radius=3, parent=fid, name="Progress track"))
    c.append(frect(x2 + 24, y + 118, 345 * 0.68, 7, fill=GREEN, radius=3, parent=fid, name="Progress fill"))
    c.append(frect(x2 + 18, y + 142, 357, 610, fill=PAPER, radius=24, parent=fid, name="Page", effects=SH_SM))
    c.append(ftext(x2 + 42, y + 166, "BAB 3", 8.5, AMBER_DEEP, 700, tracking=0.7, parent=fid))
    c.append(ftext(x2 + 42, y + 184, "Fungsi Kuadrat", 25, INK, 600, family=DISPLAY, parent=fid))
    c.append(ftext(x2 + 42, y + 224, "Mengenali pola dan membaca parabola di sekitar kita.", 10, MUTED, 400, width=306, parent=fid, line_height="145%"))
    c.append(frect(x2 + 42, y + 256, 72, 3, fill=AMBER, radius=2, parent=fid, name="Rule"))
    c.append(ftext(x2 + 42, y + 284, "Fungsi kuadrat adalah fungsi yang dapat dituliskan sebagai f(x) = ax² + bx + c dengan a ≠ 0.", 11, INK_2, 400, width=306, parent=fid, line_height="170%"))
    c.append(frect(x2 + 42, y + 372, 306, 86, fill=BLUE_PALE, radius=16, parent=fid, name="Formula"))
    c.append(ftext(x2 + 58, y + 388, "Bentuk umum", 8, BLUE_DEEP, 700, parent=fid))
    c.append(ftext(x2 + 58, y + 404, "f(x) = ax² + bx + c", 18, BLUE_DEEP, 600, family=DISPLAY, parent=fid))
    c.append(ftext(x2 + 58, y + 434, "a ≠ 0", 8.5, BLUE_DEEP, 500, parent=fid))
    c.append(frect(x2 + 42, y + 478, 306, 184, fill="#FBFAF6", radius=16, parent=fid, name="Figure"))
    c.append(frect(x2 + 74, y + 628, 242, 1, fill="#D9D4CA", parent=fid, name="X axis"))
    c.append(frect(x2 + 186, y + 506, 1, 140, fill="#D9D4CA", parent=fid, name="Y axis"))
    pts = []
    for i in range(31):
        t = i / 30
        pxp = x2 + 74 + t * 242
        xx = (t - 0.5) * 5
        yy2 = xx * xx - 2.25
        pyp = y + 604 - yy2 * 13
        pts.append(f"{pxp:.1f} {pyp:.1f}")
    c.append(vector_path("M" + "L".join(pts), 0, 0, 1, 1, fill="none", stroke=BLUE, sw=2.4, parent=fid, name="Parabola"))
    c.append(ellipse(x2 + 182, y + 600, 9, 9, AMBER, parent=fid, stroke=PAPER, sw=2, name="Vertex"))
    c.append(ftext(x2 + 42, y + 674, "Gambar 3.1 · Parabola dengan titik puncak.", 8, MUTED, 400, parent=fid))
    c.append(frect(x2 + 42, y + 704, 306, 34, fill=AMBER_SOFT, radius=12, parent=fid, name="Highlight"))
    c.append(ficon("highlighter", x2 + 54, y + 713, 14, AMBER_DEEP, 1.9, parent=fid))
    c.append(ftext(x2 + 76, y + 713, "Tandai: vertex = titik puncak", 8.5, AMBER_DEEP, 600, parent=fid))
    c.append(frect(x2 + 18, y + 770, 357, 56, fill=PAPER, radius=20, parent=fid, name="Toolbar", effects=SH_MD))
    for i, (ic, lab) in enumerate([("listChecks", "Daftar"), ("highlighter", "Sorot"), ("messageSquare", "Catatan"), ("sparkles", "AI")]):
        ix = x2 + 38 + i * 82
        col = BLUE if i == 3 else SOFT
        c.append(ficon(ic, ix + 6, y + 784, 18, col, 1.9, parent=fid))
        c.append(ftext(ix - 12, y + 808, lab, 7, col, 600 if i == 3 else 500, width=56, align="center", parent=fid))

    # phone 3: quiz
    x3 = 946
    c += shell(x3, y)
    c += status(x3, y)
    c.append(ficon("x", x3 + 28, y + 70, 20, MUTED, 2, parent=fid))
    c.append(ftext(x3 + 144, y + 68, "Kuis Bab 3", 13, INK, 700, family=DISPLAY, parent=fid))
    c.append(ftext(x3 + 312, y + 70, "08:42", 10, CORAL, 700, parent=fid))
    c.append(frect(x3 + 24, y + 108, 345, 7, fill=LINE, radius=3, parent=fid, name="Quiz track"))
    c.append(frect(x3 + 24, y + 108, 345 * 0.4, 7, fill=BLUE, radius=3, parent=fid, name="Quiz fill"))
    c.append(ftext(x3 + 24, y + 126, "Soal 4 dari 10", 8.5, MUTED, 500, parent=fid))
    c.append(ftext(x3 + 310, y + 126, "40%", 8.5, BLUE_DEEP, 700, parent=fid))
    c.append(frect(x3 + 24, y + 158, 345, 148, fill=BLUE, radius=26, parent=fid, name="Question card"))
    c.append(ellipse(x3 + 270, y + 116, 130, 130, "#FFFFFF12", parent=fid, name="Question blob"))
    c.append(ftext(x3 + 44, y + 178, "PILIHAN GANDA", 7.5, "#D9E6FF", 700, tracking=0.8, parent=fid))
    c.append(ftext(x3 + 44, y + 200, "Grafik y = x² − 4x + 3", 18, PAPER, 600, family=DISPLAY, parent=fid))
    c.append(ftext(x3 + 44, y + 228, "memotong sumbu X di titik …", 15, PAPER, 600, family=DISPLAY, parent=fid))
    c.append(ftext(x3 + 44, y + 270, "Pilih satu jawaban yang paling tepat.", 9, "#D9E6FF", 400, parent=fid))
    opts = [("A", "(1, 0) dan (3, 0)"), ("B", "(0, 1) dan (0, 3)"), ("C", "(−1, 0) dan (−3, 0)"), ("D", "(2, −1) dan (0, 3)")]
    for i, (letter, val) in enumerate(opts):
        yy = y + 326 + i * 64
        selected = i == 0
        c.append(frect(x3 + 24, yy, 345, 54, fill=BLUE_SOFT if selected else PAPER, radius=18, stroke=BLUE if selected else LINE, sw=1.5 if selected else 1, parent=fid, name=f"Option / {letter}"))
        c.append(ellipse(x3 + 40, yy + 11, 32, 32, fill=BLUE if selected else "#F2F0EA", parent=fid, name="Option letter"))
        c.append(ftext(x3 + 40, yy + 19, letter, 10, PAPER if selected else MUTED, 700, width=32, align="center", parent=fid))
        c.append(ftext(x3 + 86, yy + 19, val, 10, INK, 600, parent=fid))
    c.append(ftext(x3 + 24, y + 602, "Tidak yakin? Tidak apa-apa.", 9, MUTED, 500, parent=fid))
    c.append(frect(x3 + 24, y + 626, 118, 34, fill=BLUE_SOFT, radius=17, parent=fid, name="Hint"))
    c.append(ficon("sun", x3 + 36, y + 635, 14, BLUE_DEEP, 1.9, parent=fid))
    c.append(ftext(x3 + 56, y + 636, "Lihat petunjuk", 8.5, BLUE_DEEP, 600, parent=fid))
    c.append(frect(x3 + 24, y + 744, 345, 52, fill=BLUE, radius=26, parent=fid, name="Next"))
    c.append(ftext(x3 + 24, y + 760, "Lanjut", 11, PAPER, 700, width=345, align="center", parent=fid))
    c.append(ficon("arrowRight", x3 + 326, y + 762, 15, PAPER, 2.2, parent=fid))
    run(c)
