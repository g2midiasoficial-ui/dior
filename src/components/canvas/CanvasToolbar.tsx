import React, { useState } from 'react';
import {
  Sparkles,
  MousePointer,
  Hand,
  LayoutGrid,
  Layout,
  Square,
  StickyNote,
  Type,
  ArrowUpRight,
  PenTool,
  Frame,
  Smile,
  MessageSquare,
  Plus,
  Check,
  X,
  Undo2,
  Redo2,
  Circle,
  Diamond,
  Triangle,
  Star,
  Cylinder,
  Cloud,
  MessageCircle,
  Highlighter,
  Eraser,
  Network,
  Image as ImageIcon,
  Bot,
  Film,
  Zap,
  Hexagon,
  Shield,
  Heart,
  FileText,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Layers,
  Box,
  Tag,
  Settings,
  Award,
  ChevronRight,
  Database,
  PlusCircle,
  Smartphone,
  GitFork,
  Table as TableIcon,
  Clock,
  Kanban as KanbanIcon,
  Presentation,
  Target,
  Video,
  Upload,
} from 'lucide-react';
import { ShapeType } from '../../types/miro';
import { useTranslation } from '../../i18n/I18nContext';
import { MiroModelType } from '../../utils/miroCreationTemplates';
import { FunnelWireframesDrawer } from './FunnelWireframesDrawer';

export type CanvasTool =
  | 'select'
  | 'pan'
  | 'sticky'
  | 'shape'
  | 'text'
  | 'connector'
  | 'pen'
  | 'highlighter'
  | 'eraser'
  | 'frame'
  | 'comment'
  | 'mindmap'
  | 'image';

interface CanvasToolbarProps {
  activeTool: CanvasTool;
  onSelectTool: (tool: CanvasTool) => void;
  onOpenAI: () => void;
  onOpenNanoBanana?: () => void;
  onOpenAiAgent?: () => void;
  onOpenSlideMotion?: () => void;
  onOpenMindmapStudio?: () => void;
  onOpenTemplates: () => void;
  onInsertMiroModel?: (type: MiroModelType) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onAddStickyWithColor: (color: string) => void;
  onAddShapeWithType: (type: ShapeType) => void;
  onAddStickerEmoji: (emoji: string) => void;
  onAddImage?: (url: string, title?: string) => void;
  onAddMindmapRootNode?: () => void;
  connectorConfig?: {
    connectorType: 'curved' | 'straight' | 'orthogonal';
    color: string;
    strokeWidth: number;
    borderStyle: 'solid' | 'dashed' | 'dotted';
    arrowEnd: 'arrow' | 'dot' | 'none';
    arrowStart: 'arrow' | 'dot' | 'none';
  };
  onUpdateConnectorConfig?: (updates: Partial<{
    connectorType: 'curved' | 'straight' | 'orthogonal';
    color: string;
    strokeWidth: number;
    borderStyle: 'solid' | 'dashed' | 'dotted';
    arrowEnd: 'arrow' | 'dot' | 'none';
    arrowStart: 'arrow' | 'dot' | 'none';
  }>) => void;
  onAddConnector?: (
    type: 'curved' | 'straight' | 'orthogonal',
    color: string,
    strokeWidth: number,
    borderStyle: string,
    arrowEnd: string,
    arrowStart: string
  ) => void;
  onInsertFunnelPage?: (
    funnelPageType: string,
    title: string,
    ctaText?: string,
    customSvg?: string
  ) => void;
  onInsertTrafficSource?: (
    trafficType: string,
    title: string,
    badge: string,
    color: string
  ) => void;
  onInsertAction?: (actionType: string, title: string, metric?: string) => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  activeTool,
  onSelectTool,
  onOpenAI,
  onOpenNanoBanana,
  onOpenAiAgent,
  onOpenSlideMotion,
  onOpenMindmapStudio,
  onOpenTemplates,
  onInsertMiroModel,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onAddStickyWithColor,
  onAddShapeWithType,
  onAddStickerEmoji,
  onAddImage,
  onAddMindmapRootNode,
  connectorConfig,
  onUpdateConnectorConfig,
  onAddConnector,
  onInsertFunnelPage,
  onInsertTrafficSource,
  onInsertAction,
}) => {
  const { t } = useTranslation();
  const [showStickyPalette, setShowStickyPalette] = useState(false);
  const [showShapePalette, setShowShapePalette] = useState(false);
  const [showPenPalette, setShowPenPalette] = useState(false);
  const [showStickerPalette, setShowStickerPalette] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showMiroModelsMenu, setShowMiroModelsMenu] = useState(false);
  const [showFunnelDrawer, setShowFunnelDrawer] = useState(false);
  const [showArrowPalette, setShowArrowPalette] = useState(false);
  const [arrowType, setArrowType] = useState<'curved' | 'straight' | 'orthogonal'>('curved');
  const [arrowColor, setArrowColor] = useState('#3b82f6');
  const [arrowWidth, setArrowWidth] = useState(2.5);
  const [arrowBorder, setArrowBorder] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [arrowEnd, setArrowEnd] = useState<'arrow' | 'dot' | 'none'>('arrow');
  const [arrowStart, setArrowStart] = useState<'arrow' | 'dot' | 'none'>('none');
  const [arrowCustomHex, setArrowCustomHex] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [shapeTab, setShapeTab] = useState<'basic' | 'polygon' | 'arrows' | 'symbols'>('basic');

  const activeArrowType = connectorConfig?.connectorType || arrowType;
  const activeArrowColor = connectorConfig?.color || arrowColor;
  const activeArrowWidth = connectorConfig?.strokeWidth || arrowWidth;
  const activeArrowBorder = connectorConfig?.borderStyle || arrowBorder;
  const activeArrowEnd = connectorConfig?.arrowEnd || arrowEnd;
  const activeArrowStart = connectorConfig?.arrowStart || arrowStart;

  const updateArrowSetting = (updates: Partial<{
    connectorType: 'curved' | 'straight' | 'orthogonal';
    color: string;
    strokeWidth: number;
    borderStyle: 'solid' | 'dashed' | 'dotted';
    arrowEnd: 'arrow' | 'dot' | 'none';
    arrowStart: 'arrow' | 'dot' | 'none';
  }>) => {
    if (updates.connectorType) setArrowType(updates.connectorType);
    if (updates.color) setArrowColor(updates.color);
    if (updates.strokeWidth) setArrowWidth(updates.strokeWidth);
    if (updates.borderStyle) setArrowBorder(updates.borderStyle);
    if (updates.arrowEnd !== undefined) setArrowEnd(updates.arrowEnd);
    if (updates.arrowStart !== undefined) setArrowStart(updates.arrowStart);
    if (onUpdateConnectorConfig) {
      onUpdateConnectorConfig(updates);
    }
  };

  const stickyColors = [
    { name: 'Amarelo', bg: '#fef08a', border: '#eab308' },
    { name: 'Verde', bg: '#bbf7d0', border: '#22c55e' },
    { name: 'Azul', bg: '#bae6fd', border: '#0284c7' },
    { name: 'Rosa', bg: '#fbcfe8', border: '#db2777' },
    { name: 'Laranja', bg: '#fed7aa', border: '#ea580c' },
    { name: 'Roxo', bg: '#e9d5ff', border: '#9333ea' },
    { name: 'Cinza', bg: '#e2e8f0', border: '#64748b' },
    { name: 'Ciano', bg: '#a5f3fc', border: '#0891b2' },
  ];

  // 9 Miro Native Creation Models (excluding "Fluxos" as requested)
  const miroModels: {
    type: MiroModelType;
    label: string;
    icon: React.ReactNode;
    color: string;
    badge?: string;
  }[] = [
    {
      type: 'prototype',
      label: 'Protótipo',
      icon: <Smartphone className="w-4 h-4 text-purple-600" />,
      color: 'text-purple-600',
      badge: '⬆',
    },
    {
      type: 'diagram',
      label: 'Diagrama',
      icon: <GitFork className="w-4 h-4 text-orange-500" />,
      color: 'text-orange-500',
    },
    {
      type: 'table',
      label: 'Tabelas',
      icon: <TableIcon className="w-4 h-4 text-emerald-600" />,
      color: 'text-emerald-600',
    },
    {
      type: 'timeline',
      label: 'Timeline',
      icon: <Clock className="w-4 h-4 text-teal-600" />,
      color: 'text-teal-600',
    },
    {
      type: 'kanban',
      label: 'Kanban',
      icon: <KanbanIcon className="w-4 h-4 text-emerald-500" />,
      color: 'text-emerald-500',
    },
    {
      type: 'document',
      label: 'Documento',
      icon: <FileText className="w-4 h-4 text-sky-600" />,
      color: 'text-sky-600',
    },
    {
      type: 'slides',
      label: 'Slides',
      icon: <Presentation className="w-4 h-4 text-rose-500" />,
      color: 'text-rose-500',
    },
    {
      type: 'engage',
      label: 'Atividades do Engage',
      icon: <Target className="w-4 h-4 text-red-500" />,
      color: 'text-red-500',
    },
    {
      type: 'talktrack',
      label: 'Talktrack',
      icon: <Video className="w-4 h-4 text-cyan-600" />,
      color: 'text-cyan-600',
    },
  ];

  // 30+ Geometric Shapes Organized in 4 Categories
  const basicShapes: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
    { id: 'rectangle', label: 'Retângulo', icon: <Square className="w-4 h-4" /> },
    { id: 'rounded', label: 'Retângulo Arredondado', icon: <Square className="w-4 h-4 rounded-md" /> },
    { id: 'circle', label: 'Círculo', icon: <Circle className="w-4 h-4" /> },
    { id: 'pill', label: 'Pílula / Cápsula', icon: <div className="w-4 h-2.5 rounded-full border border-current" /> },
    { id: 'diamond', label: 'Losango / Decisão', icon: <Diamond className="w-4 h-4" /> },
    { id: 'triangle', label: 'Triângulo', icon: <Triangle className="w-4 h-4" /> },
    { id: 'pentagon', label: 'Pentágono', icon: <div className="w-4 h-4 border border-current [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)] bg-current/20" /> },
  ];

  const polygonShapes: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
    { id: 'hexagon', label: 'Hexágono', icon: <Hexagon className="w-4 h-4" /> },
    { id: 'octagon', label: 'Octógono', icon: <div className="w-4 h-4 border border-current rotate-45" /> },
    { id: 'cube', label: 'Cubo 3D / Bloco', icon: <Box className="w-4 h-4" /> },
    { id: 'database', label: 'Banco de Dados', icon: <Database className="w-4 h-4" /> },
    { id: 'cylinder', label: 'Cilindro / Armazém', icon: <Cylinder className="w-4 h-4" /> },
    { id: 'document', label: 'Documento', icon: <FileText className="w-4 h-4" /> },
    { id: 'cross', label: 'Cruz / Plus', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'parallelogram', label: 'Paralelogramo', icon: <div className="w-4 h-3.5 border border-current skew-x-12" /> },
    { id: 'trapezoid', label: 'Trapézio', icon: <div className="w-4 h-3.5 border border-current [clip-path:polygon(20%_0%,80%_0%,100%_100%,0%_100%)] bg-current/20" /> },
  ];

  const arrowShapes: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
    { id: 'arrow-right', label: 'Seta Direita', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'arrow-left', label: 'Seta Esquerda', icon: <ArrowLeft className="w-4 h-4" /> },
    { id: 'arrow-up', label: 'Seta Cima', icon: <ArrowUp className="w-4 h-4" /> },
    { id: 'arrow-down', label: 'Seta Baixo', icon: <ArrowDown className="w-4 h-4" /> },
    { id: 'step-chevron', label: 'Chevron de Etapa', icon: <ChevronRight className="w-4 h-4" /> },
    { id: 'bracket-left', label: 'Chave Esquerda {', icon: <span className="font-bold font-mono text-sm">{'{'}</span> },
    { id: 'bracket-right', label: 'Chave Direita }', icon: <span className="font-bold font-mono text-sm">{'}'}</span> },
  ];

  const symbolShapes: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
    { id: 'star', label: 'Estrela', icon: <Star className="w-4 h-4" /> },
    { id: 'shield', label: 'Escudo / Segurança', icon: <Shield className="w-4 h-4" /> },
    { id: 'heart', label: 'Coração / Valor', icon: <Heart className="w-4 h-4" /> },
    { id: 'lightning', label: 'Raio / Energia', icon: <Zap className="w-4 h-4" /> },
    { id: 'cloud', label: 'Nuvem / Cloud', icon: <Cloud className="w-4 h-4" /> },
    { id: 'speech', label: 'Balão de Fala', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'gear', label: 'Engrenagem / Processo', icon: <Settings className="w-4 h-4" /> },
    { id: 'tag', label: 'Tag / Etiqueta', icon: <Tag className="w-4 h-4" /> },
    { id: 'badge', label: 'Selo / Medalha', icon: <Award className="w-4 h-4" /> },
  ];

  const emojis = ['👍', '❤️', '🚀', '🔥', '💡', '🎉', '⭐', '👏', '👀', '💯'];

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customImageUrl.trim() && onAddImage) {
      onAddImage(customImageUrl.trim(), 'Imagem importada');
      setCustomImageUrl('');
      setShowImageDialog(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAddImage) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onAddImage(reader.result as string, file.name);
          setShowImageDialog(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute left-4 top-18 bottom-6 z-20 flex flex-col items-center justify-between py-1 pointer-events-auto select-none">
      {/* Main Drawing & Canvas Tools Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 flex flex-col gap-1 shrink-0">
        {/* Select (V) */}
        <button
          onClick={() => {
            onSelectTool('select');
            setShowMiroModelsMenu(false);
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'select'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Selecionar / Mover Elementos (V)"
        >
          <MousePointer className="w-4 h-4" />
        </button>

        {/* Miro Creation Models Menu Trigger (Exact replica from Miro UI) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowMiroModelsMenu(!showMiroModelsMenu);
              setShowStickyPalette(false);
              setShowShapePalette(false);
              setShowPenPalette(false);
              setShowStickerPalette(false);
              setShowImageDialog(false);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              showMiroModelsMenu
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
            title="Modelos de Criação Miro (Protótipo, Diagrama, Tabelas, Kanban, Slides, etc.)"
          >
            <div className="flex flex-col items-center justify-center gap-0.5">
              <LayoutGrid className="w-4 h-4" />
            </div>
          </button>

          {/* Miro Creation Models Flyout Popover */}
          {showMiroModelsMenu && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-1.5 z-50 w-56 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex flex-col gap-0.5">
                {miroModels.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => {
                      if (onInsertMiroModel) {
                        onInsertMiroModel(item.type);
                      }
                      setShowMiroModelsMenu(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-800 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="shrink-0 transition-transform group-hover:scale-115">
                        {item.icon}
                      </span>
                      <span className="font-medium text-[13px] text-slate-800 group-hover:text-blue-600">
                        {item.label}
                      </span>
                    </div>
                    {item.badge && (
                      <span className="w-4 h-4 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pan / Hand Tool (H / Espaço) */}
        <button
          onClick={() => {
            onSelectTool('pan');
            setShowMiroModelsMenu(false);
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'pan'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Mãozinha de Pan / Mover Tela Livremente (H ou segurar Espaço)"
        >
          <Hand className="w-4 h-4" />
        </button>

        <div className="h-px w-6 bg-slate-200 mx-auto my-0.5" />

        {/* Sticky Note Tool (N) */}
        <div className="relative">
          <button
            onClick={() => {
              onSelectTool('sticky');
              setShowStickyPalette(!showStickyPalette);
              setShowMiroModelsMenu(false);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              activeTool === 'sticky'
                ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Nota Adesiva / Post-it (N)"
          >
            <StickyNote className="w-4 h-4 text-amber-600" />
          </button>

          {showStickyPalette && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 grid grid-cols-4 gap-2 w-40 animate-in fade-in">
              <div className="col-span-4 text-[11px] font-bold text-slate-700 pb-1 border-b border-slate-100 mb-1">
                Cor do Post-it
              </div>
              {stickyColors.map((col) => (
                <button
                  key={col.name}
                  onClick={() => {
                    onAddStickyWithColor(col.bg);
                    setShowStickyPalette(false);
                  }}
                  className="w-7 h-7 rounded-lg border shadow-xs hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  style={{ backgroundColor: col.bg, borderColor: col.border }}
                  title={col.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Shapes Tool (S) - 30+ Shapes with Category Tabs */}
        <div className="relative">
          <button
            onClick={() => {
              onSelectTool('shape');
              setShowShapePalette(!showShapePalette);
              setShowMiroModelsMenu(false);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              activeTool === 'shape'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Formas Geométricas & Diagramas (S)"
          >
            <Square className="w-4 h-4" />
          </button>

          {showShapePalette && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 w-76 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="font-bold text-slate-900">Formas & Símbolos</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-mono font-bold">
                  30+ formas
                </span>
              </div>

              {/* Shape Tabs */}
              <div className="flex gap-1 mb-2 bg-slate-100 p-0.5 rounded-xl text-[10px] font-bold">
                <button
                  onClick={() => setShapeTab('basic')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    shapeTab === 'basic' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Básicas
                </button>
                <button
                  onClick={() => setShapeTab('polygon')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    shapeTab === 'polygon' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Diagrama
                </button>
                <button
                  onClick={() => setShapeTab('arrows')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    shapeTab === 'arrows' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Setas
                </button>
                <button
                  onClick={() => setShapeTab('symbols')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    shapeTab === 'symbols' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Símbolos
                </button>
              </div>

              {/* Shape Items Grid */}
              <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
                {(shapeTab === 'basic'
                  ? basicShapes
                  : shapeTab === 'polygon'
                  ? polygonShapes
                  : shapeTab === 'arrows'
                  ? arrowShapes
                  : symbolShapes
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onAddShapeWithType(s.id);
                      setShowShapePalette(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-blue-50 text-xs text-slate-700 hover:text-blue-700 text-left transition-colors cursor-pointer group"
                  >
                    <span className="text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                      {s.icon}
                    </span>
                    <span className="truncate text-[11px] font-semibold">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mindmap Quick Tool (M) */}
        <button
          onClick={() => {
            if (onAddMindmapRootNode) onAddMindmapRootNode();
            else if (onOpenMindmapStudio) onOpenMindmapStudio();
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'mindmap'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Criar Nó de Mapa Mental (M)"
        >
          <Network className="w-4 h-4 text-cyan-600" />
        </button>

        {/* Line / Connector Tool (L) - Acima de T com opções completas de tipo, tamanho e cor */}
        <div className="relative">
          <button
            onClick={() => {
              onSelectTool('connector');
              setShowArrowPalette(!showArrowPalette);
              setShowStickyPalette(false);
              setShowShapePalette(false);
              setShowPenPalette(false);
              setShowStickerPalette(false);
              setShowImageDialog(false);
              setShowMiroModelsMenu(false);
              setShowFunnelDrawer(false);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              activeTool === 'connector' || showArrowPalette
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Linha / Seta de Conexão (L) - Opções de Tipo, Tamanho e Cor"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* Arrow Options Popover Drawer (Direto na ferramenta acima de T) */}
          {showArrowPalette && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 z-50 w-72 space-y-4 animate-in fade-in select-none text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <ArrowUpRight className="w-4 h-4 text-blue-600" />
                  <span>Opções de Seta</span>
                </div>
                <button
                  onClick={() => setShowArrowPalette(false)}
                  className="text-slate-400 hover:text-slate-700 p-0.5 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. TIPO DE SETA (Curva, Reta, 90°) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Tipo de Traçado
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => updateArrowSetting({ connectorType: 'curved' })}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      activeArrowType === 'curved'
                        ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-2xs font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base leading-none">╭╮</span>
                    <span className="text-[10px]">Curva</span>
                  </button>

                  <button
                    onClick={() => updateArrowSetting({ connectorType: 'straight' })}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      activeArrowType === 'straight'
                        ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-2xs font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base leading-none">──➔</span>
                    <span className="text-[10px]">Reta</span>
                  </button>

                  <button
                    onClick={() => updateArrowSetting({ connectorType: 'orthogonal' })}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                      activeArrowType === 'orthogonal'
                        ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-2xs font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base leading-none">┌─➔</span>
                    <span className="text-[10px]">90°</span>
                  </button>
                </div>
              </div>

              {/* 2. TAMANHO / ESPESSURA DA SETA */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Tamanho / Espessura
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-600">{activeArrowWidth}px</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[1.5, 2.5, 4, 6, 9].map((w) => (
                    <button
                      key={w}
                      onClick={() => updateArrowSetting({ strokeWidth: w })}
                      className={`py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        activeArrowWidth === w
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. CORES DA SETA */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Cor da Seta
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { name: 'Azul', hex: '#3b82f6' },
                    { name: 'Verde', hex: '#22c55e' },
                    { name: 'Vermelho', hex: '#ef4444' },
                    { name: 'Roxo', hex: '#a855f7' },
                    { name: 'Laranja', hex: '#f97316' },
                    { name: 'Âmbar', hex: '#eab308' },
                    { name: 'Ciano', hex: '#06b6d4' },
                    { name: 'Rosa', hex: '#ec4899' },
                    { name: 'Preto', hex: '#0f172a' },
                    { name: 'Cinza', hex: '#64748b' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => updateArrowSetting({ color: c.hex })}
                      className="w-8 h-8 rounded-xl border border-black/10 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer shadow-2xs"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {activeArrowColor === c.hex && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. ESTILO DA LINHA & PONTA */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Traço
                  </label>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg">
                    {(['solid', 'dashed', 'dotted'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateArrowSetting({ borderStyle: st })}
                        className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          activeArrowBorder === st ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        {st === 'solid' ? '──' : st === 'dashed' ? '- -' : '··'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ponta
                  </label>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => updateArrowSetting({ arrowStart: 'none', arrowEnd: 'arrow' })}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        activeArrowEnd === 'arrow' && activeArrowStart === 'none' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                      title="Seta Simples"
                    >
                      ➔
                    </button>
                    <button
                      onClick={() => updateArrowSetting({ arrowStart: 'arrow', arrowEnd: 'arrow' })}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        activeArrowEnd === 'arrow' && activeArrowStart === 'arrow' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                      title="Seta Dupla"
                    >
                      ⇄
                    </button>
                    <button
                      onClick={() => updateArrowSetting({ arrowStart: 'none', arrowEnd: 'dot' })}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        activeArrowEnd === 'dot' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                      }`}
                      title="Ponto"
                    >
                      ●
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão de Inserir Seta Direto no Quadro */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <button
                  onClick={() => {
                    if (onAddConnector) {
                      onAddConnector(
                        activeArrowType,
                        activeArrowColor,
                        activeArrowWidth,
                        activeArrowBorder,
                        activeArrowEnd,
                        activeArrowStart
                      );
                    }
                    setShowArrowPalette(false);
                  }}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Inserir Seta no Quadro</span>
                </button>
                <p className="text-[10px] text-slate-500 text-center">
                  Ou clique em 2 elementos no quadro para ligar com esta seta!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Text Box Tool (T) */}
        <button
          onClick={() => onSelectTool('text')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'text'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Caixa de Texto (T)"
        >
          <Type className="w-4 h-4" />
        </button>

        {/* Páginas, Fontes & Ações de Funil (Wireframes / Funis - Abaixo de T) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFunnelDrawer(!showFunnelDrawer);
              setShowStickyPalette(false);
              setShowShapePalette(false);
              setShowPenPalette(false);
              setShowStickerPalette(false);
              setShowImageDialog(false);
              setShowMiroModelsMenu(false);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              showFunnelDrawer
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Páginas, Fontes de Tráfego & Ações de Funil (Wireframes)"
          >
            <Layout className={`w-4 h-4 ${showFunnelDrawer ? 'text-white' : 'text-blue-600 group-hover:text-blue-700'}`} />
          </button>

          {/* Funnel Wireframes Popover Drawer */}
          <FunnelWireframesDrawer
            isOpen={showFunnelDrawer}
            onClose={() => setShowFunnelDrawer(false)}
            onInsertFunnelPage={(funnelType, title, ctaText, customSvg) => {
              if (onInsertFunnelPage) {
                onInsertFunnelPage(funnelType, title, ctaText, customSvg);
              }
              setShowFunnelDrawer(false);
            }}
            onInsertTrafficSource={(trafficType, title, badge, color) => {
              if (onInsertTrafficSource) {
                onInsertTrafficSource(trafficType, title, badge, color);
              }
              setShowFunnelDrawer(false);
            }}
            onInsertAction={(actionType, title, metric) => {
              if (onInsertAction) {
                onInsertAction(actionType, title, metric);
              }
              setShowFunnelDrawer(false);
            }}
          />
        </div>

        {/* Pen / Highlighter Tool (P) */}
        <div className="relative">
          <button
            onClick={() => {
              onSelectTool('pen');
              setShowPenPalette(!showPenPalette);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              activeTool === 'pen' || activeTool === 'highlighter'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Caneta & Marcador Livre (P)"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {showPenPalette && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 flex flex-col gap-1 w-36 text-xs animate-in fade-in">
              <button
                onClick={() => {
                  onSelectTool('pen');
                  setShowPenPalette(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left font-semibold transition-colors cursor-pointer ${
                  activeTool === 'pen' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <PenTool className="w-4 h-4 text-blue-600" />
                <span>Caneta</span>
              </button>
              <button
                onClick={() => {
                  onSelectTool('highlighter');
                  setShowPenPalette(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left font-semibold transition-colors cursor-pointer ${
                  activeTool === 'highlighter' ? 'bg-yellow-50 text-yellow-700' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Highlighter className="w-4 h-4 text-yellow-500" />
                <span>Marcador</span>
              </button>
            </div>
          )}
        </div>

        {/* Frame / Quadro Tool (F) */}
        <button
          onClick={() => onSelectTool('frame')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
            activeTool === 'frame'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Frame / Seção de Slide (F)"
        >
          <Frame className="w-4 h-4" />
        </button>

        {/* Image Tool (Upload or Nano Banana / URL) */}
        <div className="relative">
          <button
            onClick={() => setShowImageDialog(!showImageDialog)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              showImageDialog
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Inserir Imagem (Upload, URL ou IA)"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {showImageDialog && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 w-72 text-xs animate-in fade-in">
              <h4 className="font-bold text-slate-900 mb-2">Adicionar Imagem</h4>

              {/* Nano Banana AI direct button */}
              {onOpenNanoBanana && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenNanoBanana();
                    setShowImageDialog(false);
                  }}
                  className="w-full py-2 mb-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <span>🍌 Gerar com Nano Banana IA</span>
                </button>
              )}

              {/* Upload Local File */}
              <label className="block w-full text-center py-2 px-3 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl font-semibold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span>Enviar do Computador</span>
              </label>

              {/* Paste URL */}
              <form onSubmit={handleImageSubmit} className="flex flex-col gap-2">
                <input
                  type="url"
                  placeholder="Ou cole a URL da imagem..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="w-full text-xs border border-slate-200 focus:border-blue-500 rounded-xl p-2 outline-none"
                />
                <button
                  type="submit"
                  disabled={!customImageUrl.trim()}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Inserir Imagem
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Sticker / Reaction Tool */}
        <div className="relative">
          <button
            onClick={() => setShowStickerPalette(!showStickerPalette)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors group relative cursor-pointer ${
              showStickerPalette
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Reações & Stickers Rápidos"
          >
            <Smile className="w-4 h-4" />
          </button>

          {showStickerPalette && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 grid grid-cols-5 gap-1.5 w-48 animate-in fade-in">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onAddStickerEmoji(emoji);
                    setShowStickerPalette(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-100 rounded-xl transition-transform hover:scale-125 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Undo / Redo Bottom Controls */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1 flex flex-col gap-0.5 shrink-0">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Desfazer (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Refazer (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
