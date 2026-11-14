# SiGEMAS — Sistem Gramatur, Edukasi & Manajemen Aktif SIBI

SiGEMAS adalah platform pembelajaran digital terpadu yang mengintegrasikan buku teks SIBI (Sistem Informasi Buku Indonesia) dari Kemendikdasmen dengan fitur kelas live, pengelolaan nilai, presensi otomatis, dan monitoring perkembangan siswa bagi orang tua.

## 📚 Sumber Data Buku

Katalog awal berisi **61 buku siswa SD/MI** dan 6 buku SMA/MA demo. Data SD/MI diambil dari katalog Kurikulum Merdeka:

- Portal: [buku.kemendikdasmen.go.id](https://buku.kemendikdasmen.go.id/katalog/buku-kurikulum-merdeka)
- API: `https://api.buku.cloudapp.web.id/api/catalogue/getPenggerakTextBooks?limit=2000&offset=0`
- Filter: `buku_siswa`, status `publish`, jenjang `SD/MI`, deduplikasi ISBN.
- Metadata asli yang disimpan: sampul (`coverUrl`), PDF resmi (`fileUrl`), penulis, ISBN, penerbit, kurikulum, dan `sourceId`.
- Snapshot data: `server/sibi-sd.js` (dapat diperbarui ulang dari API).

## 🚀 Fitur Utama

- **Bagi Siswa**: Katalog buku digital SIBI (SD/MI & SMA/MA), reader interaktif dengan tautan PDF resmi, AI Flashcards, Study Quest bergamifikasi, mindmap interaktif, arena kuis, jadwal belajar, dan laporan nilai/presensi.
- **Bagi Pengajar**: Katalog buku siswa + **buku panduan guru** (hanya terlihat untuk guru/admin), studio kelas live (video guru, papan tulis pribadi, chat, polling), ekstraktor PDF berbasis AI untuk pembuatan modul, buku nilai editable, dan perencanaan RPP digital.
- **Bagi Orang Tua**: Dashboard perkembangan anak, grafik performa belajar, dan laporan hasil belajar (Rapor) yang dapat dicetak.
- **Bagi Administrator**: Manajemen akun pengguna, sinkronisasi katalog pusat SIBI, manajemen rombel (kelas), analitik sistem, dan audit log.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express 5, Socket.io (Real-time), JWT Auth.
- **Data**: In-memory store (seeded) dengan rancangan PostgreSQL.
- **PWA**: Service Worker untuk akses offline terbatas dan instalasi aplikasi.

## 🏁 Quick Start

> Rencana integrasi Dapodik: struktur `ClassRoom` sudah memakai `homeroomId`, `studentIds`, dan `classIds`; tahap berikutnya adalah mapping ID sekolah/rombel/PTK/peserta didik dari Dapodik agar kelas dan wali kelas otomatis sinkron.

### Instalasi
```bash
npm install
```

### Menjalankan Pengembangan
```bash
npm run dev
```
- API: `http://localhost:4000`
- Frontend: `http://localhost:5173`

### Build untuk Produksi
```bash
npm run build
npm start
```

## 🔑 Akun Demo
Gunakan password `demo1234` untuk semua akun:
- **Siswa**: `siswa@sigemas.id`
- **Guru**: `guru@sigemas.id`
- **Orang Tua**: `ortu@sigemas.id`
- **Admin**: `admin@sigemas.id`

## 🗺️ Peta Navigasi
- `/dashboard`: Beranda dinamis sesuai peran.
- `/katalog`: Perpustakaan digital SIBI, default jenjang SD/MI.
- `/flashcards`: Latihan kartu belajar dari bab buku.
- `/mindmap`: Peta konsep interaktif per buku.
- `/quest`: Study Quest harian, XP, level, dan badge.
- `/live`: Kelas virtual (Siswa) / `/guru/live` (Guru).
- `/kuis`: Evaluasi belajar.
- `/admin/*`: Panel kendali administrator.
