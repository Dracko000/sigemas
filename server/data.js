import bcrypt from 'bcryptjs';
import { sibiSdBooks } from './sibi-sd.js';

const now = new Date();
const at = (dayOffset, hour = 8, minute = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};
const timeOnly = (d) =>
  new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const passwordHash = bcrypt.hashSync('demo1234', 10);

export const DEMO_PASSWORD = 'demo1234';

export const users = [
  {
    id: 'a1',
    name: 'Admin SIBI',
    email: 'admin@sigemas.id',
    passwordHash,
    role: 'admin',
    title: 'Administrator Sistem',
    status: 'aktif',
    joinedAt: at(-420),
  },
  {
    id: 't1',
    name: 'Raka Pradana, S.Pd.',
    email: 'guru@sigemas.id',
    passwordHash,
    role: 'teacher',
    title: 'Guru Matematika · Wali Kelas X IPA 2',
    subject: 'Matematika',
    classIds: ['x-ipa-2', 'x-ips-1'],
    status: 'aktif',
    joinedAt: at(-380),
  },
  {
    id: 't2',
    name: 'Intan Maharani, S.Pd.',
    email: 'intan@sigemas.id',
    passwordHash,
    role: 'teacher',
    title: 'Guru Bahasa Indonesia',
    subject: 'Bahasa Indonesia',
    classIds: ['x-ipa-2'],
    status: 'aktif',
    joinedAt: at(-350),
  },
  {
    id: 's1',
    name: 'Aisyah Putri',
    email: 'siswa@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPA 2',
    classId: 'x-ipa-2',
    nisn: '0067123451',
    status: 'aktif',
    joinedAt: at(-320),
  },
  {
    id: 's2',
    name: 'Bagas Aditya',
    email: 'bagas@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPA 2',
    classId: 'x-ipa-2',
    nisn: '0067123452',
    status: 'aktif',
    joinedAt: at(-320),
  },
  {
    id: 's3',
    name: 'Citra Lestari',
    email: 'citra@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPA 2',
    classId: 'x-ipa-2',
    nisn: '0067123453',
    status: 'aktif',
    joinedAt: at(-318),
  },
  {
    id: 's4',
    name: 'Dimas Saputra',
    email: 'dimas@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPA 2',
    classId: 'x-ipa-2',
    nisn: '0067123454',
    status: 'aktif',
    joinedAt: at(-317),
  },
  {
    id: 's5',
    name: 'Elang Pratama',
    email: 'elang@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPA 2',
    classId: 'x-ipa-2',
    nisn: '0067123455',
    status: 'aktif',
    joinedAt: at(-310),
  },
  {
    id: 's6',
    name: 'Fitri Nurhaliza',
    email: 'fitri@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPA 2',
    classId: 'x-ipa-2',
    nisn: '0067123456',
    status: 'aktif',
    joinedAt: at(-310),
  },
  {
    id: 's7',
    name: 'Gilang Ramadhan',
    email: 'gilang@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPA 2',
    classId: 'x-ipa-2',
    nisn: '0067123457',
    status: 'aktif',
    joinedAt: at(-305),
  },
  {
    id: 's8',
    name: 'Hana Safira',
    email: 'hana@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPA 2',
    classId: 'x-ipa-2',
    nisn: '0067123458',
    status: 'aktif',
    joinedAt: at(-300),
  },
  {
    id: 's9',
    name: 'Ivan Kurniawan',
    email: 'ivan@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPS 1',
    classId: 'x-ips-1',
    nisn: '0067123491',
    status: 'aktif',
    joinedAt: at(-290),
  },
  {
    id: 's10',
    name: 'Jihan Aulia',
    email: 'jihan@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPS 1',
    classId: 'x-ips-1',
    nisn: '0067123492',
    status: 'aktif',
    joinedAt: at(-289),
  },
  {
    id: 's11',
    name: 'Kaisar Wijaya',
    email: 'kaisar@sigemas.id',
    passwordHash,
    role: 'student',
    title: 'Siswa · X IPS 1',
    classId: 'x-ips-1',
    nisn: '0067123493',
    status: 'aktif',
    joinedAt: at(-288),
  },
  {
    id: 'p1',
    name: 'Sari Wulandari',
    email: 'ortu@sigemas.id',
    passwordHash,
    role: 'parent',
    title: 'Orang Tua / Wali · Aisyah Putri',
    childIds: ['s1'],
    status: 'aktif',
    joinedAt: at(-300),
  },
  {
    id: 'p2',
    name: 'Hendra Aditya',
    email: 'hendra@sigemas.id',
    passwordHash,
    role: 'parent',
    title: 'Orang Tua / Wali · Bagas Aditya',
    childIds: ['s2'],
    status: 'aktif',
    joinedAt: at(-280),
  },
  {
    id: 't3',
    name: 'Fajar Nugroho, S.Kom.',
    email: 'fajar@sigemas.id',
    passwordHash,
    role: 'teacher',
    title: 'Guru Informatika',
    subject: 'Informatika',
    classIds: ['x-ipa-2'],
    status: 'nonaktif',
    joinedAt: at(-260),
  },
];

const subjectMeta = {
  Matematika: {
    color: '#1E88E5',
    cover: ['#1565C0', '#0D47A1'],
    chapters: [
      'Bilangan Berpangkat dan Bentuk Akar',
      'Persamaan dan Pertidaksamaan Linear Nilai Mutlak',
      'Fungsi Kuadrat',
      'Trigonometri Dasar',
      'Sistem Persamaan Linear',
      'Statistika dan Peluang',
    ],
    hooks: [
      'Banyak pola di sekitar kita—dari pertumbuhan tabungan hingga penyebaran informasi—dapat diringkas dengan operasi bilangan berpangkat.',
      'Nilai mutlak membantu kita mengukur jarak tanpa memedulikan arah, seperti jarak rumah ke sekolah yang selalu bernilai positif.',
      'Fungsi kuadrat muncul pada lintasan bola, lengkung jembatan, dan desain parabola pada antena.',
      'Trigonometri menghubungkan sudut dengan panjang sisi, fondasi bagi navigasi, arsitektur, dan grafika komputer.',
      'Sistem persamaan linear dipakai untuk menyelesaikan masalah harga, campuran bahan, dan perencanaan produksi.',
      'Statistika membantu kita membaca data, sementara peluang membantu mengambil keputusan saat ada ketidakpastian.',
    ],
  },
  'Bahasa Indonesia': {
    color: '#FF9800',
    cover: ['#FB8C00', '#E65100'],
    chapters: [
      'Teks Laporan Hasil Observasi',
      'Teks Eksposisi',
      'Teks Anekdot',
      'Hikayat dan Cerpen',
      'Teks Negosiasi',
      'Teks Biografi',
    ],
    hooks: [
      'Laporan hasil observasi menyajikan fakta sistematis tentang objek yang benar-benar diamati.',
      'Teks eksposisi meyakinkan pembaca dengan argumen yang didukung data dan penalaran logis.',
      'Anekdot mengkritik persoalan sosial dengan sindiran ringan yang menggelitik.',
      'Hikayat dan cerpen sama-sama bercerita, tetapi berbeda dalam bahasa, ruang, dan cara membangun konflik.',
      'Negosiasi adalah seni mencari kesepakatan tanpa harus mengalahkan pihak lain.',
      'Biografi merangkai perjalanan hidup seseorang menjadi pelajaran yang bisa kita ambil.',
    ],
  },
  IPA: {
    color: '#16A34A',
    cover: ['#2E7D32', '#1B5E20'],
    chapters: [
      'Pengukuran dalam Kerja Ilmiah',
      'Virus dan Peranannya',
      'Klasifikasi Makhluk Hidup',
      'Energi Terbarukan',
      'Ekosistem',
      'Pemanasan Global',
    ],
    hooks: [
      'Ketelitian pengukuran menentukan kualitas kesimpulan dalam setiap penyelidikan ilmiah.',
      'Virus berada di batas antara makhluk hidup dan benda mati, namun dampaknya sangat nyata.',
      'Klasifikasi membantu ilmuwan berbicara tentang jutaan makhluk hidup dengan bahasa yang sama.',
      'Matahari, angin, dan air menyimpan energi yang dapat kita manfaatkan tanpa menghabiskan cadangan bumi.',
      'Ekosistem adalah jaringan kehidupan tempat setiap komponen saling bergantung.',
      'Pemanasan global menuntut pemahaman sains sekaligus tindakan kolektif yang terukur.',
    ],
  },
  'Sejarah Indonesia': {
    color: '#8E24AA',
    cover: ['#6A1B9A', '#4A148C'],
    chapters: [
      'Konsep Sejarah dan Sumbernya',
      'Asal-Usul Manusia Indonesia',
      'Peradaban Awal Dunia',
      'Masuknya Hindu-Buddha',
      'Kerajaan-Kerajaan Islam',
      'Kolonialisme dan Perlawanan',
    ],
    hooks: [
      'Sejarah bukan sekadar hafalan tahun, melainkan cara membaca jejak dan menimbang sumber.',
      'Fosil dan artefak menjadi petunjuk perjalanan panjang manusia di kepulauan Nusantara.',
      'Peradaban awal dunia menunjukkan bagaimana manusia membangun kota, hukum, dan sistem kepercayaan.',
      'Jalur dagang membawa pengaruh Hindu-Buddha dan melahirkan kerajaan-kerajaan besar di Nusantara.',
      'Islam datang melalui pedagogang, ulama, dan jaringan budaya yang hidup di pelabuhan-pelabuhan.',
      'Kolonialisme meninggalkan luka sekaligus memicu gerakan perlawanan dan kesadaran kebangsaan.',
    ],
  },
  'Bahasa Inggris': {
    color: '#00ACC1',
    cover: ['#00838F', '#004D40'],
    chapters: [
      'Talking About Self',
      'Congratulating and Complimenting',
      'Expressing Intentions',
      'Descriptive Text',
      'Announcement',
      'Narrative Text',
    ],
    hooks: [
      'Introducing yourself well opens the door to new friendships and opportunities.',
      'Congratulations and compliments build confidence when they are sincere and specific.',
      'Intentions help you plan, negotiate, and explain what you are going to do next.',
      'Descriptive text paints a picture with words so the reader can almost see the object.',
      'Announcements deliver important information clearly, briefly, and to the right audience.',
      'Narratives move readers through conflict and resolution, often leaving a lesson behind.',
    ],
  },
  Informatika: {
    color: '#3949AB',
    cover: ['#283593', '#1A237E'],
    chapters: [
      'Berpikir Komputasional',
      'Algoritma dan Pemrograman',
      'Struktur Data',
      'Jaringan Komputer',
      'Analisis Data',
      'Dampak Sosial Informatika',
    ],
    hooks: [
      'Berpikir komputasional memecah masalah rumit menjadi langkah yang bisa dikerjakan.',
      'Algoritma adalah resep; program adalah resep yang ditulis untuk dijalankan komputer.',
      'Struktur data menentukan seberapa cepat dan rapi informasi dikelola.',
      'Jaringan komputer menghubungkan perangkat agar dapat berbagi data dan sumber daya.',
      'Analisis data mengubah angka mentah menjadi insight yang dapat dipertanggungjawabkan.',
      'Teknologi membentuk masyarakat, sehingga etika digital bukan pelengkap melainkan kebutuhan.',
    ],
  },
};

const sdSubjectChapters = {
  'Bahasa Indonesia': [
    'Menyimak dan Berbicara dengan Percaya Diri',
    'Membaca Pemahaman dan Kosakata Baru',
    'Menulis Teks Sederhana',
    'Sastra Anak dan Cerita Rakyat',
    'Proyek Literasi Kelas',
  ],
  Matematika: [
    'Bilangan dan Operasi Hitung',
    'Pecahan dan Pengukuran',
    'Geometri di Sekitar Kita',
    'Data, Diagram, dan Pola',
    'Proyek Matematika Kontekstual',
  ],
  IPAS: [
    'Makhluk Hidup dan Lingkungannya',
    'Benda, Materi, dan Perubahannya',
    'Energi dan Gerak',
    'Bumi dan Alam Semesta',
    'Proyek Penyelidikan Sederhana',
  ],
  PJOK: [
    'Gerak Dasar dan Keseimbangan',
    'Kebugaran Jasmani',
    'Permainan dan Kerja Sama',
    'Senam dan Aktivitas Ritmis',
    'Pola Hidup Sehat',
  ],
  'Bahasa Inggris': [
    'Greetings and Introductions',
    'My Family and Friends',
    'School and Daily Activities',
    'Animals, Plants, and Nature',
    'Simple Stories and Projects',
  ],
  'Pendidikan Pancasila': [
    'Pancasila sebagai Dasar Negara',
    'Norma dan Aturan di Rumah serta Sekolah',
    'Hak, Kewajiban, dan Tanggung Jawab',
    'Keberagaman dan Toleransi',
    'Gotong Royong dan Proyek Kewargaan',
  ],
  'Pendidikan Agama Islam': [
    'Al-Qur’an dan Akidah',
    'Ibadah Sehari-hari',
    'Akhlak Mulia',
    'Sejarah Islam',
    'Praktik dan Refleksi',
  ],
  'Pendidikan Agama Kristen': [
    'Allah dan Ciptaan-Nya',
    'Iman dan Doa',
    'Kasih dan Pelayanan',
    'Sejarah Keselamatan',
    'Praktik dan Refleksi',
  ],
  'Pendidikan Agama Katolik': [
    'Allah dan Ciptaan-Nya',
    'Iman dan Doa',
    'Kasih dan Pelayanan',
    'Sejarah Keselamatan',
    'Praktik dan Refleksi',
  ],
  'Pendidikan Agama Hindu': [
    'Dharma dan Tri Kaya Parisudha',
    'Kitab Suci dan Ibadah',
    'Susila dan Akhlak',
    'Sejarah Agama Hindu',
    'Praktik dan Refleksi',
  ],
  'Pendidikan Agama Buddha': [
    'Buddha dan Dharma',
    'Kitab Suci dan Ibadah',
    'Sila dan Kasih Sayang',
    'Sejarah Agama Buddha',
    'Praktik dan Refleksi',
  ],
  'Pendidikan Agama Khonghucu': [
    'Tian dan Nabi Kongzi',
    'Kitab Suci dan Ibadah',
    'Xiao dan Akhlak',
    'Sejarah Agama Khonghucu',
    'Praktik dan Refleksi',
  ],
  'Pendidikan Kepercayaan': [
    'Nilai dan Penghayatan Kepercayaan',
    'Sejarah dan Budaya',
    'Etika dan Tanggung Jawab',
    'Harmoni dengan Alam',
    'Praktik dan Refleksi',
  ],
  'Seni Musik': [
    'Ekspresi Vokal dan Ritme',
    'Alat Musik di Sekitar Kita',
    'Lagu Daerah dan Kebersamaan',
    'Menyusun Karya Musik Sederhana',
    'Apresiasi dan Pertunjukan',
  ],
  'Seni Rupa': [
    'Garis, Bentuk, dan Warna',
    'Menggambar dan Mewarnai',
    'Kerajinan Bahan Alam',
    'Karya Seni dan Makna',
    'Apresiasi dan Pameran',
  ],
  'Seni Tari': [
    'Gerak dan Ekspresi',
    'Ritme dan Musik Pengiring',
    'Tari Daerah Indonesia',
    'Menyusun Gerak Kreatif',
    'Apresiasi dan Pertunjukan',
  ],
  'Seni Teater': [
    'Ekspresi dan Karakter',
    'Dialog dan Gerak Panggung',
    'Cerita dan Skenario',
    'Menyiapkan Pertunjukan',
    'Apresiasi dan Pementasan',
  ],
  'Koding & Kecerdasan Artifisial': [
    'Berpikir Komputasional',
    'Algoritma dan Urutan Perintah',
    'Data dan Pola',
    'Pemrograman Visual',
    'Proyek dan Etika Digital',
  ],
};

const genericSdChapters = [
  'Mengenal Tema Pembelajaran',
  'Aktivitas dan Latihan Terarah',
  'Eksplorasi Kontekstual',
  'Proyek dan Refleksi',
];

const bookSpecs = [
  {
    id: 'mat-10',
    title: 'Matematika untuk SMA/MA/SMK/MAK Kelas X',
    subject: 'Matematika',
    grade: 10,
    authors: ['Dicki Susanto', 'Sri Handayani'],
    year: 2021,
    isbn: '978-602-244-532-1',
    rating: 4.9,
    downloads: 18420,
    synopsis:
      'Buku matematika wajib kelas X yang membangun penalaran kuantitatif melalui bilangan berpangkat, fungsi kuadrat, trigonometri, hingga statistika. Setiap bab dilengkapi aktivitas eksplorasi dan latihan kontekstual.',
    status: 'synced',
    featured: true,
  },
  {
    id: 'ind-10',
    title: 'Bahasa Indonesia untuk SMA/MA/SMK/MAK Kelas X',
    subject: 'Bahasa Indonesia',
    grade: 10,
    authors: ['Suharmi', 'Asep Yudha Wirajaya'],
    year: 2021,
    isbn: '978-602-244-533-8',
    rating: 4.8,
    downloads: 16240,
    synopsis:
      'Mengasah kemampuan berbahasa melalui teks laporan, eksposisi, anekdot, hikayat, negosiasi, dan biografi. Dilengkapi kegiatan menulis, menyimak, serta refleksi bahasa.',
    status: 'synced',
    featured: true,
  },
  {
    id: 'ipa-10',
    title: 'Ilmu Pengetahuan Alam Kelas X',
    subject: 'IPA',
    grade: 10,
    authors: ['Ayuk Ratna Puspaningsih', 'Elizabeth T. Novitasari'],
    year: 2021,
    isbn: '978-602-244-534-5',
    rating: 4.7,
    downloads: 15120,
    synopsis:
      'Menjelajahi kerja ilmiah, virus, klasifikasi makhluk hidup, energi terbarukan, ekosistem, dan pemanasan global dengan pendekatan penyelidikan.',
    status: 'synced',
    featured: true,
  },
  {
    id: 'sej-10',
    title: 'Sejarah Indonesia Kelas X',
    subject: 'Sejarah Indonesia',
    grade: 10,
    authors: ['Restu Gunawan', 'Sardiman A.M.'],
    year: 2021,
    isbn: '978-602-244-535-2',
    rating: 4.6,
    downloads: 11280,
    synopsis:
      'Membaca perjalanan manusia Indonesia dari sumber sejarah, peradaban awal, kerajaan Hindu-Buddha dan Islam, sampai kolonialisme serta perlawanan.',
    status: 'synced',
    featured: false,
  },
  {
    id: 'eng-10',
    title: 'Bahasa Inggris untuk SMA/MA/SMK/MAK Kelas X',
    subject: 'Bahasa Inggris',
    grade: 10,
    authors: ['Utami Widiati', 'Zuliati Rohmah'],
    year: 2021,
    isbn: '978-602-244-536-9',
    rating: 4.7,
    downloads: 13960,
    synopsis:
      'Memperkuat communicative competence melalui teks lisan dan tulis tentang diri, apresiasi, niat, deskripsi, pengumuman, dan naratif.',
    status: 'synced',
    featured: false,
  },
  {
    id: 'inf-10',
    title: 'Informatika untuk SMA/MA/SMK/MAK Kelas X',
    subject: 'Informatika',
    grade: 10,
    authors: ['Mushthofa', 'Budi Prasetyo'],
    year: 2021,
    isbn: '978-602-244-537-6',
    rating: 4.8,
    downloads: 10040,
    synopsis:
      'Membangun literasi digital melalui berpikir komputasional, algoritma, struktur data, jaringan, analisis data, dan dampak sosial teknologi.',
    status: 'synced',
    featured: true,
  },
];

function pageParagraphs(subject, chapterTitle, pageKind, hook) {
  const common = [
    `Pada bagian ini, kita akan mendalami ${chapterTitle.toLowerCase()} melalui pengamatan, diskusi, dan latihan terarah. Bacalah uraian berikut dengan cermat, lalu catat pertanyaan yang muncul di benakmu.`,
    `Konsep ${chapterTitle.toLowerCase()} tidak berdiri sendiri. Ia terhubung dengan pengalaman sehari-hari, materi bab sebelumnya, serta keterampilan yang akan kamu gunakan di kelas berikutnya.`,
    `Gunakan strategi membaca aktif: tandai kata kunci, buat peta konsep singkat, dan hubungkan setiap contoh dengan situasi yang pernah kamu alami. Dengan begitu, pemahamanmu akan bertahan lebih lama.`,
  ];
  if (pageKind === 'Pendahuluan') {
    return [
      hook,
      `Dalam bab ${chapterTitle}, kita akan mengeksplorasi tiga pertanyaan utama: apa konsepnya, mengapa penting, dan bagaimana menerapkannya dalam konteks nyata. Ketiga pertanyaan ini menjadi kompas belajar kita.`,
      common[2],
    ];
  }
  if (pageKind === 'Konsep Inti') {
    return [
      `Inti dari ${chapterTitle.toLowerCase()} adalah kemampuan mengenali pola, memilih representasi yang tepat, dan menjelaskan alasan di balik setiap langkah. Hindari sekadar menghafal; utamakan pemahaman yang dapat kamu transfer ke masalah baru.`,
      `Perhatikan contoh yang diberikan. Identifikasi informasi yang diketahui, tentukan tujuan, lalu susun strategi penyelesaian. Setelah itu, periksa kembali apakah hasilmu masuk akal dalam konteks soal.`,
      `Diskusikan dengan teman sebangkumu: bagian mana yang paling menantang? Sering kali, menjelaskan konsep kepada orang lain adalah cara tercepat untuk menguji pemahaman kita sendiri.`,
    ];
  }
  return [
    `Saatnya berlatih. Kerjakan latihan berikut secara mandiri, kemudian bandingkan jawabanmu dengan teman. Fokus pada proses berpikir, bukan hanya hasil akhir.`,
    `Refleksikan pembelajaranmu: apa satu hal baru yang kamu pahami, apa yang masih membingungkan, dan langkah apa yang akan kamu ambil untuk menutup celah tersebut?`,
    `Catat rangkuman bab dalam tiga kalimat. Rangkuman yang baik memuat konsep kunci, contoh penerapan, dan satu pertanyaan untuk didiskusikan pada pertemuan berikutnya.`,
  ];
}

function buildChapters(spec, meta) {
  return meta.chapters.map((title, index) => {
    const chapterNumber = index + 1;
    const startPage = index * 3 + 1;
    const pages = ['Pendahuluan', 'Konsep Inti', 'Latihan dan Refleksi'].map((kind, pageIndex) => ({
      page: startPage + pageIndex,
      kind,
      heading: `${kind}: ${title}`,
      paragraphs: pageParagraphs(spec.subject, title, kind, meta.hooks[index]),
    }));
    return {
      id: `${spec.id}-bab-${chapterNumber}`,
      number: chapterNumber,
      title,
      startPage,
      endPage: startPage + 2,
      summary: meta.hooks[index],
      objectives: [
        `Menjelaskan konsep dasar ${title.toLowerCase()} dengan bahasa sendiri.`,
        `Menerapkan ${title.toLowerCase()} untuk menyelesaikan masalah kontekstual.`,
        `Merefleksikan proses belajar dan mengidentifikasi langkah perbaikan.`,
      ],
      pages,
    };
  });
}

const sdMeta = (spec) => {
  if (spec.level !== 'SD/MI' && subjectMeta[spec.subject]) return subjectMeta[spec.subject];
  const chapters = sdSubjectChapters[spec.subject] || genericSdChapters;
  const teacherGuide =
    spec.audience === 'teacher' ||
    spec.bookType === 'Buku Panduan Guru' ||
    /panduan guru/i.test(spec.title);
  return {
    color: spec.color,
    cover: [spec.cover.from, spec.cover.to],
    chapters,
    hooks: chapters.map(
      (title) =>
        `Bab "${title}" mengajak ${teacherGuide ? 'guru' : 'siswa'} SD/MI kelas ${spec.grade} mengamati, mencoba, dan menyimpulkan melalui aktivitas yang dekat dengan kehidupan sehari-hari.`
    ),
  };
};

const allBookSpecs = [...sibiSdBooks, ...bookSpecs];

export const books = allBookSpecs.map((spec) => {
  const meta = sdMeta(spec);
  const teacherGuide =
    spec.audience === 'teacher' ||
    spec.bookType === 'Buku Panduan Guru' ||
    /panduan guru/i.test(spec.title);
  const baseTags = spec.tags || [spec.subject, `Kelas ${spec.grade}`, 'Kurikulum Merdeka'];
  const tags = teacherGuide
    ? [...new Set([...baseTags.filter((tag) => tag !== 'Buku Siswa'), 'Buku Panduan Guru'])]
    : baseTags;
  return {
    ...spec,
    level: spec.level || 'SMA/MA',
    audience: teacherGuide ? 'teacher' : 'student',
    bookType: teacherGuide ? 'Buku Panduan Guru' : spec.bookType || 'Buku Siswa',
    synopsis: teacherGuide
      ? spec.synopsis.replace(/^Buku siswa/i, 'Buku panduan guru')
      : spec.synopsis,
    pages: spec.pages || meta.chapters.length * 3,
    cover: spec.cover || { from: meta.cover[0], to: meta.cover[1] },
    color: spec.color || meta.color,
    chapters: buildChapters(spec, meta),
    tags,
    license: spec.license || 'Hak Cipta Terpelihara · Kemendikdasmen',
  };
});

export const classes = [
  {
    id: 'x-ipa-2',
    name: 'X IPA 2',
    grade: 10,
    academicYear: '2025/2026',
    homeroomId: 't1',
    room: 'R-204',
    studentIds: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'],
    subjects: ['Matematika', 'Bahasa Indonesia', 'IPA', 'Sejarah Indonesia', 'Bahasa Inggris', 'Informatika'],
    schedule: [
      { day: 'Senin', start: '07:30', end: '09:00', subject: 'Matematika', room: 'R-204', teacherId: 't1' },
      { day: 'Senin', start: '09:15', end: '10:45', subject: 'Bahasa Indonesia', room: 'R-204', teacherId: 't2' },
      { day: 'Selasa', start: '07:30', end: '09:00', subject: 'IPA', room: 'Lab IPA', teacherId: 't2' },
      { day: 'Selasa', start: '12:45', end: '14:15', subject: 'Informatika', room: 'Lab Komputer', teacherId: 't3' },
      { day: 'Rabu', start: '09:15', end: '10:45', subject: 'Matematika', room: 'R-204', teacherId: 't1' },
      { day: 'Kamis', start: '07:30', end: '09:00', subject: 'Sejarah Indonesia', room: 'R-204', teacherId: 't3' },
      { day: 'Jumat', start: '07:30', end: '09:00', subject: 'Bahasa Inggris', room: 'R-204', teacherId: 't2' },
    ],
  },
  {
    id: 'x-ips-1',
    name: 'X IPS 1',
    grade: 10,
    academicYear: '2025/2026',
    homeroomId: 't2',
    room: 'R-301',
    studentIds: ['s9', 's10', 's11'],
    subjects: ['Matematika', 'Bahasa Indonesia', 'Sejarah Indonesia', 'Bahasa Inggris'],
    schedule: [
      { day: 'Senin', start: '10:45', end: '12:15', subject: 'Matematika', room: 'R-301', teacherId: 't1' },
      { day: 'Kamis', start: '09:15', end: '10:45', subject: 'Matematika', room: 'R-301', teacherId: 't1' },
    ],
  },
];

export const bookProgress = {
  's1:mat-10': { percent: 68, lastPage: 8, updatedAt: at(-1) },
  's1:ind-10': { percent: 42, lastPage: 6, updatedAt: at(-2) },
  's1:ipa-10': { percent: 31, lastPage: 4, updatedAt: at(-4) },
  's1:inf-10': { percent: 88, lastPage: 12, updatedAt: at(-1) },
  's1:eng-10': { percent: 17, lastPage: 2, updatedAt: at(-6) },
};

export const liveSessions = [
  {
    id: 'live-1',
    title: 'Matematika · Bab 3: Fungsi Kuadrat',
    classId: 'x-ipa-2',
    teacherId: 't1',
    bookId: 'mat-10',
    chapterId: 'mat-10-bab-3',
    status: 'live',
    startedAt: at(0, new Date().getHours(), Math.max(0, new Date().getMinutes() - 18)),
    scheduledAt: at(0, 8, 0),
    durationMin: 90,
    participants: 27,
  },
  {
    id: 'live-2',
    title: 'Bahasa Indonesia · Teks Eksposisi',
    classId: 'x-ipa-2',
    teacherId: 't2',
    bookId: 'ind-10',
    chapterId: 'ind-10-bab-2',
    status: 'scheduled',
    scheduledAt: at(1, 9, 15),
    durationMin: 90,
    participants: 0,
  },
  {
    id: 'live-3',
    title: 'Informatika · Struktur Data',
    classId: 'x-ipa-2',
    teacherId: 't3',
    bookId: 'inf-10',
    chapterId: 'inf-10-bab-3',
    status: 'scheduled',
    scheduledAt: at(2, 12, 45),
    durationMin: 90,
    participants: 0,
  },
  {
    id: 'live-4',
    title: 'Matematika · Kuis Bab 2',
    classId: 'x-ips-1',
    teacherId: 't1',
    bookId: 'mat-10',
    chapterId: 'mat-10-bab-2',
    status: 'ended',
    startedAt: at(-1, 10, 0),
    endedAt: at(-1, 11, 30),
    durationMin: 90,
    participants: 31,
    recording: true,
  },
  {
    id: 'live-5',
    title: 'IPA · Virus dan Peranannya',
    classId: 'x-ipa-2',
    teacherId: 't2',
    bookId: 'ipa-10',
    chapterId: 'ipa-10-bab-2',
    status: 'ended',
    startedAt: at(-3, 7, 30),
    endedAt: at(-3, 9, 0),
    durationMin: 90,
    participants: 30,
    recording: true,
  },
];

export const quizzes = [
  {
    id: 'quiz-mat-3',
    title: 'Kuis Bab 3 — Fungsi Kuadrat',
    bookId: 'mat-10',
    chapterId: 'mat-10-bab-3',
    subject: 'Matematika',
    teacherId: 't1',
    classId: 'x-ipa-2',
    durationMin: 15,
    difficulty: 'Menengah',
    published: true,
    questions: [
      {
        id: 'q1',
        question: 'Grafik fungsi y = x² − 4x + 3 memotong sumbu X di titik …',
        options: ['(1, 0) dan (3, 0)', '(−1, 0) dan (3, 0)', '(1, 0) dan (−3, 0)', '(0, 3) dan (0, 1)'],
        answer: 0,
        explanation: 'Faktorkan x² − 4x + 3 = (x − 1)(x − 3), sehingga akar-akarnya x = 1 dan x = 3.',
      },
      {
        id: 'q2',
        question: 'Titik puncak grafik y = x² − 6x + 5 adalah …',
        options: ['(3, −4)', '(−3, −4)', '(3, 4)', '(6, 5)'],
        answer: 0,
        explanation: 'x = −b/2a = 6/2 = 3 dan y = 9 − 18 + 5 = −4.',
      },
      {
        id: 'q3',
        question: 'Sumbu simetri fungsi f(x) = 2x² + 4x − 1 adalah …',
        options: ['x = −1', 'x = 1', 'x = −2', 'x = 2'],
        answer: 0,
        explanation: 'x = −b/2a = −4/(2·2) = −1.',
      },
      {
        id: 'q4',
        question: 'Diskriminan dari x² + 2x + 5 adalah …',
        options: ['−16', '16', '−4', '24'],
        answer: 0,
        explanation: 'D = b² − 4ac = 2² − 4(1)(5) = 4 − 20 = −16, sehingga grafik tidak memotong sumbu X.',
      },
      {
        id: 'q5',
        question: 'Bentuk umum fungsi kuadrat yang benar adalah …',
        options: ['y = ax² + bx + c, a ≠ 0', 'y = ax + b, a ≠ 0', 'y = ax³ + bx, a ≠ 0', 'y = a/x + b, a ≠ 0'],
        answer: 0,
        explanation: 'Fungsi kuadrat selalu memiliki pangkat tertinggi dua pada variabelnya.',
      },
    ],
  },
  {
    id: 'quiz-mat-1',
    title: 'Latihan Bab 1 — Bilangan Berpangkat',
    bookId: 'mat-10',
    chapterId: 'mat-10-bab-1',
    subject: 'Matematika',
    teacherId: 't1',
    classId: 'x-ipa-2',
    durationMin: 10,
    difficulty: 'Mudah',
    published: true,
    questions: [
      {
        id: 'q1',
        question: 'Nilai dari 2⁵ adalah …',
        options: ['32', '25', '10', '64'],
        answer: 0,
        explanation: '2⁵ = 2 × 2 × 2 × 2 × 2 = 32.',
      },
      {
        id: 'q2',
        question: 'Bentuk sederhana dari √72 adalah …',
        options: ['6√2', '8√3', '12√2', '2√18'],
        answer: 0,
        explanation: '√72 = √(36 × 2) = 6√2.',
      },
      {
        id: 'q3',
        question: 'Nilai dari (a³)² adalah …',
        options: ['a⁶', 'a⁵', 'a⁹', '2a³'],
        answer: 0,
        explanation: 'Pada pangkat berlapis, kalikan eksponennya: 3 × 2 = 6.',
      },
      {
        id: 'q4',
        question: 'Nilai dari 3⁻² adalah …',
        options: ['1/9', '−9', '1/6', '9'],
        answer: 0,
        explanation: 'a⁻ⁿ = 1/aⁿ, sehingga 3⁻² = 1/9.',
      },
      {
        id: 'q5',
        question: 'Hasil dari √3 × √12 adalah …',
        options: ['6', '36', '3√2', '4√3'],
        answer: 0,
        explanation: '√3 × √12 = √36 = 6.',
      },
    ],
  },
  {
    id: 'quiz-ind-2',
    title: 'Kuis Bab 2 — Teks Eksposisi',
    bookId: 'ind-10',
    chapterId: 'ind-10-bab-2',
    subject: 'Bahasa Indonesia',
    teacherId: 't2',
    classId: 'x-ipa-2',
    durationMin: 12,
    difficulty: 'Mudah',
    published: true,
    questions: [
      {
        id: 'q1',
        question: 'Tujuan utama teks eksposisi adalah …',
        options: [
          'Menjelaskan informasi disertai argumen',
          'Menghibur pembaca dengan cerita',
          'Menggambarkan objek secara detail',
          'Membujuk pembaca membeli produk',
        ],
        answer: 0,
        explanation: 'Teks eksposisi memaparkan informasi dan gagasan dengan argumen yang logis.',
      },
      {
        id: 'q2',
        question: 'Struktur teks eksposisi adalah …',
        options: [
          'Tesis — argumentasi — penegasan ulang',
          'Orientasi — komplikasi — resolusi',
          'Pernyataan umum — aspek yang dilaporkan',
          'Abstraksi — orientasi — koda',
        ],
        answer: 0,
        explanation: 'Teks eksposisi dibuka dengan tesis, diikuti argumentasi, lalu penegasan ulang.',
      },
      {
        id: 'q3',
        question: 'Kalimat berikut yang merupakan fakta adalah …',
        options: [
          'Indonesia memiliki lebih dari 17.000 pulau.',
          'Pemerintah seharusnya menambah anggaran pendidikan.',
          'Saya rasa film itu sangat membosankan.',
          'Menurut saya, olahraga pagi paling menyenangkan.',
        ],
        answer: 0,
        explanation: 'Fakta dapat diverifikasi, sedangkan opini berisi penilaian pribadi.',
      },
      {
        id: 'q4',
        question: 'Kata hubung "oleh karena itu" biasanya menandai …',
        options: ['Simpulan atau akibat', 'Pertentangan', 'Waktu', 'Tujuan'],
        answer: 0,
        explanation: 'Konjungsi "oleh karena itu" menandai hubungan sebab-akibat atau simpulan.',
      },
      {
        id: 'q5',
        question: 'Ciri bahasa teks eksposisi adalah …',
        options: ['Denotatif dan lugas', 'Konotatif dan puitis', 'Penuh majas', 'Banyak dialog'],
        answer: 0,
        explanation: 'Teks eksposisi menggunakan bahasa denotatif agar informasi tidak ambigu.',
      },
    ],
  },
  {
    id: 'quiz-ipa-2',
    title: 'Kuis Bab 2 — Virus dan Peranannya',
    bookId: 'ipa-10',
    chapterId: 'ipa-10-bab-2',
    subject: 'IPA',
    teacherId: 't2',
    classId: 'x-ipa-2',
    durationMin: 15,
    difficulty: 'Menengah',
    published: true,
    questions: [
      {
        id: 'q1',
        question: 'Virus tidak digolongkan sebagai sel karena …',
        options: [
          'Tidak memiliki sitoplasma dan organel',
          'Berukuran sangat kecil',
          'Dapat bereproduksi',
          'Memiliki materi genetik',
        ],
        answer: 0,
        explanation: 'Virus tidak memiliki struktur sel lengkap dan hanya dapat bereplikasi di dalam sel hidup.',
      },
      {
        id: 'q2',
        question: 'Virus yang menyerang bakteri disebut …',
        options: ['Bakteriofag', 'Retrovirus', 'Bakteriobakteri', 'Virofag'],
        answer: 0,
        explanation: 'Bakteriofag adalah virus dengan inang bakteri.',
      },
      {
        id: 'q3',
        question: 'Siklus reproduksi virus yang menyebabkan sel inang pecah disebut …',
        options: ['Litik', 'Lisogenik', 'Transformasi', 'Konjugasi'],
        answer: 0,
        explanation: 'Siklus litik diakhiri lisis, yaitu pecahnya sel inang.',
      },
      {
        id: 'q4',
        question: 'Vaksin bekerja dengan cara …',
        options: [
          'Memicu kekebalan menggunakan antigen yang dilemahkan',
          'Membunuh semua bakteri di tubuh',
          'Menggantikan sel darah putih',
          'Mencegah virus masuk melalui kulit',
        ],
        answer: 0,
        explanation: 'Vaksin melatih sistem imun mengenali antigen tanpa menyebabkan penyakit berat.',
      },
      {
        id: 'q5',
        question: 'Penyebab COVID-19 adalah …',
        options: ['SARS-CoV-2', 'HIV', 'Influenza B', 'Hepatitis B'],
        answer: 0,
        explanation: 'COVID-19 disebabkan oleh coronavirus SARS-CoV-2.',
      },
    ],
  },
];

export const assessments = [
  { id: 'as1', classId: 'x-ipa-2', title: 'Tugas Bab 1', type: 'Tugas', weight: 15, maxScore: 100, date: at(-24) },
  { id: 'as2', classId: 'x-ipa-2', title: 'Kuis Bab 2', type: 'Kuis', weight: 15, maxScore: 100, date: at(-17) },
  { id: 'as3', classId: 'x-ipa-2', title: 'Tugas Bab 3', type: 'Tugas', weight: 20, maxScore: 100, date: at(-3) },
  { id: 'as4', classId: 'x-ipa-2', title: 'UTS Matematika', type: 'UTS', weight: 25, maxScore: 100, date: at(-10) },
  { id: 'as5', classId: 'x-ipa-2', title: 'Kuis Bab 3', type: 'Kuis', weight: 10, maxScore: 100, date: at(2) },
  { id: 'as6', classId: 'x-ipa-2', title: 'Proyek Statistika', type: 'Proyek', weight: 15, maxScore: 100, date: at(9) },
];

const scoreSeed = {
  s1: [88, 92, 90, 85, null, null],
  s2: [76, 80, 78, 74, null, null],
  s3: [92, 95, 94, 91, null, null],
  s4: [70, 68, 72, 65, null, null],
  s5: [84, 82, 86, 80, null, null],
  s6: [89, 91, 88, 90, null, null],
  s7: [78, 76, 80, 73, null, null],
  s8: [95, 93, 96, 94, null, null],
};

export const scores = [];
for (const [studentId, values] of Object.entries(scoreSeed)) {
  values.forEach((value, index) => {
    if (value != null) {
      scores.push({
        id: `sc-${studentId}-${assessments[index].id}`,
        assessmentId: assessments[index].id,
        studentId,
        score: value,
        updatedAt: at(-1),
      });
    }
  });
}

export const subjectGrades = [
  { subject: 'Matematika', color: '#1E88E5', tugas: 89, kuis: 92, uts: 85, uas: 88, final: 88, mastery: 84 },
  { subject: 'Bahasa Indonesia', color: '#FF9800', tugas: 92, kuis: 90, uts: 87, uas: 91, final: 90, mastery: 89 },
  { subject: 'IPA', color: '#16A34A', tugas: 86, kuis: 84, uts: 80, uas: 85, final: 84, mastery: 78 },
  { subject: 'Sejarah Indonesia', color: '#8E24AA', tugas: 84, kuis: 82, uts: 85, uas: 86, final: 84, mastery: 76 },
  { subject: 'Bahasa Inggris', color: '#00ACC1', tugas: 88, kuis: 86, uts: 85, uas: 90, final: 87, mastery: 82 },
  { subject: 'Informatika', color: '#3949AB', tugas: 95, kuis: 93, uts: 92, uas: 94, final: 94, mastery: 92 },
];

export const tasks = [
  {
    id: 'task-1',
    title: 'Latihan Bab 3: Fungsi Kuadrat',
    description: 'Kerjakan 15 soal pada buku Matematika halaman 78–82. Tuliskan langkah penyelesaian secara lengkap.',
    classId: 'x-ipa-2',
    teacherId: 't1',
    subject: 'Matematika',
    bookId: 'mat-10',
    chapterId: 'mat-10-bab-3',
    type: 'Tugas',
    maxScore: 100,
    dueAt: at(2, 23, 59),
    createdAt: at(-4),
    status: 'open',
    submittedCount: 26,
    totalStudents: 32,
  },
  {
    id: 'task-2',
    title: 'Kuis Bab 3: Fungsi Kuadrat',
    description: 'Kuis pilihan ganda 5 soal. Waktu pengerjaan 15 menit dan hanya dapat dikerjakan satu kali.',
    classId: 'x-ipa-2',
    teacherId: 't1',
    subject: 'Matematika',
    bookId: 'mat-10',
    chapterId: 'mat-10-bab-3',
    type: 'Kuis',
    maxScore: 100,
    dueAt: at(3, 15, 0),
    createdAt: at(-2),
    status: 'open',
    submittedCount: 19,
    totalStudents: 32,
  },
  {
    id: 'task-3',
    title: 'Proyek Statistika: Data di Sekitarku',
    description: 'Kumpulkan data tinggi badan 30 teman, sajikan dalam tabel dan histogram, lalu tuliskan interpretasinya.',
    classId: 'x-ipa-2',
    teacherId: 't1',
    subject: 'Matematika',
    bookId: 'mat-10',
    chapterId: 'mat-10-bab-6',
    type: 'Proyek',
    maxScore: 100,
    dueAt: at(9, 23, 59),
    createdAt: at(-1),
    status: 'open',
    submittedCount: 3,
    totalStudents: 32,
  },
  {
    id: 'task-4',
    title: 'Resume Teks Eksposisi',
    description: 'Buat resume satu teks eksposisi dari surat kabar, identifikasi tesis, argumentasi, dan penegasan ulang.',
    classId: 'x-ipa-2',
    teacherId: 't2',
    subject: 'Bahasa Indonesia',
    bookId: 'ind-10',
    chapterId: 'ind-10-bab-2',
    type: 'Tugas',
    maxScore: 100,
    dueAt: at(-1, 23, 59),
    createdAt: at(-6),
    status: 'closed',
    submittedCount: 30,
    totalStudents: 32,
  },
];

export const submissions = [
  { id: 'sub1', taskId: 'task-1', studentId: 's2', submittedAt: at(0, 7, 12), fileName: 'tugas-bab3-bagas.pdf', status: 'menunggu' },
  { id: 'sub2', taskId: 'task-1', studentId: 's3', submittedAt: at(0, 6, 45), fileName: 'tugas-bab3-citra.pdf', status: 'menunggu' },
  { id: 'sub3', taskId: 'task-3', studentId: 's1', submittedAt: at(-1, 20, 2), fileName: 'proyek-statistika-aisyah.xlsx', status: 'menunggu' },
  { id: 'sub4', taskId: 'task-1', studentId: 's5', submittedAt: at(-1, 19, 30), fileName: 'tugas-bab3-elang.pdf', status: 'dinilai', score: 84 },
  { id: 'sub5', taskId: 'task-1', studentId: 's8', submittedAt: at(-1, 16, 20), fileName: 'tugas-bab3-hana.pdf', status: 'dinilai', score: 96 },
];

export const attendanceSessions = [
  {
    id: 'att-1',
    classId: 'x-ipa-2',
    date: at(-1),
    topic: 'Matematika · Fungsi Kuadrat',
    records: [
      { studentId: 's1', status: 'hadir', joinedAt: at(-1, 7, 32), durationMin: 88 },
      { studentId: 's2', status: 'hadir', joinedAt: at(-1, 7, 35), durationMin: 85 },
      { studentId: 's3', status: 'hadir', joinedAt: at(-1, 7, 31), durationMin: 89 },
      { studentId: 's4', status: 'izin', joinedAt: null, durationMin: 0 },
      { studentId: 's5', status: 'hadir', joinedAt: at(-1, 7, 40), durationMin: 80 },
      { studentId: 's6', status: 'hadir', joinedAt: at(-1, 7, 33), durationMin: 87 },
      { studentId: 's7', status: 'terlambat', joinedAt: at(-1, 8, 5), durationMin: 55 },
      { studentId: 's8', status: 'hadir', joinedAt: at(-1, 7, 30), durationMin: 90 },
    ],
  },
  {
    id: 'att-2',
    classId: 'x-ipa-2',
    date: at(-3),
    topic: 'IPA · Virus dan Peranannya',
    records: [
      { studentId: 's1', status: 'hadir', joinedAt: at(-3, 7, 31), durationMin: 88 },
      { studentId: 's2', status: 'hadir', joinedAt: at(-3, 7, 33), durationMin: 86 },
      { studentId: 's3', status: 'hadir', joinedAt: at(-3, 7, 30), durationMin: 90 },
      { studentId: 's4', status: 'hadir', joinedAt: at(-3, 7, 45), durationMin: 75 },
      { studentId: 's5', status: 'sakit', joinedAt: null, durationMin: 0 },
      { studentId: 's6', status: 'hadir', joinedAt: at(-3, 7, 29), durationMin: 91 },
      { studentId: 's7', status: 'hadir', joinedAt: at(-3, 7, 32), durationMin: 88 },
      { studentId: 's8', status: 'hadir', joinedAt: at(-3, 7, 30), durationMin: 90 },
    ],
  },
  {
    id: 'att-3',
    classId: 'x-ipa-2',
    date: at(-5),
    topic: 'Bahasa Indonesia · Teks Eksposisi',
    records: [
      { studentId: 's1', status: 'hadir', joinedAt: at(-5, 9, 16), durationMin: 87 },
      { studentId: 's2', status: 'terlambat', joinedAt: at(-5, 9, 40), durationMin: 62 },
      { studentId: 's3', status: 'hadir', joinedAt: at(-5, 9, 15), durationMin: 88 },
      { studentId: 's4', status: 'hadir', joinedAt: at(-5, 9, 18), durationMin: 86 },
      { studentId: 's5', status: 'hadir', joinedAt: at(-5, 9, 17), durationMin: 87 },
      { studentId: 's6', status: 'hadir', joinedAt: at(-5, 9, 15), durationMin: 88 },
      { studentId: 's7', status: 'alfa', joinedAt: null, durationMin: 0 },
      { studentId: 's8', status: 'hadir', joinedAt: at(-5, 9, 14), durationMin: 89 },
    ],
  },
  {
    id: 'att-4',
    classId: 'x-ipa-2',
    date: at(-8),
    topic: 'Matematika · Persamaan Nilai Mutlak',
    records: [
      { studentId: 's1', status: 'hadir', joinedAt: at(-8, 7, 30), durationMin: 90 },
      { studentId: 's2', status: 'hadir', joinedAt: at(-8, 7, 32), durationMin: 88 },
      { studentId: 's3', status: 'hadir', joinedAt: at(-8, 7, 31), durationMin: 89 },
      { studentId: 's4', status: 'hadir', joinedAt: at(-8, 7, 36), durationMin: 84 },
      { studentId: 's5', status: 'hadir', joinedAt: at(-8, 7, 30), durationMin: 90 },
      { studentId: 's6', status: 'hadir', joinedAt: at(-8, 7, 29), durationMin: 91 },
      { studentId: 's7', status: 'hadir', joinedAt: at(-8, 7, 39), durationMin: 81 },
      { studentId: 's8', status: 'izin', joinedAt: null, durationMin: 0 },
    ],
  },
];

export const lessonPlans = [
  {
    id: 'rpp-1',
    week: 1,
    classId: 'x-ipa-2',
    subject: 'Matematika',
    topic: 'Bilangan Berpangkat dan Bentuk Akar',
    chapterId: 'mat-10-bab-1',
    dates: '14 – 18 Juli 2026',
    status: 'selesai',
    activities: ['Eksplorasi pola perkalian berulang', 'Sifat-sifat eksponen', 'Latihan bentuk akar'],
    assessment: 'Kuis diagnostik 10 soal',
  },
  {
    id: 'rpp-2',
    week: 2,
    classId: 'x-ipa-2',
    subject: 'Matematika',
    topic: 'Persamaan dan Pertidaksamaan Nilai Mutlak',
    chapterId: 'mat-10-bab-2',
    dates: '21 – 25 Juli 2026',
    status: 'selesai',
    activities: ['Konsep jarak pada garis bilangan', 'Penyelesaian persamaan mutlak', 'Studi kasus toleransi produksi'],
    assessment: 'Kuis Bab 2',
  },
  {
    id: 'rpp-3',
    week: 3,
    classId: 'x-ipa-2',
    subject: 'Matematika',
    topic: 'Fungsi Kuadrat',
    chapterId: 'mat-10-bab-3',
    dates: '28 Juli – 1 Agustus 2026',
    status: 'berlangsung',
    activities: ['Menggambar grafik fungsi kuadrat', 'Menentukan titik puncak', 'Penerapan pada lintasan bola'],
    assessment: 'Tugas Bab 3 dan Kuis Bab 3',
  },
  {
    id: 'rpp-4',
    week: 4,
    classId: 'x-ipa-2',
    subject: 'Matematika',
    topic: 'Trigonometri Dasar',
    chapterId: 'mat-10-bab-4',
    dates: '4 – 8 Agustus 2026',
    status: 'mendatang',
    activities: ['Perbandingan trigonometri', 'Sudut istimewa', 'Penerapan tinggi gedung'],
    assessment: 'Latihan mandiri',
  },
  {
    id: 'rpp-5',
    week: 5,
    classId: 'x-ipa-2',
    subject: 'Matematika',
    topic: 'Sistem Persamaan Linear',
    chapterId: 'mat-10-bab-5',
    dates: '11 – 15 Agustus 2026',
    status: 'mendatang',
    activities: ['Metode substitusi dan eliminasi', 'Interpretasi solusi', 'Proyek optimasi sederhana'],
    assessment: 'Kuis Bab 5',
  },
  {
    id: 'rpp-6',
    week: 6,
    classId: 'x-ipa-2',
    subject: 'Matematika',
    topic: 'Statistika dan Peluang',
    chapterId: 'mat-10-bab-6',
    dates: '18 – 22 Agustus 2026',
    status: 'mendatang',
    activities: ['Mengumpulkan dan menyajikan data', 'Ukuran pemusatan', 'Peluang empirik'],
    assessment: 'Proyek Statistika',
  },
  {
    id: 'rpp-7',
    week: 7,
    classId: 'x-ipa-2',
    subject: 'Matematika',
    topic: 'Review dan Asesmen Sumatif',
    chapterId: 'mat-10-bab-6',
    dates: '25 – 29 Agustus 2026',
    status: 'mendatang',
    activities: ['Peta konsep seluruh bab', 'Latihan soal terpadu', 'Refleksi capaian'],
    assessment: 'Asesmen sumatif akhir semester',
  },
  {
    id: 'rpp-8',
    week: 8,
    classId: 'x-ipa-2',
    subject: 'Matematika',
    topic: 'Pengayaan: Matematika di Dunia Nyata',
    chapterId: 'mat-10-bab-6',
    dates: '1 – 5 September 2026',
    status: 'mendatang',
    activities: ['Studi kasus keuangan', 'Presentasi kelompok', 'Umpan balik sebaya'],
    assessment: 'Presentasi proyek',
  },
];

export const parentNotes = [
  {
    id: 'note-1',
    teacherId: 't1',
    studentId: 's1',
    date: at(-2),
    subject: 'Matematika',
    text: 'Aisyah menunjukkan kemajuan baik dalam memahami fungsi kuadrat. Ia aktif bertanya dan membantu teman. Perlu latihan tambahan pada soal cerita agar lebih teliti.',
  },
  {
    id: 'note-2',
    teacherId: 't2',
    studentId: 's1',
    date: at(-9),
    subject: 'Bahasa Indonesia',
    text: 'Kemampuan menulis argumentasi Aisyah sangat baik. Struktur teksnya rapi. Dorong ia untuk lebih berani membaca hasil tulisan di depan kelas.',
  },
  {
    id: 'note-3',
    teacherId: 't1',
    studentId: 's1',
    date: at(-16),
    subject: 'Matematika',
    text: 'Kehadiran dan partisipasi di kelas live konsisten. Disarankan menjaga ritme belajar 30 menit setiap hari untuk memperkuat pemahaman konsep.',
  },
];

export const notifications = {
  student: [
    { id: 'n1', type: 'live', title: 'Kelas live dimulai', text: 'Matematika · Bab 3: Fungsi Kuadrat bersama Pak Raka.', at: at(0, 8, 0), unread: true },
    { id: 'n2', type: 'task', title: 'Tugas baru: Proyek Statistika', text: 'Batas pengumpulan 9 hari lagi.', at: at(-1, 10, 0), unread: true },
    { id: 'n3', type: 'grade', title: 'Nilai Kuis Bab 2 keluar', text: 'Kamu mendapat 92. Pertahankan!', at: at(-2, 14, 0), unread: false },
  ],
  teacher: [
    { id: 'n1', type: 'submission', title: '3 tugas menunggu penilaian', text: 'Tugas Bab 3 dari Bagas, Citra, dan Elang.', at: at(0, 7, 20), unread: true },
    { id: 'n2', type: 'live', title: 'Kelas X IPA 2 menunggu', text: '27 siswa sudah bergabung di ruang live.', at: at(0, 8, 5), unread: true },
    { id: 'n3', type: 'system', title: 'Sinkronisasi SIBI selesai', text: '67 buku berhasil diverifikasi.', at: at(-1, 22, 0), unread: false },
  ],
  parent: [
    { id: 'n1', type: 'report', title: 'Catatan baru dari Pak Raka', text: 'Perkembangan belajar Aisyah minggu ini.', at: at(-2, 16, 0), unread: true },
    { id: 'n2', type: 'grade', title: 'Nilai Kuis Bab 2 dipublikasikan', text: 'Aisyah memperoleh nilai 92.', at: at(-2, 14, 10), unread: true },
    { id: 'n3', type: 'attendance', title: 'Presensi terbaru tercatat', text: 'Hadir · durasi 88 menit.', at: at(-1, 9, 0), unread: false },
  ],
  admin: [
    { id: 'n1', type: 'system', title: 'Sinkronisasi katalog SIBI', text: '67 buku tersinkron, 0 konflik.', at: at(0, 6, 0), unread: true },
    { id: 'n2', type: 'live', title: '3 sesi live aktif', text: 'Beban server stabil pada 42%.', at: at(0, 8, 10), unread: true },
    { id: 'n3', type: 'user', title: 'Akun guru baru diverifikasi', text: 'Fajar Nugroho, S.Kom. menunggu aktivasi.', at: at(-2, 11, 30), unread: false },
  ],
};

export const activityLogs = [
  { id: 'log-1', actor: 'Raka Pradana', role: 'teacher', action: 'Memulai kelas live', target: 'Matematika · Bab 3', at: at(0, 8, 2), ip: '10.12.4.21' },
  { id: 'log-2', actor: 'Sari Wulandari', role: 'parent', action: 'Melihat laporan belajar', target: 'Aisyah Putri', at: at(0, 7, 45), ip: '10.12.7.8' },
  { id: 'log-3', actor: 'Aisyah Putri', role: 'student', action: 'Mengumpulkan tugas', target: 'Proyek Statistika', at: at(-1, 20, 2), ip: '10.12.9.14' },
  { id: 'log-4', actor: 'Admin SIBI', role: 'admin', action: 'Sinkronisasi katalog', target: '67 buku SIBI', at: at(-1, 22, 0), ip: '10.12.0.2' },
  { id: 'log-5', actor: 'Intan Maharani', role: 'teacher', action: 'Membuat kuis', target: 'Kuis Bab 2 — Teks Eksposisi', at: at(-1, 18, 12), ip: '10.12.4.18' },
  { id: 'log-6', actor: 'Citra Lestari', role: 'student', action: 'Membuka buku digital', target: 'Bahasa Indonesia Kelas X', at: at(-2, 19, 30), ip: '10.12.9.22' },
  { id: 'log-7', actor: 'Hendra Aditya', role: 'parent', action: 'Mengunduh rapor', target: 'Bagas Aditya', at: at(-2, 16, 8), ip: '10.12.7.19' },
  { id: 'log-8', actor: 'Raka Pradana', role: 'teacher', action: 'Menyimpan nilai', target: 'UTS Matematika · X IPA 2', at: at(-3, 15, 40), ip: '10.12.4.21' },
  { id: 'log-9', actor: 'Admin SIBI', role: 'admin', action: 'Menambah pengguna', target: 'Fajar Nugroho, S.Kom.', at: at(-4, 10, 5), ip: '10.12.0.2' },
  { id: 'log-10', actor: 'Aisyah Putri', role: 'student', action: 'Menyelesaikan kuis', target: 'Kuis Bab 3 — Fungsi Kuadrat', at: at(-4, 20, 21), ip: '10.12.9.14' },
];

export const weeklyStudy = [
  { label: 'Sen', minutes: 62, target: 60 },
  { label: 'Sel', minutes: 48, target: 60 },
  { label: 'Rab', minutes: 75, target: 60 },
  { label: 'Kam', minutes: 35, target: 60 },
  { label: 'Jum', minutes: 80, target: 60 },
  { label: 'Sab', minutes: 54, target: 60 },
  { label: 'Min', minutes: 30, target: 60 },
];

export const performanceTrend = [
  { label: 'Pekan 1', score: 78, classAvg: 74 },
  { label: 'Pekan 2', score: 82, classAvg: 76 },
  { label: 'Pekan 3', score: 80, classAvg: 77 },
  { label: 'Pekan 4', score: 86, classAvg: 78 },
  { label: 'Pekan 5', score: 84, classAvg: 79 },
  { label: 'Pekan 6', score: 89, classAvg: 80 },
  { label: 'Pekan 7', score: 91, classAvg: 81 },
  { label: 'Pekan 8', score: 88, classAvg: 82 },
];

export const userGrowth = [
  { label: 'Mei', students: 840, teachers: 46, parents: 320 },
  { label: 'Jun', students: 1120, teachers: 58, parents: 410 },
  { label: 'Jul', students: 1480, teachers: 72, parents: 560 },
  { label: 'Agu', students: 1860, teachers: 88, parents: 720 },
  { label: 'Sep', students: 2240, teachers: 102, parents: 910 },
  { label: 'Okt', students: 2480, teachers: 114, parents: 1040 },
];

export const bookProgressForStudent = (studentId) =>
  Object.entries(bookProgress)
    .filter(([key]) => key.startsWith(`${studentId}:`))
    .map(([key, value]) => ({ bookId: key.split(':')[1], ...value }));

export const resetRuntimeState = () => {};
