import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  X, Plus, Copy, Trash2, Undo2, Redo2, Type, Image as ImageIcon, Square, Circle, Triangle, Diamond,
  ArrowRight, Star, Minus, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered,
  ArrowUpToLine, ArrowDownToLine, Play, Download, LayoutTemplate, ChevronDown, RefreshCw, Link2,
  AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, Presentation, FileDown, Send, RectangleHorizontal,
} from 'lucide-react';
import { CanvasElement, CanvasFrame } from '../../types/miro';
import { Deck, Slide, SlideElement, SlideShape, SlideTransition, SLIDE_H, SLIDE_W, TextStyle, uid } from './types';
import { applyTheme, bodyStyle, FONTS, getTheme, LayoutId, LAYOUTS, newSlide, THEMES } from './themes';
import { ElementView, SlideRenderer, textCss } from './SlideRenderer';
import { deckFromBoard, loadDeck } from './fromBoard';
import { SlideShow } from './SlideShow';

interface SlideEditorProps {
  isOpen: boolean;
  onClose: () => void;
  boardTitle: string;
  frames: CanvasFrame[];
  elements: CanvasElement[];
  savedDeck?: unknown;
  onSaveDeck: (deck: Deck) => void;
  onExportSlidesToBoard: (newFrames: CanvasFrame[], newElements: CanvasElement[]) => void;
}

type RibbonTab = 'inicio' | 'inserir' | 'design' | 'transicoes' | 'apresentar';
type Handle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const SHAPES: { id: SlideShape; label: string; icon: React.ReactNode }[] = [
  { id: 'rect', label: 'Retângulo', icon: <Square className="w-4 h-4" /> },
  { id: 'rounded', label: 'Retângulo arredondado', icon: <RectangleHorizontal className="w-4 h-4" /> },
  { id: 'ellipse', label: 'Elipse', icon: <Circle className="w-4 h-4" /> },
  { id: 'triangle', label: 'Triângulo', icon: <Triangle className="w-4 h-4" /> },
  { id: 'diamond', label: 'Losango', icon: <Diamond className="w-4 h-4" /> },
  { id: 'arrow', label: 'Seta', icon: <ArrowRight className="w-4 h-4" /> },
  { id: 'star', label: 'Estrela', icon: <Star className="w-4 h-4" /> },
  { id: 'line', label: 'Linha', icon: <Minus className="w-4 h-4" /> },
];

const COLOR_PRESETS = ['#000000', '#ffffff', '#0f172a', '#334155', '#94a3b8', '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#4f46e5', '#8b5cf6', '#ec4899'];
const BG_PRESETS = ['#ffffff', '#f8fafc', '#0f172a', '#1e1b4b', '#fef3c7', '#ecfdf5', '#eff6ff', 'linear-gradient(135deg, #0b1533 0%, #1e1b4b 55%, #3b0764 100%)', 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)', 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)'];

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

// Downscale big images so the deck stays small enough to save with the board
async function fileToCompressedDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const max = 1600;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  if (scale === 1 && file.size < 400_000) return dataUrl;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return file.type === 'image/png' && file.size < 1_000_000 ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.85);
}

const RibbonButton: React.FC<{
  onClick: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
  big?: boolean;
  children: React.ReactNode;
  label?: string;
}> = ({ onClick, title, active, disabled, big, children, label }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`${big ? 'flex-col px-2.5 py-1.5 min-w-[58px] gap-1 text-[11px]' : 'p-1.5'} flex items-center justify-center rounded-md transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
      active ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
    }`}
  >
    {children}
    {label && <span className="font-medium leading-none whitespace-nowrap">{label}</span>}
  </button>
);

const Group: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col items-center justify-between px-2 border-r border-slate-200 last:border-r-0 shrink-0">
    <div className="flex items-center gap-0.5 flex-1">{children}</div>
    <span className="text-[10px] text-slate-400 mt-0.5">{label}</span>
  </div>
);

const ColorPicker: React.FC<{ value?: string; onChange: (c: string) => void; title: string; icon: React.ReactNode; allowNone?: boolean }> = ({ value, onChange, title, icon, allowNone }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        title={title}
        className="p-1.5 rounded-md hover:bg-slate-100 flex flex-col items-center cursor-pointer text-slate-700"
      >
        {icon}
        <span className="block w-4 h-1 mt-0.5 rounded-sm border border-slate-300" style={{ background: value && value !== 'transparent' ? value : 'repeating-linear-gradient(45deg,#fff,#fff 2px,#e2e8f0 2px,#e2e8f0 4px)' }} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 top-full left-0 mt-1 p-2 bg-white rounded-xl shadow-xl border border-slate-200 w-[188px]">
            <div className="grid grid-cols-7 gap-1">
              {COLOR_PRESETS.map((c) => (
                <button key={c} type="button" onClick={() => { onChange(c); setOpen(false); }} className="w-5 h-5 rounded border border-slate-200 cursor-pointer" style={{ background: c }} title={c} />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="color" value={value && value.startsWith('#') && value.length === 7 ? value : '#000000'} onChange={(e) => onChange(e.target.value)} className="w-8 h-6 cursor-pointer" />
              <span className="text-[11px] text-slate-500">Personalizada</span>
            </div>
            {allowNone && (
              <button type="button" onClick={() => { onChange('transparent'); setOpen(false); }} className="mt-2 w-full text-[11px] text-slate-600 hover:bg-slate-100 rounded py-1 cursor-pointer">
                Sem cor
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const SlideEditor: React.FC<SlideEditorProps> = ({ isOpen, onClose, boardTitle, frames, elements, savedDeck, onSaveDeck, onExportSlidesToBoard }) => {
  const [deck, setDeck] = useState<Deck>(() => loadDeck(savedDeck) ?? deckFromBoard(boardTitle, frames, elements));
  const [current, setCurrent] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<RibbonTab>('inicio');
  const [layoutMenu, setLayoutMenu] = useState(false);
  const [showFrom, setShowFrom] = useState<number | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [dragThumb, setDragThumb] = useState<number | null>(null);

  const history = useRef<{ past: Deck[]; future: Deck[] }>({ past: [], future: [] });
  const clipboard = useRef<SlideElement | null>(null);
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stageW, setStageW] = useState(900);

  const slide = deck.slides[Math.min(current, deck.slides.length - 1)];
  const selected = slide?.elements.find((e) => e.id === selectedId) ?? null;
  const theme = getTheme(deck.themeId);
  const scale = stageW / SLIDE_W;

  // ── Persistence: save every change to the board ───────────────────────────
  const firstSave = useRef(true);
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false;
      if (!savedDeck) onSaveDeck(deck); // first generated draft
      return;
    }
    onSaveDeck(deck);
  }, [deck]);

  // ── Stage size ────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = stageWrapRef.current;
    if (!el || !isOpen) return;
    const fit = () => {
      const w = el.clientWidth - 48;
      const h = el.clientHeight - 48;
      setStageW(Math.max(320, Math.min(w, (h * SLIDE_W) / SLIDE_H)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // ── Deck mutations (with undo history) ────────────────────────────────────
  const commit = useCallback((next: Deck | ((d: Deck) => Deck)) => {
    setDeck((prev) => {
      const value = typeof next === 'function' ? next(prev) : next;
      history.current.past.push(prev);
      if (history.current.past.length > 80) history.current.past.shift();
      history.current.future = [];
      return value;
    });
  }, []);

  const updateSlide = (fn: (s: Slide) => Slide, record = true) => {
    const apply = (d: Deck) => ({ ...d, slides: d.slides.map((s, i) => (i === current ? fn(s) : s)) });
    record ? commit(apply) : setDeck(apply);
  };

  const updateElement = (id: string, patch: Partial<SlideElement> | ((el: SlideElement) => Partial<SlideElement>), record = true) =>
    updateSlide((s) => ({ ...s, elements: s.elements.map((el) => (el.id === id ? { ...el, ...(typeof patch === 'function' ? patch(el) : patch) } : el)) }), record);

  const updateTextStyle = (patch: Partial<TextStyle>) => {
    if (!selected) return;
    updateElement(selected.id, (el) => ({ textStyle: { ...(el.textStyle ?? bodyStyle(theme)), ...patch } }));
  };

  const undo = () => {
    const prev = history.current.past.pop();
    if (!prev) return;
    history.current.future.push(deck);
    setDeck(prev);
    setSelectedId(null);
  };
  const redo = () => {
    const next = history.current.future.pop();
    if (!next) return;
    history.current.past.push(deck);
    setDeck(next);
    setSelectedId(null);
  };

  const addElement = (el: Omit<SlideElement, 'id'>) => {
    const withId = { ...el, id: uid() } as SlideElement;
    updateSlide((s) => ({ ...s, elements: [...s.elements, withId] }));
    setSelectedId(withId.id);
    return withId.id;
  };

  const deleteSelected = () => {
    if (!selected) return;
    updateSlide((s) => ({ ...s, elements: s.elements.filter((e) => e.id !== selected.id) }));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    addElement({ ...clone(selected), x: selected.x + 24, y: selected.y + 24 });
  };

  const reorder = (dir: 'front' | 'back') => {
    if (!selected) return;
    updateSlide((s) => {
      const rest = s.elements.filter((e) => e.id !== selected.id);
      return { ...s, elements: dir === 'front' ? [...rest, selected] : [selected, ...rest] };
    });
  };

  // ── Slides ────────────────────────────────────────────────────────────────
  const addSlide = (layout: LayoutId) => {
    const s = newSlide(layout, theme);
    commit((d) => {
      const slides = [...d.slides];
      slides.splice(current + 1, 0, s);
      return { ...d, slides };
    });
    setCurrent(current + 1);
    setSelectedId(null);
    setLayoutMenu(false);
  };

  const duplicateSlide = (idx: number) => {
    commit((d) => {
      const copy = clone(d.slides[idx]);
      copy.id = uid('slide');
      copy.elements = copy.elements.map((e) => ({ ...e, id: uid() }));
      const slides = [...d.slides];
      slides.splice(idx + 1, 0, copy);
      return { ...d, slides };
    });
    setCurrent(idx + 1);
  };

  const deleteSlide = (idx: number) => {
    if (deck.slides.length <= 1) return;
    commit((d) => ({ ...d, slides: d.slides.filter((_, i) => i !== idx) }));
    setCurrent((c) => Math.max(0, c >= idx ? c - 1 : c));
    setSelectedId(null);
  };

  const moveSlide = (from: number, to: number) => {
    if (from === to) return;
    commit((d) => {
      const slides = [...d.slides];
      const [s] = slides.splice(from, 1);
      slides.splice(to, 0, s);
      return { ...d, slides };
    });
    setCurrent(to);
  };

  const regenerateFromBoard = () => {
    if (!window.confirm('Gerar uma nova apresentação a partir do quadro? A apresentação atual será substituída (dá para desfazer com Ctrl+Z).')) return;
    commit(deckFromBoard(boardTitle, frames, elements, deck.themeId));
    setCurrent(0);
    setSelectedId(null);
    flash('Apresentação gerada a partir do quadro');
  };

  // ── Insert ────────────────────────────────────────────────────────────────
  const insertTextBox = () =>
    addElement({ type: 'text', x: 340, y: 300, w: 600, h: 100, text: 'Digite seu texto', textStyle: bodyStyle(theme, 32) });

  const insertShape = (shape: SlideShape) =>
    addElement({
      type: 'shape',
      shape,
      x: 490,
      y: shape === 'line' ? 355 : 210,
      w: 300,
      h: shape === 'line' ? 10 : 300,
      fill: shape === 'line' ? undefined : theme.accent,
      stroke: shape === 'line' ? theme.accent : undefined,
      strokeWidth: shape === 'line' ? 4 : 0,
      text: '',
      textStyle: { ...bodyStyle(theme, 28, 'none', 'center'), color: '#ffffff', valign: 'middle' },
    });

  const insertImage = (src: string) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height || 1.5;
      const w = Math.min(800, ratio >= 1 ? 640 : 420 * ratio);
      const h = w / ratio;
      addElement({ type: 'image', src, x: (SLIDE_W - w) / 2, y: (SLIDE_H - h) / 2, w, h });
    };
    img.onerror = () => flash('Não foi possível carregar a imagem');
    img.src = src;
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      insertImage(await fileToCompressedDataUrl(file));
    } catch {
      flash('Arquivo de imagem inválido');
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const exportPptx = async () => {
    setBusy('Gerando arquivo PowerPoint…');
    try {
      const { exportDeckToPptx } = await import('./exportPptx');
      await exportDeckToPptx(deck, boardTitle || 'Apresentação');
      flash('Arquivo .pptx baixado');
    } catch (err) {
      console.error(err);
      flash('Erro ao gerar o PowerPoint');
    } finally {
      setBusy(null);
    }
  };

  const exportPdf = async () => {
    setBusy('Gerando PDF…');
    try {
      const [{ toJpeg, getFontEmbedCSS }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')]);
      await new Promise((r) => setTimeout(r, 60)); // let the off-screen slides render
      const host = document.getElementById('slide-pdf-render-host');
      if (!host) return;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [SLIDE_W, SLIDE_H] });
      const nodes = Array.from(host.children) as HTMLElement[];
      // Fonts are fetched and embedded once, then reused for every slide
      const fontEmbedCSS = await getFontEmbedCSS(host).catch(() => '');
      for (let i = 0; i < nodes.length; i++) {
        setBusy(`Gerando PDF… slide ${i + 1} de ${nodes.length}`);
        const img = await toJpeg(nodes[i], { quality: 0.92, pixelRatio: 1.5, width: SLIDE_W, height: SLIDE_H, fontEmbedCSS });
        if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], 'landscape');
        pdf.addImage(img, 'JPEG', 0, 0, SLIDE_W, SLIDE_H);
      }
      pdf.save(`${(boardTitle || 'apresentacao').replace(/[\\/:*?"<>|]+/g, '-')}.pdf`);
      flash('PDF baixado');
    } catch (err) {
      console.error(err);
      flash('Erro ao gerar o PDF');
    } finally {
      setBusy(null);
    }
  };

  const sendToBoard = () => {
    const startX = Math.max(0, ...frames.map((f) => f.x + f.width), ...elements.map((e) => e.x + e.width)) + 200;
    const k = 0.5; // slides land on the board at half size
    const gap = 80;
    const newFrames: CanvasFrame[] = [];
    const newEls: CanvasElement[] = [];
    deck.slides.forEach((s, i) => {
      const fx = startX + i * (SLIDE_W * k + gap);
      const fy = 0;
      const frameId = uid('frame');
      newFrames.push({ id: frameId, title: `Slide ${i + 1}`, x: fx, y: fy, width: SLIDE_W * k, height: SLIDE_H * k, backgroundColor: s.background.startsWith('#') ? s.background : '#ffffff', zIndex: 1 });
      s.elements.forEach((el, j) => {
        const base = { id: uid('el'), x: fx + el.x * k, y: fy + el.y * k, width: el.w * k, height: el.h * k, zIndex: 10 + j, createdAt: Date.now(), frameId };
        if (el.type === 'image' && el.src) newEls.push({ ...base, type: 'image', content: '', style: { imageUrl: el.src } });
        else if (el.text && el.textStyle)
          newEls.push({
            ...base,
            type: el.type === 'shape' ? 'shape' : 'text',
            content: el.text,
            style: {
              color: el.textStyle.color,
              fontSize: Math.round(el.textStyle.fontSize * k),
              fontWeight: el.textStyle.bold ? 'bold' : 'normal',
              textAlign: el.textStyle.align,
              fontFamily: el.textStyle.fontFamily,
              backgroundColor: el.type === 'shape' ? el.fill : undefined,
              shapeType: el.type === 'shape' ? (el.shape === 'ellipse' ? 'circle' : el.shape === 'rounded' ? 'rounded' : 'rectangle') : undefined,
            },
          });
        else if (el.type === 'shape') newEls.push({ ...base, type: 'shape', content: '', style: { backgroundColor: el.fill, shapeType: el.shape === 'ellipse' ? 'circle' : 'rectangle' } });
      });
    });
    onExportSlidesToBoard(newFrames, newEls);
    flash(`${deck.slides.length} slides enviados ao quadro`);
  };

  // ── Pointer: drag & resize ────────────────────────────────────────────────
  const dragRef = useRef<{ id: string; mode: 'move' | Handle; sx: number; sy: number; orig: SlideElement; moved: boolean } | null>(null);

  const startDrag = (e: React.PointerEvent, el: SlideElement, mode: 'move' | Handle) => {
    e.stopPropagation();
    if (editingId === el.id) return;
    setSelectedId(el.id);
    dragRef.current = { id: el.id, mode, sx: e.clientX, sy: e.clientY, orig: clone(el), moved: false };
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = (e.clientX - d.sx) / scale;
      const dy = (e.clientY - d.sy) / scale;
      if (!d.moved && Math.abs(dx) < 2 && Math.abs(dy) < 2) return;
      if (!d.moved) {
        // record the state before the gesture once, for undo
        history.current.past.push(deck);
        history.current.future = [];
        d.moved = true;
      }
      const o = d.orig;
      let { x, y, w, h } = o;
      if (d.mode === 'move') {
        x = Math.round(o.x + dx);
        y = Math.round(o.y + dy);
        // snap to slide center lines
        if (Math.abs(x + w / 2 - SLIDE_W / 2) < 8) x = Math.round(SLIDE_W / 2 - w / 2);
        if (Math.abs(y + h / 2 - SLIDE_H / 2) < 8) y = Math.round(SLIDE_H / 2 - h / 2);
      } else {
        const m = d.mode;
        if (m.includes('e')) w = Math.max(20, o.w + dx);
        if (m.includes('s')) h = Math.max(o.shape === 'line' ? 4 : 20, o.h + dy);
        if (m.includes('w')) { w = Math.max(20, o.w - dx); x = o.x + o.w - w; }
        if (m.includes('n')) { h = Math.max(20, o.h - dy); y = o.y + o.h - h; }
        // keep proportions for images on corner handles (or with Shift)
        if ((o.type === 'image' && m.length === 2) || e.shiftKey) {
          const ratio = o.w / o.h;
          if (Math.abs(w - o.w) / o.w > Math.abs(h - o.h) / o.h) h = w / ratio;
          else w = h * ratio;
          if (m.includes('w')) x = o.x + o.w - w;
          if (m.includes('n')) y = o.y + o.h - h;
        }
        x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
      }
      updateElement(d.id, { x, y, w, h }, false);
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [scale, deck, current]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || showFrom !== null) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.isContentEditable;
      const mod = e.metaKey || e.ctrlKey;
      if (e.key === 'F5') { e.preventDefault(); setShowFrom(e.shiftKey ? current : 0); return; }
      if (typing) return;
      if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
      if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
      if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); selected ? duplicateSelected() : duplicateSlide(current); return; }
      if (mod && e.key.toLowerCase() === 'c' && selected) { clipboard.current = clone(selected); return; }
      if (mod && e.key.toLowerCase() === 'v' && clipboard.current) { e.preventDefault(); addElement({ ...clone(clipboard.current), x: clipboard.current.x + 24, y: clipboard.current.y + 24 }); return; }
      if (mod && e.key.toLowerCase() === 'm') { e.preventDefault(); addSlide('title-content'); return; }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) { e.preventDefault(); deleteSelected(); return; }
      if (e.key === 'Escape') { selected ? setSelectedId(null) : onClose(); return; }
      if (e.key === 'Enter' && selected && (selected.type === 'text' || selected.type === 'shape')) { e.preventDefault(); setEditingId(selected.id); return; }
      if (selected && e.key.startsWith('Arrow')) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
        updateElement(selected.id, (el) => ({ x: el.x + dx, y: el.y + dy }));
        return;
      }
      if (!selected && (e.key === 'PageDown' || e.key === 'ArrowDown')) setCurrent((c) => Math.min(deck.slides.length - 1, c + 1));
      if (!selected && (e.key === 'PageUp' || e.key === 'ArrowUp')) setCurrent((c) => Math.max(0, c - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const ts = selected?.textStyle;
  const hasText = !!selected && (selected.type === 'text' || selected.type === 'shape');

  const thumbs = useMemo(() => deck.slides, [deck.slides]);

  if (!isOpen) return null;

  if (showFrom !== null) {
    return <SlideShow deck={deck} startIndex={showFrom} onExit={(idx) => { setShowFrom(null); setCurrent(idx); }} />;
  }

  // ── Ribbon content ────────────────────────────────────────────────────────
  const ribbon = (
    <div className="flex items-stretch h-[86px] px-1 py-1.5 overflow-x-auto">
      {tab === 'inicio' && (
        <>
          <Group label="Slides">
            <div className="relative">
              <RibbonButton big onClick={() => setLayoutMenu((o) => !o)} title="Novo slide (Ctrl+M)" label="Novo slide">
                <span className="flex items-center"><Plus className="w-5 h-5" /><ChevronDown className="w-3 h-3" /></span>
              </RibbonButton>
              {layoutMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLayoutMenu(false)} />
                  <div className="absolute z-50 top-full left-0 mt-1 p-2 bg-white rounded-xl shadow-xl border border-slate-200 w-[340px] grid grid-cols-2 gap-2">
                    {LAYOUTS.map((l) => (
                      <button key={l.id} type="button" onClick={() => addSlide(l.id)} className="text-left rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 p-1.5 cursor-pointer">
                        <SlideRenderer slide={newSlide(l.id, theme)} width={150} className="rounded border border-slate-100" />
                        <span className="block mt-1 text-[11px] font-medium text-slate-700">{l.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <RibbonButton big onClick={() => duplicateSlide(current)} title="Duplicar slide (Ctrl+D)" label="Duplicar"><Copy className="w-5 h-5" /></RibbonButton>
            <RibbonButton big onClick={() => deleteSlide(current)} title="Excluir slide" label="Excluir" disabled={deck.slides.length <= 1}><Trash2 className="w-5 h-5" /></RibbonButton>
          </Group>
          <Group label="Fonte">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <select disabled={!hasText} value={ts?.fontFamily ?? theme.bodyFont} onChange={(e) => updateTextStyle({ fontFamily: e.target.value })} className="h-7 w-[132px] text-xs border border-slate-300 rounded px-1 bg-white disabled:opacity-40">
                  {FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                </select>
                <input disabled={!hasText} type="number" min={8} max={200} value={ts?.fontSize ?? 28} onChange={(e) => updateTextStyle({ fontSize: Math.max(8, Math.min(200, Number(e.target.value) || 8)) })} className="h-7 w-14 text-xs border border-slate-300 rounded px-1 disabled:opacity-40" title="Tamanho da fonte" />
              </div>
              <div className="flex items-center gap-0.5">
                <RibbonButton disabled={!hasText} active={ts?.bold} onClick={() => updateTextStyle({ bold: !ts?.bold })} title="Negrito"><Bold className="w-4 h-4" /></RibbonButton>
                <RibbonButton disabled={!hasText} active={ts?.italic} onClick={() => updateTextStyle({ italic: !ts?.italic })} title="Itálico"><Italic className="w-4 h-4" /></RibbonButton>
                <RibbonButton disabled={!hasText} active={ts?.underline} onClick={() => updateTextStyle({ underline: !ts?.underline })} title="Sublinhado"><Underline className="w-4 h-4" /></RibbonButton>
                {hasText && <ColorPicker value={ts?.color} onChange={(c) => updateTextStyle({ color: c })} title="Cor da fonte" icon={<Type className="w-4 h-4" />} />}
                <RibbonButton disabled={!hasText} onClick={() => updateTextStyle({ fontSize: Math.min(200, (ts?.fontSize ?? 28) + 4) })} title="Aumentar fonte"><span className="text-xs font-bold">A+</span></RibbonButton>
                <RibbonButton disabled={!hasText} onClick={() => updateTextStyle({ fontSize: Math.max(8, (ts?.fontSize ?? 28) - 4) })} title="Diminuir fonte"><span className="text-[11px] font-bold">A−</span></RibbonButton>
              </div>
            </div>
          </Group>
          <Group label="Parágrafo">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-0.5">
                <RibbonButton disabled={!hasText} active={ts?.list === 'bullet'} onClick={() => updateTextStyle({ list: ts?.list === 'bullet' ? 'none' : 'bullet' })} title="Marcadores"><List className="w-4 h-4" /></RibbonButton>
                <RibbonButton disabled={!hasText} active={ts?.list === 'number'} onClick={() => updateTextStyle({ list: ts?.list === 'number' ? 'none' : 'number' })} title="Numeração"><ListOrdered className="w-4 h-4" /></RibbonButton>
                <RibbonButton disabled={!hasText} active={ts?.valign === 'top' || !ts?.valign} onClick={() => updateTextStyle({ valign: 'top' })} title="Alinhar em cima"><AlignVerticalJustifyStart className="w-4 h-4" /></RibbonButton>
                <RibbonButton disabled={!hasText} active={ts?.valign === 'middle'} onClick={() => updateTextStyle({ valign: 'middle' })} title="Centralizar verticalmente"><AlignVerticalJustifyCenter className="w-4 h-4" /></RibbonButton>
                <RibbonButton disabled={!hasText} active={ts?.valign === 'bottom'} onClick={() => updateTextStyle({ valign: 'bottom' })} title="Alinhar embaixo"><AlignVerticalJustifyEnd className="w-4 h-4" /></RibbonButton>
              </div>
              <div className="flex items-center gap-0.5">
                <RibbonButton disabled={!hasText} active={ts?.align === 'left'} onClick={() => updateTextStyle({ align: 'left' })} title="Alinhar à esquerda"><AlignLeft className="w-4 h-4" /></RibbonButton>
                <RibbonButton disabled={!hasText} active={ts?.align === 'center'} onClick={() => updateTextStyle({ align: 'center' })} title="Centralizar"><AlignCenter className="w-4 h-4" /></RibbonButton>
                <RibbonButton disabled={!hasText} active={ts?.align === 'right'} onClick={() => updateTextStyle({ align: 'right' })} title="Alinhar à direita"><AlignRight className="w-4 h-4" /></RibbonButton>
              </div>
            </div>
          </Group>
          <Group label="Desenho">
            {selected?.type === 'shape' ? (
              <>
                <ColorPicker value={selected.fill} onChange={(c) => updateElement(selected.id, { fill: c })} title="Preenchimento" icon={<Square className="w-4 h-4 fill-current" />} allowNone />
                <ColorPicker value={selected.stroke} onChange={(c) => updateElement(selected.id, { stroke: c, strokeWidth: selected.strokeWidth || 3 })} title="Contorno" icon={<Square className="w-4 h-4" />} allowNone />
                <select value={selected.strokeWidth ?? 0} onChange={(e) => updateElement(selected.id, { strokeWidth: Number(e.target.value) })} className="h-7 text-xs border border-slate-300 rounded px-1 bg-white" title="Espessura do contorno">
                  {[0, 1, 2, 3, 4, 6, 8, 12].map((n) => <option key={n} value={n}>{n === 0 ? 'Sem contorno' : `${n} px`}</option>)}
                </select>
              </>
            ) : (
              <span className="text-[11px] text-slate-400 px-2 max-w-[110px] leading-tight">Selecione uma forma para mudar as cores</span>
            )}
          </Group>
          <Group label="Organizar">
            <RibbonButton big disabled={!selected} onClick={() => reorder('front')} title="Trazer para a frente" label="Frente"><ArrowUpToLine className="w-5 h-5" /></RibbonButton>
            <RibbonButton big disabled={!selected} onClick={() => reorder('back')} title="Enviar para trás" label="Trás"><ArrowDownToLine className="w-5 h-5" /></RibbonButton>
            <RibbonButton big disabled={!selected} onClick={() => selected && updateElement(selected.id, { x: Math.round((SLIDE_W - selected.w) / 2), y: Math.round((SLIDE_H - selected.h) / 2) })} title="Centralizar no slide" label="Centralizar"><AlignCenter className="w-5 h-5" /></RibbonButton>
            <RibbonButton big disabled={!selected} onClick={deleteSelected} title="Excluir elemento (Delete)" label="Excluir"><Trash2 className="w-5 h-5" /></RibbonButton>
          </Group>
        </>
      )}

      {tab === 'inserir' && (
        <>
          <Group label="Slides">
            <RibbonButton big onClick={() => addSlide('title-content')} title="Novo slide" label="Novo slide"><Plus className="w-5 h-5" /></RibbonButton>
          </Group>
          <Group label="Texto">
            <RibbonButton big onClick={insertTextBox} title="Caixa de texto" label="Caixa de texto"><Type className="w-5 h-5" /></RibbonButton>
          </Group>
          <Group label="Imagens">
            <RibbonButton big onClick={() => fileInputRef.current?.click()} title="Imagem do computador" label="Do computador"><ImageIcon className="w-5 h-5" /></RibbonButton>
            <RibbonButton big onClick={() => { const url = window.prompt('Cole o endereço (URL) da imagem:'); if (url?.trim()) insertImage(url.trim()); }} title="Imagem da internet" label="Por link"><Link2 className="w-5 h-5" /></RibbonButton>
          </Group>
          <Group label="Formas">
            <div className="grid grid-cols-4 gap-0.5">
              {SHAPES.map((s) => (
                <RibbonButton key={s.id} onClick={() => insertShape(s.id)} title={s.label}>{s.icon}</RibbonButton>
              ))}
            </div>
          </Group>
        </>
      )}

      {tab === 'design' && (
        <>
          <Group label="Temas">
            <div className="flex items-center gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => commit((d) => applyTheme(d, t))}
                  title={`Tema ${t.name}`}
                  className={`w-[86px] h-[48px] rounded-md border-2 overflow-hidden relative cursor-pointer ${deck.themeId === t.id ? 'border-indigo-500' : 'border-slate-200 hover:border-slate-400'}`}
                  style={{ background: t.background }}
                >
                  <span className="absolute left-1.5 top-1 text-[11px] font-bold" style={{ color: t.titleColor, fontFamily: t.titleFont }}>Aa</span>
                  <span className="absolute left-1.5 bottom-1 w-6 h-1 rounded" style={{ background: t.accent }} />
                  <span className="absolute right-1 bottom-0.5 text-[9px]" style={{ color: t.textColor }}>{t.name}</span>
                </button>
              ))}
            </div>
          </Group>
          <Group label="Fundo do slide">
            <div className="grid grid-cols-5 gap-1">
              {BG_PRESETS.map((bg) => (
                <button key={bg} type="button" onClick={() => updateSlide((s) => ({ ...s, background: bg }))} className={`w-6 h-6 rounded border cursor-pointer ${slide.background === bg ? 'ring-2 ring-indigo-500' : 'border-slate-300'}`} style={{ background: bg }} title="Aplicar fundo" />
              ))}
            </div>
            <div className="flex flex-col items-center ml-1">
              <input type="color" value={slide.background.startsWith('#') && slide.background.length === 7 ? slide.background : '#ffffff'} onChange={(e) => updateSlide((s) => ({ ...s, background: e.target.value }), false)} className="w-8 h-7 cursor-pointer" title="Cor personalizada" />
              <button type="button" onClick={() => commit((d) => ({ ...d, slides: d.slides.map((s) => ({ ...s, background: slide.background })) }))} className="text-[10px] text-indigo-600 hover:underline mt-0.5 cursor-pointer">Aplicar a todos</button>
            </div>
          </Group>
        </>
      )}

      {tab === 'transicoes' && (
        <>
          <Group label="Transição para este slide">
            {(['none', 'fade', 'slide', 'zoom'] as SlideTransition[]).map((tr) => (
              <RibbonButton key={tr} big active={slide.transition === tr} onClick={() => updateSlide((s) => ({ ...s, transition: tr }))} title={tr} label={{ none: 'Nenhuma', fade: 'Esmaecer', slide: 'Deslizar', zoom: 'Zoom' }[tr]}>
                <span className="w-7 h-5 rounded border border-slate-300 bg-gradient-to-r from-slate-100 to-indigo-200" />
              </RibbonButton>
            ))}
          </Group>
          <Group label="Intervalo">
            <RibbonButton big onClick={() => commit((d) => ({ ...d, slides: d.slides.map((s) => ({ ...s, transition: slide.transition })) }))} title="Usar esta transição em todos os slides" label="Aplicar a todos"><Copy className="w-5 h-5" /></RibbonButton>
          </Group>
        </>
      )}

      {tab === 'apresentar' && (
        <>
          <Group label="Iniciar apresentação">
            <RibbonButton big onClick={() => setShowFrom(0)} title="Do começo (F5)" label="Do começo"><Play className="w-5 h-5" /></RibbonButton>
            <RibbonButton big onClick={() => setShowFrom(current)} title="Do slide atual (Shift+F5)" label="Do slide atual"><Presentation className="w-5 h-5" /></RibbonButton>
          </Group>
          <Group label="Exportar">
            <RibbonButton big onClick={exportPptx} title="Baixar arquivo PowerPoint (.pptx)" label="PowerPoint"><Download className="w-5 h-5" /></RibbonButton>
            <RibbonButton big onClick={exportPdf} title="Baixar PDF" label="PDF"><FileDown className="w-5 h-5" /></RibbonButton>
          </Group>
          <Group label="Quadro">
            <RibbonButton big onClick={regenerateFromBoard} title="Gerar apresentação a partir do quadro" label="Gerar do quadro"><RefreshCw className="w-5 h-5" /></RibbonButton>
            <RibbonButton big onClick={sendToBoard} title="Colocar os slides no quadro como frames" label="Enviar ao quadro"><Send className="w-5 h-5" /></RibbonButton>
          </Group>
        </>
      )}
    </div>
  );

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[60] bg-slate-100 flex flex-col text-slate-800 select-none">
      {/* Title bar */}
      <div className="h-11 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <LayoutTemplate className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm truncate">{boardTitle || 'Apresentação'}</span>
          <span className="text-xs text-indigo-200 hidden sm:inline">· Slides do Diorfy · salvo no quadro</span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={undo} title="Desfazer (Ctrl+Z)" className="p-1.5 rounded hover:bg-white/15 cursor-pointer"><Undo2 className="w-4 h-4" /></button>
          <button type="button" onClick={redo} title="Refazer (Ctrl+Y)" className="p-1.5 rounded hover:bg-white/15 cursor-pointer"><Redo2 className="w-4 h-4" /></button>
          <button type="button" onClick={() => setShowFrom(current)} className="ml-2 flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-indigo-700 text-xs font-bold hover:bg-indigo-50 cursor-pointer" title="Apresentar (F5)">
            <Play className="w-3.5 h-3.5 fill-current" /> Apresentar
          </button>
          <button type="button" onClick={onClose} title="Fechar (Esc)" className="ml-1 p-1.5 rounded hover:bg-white/15 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Ribbon */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-1 px-2 pt-1 text-xs">
          {([['inicio', 'Início'], ['inserir', 'Inserir'], ['design', 'Design'], ['transicoes', 'Transições'], ['apresentar', 'Apresentar e exportar']] as [RibbonTab, string][]).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setTab(id)} className={`px-3 py-1.5 rounded-t-md font-semibold cursor-pointer ${tab === id ? 'bg-slate-100 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="bg-slate-50/70 border-t border-slate-100">{ribbon}</div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Thumbnails */}
        <div className="w-[208px] shrink-0 bg-white border-r border-slate-200 overflow-y-auto py-3 px-2 space-y-2 hidden sm:block">
          {thumbs.map((s, i) => (
            <div
              key={s.id}
              draggable
              onDragStart={() => setDragThumb(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragThumb !== null) moveSlide(dragThumb, i); setDragThumb(null); }}
              onClick={() => { setCurrent(i); setSelectedId(null); setEditingId(null); }}
              className={`group flex gap-1.5 cursor-pointer ${dragThumb === i ? 'opacity-40' : ''}`}
            >
              <span className={`text-[11px] w-4 text-right pt-1 ${i === current ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>{i + 1}</span>
              <div className={`relative rounded-md overflow-hidden border-2 ${i === current ? 'border-indigo-500 shadow' : 'border-slate-200 hover:border-slate-400'}`}>
                <SlideRenderer slide={s} width={164} />
                <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                  <button type="button" onClick={(e) => { e.stopPropagation(); duplicateSlide(i); }} className="p-0.5 rounded bg-white/90 shadow text-slate-600 hover:text-indigo-600 cursor-pointer" title="Duplicar"><Copy className="w-3 h-3" /></button>
                  {deck.slides.length > 1 && <button type="button" onClick={(e) => { e.stopPropagation(); deleteSlide(i); }} className="p-0.5 rounded bg-white/90 shadow text-slate-600 hover:text-rose-600 cursor-pointer" title="Excluir"><Trash2 className="w-3 h-3" /></button>}
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addSlide('title-content')} className="ml-5 w-[164px] h-[60px] rounded-md border-2 border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-400 flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer">
            <Plus className="w-4 h-4" /> Novo slide
          </button>
        </div>

        {/* Stage + notes */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div ref={stageWrapRef} className="flex-1 min-h-0 flex items-center justify-center overflow-hidden" onPointerDown={() => { setSelectedId(null); setEditingId(null); }}>
            {slide && (
              <div className="shadow-xl ring-1 ring-slate-300 bg-white" onPointerDown={(e) => e.stopPropagation()}>
                <SlideRenderer slide={slide} width={stageW} hideTextOf={editingId}>
                  {/* Interaction layer (slide units) */}
                  <div className="absolute inset-0" onPointerDown={() => { setSelectedId(null); setEditingId(null); }}>
                    {slide.elements.map((el) => {
                      const isSel = el.id === selectedId;
                      const isEditing = el.id === editingId;
                      return (
                        <div
                          key={el.id}
                          className="absolute"
                          style={{ left: el.x, top: el.y, width: el.w, height: el.h, transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined, cursor: isEditing ? 'text' : 'move' }}
                          onPointerDown={(e) => startDrag(e, el, 'move')}
                          onDoubleClick={(e) => { e.stopPropagation(); if (el.type !== 'image') setEditingId(el.id); }}
                        >
                          {isEditing && el.textStyle && (
                            <textarea
                              autoFocus
                              value={el.text ?? ''}
                              onChange={(e) => updateElement(el.id, { text: e.target.value }, false)}
                              onFocus={(e) => { e.currentTarget.select(); history.current.past.push(deck); history.current.future = []; }}
                              onBlur={() => setEditingId(null)}
                              onPointerDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => { if (e.key === 'Escape') (e.target as HTMLTextAreaElement).blur(); }}
                              className="absolute inset-0 w-full h-full resize-none bg-white/40 outline-none px-3 py-2 select-text"
                              style={{ ...textCss(el.textStyle), fontSize: el.textStyle.fontSize }}
                            />
                          )}
                          {isSel && !isEditing && (
                            <>
                              <div className="absolute -inset-[2px] border-2 border-indigo-500 pointer-events-none" style={{ borderWidth: 2 / scale, inset: -2 / scale }} />
                              {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as Handle[]).map((h) => {
                                const size = 12 / scale;
                                const pos: React.CSSProperties = {
                                  width: size,
                                  height: size,
                                  left: h.includes('w') ? -size / 2 : h.includes('e') ? el.w - size / 2 : el.w / 2 - size / 2,
                                  top: h.includes('n') ? -size / 2 : h.includes('s') ? el.h - size / 2 : el.h / 2 - size / 2,
                                  cursor: `${h}-resize`,
                                  borderWidth: 1.5 / scale,
                                };
                                return <div key={h} className="absolute bg-white border-indigo-500 rounded-sm" style={pos} onPointerDown={(e) => startDrag(e, el, h)} />;
                              })}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </SlideRenderer>
              </div>
            )}
          </div>

          {/* Speaker notes */}
          <div className="h-[92px] shrink-0 border-t border-slate-200 bg-white px-4 py-2">
            <textarea
              value={slide?.notes ?? ''}
              onChange={(e) => updateSlide((s) => ({ ...s, notes: e.target.value }), false)}
              placeholder="Clique para adicionar anotações do apresentador"
              className="w-full h-full resize-none text-sm text-slate-700 outline-none placeholder:text-slate-400 select-text"
            />
          </div>

          {/* Status bar */}
          <div className="h-7 shrink-0 bg-slate-200/70 text-[11px] text-slate-600 flex items-center justify-between px-3">
            <span>Slide {current + 1} de {deck.slides.length} · Tema {theme.name}</span>
            <span className="hidden md:inline">Clique duplo para editar texto · Ctrl+Z desfaz · Ctrl+D duplica · Delete exclui · F5 apresenta</span>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} />

      {/* Off-screen full-size render used for PDF export */}
      {busy?.includes('PDF') && (
        <div id="slide-pdf-render-host" className="fixed -left-[99999px] top-0">
          {deck.slides.map((s) => (
            <div key={s.id} style={{ width: SLIDE_W, height: SLIDE_H, position: 'relative', background: s.background }}>
              {s.elements.map((el) => <ElementView key={el.id} el={el} />)}
            </div>
          ))}
        </div>
      )}

      {(busy || toast) && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-xl bg-slate-900 text-white text-sm shadow-xl flex items-center gap-2">
          {busy && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
          {busy ?? toast}
        </div>
      )}
    </div>
  );
};

