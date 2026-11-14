import { useEffect, useState } from 'react';
import {
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trophy,
  X,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import type { Book, Flashcard } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, PageLoader } from '../../components/ui/Misc';
import { Progress } from '../../components/ui/Progress';

export function FlashcardPage() {
  const toast = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const rows = await api<Book[]>('/api/books');
      setBooks(rows);
    } catch (err) {
      toast.error('Gagal memuat buku', err instanceof Error ? err.message : undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const startStudy = async (book: Book) => {
    setSelectedBook(book);
    setReviewing(true);
    setLoading(true);
    try {
      const rows = await api<Flashcard[]>(`/api/flashcards?bookId=${book.id}`);
      // Mock cards if none exist (AI generation logic)
      const chapters = book.chapters || [];
      const finalCards = rows.length > 0 ? rows : chapters.map((ch, i) => ({
        id: `card-${i}`,
        bookId: book.id,
        chapterId: ch.id,
        question: `Apa konsep utama dari ${ch.title}?`,
        answer: ch.summary,
        difficulty: 'medium' as const,
        successCount: 0,
      }));
      setCards(finalCards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      toast.error('Gagal memuat kartu', err instanceof Error ? err.message : undefined);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (difficulty: 'easy' | 'medium' | 'hard') => {
    const card = cards[currentIndex];
    try {
      await api('/api/flashcards/review', {
        method: 'POST',
        body: { id: card.id, difficulty },
      });
    } catch (err) {
      // Ignore mock errors
    }
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      toast.success('Sesi selesai!', `Kamu telah mengulang ${cards.length} kartu.`);
      setReviewing(false);
      setSelectedBook(null);
    }
  };

  if (loading) return <PageLoader label="Memproses materi..." />;

  if (!reviewing) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Flashcards AI</h1>
            <p className="mt-0.5 text-sm text-muted">Ulangi materi penting dengan teknik Spaced Repetition.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold text-primary-strong">
              <Brain className="h-3 w-3" /> Adaptive Learning
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {books?.map((book) => (
            <Card key={book.id} className="group overflow-hidden transition hover:border-primary/40">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-text">{book.title}</h3>
                    <p className="mt-0.5 truncate text-[11px] text-muted">{book.subject} · Kelas {book.grade}</p>
                  </div>
                  <span className="rounded-lg bg-surface-2 px-2 py-1 text-[9px] font-bold text-muted">
                    {book.chapters?.length ?? 0} Bab
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Button 
                    size="sm" 
                    className="w-full" 
                    onClick={() => startStudy(book)}
                  >
                    Mulai Belajar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  const card = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10">
      <div className="w-full max-w-xl space-y-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-muted">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surface-2 px-2 py-0.5">{currentIndex + 1} / {cards.length}</span>
            <span className="truncate max-w-[150px]">{selectedBook?.title}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setReviewing(false)}>
            <X className="h-3 w-3" /> Keluar
          </Button>
        </div>
        <Progress value={progress} size="sm" />
      </div>

      <div 
        className={`relative h-80 w-full max-w-xl cursor-pointer transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div className="absolute inset-0 grid place-items-center rounded-3xl border-2 border-primary-soft bg-surface p-8 text-center shadow-pop [backface-visibility:hidden]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold text-primary-strong">
              Pertanyaan
            </span>
            <p className="text-lg font-bold leading-relaxed text-text">{card.question}</p>
            <p className="text-xs text-muted italic">Klik untuk melihat jawaban</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 grid place-items-center rounded-3xl border-2 border-accent-soft bg-surface p-8 text-center shadow-pop [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold text-accent-strong">
              Jawaban
            </span>
            <p className="text-md leading-relaxed text-text">{card.answer}</p>
            <p className="text-xs text-muted italic">Pilih tingkat kemudahan</p>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="flex items-center gap-3 animate-pop">
          <Button 
            variant="outline" 
            className="rounded-2xl px-6 py-3 text-sm font-bold text-danger hover:bg-danger-soft"
            onClick={(e) => { e.stopPropagation(); handleReview('hard'); }}
          >
            Sulit
          </Button>
          <Button 
            variant="outline" 
            className="rounded-2xl px-6 py-3 text-sm font-bold text-primary hover:bg-primary-soft"
            onClick={(e) => { e.stopPropagation(); handleReview('medium'); }}
          >
            Sedang
          </Button>
          <Button 
            variant="outline" 
            className="rounded-2xl px-6 py-3 text-sm font-bold text-success hover:bg-success-soft"
            onClick={(e) => { e.stopPropagation(); handleReview('easy'); }}
          >
            Mudah
          </Button>
        </div>
      )}
    </div>
  );
}
