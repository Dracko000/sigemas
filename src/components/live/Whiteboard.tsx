import { useCallback, useEffect, useRef, useState } from 'react';
import { Eraser, PenTool, Trash2 } from 'lucide-react';
import type { LiveStroke } from '../../lib/socket';
import { cx } from '../../lib/format';

const COLORS = ['#0D47A1', '#1E88E5', '#FF9800', '#16A34A', '#DC2626', '#111827'];
const WIDTHS = [2, 4, 8];

export function Whiteboard({
  strokes,
  onStroke,
  canClear,
  onClear,
}: {
  strokes: LiveStroke[];
  onStroke: (stroke: LiveStroke) => void;
  canClear: boolean;
  onClear: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const currentRef = useRef<LiveStroke | null>(null);
  const strokesRef = useRef<LiveStroke[]>(strokes);
  const [color, setColor] = useState(COLORS[0]);
  const [width, setWidth] = useState(4);
  const [eraser, setEraser] = useState(false);

  strokesRef.current = strokes;

  const drawStroke = useCallback(
    (ctx: CanvasRenderingContext2D, stroke: LiveStroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0] * ctx.canvas.clientWidth, stroke.points[1] * ctx.canvas.clientHeight);
      for (let index = 2; index < stroke.points.length; index += 2) {
        ctx.lineTo(
          stroke.points[index] * ctx.canvas.clientWidth,
          stroke.points[index + 1] * ctx.canvas.clientHeight
        );
      }
      ctx.stroke();
    },
    []
  );

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (const stroke of strokesRef.current) drawStroke(ctx, stroke);
    if (currentRef.current) drawStroke(ctx, currentRef.current);
  }, [drawStroke]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [redraw]);

  useEffect(() => {
    redraw();
  }, [strokes, redraw]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = getPoint(event);
    drawingRef.current = true;
    currentRef.current = {
      id: `local-${Date.now()}`,
      points: [point.x, point.y],
      color: eraser ? '#ffffff' : color,
      width: eraser ? width * 3.5 : width,
    };
    redraw();
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || !currentRef.current) return;
    const point = getPoint(event);
    currentRef.current.points.push(point.x, point.y);
    redraw();
  };

  const end = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const stroke = currentRef.current;
    currentRef.current = null;
    if (stroke && stroke.points.length >= 4) {
      const rounded = {
        ...stroke,
        points: stroke.points.map((point) => Math.round(point * 10000) / 10000),
      };
      onStroke(rounded);
    }
    redraw();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-text">
          <PenTool className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Papan tulis pribadi
        </span>
        <span className="hidden items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[9px] font-semibold text-primary-strong sm:inline-flex dark:text-primary">
          Hanya kamu
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-1" role="group" aria-label="Warna pena">
            {COLORS.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => {
                  setColor(swatch);
                  setEraser(false);
                }}
                className={cx(
                  'h-5 w-5 rounded-md transition',
                  color === swatch && !eraser ? 'ring-2 ring-primary ring-offset-1 ring-offset-surface' : 'hover:scale-110'
                )}
                style={{ background: swatch }}
                aria-label={`Warna ${swatch}`}
                aria-pressed={color === swatch && !eraser}
              />
            ))}
          </div>
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface-2 p-1" role="group" aria-label="Ketebalan pena">
            {WIDTHS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setWidth(value)}
                className={cx(
                  'grid h-5 w-6 place-items-center rounded transition',
                  width === value ? 'bg-surface text-primary-strong shadow-sm dark:text-primary' : 'text-muted'
                )}
                aria-label={`Ketebalan ${value} piksel`}
                aria-pressed={width === value}
              >
                <span className="rounded-full bg-current" style={{ width: Math.min(value + 3, 12), height: Math.min(value + 3, 12) }} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setEraser((value) => !value)}
            className={cx(
              'grid h-8 w-8 place-items-center rounded-lg border transition',
              eraser ? 'border-accent/40 bg-accent-soft text-accent-strong' : 'border-border bg-surface text-muted hover:bg-surface-2'
            )}
            aria-label="Penghapus"
            aria-pressed={eraser}
          >
            <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          {canClear && (
            <button
              type="button"
              onClick={onClear}
              className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:border-danger/30 hover:bg-danger-soft hover:text-danger"
              aria-label="Bersihkan papan tulis"
              title="Bersihkan papan"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <div ref={wrapRef} className="relative min-h-0 flex-1 bg-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.55]" style={{ backgroundImage: 'radial-gradient(#dbe6f2 1px, transparent 1px)', backgroundSize: '22px 22px' }} aria-hidden="true" />
        <canvas
          ref={canvasRef}
          className="relative h-full w-full touch-none cursor-crosshair"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
          aria-label="Kanvas papan tulis pribadi. Gunakan pointer untuk menggambar."
          role="img"
        />
        {strokes.length === 0 && !currentRef.current && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="rounded-xl bg-white/80 px-4 py-2 text-center text-xs text-slate-500">
              Tulis atau gambar catatanmu di sini. Coretan ini hanya terlihat olehmu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
