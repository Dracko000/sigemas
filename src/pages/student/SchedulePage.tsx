import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  NotebookPen,
  Sparkles,
  Timer,
  UserRound,
} from 'lucide-react';
import { api } from '../../lib/api';
import { deadlineLabel, formatDate } from '../../lib/format';
import type { ClassRoom, LessonPlan, ScheduleItem, Task } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, PageLoader } from '../../components/ui/Misc';
import { SigemasMascot } from '../../components/SigemasMascot';

interface WeeklySlot {
  day: string;
  start: string;
  end: string;
  subject: string;
  room: string;
  teacherId?: string;
}

interface ScheduleData {
  class: ClassRoom & { schedule: WeeklySlot[] };
  schedule: ScheduleItem[];
  tasks: Task[];
  lessonPlans: LessonPlan[];
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const TODAY = new Date();

const subjectColor = (subject: string) => {
  const key = subject.toLowerCase();
  if (key.includes('matematika')) return '#1E88E5';
  if (key.includes('indonesia')) return '#FF9800';
  if (key.includes('ipa') || key.includes('alam')) return '#16A34A';
  if (key.includes('informatika')) return '#8E24AA';
  if (key.includes('sejarah')) return '#D81B60';
  if (key.includes('inggris')) return '#00ACC1';
  return '#3949AB';
};

const dayDate = (day: string) => {
  const monday = new Date(TODAY);
  const currentDay = monday.getDay() === 0 ? 7 : monday.getDay();
  monday.setDate(monday.getDate() - (currentDay - 1));
  monday.setDate(monday.getDate() + DAYS.indexOf(day));
  return monday;
};

export function SchedulePage() {
  const [data, setData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api<ScheduleData>('/api/schedule')
      .then((payload) => {
        if (active) {
          setData(payload);
          setError('');
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat jadwal.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const todayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][TODAY.getDay()];
  const grouped = useMemo(() => {
    const map: Record<string, WeeklySlot[]> = {};
    for (const day of DAYS) map[day] = [];
    for (const slot of data?.class.schedule ?? []) {
      if (map[slot.day]) map[slot.day].push(slot);
    }
    for (const day of DAYS) map[day].sort((a, b) => a.start.localeCompare(b.start));
    return map;
  }, [data]);

  const todaySlots = grouped[todayName] ?? [];
  const nextSession = data?.schedule.find((item) => item.isToday) ?? data?.schedule[0];
  const tasks = [...(data?.tasks ?? [])].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  if (loading) return <PageLoader label="Menyusun jadwal belajar…" />;

  if (error || !data) {
    return (
      <Card>
        <EmptyState
          icon={CalendarDays}
          title="Jadwal tidak dapat dimuat"
          description={error || 'Terjadi kendala saat mengambil jadwal.'}
          action={<Button onClick={() => window.location.reload()}>Muat ulang</Button>}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Jadwal Belajar</h1>
          <p className="mt-0.5 text-sm text-muted">{TODAY.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <Badge tone="primary">
          <CalendarDays className="h-3 w-3" aria-hidden="true" /> {data.class.name} · {data.class.academicYear}
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <div className="relative overflow-hidden bg-[linear-gradient(122deg,#0A335C,#12579A_58%,#1E88E5)] px-5 py-6 text-white sm:px-7">
          <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_180px] lg:items-center">
            <div>
              <Badge tone="accent" className="border-white/10 bg-accent text-[#2b1a00]">
                <Clock className="h-3 w-3" aria-hidden="true" /> {todaySlots.length ? `${todaySlots.length} kelas hari ini` : 'Hari tanpa kelas'}
              </Badge>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                {nextSession ? nextSession.subject : 'Waktu belajar mandiri'}
              </h2>
              <p className="mt-1.5 text-sm text-white/75">
                {nextSession
                  ? `${nextSession.day}, ${nextSession.start}–${nextSession.end} · ${nextSession.room} · ${nextSession.teacherName || 'Pengajar'}`
                  : 'Manfaatkan waktu untuk membaca buku SIBI atau berlatih kuis.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {nextSession && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold">
                    <Timer className="h-3.5 w-3.5" aria-hidden="true" /> {nextSession.start} · {nextSession.dateLabel}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {data.class.room}
                </span>
                <Link to="/live" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold transition hover:bg-white/20">
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /> Kelas live
                </Link>
              </div>
            </div>
            <div className="hidden justify-center lg:flex">
              <SigemasMascot className="h-36 w-36 drop-shadow-2xl" wave />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-text">Jadwal mingguan</h2>
              <p className="text-[10px] text-muted">Kelas tatap muka dan laboratorium</p>
            </div>
            <Badge tone="neutral">{data.class.schedule.length} sesi</Badge>
          </div>
          <div className="overflow-x-auto p-4">
            <div className="grid min-w-[860px] grid-cols-6 gap-2">
              {DAYS.map((day) => {
                const date = dayDate(day);
                const isToday = day === todayName;
                return (
                  <div key={day} className={isToday ? 'rounded-xl bg-primary-soft/50 p-1.5 ring-1 ring-primary/20' : 'p-1.5'}>
                    <div className="mb-2 text-center">
                      <p className={isToday ? 'text-[10px] font-extrabold uppercase tracking-wider text-primary-strong dark:text-primary' : 'text-[10px] font-bold uppercase tracking-wider text-muted'}>{day}</p>
                      <p className="text-lg font-extrabold tabular-nums text-text">{date.getDate()}</p>
                      {isToday && <span className="text-[8px] font-bold uppercase text-primary">Hari ini</span>}
                    </div>
                    <div className="space-y-2">
                      {(grouped[day] ?? []).map((slot) => (
                        <div
                          key={`${day}-${slot.start}-${slot.subject}`}
                          className="rounded-lg border border-border bg-surface p-2 shadow-sm"
                          style={{ borderLeftColor: subjectColor(slot.subject), borderLeftWidth: 3 }}
                        >
                          <p className="truncate text-[10px] font-bold text-text">{slot.subject}</p>
                          <p className="mt-0.5 text-[9px] tabular-nums text-muted">{slot.start}–{slot.end}</p>
                          <p className="mt-0.5 truncate text-[8px] text-muted">{slot.room}</p>
                        </div>
                      ))}
                      {(grouped[day] ?? []).length === 0 && (
                        <p className="rounded-lg border border-dashed border-border py-3 text-center text-[8px] text-muted">Kosong</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-accent-strong" aria-hidden="true" />
                <h3 className="text-sm font-bold text-text">Tenggat terdekat</h3>
              </div>
              <Badge tone="warning">{tasks.length}</Badge>
            </div>
            <div className="divide-y divide-border">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-surface-2 text-muted">
                      <BookOpen className="h-3 w-3" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-text">{task.title}</p>
                      <p className="mt-0.5 text-[9px] text-muted">{task.subject} · {task.type}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-accent-strong dark:text-accent">
                        <Clock className="h-2.5 w-2.5" aria-hidden="true" /> {deadlineLabel(task.dueAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p className="px-4 py-6 text-center text-[11px] text-muted">Tidak ada tenggat aktif.</p>}
            </div>
            <div className="border-t border-border p-3">
              <Link to="/dashboard" className="inline-flex w-full items-center justify-center gap-1 text-[10px] font-bold text-primary hover:underline">
                Lihat semua tugas <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-success-soft text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-text">Agenda hari ini</h3>
                <p className="text-[10px] text-muted">{todaySlots.length} sesi terjadwal</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {todaySlots.map((slot) => (
                <div key={`${slot.start}-${slot.subject}`} className="flex items-center gap-2 rounded-lg bg-surface-2 px-2.5 py-2">
                  <span className="text-[9px] font-bold tabular-nums text-primary">{slot.start}</span>
                  <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-text">{slot.subject}</span>
                  <span className="text-[8px] text-muted">{slot.room}</span>
                </div>
              ))}
              {todaySlots.length === 0 && <p className="rounded-lg bg-surface-2 px-3 py-3 text-center text-[10px] text-muted">Tidak ada kelas hari ini.</p>}
            </div>
          </Card>

          <Card className="border-primary/20 bg-primary-soft/30 p-4">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
              <p className="text-xs font-bold text-text">Wali kelas</p>
            </div>
            <p className="mt-1 text-sm font-semibold text-text">{data.class.homeroomName || '—'}</p>
            <p className="text-[10px] text-muted">{data.class.name} · {data.class.room}</p>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-muted">
              <Sparkles className="h-3 w-3" aria-hidden="true" /> {data.lessonPlans.length} rencana pembelajaran tercatat
            </div>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-bold text-text">Agenda berikutnya</h2>
          <p className="text-[10px] text-muted">Urutan kelas berdasarkan tanggal terdekat</p>
        </div>
        <div className="divide-y divide-border">
          {data.schedule.slice(0, 6).map((item) => (
            <div key={`${item.date}-${item.start}`} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-center">
                <span className="text-[8px] font-bold uppercase text-muted">{item.day.slice(0, 3)}</span>
                <span className="text-sm font-extrabold leading-none text-text">{new Date(item.date).getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-text">{item.subject}</p>
                <p className="text-[10px] text-muted">{item.start}–{item.end} · {item.room} · {item.teacherName}</p>
              </div>
              <span className="text-[10px] font-semibold text-muted">{formatDate(item.date, { day: 'numeric', month: 'short' })}</span>
              {item.isToday && <Badge tone="accent">Hari ini</Badge>}
            </div>
          ))}
          {data.schedule.length === 0 && <EmptyState icon={CalendarDays} title="Belum ada agenda" />}
        </div>
      </Card>
    </div>
  );
}
