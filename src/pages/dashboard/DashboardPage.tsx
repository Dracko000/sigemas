import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import type { DashboardData } from '../../types';
import { PageLoader } from '../../components/ui/Misc';
import { StudentDashboard } from './StudentDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { ParentDashboard } from './ParentDashboard';
import { AdminDashboard } from './AdminDashboard';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setError('');
    api<DashboardData>('/api/dashboard')
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat dasbor.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (loading) return <PageLoader label="Menyiapkan dasbor SiGEMAS…" />;

  if (error || !data) {
    return (
      <Card className="p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft text-danger">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-3 text-base font-bold text-text">Dasbor tidak dapat dimuat</h2>
        <p className="mt-1 text-sm text-muted">{error || 'Data tidak tersedia.'}</p>
        <Button className="mt-4" onClick={load}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Coba lagi
        </Button>
      </Card>
    );
  }

  if (data.role === 'student') return <StudentDashboard data={data} />;
  if (data.role === 'teacher') return <TeacherDashboard data={data} />;
  if (data.role === 'parent') return <ParentDashboard data={data} />;
  return <AdminDashboard data={data} />;
}
