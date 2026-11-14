import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Download,
  FileScan,
  FileText,
  Layers,
  Lightbulb,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  UploadCloud,
  WandSparkles,
  X,
} from 'lucide-react';
import { api } from '../../lib/api';
import { formatDate, formatDateTime } from '../../lib/format';
import { useToast } from '../../context/ToastContext';
import type { ClassRoom } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Field';
import { EmptyState } from '../../components/ui/Misc';
import { Tabs } from '../../components/ui/Tabs';

interface DraftChapter {
  title: string;
  startPage: number;
  endPage: number;
  summary: string;
  keywords: string[];
}

interface DraftQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface DraftFlashcard {
  front: string;
  back: string;
}

interface Extraction {
  fileName: string;
  pageCount: number;
  wordCount: number;
  chapters: DraftChapter[];
  keywords: string[];
  glossary: { term: string; definition: string }[];
  flashcards: DraftFlashcard[];
  questions: DraftQuestion[];
  preview: string;
}

interface SavedModule {
  id: string;
  title: string;
  fileName: string;
  classId: string;
  chapters: unknown[];
  glossary: unknown[];
  questions: unknown[];
  flashcards: unknown[];
  createdAt: string;
}

const STOPWORDS = new Set(
  'yang dan di ke dari untuk dengan pada adalah ini itu atau juga dalam akan dapat sebagai oleh karena telah lebih tidak ada secara para antara bagi saat seperti agar bila jika maka sudah belum sangat banyak beberapa melalui terhadap merupakan menjadi serta namun tetapi hanya sekitar atas bawah setelah sebelum tanpa hingga ia mereka kita kamu saya dia nya pun per an the of and to in is are for with that this'.split(' ')
);

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

function topKeywords(text: string, limit = 12) {
  const words = text.toLowerCase().match(/[a-zà-ÿ]{4,}/g) ?? [];
  const counts = new Map<string, number>();
  for (const word of words) {
    if (STOPWORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

const sentenceList = (text: string) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map(normalize)
    .filter((sentence) => sentence.length > 70 && sentence.length < 340);

const definitionFor = (term: string, sentences: string[]) => {
  const found = sentences.find((sentence) => sentence.toLowerCase().includes(term));
  return found ? found.slice(0, 220) : `Istilah kunci yang muncul berulang dalam modul ini: ${term}.`;
};

function analyze(fileName: string, pages: string[]): Extraction {
  const pageTexts = pages.map(normalize);
  const fullText = pageTexts.join(' ');
  const keywords = topKeywords(fullText, 16);
  const sentences = sentenceList(fullText);

  const headingIndexes: number[] = [];
  pageTexts.forEach((text, index) => {
    if (/^bab\s+[ivxlcdm\d]+/i.test(text.slice(0, 70))) headingIndexes.push(index);
  });

  const groups: { start: number; end: number }[] = [];
  if (headingIndexes.length >= 2) {
    headingIndexes.forEach((start, index) => {
      groups.push({ start, end: (headingIndexes[index + 1] ?? pageTexts.length) - 1 });
    });
  } else {
    const size = Math.max(1, Math.ceil(pageTexts.length / Math.min(4, pageTexts.length)));
    for (let start = 0; start < pageTexts.length; start += size) {
      groups.push({ start, end: Math.min(pageTexts.length - 1, start + size - 1) });
    }
  }

  const chapters: DraftChapter[] = groups.slice(0, 12).map((group, index) => {
    const text = pageTexts.slice(group.start, group.end + 1).join(' ');
    const heading = (pageTexts[group.start].match(/^bab\s+[ivxlcdm\d]+[^.]{0,60}/i)?.[0] || '').trim();
    const chapterKeywords = topKeywords(text, 5);
    const chapterSentences = sentenceList(text);
    return {
      title: heading || `Bab ${index + 1} · ${chapterKeywords[0] ? chapterKeywords[0].replace(/\b\w/g, (c) => c.toUpperCase()) : 'Materi Pembelajaran'}`,
      startPage: group.start + 1,
      endPage: group.end + 1,
      summary:
        chapterSentences.slice(0, 2).join(' ').slice(0, 280) ||
        text.slice(0, 240) ||
        'Belum ada ringkasan yang dapat diekstrak dari halaman ini.',
      keywords: chapterKeywords,
    };
  });

  const glossary = keywords.slice(0, 8).map((term) => ({
    term: term.replace(/\b\w/g, (c) => c.toUpperCase()),
    definition: definitionFor(term, sentences),
  }));

  const flashcards = keywords.slice(0, 8).map((term) => ({
    front: term.replace(/\b\w/g, (c) => c.toUpperCase()),
    back: definitionFor(term, sentences),
  }));

  const pool = sentences.length ? sentences : [fullText.slice(0, 240)];
  const questions: DraftQuestion[] = pool.slice(0, 5).map((sentence, index) => {
    const rotated = [...pool].sort((a, b) => {
      const sa = a.length + index * 13;
      const sb = b.length + index * 7;
      return (sa % 11) - (sb % 11);
    });
    const distractors = rotated.filter((item) => item !== sentence).slice(0, 3);
    const options = [sentence.slice(0, 140), ...distractors.map((item) => item.slice(0, 140))];
    const shift = index % options.length;
    const rotatedOptions = [...options.slice(shift), ...options.slice(0, shift)];
    return {
      question: `Pernyataan manakah yang sesuai dengan materi "${keywords[index % keywords.length] || 'pembelajaran'}" pada halaman ${index + 1}?`,
      options: rotatedOptions,
      answer: rotatedOptions.indexOf(sentence.slice(0, 140)),
      explanation: `Jawaban diambil dari ringkasan modul: ${sentence.slice(0, 200)}`,
    };
  });

  return {
    fileName,
    pageCount: pages.length,
    wordCount: fullText.split(/\s+/).filter(Boolean).length,
    chapters,
    keywords,
    glossary,
    flashcards,
    questions,
    preview: fullText.slice(0, 900),
  };
}

export function ExtractorPage() {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [modules, setModules] = useState<SavedModule[]>([]);
  const [classId, setClassId] = useState('');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Extraction | null>(null);
  const [tab, setTab] = useState('ringkasan');
  const [saving, setSaving] = useState(false);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const loadModules = () => {
    api<SavedModule[]>('/api/modules')
      .then(setModules)
      .catch(() => undefined);
  };

  useEffect(() => {
    Promise.all([api<ClassRoom[]>('/api/classes'), api<SavedModule[]>('/api/modules')])
      .then(([classRows, moduleRows]) => {
        setClasses(classRows);
        setClassId(classRows[0]?.id || '');
        setModules(moduleRows);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat data ekstraktor.'));
  }, []);

  const stats = useMemo(() => {
    if (!result) return null;
    return [
      { label: 'Halaman', value: result.pageCount },
      { label: 'Kata', value: result.wordCount.toLocaleString('id-ID') },
      { label: 'Bab', value: result.chapters.length },
      { label: 'Kuis', value: result.questions.length },
    ];
  }, [result]);

  const processFile = async (file: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Format tidak didukung', 'Unggah berkas PDF SIBI.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Berkas terlalu besar', 'Maksimal 20 MB untuk demo ekstraksi.');
      return;
    }
    setFileName(file.name);
    setError('');
    setResult(null);
    setExtracting(true);
    setProgress(2);
    try {
      const pdfjs = await import('pdfjs-dist');
      const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      const buffer = await file.arrayBuffer();
      const document = await pdfjs.getDocument({ data: buffer }).promise;
      const limit = Math.min(document.numPages, 60);
      const pages: string[] = [];
      for (let pageNumber = 1; pageNumber <= limit; pageNumber += 1) {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        pages.push(text || `Halaman ${pageNumber} tidak mengandung teks yang dapat diekstrak.`);
        setProgress(Math.round((pageNumber / limit) * 92) + 4);
      }
      const analysis = analyze(file.name, pages);
      setResult(analysis);
      setTitle(file.name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' '));
      setTab('ringkasan');
      setProgress(100);
      toast.success('Ekstraksi selesai', `${pages.length} halaman dianalisis menjadi ${analysis.chapters.length} bab.`);
      if (document.numPages > limit) {
        toast.info('Sebagian halaman diproses', `Demo memproses ${limit} dari ${document.numPages} halaman.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membaca PDF. Pastikan berkas tidak terkunci.');
      toast.error('Ekstraksi gagal', 'Coba berkas PDF lain atau periksa konsol browser.');
    } finally {
      setExtracting(false);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const saveModule = async () => {
    if (!result) return;
    if (!title.trim()) {
      toast.error('Judul modul kosong', 'Isi judul modul sebelum menyimpan.');
      return;
    }
    setSaving(true);
    try {
      await api('/api/modules', {
        method: 'POST',
        body: {
          title: title.trim(),
          fileName: result.fileName,
          classId,
          chapters: result.chapters,
          glossary: result.glossary,
          questions: result.questions,
          flashcards: result.flashcards,
        },
      });
      toast.success('Modul tersimpan', 'Modul ekstraksi dapat dipakai untuk perencanaan kelas.');
      setResult(null);
      setFileName('');
      setTitle('');
      loadModules();
    } catch (err) {
      toast.error('Gagal menyimpan modul', err instanceof Error ? err.message : undefined);
    } finally {
      setSaving(false);
    }
  };

  const exportJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${title || 'modul-sigemas'}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.success('Hasil diekspor', 'Berkas JSON berisi bab, glosarium, flashcard, dan kuis.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Ekstraktor PDF SIBI</h1>
          <p className="mt-0.5 text-sm text-muted">Ubah buku PDF menjadi bab, glosarium, flashcard, dan kuis.</p>
        </div>
        <Badge tone="primary">
          <WandSparkles className="h-3 w-3" aria-hidden="true" /> Pemrosesan lokal di browser
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <div className="relative overflow-hidden bg-[linear-gradient(122deg,#0A335C,#12579A_58%,#1E88E5)] px-5 py-6 text-white sm:px-7">
          <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-wrap items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
              <FileScan className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Dari halaman PDF menjadi bahan ajar</h2>
              <p className="mt-1 text-sm text-white/70">PDF tidak dikirim ke server. Teks diekstrak dan dianalisis langsung di perangkatmu.</p>
            </div>
            <span className="hidden rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white/80 sm:inline-flex">
              Maks. 20 MB · 60 halaman per proses
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={
              dragging
                ? 'rounded-2xl border-2 border-dashed border-primary bg-primary-soft/50 px-5 py-10 text-center transition'
                : 'rounded-2xl border-2 border-dashed border-border bg-surface-2/50 px-5 py-10 text-center transition hover:border-primary/40 hover:bg-primary-soft/20'
            }
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void processFile(file);
                event.target.value = '';
              }}
              aria-label="Pilih berkas PDF SIBI"
            />
            {extracting ? (
              <div>
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-text">Mengekstrak {fileName}…</p>
                <div className="mx-auto mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-surface-3">
                  <div className="h-full gradient-primary transition-[width] duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-1.5 text-[10px] font-semibold tabular-nums text-muted">{progress}% · menganalisis struktur teks</p>
              </div>
            ) : (
              <>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary-strong dark:text-primary">
                  <UploadCloud className="h-7 w-7" aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm font-bold text-text">Tarik berkas PDF ke sini</p>
                <p className="mt-1 text-xs text-muted">atau pilih berkas dari perangkatmu</p>
                <Button variant="outline" className="mt-4" onClick={() => inputRef.current?.click()}>
                  <FileText className="h-4 w-4" aria-hidden="true" /> Pilih PDF
                </Button>
                <p className="mt-3 text-[10px] text-muted">Didukung buku SIBI digital, modul guru, dan bahan ajar PDF.</p>
              </>
            )}
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-danger/20 bg-danger-soft px-3 py-2.5 text-xs text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="flex-1">{error}</p>
              <button type="button" onClick={() => setError('')} aria-label="Tutup pesan"><X className="h-3.5 w-3.5" /></button>
            </div>
          )}

          {result && (
            <div className="mt-5">
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-success/20 bg-success-soft px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-text">{result.fileName}</p>
                  <p className="text-[10px] text-muted">Ekstraksi selesai · {result.pageCount} halaman · {result.wordCount.toLocaleString('id-ID')} kata</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Ganti berkas
                </Button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {stats?.map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-surface-2 p-3 text-center">
                    <p className="text-lg font-extrabold tabular-nums text-text">{stat.value}</p>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_220px]">
                <Input label="Judul modul" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} />
                <Select label="Kelas tujuan" value={classId} onChange={(event) => setClassId(event.target.value)}>
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </Select>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button loading={saving} onClick={saveModule}>
                  <Save className="h-4 w-4" aria-hidden="true" /> Simpan modul
                </Button>
                <Button variant="outline" onClick={exportJson}>
                  <Download className="h-4 w-4" aria-hidden="true" /> Ekspor JSON
                </Button>
                <Button variant="ghost" onClick={() => setResult(null)}>
                  <X className="h-4 w-4" aria-hidden="true" /> Bersihkan hasil
                </Button>
              </div>

              <div className="mt-5">
                <Tabs
                  items={[
                    { id: 'ringkasan', label: 'Ringkasan', icon: Sparkles },
                    { id: 'bab', label: 'Bab', icon: Layers, count: result.chapters.length },
                    { id: 'glosarium', label: 'Glosarium', icon: BookOpen, count: result.glossary.length },
                    { id: 'flashcard', label: 'Flashcard', icon: Lightbulb, count: result.flashcards.length },
                    { id: 'kuis', label: 'Kuis', icon: FileText, count: result.questions.length },
                  ]}
                  value={tab}
                  onChange={setTab}
                  variant="underline"
                />

                <div className="mt-4">
                  {tab === 'ringkasan' && (
                    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
                      <div className="space-y-3">
                        {result.chapters.slice(0, 4).map((chapter) => (
                          <div key={`${chapter.startPage}-${chapter.title}`} className="rounded-xl border border-border bg-surface-2/60 p-3.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-bold text-text">{chapter.title}</p>
                              <Badge tone="neutral" className="px-1.5 py-0.5 text-[8px]">hlm. {chapter.startPage}–{chapter.endPage}</Badge>
                            </div>
                            <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{chapter.summary}</p>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setShowPreview((value) => !value)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                        >
                          <ChevronDown className={showPreview ? 'h-3.5 w-3.5 rotate-180 transition' : 'h-3.5 w-3.5 transition'} aria-hidden="true" />
                          {showPreview ? 'Sembunyikan teks mentah' : 'Lihat teks mentah'}
                        </button>
                        {showPreview && (
                          <p className="max-h-40 overflow-y-auto rounded-xl border border-border bg-surface p-3 text-[10px] leading-relaxed text-muted">
                            {result.preview}…
                          </p>
                        )}
                      </div>
                      <Card className="border-accent/20 bg-accent-soft/30 p-4">
                        <p className="text-xs font-bold text-text">Kata kunci dominan</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {result.keywords.map((keyword) => (
                            <span key={keyword} className="rounded-full border border-accent/20 bg-surface px-2 py-0.5 text-[10px] font-semibold text-accent-strong">
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-[10px] leading-relaxed text-muted">
                          Kata kunci diambil dari frekuensi istilah bermakna. Tinjau kembali sebelum dipakai di kelas.
                        </p>
                      </Card>
                    </div>
                  )}

                  {tab === 'bab' && (
                    <div className="space-y-2.5">
                      {result.chapters.map((chapter, index) => (
                        <div key={`${chapter.startPage}-${index}`} className="rounded-xl border border-border p-3.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-bold text-text">{chapter.title}</p>
                            <Badge tone="primary" className="px-2 py-0.5 text-[9px]">Halaman {chapter.startPage}–{chapter.endPage}</Badge>
                          </div>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{chapter.summary}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {chapter.keywords.map((keyword) => (
                              <span key={keyword} className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] font-semibold text-muted">{keyword}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === 'glosarium' && (
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {result.glossary.map((item) => (
                        <div key={item.term} className="rounded-xl border border-border p-3.5">
                          <p className="text-xs font-bold text-text">{item.term}</p>
                          <p className="mt-1 text-[10px] leading-relaxed text-muted">{item.definition}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === 'flashcard' && (
                    <div>
                      <p className="mb-3 text-[10px] text-muted">Klik kartu untuk membalik dan melihat definisi.</p>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {result.flashcards.map((card, index) => (
                          <button
                            key={`${card.front}-${index}`}
                            type="button"
                            onClick={() => setFlipped(flipped === index ? null : index)}
                            className={
                              flipped === index
                                ? 'min-h-[150px] rounded-xl border border-primary/30 bg-primary-soft p-4 text-left transition'
                                : 'min-h-[150px] rounded-xl border border-border bg-surface-2 p-4 text-left transition hover:border-primary/35'
                            }
                            aria-pressed={flipped === index}
                          >
                            <p className="text-[9px] font-bold uppercase tracking-wider text-muted">{flipped === index ? 'Definisi' : 'Istilah'}</p>
                            <p className={flipped === index ? 'mt-2 text-[11px] leading-relaxed text-text' : 'mt-2 text-base font-extrabold text-text'}>
                              {flipped === index ? card.back : card.front}
                            </p>
                            <p className="mt-3 text-[9px] font-semibold text-primary">{flipped === index ? 'Klik untuk kembali' : 'Klik untuk membalik'}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {tab === 'kuis' && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 rounded-xl bg-warning-soft px-3 py-2 text-[10px] text-warning">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        Soal dibuat otomatis dari kalimat modul. Tinjau dan sunting sebelum diberikan kepada siswa.
                      </div>
                      {result.questions.map((question, index) => (
                        <div key={index} className="rounded-xl border border-border p-3.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Soal {index + 1}</p>
                          <p className="mt-1 text-xs font-semibold leading-relaxed text-text">{question.question}</p>
                          <div className="mt-2 space-y-1">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className={optionIndex === question.answer ? 'rounded-lg bg-success-soft px-2.5 py-1.5 text-[10px] text-success' : 'rounded-lg bg-surface-2 px-2.5 py-1.5 text-[10px] text-muted'}>
                                <span className="font-bold">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                                {optionIndex === question.answer && <span className="ml-1 font-bold">· Kunci</span>}
                              </div>
                            ))}
                          </div>
                          <p className="mt-2 text-[9px] leading-relaxed text-muted">Pembahasan: {question.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-text">Modul tersimpan</h2>
            <p className="text-[10px] text-muted">Hasil ekstraksi yang siap dipakai di kelas</p>
          </div>
          <Badge tone="neutral">{modules.length}</Badge>
        </div>
        {modules.length === 0 ? (
          <EmptyState
            icon={FileScan}
            title="Belum ada modul"
            description="Unggah PDF buku SIBI untuk membuat modul pertamamu."
          />
        ) : (
          <div className="divide-y divide-border">
            {modules.slice(0, 8).map((module) => (
              <div key={module.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-strong dark:text-primary">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-text">{module.title}</p>
                  <p className="truncate text-[10px] text-muted">
                    {formatDate(module.createdAt)} · {module.chapters.length} bab · {module.questions.length} kuis · {module.flashcards.length} kartu
                  </p>
                </div>
                <Badge tone="success" className="px-2 py-0.5 text-[9px]">Tersimpan</Badge>
                <span className="text-[9px] text-muted">{formatDateTime(module.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
