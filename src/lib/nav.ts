import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  FileScan,
  FileText,
  LayoutDashboard,
  Library,
  NotebookPen,
  PieChart,
  Radio,
  School,
  ScrollText,
  Star,
  Trophy,
  UserCheck,
  Users,
  Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '../types';

export interface NavItem {
  to: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  match?: string[];
  roles: Role[];
}

export const navByRole: Record<Role, NavItem[]> = {
  student: [
    { to: '/dashboard', label: 'Beranda', icon: LayoutDashboard, roles: ['student'] },
    { to: '/katalog', label: 'Katalog SIBI', shortLabel: 'Katalog', icon: Library, match: ['/baca'], roles: ['student'] },
    { to: '/live', label: 'Kelas Live', shortLabel: 'Live', icon: Radio, match: ['/live'], roles: ['student'] },
    { to: '/kuis', label: 'Arena Kuis', shortLabel: 'Kuis', icon: Trophy, match: ['/kuis'], roles: ['student'] },
    { to: '/flashcards', label: 'Flashcards AI', shortLabel: 'Kartu', icon: Brain, roles: ['student'] },
    { to: '/mindmap', label: 'Interactive Mindmap', shortLabel: 'Peta', icon: PieChart, roles: ['student'] },
    { to: '/quest', label: 'Study Quest', shortLabel: 'Quest', icon: Star, roles: ['student'] },
    { to: '/jadwal', label: 'Jadwal Belajar', shortLabel: 'Jadwal', icon: CalendarDays, roles: ['student'] },
    { to: '/nilai', label: 'Nilai & Presensi', shortLabel: 'Nilai', icon: ChartNoAxesColumnIncreasing, roles: ['student'] },
  ],
  teacher: [
    { to: '/dashboard', label: 'Beranda', icon: LayoutDashboard, roles: ['teacher'] },
    { to: '/guru/ekstraktor', label: 'Ekstraktor PDF', shortLabel: 'Ekstraktor', icon: FileScan, roles: ['teacher'] },
    { to: '/guru/live', label: 'Studio Live', shortLabel: 'Live', icon: Video, match: ['/live'], roles: ['teacher'] },
    { to: '/guru/nilai', label: 'Buku Nilai', shortLabel: 'Nilai', icon: ClipboardList, roles: ['teacher'] },
    { to: '/guru/presensi', label: 'Presensi', icon: UserCheck, roles: ['teacher'] },
    { to: '/guru/rpp', label: 'RPP Digital', shortLabel: 'RPP', icon: NotebookPen, roles: ['teacher'] },
    { to: '/katalog', label: 'Katalog SIBI', shortLabel: 'Katalog', icon: Library, match: ['/baca'], roles: ['teacher'] },
  ],
  parent: [
    { to: '/dashboard', label: 'Beranda', icon: LayoutDashboard, roles: ['parent'] },
    { to: '/ortu/perkembangan', label: 'Perkembangan', icon: BarChart3, roles: ['parent'] },
    { to: '/ortu/laporan', label: 'Nilai & Laporan', shortLabel: 'Laporan', icon: FileText, roles: ['parent'] },
  ],
  admin: [
    { to: '/dashboard', label: 'Beranda', icon: LayoutDashboard, roles: ['admin'] },
    { to: '/admin/pengguna', label: 'Manajemen Akun', shortLabel: 'Pengguna', icon: Users, roles: ['admin'] },
    { to: '/admin/katalog', label: 'Katalog SIBI', shortLabel: 'Katalog', icon: BookOpen, roles: ['admin'] },
    { to: '/admin/kelas', label: 'Kelas & Rombel', shortLabel: 'Kelas', icon: School, roles: ['admin'] },
    { to: '/admin/analitik', label: 'Analitik Sistem', shortLabel: 'Analitik', icon: PieChart, roles: ['admin'] },
    { to: '/admin/log', label: 'Log Aktivitas', shortLabel: 'Log', icon: ScrollText, roles: ['admin'] },
  ],
};

export const sectionLabel: Record<Role, string> = {
  student: 'Ruang belajar',
  teacher: 'Ruang mengajar',
  parent: 'Pendampingan',
  admin: 'Administrasi',
};

export const getPageTitle = (pathname: string, role: Role) => {
  const nav = navByRole[role];
  const exact = nav.find((item) => item.to === pathname);
  if (exact) return exact.label;
  if (pathname.startsWith('/baca/')) return 'Pembaca Buku SIBI';
  if (pathname.startsWith('/kuis/')) return 'Arena Kuis';
  if (pathname.startsWith('/live/')) return 'Ruang Kelas Live';
  const partial = nav.find((item) => item.match?.some((prefix) => pathname.startsWith(prefix)));
  return partial?.label ?? 'SiGEMAS';
};
