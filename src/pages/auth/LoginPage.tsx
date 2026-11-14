import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Presentation,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Logo, LogoMark } from '../../components/Logo';
import { SigemasMascot } from '../../components/SigemasMascot';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ThemeToggle';
import { cx } from '../../lib/format';
import type { Role } from '../../types';

const demoRoles: {
  role: Role;
  email: string;
  name: string;
  label: string;
  icon: typeof GraduationCap;
  tone: string;
}[] = [
  {
    role: 'student',
    email: 'siswa@sigemas.id',
    name: 'Aisyah Putri',
    label: 'Siswa',
    icon: GraduationCap,
    tone: 'bg-primary-soft text-primary-strong dark:text-primary',
  },
  {
    role: 'teacher',
    email: 'guru@sigemas.id',
    name: 'Raka Pradana',
    label: 'Pengajar',
    icon: Presentation,
    tone: 'bg-accent-soft text-accent-strong dark:text-accent',
  },
  {
    role: 'parent',
    email: 'ortu@sigemas.id',
    name: 'Sari Wulandari',
    label: 'Orang Tua',
    icon: Users,
    tone: 'bg-success-soft text-success',
  },
  {
    role: 'admin',
    email: 'admin@sigemas.id',
    name: 'Admin SIBI',
    label: 'Administrator',
    icon: ShieldCheck,
    tone: 'bg-info-soft text-info',
  },
];

export function LoginPage() {
  const { user, login, demoLogin } = useAuth();
  const { theme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('siswa@sigemas.id');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<Role | null>(null);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const account = await login(email, password);
      toast.success(`Selamat datang, ${account.name.split(' ')[0]}!`, 'Ruang belajar SiGEMAS siap digunakan.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: Role) => {
    setError('');
    setDemoLoading(role);
    try {
      const account = await demoLogin(role);
      toast.success(`Masuk sebagai ${demoRoles.find((r) => r.role === role)?.label}`, account.name);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk sebagai akun demo.');
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-dvh bg-bg lg:grid lg:grid-cols-[1.05fr_1fr]">
      <section className="gradient-brand relative hidden overflow-hidden px-12 py-10 text-white lg:flex lg:flex-col xl:px-16">
        <div className="pattern-dots pointer-events-none absolute inset-0 text-white/20 opacity-40" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#64B5F6]/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 flex items-center justify-between">
          <Logo light />
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-blue-50/90">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" aria-hidden="true" />
            Terintegrasi SIBI · Kemendikdasmen
          </span>
        </div>

        <div className="relative z-10 grid flex-1 grid-cols-1 items-center gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-blue-50">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Sistem Gramatur, Edukasi & Manajemen Aktif
            </span>
            <h1 className="mt-6 text-[40px] font-extrabold leading-[1.08] tracking-tight xl:text-[52px]">
              Buku, kelas, dan
              <span className="relative mx-2 inline-block text-accent">
                kemajuan
                <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 6c40-4 80-4 120-2 26 1 50-1 76-3" stroke="#FFB300" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
                </svg>
              </span>
              belajar dalam satu ruang.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-blue-100/75 xl:text-base">
              SiGEMAS menghubungkan perbukuan digital SIBI dengan kelas live,
              kuis interaktif, serta manajemen kelas terpadu untuk siswa, guru,
              orang tua, dan pengelola sekolah.
            </p>

            <ul className="mt-7 space-y-2.5">
              {[
                'Pembaca buku SIBI dengan pencarian, catatan, dan mode malam',
                'Kelas live: video guru, papan tulis pribadi, polling, dan presensi otomatis',
                'Buku nilai, RPP digital, dan laporan orang tua yang terhubung',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs text-blue-50/85 xl:text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[320px] xl:block">
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.04]" aria-hidden="true" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" aria-hidden="true" />
            <SigemasMascot size={285} wave className="relative z-10 mx-auto drop-shadow-2xl" />
            <div className="absolute -left-2 top-8 z-20 animate-floaty rounded-2xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
              <p className="flex items-center gap-1.5 text-[10px] font-bold">
                <Radio className="h-3 w-3 text-accent" aria-hidden="true" /> Kelas live
              </p>
              <p className="mt-0.5 text-[9px] text-blue-100/70">27 siswa bergabung</p>
            </div>
            <div className="absolute -right-1 bottom-12 z-20 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md [animation-delay:1.2s] animate-floaty">
              <p className="flex items-center gap-1.5 text-[10px] font-bold">
                <BookOpen className="h-3 w-3 text-accent" aria-hidden="true" /> Progres bab
              </p>
              <div className="mt-1.5 h-1.5 w-24 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[68%] rounded-full bg-accent" />
              </div>
              <p className="mt-1 text-[9px] text-blue-100/70">Fungsi Kuadrat · 68%</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.05] py-3.5">
          {[
            { value: '6', label: 'Buku SIBI tersinkron' },
            { value: '4', label: 'Peran terintegrasi' },
            { value: 'Realtime', label: 'Kelas & presensi' },
          ].map((stat) => (
            <div key={stat.label} className="px-4 text-center">
              <p className="text-lg font-extrabold">{stat.value}</p>
              <p className="mt-0.5 text-[9px] text-blue-100/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative flex min-h-dvh flex-col px-5 py-6 sm:px-10 lg:px-14 xl:px-20">
        <div className="absolute right-5 top-5 z-10 sm:right-8 sm:top-8">
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-between lg:hidden">
          <Logo />
          <span className="mr-12 rounded-full bg-primary-soft px-2.5 py-1 text-[9px] font-bold text-primary-strong dark:text-primary">
            SIBI
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <div className="mb-7">
            <div className="mb-4 flex items-center gap-3 lg:hidden">
              <SigemasMascot size={62} decorative />
              <div className="rounded-2xl rounded-bl-sm bg-accent-soft px-3 py-2 text-[11px] font-semibold text-accent-strong dark:text-accent">
                Halo! Siap belajar hari ini?
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-strong dark:text-primary">
              Masuk ke akun
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text sm:text-[34px]">
              Selamat datang kembali
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Gunakan akun SiGEMAS atau pilih salah satu peran demo untuk menjelajahi aplikasi.
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-4 rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-3 text-xs font-medium text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-text">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@sigemas.id"
                  required
                  className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-3.5 text-sm text-text outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/12"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-semibold text-text">
                  Kata sandi
                </label>
                <button
                  type="button"
                  onClick={() => toast.info('Reset kata sandi', 'Hubungi administrator sekolah atau gunakan akun demo dengan sandi demo1234.')}
                  className="text-[11px] font-semibold text-primary-strong hover:underline dark:text-primary"
                >
                  Lupa sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-11 text-sm text-text outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted transition hover:text-text"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-border text-primary accent-[var(--primary)]"
              />
              Ingat sesi saya di perangkat ini
            </label>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              {loading ? 'Memeriksa akun…' : 'Masuk ke SiGEMAS'}
              {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">atau masuk cepat sebagai</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {demoRoles.map((item) => {
              const Icon = item.icon;
              const busy = demoLoading === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleDemo(item.role)}
                  disabled={Boolean(demoLoading) || loading}
                  className={cx(
                    'group flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-3 text-left transition',
                    'hover:border-primary/35 hover:bg-primary-soft/25 disabled:cursor-wait disabled:opacity-60'
                  )}
                >
                  <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-xl', item.tone)}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Icon className="h-4.5 w-4.5" aria-hidden="true" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold text-text">{item.label}</span>
                    <span className="block truncate text-[10px] text-muted">{item.name}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-surface-2/60 px-3 py-2.5">
            <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
            <p className="text-[10px] leading-relaxed text-muted">
              Akun demo: <span className="font-semibold text-text">siswa@sigemas.id</span> · sandi{' '}
              <span className="font-mono font-semibold text-text">demo1234</span>. Data bersifat simulasi.
            </p>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Sesi terenkripsi. Dengan masuk, Anda menyetujui panduan penggunaan SiGEMAS.
          </p>
        </div>

        <div className="mx-auto mt-auto flex w-full max-w-md items-center justify-center gap-2 text-[10px] text-muted">
          <LogoMark size={18} />
          Dikembangkan untuk ekosistem perbukuan digital Indonesia
        </div>
      </section>
    </div>
  );
}
