import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SiGEMAS runtime error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-center shadow-card">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft text-danger">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-3 text-lg font-extrabold text-text">Terjadi kendala teknis</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Halaman gagal ditampilkan. Muat ulang untuk melanjutkan sesi belajar.
          </p>
          {this.state.message && (
            <p className="mt-3 break-words rounded-lg bg-surface-2 px-3 py-2 text-left text-[11px] text-muted">
              {this.state.message}
            </p>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Muat ulang
          </button>
        </div>
      </div>
    );
  }
}
