import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Command,
  Flame,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cx, roleLabel } from '../../lib/format';
import { getPageTitle, navByRole, sectionLabel, type NavItem } from '../../lib/nav';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ThemeToggle } from '../ThemeToggle';
import { NotificationsMenu } from '../NotificationsMenu';
import { SearchDialog } from '../SearchDialog';
import { SigemasMascot } from '../SigemasMascot';
import { Logo } from '../Logo';

const asideByRole = {
  student: {
    title: 'Butuh teman belajar?',
    text: 'Buka perpustakaan digital dan lanjutkan bab yang tertunda.',
    cta: 'Buka perpustakaan',
    to: '/katalog',
  },
  teacher: {
    title: 'Siap memulai kelas?',
    text: 'Masuk ke studio live untuk whiteboard, polling, dan presensi otomatis.',
    cta: 'Buka studio live',
    to: '/guru/live',
  },
  parent: {
    title: 'Pantau perkembangan anak',
    text: 'Lihat ringkasan nilai, kehadiran, dan catatan guru dalam satu laporan.',
    cta: 'Lihat laporan',
    to: '/ortu/laporan',
  },
  admin: {
    title: 'Katalog SIBI terkini',
    text: 'Sinkronkan perbukuan dan kelola akses seluruh pengguna.',
    cta: 'Kelola katalog',
    to: '/admin/katalog',
  },
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  if (!user) return null;
  const items = navByRole[user.role];
  const aside = asideByRole[user.role];
  const isActive = (item: NavItem) =>
    location.pathname === item.to ||
    item.match?.some((prefix) => location.pathname.startsWith(prefix));

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#0C3C6E_0%,#082A52_52%,#061E3A_100%)] text-white">
      <div className="flex items-center justify-between px-5 pb-5 pt-6">
        <Link to="/dashboard" onClick={onNavigate} aria-label="SiGEMAS — Beranda">
          <Logo light />
        </Link>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mx-4 mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-[#2b1a00]">
          <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold">{roleLabel[user.role]}</p>
          <p className="truncate text-[10px] text-blue-100/60">
            {user.role === 'student' || user.role === 'teacher'
              ? user.title?.split(' · ').pop()
              : 'Akun terverifikasi'}
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3 no-scrollbar" aria-label="Navigasi utama">
        <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-blue-100/45">
          {sectionLabel[user.role]}
        </p>
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  className={cx(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition',
                    active
                      ? 'bg-white/[0.13] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                      : 'text-blue-100/70 hover:bg-white/[0.07] hover:text-white'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent" aria-hidden="true" />
                  )}
                  <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {user.role === 'student' && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 px-3 py-2.5">
            <Flame className="h-4 w-4 text-accent" aria-hidden="true" />
            <div>
              <p className="text-[11px] font-bold text-white">12 hari beruntun</p>
              <p className="text-[9px] text-blue-100/60">Ritme belajar aktif</p>
            </div>
          </div>
        )}
      </nav>

      <div className="mx-3 mb-3 hidden rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 xl:block">
        <div className="flex items-start gap-2">
          <SigemasMascot size={54} decorative className="shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">{aside.title}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-blue-100/60">{aside.text}</p>
          </div>
        </div>
        <Link
          to={aside.to}
          onClick={onNavigate}
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-[11px] font-bold text-[#2b1a00] transition hover:brightness-105"
        >
          {aside.cta}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2.5 rounded-xl px-1.5 py-1.5">
          <Avatar name={user.name} size="sm" status="online" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">{user.name}</p>
            <p className="truncate text-[9px] text-blue-100/55">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg p-2 text-blue-100/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Keluar dari akun"
            title="Keluar"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-transparent p-1 pr-2 transition hover:border-border hover:bg-surface"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu profil"
      >
        <Avatar name={user.name} size="sm" status="online" />
        <span className="hidden text-left xl:block">
          <span className="block max-w-[120px] truncate text-xs font-bold text-text">{user.name}</span>
          <span className="block text-[10px] text-muted">{roleLabel[user.role]}</span>
        </span>
        <ChevronDown className="hidden h-3.5 w-3.5 text-muted xl:block" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="animate-pop absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-pop"
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="truncate text-sm font-bold text-text">{user.name}</p>
            <p className="truncate text-[11px] text-muted">{user.email}</p>
            <Badge tone="primary" className="mt-2">
              {roleLabel[user.role]}
            </Badge>
          </div>
          <button
            type="button"
            onClick={() => {
              toggle();
              setOpen(false);
            }}
            className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-text transition hover:bg-surface-2"
            role="menuitem"
          >
            <Sparkles className="h-4 w-4 text-muted" aria-hidden="true" />
            Mode {theme === 'dark' ? 'terang' : 'gelap'}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate('/dashboard');
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-text transition hover:bg-surface-2"
            role="menuitem"
          >
            <Command className="h-4 w-4 text-muted" aria-hidden="true" />
            Beranda peran saya
          </button>
          <button
            type="button"
            onClick={logout}
            className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-danger transition hover:bg-danger-soft"
            role="menuitem"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}

export function AppShell() {
  const { user } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const timer = window.setTimeout(() => mainRef.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (!user) return;
    const title = getPageTitle(location.pathname, user.role);
    document.title = `${title} · SiGEMAS`;
  }, [location.pathname, user]);

  if (!user) return null;

  const items = navByRole[user.role];
  const title = getPageTitle(location.pathname, user.role);
  const bottomItems = items.slice(0, 4);

  return (
    <div className="min-h-dvh bg-bg">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Lewati ke konten utama
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] lg:block">
        <SidebarContent />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-[#04101f]/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="animate-slide-in absolute inset-y-0 left-0 w-[300px] max-w-[85vw] shadow-pop" role="dialog" aria-modal="true" aria-label="Menu navigasi">
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-xl">
          <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-muted transition hover:bg-surface-2 lg:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:block">
                SiGEMAS · {roleLabel[user.role]}
              </p>
              <h1 className="truncate text-base font-extrabold tracking-tight text-text sm:text-lg">{title}</h1>
            </div>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2.5 text-xs text-muted transition hover:border-primary/35 hover:bg-surface-2 md:flex"
              aria-label="Cari di SiGEMAS"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="w-36 text-left lg:w-44">Cari buku, kelas, tugas…</span>
              <span className="ml-1 inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-[9px] font-bold">
                <Command className="h-2.5 w-2.5" aria-hidden="true" />K
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-muted transition hover:bg-surface-2 md:hidden"
              aria-label="Cari"
            >
              <Search className="h-4.5 w-4.5" aria-hidden="true" />
            </button>

            <NotificationsMenu />
            <ThemeToggle className="hidden sm:grid" />
            <ProfileMenu />
          </div>
        </header>

        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          className="focus-main mx-auto w-full max-w-[1500px] px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10"
        >
          <div key={location.pathname} className="animate-fade-up">
            <Outlet />
          </div>
          <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-5 text-[10px] text-muted sm:flex-row">
            <p>© 2026 SiGEMAS · Sistem Gramatur, Edukasi & Manajemen Aktif SIBI</p>
            <p className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              Terintegrasi katalog SIBI Kemendikdasmen
            </p>
          </footer>
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
        aria-label="Navigasi cepat"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.to ||
              item.match?.some((prefix) => location.pathname.startsWith(prefix));
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={cx(
                    'relative flex min-h-[58px] flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold transition',
                    active ? 'text-primary-strong dark:text-primary' : 'text-muted'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.shortLabel || item.label}
                </NavLink>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex min-h-[58px] w-full flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold text-muted"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              Menu
            </button>
          </li>
        </ul>
      </nav>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
