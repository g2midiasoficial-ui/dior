import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X, StickyNote } from 'lucide-react';
import { Deck, SLIDE_H, SLIDE_W, SlideTransition } from './types';
import { SlideRenderer } from './SlideRenderer';

const VARIANTS: Record<SlideTransition, { initial: any; animate: any; exit: any }> = {
  none: { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  slide: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  zoom: { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.08 } },
};

/** Full-screen presentation: arrows / space / click to advance, Esc to exit */
export const SlideShow: React.FC<{ deck: Deck; startIndex: number; onExit: (index: number) => void }> = ({ deck, startIndex, onExit }) => {
  const [index, setIndex] = useState(Math.min(startIndex, deck.slides.length - 1));
  const [showNotes, setShowNotes] = useState(false);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const rootRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  const next = () => setIndex((i) => Math.min(deck.slides.length - 1, i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const exit = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    onExit(indexRef.current);
  };

  useEffect(() => {
    rootRef.current?.requestFullscreen?.().catch(() => {});
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    const onFs = () => {
      if (!document.fullscreenElement) onExit(indexRef.current);
    };
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter', 'n'].includes(e.key)) { e.preventDefault(); next(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace', 'p'].includes(e.key)) { e.preventDefault(); prev(); }
      else if (e.key === 'Home') setIndex(0);
      else if (e.key === 'End') setIndex(deck.slides.length - 1);
      else if (e.key === 'Escape') exit();
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', onFs);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', onFs);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const slide = deck.slides[index];
  const width = Math.min(size.w, (size.h * SLIDE_W) / SLIDE_H);
  const v = VARIANTS[slide.transition] ?? VARIANTS.fade;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[80] bg-black flex items-center justify-center overflow-hidden group" onClick={next}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={slide.id} initial={v.initial} animate={v.animate} exit={v.exit} transition={{ duration: slide.transition === 'none' ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <SlideRenderer slide={slide} width={width} />
        </motion.div>
      </AnimatePresence>

      {showNotes && slide.notes && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 max-w-2xl px-4 py-3 rounded-xl bg-black/80 text-white text-sm whitespace-pre-wrap" onClick={(e) => e.stopPropagation()}>
          {slide.notes}
        </div>
      )}

      {/* Controls appear on hover */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={prev} disabled={index === 0} className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
        <span className="tabular-nums">{index + 1} / {deck.slides.length}</span>
        <button type="button" onClick={next} disabled={index === deck.slides.length - 1} className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
        <button type="button" onClick={() => setShowNotes((s) => !s)} title="Anotações" className={`p-1 rounded-full hover:bg-white/20 cursor-pointer ${showNotes ? 'text-amber-300' : ''}`}><StickyNote className="w-4 h-4" /></button>
        <button type="button" onClick={exit} title="Sair (Esc)" className="p-1 rounded-full hover:bg-white/20 cursor-pointer"><X className="w-4 h-4" /></button>
      </div>

      {index === deck.slides.length - 1 && (
        <div className="absolute top-4 right-4 text-white/50 text-xs">Fim da apresentação · Esc para sair</div>
      )}
    </div>
  );
};
