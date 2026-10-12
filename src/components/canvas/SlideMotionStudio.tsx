import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  Layers,
  Palette,
  Sliders,
  Check,
  Download,
  Share2,
  MoveRight,
  Flame,
  Zap,
  RefreshCw,
  Edit3,
  Wand2,
  Layout,
  Presentation,
  Grid,
  FileText,
  StickyNote as StickyIcon,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Cpu,
  MonitorPlay,
  RotateCcw,
  BookOpen,
  AlignLeft,
  MoveUp,
  MoveDown,
  Type,
  Square,
  Circle,
  Eye,
  Settings,
  PenTool,
  Clock,
  Sparkle,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CanvasElement, CanvasFrame, ShapeType } from '../../types/miro';
import confetti from 'canvas-confetti';
import { playSound } from '../../utils/soundEffects';

export type SlideTheme = 'dark' | 'sunset' | 'emerald' | 'cyber' | 'minimal' | 'purple' | 'ocean';
export type SlideTransition = 'slide' | 'zoom' | 'flip' | 'spring' | 'fade';
export type SlideLayout = 'board-view' | 'cards' | 'hero' | 'split' | 'metric' | 'process' | 'sticky-wall';

export interface SlideDeckItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  metric?: { value: string; label: string };
  points: string[];
  cards?: { title: string; desc: string; color?: string; emoji?: string }[];
  imageUrl?: string;
  theme: SlideTheme;
  transition: SlideTransition;
  layout: SlideLayout;
  notes?: string;
  sourceFrameId?: string;
  // Specific board elements associated with this slide
  boardElements?: CanvasElement[];
  boardFrame?: CanvasFrame;
}

// Slides as stored on the board: board elements are kept as ids (no duplicated
// content/images) and re-linked to the live board when the studio opens.
export type SavedSlide = Omit<SlideDeckItem, 'boardElements' | 'boardFrame'> & {
  boardElementIds?: string[];
};

export function slidesToSaved(slides: SlideDeckItem[]): SavedSlide[] {
  return slides.map(({ boardElements, boardFrame, ...rest }) => ({
    ...rest,
    boardElementIds: boardElements?.map((el) => el.id),
  }));
}

function elementsInFrame(frame: CanvasFrame, elements: CanvasElement[]): CanvasElement[] {
  return elements.filter(
    (el) =>
      el.x >= frame.x - 80 &&
      el.x <= frame.x + frame.width + 80 &&
      el.y >= frame.y - 80 &&
      el.y <= frame.y + frame.height + 80
  );
}

function linkSlidesToBoard(
  saved: SavedSlide[],
  frames: CanvasFrame[],
  elements: CanvasElement[]
): SlideDeckItem[] {
  const byId = new Map(elements.map((el) => [el.id, el]));
  return saved.map(({ boardElementIds, ...rest }) => {
    const frame = rest.sourceFrameId ? frames.find((f) => f.id === rest.sourceFrameId) : undefined;
    if (frame) {
      // Frame slides always show the frame's current content
      return { ...rest, boardFrame: frame, boardElements: elementsInFrame(frame, elements) };
    }
    const linked = (boardElementIds || []).map((id) => byId.get(id)).filter(Boolean) as CanvasElement[];
    return { ...rest, boardElements: linked.length > 0 ? linked : undefined };
  });
}

interface SlideMotionStudioProps {
  isOpen: boolean;
  onClose: () => void;
  frames: CanvasFrame[];
  elements: CanvasElement[];
  onExportSlidesToBoard: (newFrames: CanvasFrame[], newElements: CanvasElement[]) => void;
  /** Deck previously saved on the board (edits are kept between sessions) */
  savedSlides?: SavedSlide[];
  onSaveSlides?: (slides: SavedSlide[]) => void;
}

export const SlideMotionStudio: React.FC<SlideMotionStudioProps> = ({
  isOpen,
  onClose,
  frames,
  elements,
  onExportSlidesToBoard,
  savedSlides,
  onSaveSlides,
}) => {
  // Generate high-fidelity slides from the actual board data
  const generateSlidesFromBoardData = (
    currentFrames: CanvasFrame[],
    currentElements: CanvasElement[]
  ): SlideDeckItem[] => {
    // 1. If board has Frames, each Frame becomes a dedicated Slide with all its actual elements
    if (currentFrames && currentFrames.length > 0) {
      return currentFrames.map((frame, index) => {
        const insideElements = currentElements.filter((el) => {
          return (
            el.x >= frame.x - 80 &&
            el.x <= frame.x + frame.width + 80 &&
            el.y >= frame.y - 80 &&
            el.y <= frame.y + frame.height + 80
          );
        });

        const textElements = insideElements.filter((el) => el.type === 'text');
        const stickyElements = insideElements.filter((el) => el.type === 'sticky');
        const shapeElements = insideElements.filter((el) => el.type === 'shape');
        const imageElement = insideElements.find((el) => el.type === 'image');

        const titleText =
          textElements.find((t) => t.content && t.content.length < 50)?.content ||
          frame.title ||
          `Slide ${index + 1}: ${frame.title}`;

        const subtitleText =
          textElements.find((t) => t.content && t.content !== titleText)?.content ||
          (stickyElements.length > 0
            ? `${stickyElements.length} itens e notas sincronizados do quadro.`
            : 'Conteúdo fiel e interativo do quadro.');

        const points: string[] = [];
        const cards: { title: string; desc: string; color?: string; emoji?: string }[] = [];

        stickyElements.forEach((stk, sIdx) => {
          const content = stk.content?.trim() || `Nota ${sIdx + 1}`;
          points.push(content);
          cards.push({
            title: `Item #${sIdx + 1}`,
            desc: content,
            color: stk.style?.backgroundColor || '#fef08a',
            emoji: '📌',
          });
        });

        shapeElements.forEach((shp) => {
          if (shp.content && shp.content.trim()) {
            points.push(shp.content.trim());
          }
        });

        const themes: SlideTheme[] = ['dark', 'purple', 'sunset', 'emerald', 'cyber', 'ocean'];
        const transitions: SlideTransition[] = ['slide', 'zoom', 'spring', 'flip', 'fade'];

        return {
          id: `slide-frame-${frame.id || index}`,
          title: titleText,
          subtitle: subtitleText,
          badge: `Quadro • ${frame.title || `Seção ${index + 1}`}`,
          metric: {
            value: `${insideElements.length}`,
            label: 'Elementos sincronizados',
          },
          points: points.length > 0 ? points.slice(0, 6) : [
            'Espaço de ideação colaborativa em tempo real',
            'Alinhamento estratégico e mapa de entregas',
            'Sincronização bidirecional com o canvas',
          ],
          cards: cards.length > 0 ? cards.slice(0, 4) : undefined,
          imageUrl: imageElement?.style?.imageUrl,
          theme: themes[index % themes.length],
          transition: transitions[index % transitions.length],
          layout: insideElements.length > 0 ? 'board-view' : 'hero',
          notes: `Apresentação referente à seção "${frame.title}". Contém ${insideElements.length} elementos originais do quadro.`,
          sourceFrameId: frame.id,
          boardElements: insideElements,
          boardFrame: frame,
        };
      });
    }

    // 2. If no Frames exist, synthesize slides from loose elements on the board
    if (currentElements && currentElements.length > 0) {
      const stickies = currentElements.filter((e) => e.type === 'sticky');
      const texts = currentElements.filter((e) => e.type === 'text');
      const images = currentElements.filter((e) => e.type === 'image');
      const shapes = currentElements.filter((e) => e.type === 'shape');

      const slidesList: SlideDeckItem[] = [];

      // Slide 1: Visão Geral e Todos os Elementos
      slidesList.push({
        id: `slide-auto-overview`,
        title: texts[0]?.content || '🚀 Visão Geral do Quadro Diorfy',
        subtitle: texts[1]?.content || 'Todos os elementos, notas e componentes do quadro reunidos para apresentação.',
        badge: 'Quadro Completo',
        metric: { value: `${currentElements.length}`, label: 'Elementos totais' },
        points: [
          `${stickies.length} notas adesivas mapeadas no quadro`,
          `${shapes.length} componentes e diagramas estruturados`,
          `${images.length} imagens e recursos visuais`,
        ],
        theme: 'dark',
        transition: 'slide',
        layout: 'board-view',
        notes: 'Apresentação geral do quadro com todos os elementos integrados.',
        boardElements: currentElements,
      });

      // Slide 2: Post-its & Ideias
      if (stickies.length > 0) {
        slidesList.push({
          id: `slide-auto-stickies`,
          title: '💡 Ideias & Brainstorming do Quadro',
          subtitle: 'Notas adesivas e contribuições organizadas por tópicos essenciais.',
          badge: 'Ideação & Insights',
          metric: { value: `${stickies.length}`, label: 'Post-its no quadro' },
          points: stickies.map((s) => s.content || 'Nota sem texto').slice(0, 6),
          cards: stickies.slice(0, 4).map((s, idx) => ({
            title: `Insight #${idx + 1}`,
            desc: s.content || 'Ideia em destaque no quadro',
            color: s.style?.backgroundColor || '#fef08a',
            emoji: '💡',
          })),
          theme: 'purple',
          transition: 'spring',
          layout: 'cards',
          notes: 'Focar na discussão dos principais post-its criados no quadro.',
          boardElements: stickies,
        });
      }

      // Slide 3: Recursos Visuais & Diagramas
      if (shapes.length > 0 || images.length > 0) {
        slidesList.push({
          id: `slide-auto-diagrams`,
          title: '⚡ Estrutura Visual & Fluxo de Trabalho',
          subtitle: 'Processos, diagramas e referências visuais desenhadas no quadro.',
          badge: 'Execução & Design',
          metric: { value: `${shapes.length + images.length}`, label: 'Recursos visuais' },
          points: shapes
            .filter((s) => s.content)
            .map((s) => s.content!)
            .concat(['Mapeamento estruturado de etapas', 'Fluxo contínuo de inovação'])
            .slice(0, 4),
          imageUrl: images[0]?.style?.imageUrl,
          theme: 'cyber',
          transition: 'zoom',
          layout: 'board-view',
          notes: 'Apresentar os recursos visuais e diagramas do projeto.',
          boardElements: [...shapes, ...images],
        });
      }

      // Slide 4: Conclusão & Entregas
      slidesList.push({
        id: `slide-auto-action`,
        title: '📈 Próximos Passos & Entregas',
        subtitle: 'Plano de ação derivado das decisões tomadas no quadro.',
        badge: 'Roadmap & Ação',
        metric: { value: '100%', label: 'Alinhamento da equipe' },
        points: [
          'Priorização das ideias e post-its mais votados',
          'Execução das tarefas definidas nas seções',
          'Acompanhamento e evolução contínua no Diorfy',
        ],
        theme: 'emerald',
        transition: 'flip',
        layout: 'metric',
        notes: 'Encerrar com alinhamento das responsabilidades e prazos.',
      });

      return slidesList;
    }

    // Default Fallback
    return [
      {
        id: 'slide-def-1',
        title: '🚀 Diorfy: Apresentação Fiel do Quadro',
        subtitle: 'Tudo o que você desenha, anota ou cola no quadro aparece aqui em tempo real.',
        badge: 'Quadro Sincronizado',
        metric: { value: '100%', label: 'Tempo real' },
        points: [
          'Desenhe formas, post-its ou crie frames no quadro',
          'Clique em "Sincronizar Quadro" para ver seus elementos nos slides',
          'Edite textos, temas e apresente em tela cheia com alta resolução',
        ],
        theme: 'dark',
        transition: 'slide',
        layout: 'hero',
        notes: 'Apresentação demonstrativa sincronizada com o quadro.',
      },
    ];
  };

  const [slides, setSlides] = useState<SlideDeckItem[]>(() =>
    savedSlides && savedSlides.length > 0
      ? linkSlidesToBoard(savedSlides, frames, elements)
      : generateSlidesFromBoardData(frames, elements)
  );

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlaySeconds, setAutoPlaySeconds] = useState(5);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [editorTab, setEditorTab] = useState<'content' | 'design' | 'layout' | 'elements' | 'notes'>('content');
  const [viewMode, setViewMode] = useState<'presentation' | 'board-fidelity'>('board-fidelity');
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [laserPointer, setLaserPointer] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Presenter Draw Pen Annotation during presentation
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [annotations, setAnnotations] = useState<Record<number, { points: { x: number; y: number }[]; color: string }[]>>({});
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Keep the edited deck, only refresh the board content it shows
  useEffect(() => {
    if (isOpen) {
      setSlides((prev) => linkSlidesToBoard(slidesToSaved(prev), frames, elements));
    }
  }, [isOpen, frames, elements]);

  // Save every edit to the board (skip the first render, nothing changed yet)
  const lastSavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!onSaveSlides) return;
    const saved = slidesToSaved(slides);
    const json = JSON.stringify(saved);
    if (lastSavedRef.current === null) {
      lastSavedRef.current = json;
      return;
    }
    if (json === lastSavedRef.current) return;
    lastSavedRef.current = json;
    onSaveSlides(saved);
  }, [slides, onSaveSlides]);

  // Rebuild the deck from the board (replaces manual edits, so ask first)
  const handleSyncFromBoard = () => {
    if (
      savedSlides &&
      savedSlides.length > 0 &&
      !window.confirm('Recriar os slides a partir do quadro? As edições feitas nos slides serão substituídas.')
    ) {
      return;
    }
    playSound.click();
    const newSlides = generateSlidesFromBoardData(frames, elements);
    setSlides(newSlides);
    setCurrentSlideIndex(0);
    setSyncFeedback('Quadro sincronizado!');
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {}
    setTimeout(() => setSyncFeedback(null), 2500);
  };

  // Autoplay loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      const stepMs = 50;
      const totalMs = autoPlaySeconds * 1000;
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentSlideIndex((curr) => (curr + 1) % slides.length);
            return 0;
          }
          return prev + (stepMs / totalMs) * 100;
        });
      }, stepMs);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, autoPlaySeconds, slides.length]);

  // Fullscreen toggle
  const handleToggleFullscreen = async () => {
    playSound.click();
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((document.documentElement as any).requestFullscreen) {
          await (document.documentElement as any).requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'Space') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape') {
        if (isFullscreen) handleToggleFullscreen();
        else onClose();
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
      } else if (e.key === 'e' || e.key === 'E') {
        setIsEditorOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex, slides.length, isFullscreen]);

  const currentSlide: SlideDeckItem = slides[currentSlideIndex] || slides[0] || {
    id: 'empty',
    title: 'Quadro Diorfy',
    subtitle: 'Nenhum slide disponível',
    points: [],
    theme: 'dark',
    transition: 'slide',
    layout: 'board-view',
  };

  const goToNext = () => {
    playSound.click();
    setProgress(0);
    if (currentSlideIndex < slides.length - 1) {
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
      setCurrentSlideIndex(slides.length - 1);
    }
  };

  // Update field on current slide
  const handleUpdateCurrentSlide = (field: keyof SlideDeckItem, value: any) => {
    setSlides((prev) =>
      prev.map((sl, idx) => (idx === currentSlideIndex ? { ...sl, [field]: value } : sl))
    );
  };

  // Update specific point
  const handleUpdatePoint = (pointIdx: number, newText: string) => {
    const newPoints = [...currentSlide.points];
    newPoints[pointIdx] = newText;
    handleUpdateCurrentSlide('points', newPoints);
  };

  // Add new point
  const handleAddPoint = () => {
    playSound.click();
    const newPoints = [...currentSlide.points, 'Novo tópico explicativo'];
    handleUpdateCurrentSlide('points', newPoints);
  };

  // Remove point
  const handleRemovePoint = (pointIdx: number) => {
    playSound.trash();
    const newPoints = currentSlide.points.filter((_, i) => i !== pointIdx);
    handleUpdateCurrentSlide('points', newPoints);
  };

  // Add new card
  const handleAddCard = () => {
    playSound.click();
    const newCards = [
      ...(currentSlide.cards || []),
      {
        title: `Novo Item ${(currentSlide.cards?.length || 0) + 1}`,
        desc: 'Descrição detalhada deste item',
        color: '#bae6fd',
        emoji: '📌',
      },
    ];
    handleUpdateCurrentSlide('cards', newCards);
  };

  // Remove card
  const handleRemoveCard = (cardIdx: number) => {
    playSound.trash();
    const newCards = (currentSlide.cards || []).filter((_, i) => i !== cardIdx);
    handleUpdateCurrentSlide('cards', newCards);
  };

  // Add new slide
  const handleAddNewSlide = () => {
    playSound.click();
    const newSlide: SlideDeckItem = {
      id: `slide-${Date.now()}`,
      title: `Novo Slide ${slides.length + 1}`,
      subtitle: 'Adicione aqui a mensagem principal e tópicos deste slide.',
      badge: 'Tópico Estratégico',
      metric: { value: '100%', label: 'Foco no resultado' },
      points: [
        'Primeiro ponto de destaque',
        'Segundo elemento explicativo',
        'Conclusão e próximos passos',
      ],
      theme: 'purple',
      transition: 'slide',
      layout: 'hero',
      notes: 'Notas do orador para este slide.',
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setCurrentSlideIndex(updated.length - 1);
    setIsEditorOpen(true);
  };

  // Delete slide
  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    playSound.trash();
    const updated = slides.filter((_, i) => i !== idx);
    setSlides(updated);
    setCurrentSlideIndex(Math.max(0, idx - 1));
  };

  // Duplicate slide
  const handleDuplicateSlide = (idx: number) => {
    playSound.click();
    const target = slides[idx];
    const cloned: SlideDeckItem = {
      ...target,
      id: `slide-${Date.now()}`,
      title: `${target.title} (Cópia)`,
    };
    const updated = [...slides.slice(0, idx + 1), cloned, ...slides.slice(idx + 1)];
    setSlides(updated);
    setCurrentSlideIndex(idx + 1);
  };

  // Reorder slide up/down
  const handleMoveSlide = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === slides.length - 1) return;
    playSound.click();
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newSlides = [...slides];
    const temp = newSlides[idx];
    newSlides[idx] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;
    setSlides(newSlides);
    setCurrentSlideIndex(targetIdx);
  };

  // Export slides back to Board Canvas
  const handleExportToBoard = () => {
    playSound.success();
    const newFrames: CanvasFrame[] = [];
    const newElements: CanvasElement[] = [];

    slides.forEach((sl, i) => {
      const frameX = 150 + i * 1100;
      const frameY = 150;
      const frameId = `frame-slide-${Date.now()}-${i}`;

      const bgMap: Record<SlideTheme, string> = {
        dark: '#0f172a',
        sunset: '#fff7ed',
        emerald: '#ecfdf5',
        cyber: '#090d16',
        minimal: '#ffffff',
        purple: '#2e1065',
        ocean: '#0c4a6e',
      };

      newFrames.push({
        id: frameId,
        title: `Slide ${i + 1}: ${sl.title.substring(0, 26)}...`,
        x: frameX,
        y: frameY,
        width: 1000,
        height: 600,
        backgroundColor: bgMap[sl.theme] || '#0f172a',
        borderColor: '#6366f1',
        zIndex: 0,
      });

      // Title Text
      newElements.push({
        id: `el-title-${Date.now()}-${i}`,
        type: 'text',
        x: frameX + 60,
        y: frameY + 50,
        width: 880,
        height: 60,
        zIndex: 1,
        content: sl.title,
        style: {
          fontSize: 26,
          fontWeight: 'bold',
          color:
            sl.theme === 'dark' || sl.theme === 'cyber' || sl.theme === 'purple' || sl.theme === 'ocean'
              ? '#f8fafc'
              : '#0f172a',
        },
        createdAt: Date.now(),
      });

      // Subtitle Text
      newElements.push({
        id: `el-sub-${Date.now()}-${i}`,
        type: 'text',
        x: frameX + 60,
        y: frameY + 120,
        width: 880,
        height: 50,
        zIndex: 1,
        content: sl.subtitle,
        style: {
          fontSize: 15,
          color:
            sl.theme === 'dark' || sl.theme === 'cyber' || sl.theme === 'purple' || sl.theme === 'ocean'
              ? '#94a3b8'
              : '#475569',
        },
        createdAt: Date.now(),
      });

      // Points / Cards as Sticky Notes on Board
      sl.points.forEach((pt, ptIdx) => {
        newElements.push({
          id: `el-sticky-${Date.now()}-${i}-${ptIdx}`,
          type: 'sticky',
          x: frameX + 60 + (ptIdx % 3) * 280,
          y: frameY + 200 + Math.floor(ptIdx / 3) * 180,
          width: 250,
          height: 150,
          zIndex: 2,
          content: pt,
          style: {
            backgroundColor: ptIdx === 0 ? '#bbf7d0' : ptIdx === 1 ? '#bae6fd' : '#fef08a',
          },
          createdAt: Date.now(),
        });
      });
    });

    onExportSlidesToBoard(newFrames, newElements);
    try {
      confetti({ particleCount: 70, spread: 80 });
    } catch {}
    onClose();
  };

  // Theme styles
  const themeStyles: Record<
    SlideTheme,
    {
      bg: string;
      titleColor: string;
      subtitleColor: string;
      cardBg: string;
      cardBorder: string;
      badgeBg: string;
      badgeText: string;
      metricColor: string;
      bulletDot: string;
    }
  > = {
    dark: {
      bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white',
      titleColor: 'text-white',
      subtitleColor: 'text-slate-300',
      cardBg: 'bg-white/10 backdrop-blur-md',
      cardBorder: 'border-white/15',
      badgeBg: 'bg-indigo-500/20 border-indigo-400/30',
      badgeText: 'text-indigo-300',
      metricColor: 'text-indigo-400',
      bulletDot: 'bg-indigo-400',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white',
      titleColor: 'text-white',
      subtitleColor: 'text-purple-200',
      cardBg: 'bg-purple-900/40 backdrop-blur-md',
      cardBorder: 'border-purple-400/30',
      badgeBg: 'bg-purple-500/20 border-purple-400/30',
      badgeText: 'text-purple-300',
      metricColor: 'text-pink-400',
      bulletDot: 'bg-purple-400',
    },
    sunset: {
      bg: 'bg-gradient-to-br from-orange-950 via-rose-950 to-slate-950 text-white',
      titleColor: 'text-white',
      subtitleColor: 'text-orange-200',
      cardBg: 'bg-orange-900/30 backdrop-blur-md',
      cardBorder: 'border-orange-400/20',
      badgeBg: 'bg-orange-500/20 border-orange-400/30',
      badgeText: 'text-orange-300',
      metricColor: 'text-amber-400',
      bulletDot: 'bg-orange-400',
    },
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white',
      titleColor: 'text-white',
      subtitleColor: 'text-emerald-200',
      cardBg: 'bg-emerald-900/30 backdrop-blur-md',
      cardBorder: 'border-emerald-400/20',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/30',
      badgeText: 'text-emerald-300',
      metricColor: 'text-emerald-400',
      bulletDot: 'bg-emerald-400',
    },
    cyber: {
      bg: 'bg-gradient-to-br from-[#060814] via-[#0b1026] to-[#04060f] text-white',
      titleColor: 'text-cyan-300',
      subtitleColor: 'text-slate-300',
      cardBg: 'bg-cyan-950/30 backdrop-blur-md',
      cardBorder: 'border-cyan-500/30',
      badgeBg: 'bg-cyan-500/20 border-cyan-400/40',
      badgeText: 'text-cyan-300',
      metricColor: 'text-cyan-400',
      bulletDot: 'bg-cyan-400',
    },
    ocean: {
      bg: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-slate-950 text-white',
      titleColor: 'text-white',
      subtitleColor: 'text-cyan-200',
      cardBg: 'bg-blue-900/30 backdrop-blur-md',
      cardBorder: 'border-blue-400/20',
      badgeBg: 'bg-blue-500/20 border-blue-400/30',
      badgeText: 'text-blue-300',
      metricColor: 'text-sky-400',
      bulletDot: 'bg-sky-400',
    },
    minimal: {
      bg: 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900',
      titleColor: 'text-slate-900',
      subtitleColor: 'text-slate-600',
      cardBg: 'bg-white shadow-xl',
      cardBorder: 'border-slate-200',
      badgeBg: 'bg-blue-50 border-blue-200',
      badgeText: 'text-blue-700',
      metricColor: 'text-blue-600',
      bulletDot: 'bg-blue-600',
    },
  };

  const st = themeStyles[currentSlide.theme || 'dark'] || themeStyles.dark;

  const getVariants = () => {
    switch (currentSlide.transition) {
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.85 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.15 },
        };
      case 'flip':
        return {
          initial: { opacity: 0, rotateY: 90 },
          animate: { opacity: 1, rotateY: 0 },
          exit: { opacity: 0, rotateY: -90 },
        };
      case 'spring':
        return {
          initial: { opacity: 0, y: 60 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -60 },
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'slide':
      default:
        return {
          initial: { opacity: 0, x: 80 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -80 },
        };
    }
  };

  // Calculate bounding box for high-fidelity rendering of actual board elements inside the slide
  const boardBounds = useMemo(() => {
    const list = currentSlide.boardElements || [];
    if (list.length === 0) return { minX: 0, minY: 0, maxX: 800, maxY: 500, width: 800, height: 500 };
    const minX = Math.min(...list.map((e) => e.x));
    const minY = Math.min(...list.map((e) => e.y));
    const maxX = Math.max(...list.map((e) => e.x + e.width));
    const maxY = Math.max(...list.map((e) => e.y + e.height));
    return {
      minX,
      minY,
      maxX,
      maxY,
      width: Math.max(400, maxX - minX),
      height: Math.max(300, maxY - minY),
    };
  }, [currentSlide.boardElements]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex flex-col select-none transition-all duration-300 ${
        isFullscreen ? 'bg-black p-0 w-screen h-screen' : 'bg-slate-950/90 backdrop-blur-md p-2 sm:p-4'
      }`}
      onMouseMove={(e) => {
        if (laserPointer) {
          setMousePos({ x: e.clientX, y: e.clientY });
        }
      }}
    >
      {/* Laser Pointer */}
      {laserPointer && isFullscreen && (
        <div
          className="fixed pointer-events-none z-50 w-6 h-6 rounded-full bg-red-500 shadow-[0_0_25px_#ef4444] animate-ping"
          style={{ left: mousePos.x - 12, top: mousePos.y - 12 }}
        />
      )}

      {/* Main Studio Frame */}
      <div
        className={`flex-1 flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 ${
          isFullscreen ? 'rounded-none border-none' : ''
        }`}
      >
        {/* Top Header Control Bar */}
        {!isFullscreen && (
          <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-3 text-white shrink-0">
            {/* Left: Branding & Auto Sync */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow-md">
                  <Film className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <span>Estúdio de Slides & Apresentação</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Sincronizado com o Quadro
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 hidden sm:block">
                    Reflete fielmente o conteúdo do quadro com editor completo e tela cheia
                  </p>
                </div>
              </div>

              {/* Sync from Board Button */}
              <button
                onClick={handleSyncFromBoard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer ml-2"
                title="Sincronizar com os elementos reais do quadro"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sincronizar Quadro</span>
              </button>

              {syncFeedback && (
                <span className="text-[11px] font-bold text-emerald-400 animate-in fade-in flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {syncFeedback}
                </span>
              )}
            </div>

            {/* Center: View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('board-fidelity')}
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'board-fidelity'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Exibir os elementos reais e fieis do quadro neste slide"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Quadro Fiel (1:1)</span>
              </button>
              <button
                onClick={() => setViewMode('presentation')}
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'presentation'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Exibir layout de apresentação com cartões e tópicos"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Layout Motion</span>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Toggle Editor Sidebar */}
              <button
                onClick={() => setIsEditorOpen(!isEditorOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isEditorOpen
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Abrir Painel de Edição Completo (E)"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditorOpen ? 'Fechar Editor' : 'Editor Completo'}</span>
              </button>

              {/* Export back to Board */}
              <button
                onClick={handleExportToBoard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                title="Aplicar e exportar slides no quadro infinito"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Salvar no Quadro</span>
              </button>

              {/* Fullscreen Presentation Button */}
              <button
                onClick={handleToggleFullscreen}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-xl text-xs font-extrabold shadow-md cursor-pointer transition-colors"
                title="Apresentar em Tela Cheia (F)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Apresentar (Tela Cheia)</span>
              </button>

              {/* Close Studio */}
              <button
                onClick={onClose}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                title="Fechar Estúdio"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Studio Body */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Slide Deck Thumbnails */}
          {!isFullscreen && (
            <div className="w-60 bg-slate-950/80 border-r border-slate-800 p-3 flex flex-col gap-2 overflow-y-auto shrink-0 select-none">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Slides ({slides.length})
                </span>
                <button
                  onClick={handleAddNewSlide}
                  className="p-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors cursor-pointer"
                  title="Adicionar Novo Slide"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {slides.map((sl, idx) => (
                <div
                  key={sl.id || idx}
                  onClick={() => {
                    playSound.click();
                    setCurrentSlideIndex(idx);
                  }}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer group text-left relative ${
                    currentSlideIndex === idx
                      ? 'bg-purple-950/50 border-purple-500/80 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/40'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-purple-400">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSlide(idx, 'up');
                        }}
                        disabled={idx === 0}
                        className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20"
                        title="Subir"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSlide(idx, 'down');
                        }}
                        disabled={idx === slides.length - 1}
                        className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20"
                        title="Descer"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSlide(idx);
                        }}
                        className="p-0.5 text-slate-400 hover:text-white"
                        title="Duplicar"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {slides.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(idx);
                          }}
                          className="p-0.5 text-slate-400 hover:text-rose-400"
                          title="Excluir"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{sl.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sl.subtitle}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {sl.theme}
                    </span>
                    {sl.boardElements && sl.boardElements.length > 0 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        {sl.boardElements.length} el
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Center Stage: Live Animated Slide */}
          <div
            ref={stageRef}
            className={`flex-1 flex flex-col items-center justify-center overflow-hidden relative bg-slate-950 ${
              isFullscreen ? 'p-0 w-full h-full' : 'p-4 sm:p-6'
            }`}
          >
            {/* Slide Stage Container */}
            <div
              className={`w-full overflow-hidden shadow-2xl relative flex flex-col ${
                isFullscreen
                  ? 'w-screen h-screen max-w-none max-h-none rounded-none border-none'
                  : 'max-w-5xl aspect-video max-h-[80vh] rounded-3xl border border-white/10'
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id || currentSlideIndex}
                  variants={getVariants()}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className={`w-full h-full flex flex-col justify-between relative overflow-hidden ${st.bg} ${
                    isFullscreen ? 'p-12 sm:p-16' : 'p-6 sm:p-10'
                  }`}
                >
                  {/* Background Ambient Glow */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top Slide Header Bar */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={currentSlide.badge || ''}
                        onChange={(e) => handleUpdateCurrentSlide('badge', e.target.value)}
                        placeholder="Tag / Badge"
                        className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs outline-none ${st.badgeBg} ${st.badgeText}`}
                      />
                    </div>

                    {/* Metric Tag */}
                    <div className="flex items-baseline gap-2 bg-black/20 backdrop-blur-xs px-3.5 py-1.5 rounded-2xl border border-white/10">
                      <input
                        type="text"
                        value={currentSlide.metric?.value || ''}
                        onChange={(e) =>
                          handleUpdateCurrentSlide('metric', {
                            ...(currentSlide.metric || { label: 'Meta' }),
                            value: e.target.value,
                          })
                        }
                        placeholder="100%"
                        className={`text-xl font-extrabold font-mono w-20 text-right bg-transparent outline-none ${st.metricColor}`}
                      />
                      <input
                        type="text"
                        value={currentSlide.metric?.label || ''}
                        onChange={(e) =>
                          handleUpdateCurrentSlide('metric', {
                            ...(currentSlide.metric || { value: '100%' }),
                            label: e.target.value,
                          })
                        }
                        placeholder="Legenda"
                        className="text-[11px] text-slate-300 font-medium bg-transparent outline-none w-28"
                      />
                    </div>
                  </div>

                  {/* Slide Main Content: Either Actual Board Elements (1:1) OR Motion Cards */}
                  <div className="my-auto z-10 py-2 w-full flex-1 flex flex-col justify-center overflow-hidden">
                    {/* Editable Title */}
                    <textarea
                      value={currentSlide.title}
                      onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
                      rows={1}
                      className={`w-full text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-2 bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/40 outline-none resize-none overflow-hidden ${st.titleColor}`}
                      placeholder="Título do Slide..."
                    />

                    {/* Editable Subtitle */}
                    <textarea
                      value={currentSlide.subtitle}
                      onChange={(e) => handleUpdateCurrentSlide('subtitle', e.target.value)}
                      rows={1}
                      className={`w-full text-xs sm:text-sm lg:text-base leading-relaxed max-w-3xl mb-4 bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/40 outline-none resize-none overflow-hidden ${st.subtitleColor}`}
                      placeholder="Subtítulo ou mensagem chave do slide..."
                    />

                    {/* View Mode 1: ACTUAL WHITEBOARD ELEMENTS (Quadro Fiel 1:1) */}
                    {viewMode === 'board-fidelity' && currentSlide.boardElements && currentSlide.boardElements.length > 0 ? (
                      <div className="w-full flex-1 relative bg-black/20 rounded-2xl border border-white/10 p-4 overflow-hidden flex items-center justify-center">
                        <div
                          className="relative"
                          style={{
                            width: `${boardBounds.width}px`,
                            height: `${boardBounds.height}px`,
                            transform: `scale(${Math.min(
                              (isFullscreen ? 900 : 700) / boardBounds.width,
                              (isFullscreen ? 450 : 260) / boardBounds.height,
                              1
                            )})`,
                            transformOrigin: 'center center',
                          }}
                        >
                          {currentSlide.boardElements.map((el) => {
                            const relX = el.x - boardBounds.minX;
                            const relY = el.y - boardBounds.minY;

                            if (el.type === 'sticky') {
                              return (
                                <div
                                  key={el.id}
                                  style={{
                                    left: `${relX}px`,
                                    top: `${relY}px`,
                                    width: `${el.width}px`,
                                    height: `${el.height}px`,
                                    backgroundColor: el.style?.backgroundColor || '#fef08a',
                                  }}
                                  className="absolute p-3 rounded-xl shadow-md text-slate-900 text-xs font-semibold overflow-hidden border border-black/10 flex flex-col justify-between"
                                >
                                  <span className="line-clamp-4 leading-relaxed">{el.content}</span>
                                  <span className="text-[10px] text-slate-600 font-mono">📌 Post-it</span>
                                </div>
                              );
                            }

                            if (el.type === 'shape') {
                              return (
                                <div
                                  key={el.id}
                                  style={{
                                    left: `${relX}px`,
                                    top: `${relY}px`,
                                    width: `${el.width}px`,
                                    height: `${el.height}px`,
                                    backgroundColor: el.style?.backgroundColor || '#3b82f6',
                                    borderColor: el.style?.borderColor || '#2563eb',
                                    borderWidth: `${el.style?.borderWidth || 1}px`,
                                    color: el.style?.color || '#ffffff',
                                  }}
                                  className="absolute p-2 rounded-xl shadow-md text-xs font-bold flex items-center justify-center text-center overflow-hidden"
                                >
                                  <span className="line-clamp-3 leading-snug">{el.content}</span>
                                </div>
                              );
                            }

                            if (el.type === 'image') {
                              return (
                                <div
                                  key={el.id}
                                  style={{
                                    left: `${relX}px`,
                                    top: `${relY}px`,
                                    width: `${el.width}px`,
                                    height: `${el.height}px`,
                                  }}
                                  className="absolute rounded-xl overflow-hidden shadow-lg border border-white/20"
                                >
                                  <img
                                    src={el.style?.imageUrl || el.content}
                                    alt="Quadro Imagem"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              );
                            }

                            if (el.type === 'text') {
                              return (
                                <div
                                  key={el.id}
                                  style={{
                                    left: `${relX}px`,
                                    top: `${relY}px`,
                                    width: `${el.width}px`,
                                    height: `${el.height}px`,
                                    color: el.style?.color || '#ffffff',
                                    fontSize: `${el.style?.fontSize || 14}px`,
                                    fontWeight: el.style?.fontWeight || 'normal',
                                  }}
                                  className="absolute p-1 overflow-hidden"
                                >
                                  {el.content}
                                </div>
                              );
                            }

                            return null;
                          })}
                        </div>
                      </div>
                    ) : (
                      /* View Mode 2: MOTION PRESENTATION CARDS */
                      currentSlide.cards && currentSlide.cards.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          {currentSlide.cards.map((card, cIdx) => (
                            <motion.div
                              key={cIdx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * cIdx }}
                              className={`p-3.5 rounded-2xl border ${st.cardBg} ${st.cardBorder} flex flex-col justify-between`}
                            >
                              <div className="text-xl mb-1">{card.emoji || '📌'}</div>
                              <input
                                type="text"
                                value={card.title}
                                onChange={(e) => {
                                  const newCards = [...(currentSlide.cards || [])];
                                  newCards[cIdx].title = e.target.value;
                                  handleUpdateCurrentSlide('cards', newCards);
                                }}
                                className="font-bold text-xs sm:text-sm text-white mb-1 bg-transparent outline-none"
                              />
                              <textarea
                                value={card.desc}
                                onChange={(e) => {
                                  const newCards = [...(currentSlide.cards || [])];
                                  newCards[cIdx].desc = e.target.value;
                                  handleUpdateCurrentSlide('cards', newCards);
                                }}
                                rows={2}
                                className="text-[11px] text-slate-300 leading-snug bg-transparent outline-none resize-none"
                              />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        /* Bullet Points Cards */
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {currentSlide.points.map((pt, pIdx) => (
                            <motion.div
                              key={pIdx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.12 * pIdx }}
                              className={`p-3.5 rounded-2xl border ${st.cardBg} ${st.cardBorder} relative group`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${st.badgeBg} ${st.badgeText}`}
                                >
                                  {pIdx + 1}
                                </span>
                                <button
                                  onClick={() => handleRemovePoint(pIdx)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 rounded transition-opacity cursor-pointer"
                                  title="Excluir ponto"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <textarea
                                value={pt}
                                onChange={(e) => handleUpdatePoint(pIdx, e.target.value)}
                                rows={3}
                                className="w-full text-xs text-slate-200 leading-relaxed bg-transparent outline-none resize-none"
                                placeholder="Digite o texto deste tópico..."
                              />
                            </motion.div>
                          ))}

                          {currentSlide.points.length < 6 && (
                            <button
                              onClick={handleAddPoint}
                              className="p-3.5 rounded-2xl border border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center gap-1.5 text-slate-300 hover:text-white transition-all cursor-pointer bg-white/5 hover:bg-white/10"
                            >
                              <Plus className="w-4 h-4 text-purple-400" />
                              <span className="text-xs font-semibold">Adicionar Tópico</span>
                            </button>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  {/* Slide Bottom Bar */}
                  <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-300">Diorfy Presentation</span>
                      <span>•</span>
                      <span>{currentSlide.boardElements ? `${currentSlide.boardElements.length} elementos do quadro` : 'Slide Editável'}</span>
                    </div>
                    <span>
                      Slide {currentSlideIndex + 1} de {slides.length}
                    </span>
                  </div>

                  {/* Autoplay progress line */}
                  {isPlaying && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating Presenter Controls HUD */}
            <div
              className={`flex items-center gap-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-2 rounded-2xl shadow-2xl text-white select-none z-50 ${
                isFullscreen
                  ? 'fixed bottom-6 left-1/2 -translate-x-1/2 opacity-30 hover:opacity-100 transition-opacity'
                  : 'mt-3'
              }`}
            >
              <button
                onClick={() => {
                  playSound.click();
                  setIsPlaying(!isPlaying);
                }}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isPlaying ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-200'
                }`}
                title={isPlaying ? 'Pausar' : 'Reprodução Automática'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={goToPrev}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-200 transition-colors cursor-pointer"
                title="Slide Anterior (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs font-bold px-1 text-slate-200">
                {currentSlideIndex + 1} / {slides.length}
              </span>

              <button
                onClick={goToNext}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-200 transition-colors cursor-pointer"
                title="Próximo Slide (→ / Espaço)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                onClick={() => setLaserPointer(!laserPointer)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  laserPointer ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' : 'hover:bg-slate-800 text-slate-300'
                }`}
                title="Apontador Laser"
              >
                <Zap className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  showSpeakerNotes ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                }`}
                title="Notas do Orador"
              >
                <BookOpen className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 transition-colors cursor-pointer"
                title={isFullscreen ? 'Sair de Tela Cheia' : 'Tela Cheia'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Right Complete Editor Panel */}
          {isEditorOpen && !isFullscreen && (
            <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 select-none animate-in slide-in-from-right duration-200">
              {/* Editor Tabs Header */}
              <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  Editor Completo
                </span>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subtabs */}
              <div className="flex border-b border-slate-800 bg-slate-950/60 p-1 text-[11px] font-bold">
                <button
                  onClick={() => setEditorTab('content')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    editorTab === 'content' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Texto
                </button>
                <button
                  onClick={() => setEditorTab('design')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    editorTab === 'design' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Temas
                </button>
                <button
                  onClick={() => setEditorTab('layout')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    editorTab === 'layout' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Layout
                </button>
                <button
                  onClick={() => setEditorTab('notes')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    editorTab === 'notes' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Notas
                </button>
              </div>

              {/* Editor Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300">
                {/* 1. CONTENT TAB */}
                {editorTab === 'content' && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Título do Slide</label>
                      <input
                        type="text"
                        value={currentSlide.title}
                        onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtítulo</label>
                      <textarea
                        value={currentSlide.subtitle}
                        onChange={(e) => handleUpdateCurrentSlide('subtitle', e.target.value)}
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-purple-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Badge / Tag Superior</label>
                      <input
                        type="text"
                        value={currentSlide.badge || ''}
                        onChange={(e) => handleUpdateCurrentSlide('badge', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Metric value and label */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Valor Métrica</label>
                        <input
                          type="text"
                          value={currentSlide.metric?.value || ''}
                          onChange={(e) =>
                            handleUpdateCurrentSlide('metric', {
                              ...(currentSlide.metric || { label: 'Meta' }),
                              value: e.target.value,
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white outline-none focus:border-purple-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Legenda Métrica</label>
                        <input
                          type="text"
                          value={currentSlide.metric?.label || ''}
                          onChange={(e) =>
                            handleUpdateCurrentSlide('metric', {
                              ...(currentSlide.metric || { value: '100%' }),
                              label: e.target.value,
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    {/* Cards / Points list */}
                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-400">Cartões / Post-its do Slide</span>
                        <button
                          onClick={handleAddCard}
                          className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold"
                        >
                          + Novo Card
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(currentSlide.cards || []).map((card, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                value={card.title}
                                onChange={(e) => {
                                  const newCards = [...(currentSlide.cards || [])];
                                  newCards[idx].title = e.target.value;
                                  handleUpdateCurrentSlide('cards', newCards);
                                }}
                                className="font-bold text-white bg-transparent outline-none text-xs flex-1"
                              />
                              <button
                                onClick={() => handleRemoveCard(idx)}
                                className="text-slate-400 hover:text-rose-400 p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <textarea
                              value={card.desc}
                              onChange={(e) => {
                                const newCards = [...(currentSlide.cards || [])];
                                newCards[idx].desc = e.target.value;
                                handleUpdateCurrentSlide('cards', newCards);
                              }}
                              rows={2}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[11px] text-slate-300 outline-none resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. DESIGN & THEMES TAB */}
                {editorTab === 'design' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-2">Tema Visual</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            { id: 'dark', label: 'Dark Luxury', color: 'bg-slate-950 border-slate-700' },
                            { id: 'purple', label: 'Royal Purple', color: 'bg-purple-950 border-purple-700' },
                            { id: 'cyber', label: 'Cyberpunk Blue', color: 'bg-[#060814] border-cyan-500' },
                            { id: 'emerald', label: 'Emerald Tech', color: 'bg-emerald-950 border-emerald-700' },
                            { id: 'sunset', label: 'Sunset Glow', color: 'bg-orange-950 border-orange-700' },
                            { id: 'ocean', label: 'Ocean Deep', color: 'bg-blue-950 border-blue-700' },
                            { id: 'minimal', label: 'Minimalist Light', color: 'bg-white text-slate-900 border-slate-300' },
                          ] as { id: SlideTheme; label: string; color: string }[]
                        ).map((thm) => (
                          <button
                            key={thm.id}
                            onClick={() => handleUpdateCurrentSlide('theme', thm.id)}
                            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              thm.color
                            } ${
                              currentSlide.theme === thm.id
                                ? 'ring-2 ring-purple-400 shadow-md font-bold'
                                : 'opacity-80 hover:opacity-100'
                            }`}
                          >
                            <span className="text-xs">{thm.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-2">
                        Efeito de Transição (Motion)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            { id: 'slide', label: 'Slide Horizontal' },
                            { id: 'zoom', label: 'Zoom 3D' },
                            { id: 'spring', label: 'Spring Suave' },
                            { id: 'flip', label: 'Flip 3D' },
                            { id: 'fade', label: 'Fade Suave' },
                          ] as { id: SlideTransition; label: string }[]
                        ).map((tr) => (
                          <button
                            key={tr.id}
                            onClick={() => handleUpdateCurrentSlide('transition', tr.id)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                              currentSlide.transition === tr.id
                                ? 'bg-purple-600 border-purple-400 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            {tr.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. LAYOUT TAB */}
                {editorTab === 'layout' && (
                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-slate-400">Layout do Slide</label>
                    <div className="space-y-2">
                      {(
                        [
                          {
                            id: 'board-view',
                            label: 'Quadro Fiel 1:1',
                            desc: 'Renderiza todos os elementos reais do whiteboard',
                          },
                          {
                            id: 'cards',
                            label: 'Grade de Cartões',
                            desc: 'Distribui post-its e tópicos em colunas elegantes',
                          },
                          {
                            id: 'hero',
                            label: 'Destaque Hero',
                            desc: 'Foco total em título e narrativa executiva',
                          },
                          {
                            id: 'metric',
                            label: 'Foco em Métricas',
                            desc: 'Destaque para números, KPIs e metas',
                          },
                        ] as { id: SlideLayout; label: string; desc: string }[]
                      ).map((ly) => (
                        <button
                          key={ly.id}
                          onClick={() => {
                            handleUpdateCurrentSlide('layout', ly.id);
                            if (ly.id === 'board-view') setViewMode('board-fidelity');
                            else setViewMode('presentation');
                          }}
                          className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            currentSlide.layout === ly.id
                              ? 'bg-purple-950/60 border-purple-500 text-white ring-1 ring-purple-500'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-xs">{ly.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{ly.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. SPEAKER NOTES TAB */}
                {editorTab === 'notes' && (
                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-slate-400">
                      Notas do Orador (Apenas para você)
                    </label>
                    <textarea
                      value={currentSlide.notes || ''}
                      onChange={(e) => handleUpdateCurrentSlide('notes', e.target.value)}
                      rows={8}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed outline-none focus:border-purple-500 resize-none"
                      placeholder="Escreva dicas, roteiro e pontos chaves para falar durante este slide..."
                    />
                  </div>
                )}
              </div>

              {/* Bottom Quick Action */}
              <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                <button
                  onClick={handleSyncFromBoard}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center mr-2"
                >
                  Resetar c/ Quadro
                </button>
                <button
                  onClick={handleExportToBoard}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer text-center"
                >
                  Salvar no Quadro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
