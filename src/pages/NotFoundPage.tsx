import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { roleLabel } from '../lib/format';
import { SigemasMascot } from '../components/SigemasMascot';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[72vh] items-center justify-center overflow-hidden py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[18%] top-[22%] h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl text-center">
        <div className="mx-auto flex justify-center">
          <SigemasMascot size={124} decorative />
        </div>

        <p className="mt-2 text-[76px] font-black leading-none tracking-tighter text-primary/15 sm:text-[96px]" aria-hidden="true">
          404
        </p>
        <h1 className="-mt-3 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Tautan yang kamu buka mungkin sudah dipindahkan atau tidak tersedia untuk peran{' '}
          <span className="font-semibold text-text">{user ? roleLabel[user.role] : 'pengunjung'}</span>.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {user ? (
            <Link to="/dashboard">
              <Button>
                <Home className="h-4 w-4" aria-hidden="true" /> Kembali ke beranda
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button>
                <Home className="h-4 w-4" aria-hidden="true" /> Masuk ke SiGEMAS
              </Button>
            </Link>
          )}
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Halaman sebelumnya
          </Button>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-[11px] text-muted shadow-sm">
          <Compass className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Coba gunakan menu navigasi atau pencarian <span className="rounded border border-border bg-surface-2 px-1 py-0.5 text-[9px] font-bold">Ctrl K</span>
        </div>
      </div>
    </div>
  );
}
