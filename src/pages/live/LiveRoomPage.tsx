import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, CalendarClock, CheckCircle2, Clock, Radio, Users } from 'lucide-react';
import { api } from '../../lib/api';
import { formatDateTime, roleLabel } from '../../lib/format';
import { useAuth } from '../../context/AuthContext';
import type { Book, ClassRoom } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, PageLoader } from '../../components/ui/Misc';
import { SigemasMascot } from '../../components/SigemasMascot';
import { LiveRoom, type RoomSession } from '../../components/live/LiveRoom';

type FullSession = RoomSession & { book?: Book; class?: ClassRoom };

export function LiveRoomPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const [session, setSession] = useState<FullSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const backTo = isTeacher ? '/guru/live' : '/live';

  useEffect(() => {
    let active = true;
    setLoading(true);
    api<FullSession>(`/api/live-sessions/${id}`)
      .then((data) => {
        if (active) {
          setSession(data);
          setError('');
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Kelas live tidak ditemukan.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <PageLoader label="Menyiapkan ruang kelas…" />;

  if (error || !session) {
    return (
      <Card>
        <EmptyState
          icon={Radio}
          title="Ruang kelas tidak ditemukan"
          description={error || 'Tautan kelas mungkin sudah kedaluwarsa.'}
          action={<Button onClick={() => (window.location.href = backTo)}>Kembali ke kelas live</Button>}
        />
      </Card>
    );
  }

  if (session.status === 'live') {
    return <LiveRoom session={session} />;
  }

  if (session.status === 'scheduled') {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Link to={backTo} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition hover:text-text">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Kembali
        </Link>
        <Card className="overflow-hidden">
          <div className="relative overflow-hidden bg-[linear-gradient(125deg,#0B3B69,#12579A_60%,#1E88E5)] px-6 py-10 text-center text-white sm:px-10">
            <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
            <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-accent/20 blur-2xl" aria-hidden="true" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> Dijadwalkan
              </span>
              <h1 className="mx-auto mt-4 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-3xl">{session.title}</h1>
              <p className="mt-2 text-sm text-white/70">
                {session.className} · {session.teacherName || 'Pengajar SiGEMAS'}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {formatDateTime(session.scheduledAt)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> {session.book?.subject || 'SIBI'} · {session.chapter || session.bookTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" /> {session.class?.studentCount ?? 0} siswa
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-[1fr_200px] sm:p-6">
            <div>
              <h2 className="text-sm font-bold text-text">Ruang kelas belum dibuka</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Guru akan membuka ruang kelas pada waktu yang dijadwalkan. Halaman ini otomatis dapat dipakai saat status kelas berubah menjadi live—muat ulang halaman bila perlu.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-muted">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Siapkan buku SIBI dan catatanmu</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Uji kamera dan mikrofon sebelum masuk</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Presensi tercatat otomatis saat bergabung</li>
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-2 p-4 text-center">
              <SigemasMascot className="h-24 w-24" />
              <p className="mt-2 text-[11px] font-semibold text-text">Disiplin waktu, fokus belajar</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
                Muat ulang status
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Link to={backTo} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Kembali
      </Link>
      <Card className="overflow-hidden">
        <div className="bg-surface-2 px-6 py-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success-soft text-success">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold tracking-tight text-text">Kelas live sudah berakhir</h1>
          <p className="mx-auto mt-1 max-w-lg text-sm leading-relaxed text-muted">
            {session.title} · {session.className}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge tone="neutral">{session.bookTitle} · {session.chapter}</Badge>
            <Badge tone="neutral">{session.participants} peserta</Badge>
            <Badge tone="neutral">{roleLabel[user?.role || 'student']}</Badge>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button onClick={() => (window.location.href = backTo)}>Kembali ke daftar kelas</Button>
            <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>Buka dasbor</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
