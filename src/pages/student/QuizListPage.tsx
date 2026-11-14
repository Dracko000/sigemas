import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Crown,
  HelpCircle,
  Play,
  RefreshCw,
  Sparkles,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import { api } from '../../lib/api';
import { clamp } from '../../lib/format';
import type { QuizSummary } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import { EmptyState, PageLoader, SectionHeader, StatCard } from '../../components/ui/Misc';
import { Tabs } from '../../components/ui/Tabs';
import { SigemasMascot } from '../../components/SigemasMascot';

const difficultyTone = (difficulty: string) => {
  const key = difficulty.toLowerCase();
  if (key.includes('mudah')) return 'success' as const;
  if (key.includes('sulit')) return 'danger' as const;
  return 'warning' as const;
};

export function QuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let active = true;
    api<QuizSummary[]>('/api/quizzes')
      .then((data) => {
        if (active) {
          setQuizzes(data);
          setError('');
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat daftar kuis.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const attempted = quizzes.filter((quiz) => quiz.attempts > 0);
  const bestAverage = attempted.length
    ? Math.round(attempted.reduce((sum, quiz) => sum + quiz.bestScore, 0) / attempted.length)
    : 0;
  const filtered = useMemo(() => {
    if (filter === 'done') return quizzes.filter((quiz) => quiz.attempts > 0);
    if (filter === 'new') return quizzes.filter((quiz) => quiz.attempts === 0);
    return quizzes;
  }, [quizzes, filter]);

  if (loading) return <PageLoader label="Memuat kuis…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Kuis Interaktif</h1>
          <p className="mt-0.5 text-sm text-muted">Uji pemahaman bab SIBI dengan umpan balik langsung.</p>
        </div>
        <Badge tone="primary">
          <BrainCircuit className="h-3 w-3" aria-hidden="true" /> {quizzes.length} kuis tersedia
        </Badge>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>
      )}

      <Card className="overflow-hidden">
        <div className="relative overflow-hidden bg-[linear-gradient(120deg,#0A335C,#12579A_55%,#1E88E5)] px-5 py-6 text-white sm:px-7">
          <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_170px] lg:items-center">
            <div>
              <Badge tone="accent" className="border-white/10 bg-accent text-[#2b1a00]">
                <Sparkles className="h-3 w-3" aria-hidden="true" /> Latihan harian
              </Badge>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Seberapa siap kamu hari ini?</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                Setiap kuis mengambil soal langsung dari bab SIBI yang dipelajari di kelas. Jawab dengan teliti dan tinjau pembahasan setelah selesai.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><Trophy className="h-3.5 w-3.5" aria-hidden="true" /> Peringkat kelas</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><Target className="h-3.5 w-3.5" aria-hidden="true" /> Umpan balik instan</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Bisa diulang</span>
              </div>
            </div>
            <div className="hidden justify-center lg:flex">
              <SigemasMascot className="h-36 w-36 drop-shadow-2xl" wave />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Kuis dikerjakan" value={`${attempted.length}/${quizzes.length}`} icon={CheckCircle2} tone="success" hint="Kuis dengan percobaan" />
        <StatCard label="Rata-rata terbaik" value={bestAverage} icon={Target} tone="primary" hint="Dari skor tertinggi per kuis" />
        <StatCard
          label="Total soal"
          value={quizzes.reduce((sum, quiz) => sum + quiz.questionCount, 0)}
          icon={HelpCircle}
          tone="accent"
          hint="Soal siap dikerjakan"
        />
      </div>

      <section>
        <SectionHeader
          title="Daftar kuis"
          subtitle="Pilih kuis yang ingin dikerjakan atau ulangi untuk memperbaiki skor."
          action={
            <Tabs
              items={[
                { id: 'all', label: 'Semua', count: quizzes.length },
                { id: 'new', label: 'Baru', count: quizzes.filter((quiz) => quiz.attempts === 0).length },
                { id: 'done', label: 'Selesai', count: attempted.length },
              ]}
              value={filter}
              onChange={setFilter}
            />
          }
        />

        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={BrainCircuit}
              title={filter === 'done' ? 'Belum ada kuis yang selesai' : 'Tidak ada kuis baru'}
              description={filter === 'done' ? 'Kerjakan kuis pertamamu untuk melihat hasil di sini.' : 'Semua kuis sudah kamu coba. Ulangi kuis lama untuk meningkatkan skor.'}
              action={<Button variant="outline" onClick={() => setFilter('all')}>Lihat semua kuis</Button>}
            />
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((quiz) => {
              const done = quiz.attempts > 0;
              return (
                <Card key={quiz.id} className="flex flex-col overflow-hidden">
                  <div className="flex items-start justify-between gap-3 border-b border-border p-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-strong dark:text-primary">
                        <BrainCircuit className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge tone={difficultyTone(quiz.difficulty)} className="px-2 py-0.5 text-[9px]">{quiz.difficulty}</Badge>
                          <Badge tone="neutral" className="px-2 py-0.5 text-[9px]">{quiz.subject}</Badge>
                        </div>
                        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-text">{quiz.title}</h3>
                        <p className="mt-0.5 truncate text-[10px] text-muted">{quiz.teacherName} · {quiz.classId}</p>
                      </div>
                    </div>
                    {done && <Badge tone="success" dot className="shrink-0">{quiz.bestScore}</Badge>}
                  </div>

                  <div className="flex flex-wrap gap-4 px-4 py-3 text-[10px] font-semibold text-muted">
                    <span className="inline-flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" aria-hidden="true" /> {quiz.questionCount} soal</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {quiz.durationMin} menit</span>
                    {done && <span className="inline-flex items-center gap-1"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> {quiz.attempts}× dikerjakan</span>}
                  </div>

                  <div className="px-4">
                    <Progress value={quiz.bestScore} tone={quiz.bestScore >= 75 ? 'success' : 'primary'} size="sm" showValue label={done ? 'Skor terbaik' : 'Belum dikerjakan'} />
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 px-4 py-3">
                    <div className="flex items-center gap-1">
                      {quiz.leaderboard.slice(0, 3).map((entry, index) => (
                        <span
                          key={entry.studentId}
                          className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-1.5 py-0.5 text-[9px] font-semibold text-muted"
                          title={`${entry.name} · ${entry.score}`}
                        >
                          {index === 0 ? <Crown className="h-2.5 w-2.5 text-accent-strong" aria-hidden="true" /> : <span className="text-[8px] font-bold">{index + 1}</span>}
                          {entry.name.split(' ')[0]}
                        </span>
                      ))}
                      {quiz.leaderboard.length === 0 && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-muted"><Users className="h-3 w-3" aria-hidden="true" /> Belum ada peringkat</span>
                      )}
                    </div>
                    <Link to={`/kuis/${quiz.id}`}>
                      <Button size="sm" variant={done ? 'outline' : 'primary'}>
                        {done ? <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                        {done ? 'Ulangi' : 'Mulai'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Card className="flex flex-wrap items-center gap-3 border-accent/25 bg-accent-soft/40 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-accent-strong shadow-sm">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-text">Strategi mengerjakan kuis</p>
          <p className="text-[11px] leading-relaxed text-muted">
            Baca pertanyaan sampai selesai, tandai yang ragu, lalu tinjau pembahasan. Skor terbaik dihitung terpisah dari {clamp(bestAverage)}% capaian saat ini.
          </p>
        </div>
        <Link to="/nilai" className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
          Lihat nilai <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </Card>
    </div>
  );
}
