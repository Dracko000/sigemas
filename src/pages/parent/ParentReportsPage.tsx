import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Download,
  FileText,
  MessageSquareQuote,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../lib/api';
import { downloadCsv, formatDate } from '../../lib/format';
import type {
  Assessment,
  AttendanceRecord,
  AttendanceSummary,
  DashboardData,
  ParentNote,
  ScoreRow,
  SubjectGrade,
  User,
} from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, PageLoader } from '../../components/ui/Misc';
import { Progress } from '../../components/ui/Progress';
import { LogoMark } from '../../components/Logo';

interface ReportData {
  student: User;
  className?: string;
  subjects: SubjectGrade[];
  assessments: Assessment[];
  scores: ScoreRow[];
  attendance: AttendanceSummary;
  attendanceRecords: AttendanceRecord[];
  average: number;
  rank: number;
  totalStudents: number;
}

const predicate = (score: number) => {
  if (score >= 90) return { label: 'A', tone: 'success' as const, text: 'Sangat baik' };
  if (score >= 80) return { label: 'B', tone: 'primary' as const, text: 'Baik' };
  if (score >= 70) return { label: 'C', tone: 'warning' as const, text: 'Cukup' };
  return { label: 'D', tone: 'danger' as const, text: 'Perlu bimbingan' };
};

export function ParentReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [notes, setNotes] = useState<ParentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([api<ReportData>('/api/grades'), api<DashboardData>('/api/dashboard')])
      .then(([report, dashboard]) => {
        if (active) {
          setData(report);
          setNotes(dashboard.notes ?? []);
          setError('');
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat rapor.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <PageLoader label="Menyiapkan rapor…" />;

  if (error || !data) {
    return (
      <Card>
        <EmptyState
          icon={AlertCircle}
          title="Rapor tidak dapat dimuat"
          description={error || 'Terjadi kendala saat mengambil laporan.'}
          action={<Button onClick={() => window.location.reload()}>Muat ulang</Button>}
        />
      </Card>
    );
  }

  const attendance = data.attendance;
  const present = attendance.hadir ?? attendance.present ?? 0;
  const late = attendance.terlambat ?? attendance.late ?? 0;
  const sick = attendance.sakit ?? attendance.sick ?? 0;
  const excused = attendance.izin ?? attendance.excused ?? 0;
  const absent = attendance.alfa ?? attendance.absent ?? 0;
  const overall = predicate(data.average);

  const exportCsv = () => {
    downloadCsv('rapor-sigemas.csv', [
      ['Laporan Perkembangan Belajar SiGEMAS'],
      ['Nama', data.student.name],
      ['Kelas', data.className || '-'],
      ['Rata-rata', data.average],
      ['Peringkat', `${data.rank} dari ${data.totalStudents}`],
      [],
      ['Mata Pelajaran', 'Tugas', 'Kuis', 'UTS', 'UAS', 'Nilai Akhir', 'Predikat', 'Penguasaan'],
      ...data.subjects.map((subject) => {
        const grade = predicate(subject.final);
        return [subject.subject, subject.tugas, subject.kuis, subject.uts, subject.uas, subject.final, grade.label, `${subject.mastery}%`];
      }),
      [],
      ['Kehadiran', `Hadir ${present}`, `Terlambat ${late}`, `Sakit ${sick}`, `Izin ${excused}`, `Alfa ${absent}`, `${attendance.rate}%`],
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Nilai & Laporan</h1>
          <p className="mt-0.5 text-sm text-muted">Rapor perkembangan belajar anak dalam satu laporan.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4" aria-hidden="true" /> CSV
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" /> Cetak rapor
          </Button>
        </div>
      </div>

      <Card className="report-card overflow-hidden print:border-0 print:shadow-none">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4 sm:px-7 sm:py-5">
          <LogoMark size={44} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">SiGEMAS · Laporan Perkembangan Belajar</p>
            <h2 className="text-lg font-extrabold tracking-tight text-text">Rapor Semester Ganjil 2025/2026</h2>
            <p className="text-[10px] text-muted">Diterbitkan {formatDate(new Date().toISOString())} · terintegrasi katalog SIBI</p>
          </div>
          <Badge tone={overall.tone} className="print:hidden">{overall.text}</Badge>
        </div>

        <div className="grid gap-4 border-b border-border bg-surface-2/50 px-5 py-4 sm:grid-cols-2 sm:px-7">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Nama peserta didik</p>
            <p className="mt-0.5 text-sm font-extrabold text-text">{data.student.name}</p>
            <p className="text-[10px] text-muted">NISN {data.student.nisn || '—'} · {data.student.email}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Kelas</p>
            <p className="mt-0.5 text-sm font-extrabold text-text">{data.className}</p>
            <p className="text-[10px] text-muted">Peringkat {data.rank} dari {data.totalStudents} siswa</p>
          </div>
        </div>

        <div className="grid gap-3 border-b border-border px-5 py-4 sm:grid-cols-4 sm:px-7">
          {[
            { label: 'Rata-rata', value: data.average, suffix: '' },
            { label: 'Predikat', value: overall.label, suffix: '' },
            { label: 'Kehadiran', value: attendance.rate ?? 0, suffix: '%' },
            { label: 'Mata pelajaran', value: data.subjects.length, suffix: '' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-surface-2 px-3 py-2.5 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted">{item.label}</p>
              <p className="mt-0.5 text-xl font-extrabold tabular-nums text-text">{item.value}<span className="text-[10px] font-semibold text-muted">{item.suffix}</span></p>
            </div>
          ))}
        </div>

        <div className="px-5 py-5 sm:px-7">
          <h3 className="text-sm font-bold text-text">Capaian mata pelajaran</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="bg-surface-2 text-[9px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="rounded-l-lg px-3 py-2 font-bold">Mata pelajaran</th>
                  <th className="px-2 py-2 text-center font-bold">Tugas</th>
                  <th className="px-2 py-2 text-center font-bold">Kuis</th>
                  <th className="px-2 py-2 text-center font-bold">UTS</th>
                  <th className="px-2 py-2 text-center font-bold">UAS</th>
                  <th className="px-2 py-2 text-center font-bold">Akhir</th>
                  <th className="px-2 py-2 text-center font-bold">Predikat</th>
                  <th className="rounded-r-lg px-3 py-2 font-bold">Penguasaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.subjects.map((subject) => {
                  const grade = predicate(subject.final);
                  return (
                    <tr key={subject.subject}>
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-1.5 font-semibold text-text">
                          <span className="h-2 w-2 rounded-full" style={{ background: subject.color }} aria-hidden="true" />
                          {subject.subject}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-center tabular-nums text-muted">{subject.tugas}</td>
                      <td className="px-2 py-2.5 text-center tabular-nums text-muted">{subject.kuis}</td>
                      <td className="px-2 py-2.5 text-center tabular-nums text-muted">{subject.uts}</td>
                      <td className="px-2 py-2.5 text-center tabular-nums text-muted">{subject.uas}</td>
                      <td className="px-2 py-2.5 text-center text-sm font-extrabold tabular-nums text-text">{subject.final}</td>
                      <td className="px-2 py-2.5 text-center"><Badge tone={grade.tone} className="px-2 py-0.5 text-[9px]">{grade.label}</Badge></td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Progress value={subject.mastery} size="sm" tone={subject.mastery >= 85 ? 'success' : subject.mastery >= 75 ? 'primary' : 'warning'} className="w-20" />
                          <span className="text-[9px] font-bold tabular-nums text-muted">{subject.mastery}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[9px] leading-relaxed text-muted">
            Predikat: A (≥90 sangat baik), B (80–89 baik), C (70–79 cukup), D (&lt;70 perlu bimbingan). Nilai akhir merupakan gabungan komponen sesuai bobot penilaian guru.
          </p>
        </div>

        <div className="grid gap-5 border-t border-border px-5 py-5 sm:grid-cols-2 sm:px-7">
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <h3 className="text-sm font-bold text-text">Rekap kehadiran</h3>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
              {[
                { label: 'Hadir', value: present, tone: 'text-success' },
                { label: 'Terlambat', value: late, tone: 'text-warning' },
                { label: 'Sakit', value: sick, tone: 'text-info' },
                { label: 'Izin', value: excused, tone: 'text-primary' },
                { label: 'Alfa', value: absent, tone: 'text-danger' },
                { label: 'Kehadiran', value: `${attendance.rate ?? 0}%`, tone: 'text-text' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-surface-2 px-2.5 py-2">
                  <span className="text-muted">{item.label}</span>
                  <span className={`font-extrabold tabular-nums ${item.tone}`}>{item.value}</span>
                </div>
              ))}
            </div>
            {data.attendanceRecords.length > 0 && (
              <div className="mt-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Catatan terakhir</p>
                <ul className="mt-1 space-y-1">
                  {data.attendanceRecords.slice(0, 4).map((record, index) => (
                    <li key={`${record.date}-${index}`} className="flex items-center justify-between gap-2 rounded-lg border border-border px-2.5 py-1.5 text-[9px]">
                      <span className="truncate text-muted">{formatDate(record.date)} · {record.topic}</span>
                      <span className="shrink-0 font-bold text-text">{record.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="h-4 w-4 text-accent-strong" aria-hidden="true" />
              <h3 className="text-sm font-bold text-text">Catatan guru</h3>
            </div>
            {notes.length === 0 ? (
              <p className="mt-3 rounded-lg bg-surface-2 px-3 py-3 text-[10px] text-muted">Belum ada catatan guru pada semester ini.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {notes.slice(0, 3).map((note) => (
                  <div key={note.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-bold text-text">{note.teacherName}</p>
                      <span className="text-[8px] text-muted">{formatDate(note.date)}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-relaxed text-muted">“{note.text}”</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-border px-5 py-6 text-center text-[10px] text-muted sm:px-10">
          <div>
            <p>Wali Kelas</p>
            <div className="mx-auto mt-8 border-t border-border pt-1.5">SiGEMAS</div>
          </div>
          <div>
            <p>Orang Tua / Wali</p>
            <div className="mx-auto mt-8 border-t border-border pt-1.5">{data.student.name.split(',')[1]?.trim() || '........................'}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface-2/60 px-5 py-3 text-[9px] text-muted sm:px-7">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-success" aria-hidden="true" /> Dokumen dihasilkan otomatis oleh SiGEMAS</span>
          <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-primary" aria-hidden="true" /> {data.assessments.length} penilaian · {data.subjects.length} mata pelajaran</span>
        </div>
      </Card>

      <Card className="flex flex-wrap items-center gap-3 border-primary/20 bg-primary-soft/30 p-4 print:hidden">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-primary shadow-sm">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-text">Butuh versi cetak?</p>
          <p className="text-[11px] leading-relaxed text-muted">Gunakan tombol cetak untuk menyimpan rapor sebagai PDF atau mencetaknya untuk diskusi dengan wali kelas.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" aria-hidden="true" /> Cetak
        </Button>
      </Card>
    </div>
  );
}
