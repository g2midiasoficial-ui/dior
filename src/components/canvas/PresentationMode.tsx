import React, { useState, useEffect, useRef } from 'react';
import { CanvasFrame, CanvasElement } from '../../types/miro';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Zap,
  PenTool,
  Clock,
  BookOpen,
  Layers,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  RotateCcw,
  Sparkles,
  Edit2,
  Check,
} from 'lucide-react';
import { playSound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface PresentationModeProps {
  frames: CanvasFrame[];
  isOpen: boolean;
  onClose: () => void;
  onFocusFrame: (frame: CanvasFrame) => void;
  onUpdateFrameTitle?: (frameId: string, newTitle: string) => void;
  onAddNewFrame?: (title?: string) => void;
  onDeleteFrame?: (frameId: string) => void;
  onReorderFrames?: (newFrames: CanvasFrame[]) => void;
  elements?: CanvasElement[];
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  frames,
  isOpen,
  onClose,
  onFocusFrame,
  onUpdateFrameTitle,
  onAddNewFrame,
  onDeleteFrame,
  onReorderFrames,
  elements = [],
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySeconds, setAutoPlaySeconds] = useState(5);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [penActive, setPenActive] = useState(false);
  const [penColor, setPenColor] = useState('#ef4444');
  const [penStrokes, setPenStrokes] = useState<Record<number, { x: number; y: number; color: string }[][]>>({});
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number; color: string }[]>([]);
  const [showFramesDrawer, setShowFramesDrawer] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');

  const svgCanvasRef = useRef<SVGSVGElement>(null);

  // Focus current frame whenever index or frames change
  useEffect(() => {
    if (isOpen && frames.length > 0) {
      const targetFrame = frames[currentSlideIndex] || frames[0];
      if (targetFrame) {
        onFocusFrame(targetFrame);
        setTitleValue(targetFrame.title);
      }
    }
  }, [isOpen, currentSlideIndex, frames]);

  // Elapsed Timer effect
  useEffect(() => {
    let tInterval: any;
    if (isOpen && isTimerRunning) {
      tInterval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(tInterval);
  }, [isOpen, isTimerRunning]);

  // Autoplay effect
  useEffect(() => {
    let interval: any;
    if (isPlaying && frames.length > 0) {
      const stepMs = 50;
      const totalMs = autoPlaySeconds * 1000;
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            goToNext();
            return 0;
          }
          return prev + (stepMs / totalMs) * 100;
        });
      }, stepMs);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, autoPlaySeconds, frames.length, currentSlideIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isFullscreen) {
          try {
            if (document.exitFullscreen) document.exitFullscreen();
          } catch {}
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'l' || e.key === 'L') {
        setLaserActive((prev) => !prev);
      } else if (e.key === 'p' || e.key === 'P') {
        setPenActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex, frames.length, isFullscreen]);

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    playSound.click();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(!isFullscreen);
    }
  };

  if (!isOpen) return null;

  const currentFrame = frames[currentSlideIndex] || frames[0];

  const goToNext = () => {
    playSound.click();
    setProgress(0);
    if (currentSlideIndex < frames.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      setCurrentSlideIndex(0);
    }
  };

  const goToPrev = () => {
    playSound.click();
    setProgress(0);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    } else {
      setCurrentSlideIndex(frames.length - 1);
    }
  };

  const handleSaveTitle = () => {
    if (currentFrame && titleValue.trim() && onUpdateFrameTitle) {
      onUpdateFrameTitle(currentFrame.id, titleValue.trim());
    }
    setEditingTitle(false);
  };

  const handleReorder = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === frames.length - 1) return;
    playSound.click();
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newFrames = [...frames];
    const temp = newFrames[idx];
    newFrames[idx] = newFrames[targetIdx];
    newFrames[targetIdx] = temp;
    if (onReorderFrames) onReorderFrames(newFrames);
    setCurrentSlideIndex(targetIdx);
  };

  // Format elapsed time (MM:SS)
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If no frames on board, show friendly prompt to create first frame
  if (frames.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center text-white">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold mb-1">Nenhum Quadro / Slide Encontrado</h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            A apresentação utiliza os <b>quadros e molduras (Frames)</b> criados no canvas como slides.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (onAddNewFrame) onAddNewFrame('Slide 1 - Início');
                else onClose();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 font-bold text-xs text-white shadow-lg cursor-pointer transition-all active:scale-95"
            >
              + Criar Primeiro Quadro/Slide
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Voltar ao Quadro
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Count elements inside current focused frame
  const elementsInFrame = currentFrame
    ? elements.filter(
        (el) =>
          el.x >= currentFrame.x - 20 &&
          el.x <= currentFrame.x + currentFrame.width + 20 &&
          el.y >= currentFrame.y - 20 &&
          el.y <= currentFrame.y + currentFrame.height + 20
      )
    : [];

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 select-none flex flex-col justify-between"
      onMouseMove={(e) => {
        if (laserActive) {
          setLaserPos({ x: e.clientX, y: e.clientY });
        }
        if (penActive && isDrawing) {
          setCurrentStroke((prev) => [...prev, { x: e.clientX, y: e.clientY, color: penColor }]);
        }
      }}
      onMouseDown={(e) => {
        if (penActive) {
          setIsDrawing(true);
          setCurrentStroke([{ x: e.clientX, y: e.clientY, color: penColor }]);
        }
      }}
      onMouseUp={() => {
        if (penActive && isDrawing && currentStroke.length > 0) {
          setIsDrawing(false);
          setPenStrokes((prev) => ({
            ...prev,
            [currentSlideIndex]: [...(prev[currentSlideIndex] || []), currentStroke],
          }));
          setCurrentStroke([]);
        }
      }}
    >
      {/* Laser Pointer */}
      {laserActive && (
        <div
          className="fixed pointer-events-none z-50 w-6 h-6 rounded-full bg-red-500 shadow-[0_0_20px_#ef4444] animate-ping"
          style={{ left: laserPos.x - 12, top: laserPos.y - 12 }}
        />
      )}

      {/* Live Pen Annotations Overlay */}
      <svg
        ref={svgCanvasRef}
        className={`fixed inset-0 w-full h-full z-45 ${
          penActive ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
        }`}
      >
        {/* Saved strokes for current slide */}
        {(penStrokes[currentSlideIndex] || []).map((stroke, sIdx) => {
          if (stroke.length < 2) return null;
          const d = stroke.reduce(
            (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
            ''
          );
          return (
            <path
              key={sIdx}
              d={d}
              stroke={stroke[0]?.color || '#ef4444'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.9"
            />
          );
        })}

        {/* Current Active Stroke */}
        {currentStroke.length > 1 && (
          <path
            d={currentStroke.reduce(
              (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
              ''
            )}
            stroke={penColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
        )}
      </svg>

      {/* Top Banner Header: Frame Title & Status */}
      <div className="pointer-events-auto p-4 flex items-center justify-between">
        {/* Left: Frame Badge & Title */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-2xl shadow-xl text-white text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded-full">
            Quadro #{currentSlideIndex + 1}
          </span>
          {editingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setEditingTitle(false);
                }}
                autoFocus
                className="bg-slate-800 text-white font-bold text-xs px-2 py-0.5 rounded outline-none border border-purple-500 w-48"
              />
              <button
                onClick={handleSaveTitle}
                className="p-1 hover:bg-slate-700 rounded text-emerald-400"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setEditingTitle(true)}
              className="flex items-center gap-1.5 font-bold hover:text-purple-300 cursor-pointer group"
              title="Clique para renomear este quadro"
            >
              <span className="truncate max-w-[240px] sm:max-w-xs">{currentFrame.title}</span>
              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
            </div>
          )}
          <span className="text-[10px] text-slate-400">({elementsInFrame.length} elementos)</span>
        </div>

        {/* Right: Quick Tools (Timer & Exit) */}
        <div className="flex items-center gap-2">
          {/* Elapsed Presentation Timer */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl shadow-xl text-white text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          {/* Close Presentation Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-rose-600/90 hover:bg-rose-500 text-white px-3 py-1.5 rounded-2xl text-xs font-bold shadow-xl backdrop-blur-md transition-all cursor-pointer active:scale-95"
            title="Sair da apresentação (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      {/* Frames Drawer Popover (Left Side) */}
      {showFramesDrawer && (
        <div className="pointer-events-auto absolute left-4 top-20 bottom-24 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3.5 rounded-3xl shadow-2xl flex flex-col gap-2 z-50 text-white animate-in slide-in-from-left-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              Quadros do Canvas ({frames.length})
            </span>
            <button
              onClick={() => {
                if (onAddNewFrame) {
                  onAddNewFrame(`Quadro ${frames.length + 1}`);
                  try {
                    confetti({ particleCount: 30, spread: 50 });
                  } catch {}
                }
              }}
              className="p-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors cursor-pointer"
              title="Adicionar Novo Quadro"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* List of Frames */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {frames.map((frame, idx) => (
              <div
                key={frame.id}
                onClick={() => {
                  playSound.click();
                  setCurrentSlideIndex(idx);
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer text-left flex items-center justify-between group ${
                  currentSlideIndex === idx
                    ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg ring-1 ring-purple-500/40'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-purple-400 shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold truncate">{frame.title}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReorder(idx, 'up');
                    }}
                    disabled={idx === 0}
                    className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20"
                    title="Subir ordem"
                  >
                    <MoveUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReorder(idx, 'down');
                    }}
                    disabled={idx === frames.length - 1}
                    className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20"
                    title="Descer ordem"
                  >
                    <MoveDown className="w-3 h-3" />
                  </button>
                  {frames.length > 1 && onDeleteFrame && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFrame(frame.id);
                      }}
                      className="p-0.5 text-slate-400 hover:text-rose-400"
                      title="Excluir quadro"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Speaker Notes Overlay */}
      {showSpeakerNotes && (
        <div className="pointer-events-auto absolute right-4 top-20 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-3xl shadow-2xl text-white text-xs z-50 animate-in slide-in-from-right-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
            <span className="font-bold flex items-center gap-1.5 text-indigo-400">
              <BookOpen className="w-4 h-4" />
              Notas do Orador
            </span>
            <button
              onClick={() => setShowSpeakerNotes(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed mb-3">
            Apresentando <b>{currentFrame.title}</b> ({elementsInFrame.length} itens sincronizados).
          </p>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-[11px] leading-relaxed">
            💡 Dica: Use as setas do teclado (← e →) ou barra de espaço para navegar entre os quadros. Pressione <b>F</b> para tela cheia e <b>L</b> para apontador laser.
          </div>
        </div>
      )}

      {/* Bottom Main Floating Presenter HUD Toolbar */}
      <div className="pointer-events-auto pb-6 flex justify-center items-center">
        <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/90 px-4 py-2.5 rounded-3xl shadow-2xl text-white select-none relative">
          {/* Autoplay Progress Line */}
          {isPlaying && (
            <div className="absolute top-0 left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Frames Drawer Toggle */}
          <button
            onClick={() => setShowFramesDrawer(!showFramesDrawer)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              showFramesDrawer
                ? 'bg-purple-600 text-white'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Lista de Quadros do Canvas"
          >
            <Layers className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700" />

          {/* Autoplay Play/Pause */}
          <button
            onClick={() => {
              playSound.click();
              setIsPlaying(!isPlaying);
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isPlaying ? 'Pausar reprodução automática' : 'Iniciar apresentação automática'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Previous Frame Button */}
          <button
            onClick={goToPrev}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Quadro Anterior (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slide Indicator Badge */}
          <div className="flex items-center gap-1.5 px-2">
            <span className="font-mono text-xs font-extrabold text-white">
              {currentSlideIndex + 1}
            </span>
            <span className="text-[11px] text-slate-500">/</span>
            <span className="font-mono text-xs text-slate-400 font-bold">
              {frames.length}
            </span>
          </div>

          {/* Next Frame Button */}
          <button
            onClick={goToNext}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Próximo Quadro (→ ou Espaço)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700" />

          {/* Laser Pointer Tool */}
          <button
            onClick={() => setLaserActive(!laserActive)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              laserActive
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Apontador Laser Virtual (L)"
          >
            <Zap className="w-4 h-4" />
          </button>

          {/* Live Drawing Pen Tool */}
          <button
            onClick={() => setPenActive(!penActive)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              penActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Caneta de Anotações ao Vivo (P)"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Clear Pen Strokes on current slide */}
          {penActive && (penStrokes[currentSlideIndex]?.length || 0) > 0 && (
            <button
              onClick={() => {
                playSound.trash();
                setPenStrokes((prev) => ({ ...prev, [currentSlideIndex]: [] }));
              }}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg text-[10px] font-semibold"
              title="Limpar desenhos deste quadro"
            >
              Limpar
            </button>
          )}

          {/* Speaker Notes */}
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              showSpeakerNotes
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Notas do Orador"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Tela Cheia (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
