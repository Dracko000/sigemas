import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  Clock,
  ListChecks,
  NotebookPen,
  Pencil,
  Plus,
  Sparkles,
  Target,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import type { ClassRoom, LessonPlan } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { EmptyState, PageLoader, SectionHeader, StatCard } from '../../components/ui/Misc';
import { Tabs } from '../../components/ui/Tabs';

const statusTone = (status: string) => {
  if (status === 'selesai') return 'success' as const;
  if (status === 'berlangsung') return 'accent' as const;
  return 'primary' as const;
};

interface FormState {
  week: string;
  subject: string;
  topic: string;
  dates: string;
  status: string;
  assessment: string;
  activities: string;
}

const initialForm: FormState = {
  week: '1',
  subject: 'Matematika',
  topic: '',
  dates: '',
  status: 'mendatang',
  assessment: '',
  activities: '',
};

export function LessonPlansPage() {
  const toast = useToast();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [classId, setClassId] = useState('');
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LessonPlan | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    api<ClassRoom[]>('/api/classes')
      .then((rows) => {
        setClasses(rows);
        setClassId((current) => current || rows[0]?.id || '');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat kelas.'));
  }, []);

  const loadPlans = (targetClassId: string) => {
    setLoading(true);
    api<LessonPlan[]>(`/api/lesson-plans?classId=${targetClassId}`)
      .then((rows) => {
        setPlans(rows);
        setError('');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat RPP.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (classId) loadPlans(classId);
  }, [classId]);

  const counts = useMemo(
    () => ({
      all: plans.length,
      selesai: plans.filter((plan) => plan.status === 'selesai').length,
      berlangsung: plans.filter((plan) => plan.status === 'berlangsung').length,
      mendatang: plans.filter((plan) => plan.status === 'mendatang').length,
    }),
    [plans]
  );

  const filtered = filter === 'all' ? plans : plans.filter((plan) => plan.status === filter);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...initialForm, week: String((plans.at(-1)?.week ?? 0) + 1) });
    setFormError('');
    setOpen(true);
  };

  const openEdit = (plan: LessonPlan) => {
    setEditing(plan);
    setForm({
      week: String(plan.week),
      subject: plan.subject,
      topic: plan.topic,
      dates: plan.dates,
      status: plan.status,
      assessment: plan.assessment,
      activities: plan.activities.join('\n'),
    });
    setFormError('');
    setOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.topic.trim()) {
      setFormError('Topik pembelajaran wajib diisi.');
      return;
    }
    if (!classId) {
      setFormError('Pilih kelas terlebih dahulu.');
      return;
    }
    setSaving(true);
    setFormError('');
    const payload = {
      classId,
      week: Number(form.week) || 1,
      subject: form.subject,
      topic: form.topic.trim(),
      dates: form.dates.trim() || 'Minggu mendatang',
      status: form.status,
      assessment: form.assessment.trim() || 'Latihan mandiri',
      activities: form.activities.split('\n').map((line) => line.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await api(`/api/lesson-plans/${editing.id}`, { method: 'PATCH', body: payload });
        toast.success('RPP diperbarui', form.topic.trim());
      } else {
        await api('/api/lesson-plans', { method: 'POST', body: payload });
        toast.success('RPP tersimpan', 'Rencana pembelajaran ditambahkan ke kelas.');
      }
      setOpen(false);
      loadPlans(classId);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan RPP.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && plans.length === 0 && !error) return <PageLoader label="Memuat rencana pembelajaran…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">RPP Digital</h1>
          <p className="mt-0.5 text-sm text-muted">Susun rencana pembelajaran yang terhubung dengan bab SIBI.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-48">
            <Select label="Kelas" value={classId} onChange={(event) => setClassId(event.target.value)}>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Susun RPP
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total RPP" value={counts.all} icon={NotebookPen} tone="primary" hint="Rencana tersimpan" />
        <StatCard label="Selesai" value={counts.selesai} icon={CheckCircle2} tone="success" hint="Pembelajaran tuntas" />
        <StatCard label="Berlangsung" value={counts.berlangsung} icon={Clock} tone="accent" hint="Pekan ini" />
        <StatCard label="Mendatang" value={counts.mendatang} icon={CalendarRange} tone="info" hint="Perlu persiapan" />
      </div>

      <Tabs
        items={[
          { id: 'all', label: 'Semua', count: counts.all },
          { id: 'berlangsung', label: 'Berlangsung', count: counts.berlangsung },
          { id: 'mendatang', label: 'Mendatang', count: counts.mendatang },
          { id: 'selesai', label: 'Selesai', count: counts.selesai },
        ]}
        value={filter}
        onChange={setFilter}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card>
              <EmptyState
                icon={NotebookPen}
                title="Belum ada RPP pada filter ini"
                description="Susun rencana pembelajaran baru atau ubah filter status."
                action={<Button onClick={openCreate}><Plus className="h-4 w-4" aria-hidden="true" /> Susun RPP</Button>}
              />
            </Card>
          ) : (
            filtered
              .slice()
              .sort((a, b) => a.week - b.week)
              .map((plan) => (
                <Card key={plan.id} className="overflow-hidden">
                  <div className="flex flex-wrap items-start gap-3 p-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-strong dark:text-primary">
                      <span className="text-[8px] font-bold uppercase tracking-wider">Pekan</span>
                      <span className="text-xl font-extrabold leading-none">{plan.week}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge tone={statusTone(plan.status)} dot>{plan.status}</Badge>
                        <Badge tone="neutral" className="px-2 py-0.5 text-[9px]">{plan.subject}</Badge>
                        <span className="text-[10px] text-muted">{plan.className} · {plan.dates}</span>
                      </div>
                      <h3 className="mt-1.5 text-sm font-bold text-text">{plan.topic}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted">
                        <BookOpen className="h-3 w-3" aria-hidden="true" /> {plan.bookTitle || 'Buku SIBI'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => openEdit(plan)}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Sunting
                    </Button>
                  </div>
                  {plan.activities.length > 0 && (
                    <div className="border-t border-border px-4 py-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Kegiatan pembelajaran</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {plan.activities.map((activity, index) => (
                          <span key={index} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-1 text-[9px] font-medium text-text">
                            <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-primary text-[7px] font-bold text-white">{index + 1}</span>
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 border-t border-border bg-surface-2/50 px-4 py-2.5 text-[10px]">
                    <span className="inline-flex items-center gap-1 font-semibold text-muted">
                      <Target className="h-3.5 w-3.5 text-accent-strong" aria-hidden="true" /> Asesmen: {plan.assessment}
                    </span>
                  </div>
                </Card>
              ))
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-success-soft text-success">
                <ListChecks className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-text">Checklist RPP</h3>
                <p className="text-[10px] text-muted">Standar perencanaan singkat</p>
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-[11px] text-muted">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" /> Tujuan pembelajaran jelas dan terukur</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" /> Kegiatan pembuka, inti, dan penutup</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" /> Asesmen sesuai capaian</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" /> Sumber belajar dari katalog SIBI</li>
            </ul>
          </Card>

          <Card className="border-primary/20 bg-primary-soft/30 p-4">
            <div className="flex items-center gap-2 text-primary-strong dark:text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs font-bold">Tips menyusun RPP</p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Gunakan hasil ekstraksi PDF untuk mengisi ringkasan bab, glosarium, dan kuis. RPP yang terhubung langsung dengan materi membuat kelas live lebih terarah.
            </p>
            <Link to="/guru/ekstraktor" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline">
              Buka ekstraktor PDF <ClipboardList className="h-3 w-3" aria-hidden="true" />
            </Link>
          </Card>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Sunting RPP' : 'Susun RPP baru'}
        description="Lengkapi informasi pembelajaran. Kegiatan dapat ditulis satu per baris."
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" form="rpp-form" loading={saving}>
              {editing ? 'Perbarui RPP' : 'Simpan RPP'}
            </Button>
          </>
        }
      >
        <form id="rpp-form" onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Pekan"
              type="number"
              min={1}
              max={52}
              value={form.week}
              onChange={(event) => setForm((rows) => ({ ...rows, week: event.target.value }))}
            />
            <Select
              label="Mata pelajaran"
              value={form.subject}
              onChange={(event) => setForm((rows) => ({ ...rows, subject: event.target.value }))}
            >
              {['Matematika', 'Bahasa Indonesia', 'IPA', 'Informatika', 'Sejarah Indonesia', 'Bahasa Inggris'].map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </Select>
            <Select
              label="Status"
              value={form.status}
              onChange={(event) => setForm((rows) => ({ ...rows, status: event.target.value }))}
            >
              <option value="mendatang">Mendatang</option>
              <option value="berlangsung">Berlangsung</option>
              <option value="selesai">Selesai</option>
            </Select>
          </div>
          <Input
            label="Topik pembelajaran"
            value={form.topic}
            onChange={(event) => setForm((rows) => ({ ...rows, topic: event.target.value }))}
            placeholder="Contoh: Fungsi kuadrat dan grafiknya"
            required
            maxLength={160}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Tanggal / rentang"
              value={form.dates}
              onChange={(event) => setForm((rows) => ({ ...rows, dates: event.target.value }))}
              placeholder="Contoh: 4–8 Agustus 2026"
            />
            <Input
              label="Asesmen"
              value={form.assessment}
              onChange={(event) => setForm((rows) => ({ ...rows, assessment: event.target.value }))}
              placeholder="Contoh: Kuis bab 2"
            />
          </div>
          <Textarea
            label="Kegiatan pembelajaran"
            value={form.activities}
            onChange={(event) => setForm((rows) => ({ ...rows, activities: event.target.value }))}
            placeholder={'Apersepsi dan pemantik\nDiskusi konsep fungsi kuadrat\nLatihan soal berkelompok\nRefleksi dan penugasan'}
            hint="Satu kegiatan per baris."
            rows={5}
          />
          {formError && <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs font-semibold text-danger">{formError}</p>}
          <div className="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-[10px] text-muted">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> RPP akan ditautkan ke {classes.find((item) => item.id === classId)?.name || 'kelas terpilih'}.
          </div>
        </form>
      </Modal>
    </div>
  );
}
