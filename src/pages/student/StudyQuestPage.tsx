import { useEffect, useState } from 'react';
import { Trophy, Star, Zap, Target, Award, BookOpen, Brain } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';

interface GamificationData {
  xp: number;
  level: number;
  badges: string[];
  dailyQuests: { id: string; title: string; xp: number; completed: boolean }[];
}

export function StudyQuestPage() {
  const toast = useToast();
  const [data, setData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api<GamificationData>('/api/gamification');
      setData(res);
    } catch (err) {
      toast.error('Gagal memuat Quest', err instanceof Error ? err.message : undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const claimXP = async (amount: number, reason: string) => {
    try {
      const res = await api<{ xp: number; level: number }>('/api/gamification/add-xp', {
        method: 'POST',
        body: { amount, reason },
      });
      setData((prev) => prev ? { ...prev, xp: res.xp, level: res.level } : null);
      toast.success('XP Ditambahkan!', `+${amount} XP untuk ${reason}`);
    } catch (err) {
      toast.error('Gagal klaim XP');
    }
  };

  if (loading) return <div className="p-4 text-center text-sm text-muted">Memuat Quest...</div>;

  const nextLevelXp = Math.pow(data?.level || 1, 2) * 100;
  const currentXp = data?.xp || 0;
  const progress = (currentXp / nextLevelXp) * 100;

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden bg-[linear-gradient(135deg,#1E88E5,#0D47A1)] p-6 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-primary shadow-lg">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Level Pelajar</p>
              <h2 className="text-2xl font-black">Level {data?.level || 1}</h2>
            </div>
          </div>
          <div className="flex-1 max-w-xs space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span>Progres Level</span>
              <span>{Math.round(currentXp)} / {nextLevelXp} XP</span>
            </div>
            <Progress value={progress} className="h-3 bg-white/20" tone="success" />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold text-text">Quest Harian</h3>
            </div>
            <Badge tone="accent">Daily</Badge>
          </div>
          <div className="space-y-3">
            {[
              { id: 'q1', title: 'Baca 1 Bab Buku SIBI', xp: 50, icon: <BookOpen className="h-4 w-4" /> },
              { id: 'q2', title: 'Selesaikan 1 Kuis', xp: 100, icon: <Trophy className="h-4 w-4" /> },
              { id: 'q3', title: 'Latihan Flashcards (10 Kartu)', xp: 75, icon: <Brain className="h-4 w-4" /> },
              { id: 'q4', title: 'Hadir di Kelas Live', xp: 150, icon: <Zap className="h-4 w-4" /> },
            ].map((quest) => (
              <div key={quest.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 transition hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-muted">
                    {quest.icon}
                  </span>
                  <span className="text-xs font-medium text-text">{quest.title}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 px-2 text-[10px] font-bold text-primary"
                  onClick={() => claimXP(quest.xp, quest.title)}
                >
                  Klaim {quest.xp} XP
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-bold text-text">Koleksi Badge</h3>
            </div>
            <Badge tone="primary">{data?.badges?.length || 0} Terkumpul</Badge>
          </div>
          {data?.badges && data.badges.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {data.badges.map((badge) => (
                <div key={badge} className="group relative flex flex-col items-center gap-1">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 border-2 border-accent text-accent shadow-sm transition group-hover:scale-110">
                    <Star className="h-6 w-6 fill-current" />
                  </div>
                  <span className="text-[9px] font-bold text-muted">{badge}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-2 rounded-full bg-surface-2 p-3 text-muted">
                <Trophy className="h-6 w-6" />
              </div>
              <p className="text-xs font-medium text-muted">Belum ada badge. Selesaikan misi untuk mendapatkannya!</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
