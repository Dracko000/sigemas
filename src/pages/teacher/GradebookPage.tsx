import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Download,
  Info,
  Save,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { api } from '../../lib/api';
import { downloadCsv } from '../../lib/format';
import { useToast } from '../../context/ToastContext';
import type { Assessment, ClassRoom, ScoreRow, User } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Field';
import { EmptyState, PageLoader, StatCard } from '../../components/ui/Misc';

interface GradebookData {
  class: ClassRoom & { homeroomName?: string };
  students: (User & { average: number })[];
  assessments: Assessment[];
  scores: ScoreRow[];
  summary: { average: number; ranks: { studentId: string; name: string; average: number }[]; best: number; lowest: number };
}

const cellTone = (ratio: number) => {
  if (ratio >= 0.85) return 'bg-success-soft text-success';
  if (ratio >= 0.7) return 'bg-primary-soft text-primary-strong dark:text-primary';
  if (ratio >= 0.6) return 'bg-warning-soft text-warning';
  return 'bg-danger-soft text-danger';
};

export function GradebookPage() {
  const toast = useToast();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [classId, setClassId] = useState('');
  const [data, setData] = useState<GradebookData | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api<ClassRoom[]>('/api/classes')
      .then((rows) => {
        setClasses(rows);
        setClassId((current) => current || rows[0]?.id || '');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat kelas.'));
  }, []);

  const loadGradebook = useCallback(
    (targetClassId: string, silent = false) => {
      if (!targetClassId) return;
      if (!silent) setLoading(true);
      api<GradebookData>(`/api/gradebook?classId=${targetClassId}`)
        .then((payload) => {
          setData(payload);
          setValues(
            Object.fromEntries(
              payload.scores.map((score) => [`${score.assessmentId}:${score.studentId}`, String(score.score)])
            )
          );
          setError('');
        })
        .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat buku nilai.'))
        .finally(() => {
          if (!silent) setLoading(false);
        });
    },
    []
  );

  useEffect(() => {
    if (classId) loadGradebook(classId);
  }, [classId, loadGradebook]);

  const dirty = useMemo(() => {
    if (!data) return false;
    return data.scores.some((score) => {
      const key = `${score.assessmentId}:${score.studentId}`;
      return String(score.score) !== (values[key] ?? '');
    }) || Object.entries(values).some(([key, value]) => {
      const exists = data.scores.some((score) => `${score.assessmentId}:${score.studentId}` === key);
      return !exists && value.trim() !== '';
    });
  }, [data, values]);

  const filteredStudents = useMemo(() => {
    if (!data) return [];
    const term = query.trim().toLowerCase();
    if (!term) return data.students;
    return data.students.filter((student) => student.name.toLowerCase().includes(term) || student.nisn?.includes(term));
  }, [data, query]);

  const updateValue = (assessmentId: string, studentId: string, value: string, max: number) => {
    if (value === '') {
      setValues((rows) => ({ ...rows, [`${assessmentId}:${studentId}`]: '' }));
      return;
    }
    const numeric = Math.max(0, Math.min(max, Number(value)));
    if (Number.isNaN(numeric)) return;
    setValues((rows) => ({ ...rows, [`${assessmentId}:${studentId}`]: String(numeric) }));
  };

  const save = async () => {
    if (!data) return;
    const rows: { assessmentId: string; studentId: string; score: number }[] = [];
    for (const assessment of data.assessments) {
      for (const student of data.students) {
        const raw = values[`${assessment.id}:${student.id}`];
        if (raw === undefined || raw.trim() === '') continue;
        const score = Number(raw);
        if (!Number.isFinite(score)) continue;
        rows.push({
          assessmentId: assessment.id,
          studentId: student.id,
          score: Math.max(0, Math.min(assessment.maxScore, Math.round(score))),
        });
      }
    }
    if (rows.length === 0) {
      toast.info('Belum ada nilai', 'Isi minimal satu sel sebelum menyimpan.');
      return;
    }
    setSaving(true);
    try {
      const result = await api<{ updated: number }>('/api/grades/bulk', { method: 'POST', body: { scores: rows } });
      toast.success('Buku nilai tersimpan', `${result.updated} sel nilai diperbarui.`);
      loadGradebook(data.class.id, true);
    } catch (err) {
      toast.error('Gagal menyimpan nilai', err instanceof Error ? err.message : undefined);
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    if (!data) return;
    downloadCsv(`${data.class.name.toLowerCase().replace(/\s+/g, '-')}-nilai.csv`, [
      ['Nama', 'NISN', ...data.assessments.map((assessment) => `${assessment.title} (${assessment.weight}%)`), 'Rata-rata'],
      ...data.students.map((student) => [
        student.name,
        student.nisn || '-',
        ...data.assessments.map((assessment) => values[`${assessment.id}:${student.id}`] ?? ''),
        student.average,
      ]),
    ]);
    toast.success('Nilai diekspor', 'Berkas CSV dapat dibuka di spreadsheet.');
  };

  if (loading && !data) return <PageLoader label="Memuat buku nilai…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Buku Nilai</h1>
          <p className="mt-0.5 text-sm text-muted">Kelola nilai tugas, kuis, UTS, dan UAS dalam satu tabel.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-48">
            <Select label="Kelas" value={classId} onChange={(event) => setClassId(event.target.value)}>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
          </div>
          <Button variant="outline" onClick={exportCsv} disabled={!data}>
            <Download className="h-4 w-4" aria-hidden="true" /> Ekspor
          </Button>
          <Button loading={saving} onClick={save} disabled={!data || !dirty}>
            <Save className="h-4 w-4" aria-hidden="true" /> Simpan
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>
      )}

      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Rata-rata kelas" value={data.summary.average} icon={ClipboardList} tone="primary" hint={`${data.students.length} siswa`} />
            <StatCard label="Nilai tertinggi" value={data.summary.best} icon={TrendingUp} tone="success" hint="Dari rata-rata siswa" />
            <StatCard label="Nilai terendah" value={data.summary.lowest} icon={TrendingDown} tone="warning" hint="Perlu pendampingan" />
            <StatCard label="Penilaian" value={data.assessments.length} icon={Award} tone="accent" hint={`${data.scores.length} nilai terisi`} />
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary-strong dark:text-primary">
                  <Users className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-text">{data.class.name} · {data.class.homeroomName}</p>
                  <p className="text-[10px] text-muted">Klik sel untuk mengubah nilai. Perubahan ditandai hingga disimpan.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {dirty && <Badge tone="warning" dot>Belum disimpan</Badge>}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari siswa…"
                    className="h-9 w-44 rounded-lg border border-border bg-surface pl-8 pr-2 text-[11px] text-text outline-none focus:border-primary"
                    aria-label="Cari siswa"
                  />
                </div>
              </div>
            </div>

            {data.assessments.length === 0 ? (
              <EmptyState icon={ClipboardList} title="Belum ada penilaian" description="Tambahkan penilaian terlebih dahulu untuk mulai mengisi nilai." />
            ) : (
              <div className="max-h-[620px] overflow-auto">
                <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-xs">
                  <thead>
                    <tr>
                      <th className="sticky left-0 top-0 z-20 min-w-[220px] border-b border-border bg-surface-2 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Siswa
                      </th>
                      {data.assessments.map((assessment) => (
                        <th key={assessment.id} className="sticky top-0 z-10 min-w-[120px] border-b border-l border-border bg-surface-2 px-2 py-2 text-center">
                          <p className="truncate text-[10px] font-bold text-text" title={assessment.title}>{assessment.title}</p>
                          <p className="mt-0.5 text-[8px] font-semibold text-muted">{assessment.type} · {assessment.weight}% · maks {assessment.maxScore}</p>
                        </th>
                      ))}
                      <th className="sticky top-0 z-10 min-w-[90px] border-b border-l border-border bg-surface-2 px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-muted">
                        Rata-rata
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="group">
                        <td className="sticky left-0 z-10 border-b border-border bg-surface px-4 py-2 group-hover:bg-surface-2">
                          <div className="flex items-center gap-2">
                            <Avatar name={student.name} size="xs" />
                            <div className="min-w-0">
                              <p className="truncate text-[11px] font-semibold text-text">{student.name}</p>
                              <p className="text-[9px] text-muted">{student.nisn}</p>
                            </div>
                          </div>
                        </td>
                        {data.assessments.map((assessment) => {
                          const key = `${assessment.id}:${student.id}`;
                          const raw = values[key] ?? '';
                          const numeric = Number(raw);
                          const ratio = raw === '' || Number.isNaN(numeric) ? 0 : numeric / assessment.maxScore;
                          const edited = (data.scores.find((score) => score.assessmentId === assessment.id && score.studentId === student.id)?.score ?? null) !== (raw === '' ? null : Number(raw));
                          return (
                            <td key={assessment.id} className="border-b border-l border-border p-1.5 text-center group-hover:bg-surface-2/40">
                              <input
                                type="number"
                                min={0}
                                max={assessment.maxScore}
                                value={raw}
                                onChange={(event) => updateValue(assessment.id, student.id, event.target.value, assessment.maxScore)}
                                onBlur={(event) => {
                                  if (event.target.value !== '') updateValue(assessment.id, student.id, String(Math.round(Number(event.target.value))), assessment.maxScore);
                                }}
                                placeholder="—"
                                className={
                                  raw === ''
                                    ? 'h-8 w-full rounded-md border border-transparent bg-transparent text-center text-[11px] font-semibold text-muted outline-none transition hover:border-border focus:border-primary focus:bg-surface'
                                    : `h-8 w-full rounded-md border text-center text-[11px] font-bold outline-none transition focus:border-primary ${cellTone(ratio)} ${edited ? 'border-accent ring-1 ring-accent/30' : 'border-transparent'}`
                                }
                                aria-label={`Nilai ${student.name} untuk ${assessment.title}`}
                              />
                            </td>
                          );
                        })}
                        <td className="border-b border-l border-border px-3 py-2 text-center">
                          <span className={student.average >= 75 ? 'text-sm font-extrabold tabular-nums text-success' : 'text-sm font-extrabold tabular-nums text-warning'}>
                            {student.average}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[10px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" aria-hidden="true" /> Nilai di luar rentang 0–maks akan disesuaikan otomatis.
              </span>
              <span className="inline-flex items-center gap-1.5">
                {dirty ? (
                  <><span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> Ada perubahan belum disimpan</>
                ) : (
                  <><CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Semua perubahan tersimpan</>
                )}
              </span>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
