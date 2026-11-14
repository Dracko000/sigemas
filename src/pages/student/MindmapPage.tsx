import { useEffect, useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, BookOpen, Info, ChevronLeft } from 'lucide-react';
import { api } from '../../lib/api';
import type { Book } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { PageLoader } from '../../components/ui/Misc';

interface Node {
  id: string;
  label: string;
  type: 'book' | 'chapter' | 'objective';
  x: number;
  y: number;
  content?: string;
}

export function MindmapPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<{ from: string; to: string }[]>([]);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    api<Book[]>('/api/books').then(setBooks).finally(() => setLoading(false));
  }, []);

  const generateMindmap = (book: Book) => {
    const newNodes: Node[] = [];
    const newEdges: { from: string; to: string }[] = [];
    const chapters = book.chapters || [];
    
    // Root Node
    const rootId = 'root';
    newNodes.push({
      id: rootId,
      label: book.title,
      type: 'book',
      x: 0,
      y: 0,
    });

    const chapterSpacing = 180;
    const nodeSpacing = 120;

    chapters.forEach((chapter, i) => {
      const chapterId = `chap-${chapter.id}`;
      const cx = (i + 1) * chapterSpacing - (chapters.length + 1) * chapterSpacing / 2;
      const cy = -150;

      newNodes.push({
        id: chapterId,
        label: chapter.title,
        type: 'chapter',
        x: cx,
        y: cy,
        content: chapter.summary,
      });
      newEdges.push({ from: rootId, to: chapterId });

      // Objectives as leaves
      (chapter.objectives || []).forEach((obj, j) => {
        const objId = `obj-${chapter.id}-${j}`;
        newNodes.push({
          id: objId,
          label: obj,
          type: 'objective',
          x: cx + (j % 2 === 0 ? -60 : 60),
          y: cy - 100,
          content: `Tujuan Pembelajaran: ${obj}`,
        });
        newEdges.push({ from: chapterId, to: objId });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    generateMindmap(book);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const onMouseUp = () => setDragging(false);

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  if (loading) return <PageLoader label="Memuat peta konsep..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Interactive Mindmap</h1>
          <p className="mt-0.5 text-sm text-muted">Visualisasikan hubungan konsep antar bab dalam buku SIBI.</p>
        </div>
      </div>

      {!selectedBook ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {books.map(book => (
            <Card key={book.id} className="p-4 transition hover:border-primary cursor-pointer" onClick={() => handleBookSelect(book)}>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-text">{book.title}</p>
                <p className="text-[10px] text-muted">{book.subject} · {book.chapters?.length ?? 0} Bab</p>
              </div>

              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="relative h-[70vh] overflow-hidden bg-surface-2">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelectedBook(null)} className="bg-white shadow-sm">
              <ChevronLeft className="h-4 w-4" /> Kembali
            </Button>
          </div>

          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="bg-white shadow-sm">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="bg-white shadow-sm">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={resetView} className="bg-white shadow-sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <svg
            ref={svgRef}
            className="h-full w-full cursor-grab active:cursor-grabbing"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <g transform={`translate(${400 + offset.x}, ${300 + offset.y}) scale(${zoom})`}>
              {/* Edges */}
              {edges.map((edge, i) => {
                const from = nodes.find(n => n.id === edge.from);
                const to = nodes.find(n => n.id === edge.to);
                if (!from || !to) return null;
                return (
                  <line 
                    key={i} 
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                    stroke="#cbd5e1" strokeWidth="2" 
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map(node => (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => { e.stopPropagation(); setSelectedNode(node); }}
                  className="cursor-pointer"
                >
                  <rect 
                    x="-60" y="-20" width="120" height="40" rx="20"
                    fill={node.type === 'book' ? '#1E88E5' : node.type === 'chapter' ? '#FF9800' : '#FFFFFF'}
                    stroke={node.type === 'objective' ? '#cbd5e1' : 'none'}
                    strokeWidth="2"
                    className="transition-all hover:brightness-110"
                  />
                  <text 
                    textAnchor="middle" 
                    dy=".3em" 
                    className={`text-[12px] font-bold ${node.type === 'objective' ? 'fill-text' : 'fill-white'}`}
                  >
                    {node.label.length > 15 ? node.label.substring(0, 12) + '...' : node.label}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </Card>
      )}

      <Modal
        open={Boolean(selectedNode)}
        onClose={() => setSelectedNode(null)}
        title={selectedNode?.label || 'Detail Konsep'}
        description={selectedNode?.type === 'book' ? 'Buku Utama' : selectedNode?.type === 'chapter' ? 'Bab Materi' : 'Tujuan Pembelajaran'}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm leading-relaxed text-text">
              {selectedNode?.content || 'Tidak ada ringkasan detail untuk node ini.'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
