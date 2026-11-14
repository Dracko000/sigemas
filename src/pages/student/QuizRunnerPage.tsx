import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Flag,
  HelpCircle,
  Loader2,
  RotateCcw,
  Send,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import type { LeaderboardEntry, QuizDetail } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { EmptyState, PageLoader } from '../../components/ui/Misc';
import { Progress, ProgressRing } from '../../components/ui/Progress';
import { SigemasMascot } from '../../components/SigemasMascot';

interface ReviewItem {
  question: string;
  options: string[];
  answer: number;
  chosen: number | null;
  correct: boolean;
  explanation?: string;
}

interface QuizResult {
  score: number;
  correct: number;
  total: number;
  review: ReviewItem[];
  leaderboard: LeaderboardEntry[];
}

const clock = (seconds: number) => {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export function QuizRunnerPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    let active = true;
    api<QuizDetail>(`/api/quizzes/${id}`)
      .then((data) => {
        if (active) {
          setQuiz(data);
          setAnswers(new Array(data.questions.length).fill(null));
          setTimeLeft(data.durationMin * 60);
          setError('');
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Kuis tidak ditemukan.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const submit = useCallback(
    async (auto = false) => {
      if (!quiz || submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);
      setConfirmOpen(false);
      try {
        const data = await api<QuizResult>(`/api/quizzes/${quiz.id}/submit`, {
          method: 'POST',
          body: { answers },
        });
        setResult(data);
        setFinished(true);
        setStarted(false);
        if (auto) toast.info('Waktu habis', 'Jawabanmu otomatis dikumpulkan.');
        else toast.success('Kuis selesai', `Skor kamu ${data.score}. Tinjau pembahasannya.`);
      } catch (err) {
        submittedRef.current = false;
        toast.error('Gagal mengumpulkan jawaban', err instanceof Error ? err.message : undefined);
      } finally {
        setSubmitting(false);
      }
    },
    [answers, quiz, toast]
  );

  useEffect(() => {
    if (!started || finished) return;
    const interval = window.setInterval(() => {
      setTimeLeft((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [started, finished]);

  useEffect(() => {
    if (started && !finished && timeLeft === 0) {
      void submit(true);
    }
  }, [timeLeft, started, finished, submit]);

  const startQuiz = () => {
    if (!quiz) return;
    submittedRef.current = false;
    setAnswers(new Array(quiz.questions.length).fill(null));
    setCurrent(0);
    setTimeLeft(quiz.durationMin * 60);
    setResult(null);
    setFinished(false);
    setStarted(true);
  };

  if (loading) return <PageLoader label="Memuat kuis…" />;

  if (error || !quiz) {
    return (
      <Card>
        <EmptyState
          icon={AlertCircle}
          title="Kuis tidak ditemukan"
          description={error || 'Tautan kuis mungkin sudah tidak berlaku.'}
          action={<Button onClick={() => navigate('/kuis')}>Kembali ke daftar kuis</Button>}
        />
      </Card>
    );
  }

  if (finished && result) {
    const passed = result.score >= 75;
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/kuis" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition hover:text-text">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Daftar kuis
          </Link>
          <Badge tone={passed ? 'success' : 'warning'}>{passed ? 'Tuntas' : 'Perlu latihan lagi'}</Badge>
        </div>

        <Card className="overflow-hidden">
          <div className="relative overflow-hidden bg-[linear-gradient(122deg,#0A335C,#12579A_60%,#1E88E5)] px-5 py-7 text-white sm:px-8">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="relative">
                <ProgressRing value={result.score} size={116} stroke={10} color={passed ? '#16A34A' : '#FF9800'} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold tabular-nums">{result.score}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">Skor</span>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{quiz.subject} · {quiz.title}</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
                  {passed ? 'Kerja bagus, pertahankan!' : 'Sedikit lagi, kamu bisa!'}
                </h1>
                <p className="mt-1 text-sm text-white/75">
                  {result.correct} dari {result.total} soal benar. {passed ? 'Kamu menguasai materi ini dengan baik.' : 'Baca kembali pembahasan untuk memperbaiki skor.'}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <Button variant="accent" onClick={startQuiz}>
                    <RotateCcw className="h-4 w-4" aria-hidden="true" /> Ulangi kuis
                  </Button>
                  <Button variant="outline" className="border-white/25 bg-white/10 text-white hover:bg-white/20" onClick={() => navigate('/kuis')}>
                    Kuis lainnya
                  </Button>
                </div>
              </div>
              <SigemasMascot className="hidden h-24 w-24 sm:block" decorative />
            </div>
          </div>
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Jawaban benar</p>
              <p className="mt-1 text-xl font-extrabold text-success">{result.correct}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Jawaban salah</p>
              <p className="mt-1 text-xl font-extrabold text-danger">{result.total - result.correct}</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Skor terbaik</p>
              <p className="mt-1 text-xl font-extrabold text-primary">{Math.max(result.score, quiz.bestScore)}</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight text-text">Pembahasan jawaban</h2>
            {result.review.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex items-start gap-3 border-b border-border p-4">
                  <span className={item.correct ? 'grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-success-soft text-success' : 'grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-danger-soft text-danger'}>
                    {item.correct ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <XCircle className="h-4 w-4" aria-hidden="true" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Soal {index + 1}</p>
                    <p className="mt-0.5 text-sm font-semibold leading-relaxed text-text">{item.question}</p>
                  </div>
                </div>
                <div className="space-y-1.5 p-4">
                  {item.options.map((option, optionIndex) => {
                    const isAnswer = optionIndex === item.answer;
                    const isChosen = optionIndex === item.chosen;
                    return (
                      <div
                        key={optionIndex}
                        className={
                          isAnswer
                            ? 'flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft px-3 py-2'
                            : isChosen
                              ? 'flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2'
                              : 'flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2'
                        }
                      >
                        <span className="text-[10px] font-extrabold text-muted">{String.fromCharCode(65 + optionIndex)}.</span>
                        <span className="flex-1 text-[11px] font-medium text-text">{option}</span>
                        {isAnswer && <span className="text-[9px] font-bold text-success">Benar</span>}
                        {isChosen && !isAnswer && <span className="text-[9px] font-bold text-danger">Jawabanmu</span>}
                      </div>
                    );
                  })}
                  {item.explanation && (
                    <p className="mt-2 rounded-lg bg-primary-soft/60 px-3 py-2 text-[11px] leading-relaxed text-primary-strong dark:text-primary">
                      {item.explanation}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent-strong" aria-hidden="true" />
                <h3 className="text-sm font-bold text-text">Peringkat kelas</h3>
              </div>
              <div className="mt-3 space-y-1.5">
                {result.leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={entry.studentId} className="flex items-center gap-2 rounded-lg bg-surface-2 px-2.5 py-2">
                    <span className={index === 0 ? 'grid h-6 w-6 place-items-center rounded-md bg-accent text-[10px] font-extrabold text-[#2b1a00]' : 'grid h-6 w-6 place-items-center rounded-md bg-surface text-[10px] font-extrabold text-muted'}>
                      {index === 0 ? <Crown className="h-3.5 w-3.5" /> : entry.rank}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-text">{entry.name}</span>
                    <span className="text-[11px] font-extrabold tabular-nums text-primary">{entry.score}</span>
                  </div>
                ))}
                {result.leaderboard.length === 0 && <p className="text-[11px] text-muted">Belum ada peringkat.</p>}
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="text-sm font-bold text-text">Materi terkait</h3>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">{quiz.bookTitle}</p>
              <Link to={`/baca/${quiz.bookId}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
                Buka buku <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Link to="/kuis" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition hover:text-text">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Daftar kuis
        </Link>
        <Card className="overflow-hidden">
          <div className="relative overflow-hidden bg-[linear-gradient(122deg,#0A335C,#12579A_60%,#1E88E5)] px-5 py-8 text-white sm:px-8">
            <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent" className="border-white/10 bg-accent text-[#2b1a00]">{quiz.subject}</Badge>
                <span className="text-[11px] font-semibold text-white/70">{quiz.difficulty} · {quiz.classId}</span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{quiz.title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
                {quiz.bookTitle} · disusun oleh {quiz.teacherName}. Jawab semua soal dalam batas waktu yang tersedia.
              </p>
            </div>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-[1fr_190px] sm:p-6">
            <div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-surface-2 p-3 text-center">
                  <HelpCircle className="mx-auto h-4 w-4 text-primary" aria-hidden="true" />
                  <p className="mt-1 text-lg font-extrabold text-text">{quiz.questions.length}</p>
                  <p className="text-[9px] font-semibold text-muted">Soal</p>
                </div>
                <div className="rounded-xl bg-surface-2 p-3 text-center">
                  <Clock className="mx-auto h-4 w-4 text-accent-strong" aria-hidden="true" />
                  <p className="mt-1 text-lg font-extrabold text-text">{quiz.durationMin}</p>
                  <p className="text-[9px] font-semibold text-muted">Menit</p>
                </div>
                <div className="rounded-xl bg-surface-2 p-3 text-center">
                  <Target className="mx-auto h-4 w-4 text-success" aria-hidden="true" />
                  <p className="mt-1 text-lg font-extrabold text-text">{quiz.bestScore}</p>
                  <p className="text-[9px] font-semibold text-muted">Terbaik</p>
                </div>
              </div>
              <h2 className="mt-4 text-sm font-bold text-text">Sebelum mulai</h2>
              <ul className="mt-2 space-y-1.5 text-[11px] text-muted">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Satu jawaban benar untuk setiap soal</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Kamu dapat berpindah soal sebelum mengumpulkan</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Kuis otomatis dikumpulkan saat waktu habis</li>
              </ul>
              <Button size="lg" className="mt-5 w-full sm:w-auto" onClick={startQuiz}>
                <Flag className="h-4 w-4" aria-hidden="true" /> Mulai kuis sekarang
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[linear-gradient(140deg,var(--primary-soft),var(--surface-2))] p-4 text-center">
              <SigemasMascot className="h-28 w-28" wave />
              <p className="mt-2 text-[11px] font-bold text-text">Fokus dan teliti</p>
              <p className="mt-0.5 text-[10px] text-muted">Kamu pasti bisa!</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const question = quiz.questions[current];
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const progress = ((current + 1) / quiz.questions.length) * 100;
  const durationTotal = quiz.durationMin * 60;
  const timerDanger = timeLeft <= 60;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <button
            type="button"
            onClick={() => navigate('/kuis')}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface-2 text-muted transition hover:text-text"
            aria-label="Keluar dari kuis"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-text">{quiz.title}</p>
            <p className="text-[10px] text-muted">{quiz.subject} · {quiz.questions.length} soal</p>
          </div>
          <div className={timerDanger ? 'inline-flex items-center gap-1.5 rounded-xl bg-danger-soft px-3 py-2 text-sm font-extrabold tabular-nums text-danger' : 'inline-flex items-center gap-1.5 rounded-xl bg-primary-soft px-3 py-2 text-sm font-extrabold tabular-nums text-primary-strong dark:text-primary'}>
            <Clock className="h-4 w-4" aria-hidden="true" /> {clock(timeLeft)}
          </div>
        </div>
        <div className="h-1 w-full bg-surface-2">
          <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_290px]">
        <Card className="min-h-[420px] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <Badge tone="primary">Soal {current + 1} dari {quiz.questions.length}</Badge>
            <span className="text-[10px] font-semibold text-muted">{answeredCount} terjawab</span>
          </div>
          <h2 className="mt-4 text-base font-bold leading-relaxed text-text sm:text-lg">{question.question}</h2>
          <div className="mt-5 space-y-2.5">
            {question.options.map((option, index) => {
              const selected = answers[current] === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setAnswers((rows) => rows.map((value, rowIndex) => (rowIndex === current ? index : value)))
                  }
                  className={
                    selected
                      ? 'flex w-full items-center gap-3 rounded-xl border border-primary bg-primary-soft p-3 text-left transition'
                      : 'flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left transition hover:border-primary/35 hover:bg-surface-2'
                  }
                  aria-pressed={selected}
                >
                  <span className={selected ? 'grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-xs font-extrabold text-white' : 'grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-extrabold text-muted'}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-xs font-medium leading-relaxed text-text sm:text-sm">{option}</span>
                  {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-strong dark:text-primary" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setCurrent((value) => Math.max(0, value - 1))}>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Sebelumnya
            </Button>
            <div className="flex gap-2">
              {current < quiz.questions.length - 1 ? (
                <Button size="sm" onClick={() => setCurrent((value) => Math.min(quiz.questions.length - 1, value + 1))}>
                  Berikutnya <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button size="sm" variant="accent" onClick={() => setConfirmOpen(true)}>
                  <Send className="h-3.5 w-3.5" aria-hidden="true" /> Kumpulkan
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="p-4">
            <p className="text-xs font-bold text-text">Navigasi soal</p>
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {quiz.questions.map((_, index) => {
                const answered = answers[index] !== null;
                const active = index === current;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrent(index)}
                    className={
                      active
                        ? 'grid h-9 place-items-center rounded-lg bg-primary text-xs font-extrabold text-white shadow-sm'
                        : answered
                          ? 'grid h-9 place-items-center rounded-lg border border-success/30 bg-success-soft text-xs font-bold text-success'
                          : 'grid h-9 place-items-center rounded-lg border border-border bg-surface-2 text-xs font-bold text-muted transition hover:border-primary/30'
                    }
                    aria-label={`Soal ${index + 1}${answered ? ', sudah dijawab' : ''}`}
                    aria-current={active ? 'step' : undefined}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[9px] font-semibold text-muted">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-primary" aria-hidden="true" /> Aktif</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-success" aria-hidden="true" /> Terjawab</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm border border-border bg-surface-2" aria-hidden="true" /> Kosong</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-muted">Terjawab</span>
              <span className="tabular-nums text-text">{answeredCount}/{quiz.questions.length}</span>
            </div>
            <Progress value={(answeredCount / quiz.questions.length) * 100} size="sm" className="mt-2" tone={answeredCount === quiz.questions.length ? 'success' : 'primary'} />
            <Button variant="accent" className="mt-4 w-full" size="sm" onClick={() => setConfirmOpen(true)}>
              <Send className="h-3.5 w-3.5" aria-hidden="true" /> Kumpulkan jawaban
            </Button>
            <p className="mt-2 text-center text-[9px] text-muted">Sisa waktu {clock(timeLeft)}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-muted">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              {quiz.bookTitle}
            </div>
            <p className="mt-1 text-[10px] text-muted">Dipandu oleh {quiz.teacherName}</p>
          </Card>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Kumpulkan jawaban?"
        description={`Kamu telah menjawab ${answeredCount} dari ${quiz.questions.length} soal. Jawaban yang belum diisi akan dihitung salah.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Periksa lagi</Button>
            <Button variant="accent" loading={submitting} onClick={() => void submit(false)}>
              <Send className="h-4 w-4" aria-hidden="true" /> Kumpulkan sekarang
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3 rounded-xl bg-warning-soft p-3 text-xs leading-relaxed text-warning">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>Setelah dikumpulkan, jawaban tidak dapat diubah. Kamu tetap dapat mengulangi kuis untuk memperbaiki skor.</p>
        </div>
        {submitting && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Menghitung skor…
          </div>
        )}
      </Modal>
    </div>
  );
}
