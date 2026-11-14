import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  Hand,
  MonitorPlay,
  PenLine,
  PlayCircle,
  Radio,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { api } from '../../lib/api';
import { formatDateShort, formatDateTime, formatTime, relativeDate } from '../../lib/format';
import type { LiveSession } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, PageLoader, SectionHeader } from '../../components/ui/Misc';
import { SigemasMascot } from '../../components/SigemasMascot';

export function StudentLivePage() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api<LiveSession[]>('/api/live-sessions')
      .then((data) => {
        if (active) {
          setSessions(data);
          setError('');
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat kelas live.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const live = sessions.find((session) => session.status === 'live');
  const scheduled = useMemo(
    () =>
      sessions
        .filter((session) => session.status === 'scheduled')
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [sessions]
  );
  const ended = sessions.filter((session) => session.status === 'ended');
  const nextSession = scheduled[0];
  const totalMinutes = ended.reduce((sum, session) => sum + (session.durationMin || 0), 0);
  const attended = ended.filter((session) => (session.participants || 0) > 0).length;

  if (loading) return <PageLoader label="Memuat kelas live…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Kelas Live</h1>
          <p className="mt-0.5 text-sm text-muted">Belajar langsung bersama guru dan teman sekelas.</p>
        </div>
        <Badge tone={live ? 'success' : 'neutral'} dot={Boolean(live)}>
          {live ? 'Ada kelas berlangsung' : 'Tidak ada kelas aktif'}
        </Badge>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>
      )}

      {live ? (
        <Card className="overflow-hidden">
          <div className="relative overflow-hidden bg-[linear-gradient(122deg,#0A335C,#12579A_58%,#1E88E5)] px-5 py-6 text-white sm:px-7 sm:py-8">
            <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_180px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" /> Sedang live
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-white/70">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" /> {live.participants} peserta
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-white/70">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" /> mulai {formatTime(live.startedAt)}
                  </span>
                </div>
                <h2 className="mt-3 max-w-2xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{live.title}</h2>
                <p className="mt-2 text-sm text-white/75">
                  {live.className} · {live.teacherName || 'Pengajar SiGEMAS'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 backdrop-blur">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> {live.bookTitle}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 backdrop-blur">
                    <PenLine className="h-3.5 w-3.5" aria-hidden="true" /> {live.chapter}
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link to={`/live/${live.id}`}>
                    <Button variant="accent" size="lg">
                      <Video className="h-4 w-4" aria-hidden="true" /> Masuk kelas sekarang
                    </Button>
                  </Link>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[11px] text-white/80 backdrop-blur">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Presensi otomatis
                  </span>
                </div>
              </div>
              <div className="hidden items-center justify-center lg:flex">
                <SigemasMascot className="h-36 w-36 drop-shadow-2xl" />
              </div>
            </div>
          </div>
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { icon: PenLine, title: 'Papan tulis pribadi', text: 'Coret materi untuk catatanmu sendiri' },
              { icon: BarChart3, title: 'Polling langsung', text: 'Jawab kuis tanpa tekan' },
              { icon: Hand, title: 'Angkat tangan', text: 'Bertanya tanpa memotong' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary-strong dark:text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-text">{feature.title}</p>
                    <p className="text-[10px] text-muted">{feature.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="grid gap-5 p-5 sm:grid-cols-[1fr_160px] sm:p-7">
            <div>
              <Badge tone="primary">
                <CalendarClock className="h-3 w-3" aria-hidden="true" /> Kelas berikutnya
              </Badge>
              {nextSession ? (
                <>
                  <h2 className="mt-3 text-xl font-extrabold tracking-tight text-text sm:text-2xl">{nextSession.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {formatDateTime(nextSession.scheduledAt)} · {nextSession.className} · {nextSession.teacherName}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {relativeDate(nextSession.scheduledAt)}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link to={`/live/${nextSession.id}`}>
                      <Button variant="outline">
                        <MonitorPlay className="h-4 w-4" aria-hidden="true" /> Lihat ruang tunggu
                      </Button>
                    </Link>
                    <Link to="/katalog">
                      <Button variant="ghost">
                        <BookOpen className="h-4 w-4" aria-hidden="true" /> Baca persiapan
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mt-3 text-xl font-extrabold tracking-tight text-text">Belum ada kelas terjadwal</h2>
                  <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted">
                    Gunakan waktu luang untuk melanjutkan membaca buku SIBI atau mengerjakan kuis. Kelas baru akan muncul di sini.
                  </p>
                  <Link to="/katalog" className="mt-4 inline-block">
                    <Button>
                      <BookOpen className="h-4 w-4" aria-hidden="true" /> Buka perpustakaan
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-[linear-gradient(140deg,var(--primary-soft),var(--surface-2))] p-4">
              <SigemasMascot className="h-28 w-28" wave />
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            <p className="text-[11px] font-semibold">Kelas mendatang</p>
          </div>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-text">{scheduled.length}</p>
          <p className="text-[10px] text-muted">Terjadwal di kelasmu</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <p className="text-[11px] font-semibold">Total durasi live</p>
          </div>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-text">{totalMinutes}<span className="ml-1 text-sm font-bold text-muted">mnt</span></p>
          <p className="text-[10px] text-muted">Dari {ended.length} sesi selesai</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <p className="text-[11px] font-semibold">Sesi diikuti</p>
          </div>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-text">{attended}</p>
          <p className="text-[10px] text-muted">Presensi tercatat otomatis</p>
        </Card>
      </div>

      <section>
        <SectionHeader
          title="Jadwal kelas mendatang"
          subtitle="Tandai kalender dan siapkan materi sebelumnya."
          action={<Badge tone="primary">{scheduled.length} sesi</Badge>}
        />
        {scheduled.length === 0 ? (
          <Card>
            <EmptyState
              icon={CalendarClock}
              title="Tidak ada kelas mendatang"
              description="Guru belum menjadwalkan sesi live baru untuk kelasmu."
              action={<Link to="/jadwal"><Button variant="outline" size="sm">Lihat jadwal pelajaran</Button></Link>}
            />
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {scheduled.map((session) => (
              <Card key={session.id} interactive className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-14 shrink-0 rounded-xl border border-border bg-surface-2 py-2 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted">{formatDateShort(session.scheduledAt).split(' ')[1]}</p>
                    <p className="text-xl font-extrabold text-text">{new Date(session.scheduledAt).getDate()}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Badge tone="primary" className="px-2 py-0.5 text-[9px]">Terjadwal</Badge>
                      <span className="text-[10px] text-muted">{formatTime(session.scheduledAt)}</span>
                    </div>
                    <h3 className="mt-1 truncate text-sm font-bold text-text">{session.title}</h3>
                    <p className="mt-0.5 truncate text-[11px] text-muted">{session.className} · {session.teacherName}</p>
                    <p className="mt-1.5 flex items-center gap-1 truncate text-[10px] text-muted">
                      <BookOpen className="h-3 w-3 shrink-0" aria-hidden="true" /> {session.bookTitle} · {session.chapter}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent-strong dark:text-accent">
                    <Clock className="h-3 w-3" aria-hidden="true" /> {relativeDate(session.scheduledAt)}
                  </span>
                  <Link to={`/live/${session.id}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
                    Detail <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Sesi yang sudah selesai" subtitle="Buka ringkasan untuk melihat materi dan kehadiran." />
        {ended.length === 0 ? (
          <Card className="p-6 text-center">
            <Radio className="mx-auto h-7 w-7 text-muted/60" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-text">Belum ada riwayat kelas live</p>
            <p className="mt-0.5 text-xs text-muted">Sesi yang telah selesai akan muncul di sini.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {ended.map((session) => (
              <Card key={session.id} className="flex flex-wrap items-center gap-3 p-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted">
                  <PlayCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-text">{session.title}</p>
                  <p className="truncate text-[10px] text-muted">
                    {formatDateShort(session.endedAt || session.scheduledAt)} · {session.className} · {session.participants} peserta
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {session.recording && <Badge tone="info">Rekaman</Badge>}
                  <Link to={`/live/${session.id}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
                    Ringkasan <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Card className="flex flex-wrap items-center gap-3 border-primary/20 bg-primary-soft/40 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-primary shadow-sm">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-text">Tips kelas live</p>
          <p className="text-[11px] leading-relaxed text-muted">Gunakan headset agar suara jelas, aktifkan kamera saat diminta, dan manfaatkan tombol angkat tangan agar guru bisa mengatur giliran bertanya.</p>
        </div>
      </Card>
    </div>
  );
}
