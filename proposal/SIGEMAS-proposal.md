# PROPOSAL

## SiGEMAS — SIBI Learning OS

**Platform pembelajaran terpadu untuk buku SIBI, kelas live, asesmen, dan keterlibatan orang tua.**

| | |
|---|---|
| Versi | 1.0 |
| Tanggal | November 2026 |
| Status | Prototipe fungsional — siap demo dan pilot terbatas |
| Dokumen | Proposal kemitraan dan rencana pilot 1 semester |
| Sifat | Indikatif, bukan penawaran final |

---

## 1. Ringkasan Eksekutif

SiGEMAS adalah **learning operating system** yang menyatukan konten resmi SIBI dari Kemendikdasmen dengan alur belajar harian sekolah. Saat ini, buku digital, kelas live, nilai, presensi, dan komunikasi orang tua umumnya berjalan di alat yang terpisah. Guru menjadi integrator manual; siswa kehilangan konteks; orang tua baru melihat hasil belajar saat rapor.

SiGEMAS mengubahnya menjadi satu alur:

1. **Baca** — katalog buku SIBI dengan sampul, metadata, dan PDF resmi.
2. **Belajar** — kelas live dengan video guru, papan tulis privat, buku di samping papan, chat, dan polling.
3. **Latih & uji** — flashcard, mindmap, Study Quest, dan kuis.
4. **Nilai** — buku nilai editable, presensi otomatis, dan progres per bab.
5. **Laporkan** — dashboard orang tua dan sekolah yang dapat ditindaklanjuti.

Prototipe fungsional sudah mencakup empat peran (siswa, guru, orang tua, admin), katalog 67 judul SIBI, kelas live berbasis WebSocket/WebRTC, papan tulis privat, panel PDF, flashcard, kuis, nilai, presensi, laporan orang tua, dan panel admin. Proposal ini mengusulkan **pilot satu semester di 3–5 sekolah** untuk mengukur dampak, memvalidasi model adopsi, dan menyiapkan integrasi Dapodik.

**Yang kami cari:** 3–5 sekolah mitra, 1 dinas pendidikan mitra, dan dukungan pembiayaan untuk 12 bulan pengembangan serta pilot.

---

## 2. Latar Belakang

### 2.1 Konteks

Kurikulum Merdeka dan Sistem Informasi Buku Indonesia (SIBI) telah menyediakan buku teks resmi dalam format digital. Namun, ketersediaan konten belum otomatis menjadi pembelajaran yang terpadu. Sekolah masih harus merangkai sendiri:

- katalog dan tautan PDF,
- kelas tatap muka atau video call,
- bahan latihan dan kuis,
- absensi,
- nilai,
- komunikasi dengan orang tua.

### 2.2 Masalah utama

| Pemangku kepentingan | Masalah | Dampak |
|---|---|---|
| Guru | Berpindah 3–4 alat per sesi; menyalin data absensi dan nilai secara manual | Waktu mengajar dan umpan balik berkurang |
| Siswa | Buku, catatan, latihan, dan progres tersebar | Konteks belajar hilang; sulit melanjutkan materi |
| Orang tua | Informasi baru muncul saat rapor | Tidak bisa mendampingi saat anak masih bisa dibantu |
| Sekolah | Data kelas, kehadiran, dan nilai tidak saling terhubung | Keputusan berbasis data tertunda |
| Dinas | Sulit melihat praktik baik dan pola antar-sekolah | Replikasi program lambat dan tidak terukur |

### 2.3 Peluang

Yang dibutuhkan bukan penerbit baru atau aplikasi ke-5. Yang dibutuhkan adalah **lapisan integrasi** yang membuat konten resmi benar-benar dipakai di kelas, dengan data yang mengalir dari buku → kelas → asesmen → orang tua.

---

## 3. Tujuan

### 3.1 Tujuan umum

Membangun alur pembelajaran digital yang terpadu, mudah dipakai guru, dan menghasilkan data yang berguna bagi siswa, orang tua, sekolah, serta dinas pendidikan.

### 3.2 Tujuan khusus pilot

1. Memvalidasi penggunaan SiGEMAS dalam pembelajaran mingguan di 3–5 sekolah.
2. Mengukur pengurangan waktu administratif guru.
3. Mengukur peningkatan kebiasaan membaca dan latihan siswa.
4. Mengukur keterlibatan orang tua dalam memantau progres.
5. Menguji stabilitas kelas live, panel PDF, dan papan tulis privat.
6. Menyiapkan integrasi Dapodik dan arsitektur produksi.

### 3.3 Bukan tujuan pilot

- Menggantikan seluruh sistem akademik sekolah dalam satu semester.
- Memindahkan seluruh data historis sekolah.
- Menjadi platform konten umum di luar ekosistem SIBI.
- Mengklaim hasil belajar siswa secara kausal tanpa desain evaluasi yang memadai.

---

## 4. Solusi yang Diusulkan

### 4.1 Posisi produk

**SiGEMAS — SIBI Learning OS** adalah platform berbasis web/PWA yang menyatukan:

- **Content layer** — katalog SIBI, metadata asli, sampul, PDF resmi, pemetaan bab.
- **Classroom layer** — kelas live, video guru, papan tulis privat, buku di samping papan, chat, polling, angkat tangan, presensi.
- **Assessment layer** — flashcard, kuis, nilai, progres.
- **Insight layer** — dashboard siswa, guru, orang tua, admin, dan dinas.

### 4.2 Prinsip desain

1. **SIBI-native** — konten resmi menjadi sumber utama, bukan pelengkap.
2. **Satu alur** — buku, kelas, latihan, nilai, dan laporan tidak terpisah.
3. **Akses berlapis** — panduan guru hanya untuk guru/admin; aturan dijaga di API.
4. **Guru tetap di depan** — teknologi mengurangi beban, bukan menambah beban.
5. **Data yang bisa ditindaklanjuti** — bukan dashboard yang penuh angka tanpa keputusan.
6. **Siap integrasi** — struktur rombel, wali kelas, dan peserta didik disiapkan untuk Dapodik.

---

## 5. Ruang Lingkup

### 5.1 Katalog dan buku SIBI

- Katalog awal 67 judul: 61 SD/MI dan 6 SMA/MA.
- 58 judul dapat diakses siswa; 9 panduan guru hanya untuk guru/admin.
- Metadata: judul, penulis, ISBN, penerbit, kurikulum, jenjang, sampul, tautan PDF resmi.
- Filter jenjang, pencarian, dan klasifikasi audiens.
- Panel buku lengkap di kelas live: pembaca PDF di samping papan tulis.
- Guard akses buku guru pada detail, progres, dan flashcard.

### 5.2 Kelas live

- Jadwal dan sesi live per kelas.
- Video guru ke siswa melalui WebRTC; dukungan berbagi layar.
- Papan tulis privat per siswa/sesi, tersimpan lokal.
- Buku PDF di samping papan tulis.
- Chat, angkat tangan, polling, dan presensi otomatis.
- Kontrol guru untuk mengakhiri sesi.

### 5.3 Latihan dan asesmen

- Flashcard otomatis per bab buku.
- Kuis dengan skor, peringkat, dan pembahasan.
- Buku nilai editable untuk guru.
- Progres baca dan aktivitas belajar.
- Study Quest, XP, level, dan badge sebagai penguat kebiasaan.

### 5.4 Orang tua

- Ringkasan perkembangan anak.
- Nilai dan presensi.
- Laporan hasil belajar yang dapat dicetak.
- Sinyal dini ketika aktivitas belajar menurun.

### 5.5 Administrasi sekolah

- Manajemen pengguna dan peran.
- Manajemen rombel/kelas.
- Sinkronisasi katalog pusat.
- Analitik sistem dan audit log.
- Kesiapan integrasi Dapodik.

---

## 6. Pengguna dan Hak Akses

| Peran | Fokus | Akses utama | Batasan |
|---|---|---|---|
| Siswa | Belajar dan berlatih | Katalog siswa, reader, flashcard, kuis, kelas live, progres | Tidak dapat melihat panduan guru |
| Guru | Mengajar dan menilai | Buku siswa + panduan guru, live class, nilai, presensi, RPP, ekstraktor | Hanya kelas/book yang relevan |
| Orang tua | Mendampingi | Progres, nilai, presensi, rapor anak | Hanya data anak yang terhubung |
| Admin | Mengelola | Pengguna, rombel, katalog, analitik, audit | Tidak dapat mengakses data sensitif di luar kewenangan |
| Dinas (tahap berikutnya) | Memantau wilayah | Agregasi multi-sekolah | Data agregat, bukan data mentah siswa |

**Catatan penting:** pembatasan buku panduan guru saat ini diterapkan di API, bukan hanya di tampilan. Siswa/orang tua menerima `403` ketika mencoba mengakses detail, progres, atau flashcard buku guru.

---

## 7. Arsitektur dan Teknologi

### 7.1 Prototipe saat ini

- Frontend: React 19, Vite 8, TypeScript, Tailwind CSS v4, PWA.
- Backend: Node.js, Express 5, JWT, Socket.io.
- Realtime: WebRTC signaling untuk video guru; chat, polling, presensi.
- Data: in-memory store berisi data contoh; rancangan PostgreSQL tersedia.
- Konten: snapshot katalog SIBI dengan metadata dan PDF resmi.

### 7.2 Target produksi

```text
[React PWA] ── HTTPS ── [Express API / BFF] ── [PostgreSQL]
     │                         │
     ├── Object storage (PDF, media)
     ├── Socket.io + TURN (live class)
     └── Observability, audit, backup
```

Komponen produksi yang perlu ditambahkan:

- PostgreSQL dengan migrasi dan backup.
- Object storage/CDN untuk PDF dan media.
- TURN server untuk WebRTC lintas NAT.
- Observability: log terpusat, metrics, tracing, alerting.
- Rate limiting, WAF, secrets management.
- Kebijakan retensi dan penghapusan data.

---

## 8. Integrasi SIBI dan Dapodik

### 8.1 SIBI

- Sumber: katalog Kurikulum Merdeka Kemendikdasmen.
- Data disimpan: `coverUrl`, `fileUrl`, penulis, ISBN, penerbit, kurikulum, `sourceId`, `slug`.
- Sinkronisasi katalog dilakukan bertahap dengan validasi duplikasi ISBN.
- Hak cipta dan ketentuan penggunaan konten mengikuti sumber resmi.

### 8.2 Dapodik

Struktur `ClassRoom` telah menggunakan `homeroomId`, `studentIds`, `classIds`, dan `nisn` agar siap dipetakan ke Dapodik.

Rencana integrasi:

1. **Pemetaan** — sekolah, rombel, PTK, peserta didik.
2. **Sinkronisasi bertahap** — read-only terlebih dahulu.
3. **Validasi** — konflik data dan fallback manual.
4. **Otomasi** — pembaruan rombel dan wali kelas.
5. **Monitoring** — log sinkronisasi dan rekonsiliasi.

Integrasi Dapodik **belum** diimplementasikan pada prototipe; ini merupakan bagian roadmap fase produk.

---

## 9. Metodologi Implementasi

| Tahap | Durasi | Aktivitas | Output |
|---|---|---|---|
| Discover | 2–3 minggu | Wawancara guru, siswa, orang tua; audit alur; baseline | Problem statement, baseline KPI |
| Configure | 3–4 minggu | Setup sekolah, rombel, akun, katalog, kebijakan akses | Tenant sekolah siap |
| Onboard | 2 minggu | Pelatihan guru, simulasi live class, panduan | Guru siap mengajar |
| Pilot | 16 minggu | Penggunaan mingguan, pendampingan, incident review | Data penggunaan & umpan balik |
| Evaluate | 2–3 minggu | Analisis KPI, wawancara, survei, rekomendasi | Laporan pilot & keputusan scale |
| Scale (opsional) | 3–6 bulan | Integrasi Dapodik, perluasan sekolah, hardening | Rencana produksi |

**Prinsip delivery:** mulai kecil, ukur dengan baseline, perbaiki tiap dua minggu, dan jangan menambah fitur di luar lingkup pilot tanpa bukti.

---

## 10. Rencana Pilot 1 Semester

### 10.1 Cakupan

- 3–5 sekolah.
- 20+ guru aktif.
- Minimal 10 kelas/rombel.
- 1 dinas pendidikan mitra (opsional, untuk observasi dan replikasi).
- 1 semester penuh (sekitar 18–20 minggu).

### 10.2 Peran dalam pilot

| Peran | Tanggung jawab |
|---|---|
| Sponsor sekolah | Menetapkan prioritas dan akses data |
| Teacher champion | Menggunakan SiGEMAS tiap minggu dan memberi umpan balik |
| Product/engineering | Memperbaiki bug, stabilitas, dan alur |
| Education lead | Pelatihan, pendampingan, evaluasi pembelajaran |
| DPO/security | Kepatuhan data dan tinjauan akses |
| Evaluator independen (disarankan) | Baseline, survei, dan analisis dampak |

### 10.3 Timeline ringkas

| Bulan | Fokus |
|---|---|
| Bulan 1 | Discover, baseline, setup tenant, pelatihan awal |
| Bulan 2 | Pilot kelas terbatas; live class dan panel PDF |
| Bulan 3 | Perluasan kelas; evaluasi tengah semester |
| Bulan 4 | Integrasi nilai/presensi; survei orang tua |
| Bulan 5 | Stabilisasi, wawancara, analisis KPI |
| Bulan 6 | Laporan akhir, rekomendasi, keputusan scale |

### 10.4 Deliverables pilot

- Tenant sekolah aktif.
- Katalog dan akun pengguna terkonfigurasi.
- 20+ guru terlatih.
- Laporan penggunaan dan stabilitas.
- Laporan evaluasi KPI.
- Rekomendasi produk dan model komersial.
- Rencana integrasi Dapodik.

---

## 11. KPI dan Evaluasi

| Dimensi | Indikator | Target pilot | Cara ukur |
|---|---|---|---|
| Adopsi guru | Guru aktif mingguan | ≥80% guru pilot | Log aktivitas |
| Adopsi siswa | Siswa membaca/melatih mingguan | ≥70% siswa pilot | Log aktivitas |
| Keterlibatan orang tua | Orang tua membuka laporan bulanan | ≥80% akun ortu | Log akses |
| Efisiensi guru | Penurunan waktu administrasi | ≥40% | Time diary sebelum/sesudah |
| Presensi | Kehadiran tercatat otomatis | ≥90% sesi live | Log sesi |
| Stabilitas | Sesi live tanpa insiden kritis | ≥95% | Incident log |
| Kepuasan guru | Guru merekomendasikan SiGEMAS | ≥4/5 | Survei |
| Kesiapan bayar | Sekolah bersedia melanjutkan | ≥3 dari 5 | LOI/survei |

**Catatan:** seluruh target adalah target pilot, bukan hasil yang sudah tercapai. Baseline akan diambil sebelum intervensi. Evaluasi dampak belajar siswa memerlukan desain yang lebih ketat dan sebaiknya dilakukan bersama evaluator independen.

---

## 12. Model Keberlanjutan

### 12.1 Aliran pendapatan

1. **SaaS sekolah** — lisensi tahunan per siswa atau per rombel.
2. **Lisensi dinas** — paket kabupaten/kota dengan dashboard multi-sekolah dan agregasi.
3. **Layanan implementasi** — pelatihan guru, migrasi data, kustomisasi, pendampingan.
4. **Konten dan integrasi** — paket konten tambahan, integrasi Dapodik, pengembangan khusus.

### 12.2 Kerangka harga (indikatif)

| Paket | Sasaran | Dasar harga | Catatan |
|---|---|---|---|
| Pilot | 3–5 sekolah | Gratis / biaya implementasi | 1 semester, evaluasi bersama |
| Sekolah | SD/SMA swasta & negeri | Per siswa/tahun atau per rombel/tahun | Termasuk fitur inti |
| Dinas | Kabupaten/kota | Kontrak wilayah/tahun | Agregasi, dukungan, pelatihan |
| Layanan | Sekolah/dinas | Berbasis proyek | Onboarding, migrasi, kustomisasi |

Harga final ditentukan setelah pilot berdasarkan biaya layanan, willingness to pay, dan hasil evaluasi. Indikasi awal untuk diskusi: **Rp10.000–Rp25.000 per siswa per tahun** untuk paket sekolah, dengan paket dinas dan layanan dihitung terpisah.

### 12.3 Logika keberlanjutan

Pilot gratis menurunkan hambatan adopsi. Konversi terjadi ketika guru sudah memakai SiGEMAS setiap minggu dan sekolah melihat bukti efisiensi. Fokus monetisasi bukan pada jumlah fitur, tetapi pada **waktu yang kembali** dan **data yang bisa ditindaklanjuti**.

---

## 13. Estimasi Biaya Indikatif 12 Bulan

> Angka berikut adalah rentang perencanaan, bukan penawaran final. Asumsi: tim inti 5 orang, 5 sekolah pilot, infrastruktur cloud, dan evaluasi eksternal sederhana.

| Komponen | Asumsi | Rentang (Rp juta) |
|---|---|---|
| Tim inti | Product/engineering, education, growth, implementasi | 750–1.050 |
| Infrastruktur | Cloud, object storage, CDN, monitoring, TURN | 60–120 |
| Pilot & pelatihan | 5 sekolah, workshop, perjalanan, materi | 125–200 |
| Keamanan, legal, evaluasi | Privacy review, uji keamanan, evaluator | 50–90 |
| Kontingensi | 10% dari total | 100–145 |
| **Total indikatif** | | **1.085–1.605** |

Komponen yang dapat disesuaikan:

- Ukuran tim dan komposisi peran.
- Jumlah sekolah pilot.
- Tingkat dukungan implementasi.
- Kebutuhan integrasi Dapodik.
- Penggunaan evaluator independen.

---

## 14. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Adopsi guru rendah | Pilot tidak menghasilkan data | Teacher champion, onboarding 1:1, alur sesingkat mungkin |
| Konektivitas tidak merata | Kelas live terganggu | Mode rendah bandwidth, PWA, caching PDF, fallback materi |
| WebRTC gagal di NAT ketat | Video tidak tersambung | TURN server, health check, fallback audio/chat |
| PDF besar/lambat | Pengalaman baca buruk | Range request, cache, pemilih halaman, kompresi |
| Kekhawatiran privasi | Penolakan sekolah/orang tua | Kepatuhan UU PDP, consent, minimisasi data, audit akses |
| Konten/legal | Risiko penggunaan materi | Gunakan sumber resmi, atribusi, patuhi ketentuan lisensi |
| Dapodik berubah/terbatas | Integrasi tertunda | Sinkronisasi bertahap, fallback manual, kontrak data |
| Scope creep | Pilot melebar | Lingkup pilot tetap, change request terkontrol |
| Ketergantungan pada tim kecil | Risiko eksekusi | Dokumentasi, prioritasi, rekrutmen bertahap |

---

## 15. Manfaat yang Diharapkan

### Bagi guru
- Mengurangi perpindahan aplikasi dan pekerjaan administratif.
- Buku, kelas, nilai, dan presensi dalam satu alur.
- Data kelas yang lebih cepat ditindaklanjuti.

### Bagi siswa
- Konteks belajar yang utuh: buku, latihan, kuis, dan catatan.
- Papan tulis privat untuk merefleksikan materi.
- Umpan balik yang lebih cepat.

### Bagi orang tua
- Visibilitas sebelum rapor.
- Bahasa laporan yang mudah dipahami.
- Dasar percakapan dengan anak dan guru.

### Bagi sekolah dan dinas
- Data kelas yang terhubung dan dapat diaudit.
- Dasar replikasi praktik baik.
- Kesiapan integrasi Dapodik.

---

## 16. Status Prototipe

| Area | Status |
|---|---|
| Autentikasi dan 4 peran | Berjalan |
| Katalog 67 judul SIBI | Berjalan |
| Guard buku panduan guru | Berjalan di API |
| Kelas live + WebRTC signaling | Berjalan |
| Papan tulis privat | Berjalan |
| Panel PDF di samping papan | Berjalan |
| Flashcard, kuis, nilai, presensi | Berjalan |
| Dashboard orang tua | Berjalan |
| Panel admin dan audit | Berjalan |
| Build produksi | Lolos |
| PostgreSQL | Direncanakan |
| Integrasi Dapodik | Direncanakan |
| TURN server | Direncanakan |
| Uji multi-sekolah | Belum |

---

## 17. Penutup

SiGEMAS tidak mencoba menjadi aplikasi baru di tumpukan aplikasi sekolah. SiGEMAS mencoba menjadi **lapisan yang menyatukan** konten resmi, ruang kelas, asesmen, dan keluarga.

Kami mengundang 3–5 sekolah dan 1 dinas pendidikan untuk menguji pendekatan ini selama satu semester. Ukur bersama kami: waktu guru yang kembali, kebiasaan belajar siswa, keterlibatan orang tua, dan kualitas data sekolah. Jika buktinya kuat, perluas bersama. Jika tidak, kita punya data untuk memperbaiki arah.

**Mari mulai dari satu kelas.**

---

## Lampiran A — Asumsi

1. Sekolah pilot memiliki koneksi internet yang memadai untuk video, atau dapat menggunakan mode rendah bandwidth.
2. Sekolah bersedia menunjuk teacher champion dan menyediakan waktu pelatihan.
3. Data awal sekolah tersedia dalam format yang dapat dipetakan ke struktur rombel.
4. Konten SIBI digunakan sesuai ketentuan sumber resmi.
5. Evaluasi dampak dilakukan dengan baseline dan instrumen yang disepakati.
6. Angka biaya dan harga bersifat indikatif untuk perencanaan, bukan komitmen komersial.

## Lampiran B — Dokumen terkait

- `README.md` — gambaran produk, fitur, akun demo, dan roadmap Dapodik.
- `docs/API.md` — daftar endpoint, aturan akses, dan event realtime.
- `docs/ERD.md` — rancangan entitas dan relasi data.
- `pitch/SIGEMAS-pitch-deck.html` — deck presentasi 16:9.
